"use client";

import React, { useState, useRef, useEffect } from "react";
import { BulanTahun } from "../types/finance";
import { Language, INDONESIAN_MONTHS, ENGLISH_MONTHS } from "../utils/translations";
import { LuChevronLeft, LuChevronRight, LuCalendar, LuInfinity } from "react-icons/lu";

interface Props {
  value: BulanTahun | null;
  onChange: (value: BulanTahun | null) => void;
  minDate: BulanTahun;
  maxDate: BulanTahun;
  allowNull?: boolean; // Allow "Tanpa Batas" option
  nullLabel?: string;
  lang: Language;
  accentColor?: string; // Tailwind color class prefix, e.g. "brand", "warning"
}

function toAbs(bt: BulanTahun): number {
  return bt.tahun * 12 + bt.bulan;
}

export default function MonthYearPicker({
  value,
  onChange,
  minDate,
  maxDate,
  allowNull = false,
  nullLabel,
  lang,
  accentColor = "brand",
}: Props) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value ? value.tahun : minDate.tahun);
  const containerRef = useRef<HTMLDivElement>(null);
  const monthsList = lang === "id" ? INDONESIAN_MONTHS : ENGLISH_MONTHS;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Reset viewYear when opened
  useEffect(() => {
    if (open) {
      setViewYear(value ? value.tahun : minDate.tahun);
    }
  }, [open]);

  const minAbs = toAbs(minDate);
  const maxAbs = toAbs(maxDate);

  const canPrevYear = viewYear > minDate.tahun;
  const canNextYear = viewYear < maxDate.tahun;

  const handleSelect = (bulan: number) => {
    onChange({ bulan, tahun: viewYear });
    setOpen(false);
  };

  const handleSetNull = () => {
    onChange(null);
    setOpen(false);
  };

  // Display text
  let displayText: string;
  if (value === null) {
    displayText = nullLabel || (lang === "id" ? "Tanpa Batas" : "Unlimited");
  } else {
    displayText = `${monthsList[value.bulan]} ${value.tahun}`;
  }

  // Accent color mappings for Tailwind classes
  const accentMap: Record<string, { border: string; ring: string; bg: string; bgLight: string; text: string; hoverBg: string }> = {
    brand: {
      border: "border-brand",
      ring: "ring-brand/20",
      bg: "bg-brand",
      bgLight: "bg-brand-bgLight",
      text: "text-brand-dark",
      hoverBg: "hover:bg-brand-bgLight/60",
    },
    warning: {
      border: "border-warning",
      ring: "ring-warning/20",
      bg: "bg-warning",
      bgLight: "bg-warning-light",
      text: "text-warning-dark",
      hoverBg: "hover:bg-warning-light/60",
    },
  };
  const accent = accentMap[accentColor] || accentMap.brand;

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-10 px-3 border rounded-lg text-sm bg-white flex items-center justify-between gap-2 transition-all duration-200 ${
          open
            ? `${accent.border} ring-2 ${accent.ring} outline-none`
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <LuCalendar size={14} className="text-slate-400 flex-shrink-0" />
          <span className={`truncate ${value === null ? "text-slate-400 italic" : "text-slate-700 font-medium"}`}>
            {displayText}
          </span>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Popover */}
      {open && (
        <div
          className="absolute z-50 mt-1.5 left-0 right-0 min-w-[240px] bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 animate-fadeIn overflow-hidden"
          style={{ animation: "fadeIn 0.15s ease-out" }}
        >
          {/* Year Navigation */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 bg-slate-50/70">
            <button
              type="button"
              onClick={() => canPrevYear && setViewYear(viewYear - 1)}
              disabled={!canPrevYear}
              className={`p-1 rounded-md transition-colors ${
                canPrevYear
                  ? "text-slate-600 hover:bg-slate-200/60 hover:text-slate-800"
                  : "text-slate-300 cursor-not-allowed"
              }`}
              aria-label="Previous year"
            >
              <LuChevronLeft size={16} />
            </button>
            <span className="text-sm font-bold text-slate-700 tabular-nums select-none">
              {viewYear}
            </span>
            <button
              type="button"
              onClick={() => canNextYear && setViewYear(viewYear + 1)}
              disabled={!canNextYear}
              className={`p-1 rounded-md transition-colors ${
                canNextYear
                  ? "text-slate-600 hover:bg-slate-200/60 hover:text-slate-800"
                  : "text-slate-300 cursor-not-allowed"
              }`}
              aria-label="Next year"
            >
              <LuChevronRight size={16} />
            </button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-1 p-2">
            {monthsList.map((monthName, idx) => {
              const abs = viewYear * 12 + idx;
              const isDisabled = abs < minAbs || abs > maxAbs;
              const isSelected = value !== null && value.bulan === idx && value.tahun === viewYear;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && handleSelect(idx)}
                  className={`py-2 px-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isSelected
                      ? `${accent.bg} text-white shadow-sm`
                      : isDisabled
                      ? "text-slate-300 cursor-not-allowed"
                      : `text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:scale-95`
                  }`}
                >
                  {monthName}
                </button>
              );
            })}
          </div>

          {/* Unlimited Option */}
          {allowNull && (
            <div className="px-2 pb-2">
              <button
                type="button"
                onClick={handleSetNull}
                className={`w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-150 ${
                  value === null
                    ? `${accent.bgLight} ${accent.text} ring-1 ${accent.ring}`
                    : `text-slate-500 hover:bg-slate-100 hover:text-slate-700`
                }`}
              >
                <LuInfinity size={13} />
                {nullLabel || (lang === "id" ? "Tanpa Batas" : "Unlimited")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
