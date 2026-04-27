"use client";

import * as React from "react";
import { DownloadIcon, FileSpreadsheetIcon, FileTextIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportElementToPdf } from "@/lib/utils/export-pdf";
import { exportToExcel, type ExcelColumn } from "@/lib/utils/export-excel";

interface ExportToolbarProps<T> {
  reportTitle: string;
  fileBaseName: string;
  /** DOM ref to the report content for PDF export. */
  captureRef: React.RefObject<HTMLDivElement | null>;
  /** Columns + rows for the Excel export. */
  excel: {
    columns: ExcelColumn<T>[];
    rows: T[];
  };
  dateRangeLabel?: string;
}

export function ExportToolbar<T>({
  reportTitle,
  fileBaseName,
  captureRef,
  excel,
  dateRangeLabel,
}: ExportToolbarProps<T>) {
  const [busy, setBusy] = React.useState<"pdf" | "excel" | null>(null);

  const handlePdf = async () => {
    if (!captureRef.current) {
      toast.error("Nothing to export yet.");
      return;
    }
    setBusy("pdf");
    const id = toast.loading("Preparing PDF...");
    try {
      await exportElementToPdf(
        captureRef.current,
        `${fileBaseName}-${new Date().toISOString().slice(0, 10)}`,
        {
          title: reportTitle,
          dateRange: dateRangeLabel,
        },
      );
      toast.success("PDF downloaded", { id });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "PDF export failed",
        { id },
      );
    } finally {
      setBusy(null);
    }
  };

  const handleExcel = () => {
    if (!excel.rows.length) {
      toast.error("No rows to export.");
      return;
    }
    setBusy("excel");
    try {
      exportToExcel({
        filename: `${fileBaseName}-${new Date().toISOString().slice(0, 10)}`,
        sheetName: reportTitle.slice(0, 28),
        columns: excel.columns,
        rows: excel.rows,
        meta: dateRangeLabel
          ? { Report: reportTitle, "Date Range": dateRangeLabel }
          : { Report: reportTitle },
      });
      toast.success("Excel downloaded");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Excel export failed",
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.print()}
        className="hidden sm:inline-flex"
      >
        Print
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button size="sm" disabled={!!busy}>
              <DownloadIcon />
              Export
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handlePdf} disabled={busy === "pdf"}>
            <FileTextIcon /> Download PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExcel} disabled={busy === "excel"}>
            <FileSpreadsheetIcon /> Download Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
