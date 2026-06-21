"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { MonthlyProjection } from "../types/finance";
import { formatCurrency, getCurrencyConfig } from "../utils/format";
import { Language, translations, INDONESIAN_MONTHS, ENGLISH_MONTHS } from "../utils/translations";

interface Props {
  projections: MonthlyProjection[];
  lang: Language;
  currency: string;
}

export default function ProjectionChart({ projections, lang, currency }: Props) {
  const [zoom, setZoom] = useState<"3b" | "6b" | "1t" | "all">("all");
  const t = translations[lang];
  const monthsList = lang === "id" ? INDONESIAN_MONTHS : ENGLISH_MONTHS;

  const N = projections.length;

  // Detect if projections span multiple years
  const isMultiYear = projections.length > 0 &&
    projections[projections.length - 1].tahun !== projections[0].tahun;

  // Map data to Recharts format
  const data = projections.map((p) => {
    const totalOutflow = p.cicilanUtang + p.pengeluaranRutin + p.pengeluaranSekaliBayar;
    // Use "Mon 'YY" format when spanning multiple years to avoid duplicate month names
    const label = isMultiYear
      ? `${monthsList[p.bulanIndex]} '${String(p.tahun).slice(2)}`
      : monthsList[p.bulanIndex];
    return {
      name: label,
      saldo: p.saldo,
      isNegative: p.saldo < 0,
      hasLunas: p.lunasCicilanIds.length > 0,
      inflow: p.pendapatanBersih,
      outflow: totalOutflow,
      cashflow: p.cashflow,
    };
  });

  const tickFormatter = (value: number) => {
    const absVal = Math.abs(value);
    const config = getCurrencyConfig(currency);
    const isIdrStyle = config.locale === "id-ID";
    const prefix = config.symbol ? `${config.symbol} ` : "";
    
    if (isIdrStyle) {
      if (absVal >= 1000000) return `${value / 1000000} jt`;
      if (absVal >= 1000) return `${value / 1000} rb`;
    } else {
      if (absVal >= 1000) return `${prefix}${value / 1000}k`;
    }
    return `${prefix}${value.toLocaleString()}`;
  };

  // Custom Dot renderer to style line dots based on their financial state
  const renderDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined) {
      return <circle cx={0} cy={0} r={0} key={`dot-fallback`} />;
    }
    
    let fill = "#1d9e75"; // Default brand green
    if (payload.isNegative) {
      fill = "#e24b4a"; // Red for deficit
    } else if (payload.hasLunas) {
      fill = "#ef9f27"; // Orange for month containing paid off installments
    }
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={5} 
        fill={fill} 
        stroke="#ffffff" 
        strokeWidth={2} 
        className="transition-all duration-300"
        key={`dot-${cx}-${cy}`}
      />
    );
  };

  // Custom Tooltip component for Trend View
  const TrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl text-xs border border-slate-800 space-y-1.5 animate-fadeIn">
          <p className="font-semibold text-[13px] border-b border-slate-800 pb-1 text-slate-200">
            {lang === "id" ? "Bulan" : "Month"} {item.name}
          </p>
          <div className="space-y-0.5">
            <div className="flex justify-between gap-6 text-slate-400">
              <span>{t.grossIncome}:</span>
              <span className="font-medium text-slate-200">{formatCurrency(item.inflow, currency)}</span>
            </div>
            <div className="flex justify-between gap-6 text-slate-400">
              <span>{lang === "id" ? "Pengeluaran Total:" : "Total Expenses:"}</span>
              <span className="font-medium text-danger-light">{formatCurrency(item.outflow, currency)}</span>
            </div>
            <div className="flex justify-between gap-6 text-slate-400 border-t border-slate-800/50 mt-1 pt-1 font-medium">
              <span>{t.cashflowTitle}:</span>
              <span className={item.cashflow >= 0 ? "text-brand-light" : "text-danger"}>
                {item.cashflow >= 0 ? "+" : ""}{formatCurrency(item.cashflow, currency)}
              </span>
            </div>
            <div className="flex justify-between gap-6 text-slate-400 border-t border-slate-800 mt-1 pt-1 font-bold text-sm">
              <span>{lang === "id" ? "Saldo Kumulatif:" : "Cumulative Balance:"}</span>
              <span className={item.isNegative ? "text-danger" : "text-brand"}>
                {formatCurrency(item.saldo, currency)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  let visibleMonths = N;
  if (zoom === "3b") visibleMonths = 3;
  else if (zoom === "6b") visibleMonths = 6;
  else if (zoom === "1t") visibleMonths = 12;

  const chartWidthPercent = Math.max(100, (N / visibleMonths) * 100);

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 md:p-6 space-y-4">
      {/* Scrollbar styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Chart Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">{t.chartTitle}</h4>
        </div>

        {/* Zoom Selector Buttons */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg w-fit">
          {(["3b", "6b", "1t", "all"] as const).map((r) => {
            let label = "";
            if (r === "3b") label = t.zoom3b;
            else if (r === "6b") label = t.zoom6b;
            else if (r === "1t") label = t.zoom1t;
            else if (r === "all") label = t.zoomSemua;

            const isActive = zoom === r;

            return (
              <button
                key={r}
                type="button"
                onClick={() => setZoom(r)}
                className={`py-1 px-2.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 active:scale-95"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-2">
        <div style={{ width: `${chartWidthPercent}%`, minWidth: `${N * 60}px` }} className="transition-all duration-200">
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d9e75" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1d9e75" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis 
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={tickFormatter}
                />
                <Tooltip content={<TrendTooltip />} />
                <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="4 4" />
                <Area 
                  type="monotone" 
                  dataKey="saldo" 
                  stroke="#1d9e75" 
                  strokeWidth={3} 
                  fillOpacity={1}
                  fill="url(#colorSaldo)"
                  dot={renderDot}
                  activeDot={{ r: 7, strokeWidth: 1 }}
                  className="drop-shadow-sm"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-slate-500 pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1.5 rounded-full bg-brand inline-block" />
          <span>{t.positiveBalance}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1.5 rounded-full bg-danger inline-block" />
          <span>{t.deficit}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1.5 rounded-full bg-warning inline-block" />
          <span>{t.paidOff}</span>
        </div>
      </div>
    </div>
  );
}
