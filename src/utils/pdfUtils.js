import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

/**
 * Parses page range string (e.g., "1-3, 5, 7-10") into a sorted array of unique 1-based page numbers.
 * @param {string} rangeStr 
 * @param {number} totalPages 
 * @returns {{ valid: boolean, pages: number[], error: string | null }}
 */
export function parseRangeString(rangeStr, totalPages = Infinity) {
  if (!rangeStr || !rangeStr.trim()) {
    return { valid: false, pages: [], error: 'Please enter a page range' };
  }

  const parts = rangeStr.split(/[,;\s]+/).filter(Boolean);
  const pagesSet = new Set();
  const errors = [];

  for (const part of parts) {
    // Single page (e.g. "4")
    if (/^\d+$/.test(part)) {
      const pageNum = parseInt(part, 10);
      if (pageNum < 1) {
        errors.push(`Page ${pageNum} is invalid (must be >= 1)`);
      } else if (totalPages !== Infinity && pageNum > totalPages) {
        errors.push(`Page ${pageNum} exceeds total pages (${totalPages})`);
      } else {
        pagesSet.add(pageNum);
      }
    } 
    // Range (e.g. "1-4" or "2..5")
    else if (/^(\d+)[-–—~](\d+)$/.test(part)) {
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
 * Example: [1, 2, 3, 5, 7, 8, 9] -> "1-3, 5, 7-9"
 * @param {number[]} pages 
 * @returns {string}
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
 * Splits a PDF by extracting selected pages into a single new PDF.
 * @param {ArrayBuffer} pdfBytes 
 * @param {number[]} selectedPages 1-based page numbers
 * @returns {Promise<Uint8Array>}
 */
export async function extractPagesToSinglePdf(pdfBytes, selectedPages) {
  const srcDoc = await PDFDocument.load(pdfBytes);
  const total = srcDoc.getPageCount();
  const subDoc = await PDFDocument.create();

  // Convert 1-based to 0-based indices
  const pageIndices = selectedPages
    .filter(p => p >= 1 && p <= total)
    .map(p => p - 1);

  if (pageIndices.length === 0) {
    throw new Error('No valid pages to extract.');
  }

  const copiedPages = await subDoc.copyPages(srcDoc, pageIndices);
  copiedPages.forEach(page => subDoc.addPage(page));

  const splitPdfBytes = await subDoc.save();
  return splitPdfBytes;
}

/**
 * Splits selected pages into individual PDF files packaged in a ZIP.
 * @param {ArrayBuffer} pdfBytes 
 * @param {number[]} selectedPages 1-based
 * @param {string} baseName 
 * @returns {Promise<Blob>}
 */
export async function splitPagesToZip(pdfBytes, selectedPages, baseName = 'document') {
  const srcDoc = await PDFDocument.load(pdfBytes);
  const total = srcDoc.getPageCount();
  const zip = new JSZip();

  const validPages = selectedPages.filter(p => p >= 1 && p <= total);
  if (validPages.length === 0) {
    throw new Error('No valid pages to split.');
  }

  for (const pageNum of validPages) {
    const singleDoc = await PDFDocument.create();
    const [copiedPage] = await singleDoc.copyPages(srcDoc, [pageNum - 1]);
    singleDoc.addPage(copiedPage);
    const bytes = await singleDoc.save();

    const padLength = Math.max(2, String(total).length);
    const paddedNum = String(pageNum).padStart(padLength, '0');
    zip.file(`${baseName}_page_${paddedNum}.pdf`, bytes);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
}

/**
 * Programmatically triggers a download for a Blob or Uint8Array.
 * @param {Blob | Uint8Array} data 
 * @param {string} filename 
 */
export function downloadFile(data, filename) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 300);
}

/**
 * Format bytes to readable string (e.g. "1.2 MB")
 */
export function formatBytes(bytes, decimals = 1) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
