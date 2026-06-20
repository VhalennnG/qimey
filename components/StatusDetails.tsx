"use client";

import React from "react";
import { MonthlyProjection, FinancialState } from "../types/finance";
import { Language, translations } from "../utils/translations";
import { LuCircleCheck, LuCalendarOff } from "react-icons/lu";

interface Props {
  projections: MonthlyProjection[];
  state: FinancialState;
  lang: Language;
}

export default function StatusDetails({ projections, state, lang }: Props) {
  const t = translations[lang];

  // Find all items that are paid off or ended in the projection months
  const lunasItems: { name: string; monthName: string; year: number }[] = [];
  const berakhirIncomes: { name: string; monthName: string; year: number }[] = [];

  projections.forEach((p) => {
    p.lunasCicilanIds.forEach((debtId) => {
      const debt = state.cicilanUtang.find((d) => d.id === debtId);
      if (debt) {
        lunasItems.push({
          name: debt.nama || (lang === "id" ? "Cicilan tanpa nama" : "Unnamed installment"),
          monthName: p.bulanNama,
          year: p.tahun,
        });
      }
    });

    p.berakhirIncomeIds.forEach((incomeId) => {
      const income = state.incomes.find((inc) => inc.id === incomeId);
      if (income) {
        berakhirIncomes.push({
          name: income.nama || (lang === "id" ? "Pemasukan tanpa nama" : "Unnamed income"),
          monthName: p.bulanNama,
          year: p.tahun,
        });
      }
    });
  });

  if (lunasItems.length === 0 && berakhirIncomes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 md:p-6 space-y-4">
      <h4 className="text-sm font-semibold text-slate-800">{t.detailStatusTitle}</h4>
      
      <div className="space-y-3">
        {/* Paid Off Debts */}
        {lunasItems.map((item, idx) => (
          <div key={`lunas-${idx}`} className="flex items-center justify-between p-3 bg-brand-bgLight/30 border border-brand-light/20 rounded-xl">
            <div className="flex items-center gap-2.5">
              <LuCircleCheck size={16} className="text-brand-dark flex-shrink-0" />
              <span className="text-xs font-medium text-slate-700">
                {item.name} {t.paidOffIn} {item.monthName} {item.year}
              </span>
            </div>
            <span className="text-[10px] font-bold bg-brand text-white rounded-full px-2.5 py-0.5 whitespace-nowrap shadow-sm uppercase tracking-wide">
              {t.paidOffBadge} {item.monthName}
            </span>
          </div>
        ))}

        {/* Ended Incomes */}
        {berakhirIncomes.map((item, idx) => (
          <div key={`ended-${idx}`} className="flex items-center justify-between p-3 bg-warning-light border border-warning/20 rounded-xl">
            <div className="flex items-center gap-2.5">
              <LuCalendarOff size={16} className="text-warning-dark flex-shrink-0" />
              <span className="text-xs font-medium text-slate-700">
                {item.name} {t.endsIn} {item.monthName} {item.year}
              </span>
            </div>
            <span className="text-[10px] font-bold bg-warning-dark text-white rounded-full px-2.5 py-0.5 whitespace-nowrap shadow-sm uppercase tracking-wide">
              {t.endedBadge} {item.monthName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
