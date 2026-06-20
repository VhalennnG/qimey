"use client";

import React from "react";
import {
  LineChart,
  Line,
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
  const t = translations[lang];
  const monthsList = lang === "id" ? INDONESIAN_MONTHS : ENGLISH_MONTHS;
  const curSymbol = getCurrencyConfig(currency).symbol;

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
      income: p.pendapatanBersih,
      outflow: totalOutflow,
      cashflow: p.cashflow,
    };
  });

  // Custom Dot renderer to style line dots based on their financial state
  const renderDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined) {
      return <circle cx={0} cy={0} r={0} />;
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

  // Custom Tooltip component for detailed breakdown on hover
  const CustomTooltip = ({ active, payload }: any) => {
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
              <span className="font-medium text-slate-200">{formatCurrency(item.income, currency)}</span>
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

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-800">{t.chartTitle}</h4>
        <span className="text-[10px] text-slate-400">{t.chartAssumption}</span>
      </div>

      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
          >
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
              tickFormatter={(value) => {
                const absVal = Math.abs(value);
                if (currency === "IDR") {
                  if (absVal >= 1000000) return `${value / 1000000} jt`;
                } else {
                  if (absVal >= 1000) return `${curSymbol}${value / 1000}k`;
                }
                return `${curSymbol}${value.toLocaleString()}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Dotted reference line at y=0 */}
            <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="4 4" />

            <Line 
              type="monotone" 
              dataKey="saldo" 
              stroke="#1d9e75" 
              strokeWidth={3} 
              dot={renderDot}
              activeDot={{ r: 7, strokeWidth: 1 }}
              className="drop-shadow-sm"
            />
          </LineChart>
        </ResponsiveContainer>
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
