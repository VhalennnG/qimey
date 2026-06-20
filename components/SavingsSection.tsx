"use client";

import React from "react";
import { Tabungan } from "../types/finance";
import { formatInputNumber, parseInputNumber, CURRENCIES } from "../utils/format";
import { Language, translations } from "../utils/translations";
import { PiggyBank } from "lucide-react";

interface Props {
  tabungan: Tabungan;
  onChange: (tabungan: Tabungan) => void;
  lang: Language;
  currency: string;
}

export default function SavingsSection({ tabungan, onChange, lang, currency }: Props) {
  const t = translations[lang];
  const curConfig = CURRENCIES[currency] || CURRENCIES.IDR;

  const toggleInclude = () => {
    onChange({
      ...tabungan,
      include: !tabungan.include,
    });
  };

  const updateSaldo = (val: string) => {
    onChange({
      ...tabungan,
      saldoSaatIni: parseInputNumber(val),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold font-sans">2</span>
          {t.savingsTitle}
          <span className="text-[10px] bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 font-normal ml-1">
            {t.optional}
          </span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">{t.savingsSub}</p>
      </div>

      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-brand/40 transition-all duration-200">
        {/* Toggle Panel */}
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-sm font-semibold text-slate-700 block">{t.savingsToggle}</span>
            <span className="text-xs text-slate-400 block mt-0.5">{t.savingsToggleSub}</span>
          </div>
          
          {/* Gooey SVG Toggle Switch */}
          <div className="gooey-toggle-container flex-shrink-0">
            <input 
              className="gooey-toggle-input" 
              type="checkbox" 
              checked={tabungan.include}
              onChange={toggleInclude}
              aria-label="Sertakan tabungan"
            />
            <svg className="gooey-toggle" viewBox="0 0 292 142" xmlns="http://www.w3.org/2000/svg">
              <path className="gooey-toggle-background" d="M71 142C31.7878 142 0 110.212 0 71C0 31.7878 31.7878 0 71 0C110.212 0 119 30 146 30C173 30 182 0 221 0C260 0 292 31.7878 292 71C292 110.212 260.212 142 221 142C181.788 142 173 112 146 112C119 112 110.212 142 71 142Z" />
              <rect className="gooey-toggle-icon on" x="64" y="39" width="12" height="64" rx="6" />
              <path className="gooey-toggle-icon off" fillRule="evenodd" d="M221 91C232.046 91 241 82.0457 241 71C241 59.9543 232.046 51 221 51C209.954 51 201 59.9543 201 71C201 82.0457 209.954 91 221 91ZM221 103C238.673 103 253 88.6731 253 71C253 53.3269 238.673 39 221 39C203.327 39 189 53.3269 189 71C189 88.6731 203.327 103 221 103Z" />
              <g filter="url('#goo-savings')">
                <rect className="gooey-toggle-circle-center" x="13" y="42" width="116" height="58" rx="29" fill="#fff"/>
                <rect className="gooey-toggle-circle left" x="14" y="14" width="114" height="114" rx="58" fill="#fff" />
                <rect className="gooey-toggle-circle right" x="164" y="14" width="114" height="114" rx="58" fill="#fff" />
              </g>
              <filter id="goo-savings">
                <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
              </filter>
            </svg>
          </div>
        </div>

        {/* Input Panel */}
        {tabungan.include && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4 animate-fadeIn">
            <div className="p-2 rounded-lg bg-brand-bgLight text-brand-dark hidden sm:block">
              <PiggyBank size={24} />
            </div>
            
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-500 mb-1">{t.savingsAmount}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">{curConfig.symbol}</span>
                <input
                  type="text"
                  value={formatInputNumber(tabungan.saldoSaatIni, currency)}
                  placeholder="0"
                  onChange={(e) => updateSaldo(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 font-medium"
                />
              </div>
            </div>

            <div className="text-[10px] bg-brand-bgLight text-brand-dark rounded-full px-3 py-1 font-semibold whitespace-nowrap self-end mb-2 sm:mb-0">
              {t.savingsBadge}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
