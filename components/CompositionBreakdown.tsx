"use client";

import React from "react";
import { MonthlyProjection } from "../types/finance";
import { formatCurrency } from "../utils/format";
import { Language, translations } from "../utils/translations";
import { LuInfo } from "react-icons/lu";

interface Props {
  projections: MonthlyProjection[];
  lang: Language;
  currency: string;
}

export default function CompositionBreakdown({
  projections,
  lang,
  currency,
}: Props) {
  const t = translations[lang];

  if (projections.length === 0) return null;

  // Calculate totals across all projection months
  const totalPendapatanKotor = projections.reduce(
    (acc, curr) => acc + curr.pendapatanKotor,
    0,
  );
  const totalPajakPotongan = projections.reduce(
    (acc, curr) => acc + curr.pajakPotongan,
    0,
  );
  const totalCicilanUtang = projections.reduce(
    (acc, curr) => acc + curr.cicilanUtang,
    0,
  );
  const totalPengeluaranRutin = projections.reduce(
    (acc, curr) => acc + curr.pengeluaranRutin,
    0,
  );
  const totalPengeluaranSekaliBayar = projections.reduce(
    (acc, curr) => acc + curr.pengeluaranSekaliBayar,
    0,
  );
  const totalCashflow = projections.reduce(
    (acc, curr) => acc + curr.cashflow,
    0,
  );

  const totalOutflow =
    totalPajakPotongan +
    totalCicilanUtang +
    totalPengeluaranRutin +
    totalPengeluaranSekaliBayar;
  const totalPengeluaranMurni =
    totalCicilanUtang + totalPengeluaranRutin + totalPengeluaranSekaliBayar;
  const base = Math.max(totalPendapatanKotor, totalOutflow);

  const pctPendapatan = base > 0 ? (totalPendapatanKotor / base) * 100 : 0;
  const pctPajak = base > 0 ? (totalPajakPotongan / base) * 100 : 0;
  const pctCicilan = base > 0 ? (totalCicilanUtang / base) * 100 : 0;
  const pctRutin = base > 0 ? (totalPengeluaranRutin / base) * 100 : 0;
  const pctOneTime = base > 0 ? (totalPengeluaranSekaliBayar / base) * 100 : 0;
  const pctSisa = base > 0 ? (Math.max(0, totalCashflow) / base) * 100 : 0;
  const pctDefisit =
    base > 0 ? (Math.abs(Math.min(0, totalCashflow)) / base) * 100 : 0;


  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 md:p-6 space-y-4">
      <h4 className="text-sm font-semibold text-slate-800">
        {t.compositionTitle}
      </h4>

      <div className="space-y-4">
        {/* Total Pendapatan */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
          <span className="text-xs font-semibold text-slate-700 w-24 md:w-32 flex-shrink-0 truncate">
            {t.totalGrossIncome}
          </span>
          <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${pctPendapatan}%` }}
            />
          </div>
          <span className="text-xs font-bold text-emerald-600 w-24 text-right">
            {formatCurrency(totalPendapatanKotor, currency)}
          </span>
        </div>

        {/* Pajak & Potongan */}
        {totalPajakPotongan > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-danger flex-shrink-0" />
            <span className="text-xs text-slate-600 w-24 md:w-32 flex-shrink-0 truncate">
              {t.compTax}
            </span>
            <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-danger rounded-full transition-all duration-300"
                style={{ width: `${pctPajak}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 w-24 text-right">
              {formatCurrency(totalPajakPotongan, currency)}
            </span>
          </div>
        )}

        {/* Cicilan & Utang */}
        {totalCicilanUtang > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-warning flex-shrink-0" />
            <span className="text-xs text-slate-600 w-24 md:w-32 flex-shrink-0 truncate">
              {t.compDebt}
            </span>
            <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-warning rounded-full transition-all duration-300"
                style={{ width: `${pctCicilan}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 w-24 text-right">
              {formatCurrency(totalCicilanUtang, currency)}
            </span>
          </div>
        )}

        {/* Pengeluaran Rutin */}
        {totalPengeluaranRutin > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 flex-shrink-0" />
            <span className="text-xs text-slate-600 w-24 md:w-32 flex-shrink-0 truncate">
              {t.compRoutine}
            </span>
            <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${pctRutin}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 w-24 text-right">
              {formatCurrency(totalPengeluaranRutin, currency)}
            </span>
          </div>
        )}

        {/* Pengeluaran Sekali Bayar */}
        {totalPengeluaranSekaliBayar > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
            <span className="text-xs text-slate-600 w-24 md:w-32 flex-shrink-0 truncate">
              {t.compOneTime}
            </span>
            <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${pctOneTime}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 w-24 text-right">
              {formatCurrency(totalPengeluaranSekaliBayar, currency)}
            </span>
          </div>
        )}

        {/* Sisa (Ditabung) / Defisit */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 mt-3">
          <div
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${totalCashflow >= 0 ? "bg-brand" : "bg-danger"}`}
          />
          <div className="text-xs font-semibold text-slate-700 w-24 md:w-32 flex-shrink-0 flex items-center gap-1">
            <span className="truncate">
              {totalCashflow >= 0 ? t.compSavings : t.deficit}
            </span>
            {totalCashflow < 0 && (
              <span className="inline-block ml-0.5 group relative cursor-pointer text-slate-400 hover:text-slate-600">
                <LuInfo size={12} className="inline mb-0.5" />
                <span className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-2.5 bg-slate-800 text-[10px] text-white rounded-lg shadow-lg z-50 text-left font-medium leading-normal whitespace-normal">
                  <div className="font-mono text-xs mb-1">
                    {formatCurrency(totalPendapatanKotor - totalPajakPotongan, currency)} - {formatCurrency(totalPengeluaranMurni, currency)} = {formatCurrency(totalCashflow, currency)}
                  </div>
                  <div className="text-[9px] text-slate-400 font-sans leading-tight">
                    {lang === "id"
                      ? "(Pendapatan Bersih - Pengeluaran = Arus Kas)"
                      : "(Net Income - Expenses = Cash Flow)"}
                  </div>
                </span>
              </span>
            )}
          </div>
          <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                totalCashflow >= 0 ? "bg-brand" : "bg-danger"
              }`}
              style={{ width: `${totalCashflow >= 0 ? pctSisa : pctDefisit}%` }}
            />
          </div>
          <span
            className={`text-xs font-bold w-24 text-right ${totalCashflow >= 0 ? "text-brand-dark" : "text-danger"}`}
          >
            {totalCashflow >= 0 ? "+" : ""}
            {formatCurrency(Math.abs(totalCashflow), currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
