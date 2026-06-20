"use client";

import React from "react";
import { formatCurrency } from "../utils/format";
import { Language, translations } from "../utils/translations";
import { LuInfo } from "react-icons/lu";

interface Props {
  saldoAkhir: number;
  startMonthName: string;
  startYear: number;
  lang: Language;
  currency: string;
}

export default function DashHero({ saldoAkhir, startMonthName, startYear, lang, currency }: Props) {
  const t = translations[lang];
  const isDeficit = saldoAkhir < 0;

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-center space-y-2 relative overflow-hidden">
      {/* Decorative accent top line */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${isDeficit ? "bg-danger" : "bg-brand"}`} />
      
      <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
        {t.projDec} {startYear}
      </p>
      
      <div 
        className={`text-3xl md:text-4xl font-bold tracking-tight py-2 ${
          isDeficit ? "text-danger" : "text-brand-dark"
        }`}
      >
        {formatCurrency(saldoAkhir, currency)}
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <LuInfo size={14} className="flex-shrink-0" />
        <span>{t.calculatedFrom} {startMonthName} {startYear}</span>
      </div>
    </div>
  );
}
