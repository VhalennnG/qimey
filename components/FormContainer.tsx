"use client";

import React from "react";
import { FinancialState, Income, Tabungan, ItemBerkala, PengeluaranRutin, PengeluaranSekaliBayar } from "../types/finance";
import { Language, translations } from "../utils/translations";
import IncomeSection from "./IncomeSection";
import SavingsSection from "./SavingsSection";
import DebtSection from "./DebtSection";
import RoutineSection from "./RoutineSection";
import OneTimeSection from "./OneTimeSection";
import { LuSave, LuRotateCcw } from "react-icons/lu";

interface Props {
  state: FinancialState;
  onChange: (newState: FinancialState) => void;
  onSubmit: () => void;
  onReset: () => void;
  errors: Record<string, string>;
  startMonthIndex: number;
  currentYear: number;
  lang: Language;
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

export default function FormContainer({
  state,
  onChange,
  onSubmit,
  onReset,
  errors,
  startMonthIndex,
  currentYear,
  lang,
  currency,
  onCurrencyChange,
}: Props) {
  const t = translations[lang];
  
  const handleIncomesChange = (incomes: Income[]) => {
    onChange({ ...state, incomes });
  };

  const handleTabunganChange = (tabungan: Tabungan) => {
    onChange({ ...state, tabungan });
  };

  const handleCicilanChange = (cicilanUtang: ItemBerkala[]) => {
    onChange({ ...state, cicilanUtang });
  };

  const handleRoutineChange = (pengeluaranRutin: PengeluaranRutin[]) => {
    onChange({ ...state, pengeluaranRutin });
  };

  const handleOneTimeChange = (pengeluaranSekaliBayar: PengeluaranSekaliBayar[]) => {
    onChange({ ...state, pengeluaranSekaliBayar });
  };

  return (
    <div className="space-y-6">
      {/* Premium Currency Switcher Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === "id" ? "Mata Uang Proyeksi" : "Projection Currency"}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === "id" ? "Tuliskan simbol atau kode mata uang pilihan Anda (misal: Rp, USD, EUR, SGD)" : "Type your currency symbol or code (e.g., Rp, USD, EUR, SGD)"}
            </p>
          </div>
          
          <div className="w-full sm:w-48 relative">
            <input
              type="text"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              placeholder="Rp / USD / EUR"
              className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Step 1: Income Card */}
      <section id="section-income" className="scroll-mt-10 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
        <IncomeSection
          incomes={state.incomes}
          onChange={handleIncomesChange}
          errors={errors}
          lang={lang}
          currency={currency}
        />
      </section>

      {/* Step 2: Savings Card */}
      <section id="section-savings" className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
        <SavingsSection
          tabungan={state.tabungan}
          onChange={handleTabunganChange}
          lang={lang}
          currency={currency}
        />
      </section>

      {/* Step 3: Debt Card */}
      <section id="section-debt" className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
        <DebtSection
          debts={state.cicilanUtang}
          onChange={handleCicilanChange}
          lang={lang}
          currency={currency}
        />
      </section>

      {/* Step 4: Routine Expenses Card */}
      <section id="section-routine" className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
        <RoutineSection
          expenses={state.pengeluaranRutin}
          onChange={handleRoutineChange}
          lang={lang}
          currency={currency}
        />
      </section>

      {/* Step 5: One-Time Expenses Card */}
      <section id="section-onetime" className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8">
        <OneTimeSection
          expenses={state.pengeluaranSekaliBayar}
          onChange={handleOneTimeChange}
          startMonthIndex={startMonthIndex}
          currentYear={currentYear}
          lang={lang}
          currency={currency}
        />
      </section>

      {/* Submit Action Area Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <LuSave size={13} />
          <span>{t.saveAuto}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-1/3 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold rounded-xl text-sm active:scale-[0.99] btn-hover-transition flex items-center justify-center gap-1.5"
          >
            <LuRotateCcw size={15} />
            <span>{t.resetBtn}</span>
          </button>
          
          <button
            type="button"
            onClick={onSubmit}
            className="flex-1 py-3.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl text-sm shadow-md shadow-brand/10 hover:shadow-brand/20 active:scale-[0.99] btn-hover-transition flex items-center justify-center gap-1.5"
          >
            {t.calculateBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
