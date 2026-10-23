import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import * as pdfjsLib from 'pdfjs-dist';

/**
 * Parses page range string (e.g., "1-3, 5, 7-10") into a sorted array of unique 1-based page numbers.
 */
export function parseRangeString(rangeStr, totalPages = Infinity) {
  if (!rangeStr || !rangeStr.trim()) {
    return { valid: false, pages: [], error: 'Please enter a page range' };
  }

  const parts = rangeStr.split(/[,;\s]+/).filter(Boolean);
  const pagesSet = new Set();
  const errors = [];

  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      const pageNum = parseInt(part, 10);
      if (pageNum < 1) {
        errors.push(`Page ${pageNum} is invalid (must be >= 1)`);
      } else if (totalPages !== Infinity && pageNum > totalPages) {
        errors.push(`Page ${pageNum} exceeds total pages (${totalPages})`);
      } else {
        pagesSet.add(pageNum);
      }
    } else if (/^(\d+)[-–—~](\d+)$/.test(part)) {
      const match = part.match(/^(\d+)[-–—~](\d+)$/);
      const start = parseInt(match[1], 10);
      const end = parseInt(match[2], 10);

      if (start < 1 || end < 1) {
        errors.push(`Invalid range ${part} (pages must be >= 1)`);
        continue;
      }

      const min = Math.min(start, end);
      const max = Math.max(start, end);

      if (totalPages !== Infinity && max > totalPages) {
        errors.push(`Range ${part} exceeds total pages (${totalPages})`);
        continue;
      }

      for (let p = min; p <= max; p++) {
        pagesSet.add(p);
      }
    } else {
      errors.push(`Invalid syntax "${part}"`);
    }
  }

  const sortedPages = Array.from(pagesSet).sort((a, b) => a - b);

  if (errors.length > 0) {
    return {
      valid: sortedPages.length > 0,
      pages: sortedPages,
      error: errors[0],
    };
  }

  if (sortedPages.length === 0) {
    return { valid: false, pages: [], error: 'No valid pages found' };
  }

  return { valid: true, pages: sortedPages, error: null };
}

/**
 * Converts a list of 1-based page numbers to a compact range string.
 */
export function pagesToRangeString(pages) {
  if (!pages || pages.length === 0) return '';
  const sorted = Array.from(new Set(pages)).sort((a, b) => a - b);
  const ranges = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i <= sorted.length; i++) {
    const curr = sorted[i];
    if (curr === prev + 1) {
      prev = curr;
    } else {
      if (start === prev) {
        ranges.push(`${start}`);
      } else {
        ranges.push(`${start}-${prev}`);
      }
      start = curr;
      prev = curr;
    }
  }

  return ranges.join(', ');
}

/**
 * 1. MERGE PDF: Combines multiple PDFs into a single unified document
 */
export async function mergePdfs(pdfBuffers) {
  const mergedPdf = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();
  return new Blob([mergedBytes], { type: 'application/pdf' });
}

/**
 * 2. SPLIT PDF: Single PDF extraction
 */
