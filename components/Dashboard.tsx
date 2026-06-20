"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { FinancialState, MonthlyProjection } from "../types/finance";
import { Language, translations, INDONESIAN_MONTHS, ENGLISH_MONTHS } from "../utils/translations";
import DashHero from "./DashHero";
import MetricsSummary from "./MetricsSummary";
import CompositionBreakdown from "./CompositionBreakdown";
import StatusDetails from "./StatusDetails";
import { AlertTriangle } from "lucide-react";

// Dynamically import to avoid SSR errors
const ProjectionChart = dynamic(() => import("./ProjectionChart"), { ssr: false });

interface Props {
  projections: MonthlyProjection[];
  state: FinancialState;
  startMonthIndex: number;
  currentYear: number;
  lang: Language;
  currency: string;
}

export default function Dashboard({
  projections,
  state,
  startMonthIndex,
  currentYear,
  lang,
  currency,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];
  const monthsList = lang === "id" ? INDONESIAN_MONTHS : ENGLISH_MONTHS;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [projections]);

  const allIncomesFinite = state.incomes.length > 0 && state.incomes.every(inc => inc.masaBulan !== null);
  
  let showGlobalIncomeWarning = false;
  let lastActiveMonthName = "";
  let nextMonthName = "";

  if (allIncomesFinite) {
    const totalMonthsInProjection = 12 - startMonthIndex;
    const maxMasa = Math.max(...state.incomes.map(inc => inc.masaBulan || 0));
    
    if (maxMasa < totalMonthsInProjection) {
      showGlobalIncomeWarning = true;
      const lastActiveIndex = startMonthIndex + maxMasa - 1;
      const nextIndex = startMonthIndex + maxMasa;
      lastActiveMonthName = `${monthsList[lastActiveIndex]} ${currentYear}`;
      nextMonthName = monthsList[nextIndex];
    }
  }

  const saldoAkhir = projections[projections.length - 1]?.saldo || 0;
  const startMonthName = monthsList[startMonthIndex];

  const alertText = t.alertDetail
    .replace("{lastActiveMonth}", lastActiveMonthName)
    .replace("{nextMonth}", nextMonthName);

  return (
    <div 
      ref={containerRef}
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
          <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
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

      {/* Hero projections */}
      <DashHero 
        saldoAkhir={saldoAkhir}
        startMonthName={startMonthName}
        startYear={currentYear}
        lang={lang}
        currency={currency}
      />

      {/* Summary Metrics */}
      <MetricsSummary projections={projections} lang={lang} currency={currency} />

      {/* Projection Chart */}
      <ProjectionChart projections={projections} lang={lang} currency={currency} />

      {/* Breakdown and Status List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CompositionBreakdown projections={projections} lang={lang} currency={currency} />
        <StatusDetails projections={projections} state={state} lang={lang} />
      </div>
    </div>
  );
}
