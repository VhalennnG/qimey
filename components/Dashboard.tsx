"use client";

import React from "react";
import dynamic from "next/dynamic";
import { FinancialState, MonthlyProjection } from "../types/finance";
import { Language, translations, INDONESIAN_MONTHS, ENGLISH_MONTHS } from "../utils/translations";
import CompositionBreakdown from "./CompositionBreakdown";
import StatusDetails from "./StatusDetails";
import ProjectionTable from "./ProjectionTable";
import { LuTriangleAlert } from "react-icons/lu";

// Dynamically import to avoid SSR errors
const ProjectionChart = dynamic(() => import("./ProjectionChart"), { ssr: false });

interface Props {
  projections: MonthlyProjection[];
  state: FinancialState;
  startMonthIndex: number;
  currentYear: number;
  endMonthIndex: number;
  endYear: number;
  lang: Language;
  currency: string;
}

export default function Dashboard({
  projections,
  state,
  startMonthIndex,
  currentYear,
  endMonthIndex,
  endYear,
  lang,
  currency,
}: Props) {
  const t = translations[lang];
  const monthsList = lang === "id" ? INDONESIAN_MONTHS : ENGLISH_MONTHS;

  const allIncomesFinite = state.incomes.length > 0 && state.incomes.every(inc => inc.selesaiBulan !== null);
  
  let showGlobalIncomeWarning = false;
  let lastActiveMonthName = "";
  let nextMonthName = "";

  if (allIncomesFinite) {
    const projStartAbs = currentYear * 12 + startMonthIndex;
    const projEndAbs = endYear * 12 + endMonthIndex;
    const selesaiBulanList = state.incomes.map(inc => inc.selesaiBulan!);
    const maxSelesaiAbs = Math.max(...selesaiBulanList.map(sb => sb.tahun * 12 + sb.bulan));
    
    if (maxSelesaiAbs < projEndAbs) {
      showGlobalIncomeWarning = true;
      // Calculate calendar month/year for the last active month
      const lastActiveCalMonth = maxSelesaiAbs % 12;
      const lastActiveCalYear = Math.floor(maxSelesaiAbs / 12);
      // Next month after last active
      const nextCalMonth = (maxSelesaiAbs + 1) % 12;
      const nextCalYear = Math.floor((maxSelesaiAbs + 1) / 12);
      lastActiveMonthName = `${monthsList[lastActiveCalMonth]} ${lastActiveCalYear}`;
      nextMonthName = `${monthsList[nextCalMonth]} ${nextCalYear}`;
    }
  }

  const alertText = t.alertDetail
    .replace("{lastActiveMonth}", lastActiveMonthName)
    .replace("{nextMonth}", nextMonthName);

  return (
    <div 
      id="dashboard-results"
      className="space-y-6 pt-6 border-t border-slate-200 scroll-mt-6 animate-fadeIn"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-2">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs font-bold font-sans">✓</span>
            {t.dashHeader}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{t.dashSub}</p>
        </div>
      </div>

      {/* Global Income Ending Warning Banner */}
      {showGlobalIncomeWarning && (
        <div className="bg-warning-light border border-warning/40 rounded-2xl p-4 flex gap-3 text-warning-dark shadow-sm animate-fadeIn">
          <LuTriangleAlert size={20} className="flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-800">
              {t.alertHeader}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {alertText}
            </p>
          </div>
        </div>
      )}

      {/* Projection Chart */}
      <ProjectionChart projections={projections} lang={lang} currency={currency} />

      {/* Breakdown and Status List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompositionBreakdown projections={projections} lang={lang} currency={currency} />
        <StatusDetails projections={projections} state={state} lang={lang} />
      </div>

      {/* Financial Report Table */}
      <ProjectionTable projections={projections} state={state} lang={lang} currency={currency} />
    </div>
  );
}
