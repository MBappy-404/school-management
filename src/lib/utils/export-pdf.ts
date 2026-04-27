"use client";

import jsPDF from "jspdf";
// html2canvas-pro is a maintained fork that natively supports modern CSS
// color functions (oklch, lab, lch) emitted by Tailwind v4. The original
// html2canvas crashes on these with "unsupported color function".
import html2canvas from "html2canvas-pro";

import { SCHOOL_INFO } from "@/lib/mock-data/reports";

export interface PdfHeaderInfo {
  title: string;
  dateRange?: string;
  /** Optional override for the school logo URL/data URL. */
  logoDataUrl?: string;
}

/**
 * Render the supplied DOM node into a multi-page A4 PDF complete with school
 * letter-head, report title, and a Head Teacher signature line at the bottom
 * of the final page.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
  header: PdfHeaderInfo,
): Promise<void> {
  // Force light styling during capture so the PDF looks consistent regardless
  // of the user's current theme.
  const originalClassName = element.className;
  element.classList.add("pdf-capture");

  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
    logging: false,
  });

  element.className = originalClassName;

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;
  const headerHeight = 30;
  const footerHeight = 24;

  // ---- Header ----
  drawHeader(pdf, header, pageWidth, margin, headerHeight);

  // ---- Image (paginated) ----
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin + headerHeight;

  pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - position - footerHeight;

  while (heightLeft > 0) {
    pdf.addPage();
    drawHeader(pdf, header, pageWidth, margin, headerHeight);
    position = margin + headerHeight - (imgHeight - heightLeft);
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin - headerHeight - footerHeight;
  }

  // ---- Footer / signature on the final page ----
  drawSignature(pdf, pageWidth, pageHeight, margin);

  const safeName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  pdf.save(safeName);
}

function drawHeader(
  pdf: jsPDF,
  header: PdfHeaderInfo,
  pageWidth: number,
  margin: number,
  headerHeight: number,
): void {
  // Logo placeholder (top-left): a simple monogram circle so the PDF works
  // even without a bundled image asset.
  pdf.setFillColor(15, 23, 42); // slate-900
  pdf.circle(margin + 6, margin + 6, 6, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.text("BMS", margin + 6, margin + 7.5, { align: "center" });

  // School block
  pdf.setTextColor(15, 23, 42);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(SCHOOL_INFO.name, margin + 16, margin + 4);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(71, 85, 105); // slate-500
  pdf.text(SCHOOL_INFO.address, margin + 16, margin + 9);
  pdf.text(
    `${SCHOOL_INFO.phone}  •  ${SCHOOL_INFO.email}  •  ${SCHOOL_INFO.eiin}`,
    margin + 16,
    margin + 13,
  );

  // Right column: report title + date range
  pdf.setTextColor(15, 23, 42);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text(header.title, pageWidth - margin, margin + 4, { align: "right" });

  if (header.dateRange) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(71, 85, 105);
    pdf.text(header.dateRange, pageWidth - margin, margin + 9, {
      align: "right",
    });
  }

  // Divider
  pdf.setDrawColor(226, 232, 240); // slate-200
  pdf.setLineWidth(0.3);
  pdf.line(
    margin,
    margin + headerHeight - 4,
    pageWidth - margin,
    margin + headerHeight - 4,
  );
}

function drawSignature(
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number,
  margin: number,
): void {
  const y = pageHeight - 18;
  pdf.setDrawColor(15, 23, 42);
  pdf.setLineWidth(0.3);

  // Two signature lines: Head Teacher (right) + Accountant (left optional).
  const lineWidth = 60;

  pdf.line(pageWidth - margin - lineWidth, y, pageWidth - margin, y);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(15, 23, 42);
  pdf.text("Head Teacher", pageWidth - margin, y + 5, { align: "right" });
  pdf.setFontSize(8);
  pdf.setTextColor(71, 85, 105);
  pdf.text(SCHOOL_INFO.headTeacher, pageWidth - margin, y + 10, {
    align: "right",
  });
}
