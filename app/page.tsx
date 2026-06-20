"use client";

import React, { useState, useEffect } from "react";
import { FinancialState, MonthlyProjection } from "../types/finance";
import { calculateProjection } from "../utils/finance";
import { Language, translations } from "../utils/translations";
import FormContainer from "../components/FormContainer";
import Dashboard from "../components/Dashboard";

const DEFAULT_STATE: FinancialState = {
  incomes: [
    {
      id: "default-income",
      nama: "Gaji Pokok",
      nominal: 0,
      periode: "bulanan",
      masaBulan: null,
      pajak: [],
    } as any,
  ],
  tabungan: {
    saldoSaatIni: 0,
    include: false,
  },
  cicilanUtang: [],
  pengeluaranRutin: [],
  pengeluaranSekaliBayar: [],
};

export default function MainPage() {
  const [financialState, setFinancialState] = useState<FinancialState>(DEFAULT_STATE);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lang, setLang] = useState<Language>("id");
  const [currency, setCurrency] = useState<string>("IDR");
  
  const [mounted, setMounted] = useState(false);
  const [startMonthIndex, setStartMonthIndex] = useState(5); // Default: Juni
  const [currentYear, setCurrentYear] = useState(2026); // Default: 2026

  const t = translations[lang];

  // 1. Initial Load (on mount)
  useEffect(() => {
    const d = new Date();
    setStartMonthIndex(d.getMonth());
    setCurrentYear(d.getFullYear());

    const savedState = localStorage.getItem("fyvian_financial_state");
    const savedCalc = localStorage.getItem("fyvian_has_calculated");
    const savedLang = localStorage.getItem("fyvian_lang") as Language;
    const savedCurrency = localStorage.getItem("fyvian_currency");

    if (savedState) {
      try {
        setFinancialState(JSON.parse(savedState));
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
    if (savedCalc === "true") {
      setHasCalculated(true);
    }
    if (savedLang === "id" || savedLang === "en") {
      setLang(savedLang);
    }
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    setMounted(true);
  }, []);

  // 2. Auto-save on State Change
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("fyvian_financial_state", JSON.stringify(financialState));
  }, [financialState, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("fyvian_has_calculated", String(hasCalculated));
  }, [hasCalculated, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("fyvian_lang", lang);
  }, [lang, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("fyvian_currency", currency);
  }, [currency, mounted]);

  // 3. Language toggle
  const toggleLanguage = () => {
    setLang((prev) => (prev === "id" ? "en" : "id"));
  };

  // 4. Form Validation and Submit handler
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (financialState.incomes.length === 0) {
      newErrors["global"] = t.errorGlobalIncome;
      isValid = false;
    } else {
      const hasValidIncomeNominal = financialState.incomes.some(inc => inc.nominal > 0);
      if (!hasValidIncomeNominal) {
        financialState.incomes.forEach(inc => {
          if (inc.nominal <= 0) {
            newErrors[inc.id] = t.errorIncomeNominal;
          }
        });
        isValid = false;
      }
    }

    if (!isValid) {
      setErrors(newErrors);
      setHasCalculated(false);
      
      setTimeout(() => {
        const el = document.getElementById("section-income");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
      return;
    }

    setErrors({});
    setHasCalculated(true);
  };

  const handleReset = () => {
    const freshDefault = JSON.parse(JSON.stringify(DEFAULT_STATE));
    setFinancialState(freshDefault);
    setHasCalculated(false);
    setErrors({});
    localStorage.setItem("fyvian_financial_state", JSON.stringify(freshDefault));
    localStorage.setItem("fyvian_has_calculated", "false");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slateCustom-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Memuat kalkulator...</p>
        </div>
      </div>
    );
  }

  // Calculate projections on-the-fly if hasCalculated is active
  const projections: MonthlyProjection[] = hasCalculated
    ? calculateProjection(financialState, startMonthIndex, currentYear)
    : [];

  return (
    <main className="min-h-screen bg-slateCustom-50 text-slateCustom-900 pb-16">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slateCustom-100 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slateCustom-900 font-sans">
              Qimey
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Custom Sliding Language Toggle */}
            <button 
              type="button"
              onClick={toggleLanguage}
              className="relative flex items-center justify-between w-[72px] h-[34px] bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-full p-1 cursor-pointer transition-all duration-300 focus:outline-none select-none active:scale-95"
              aria-label="Switch Language"
            >
              <span className="text-[13px] z-10 pl-1">🇮🇩</span>
              <span className="text-[13px] z-10 pr-1">🇬🇧</span>
              <div 
                className={`absolute top-[3px] bottom-[3px] w-[30px] bg-white border border-slate-200 rounded-full shadow-sm transition-all duration-300 flex items-center justify-center text-[9px] font-extrabold text-slate-600 ${
                  lang === "id" ? "left-[3px]" : "left-[37px]"
                }`}
              >
                {lang === "id" ? "ID" : "EN"}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container (Body matches header width: max-w-4xl) */}
      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        {/* Intro Title */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slateCustom-900 leading-tight">
            {t.title}
          </h1>
        </div>

        {/* Dynamic Global Form Error */}
        {errors["global"] && (
          <div className="p-4 bg-danger-light border border-danger/30 text-danger rounded-xl text-xs font-medium">
            {errors["global"]}
          </div>
        )}

        {/* Input Form container */}
        <FormContainer
          state={financialState}
          onChange={setFinancialState}
          onSubmit={handleSubmit}
          onReset={handleReset}
          errors={errors}
          startMonthIndex={startMonthIndex}
          currentYear={currentYear}
          lang={lang}
          currency={currency}
          onCurrencyChange={setCurrency}
        />

        {/* Output Dashboard (scrolling down below the form) */}
        {hasCalculated && projections.length > 0 && (
          <Dashboard
            projections={projections}
            state={financialState}
            startMonthIndex={startMonthIndex}
            currentYear={currentYear}
            lang={lang}
            currency={currency}
          />
        )}
      </div>
    </main>
  );
}
