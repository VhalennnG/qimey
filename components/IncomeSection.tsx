"use client";

import React, { useState } from "react";
import {
  Income,
  Pajak,
  Periode,
  JenisPotongan,
  BulanTahun,
} from "../types/finance";
import {
  formatInputNumber,
  parseInputNumber,
  getCurrencyConfig,
} from "../utils/format";
import { Language, translations } from "../utils/translations";
import {
  LuTrash2,
  LuPlus,
  LuInfo,
  LuChevronDown,
  LuChevronUp,
  LuReceipt,
  LuWallet,
} from "react-icons/lu";
import MonthYearPicker from "./MonthYearPicker";

interface Props {
  incomes: Income[];
  onChange: (incomes: Income[]) => void;
  errors: Record<string, string>;
  lang: Language;
  currency: string;
  startMonthIndex: number;
  currentYear: number;
  endMonthIndex: number;
  endYear: number;
}

export default function IncomeSection({
  incomes,
  onChange,
  errors,
  lang,
  currency,
  startMonthIndex,
  currentYear,
  endMonthIndex,
  endYear,
}: Props) {
  const [expandedTaxId, setExpandedTaxId] = useState<string | null>(null);
  const t = translations[lang];
  const curConfig = getCurrencyConfig(currency);

  const projStart: BulanTahun = { bulan: startMonthIndex, tahun: currentYear };
  const projEnd: BulanTahun = { bulan: endMonthIndex, tahun: endYear };

  const addIncome = () => {
    const newIncome: Income = {
      id: crypto.randomUUID(),
      nama: "",
      nominal: 0,
      periode: "bulanan",
      mulaiBulan: { bulan: startMonthIndex, tahun: currentYear },
      selesaiBulan: null,
      pajak: [],
    };
    onChange([...incomes, newIncome]);
  };

  const removeIncome = (id: string) => {
    onChange(incomes.filter((item) => item.id !== id));
  };

  const updateIncome = (id: string, fields: Partial<Income>) => {
    onChange(
      incomes.map((item) => (item.id === id ? { ...item, ...fields } : item)),
    );
  };

  const addTax = (incomeId: string) => {
    const income = incomes.find((item) => item.id === incomeId);
    if (!income) return;
    const newTax: Pajak = {
      id: crypto.randomUUID(),
      nama: "",
      jenis: "persen",
      nilai: 0,
    };
    updateIncome(incomeId, { pajak: [...income.pajak, newTax] });
  };

  const removeTax = (incomeId: string, taxId: string) => {
    const income = incomes.find((item) => item.id === incomeId);
    if (!income) return;
    updateIncome(incomeId, {
      pajak: income.pajak.filter((tax) => tax.id !== taxId),
    });
  };

  const updateTax = (
    incomeId: string,
    taxId: string,
    fields: Partial<Pajak>,
  ) => {
    const income = incomes.find((item) => item.id === incomeId);
    if (!income) return;
    updateIncome(incomeId, {
      pajak: income.pajak.map((tax) =>
        tax.id === taxId ? { ...tax, ...fields } : tax,
      ),
    });
  };

  const toggleTaxSection = (incomeId: string) => {
    setExpandedTaxId(expandedTaxId === incomeId ? null : incomeId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-semibold">
              <LuWallet size={13} />
            </span>
            {t.incomeTitle}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{t.incomeSub}</p>
        </div>
      </div>

      <div className="space-y-4">
        {incomes.map((income, index) => {
          const hasError = errors[income.id] !== undefined;
          return (
            <div
              key={income.id}
              className={`p-5 rounded-xl border border-brand-light/30 bg-white shadow-sm relative focus-within:z-20 transition-all duration-200 ${
                hasError
                  ? "border-danger ring-1 ring-danger/50"
                  : "hover:border-brand/40"
              }`}
              style={{ borderLeft: "4px solid #1d9e75" }}
            >
              {/* Card Header */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-slate-700">
                  {income.nama || `${t.incomeLabel} #${index + 1}`}
                </span>
                <button
                  type="button"
                  onClick={() => removeIncome(income.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger-light/50 btn-hover-transition"
                  aria-label="Hapus income"
                >
                  <LuTrash2 size={16} />
                </button>
              </div>

              {/* Name & Period Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    {t.incomeNameLabel}
                  </label>
                  <input
                    type="text"
                    value={income.nama}
                    placeholder={
                      lang === "id"
                        ? "Misal: Gaji Pokok, Freelance"
                        : "e.g. Base Salary, Freelance"
                    }
                    onChange={(e) =>
                      updateIncome(income.id, { nama: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
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
                    value={income.periode}
                    onChange={(e) =>
                      updateIncome(income.id, {
                        periode: e.target.value as Periode,
                      })
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
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
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    {t.startFrom}
                  </label>
                  <MonthYearPicker
                    value={income.mulaiBulan}
                    onChange={(val) => {
                      if (val) {
                        // Ensure start doesn't exceed end
                        const newFields: Partial<Income> = { mulaiBulan: val };
                        if (income.selesaiBulan) {
                          const startAbs = val.tahun * 12 + val.bulan;
                          const endAbs =
                            income.selesaiBulan.tahun * 12 +
                            income.selesaiBulan.bulan;
                          if (startAbs > endAbs) {
                            newFields.selesaiBulan = val;
                          }
                        }
                        updateIncome(income.id, newFields);
                      }
                    }}
                    minDate={projStart}
                    maxDate={projEnd}
                    lang={lang}
                    accentColor="brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    {t.until}
                  </label>
                  <MonthYearPicker
                    value={income.selesaiBulan}
                    onChange={(val) => {
                      if (val) {
                        // Ensure end doesn't precede start
                        const endAbs = val.tahun * 12 + val.bulan;
                        const startAbs =
                          income.mulaiBulan.tahun * 12 +
                          income.mulaiBulan.bulan;
                        if (endAbs < startAbs) {
                          updateIncome(income.id, {
                            selesaiBulan: income.mulaiBulan,
                          });
                        } else {
                          updateIncome(income.id, { selesaiBulan: val });
                        }
                      } else {
                        updateIncome(income.id, { selesaiBulan: null });
                      }
                    }}
                    minDate={income.mulaiBulan}
                    maxDate={projEnd}
                    allowNull={true}
                    nullLabel={t.noLimit}
                    lang={lang}
                    accentColor="brand"
                  />
                </div>
              </div>

              {/* Nominal Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
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
                      value={formatInputNumber(income.nominal, currency)}
                      placeholder="0"
                      onChange={(e) =>
                        updateIncome(income.id, {
                          nominal: parseInputNumber(e.target.value),
                        })
                      }
                      className="w-full h-10 pl-10 pr-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Validation Error Message */}
              {hasError && (
                <p className="text-xs text-danger mt-2 font-medium">
                  {errors[income.id]}
                </p>
              )}

              {/* Tax Toggle Section */}
              <div className="mt-4 bg-slateCustom-50 rounded-lg border border-slate-100 p-3">
                <button
                  type="button"
                  onClick={() => toggleTaxSection(income.id)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-brand-bgLight text-brand-dark">
                      <LuReceipt size={14} />
                    </div>
                    <span className="text-xs font-medium text-slate-700">
                      {income.pajak.length > 0
                        ? `${income.pajak.length} ${t.taxCount}`
                        : t.taxToggle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-brand-dark hover:underline">
                      {expandedTaxId === income.id
                        ? lang === "id"
                          ? "Sembunyikan"
                          : "Hide"
                        : `${t.changeTax} / ${t.addTaxShort}`}
                    </span>
                    {expandedTaxId === income.id ? (
                      <LuChevronUp size={14} className="text-slate-400" />
                    ) : (
                      <LuChevronDown size={14} className="text-slate-400" />
                    )}
                  </div>
                </button>

                {expandedTaxId === income.id && (
                  <div className="mt-3 space-y-3 pt-3 border-t border-slate-200/60">
                    {income.pajak.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic text-center py-2">
                        {t.taxNone}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {income.pajak.map((tax) => (
                          <div key={tax.id} className="flex flex-col sm:flex-row gap-2 sm:items-center pb-3 sm:pb-0 border-b border-slate-200/40 sm:border-0 last:border-0">
                            <div className="flex gap-2 w-full sm:flex-[2]">
                              <input
                                type="text"
                                value={tax.nama}
                                placeholder={
                                  lang === "id"
                                    ? "Nama Potongan (misal: PPh 21)"
                                    : "Deduction Name (e.g. Tax)"
                                }
                                onChange={(e) =>
                                  updateTax(income.id, tax.id, {
                                    nama: e.target.value,
                                  })
                                }
                                className="w-full h-9 px-2 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-brand"
                              />
                              <button
                                type="button"
                                onClick={() => removeTax(income.id, tax.id)}
                                className="p-2 text-slate-400 hover:text-danger rounded hover:bg-slate-100 btn-hover-transition sm:hidden"
                                aria-label="Hapus potongan"
                              >
                                <LuTrash2 size={16} />
                              </button>
                            </div>

                            <div className="flex gap-2 w-full sm:flex-[2.5]">
                              <select
                                value={tax.jenis}
                                onChange={(e) =>
                                  updateTax(income.id, tax.id, {
                                    jenis: e.target.value as JenisPotongan,
                                  })
                                }
                                className="flex-[1] min-w-0 h-9 px-2 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-brand"
                              >
                                <option value="persen">{t.taxPercent}</option>
                                <option value="nominal">{t.taxNominal}</option>
                              </select>

                              <div className="flex-[1.5] min-w-0 relative">
                                {tax.jenis === "nominal" && (
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                                    {curConfig.symbol}
                                  </span>
                                )}
                                <input
                                  type="text"
                                  value={
                                    tax.jenis === "nominal"
                                      ? formatInputNumber(tax.nilai, currency)
                                      : tax.nilai || ""
                                  }
                                  placeholder="0"
                                  onChange={(e) => {
                                    const rawVal = e.target.value;
                                    const numeric =
                                      tax.jenis === "nominal"
                                        ? parseInputNumber(rawVal)
                                        : Number(rawVal.replace(/[^0-9.]/g, ""));
                                    updateTax(income.id, tax.id, {
                                      nilai: isNaN(numeric) ? 0 : numeric,
                                    });
                                  }}
                                  className={`w-full h-9 px-2 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-brand font-medium ${
                                    tax.jenis === "nominal" ? "pl-7" : "pr-6"
                                  }`}
                                />
                                {tax.jenis === "persen" && (
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                                    %
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeTax(income.id, tax.id)}
                              className="hidden sm:inline-flex p-1 text-slate-400 hover:text-danger rounded hover:bg-slate-100 btn-hover-transition"
                              aria-label="Hapus potongan"
                            >
                              <LuTrash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => addTax(income.id)}
                      className="w-full py-1.5 border border-dashed border-brand-light text-[11px] text-brand-dark font-medium rounded-md hover:bg-brand-bgLight/40 flex items-center justify-center gap-1 btn-hover-transition"
                    >
                      <LuPlus size={12} /> {t.addTax}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addIncome}
        className="w-full py-3 border border-dashed border-brand text-sm text-brand font-medium rounded-xl hover:bg-brand-bgLight/20 flex items-center justify-center gap-2 btn-hover-transition"
      >
        <LuPlus size={16} /> {t.addIncome}
      </button>
    </div>
  );
}
