"use client";

import * as XLSX from "xlsx";

export interface ExcelColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => string | number);
  /** When true, formats the value as BDT currency in Excel. */
  currency?: boolean;
  /** Optional width hint (in characters). */
  width?: number;
}

export interface ExportExcelOptions<T> {
  filename: string;
  sheetName?: string;
  columns: ExcelColumn<T>[];
  rows: T[];
  meta?: Record<string, string>;
}

export function exportToExcel<T>({
  filename,
  sheetName = "Report",
  columns,
  rows,
  meta,
}: ExportExcelOptions<T>): void {
  const headerRow = columns.map((c) => c.header);

  const aoa: (string | number)[][] = [];

  if (meta) {
    Object.entries(meta).forEach(([k, v]) => aoa.push([k, v]));
    aoa.push([]);
  }

  aoa.push(headerRow);

  rows.forEach((row) => {
    aoa.push(
      columns.map((c) => {
        const raw =
          typeof c.accessor === "function"
            ? c.accessor(row)
            : (row[c.accessor] as unknown as string | number);
        return raw ?? "";
      }),
    );
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Auto column widths based on header / sample.
  const widths = columns.map((c) => {
    const headerLen = c.header.length;
    const sample = rows.slice(0, 20).map((r) => {
      const v =
        typeof c.accessor === "function"
          ? c.accessor(r)
          : (r[c.accessor] as unknown as string | number);
      return String(v ?? "").length;
    });
    const maxSample = Math.max(headerLen, ...sample, 8);
    return { wch: Math.min(c.width ?? maxSample + 2, 40) };
  });
  ws["!cols"] = widths;

  // Apply BDT currency format for currency columns.
  const headerOffset = (meta ? Object.keys(meta).length + 1 : 0) + 1; // +1 for header row
  columns.forEach((c, colIdx) => {
    if (!c.currency) return;
    for (let r = 0; r < rows.length; r += 1) {
      const cellRef = XLSX.utils.encode_cell({ r: headerOffset + r, c: colIdx });
      const cell = ws[cellRef] as XLSX.CellObject | undefined;
      if (cell && typeof cell.v === "number") {
        cell.t = "n";
        cell.z = '"৳ "#,##0';
      }
    }
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const safeName = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  XLSX.writeFile(wb, safeName);
}
