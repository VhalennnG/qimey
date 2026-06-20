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
      nama: "",
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
  const [financialState, setFinancialState] =
    useState<FinancialState>(DEFAULT_STATE);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lang, setLang] = useState<Language>("id");
  const [currency, setCurrency] = useState<string>("Rp");

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
    let activeLang: Language = "id";
    if (savedLang === "id" || savedLang === "en") {
      setLang(savedLang);
      activeLang = savedLang;
    }
    if (savedCurrency) {
      setCurrency(savedCurrency);
    } else {
      setCurrency(activeLang === "en" ? "USD" : "Rp");
    }
    setMounted(true);
  }, []);

  // 2. Auto-save on State Change
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(
      "fyvian_financial_state",
      JSON.stringify(financialState),
    );
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
    setLang((prevLang) => {
      const nextLang = prevLang === "id" ? "en" : "id";

      // Update currency if it matches the default of the previous language
      setCurrency((prevCurr) => {
        const isPrevIdDefault =
          prevLang === "id" && (prevCurr === "Rp" || prevCurr === "IDR");
        const isPrevEnDefault = prevLang === "en" && prevCurr === "USD";

        if (isPrevIdDefault) {
          return "USD";
        }
        if (isPrevEnDefault) {
          return "Rp";
        }
        return prevCurr;
      });

      return nextLang;
    });
  };

  // 4. Form Validation and Submit handler
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (financialState.incomes.length === 0) {
      newErrors["global"] = t.errorGlobalIncome;
      isValid = false;
    } else {
      const hasValidIncomeNominal = financialState.incomes.some(
        (inc) => inc.nominal > 0,
      );
      if (!hasValidIncomeNominal) {
        financialState.incomes.forEach((inc) => {
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

    setTimeout(() => {
      const el = document.getElementById("dashboard-results");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleReset = () => {
    const freshDefault = JSON.parse(JSON.stringify(DEFAULT_STATE));
    setFinancialState(freshDefault);
    setHasCalculated(false);
    setErrors({});
    localStorage.setItem(
      "fyvian_financial_state",
      JSON.stringify(freshDefault),
    );
    localStorage.setItem("fyvian_has_calculated", "false");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slateCustom-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">
            Memuat kalkulator...
          </p>
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
            {/* Gooey Language Toggle Switch */}
            <div className="gooey-toggle-container flex-shrink-0 relative">
              <input
                className="gooey-toggle-input"
                type="checkbox"
                checked={lang === "en"}
                onChange={toggleLanguage}
                aria-label="Switch Language"
              />
              <svg
                className="gooey-toggle"
                viewBox="0 0 292 142"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  className="gooey-toggle-background"
                  d="M71 142C31.7878 142 0 110.212 0 71C0 31.7878 31.7878 0 71 0C110.212 0 119 30 146 30C173 30 182 0 221 0C260 0 292 31.7878 292 71C292 110.212 260.212 142 221 142C181.788 142 173 112 146 112C119 112 110.212 142 71 142Z"
                />
                <g filter="url('#goo-lang')">
                  <rect
                    className="gooey-toggle-circle-center"
                    x="13"
                    y="42"
                    width="116"
                    height="58"
                    rx="29"
                    fill="#fff"
                  />
                  <rect
                    className="gooey-toggle-circle left"
                    x="14"
                    y="14"
                    width="114"
                    height="114"
                    rx="58"
                    fill="#fff"
                  />
                  <rect
                    className="gooey-toggle-circle right"
                    x="164"
                    y="14"
                    width="114"
                    height="114"
                    rx="58"
                    fill="#fff"
                  />
                </g>
                <filter id="goo-lang">
                  <feGaussianBlur
                    in="SourceGraphic"
                    result="blur"
                    stdDeviation="10"
                  />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                    result="goo"
                  />
                </filter>
              </svg>
              {/* Absolute overlay flags */}
              <span
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-xs pointer-events-none select-none transition-all duration-300 z-20 ${
                  lang === "id"
                    ? "opacity-100 scale-110"
                    : "opacity-40 grayscale"
                }`}
                style={{ left: "24.3%" }}
              >
                🇮🇩
              </span>
              <span
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-xs pointer-events-none select-none transition-all duration-300 z-20 ${
                  lang === "en"
                    ? "opacity-100 scale-110"
                    : "opacity-40 grayscale"
                }`}
                style={{ left: "75.7%" }}
              >
                🇬🇧
              </span>
            </div>
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
