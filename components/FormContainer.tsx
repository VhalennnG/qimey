"use client";

import React from "react";
import { FinancialState, Income, Tabungan, ItemBerkala, PengeluaranRutin, PengeluaranSekaliBayar } from "../types/finance";
import { Language, translations } from "../utils/translations";
import { CURRENCIES } from "../utils/format";
import IncomeSection from "./IncomeSection";
import SavingsSection from "./SavingsSection";
import DebtSection from "./DebtSection";
import RoutineSection from "./RoutineSection";
import OneTimeSection from "./OneTimeSection";
import { Save, RotateCcw } from "lucide-react";

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
    <div className="space-y-8 bg-white border border-slate-200 shadow-md rounded-2xl p-6 md:p-8">
      {/* Premium Currency Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {lang === "id" ? "Mata Uang Proyeksi" : "Projection Currency"}
          </h4>
          <p className="text-[11px] text-slate-400">
            {lang === "id" ? "Pilih mata uang untuk pengisian dan hasil kalkulasi" : "Select currency for inputs and calculations"}
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40 w-fit select-none">
          {Object.values(CURRENCIES).map((cur) => (
            <button
              key={cur.code}
              type="button"
              onClick={() => onCurrencyChange(cur.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold btn-hover-transition flex items-center gap-1 ${
                currency === cur.code
                  ? "bg-white text-brand-dark shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="text-[10px] text-slate-400 font-mono font-normal">{cur.symbol}</span>
              <span>{cur.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Income */}
      <section id="section-income" className="scroll-mt-10">
        <IncomeSection
          incomes={state.incomes}
          onChange={handleIncomesChange}
          errors={errors}
          lang={lang}
          currency={currency}
        />
      </section>

      <hr className="border-slate-100" />

      {/* Step 2: Savings */}
      <section id="section-savings">
        <SavingsSection
          tabungan={state.tabungan}
          onChange={handleTabunganChange}
          lang={lang}
          currency={currency}
        />
      </section>

      <hr className="border-slate-100" />

      {/* Step 3: Debt */}
      <section id="section-debt">
        <DebtSection
          debts={state.cicilanUtang}
          onChange={handleCicilanChange}
          lang={lang}
          currency={currency}
        />
      </section>

      <hr className="border-slate-100" />

      {/* Step 4: Routine Expenses */}
      <section id="section-routine">
        <RoutineSection
          expenses={state.pengeluaranRutin}
          onChange={handleRoutineChange}
          lang={lang}
          currency={currency}
        />
      </section>

      <hr className="border-slate-100" />

      {/* Step 5: One-Time Expenses */}
      <section id="section-onetime">
        <OneTimeSection
          expenses={state.pengeluaranSekaliBayar}
          onChange={handleOneTimeChange}
          startMonthIndex={startMonthIndex}
          currentYear={currentYear}
          lang={lang}
          currency={currency}
        />
      </section>

      {/* Submit Action Area */}
      <div className="pt-6 border-t border-slate-100 text-center space-y-4">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Save size={13} />
          <span>{t.saveAuto}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-1/3 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold rounded-xl text-sm active:scale-[0.99] btn-hover-transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={15} />
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
