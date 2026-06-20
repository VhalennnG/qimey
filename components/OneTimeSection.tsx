"use client";

import React from "react";
import { PengeluaranSekaliBayar } from "../types/finance";
import { formatInputNumber, parseInputNumber, getCurrencyConfig } from "../utils/format";
import { Language, translations, INDONESIAN_MONTHS, ENGLISH_MONTHS } from "../utils/translations";
import { LuTrash2, LuPlus, LuShoppingBag } from "react-icons/lu";

interface Props {
  expenses: PengeluaranSekaliBayar[];
  onChange: (expenses: PengeluaranSekaliBayar[]) => void;
  startMonthIndex: number;
  currentYear: number;
  endMonthIndex: number;
  endYear: number;
  lang: Language;
  currency: string;
}

/**
 * Helper to normalize bulanKejadian to { bulan, tahun } format,
 * supporting both legacy (number) and new object formats.
 */
function normalizeBulanKejadian(
  bk: number | { bulan: number; tahun: number },
  fallbackYear: number
): { bulan: number; tahun: number } {
  if (typeof bk === "number") {
    return { bulan: bk, tahun: fallbackYear };
  }
  return bk;
}

export default function OneTimeSection({
  expenses,
  onChange,
  startMonthIndex,
  currentYear,
  endMonthIndex,
  endYear,
  lang,
  currency,
}: Props) {
  const t = translations[lang];
  const monthsList = lang === "id" ? INDONESIAN_MONTHS : ENGLISH_MONTHS;
  const curConfig = getCurrencyConfig(currency);

  // Generate all available months from start to end (inclusive)
  const availableMonths: { bulan: number; tahun: number; label: string }[] = [];
  let y = currentYear;
  let m = startMonthIndex;
  while (y < endYear || (y === endYear && m <= endMonthIndex)) {
    availableMonths.push({
      bulan: m,
      tahun: y,
      label: `${monthsList[m]} ${y}`,
    });
    m++;
    if (m > 11) {
      m = 0;
      y++;
    }
  }

  const addExpense = () => {
    const newExpense: PengeluaranSekaliBayar = {
      id: crypto.randomUUID(),
      title: "",
      nominal: 0,
      bulanKejadian: { bulan: startMonthIndex, tahun: currentYear },
    };
    onChange([...expenses, newExpense]);
  };

  const removeExpense = (id: string) => {
    onChange(expenses.filter((item) => item.id !== id));
  };

  const updateExpense = (id: string, fields: Partial<PengeluaranSekaliBayar>) => {
    onChange(
      expenses.map((item) => (item.id === id ? { ...item, ...fields } : item))
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-semibold">
            <LuShoppingBag size={13} />
          </span>
          {t.oneTimeTitle}
          <span className="text-[10px] bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 font-normal ml-1">
            {t.optional}
          </span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">{t.oneTimeSub}</p>
      </div>

      <div className="space-y-3">
        {expenses.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2 text-center border border-dashed border-slate-200 rounded-xl">
            {lang === "id" ? "Belum ada pengeluaran sekali bayar ditambahkan." : "No one-time expenses added yet."}
          </p>
        ) : (
          expenses.map((expense) => {
            const normalized = normalizeBulanKejadian(expense.bulanKejadian, currentYear);
            // Encode as "bulan-tahun" string for the select value
            const selectValue = `${normalized.bulan}-${normalized.tahun}`;

            return (
              <div
                key={expense.id}
                className="p-4 rounded-xl border border-orange-100 bg-white shadow-sm hover:border-orange-200 transition-all duration-200 flex flex-col md:flex-row md:items-end gap-3"
                style={{ borderLeft: "4px solid #ea580c" }}
              >
                <div className="flex-grow md:max-w-xs">
                  <label className="block text-[10px] font-medium text-slate-400 mb-1">{t.oneTimeName}</label>
                  <input
                    type="text"
                    value={expense.title}
                    placeholder={lang === "id" ? "Misal: Pajak STNK, Servis AC" : "e.g. Tax Payment, AC Service"}
                    onChange={(e) => updateExpense(expense.id, { title: e.target.value })}
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/10"
                  />
                </div>

                <div className="w-full md:w-48">
                  <label className="block text-[10px] font-medium text-slate-400 mb-1">{t.oneTimeMonth}</label>
                  <select
                    value={selectValue}
                    onChange={(e) => {
                      const [b, yr] = e.target.value.split("-").map(Number);
                      updateExpense(expense.id, { bulanKejadian: { bulan: b, tahun: yr } });
                    }}
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-orange-500"
                  >
                    {availableMonths.map((am) => (
                      <option key={`${am.bulan}-${am.tahun}`} value={`${am.bulan}-${am.tahun}`}>
                        {am.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-grow">
                  <label className="block text-[10px] font-medium text-slate-400 mb-1">{t.amount}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">{curConfig.symbol}</span>
                    <input
                      type="text"
                      value={formatInputNumber(expense.nominal, currency)}
                      placeholder="0"
                      onChange={(e) => updateExpense(expense.id, { nominal: parseInputNumber(e.target.value) })}
                      className="w-full h-9 pl-8 pr-3 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeExpense(expense.id)}
                  className="p-2 text-slate-400 hover:text-danger rounded-lg hover:bg-danger-light/50 self-end md:mb-0.5 btn-hover-transition"
                  aria-label="Hapus pengeluaran"
                >
                  <LuTrash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>

      <button
        type="button"
        onClick={addExpense}
        className="w-full py-3 border border-dashed border-orange-300 text-sm text-orange-600 font-medium rounded-xl hover:bg-orange-50/50 flex items-center justify-center gap-2 btn-hover-transition"
      >
        <LuPlus size={16} /> {t.addOneTime}
      </button>
    </div>
  );
}
