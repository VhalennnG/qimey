"use client";

import React, { useState, useEffect } from "react";
import { FinancialState, MonthlyProjection } from "../types/finance";
import { calculateProjection } from "../utils/finance";
import { Language, translations } from "../utils/translations";
import FormContainer from "../components/FormContainer";
import Dashboard from "../components/Dashboard";
import Image from "next/image";

const DEFAULT_STATE: FinancialState = {
  incomes: [
    {
      id: "default-income",
      nama: "",
      nominal: 0,
      periode: "bulanan",
      mulaiBulan: { bulan: 5, tahun: 2026 },
      selesaiBulan: null,
      pajak: [],
    },
  ],
  tabungan: {
    saldoSaatIni: 0,
    include: false,
  },
  cicilanUtang: [],
  pengeluaranRutin: [],
  pengeluaranSekaliBayar: [],
};

function migrateState(state: any, startM: number, startY: number): FinancialState {
  if (!state) return state;
  const migrated = { ...state };
  
  if (migrated.incomes && Array.isArray(migrated.incomes)) {
    migrated.incomes = migrated.incomes.map((inc: any) => {
      if (!inc.mulaiBulan) {
        const legacyMasa = inc.masaBulan;
        const mulaiBulan = { bulan: startM, tahun: startY };
        let selesaiBulan = null;
        
        if (typeof legacyMasa === "number") {
          const totalMonths = legacyMasa;
          const endOffset = startM + totalMonths - 1;
          selesaiBulan = {
            bulan: endOffset % 12,
            tahun: startY + Math.floor(endOffset / 12),
          };
        }
        
        const { masaBulan, ...rest } = inc;
        return {
          ...rest,
          mulaiBulan,
          selesaiBulan,
        };
      }
      return inc;
    });
  }
  
  if (migrated.cicilanUtang && Array.isArray(migrated.cicilanUtang)) {
    migrated.cicilanUtang = migrated.cicilanUtang.map((debt: any) => {
      if (!debt.mulaiBulan) {
        const legacyTenor = debt.tenor || 1;
        const mulaiBulan = { bulan: startM, tahun: startY };
        const endOffset = startM + legacyTenor - 1;
        const selesaiBulan = {
          bulan: endOffset % 12,
          tahun: startY + Math.floor(endOffset / 12),
        };
        
        const { tenor, ...rest } = debt;
        return {
          ...rest,
          mulaiBulan,
          selesaiBulan,
        };
      }
      return debt;
    });
  }
  
  return migrated;
}

