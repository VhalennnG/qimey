"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { MonthlyProjection } from "../types/finance";
import { formatCurrency, getCurrencyConfig } from "../utils/format";
import {
  Language,
  translations,
  INDONESIAN_MONTHS,
  ENGLISH_MONTHS,
} from "../utils/translations";

interface Props {
  projections: MonthlyProjection[];
  lang: Language;
  currency: string;
}

export default function ProjectionChart({
  projections,
  lang,
  currency,
}: Props) {
  const [chartView, setChartView] = useState<"trend" | "flow">("trend");
  const t = translations[lang];
  const monthsList = lang === "id" ? INDONESIAN_MONTHS : ENGLISH_MONTHS;
  const curSymbol = getCurrencyConfig(currency).symbol;

  // Detect if projections span multiple years
  const isMultiYear =
    projections.length > 0 &&
    projections[projections.length - 1].tahun !== projections[0].tahun;

  // Map data to Recharts format
  const data = projections.map((p) => {
    const totalOutflow =
      p.cicilanUtang + p.pengeluaranRutin + p.pengeluaranSekaliBayar;
    // Use "Mon 'YY" format when spanning multiple years to avoid duplicate month names
    const label = isMultiYear
      ? `${monthsList[p.bulanIndex]} '${String(p.tahun).slice(2)}`
      : monthsList[p.bulanIndex];
    return {
      name: label,
      saldo: p.saldo,
      isNegative: p.saldo < 0,
      hasLunas: p.lunasCicilanIds.length > 0,
      // Values for cash flow bar chart
      inflow: p.pendapatanBersih,
      debt: p.cicilanUtang,
      routine: p.pengeluaranRutin,
      oneTime: p.pengeluaranSekaliBayar,
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
              <span className="font-medium text-slate-200">
                {formatCurrency(item.inflow, currency)}
              </span>
            </div>
            <div className="flex justify-between gap-6 text-slate-400">
              <span>
                {lang === "id" ? "Pengeluaran Total:" : "Total Expenses:"}
              </span>
              <span className="font-medium text-danger-light">
                {formatCurrency(item.outflow, currency)}
              </span>
            </div>
            <div className="flex justify-between gap-6 text-slate-400 border-t border-slate-800/50 mt-1 pt-1 font-medium">
              <span>{t.cashflowTitle}:</span>
              <span
                className={
                  item.cashflow >= 0 ? "text-brand-light" : "text-danger"
                }
              >
                {item.cashflow >= 0 ? "+" : ""}
                {formatCurrency(item.cashflow, currency)}
              </span>
            </div>
            <div className="flex justify-between gap-6 text-slate-400 border-t border-slate-800 mt-1 pt-1 font-bold text-sm">
              <span>
                {lang === "id" ? "Saldo Kumulatif:" : "Cumulative Balance:"}
              </span>
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

  // Custom Tooltip component for Flow View
  const FlowTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl text-xs border border-slate-800 space-y-1.5 animate-fadeIn">
          <p className="font-semibold text-[13px] border-b border-slate-800 pb-1 text-slate-200">
            {lang === "id" ? "Bulan" : "Month"} {item.name}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between gap-6 text-slate-300 font-semibold border-b border-slate-800/60 pb-1">
              <span>{t.chartInflowLabel}:</span>
              <span className="text-emerald-400">
                {formatCurrency(item.inflow, currency)}
              </span>
            </div>

            <div className="space-y-0.5 pl-1.5 text-slate-400 border-l border-slate-800">
              <div className="flex justify-between gap-6">
                <span>• {t.compRoutine}:</span>
                <span>{formatCurrency(item.routine, currency)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>• {t.compDebt}:</span>
                <span>{formatCurrency(item.debt, currency)}</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>• {t.compOneTime}:</span>
                <span>{formatCurrency(item.oneTime, currency)}</span>
              </div>
            </div>

            <div className="flex justify-between gap-6 text-slate-300 font-semibold border-t border-slate-800 pt-1">
              <span>{t.chartOutflowLabel}:</span>
              <span className="text-red-400">
                {formatCurrency(item.outflow, currency)}
              </span>
            </div>

            <div className="flex justify-between gap-6 border-t border-slate-800 mt-1 pt-1 font-bold text-sm">
              <span>{t.cashflowTitle}:</span>
              <span
                className={
                  item.cashflow >= 0 ? "text-brand-light" : "text-danger"
                }
              >
                {item.cashflow >= 0 ? "+" : ""}
                {formatCurrency(item.cashflow, currency)}
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
      {/* Chart Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">
            {t.chartTitle}
          </h4>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg w-fit">
          <button
            type="button"
            onClick={() => setChartView("trend")}
            className={`py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
              chartView === "trend"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.chartViewTrend}
          </button>
          <button
            type="button"
            onClick={() => setChartView("flow")}
            className={`py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
              chartView === "flow"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.chartViewDetail}
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === "trend" ? (
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
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
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
          ) : (
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
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
              <Tooltip content={<FlowTooltip />} />
              <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="4 4" />

              {/* Inflow bar */}
              <Bar
                dataKey="inflow"
                name={t.chartInflowLabel}
                stackId="inflow"
                fill="#10b981"
                radius={[3, 3, 0, 0]}
                maxBarSize={30}
              />

              {/* Outflow stacked bars */}
              <Bar
                dataKey="routine"
                name={t.compRoutine}
                stackId="outflow"
                fill="#6366f1"
                maxBarSize={30}
              />
              <Bar
                dataKey="debt"
                name={t.compDebt}
                stackId="outflow"
                fill="#ef9f27"
                maxBarSize={30}
              />
              <Bar
                dataKey="oneTime"
                name={t.compOneTime}
                stackId="outflow"
                fill="#f43f5e"
                radius={[3, 3, 0, 0]}
                maxBarSize={30}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-slate-500 pt-2 border-t border-slate-50">
        {chartView === "trend" ? (
          <>
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
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
              <span>{t.chartInflowLabel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-500 inline-block" />
              <span>{t.compRoutine}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
              <span>{t.compDebt}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
              <span>{t.compOneTime}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