export async function extractPagesToSinglePdf(sourcePdfBuffer, selectedPages1Based) {
  const srcDoc = await PDFDocument.load(sourcePdfBuffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  const zeroBasedIndices = selectedPages1Based.map((p) => p - 1);
  const copiedPages = await newDoc.copyPages(srcDoc, zeroBasedIndices);

  copiedPages.forEach((page) => newDoc.addPage(page));

  const pdfBytes = await newDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * SPLIT PDF: Split pages into ZIP
 */
export async function splitPagesToZip(sourcePdfBuffer, selectedPages1Based, baseName = 'document') {
  const srcDoc = await PDFDocument.load(sourcePdfBuffer, { ignoreEncryption: true });
  const zip = new JSZip();

  for (const pageNum of selectedPages1Based) {
    const singleDoc = await PDFDocument.create();
    const [copiedPage] = await singleDoc.copyPages(srcDoc, [pageNum - 1]);
    singleDoc.addPage(copiedPage);

    const pdfBytes = await singleDoc.save();
    const pad = String(pageNum).padStart(3, '0');
    zip.file(`${baseName}_page_${pad}.pdf`, pdfBytes);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
}

/**
 * 3. PDF TO WORD (.docx): Extract textual structure and build editable Word file
 */
export async function convertPdfToWord(pdfBuffer, options = {}) {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const sectionsChildren = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items;

    if (!items || items.length === 0) {
      sectionsChildren.push(
        new Paragraph({
          children: [new TextRun({ text: `[Page ${pageNum} - No selectable text found]`, italics: true })],
        })
      );
    } else {
      // Group items into lines based on Y coordinate
      const lineMap = new Map();
      items.forEach((item) => {
        const text = item.str;
        if (!text && !text.trim()) return;
        const y = Math.round(item.transform[5] / 4) * 4; // slight tolerance grouping
        if (!lineMap.has(y)) {
          lineMap.set(y, []);
        }
        lineMap.get(y).push(item);
      });

      // Sort lines top to bottom (PDF Y coordinate is from bottom up)
      const sortedYs = Array.from(lineMap.keys()).sort((a, b) => b - a);

      sortedYs.forEach((y) => {
        const lineItems = lineMap.get(y).sort((a, b) => a.transform[4] - b.transform[4]);
        const lineText = lineItems.map((i) => i.str).join(' ').trim();

        if (lineText) {
          // Detect simple heading heuristic
          const isHeading = lineText.length < 60 && (lineItems[0]?.height > 14 || /^[A-Z0-9\s:.-]{4,}$/.test(lineText));
          sectionsChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: lineText,
                  bold: isHeading,
                  size: isHeading ? 28 : 22, // half-points: 14pt vs 11pt
                }),
              ],
              spacing: { after: isHeading ? 160 : 100 },
            })
          );
        }
      });
    }

    // Add page break if not the final page
    if (pageNum < numPages) {
      sectionsChildren.push(
        new Paragraph({
          children: [new TextRun({ text: '', break: 1 })],
          pageBreakBefore: true,
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sectionsChildren.length > 0 ? sectionsChildren : [
          new Paragraph({ children: [new TextRun('Converted document is empty.')] })
        ],
      },
    ],
  });

  const docxBlob = await Packer.toBlob(doc);
  return docxBlob;
}

/**
 * 4. ORGANIZE / REORDER PDF: Reorder, duplicate, delete and rotate pages
 */
