"use client";

import React from "react";
import {
  FinancialState,
  Income,
  Tabungan,
  ItemBerkala,
  PengeluaranRutin,
  PengeluaranSekaliBayar,
} from "../types/finance";
import {
  Language,
  translations,
  INDONESIAN_MONTHS,
  ENGLISH_MONTHS,
} from "../utils/translations";
import IncomeSection from "./IncomeSection";
import SavingsSection from "./SavingsSection";
import DebtSection from "./DebtSection";
import RoutineSection from "./RoutineSection";
import OneTimeSection from "./OneTimeSection";
import { LuSave, LuRotateCcw, LuCalendarRange } from "react-icons/lu";

interface Props {
  state: FinancialState;
  onChange: (newState: FinancialState) => void;
  onSubmit: () => void;
  onReset: () => void;
  errors: Record<string, string>;
  startMonthIndex: number;
  currentYear: number;
  endMonthIndex: number;
  endYear: number;
  onEndMonthChange: (month: number) => void;
  onEndYearChange: (year: number) => void;
  lang: Language;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  isDirty: boolean;
  hasCalculated: boolean;
}

export default function FormContainer({
  state,
  onChange,
  onSubmit,
  onReset,
  errors,
  startMonthIndex,
  currentYear,
  endMonthIndex,
  endYear,
  onEndMonthChange,
  onEndYearChange,
  lang,
  currency,
  onCurrencyChange,
  isDirty,
  hasCalculated,
}: Props) {
  const t = translations[lang];
  const monthsList = lang === "id" ? INDONESIAN_MONTHS : ENGLISH_MONTHS;

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

  const handleOneTimeChange = (
    pengeluaranSekaliBayar: PengeluaranSekaliBayar[],
  ) => {
    onChange({ ...state, pengeluaranSekaliBayar });
  };

  // Generate year options (current year to +10)
  const yearOptions: number[] = [];
  for (let y = currentYear; y <= currentYear + 10; y++) {
    yearOptions.push(y);
  }

  return (
    <div className="space-y-6">
      {/* Premium Currency & Range Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-5">
        {/* Currency row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === "id" ? "Mata Uang Proyeksi" : "Projection Currency"}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === "id"
                ? "Tuliskan simbol atau kode mata uang pilihan Anda (misal:IDR, USD, EUR, SGD)"
                : "Type your currency symbol or code (e.g., IDR, USD, EUR, SGD)"}
            </p>
          </div>

          <div className="w-full sm:w-48 relative">
            <input
              type="text"
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              placeholder="IDR / USD / EUR"
              className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 font-semibold"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Projection Range row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <LuCalendarRange size={13} />
              {t.projectionRange}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t.projectionRangeSub}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">
                {t.endMonth}
              </label>
              <select
                value={endMonthIndex}
                onChange={(e) => onEndMonthChange(Number(e.target.value))}
                className="h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 font-semibold"
              >
                {monthsList.map((m, idx) => (
                  <option key={idx} value={idx}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-slate-400 mb-1">
                {t.endYear}
              </label>
              <select
                value={endYear}
                onChange={(e) => onEndYearChange(Number(e.target.value))}
                className="h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 font-semibold"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Income Card */}
      <section
        id="section-income"
        className="scroll-mt-10 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8"
      >
        <IncomeSection
          incomes={state.incomes}
          onChange={handleIncomesChange}
          errors={errors}
          lang={lang}
          currency={currency}
          startMonthIndex={startMonthIndex}
          currentYear={currentYear}
          endMonthIndex={endMonthIndex}
          endYear={endYear}
        />
      </section>

      {/* Step 2: Savings Card */}
      <section
        id="section-savings"
        className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8"
      >
        <SavingsSection
          tabungan={state.tabungan}
          onChange={handleTabunganChange}
          lang={lang}
          currency={currency}
        />
      </section>

      {/* Step 3: Debt Card */}
      <section
        id="section-debt"
        className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8"
      >
        <DebtSection
          debts={state.cicilanUtang}
          onChange={handleCicilanChange}
          lang={lang}
          currency={currency}
          startMonthIndex={startMonthIndex}
          currentYear={currentYear}
          endMonthIndex={endMonthIndex}
          endYear={endYear}
        />
      </section>

      {/* Step 4: Routine Expenses Card */}
      <section
        id="section-routine"
        className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8"
      >
        <RoutineSection
          expenses={state.pengeluaranRutin}
          onChange={handleRoutineChange}
          lang={lang}
          currency={currency}
        />
      </section>

      {/* Step 5: One-Time Expenses Card */}
      <section
        id="section-onetime"
        className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-8"
      >
        <OneTimeSection
          expenses={state.pengeluaranSekaliBayar}
          onChange={handleOneTimeChange}
          startMonthIndex={startMonthIndex}
          currentYear={currentYear}
          endMonthIndex={endMonthIndex}
          endYear={endYear}
          lang={lang}
          currency={currency}
        />
      </section>

      {/* Submit Action Area Card */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <LuSave size={13} className="text-slate-400" />
            <span>{t.saveAuto}</span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={onReset}
              className="flex-1 md:flex-none px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold rounded-xl text-sm active:scale-[0.99] btn-hover-transition flex items-center justify-center gap-1.5"
            >
              <LuRotateCcw size={15} />
              <span>{t.resetBtn}</span>
            </button>

            <button
              type="button"
              onClick={onSubmit}
              className={`flex-[2] md:flex-none px-7 py-2.5 font-semibold rounded-xl text-sm shadow-md active:scale-[0.99] btn-hover-transition flex items-center justify-center gap-1.5 ${
                !hasCalculated
                  ? "bg-brand hover:bg-brand-dark text-white shadow-brand/10 hover:shadow-brand/20"
                  : isDirty
                    ? "bg-warning hover:bg-warning-dark text-white shadow-warning/10 hover:shadow-warning/20"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10 hover:shadow-emerald-500/20"
              }`}
            >
              {!hasCalculated
                ? t.calculateBtn
                : isDirty
                  ? t.updateBtn
                  : t.upToDateBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
