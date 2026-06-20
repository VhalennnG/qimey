"use client";

import React, { useState } from "react";
import { Income, Pajak, Periode, JenisPotongan } from "../types/finance";
import { formatInputNumber, parseInputNumber, CURRENCIES } from "../utils/format";
import { Language, translations } from "../utils/translations";
import { Trash2, Plus, Info, ChevronDown, ChevronUp, Receipt } from "lucide-react";

interface Props {
  incomes: Income[];
  onChange: (incomes: Income[]) => void;
  errors: Record<string, string>;
  lang: Language;
  currency: string;
}

export default function IncomeSection({ incomes, onChange, errors, lang, currency }: Props) {
  const [expandedTaxId, setExpandedTaxId] = useState<string | null>(null);
  const t = translations[lang];
  const curConfig = CURRENCIES[currency] || CURRENCIES.IDR;

  const addIncome = () => {
    const newIncome: Income = {
      id: crypto.randomUUID(),
      nama: "",
      nominal: 0,
      periode: "bulanan",
      masaBulan: null,
      pajak: [],
    };
    onChange([...incomes, newIncome]);
  };

  const removeIncome = (id: string) => {
    onChange(incomes.filter((item) => item.id !== id));
  };

  const updateIncome = (id: string, fields: Partial<Income>) => {
    onChange(
      incomes.map((item) => (item.id === id ? { ...item, ...fields } : item))
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

  const updateTax = (incomeId: string, taxId: string, fields: Partial<Pajak>) => {
    const income = incomes.find((item) => item.id === incomeId);
    if (!income) return;
    updateIncome(incomeId, {
      pajak: income.pajak.map((tax) => (tax.id === taxId ? { ...tax, ...fields } : tax)),
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
            <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold font-sans">1</span>
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
              className={`p-5 rounded-xl border border-brand-light/30 bg-white shadow-sm relative overflow-hidden transition-all duration-200 ${
                hasError ? "border-danger ring-1 ring-danger/50" : "hover:border-brand/40"
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
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t.incomeNameLabel}</label>
                  <input
                    type="text"
                    value={income.nama}
                    placeholder={lang === "id" ? "Misal: Gaji Pokok, Freelance" : "e.g. Base Salary, Freelance"}
                    onChange={(e) => updateIncome(income.id, { nama: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    {t.period}
                    <span className="inline-block ml-1 group relative cursor-pointer text-slate-400 hover:text-slate-600">
                      <Info size={12} className="inline" />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-48 p-2 bg-slate-800 text-[10px] text-white rounded shadow-lg z-50 text-center font-normal leading-normal">
                        {t.tooltipAssumption}
                      </span>
                    </span>
                  </label>
                  <select
                    value={income.periode}
                    onChange={(e) => updateIncome(income.id, { periode: e.target.value as Periode })}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                  >
                    <option value="bulanan">{t.monthly}</option>
                    <option value="mingguan">{t.weekly}</option>
                    <option value="harian">{t.daily}</option>
                    <option value="tahunan">{t.yearly}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t.duration}</label>
                  <select
                    value={income.masaBulan === null ? "null" : String(income.masaBulan)}
                    onChange={(e) => {
                      const val = e.target.value === "null" ? null : Number(e.target.value);
                      updateIncome(income.id, { masaBulan: val });
                    }}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
                  >
                    <option value="null">{t.unlimited}</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1)}>
                        {i + 1} {t.months}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nominal Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t.amount}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">{curConfig.symbol}</span>
                    <input
                      type="text"
                      value={formatInputNumber(income.nominal, currency)}
                      placeholder="0"
                      onChange={(e) => updateIncome(income.id, { nominal: parseInputNumber(e.target.value) })}
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
                      <Receipt size={14} />
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
                        ? (lang === "id" ? "Sembunyikan" : "Hide") 
                        : `${t.changeTax} / ${t.addTaxShort}`}
                    </span>
                    {expandedTaxId === income.id ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
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
                          <div key={tax.id} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={tax.nama}
                              placeholder={lang === "id" ? "Nama Potongan (misal: PPh 21)" : "Deduction Name (e.g. Tax)"}
                              onChange={(e) => updateTax(income.id, tax.id, { nama: e.target.value })}
                              className="flex-[2] h-9 px-2 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-brand"
                            />
                            
                            <select
                              value={tax.jenis}
                              onChange={(e) => updateTax(income.id, tax.id, { jenis: e.target.value as JenisPotongan })}
                              className="flex-[1] h-9 px-2 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-brand"
                            >
                              <option value="persen">{t.taxPercent}</option>
                              <option value="nominal">{t.taxNominal}</option>
                            </select>

                            <div className="flex-[1.5] relative">
                              {tax.jenis === "nominal" && (
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">{curConfig.symbol}</span>
                              )}
                              <input
                                type="text"
                                value={tax.jenis === "nominal" ? formatInputNumber(tax.nilai, currency) : tax.nilai || ""}
                                placeholder="0"
                                onChange={(e) => {
                                  const rawVal = e.target.value;
                                  const numeric = tax.jenis === "nominal" ? parseInputNumber(rawVal) : Number(rawVal.replace(/[^0-9.]/g, ""));
                                  updateTax(income.id, tax.id, { nilai: isNaN(numeric) ? 0 : numeric });
                                }}
                                className={`w-full h-9 px-2 border border-slate-200 rounded-md text-xs bg-white focus:outline-none focus:border-brand font-medium ${
                                  tax.jenis === "nominal" ? "pl-7" : "pr-6"
                                }`}
                              />
                              {tax.jenis === "persen" && (
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%</span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => removeTax(income.id, tax.id)}
                              className="p-1 text-slate-400 hover:text-danger rounded hover:bg-slate-100 btn-hover-transition"
                              aria-label="Hapus potongan"
                            >
                              <Trash2 size={14} />
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
                      <Plus size={12} /> {t.addTax}
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
        <Plus size={16} /> {t.addIncome}
      </button>
    </div>
  );
}
