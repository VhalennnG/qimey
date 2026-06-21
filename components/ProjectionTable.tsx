"use client";

import React, { useState, useRef, useEffect } from "react";
import { MonthlyProjection, FinancialState } from "../types/finance";
import { formatCurrency } from "../utils/format";
import {
  Language,
  translations,
  INDONESIAN_MONTHS,
  ENGLISH_MONTHS,
} from "../utils/translations";
import { LuTable2, LuDownload } from "react-icons/lu";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Props {
  projections: MonthlyProjection[];
  state: FinancialState;
  lang: Language;
  currency: string;
}

export default function ProjectionTable({
  projections,
  state,
  lang,
  currency,
}: Props) {
  const t = translations[lang];
  const monthsList = lang === "id" ? INDONESIAN_MONTHS : ENGLISH_MONTHS;
  const [isExportOpen, setIsExportOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (projections.length === 0) return null;

  // Build notes for each projection month
  const buildNotes = (
    p: MonthlyProjection,
  ): { text: string; type: "paidOff" | "ended" | "deficit" }[] => {
    const notes: { text: string; type: "paidOff" | "ended" | "deficit" }[] = [];

    p.lunasCicilanIds.forEach((debtId) => {
      const debt = state.cicilanUtang.find((d) => d.id === debtId);
      if (debt) {
        notes.push({
          text: `${t.notesPaidOff}: ${debt.nama || (lang === "id" ? "Cicilan" : "Installment")}`,
          type: "paidOff",
        });
      }
    });

    p.berakhirIncomeIds.forEach((incomeId) => {
      const income = state.incomes.find((inc) => inc.id === incomeId);
      if (income) {
        notes.push({
          text: `${t.notesEnded}: ${income.nama || (lang === "id" ? "Pendapatan" : "Income")}`,
          type: "ended",
        });
      }
    });

    if (p.defisitWarning) {
      notes.push({ text: t.notesDeficit, type: "deficit" });
    }

    return notes;
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      t.colMonth,
      t.colIncome,
      t.colTax,
      t.colDebt,
      t.colRoutine,
      t.colOneTime,
      t.colCashflow,
      t.colBalance,
      t.colNotes,
    ];
    const csvRows = [headers.join(",")];

    projections.forEach((p) => {
      const notes = buildNotes(p)
        .map((n) => n.text)
        .join("; ");
      const row = [
        `"${monthsList[p.bulanIndex]} ${p.tahun}"`,
        p.pendapatanBersih,
        p.pajakPotongan,
        p.cicilanUtang,
        p.pengeluaranRutin,
        p.pengeluaranSekaliBayar,
        p.cashflow,
        p.saldo,
        `"${notes.replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob(["\uFEFF" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Proyeksi_Keuangan_${new Date().getFullYear()}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to XLSX (Excel)
  const exportToExcel = () => {
    const data = projections.map((p) => {
      const notes = buildNotes(p)
        .map((n) => n.text)
        .join("; ");
      return {
        [t.colMonth]: `${monthsList[p.bulanIndex]} ${p.tahun}`,
        [t.colIncome]: p.pendapatanBersih,
        [t.colTax]: p.pajakPotongan,
        [t.colDebt]: p.cicilanUtang,
        [t.colRoutine]: p.pengeluaranRutin,
        [t.colOneTime]: p.pengeluaranSekaliBayar,
        [t.colCashflow]: p.cashflow,
        [t.colBalance]: p.saldo,
        [t.colNotes]: notes,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Proyeksi Keuangan");
    XLSX.writeFile(
      workbook,
      `Proyeksi_Keuangan_${new Date().getFullYear()}.xlsx`,
    );
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");

    // Title & Subtitle
    doc.setFontSize(16);
    doc.text(t.reportTitle, 40, 40);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(t.reportSub, 40, 55);

    const headers = [
      [
        t.colMonth,
        t.colIncome,
        t.colTax,
        t.colDebt,
        t.colRoutine,
        t.colOneTime,
        t.colCashflow,
        t.colBalance,
        t.colNotes,
      ],
    ];

    const body = projections.map((p) => {
      const notes = buildNotes(p)
        .map((n) => n.text)
        .join(", ");
      return [
        `${monthsList[p.bulanIndex]} ${p.tahun}`,
        formatCurrency(p.pendapatanBersih, currency),
        p.pajakPotongan > 0
          ? `-${formatCurrency(p.pajakPotongan, currency)}`
          : "—",
        p.cicilanUtang > 0
          ? `-${formatCurrency(p.cicilanUtang, currency)}`
          : "—",
        p.pengeluaranRutin > 0
          ? `-${formatCurrency(p.pengeluaranRutin, currency)}`
          : "—",
        p.pengeluaranSekaliBayar > 0
          ? `-${formatCurrency(p.pengeluaranSekaliBayar, currency)}`
          : "—",
        `${p.cashflow >= 0 ? "+" : ""}${formatCurrency(p.cashflow, currency)}`,
        formatCurrency(p.saldo, currency),
        notes || "—",
      ];
    });

    (doc as any).autoTable({
      head: headers,
      body: body,
      startY: 75,
      margin: { left: 40, right: 40 },
      styles: { fontSize: 8, cellPadding: 6 },
      headStyles: { fillColor: [29, 158, 117], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`Proyeksi_Keuangan_${new Date().getFullYear()}.pdf`);
  };

  // Detect year boundaries for separator rows
  let lastRenderedYear: number | null = null;

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 md:p-6 pb-4 flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <LuTable2 size={16} className="text-brand" />
            {t.reportTitle}
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">{t.reportSub}</p>
        </div>

        {/* Export Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsExportOpen(!isExportOpen)}
            className="flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-all duration-150 active:scale-95 shadow-sm px-3 py-1.5"
            aria-label="Export options"
          >
            <span className="text-sm font-medium">Export</span>

            <LuDownload size={15} />
          </button>
          {isExportOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-100 rounded-xl shadow-lg z-50 py-1.5 animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  exportToExcel();
                  setIsExportOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Excel (.xlsx)
              </button>
              <button
                type="button"
                onClick={() => {
                  exportToCSV();
                  setIsExportOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                CSV (.csv)
              </button>
              <button
                type="button"
                onClick={() => {
                  exportToPDF();
                  setIsExportOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                PDF (.pdf)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table wrapper with horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200">
              <th className="sticky left-0 z-10 bg-slate-50 text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">
                {t.colMonth}
              </th>
              <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">
                {t.colIncome}
              </th>
              <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">
                {t.colTax}
              </th>
              <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">
                {t.colDebt}
              </th>
              <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">
                {t.colRoutine}
              </th>
              <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">
                {t.colOneTime}
              </th>
              <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">
                {t.colCashflow}
              </th>
              <th className="text-right px-3 py-3 font-semibold text-slate-600 whitespace-nowrap">
                {t.colBalance}
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 whitespace-nowrap min-w-[160px]">
                {t.colNotes}
              </th>
            </tr>
          </thead>
          <tbody>
            {projections.map((p, idx) => {
              const notes = buildNotes(p);
              const hasPaidOff = p.lunasCicilanIds.length > 0;
              const isDeficit = p.defisitWarning;
              const monthLabel = `${monthsList[p.bulanIndex]} ${p.tahun}`;

              // Year separator row
              let yearSeparator: React.ReactNode = null;
              if (lastRenderedYear !== null && p.tahun !== lastRenderedYear) {
                yearSeparator = (
                  <tr
                    key={`year-sep-${p.tahun}`}
                    className="bg-slate-100 border-y border-slate-200"
                  >
                    <td
                      colSpan={9}
                      className="px-4 py-2 text-xs font-bold text-slate-500 tracking-wide"
                    >
                      {p.tahun}
                    </td>
                  </tr>
                );
              }
              lastRenderedYear = p.tahun;

              // Row background tint based on status
              let rowClass =
                "border-b border-slate-50 hover:bg-slate-50/50 transition-colors";
              if (isDeficit) {
                rowClass =
                  "border-b border-red-50 bg-red-50/40 hover:bg-red-50/70 transition-colors";
              } else if (hasPaidOff) {
                rowClass =
                  "border-b border-emerald-50 bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors";
              }

              return (
                <React.Fragment key={`row-${idx}`}>
                  {yearSeparator}
                  <tr className={rowClass}>
                    <td className="sticky left-0 z-10 bg-inherit px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                      {monthLabel}
                    </td>
                    <td className="text-right px-3 py-3 text-slate-700 font-medium tabular-nums">
                      {formatCurrency(p.pendapatanBersih, currency)}
                    </td>
                    <td className="text-right px-3 py-3 text-red-500 tabular-nums">
                      {p.pajakPotongan > 0
                        ? `-${formatCurrency(p.pajakPotongan, currency)}`
                        : "—"}
                    </td>
                    <td className="text-right px-3 py-3 text-orange-500 tabular-nums">
                      {p.cicilanUtang > 0
                        ? `-${formatCurrency(p.cicilanUtang, currency)}`
                        : "—"}
                    </td>
                    <td className="text-right px-3 py-3 text-indigo-500 tabular-nums">
                      {p.pengeluaranRutin > 0
                        ? `-${formatCurrency(p.pengeluaranRutin, currency)}`
                        : "—"}
                    </td>
                    <td className="text-right px-3 py-3 text-orange-600 tabular-nums">
                      {p.pengeluaranSekaliBayar > 0
                        ? `-${formatCurrency(p.pengeluaranSekaliBayar, currency)}`
                        : "—"}
                    </td>
                    <td
                      className={`text-right px-3 py-3 font-semibold tabular-nums ${p.cashflow >= 0 ? "text-brand-dark" : "text-danger"}`}
                    >
                      {p.cashflow >= 0 ? "+" : ""}
                      {formatCurrency(p.cashflow, currency)}
                    </td>
                    <td
                      className={`text-right px-3 py-3 font-bold tabular-nums ${p.saldo >= 0 ? "text-brand-dark" : "text-danger"}`}
                    >
                      {formatCurrency(p.saldo, currency)}
                    </td>
                    <td className="text-left px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {notes.length === 0 ? (
                          <span className="text-slate-300">—</span>
                        ) : (
                          notes.map((note, nIdx) => (
                            <span
                              key={nIdx}
                              className={`inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 w-fit whitespace-nowrap ${
                                note.type === "paidOff"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : note.type === "ended"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {note.type === "paidOff"
                                ? "✓"
                                : note.type === "ended"
                                  ? "⏳"
                                  : "⚠"}
                              {note.text}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
