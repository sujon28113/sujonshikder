import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Creates an elegant 6-page demonstration PDF.
 * @returns {Promise<{ buffer: ArrayBuffer, name: string, size: number, pageCount: number }>}
 */
export async function generateSamplePdf() {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pagesData = [
    {
      title: 'Project Roadmap 2026',
      subtitle: 'Executive Strategy & Product Milestones',
      color: rgb(0.39, 0.4, 0.95), // Indigo
      tags: ['Strategy', 'Architecture', 'Confidential'],
      badge: 'PAGE 01 • OVERVIEW',
    },
    {
      title: 'System Architecture',
      subtitle: 'Distributed Microservices & Zero-Trust Security',
      color: rgb(0.55, 0.35, 0.95), // Purple
      tags: ['Infrastructure', 'Security', 'Kubernetes'],
      badge: 'PAGE 02 • SYSTEM DESIGN',
    },
    {
      title: 'Financial Projections',
      subtitle: 'Q1-Q4 Operational Runway & Capital Allocation',
      color: rgb(0.1, 0.7, 0.5), // Emerald
      tags: ['Finance', 'Budgeting', 'KPIs'],
      badge: 'PAGE 03 • FINANCIALS',
    },
    {
      title: 'Design Guidelines',
      subtitle: 'Modern Minimalist Typography & Component Tokens',
      color: rgb(0.95, 0.4, 0.2), // Coral
      tags: ['Design System', 'UI/UX', 'Figma'],
      badge: 'PAGE 04 • DESIGN',
    },
    {
      title: 'Security Compliance',
      subtitle: 'SOC2 Type II, ISO 27001 & Data Encryption Standard',
      color: rgb(0.2, 0.6, 0.95), // Sky
      tags: ['Compliance', 'Audit', 'Governance'],
      badge: 'PAGE 05 • SECURITY',
    },
    {
      title: 'Appendix & References',
      subtitle: 'Glossary, Technical Indices and Citations',
      color: rgb(0.45, 0.55, 0.65), // Slate
      tags: ['Index', 'Bibliography', 'Notes'],
      badge: 'PAGE 06 • APPENDIX',
    },
  ];

  for (let i = 0; i < pagesData.length; i++) {
    const data = pagesData[i];
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions
    const { width, height } = page.getSize();

    // Top Header Banner
    page.drawRectangle({
      x: 0,
      y: height - 120,
      width: width,
      height: 120,
      color: data.color,
    });

    // Sub-banner badge
    page.drawText(data.badge, {
      x: 40,
      y: height - 50,
      size: 10,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    // Banner Title
    page.drawText(data.title, {
      x: 40,
      y: height - 85,
      size: 24,
      font: boldFont,
      color: rgb(1, 1, 1),
    });

    // Subtitle below header
    page.drawText(data.subtitle, {
      x: 40,
      y: height - 160,
      size: 13,
      font: font,
      color: rgb(0.3, 0.35, 0.45),
    });

    // Simulated content blocks
    for (let row = 0; row < 4; row++) {
      const yPos = height - 220 - row * 110;
      // Card background
      page.drawRectangle({
        x: 40,
        y: yPos,
        width: width - 80,
        height: 85,
        color: rgb(0.96, 0.97, 0.99),
        borderColor: rgb(0.88, 0.9, 0.94),
        borderWidth: 1,
      });

      // Card title bar
      page.drawRectangle({
        x: 55,
        y: yPos + 55,
        width: 140,
        height: 12,
        color: data.color,
      });

      // Card body lines
      page.drawRectangle({
        x: 55,
        y: yPos + 32,
        width: width - 120,
        height: 8,
        color: rgb(0.85, 0.87, 0.92),
      });

      page.drawRectangle({
        x: 55,
        y: yPos + 16,
        width: (width - 120) * 0.7,
        height: 8,
        color: rgb(0.88, 0.9, 0.94),
      });
    }

    // Footer
    page.drawLine({
      start: { x: 40, y: 50 },
      end: { x: width - 40, y: 50 },
      thickness: 1,
      color: rgb(0.85, 0.87, 0.9),
    });

    page.drawText(`SplitPDF Demo Document • Page ${i + 1} of ${pagesData.length}`, {
      x: 40,
      y: 32,
      size: 9,
      font: font,
      color: rgb(0.5, 0.55, 0.65),
    });

    page.drawText('Confidential & Proprietary', {
      x: width - 180,
      y: 32,
      size: 9,
      font: font,
      color: rgb(0.5, 0.55, 0.65),
    });
  }

  const pdfBytes = await pdfDoc.save();
  // Provide a clean, isolated ArrayBuffer copy
  const buffer = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength);

  return {
    buffer,
    name: 'demo-sample-document.pdf',
    size: pdfBytes.byteLength,
    pageCount: pagesData.length,
  };
}
