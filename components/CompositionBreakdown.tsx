"use client";

import React from "react";
import { MonthlyProjection } from "../types/finance";
import { formatCurrency } from "../utils/format";
import { Language, translations } from "../utils/translations";

interface Props {
  projections: MonthlyProjection[];
  lang: Language;
  currency: string;
}

export default function CompositionBreakdown({ projections, lang, currency }: Props) {
  const t = translations[lang];

  const lastMonth = projections[projections.length - 1];
  if (!lastMonth) return null;

  const {
    bulanNama,
    tahun,
    pendapatanKotor,
    pajakPotongan,
    cicilanUtang,
    pengeluaranRutin,
    pengeluaranSekaliBayar,
    cashflow,
  } = lastMonth;

  const totalOutflow = pajakPotongan + cicilanUtang + pengeluaranRutin + pengeluaranSekaliBayar;
  const base = Math.max(pendapatanKotor, totalOutflow);
  
  const pctPajak = base > 0 ? (pajakPotongan / base) * 100 : 0;
  const pctCicilan = base > 0 ? (cicilanUtang / base) * 100 : 0;
  const pctRutin = base > 0 ? (pengeluaranRutin / base) * 100 : 0;
  const pctOneTime = base > 0 ? (pengeluaranSekaliBayar / base) * 100 : 0;
  const pctSisa = base > 0 ? (Math.max(0, cashflow) / base) * 100 : 0;

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 md:p-6 space-y-4">
      <h4 className="text-sm font-semibold text-slate-800">
        {t.compositionTitle} ({bulanNama} {tahun})
      </h4>

      <div className="space-y-4">
        {/* Pajak & Potongan */}
        {pajakPotongan > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-danger flex-shrink-0" />
            <span className="text-xs text-slate-600 w-24 md:w-32 flex-shrink-0 truncate">{t.compTax}</span>
            <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-danger rounded-full transition-all duration-300"
                style={{ width: `${pctPajak}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 w-24 text-right">
              {formatCurrency(pajakPotongan, currency)}
            </span>
          </div>
        )}

        {/* Cicilan & Utang */}
        {cicilanUtang > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-warning flex-shrink-0" />
            <span className="text-xs text-slate-600 w-24 md:w-32 flex-shrink-0 truncate">{t.compDebt}</span>
            <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-warning rounded-full transition-all duration-300"
                style={{ width: `${pctCicilan}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 w-24 text-right">
              {formatCurrency(cicilanUtang, currency)}
            </span>
          </div>
        )}

        {/* Pengeluaran Rutin */}
        {pengeluaranRutin > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0" />
            <span className="text-xs text-slate-600 w-24 md:w-32 flex-shrink-0 truncate">{t.compRoutine}</span>
            <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${pctRutin}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 w-24 text-right">
              {formatCurrency(pengeluaranRutin, currency)}
            </span>
          </div>
        )}

        {/* Pengeluaran Sekali Bayar */}
        {pengeluaranSekaliBayar > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
            <span className="text-xs text-slate-600 w-24 md:w-32 flex-shrink-0 truncate">{t.compOneTime}</span>
            <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${pctOneTime}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 w-24 text-right">
              {formatCurrency(pengeluaranSekaliBayar, currency)}
            </span>
          </div>
        )}

        {/* Sisa (Ditabung) */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-brand flex-shrink-0" />
          <span className="text-xs text-slate-600 w-24 md:w-32 flex-shrink-0 truncate">
            {cashflow >= 0 ? t.compSavings : t.deficit}
          </span>
          <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                cashflow >= 0 ? "bg-brand" : "bg-danger"
              }`}
              style={{ width: `${cashflow >= 0 ? pctSisa : 100}%` }}
            />
          </div>
          <span className={`text-xs font-bold w-24 text-right ${cashflow >= 0 ? "text-brand-dark" : "text-danger"}`}>
            {formatCurrency(cashflow, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