export async function organizePdf(sourcePdfBuffer, pagesConfig) {
  // pagesConfig: array of { originalIndex, rotation }
  const srcDoc = await PDFDocument.load(sourcePdfBuffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  for (const item of pagesConfig) {
    const [copiedPage] = await newDoc.copyPages(srcDoc, [item.originalIndex]);
    if (item.rotation) {
      const currentRotation = copiedPage.getRotation().angle;
      copiedPage.setRotation(degrees((currentRotation + item.rotation) % 360));
    }
    newDoc.addPage(copiedPage);
  }

  const pdfBytes = await newDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * 5. ROTATE PDF: Rotates all or specific pages
 */
export async function rotatePdf(sourcePdfBuffer, rotationAngle = 90, selectedPages = null) {
  const pdfDoc = await PDFDocument.load(sourcePdfBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  pages.forEach((page, index) => {
    const pageNum = index + 1;
    if (!selectedPages || selectedPages.includes(pageNum)) {
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + rotationAngle) % 360));
    }
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * 6. PDF TO JPG / PNG IMAGES
 */
export async function pdfToImages(pdfBuffer, format = 'jpg', scale = 1.5, baseName = 'document') {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const zip = new JSZip();
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const ext = format === 'png' ? 'png' : 'jpg';

  let singleBlob = null;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, mimeType, 0.92));

    if (numPages === 1) {
      singleBlob = blob;
    } else {
      const pad = String(pageNum).padStart(3, '0');
      zip.file(`${baseName}_page_${pad}.${ext}`, blob);
    }
  }

  if (numPages === 1 && singleBlob) {
    return { blob: singleBlob, isZip: false, ext };
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return { blob: zipBlob, isZip: true, ext: 'zip' };
}

/**
 * 7. IMAGES TO PDF: Convert image list (JPG/PNG) into a single PDF
 */
export async function imagesToPdf(imageFiles, options = {}) {
  const { orientation = 'portrait', margin = 20 } = options;
  const pdfDoc = await PDFDocument.create();

  for (const file of imageFiles) {
    const buffer = await file.arrayBuffer();
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');

    let image;
    try {
      image = isPng ? await pdfDoc.embedPng(buffer) : await pdfDoc.embedJpg(buffer);
    } catch {
      // Fallback: try other format
      image = isPng ? await pdfDoc.embedJpg(buffer) : await pdfDoc.embedPng(buffer);
    }

    const imgWidth = image.width;
    const imgHeight = image.height;

    // Standard A4: 595.28 x 841.89
    let pageWidth = 595.28;
    let pageHeight = 841.89;

    if (orientation === 'landscape' || (orientation === 'auto' && imgWidth > imgHeight)) {
      pageWidth = 841.89;
      pageHeight = 595.28;
    }

    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    const scale = Math.min(usableWidth / imgWidth, usableHeight / imgHeight);
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;

    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(image, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * 8. ADD PAGE NUMBERS
 */
export async function addPageNumbersToPdf(pdfBuffer, options = {}) {
  const {
    position = 'bottom-center',
    format = 'page-of-total',
    startNumber = 1,
    fontSize = 10,
    margin = 30,
  } = options;

  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const totalPages = pdfDoc.getPageCount();

  const pages = pdfDoc.getPages();

  pages.forEach((page, index) => {
    const currentNum = index + startNumber;
    let text = `${currentNum}`;

    if (format === 'page-single') {
      text = `Page ${currentNum}`;
    } else if (format === 'page-of-total') {
      text = `Page ${currentNum} of ${totalPages}`;
    } else if (format === 'slash') {
      text = `${currentNum} / ${totalPages}`;
    }

    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);
    const { width, height } = page.getSize();

    let x = (width - textWidth) / 2;
    let y = margin;

    if (position.includes('left')) {
      x = margin;
    } else if (position.includes('right')) {
      x = width - margin - textWidth;
    }

    if (position.startsWith('top')) {
      y = height - margin - textHeight;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * 9. COMPRESS PDF: Real client-side page downsampling and JPEG re-encoding engine
 */
export async function compressPdf(pdfBuffer, level = 'recommended', onProgress = null) {
  const originalSize = pdfBuffer.byteLength;

  // Profile-based resolution scale and JPEG compression factor
  let scale = 1.25;
  let quality = 0.65;
  if (level === 'extreme') {
    scale = 1.0;
    quality = 0.45;
  } else if (level === 'less') {
    scale = 1.6;
    quality = 0.80;
  }

  // Load PDF with PDF.js for rendering
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  // Load original PDF with pdf-lib to get original page dimensions
  const originalPdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const originalPages = originalPdfDoc.getPages();

  // Create new compressed PDF document
  const compressedPdfDoc = await PDFDocument.create();

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (onProgress) {
      onProgress({
        current: pageNum,
        total: numPages,
        percent: Math.round(((pageNum - 1) / numPages) * 100),
      });
    }

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext('2d');

    await page.render({ canvasContext: ctx, viewport }).promise;

    const jpegBlob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );
    const jpegBuffer = await jpegBlob.arrayBuffer();
    const embeddedImg = await compressedPdfDoc.embedJpg(jpegBuffer);

    // Get original page bounds
    const origPage = originalPages[pageNum - 1];
    const { width: origWidth, height: origHeight } = origPage.getSize();

    const newPage = compressedPdfDoc.addPage([origWidth, origHeight]);
    newPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: origWidth,
      height: origHeight,
    });
  }

  if (onProgress) {
    onProgress({ current: numPages, total: numPages, percent: 100 });
  }

  const compressedBytes = await compressedPdfDoc.save({ useObjectStreams: true });
  const compressedSize = compressedBytes.length;

  // If the original PDF was already a tiny pure-text document smaller than rasterized output:
  // Fall back to clean object-stream re-saving of original so we never inflate small files!
  let finalBlob;
  let finalSize;
  if (compressedSize >= originalSize) {
    const fallbackBytes = await originalPdfDoc.save({ useObjectStreams: true });
    finalBlob = new Blob([fallbackBytes], { type: 'application/pdf' });
    finalSize = fallbackBytes.length;
  } else {
    finalBlob = new Blob([compressedBytes], { type: 'application/pdf' });
    finalSize = compressedSize;
  }

  const savedBytes = Math.max(0, originalSize - finalSize);
  const savedPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

  return {
    blob: finalBlob,
    originalSize,
    compressedSize: finalSize,
    savedBytes,
    savedPercent,
    isAlreadyOptimized: finalSize >= originalSize * 0.98,
  };
}

/**
 * 10. EXTRACT TEXT
 */
export async function extractTextFromPdf(pdfBuffer) {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  let fullText = '';
  const pageTexts = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(' ');

    pageTexts.push({ pageNum, text: pageText });
    fullText += `--- Page ${pageNum} ---\n\n${pageText}\n\n`;
  }

  const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
  return { fullText, pageTexts, blob };
}

/**
 * Helper: Triggers cross-browser file download
 */
export function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Helper: Formats bytes to human-readable size
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
