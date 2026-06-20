"use client";

import React from "react";
import { MonthlyProjection } from "../types/finance";
import { formatCurrencySummary } from "../utils/format";
import { Language, translations } from "../utils/translations";

interface Props {
  projections: MonthlyProjection[];
  lang: Language;
  currency: string;
}

export default function MetricsSummary({ projections, lang, currency }: Props) {
  const t = translations[lang];

  // Compute cumulative metrics
  const totalPendapatanBersih = projections.reduce((sum, p) => sum + p.pendapatanBersih, 0);
  const totalPajakPotongan = projections.reduce((sum, p) => sum + p.pajakPotongan, 0);
  const totalCicilanUtang = projections.reduce((sum, p) => sum + p.cicilanUtang, 0);

  // Debt-to-income ratio for the current month (first item in projection)
  const currentMonth = projections[0];
  const ratioCicilan = currentMonth && currentMonth.pendapatanBersih > 0
    ? Math.round((currentMonth.cicilanUtang / currentMonth.pendapatanBersih) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Pendapatan Bersih */}
      <div className="bg-slateCustom-50 border border-slateCustom-100 rounded-xl p-4 shadow-sm space-y-1">
        <span className="text-[10px] md:text-xs font-medium text-slate-500 block leading-tight">
          {t.totalNetIncome}
        </span>
        <span className="text-sm md:text-lg font-bold text-slate-800 block">
          {formatCurrencySummary(totalPendapatanBersih, currency)}
        </span>
      </div>

      {/* Total Pajak & Potongan */}
      <div className="bg-slateCustom-50 border border-slateCustom-100 rounded-xl p-4 shadow-sm space-y-1">
        <span className="text-[10px] md:text-xs font-medium text-slate-500 block leading-tight">
          {t.totalTaxes}
        </span>
        <span className="text-sm md:text-lg font-bold text-danger block">
          {formatCurrencySummary(totalPajakPotongan, currency)}
        </span>
      </div>

      {/* Total Cicilan & Utang */}
      <div className="bg-slateCustom-50 border border-slateCustom-100 rounded-xl p-4 shadow-sm space-y-1">
        <span className="text-[10px] md:text-xs font-medium text-slate-500 block leading-tight">
          {t.totalDebts}
        </span>
        <span className="text-sm md:text-lg font-bold text-danger block">
          {formatCurrencySummary(totalCicilanUtang, currency)}
        </span>
      </div>

      {/* Rasio Cicilan/Pendapatan */}
      <div className="bg-slateCustom-50 border border-slateCustom-100 rounded-xl p-4 shadow-sm space-y-1">
        <span className="text-[10px] md:text-xs font-medium text-slate-500 block leading-tight">
          {t.debtToIncomeRatio}
        </span>
        <span className={`text-sm md:text-lg font-bold block ${ratioCicilan > 30 ? "text-warning-dark" : "text-brand-dark"}`}>
          {ratioCicilan}%
        </span>
      </div>
    </div>
  );
}