export default function MainPage() {
  const [financialState, setFinancialState] =
    useState<FinancialState>(DEFAULT_STATE);
  const [lastCalculatedState, setLastCalculatedState] =
    useState<FinancialState | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lang, setLang] = useState<Language>("id");
  const [currency, setCurrency] = useState<string>("");
  const [lastCalculatedCurrency, setLastCalculatedCurrency] =
    useState<string>("");

  const [mounted, setMounted] = useState(false);
  const [startMonthIndex, setStartMonthIndex] = useState(5); // Default: Juni
  const [currentYear, setCurrentYear] = useState(2026); // Default: 2026
  const [endMonthIndex, setEndMonthIndex] = useState(11); // Default: December
  const [endYear, setEndYear] = useState(2026); // Default: current year
  const [lastCalculatedEndMonth, setLastCalculatedEndMonth] = useState(11);
  const [lastCalculatedEndYear, setLastCalculatedEndYear] = useState(2026);

  const t = translations[lang];

  // 1. Initial Load (on mount)
  useEffect(() => {
    const d = new Date();
    const startM = d.getMonth();
    const startY = d.getFullYear();
    setStartMonthIndex(startM);
    setCurrentYear(startY);

    const savedState = localStorage.getItem("fyvian_financial_state");
    const savedCalc = localStorage.getItem("fyvian_has_calculated");
    const savedLang = localStorage.getItem("fyvian_lang") as Language;
    const savedCurrency = localStorage.getItem("fyvian_currency");
    const savedLastState = localStorage.getItem("fyvian_last_calculated_state");
    const savedLastCurrency = localStorage.getItem("fyvian_last_calculated_currency");
    const savedEndMonth = localStorage.getItem("fyvian_end_month");
    const savedEndYear = localStorage.getItem("fyvian_end_year");

    let loadedState: FinancialState | null = null;
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const migrated = migrateState(parsed, startM, startY);
        setFinancialState(migrated);
        loadedState = migrated;
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    } else {
      // Dynamic fallback
      setFinancialState({
        ...DEFAULT_STATE,
        incomes: [
          {
            id: "default-income",
            nama: "",
            nominal: 0,
            periode: "bulanan",
            mulaiBulan: { bulan: startM, tahun: startY },
            selesaiBulan: null,
            pajak: [],
          },
        ],
      });
    }
    
    let activeLang: Language = "id";
    if (savedLang === "id" || savedLang === "en") {
      setLang(savedLang);
      activeLang = savedLang;
    }
    
    let loadedCurrency = "";
    if (savedCurrency) {
      setCurrency(savedCurrency);
      loadedCurrency = savedCurrency;
    } else {
      setCurrency("");
      loadedCurrency = "";
    }

    if (savedCalc === "true") {
      setHasCalculated(true);
      if (savedLastState) {
        try {
          const parsedLast = JSON.parse(savedLastState);
          const migratedLast = migrateState(parsedLast, startM, startY);
          setLastCalculatedState(migratedLast);
        } catch (e) {
          console.error("Failed to parse saved last state", e);
        }
      } else if (loadedState) {
        setLastCalculatedState(loadedState);
      }
      if (savedLastCurrency) {
        setLastCalculatedCurrency(savedLastCurrency);
      } else {
        setLastCalculatedCurrency(loadedCurrency);
      }
    }

    if (savedEndMonth) {
      setEndMonthIndex(Number(savedEndMonth));
    }
    if (savedEndYear) {
      setEndYear(Number(savedEndYear));
    } else {
      setEndYear(startY);
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

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("fyvian_end_month", String(endMonthIndex));
  }, [endMonthIndex, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("fyvian_end_year", String(endYear));
  }, [endYear, mounted]);

  // 3. Language toggle
  const toggleLanguage = () => {
    setLang((prevLang) => {
      const nextLang = prevLang === "id" ? "en" : "id";
      // Currency is no longer affected by language toggle
      return nextLang;
    });
  };

  // Check if current inputs differ from last calculated ones
  const isDirty =
    hasCalculated &&
    (JSON.stringify(financialState) !== JSON.stringify(lastCalculatedState) ||
      currency !== lastCalculatedCurrency ||
      endMonthIndex !== lastCalculatedEndMonth ||
      endYear !== lastCalculatedEndYear);

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
      setLastCalculatedState(null);
      setLastCalculatedCurrency("");
      localStorage.removeItem("fyvian_last_calculated_state");
      localStorage.removeItem("fyvian_last_calculated_currency");

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
    setLastCalculatedState(financialState);
    setLastCalculatedCurrency(currency);
    setLastCalculatedEndMonth(endMonthIndex);
    setLastCalculatedEndYear(endYear);
    localStorage.setItem("fyvian_last_calculated_state", JSON.stringify(financialState));
    localStorage.setItem("fyvian_last_calculated_currency", currency);

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
    setLastCalculatedState(null);
    setLastCalculatedCurrency("");
    setLastCalculatedEndMonth(11);
    setLastCalculatedEndYear(currentYear);
    setEndMonthIndex(11);
    setEndYear(currentYear);
    setErrors({});
    localStorage.setItem(
      "fyvian_financial_state",
      JSON.stringify(freshDefault),
    );
    localStorage.setItem("fyvian_has_calculated", "false");
    localStorage.removeItem("fyvian_last_calculated_state");
    localStorage.removeItem("fyvian_last_calculated_currency");
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

  // Calculate projections based on last calculated state (so edits don't auto-update until submitted)
  const projections: MonthlyProjection[] = hasCalculated && lastCalculatedState
    ? calculateProjection(lastCalculatedState, startMonthIndex, currentYear, lastCalculatedEndMonth, lastCalculatedEndYear)
    : [];

  return (
    <main className="min-h-screen bg-slateCustom-50 text-slateCustom-900 pb-16">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slateCustom-100 px-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/qimey.png"
              alt="Qimey Logo"
              width={50}
              height={50}
              className="object-contain"
            />
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
          endMonthIndex={endMonthIndex}
          endYear={endYear}
          onEndMonthChange={setEndMonthIndex}
          onEndYearChange={setEndYear}
          lang={lang}
          currency={currency}
          onCurrencyChange={setCurrency}
          isDirty={isDirty}
          hasCalculated={hasCalculated}
        />

        {/* Output Dashboard (scrolling down below the form) */}
        {hasCalculated && projections.length > 0 && (
          <Dashboard
            projections={projections}
            state={lastCalculatedState || financialState}
            startMonthIndex={startMonthIndex}
            currentYear={currentYear}
            endMonthIndex={lastCalculatedEndMonth}
            endYear={lastCalculatedEndYear}
            lang={lang}
            currency={lastCalculatedCurrency || currency}
          />
        )}
      </div>
    </main>
  );
}
