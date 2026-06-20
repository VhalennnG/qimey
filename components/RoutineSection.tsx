"use client";

import React from "react";
import { PengeluaranRutin } from "../types/finance";
import { formatInputNumber, parseInputNumber, getCurrencyConfig } from "../utils/format";
import { Language, translations } from "../utils/translations";
import { LuTrash2, LuPlus, LuInfo, LuCalendarDays } from "react-icons/lu";

interface Props {
  expenses: PengeluaranRutin[];
  onChange: (expenses: PengeluaranRutin[]) => void;
  lang: Language;
  currency: string;
}

export default function RoutineSection({ expenses, onChange, lang, currency }: Props) {
  const t = translations[lang];
  const curConfig = getCurrencyConfig(currency);

  const addExpense = () => {
    const newExpense: PengeluaranRutin = {
      id: crypto.randomUUID(),
      title: "",
      nominal: 0,
      periode: "bulanan",
    };
    onChange([...expenses, newExpense]);
  };

  const removeExpense = (id: string) => {
    onChange(expenses.filter((item) => item.id !== id));
  };

  const updateExpense = (id: string, fields: Partial<PengeluaranRutin>) => {
    onChange(
      expenses.map((item) => (item.id === id ? { ...item, ...fields } : item))
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
            <LuCalendarDays size={13} />
          </span>
          {t.routineTitle}
          <span className="text-[10px] bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 font-normal ml-1">
            {t.optional}
          </span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">{t.routineSub}</p>
      </div>

      <div className="space-y-3">
        {expenses.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2 text-center border border-dashed border-slate-200 rounded-xl">
            {lang === "id" ? "Belum ada pengeluaran rutin ditambahkan." : "No routine expenses added yet."}
          </p>
        ) : (
          expenses.map((expense, index) => (
            <div
              key={expense.id}
              className="p-4 rounded-xl border border-indigo-100 bg-white shadow-sm hover:border-indigo-200 transition-all duration-200 flex flex-col md:flex-row md:items-end gap-3"
              style={{ borderLeft: "4px solid #6366f1" }}
            >
              <div className="flex-grow md:max-w-xs">
                <label className="block text-[10px] font-medium text-slate-400 mb-1">{t.routineName}</label>
                <input
                  type="text"
                  value={expense.title}
                  placeholder={lang === "id" ? "Misal: Makan, Internet" : "e.g. Food, Internet"}
                  onChange={(e) => updateExpense(expense.id, { title: e.target.value })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10"
                />
              </div>

              <div className="w-full md:w-36">
                <label className="block text-[10px] font-medium text-slate-400 mb-1">
                  {t.period}
                  <span className="inline-block ml-1 group relative cursor-pointer text-slate-400">
                    <LuInfo size={10} className="inline" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-40 p-2 bg-slate-800 text-[10px] text-white rounded shadow-lg z-50 text-center font-normal leading-normal">
                      {lang === "id" ? "Harian (x30) atau Mingguan (x4.33)" : "Daily (x30) or Weekly (x4.33)"}
                    </span>
                  </span>
                </label>
                <select
                  value={expense.periode}
                  onChange={(e) => updateExpense(expense.id, { periode: e.target.value as any })}
                  className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="bulanan">{t.monthly}</option>
                  <option value="mingguan">{t.weekly}</option>
                  <option value="harian">{t.daily}</option>
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
                    className="w-full h-9 pl-8 pr-3 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-indigo-500 font-medium"
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
          ))
        )}
      </div>

      <button
        type="button"
        onClick={addExpense}
        className="w-full py-3 border border-dashed border-indigo-300 text-sm text-indigo-600 font-medium rounded-xl hover:bg-indigo-50/50 flex items-center justify-center gap-2 btn-hover-transition"
      >
        <LuPlus size={16} /> {t.addRoutine}
      </button>
    </div>
  );
}
