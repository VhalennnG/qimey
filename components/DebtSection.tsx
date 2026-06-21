"use client";

import React from "react";
import { ItemBerkala, Periode, BulanTahun } from "../types/finance";
import {
  formatInputNumber,
  parseInputNumber,
  getCurrencyConfig,
} from "../utils/format";
import { Language, translations } from "../utils/translations";
import { LuTrash2, LuPlus, LuInfo, LuCreditCard } from "react-icons/lu";
import MonthYearPicker from "./MonthYearPicker";

interface Props {
  debts: ItemBerkala[];
  onChange: (debts: ItemBerkala[]) => void;
  lang: Language;
  currency: string;
  startMonthIndex: number;
  currentYear: number;
  endMonthIndex: number;
  endYear: number;
}

export default function DebtSection({
  debts,
  onChange,
  lang,
  currency,
  startMonthIndex,
  currentYear,
  endMonthIndex,
  endYear,
}: Props) {
  const t = translations[lang];
  const curConfig = getCurrencyConfig(currency);

  const projStart: BulanTahun = { bulan: startMonthIndex, tahun: currentYear };
  const projEnd: BulanTahun = { bulan: endMonthIndex, tahun: endYear };

  const addDebt = () => {
    const newDebt: ItemBerkala = {
      id: crypto.randomUUID(),
      nama: "",
      nominal: 0,
      periode: "bulanan",
      mulaiBulan: { bulan: startMonthIndex, tahun: currentYear },
      selesaiBulan: { bulan: startMonthIndex, tahun: currentYear },
    };
    onChange([...debts, newDebt]);
  };

  const removeDebt = (id: string) => {
    onChange(debts.filter((item) => item.id !== id));
  };

  const updateDebt = (id: string, fields: Partial<ItemBerkala>) => {
    onChange(
      debts.map((item) => (item.id === id ? { ...item, ...fields } : item)),
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-warning text-white flex items-center justify-center text-xs font-semibold">
            <LuCreditCard size={13} />
          </span>
          {t.debtTitle}
          <span className="text-[10px] bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 font-normal ml-1">
            {t.optional}
          </span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">{t.debtSub}</p>
      </div>

      <div className="space-y-4">
        {debts.map((debt, index) => (
          <div
            key={debt.id}
            className="p-5 rounded-xl border border-warning/30 bg-white shadow-sm hover:border-warning/50 transition-all duration-200"
            style={{ borderLeft: "4px solid #ef9f27" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-slate-700">
                {debt.nama ||
                  `${lang === "id" ? "Cicilan" : "Installment"} #${index + 1}`}
              </span>
              <button
                type="button"
                onClick={() => removeDebt(debt.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger-light/50 btn-hover-transition"
                aria-label="Hapus cicilan"
              >
                <LuTrash2 size={16} />
              </button>
            </div>

            {/* Name & Period Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.debtName}
                </label>
                <input
                  type="text"
                  value={debt.nama}
                  placeholder={
                    lang === "id"
                      ? "Misal: Cicilan Motor, KPR"
                      : "e.g. Car Installment, Mortgage"
                  }
                  onChange={(e) =>
                    updateDebt(debt.id, { nama: e.target.value })
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-warning focus:ring-2 focus:ring-warning/10"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.period}
                  <span className="inline-block ml-1 group relative cursor-pointer text-slate-400 hover:text-slate-600">
                    <LuInfo size={12} className="inline" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-48 p-2 bg-slate-800 text-[10px] text-white rounded shadow-lg z-50 text-center font-normal leading-normal">
                      {t.tooltipAssumption}
                    </span>
                  </span>
                </label>
                <select
                  value={debt.periode}
                  onChange={(e) =>
                    updateDebt(debt.id, { periode: e.target.value as Periode })
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-warning focus:ring-2 focus:ring-warning/10"
                >
                  <option value="bulanan">{t.monthly}</option>
                  <option value="mingguan">{t.weekly}</option>
                  <option value="harian">{t.daily}</option>
                  <option value="tahunan">{t.yearly}</option>
                </select>
              </div>
            </div>

            {/* Date Picker Row: Start & End */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">{t.startFrom}</label>
                <MonthYearPicker
                  value={debt.mulaiBulan}
                  onChange={(val) => {
                    if (val) {
                      const newFields: Partial<ItemBerkala> = { mulaiBulan: val };
                      const startAbs = val.tahun * 12 + val.bulan;
                      const endAbs = debt.selesaiBulan.tahun * 12 + debt.selesaiBulan.bulan;
                      if (startAbs > endAbs) {
                        newFields.selesaiBulan = val;
                      }
                      updateDebt(debt.id, newFields);
                    }
                  }}
                  minDate={projStart}
                  maxDate={projEnd}
                  lang={lang}
                  accentColor="warning"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">{t.until}</label>
                <MonthYearPicker
                  value={debt.selesaiBulan}
                  onChange={(val) => {
                    if (val) {
                      const endAbs = val.tahun * 12 + val.bulan;
                      const startAbs = debt.mulaiBulan.tahun * 12 + debt.mulaiBulan.bulan;
                      if (endAbs < startAbs) {
                        updateDebt(debt.id, { selesaiBulan: debt.mulaiBulan });
                      } else {
                        updateDebt(debt.id, { selesaiBulan: val });
                      }
                    }
                  }}
                  minDate={debt.mulaiBulan}
                  maxDate={projEnd}
                  lang={lang}
                  accentColor="warning"
                />
              </div>
            </div>

            {/* Nominal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {t.amount}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                    {curConfig.symbol}
                  </span>
                  <input
                    type="text"
                    value={formatInputNumber(debt.nominal, currency)}
                    placeholder="0"
                    onChange={(e) =>
                      updateDebt(debt.id, {
                        nominal: parseInputNumber(e.target.value),
                      })
                    }
                    className="w-full h-10 pl-10 pr-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-warning focus:ring-2 focus:ring-warning/10 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addDebt}
        className="w-full py-3 border border-dashed border-warning text-sm text-warning font-medium rounded-xl hover:bg-warning-light/20 flex items-center justify-center gap-2 btn-hover-transition"
      >
        <LuPlus size={16} /> {t.addDebt}
      </button>
    </div>
  );
}
