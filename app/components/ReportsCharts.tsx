"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Chart: any;
  }
}

interface ReportsChartsProps {
  monthLabels: string[];
  monthlyIncome: number[];
  monthlyExpense: number[];
  categoryLabels: string[];
  categoryAmounts: number[];
  projectLabels: string[];
  projectAmounts: number[];
}

export default function ReportsCharts({
  monthLabels,
  monthlyIncome,
  monthlyExpense,
  categoryLabels,
  categoryAmounts,
  projectLabels,
  projectAmounts,
}: ReportsChartsProps) {
  const monthChartRef = useRef<HTMLCanvasElement>(null);
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const projectChartRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartsRef = useRef<any[]>([]);

  const initCharts = () => {
    if (!window.Chart) return;

    chartsRef.current.forEach((c) => c.destroy());
    chartsRef.current = [];

    const Chart = window.Chart;

    // 1. Month-wise Bar chart
    if (monthChartRef.current) {
      const ctx = monthChartRef.current.getContext("2d");
      chartsRef.current.push(
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: monthLabels,
            datasets: [
              {
                label: "Expenses (₹)",
                data: monthlyExpense,
                backgroundColor: "rgba(239, 68, 68, 0.75)",
                borderColor: "rgba(239, 68, 68, 1)",
                borderWidth: 2,
                borderRadius: 6,
              },
              {
                label: "Income (₹)",
                data: monthlyIncome,
                backgroundColor: "rgba(16, 185, 129, 0.75)",
                borderColor: "rgba(16, 185, 129, 1)",
                borderWidth: 2,
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "top" } },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { callback: (v: number) => "₹" + v.toLocaleString() },
                grid: { color: "rgba(0,0,0,0.05)" },
              },
              x: { grid: { display: false } },
            },
          },
        })
      );
    }

    // 2. Category-wise Doughnut
    if (categoryChartRef.current) {
      const ctx = categoryChartRef.current.getContext("2d");
      const palette = [
        "#ef4444","#f97316","#eab308","#22c55e",
        "#3b82f6","#8b5cf6","#ec4899","#94a3b8",
        "#06b6d4","#a855f7","#f43f5e","#14b8a6",
      ];
      chartsRef.current.push(
        new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: categoryLabels.length ? categoryLabels : ["No data"],
            datasets: [
              {
                data: categoryAmounts.length ? categoryAmounts : [1],
                backgroundColor: palette.slice(0, Math.max(categoryLabels.length, 1)),
                borderWidth: 2,
                borderColor: "#fff",
                hoverOffset: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",
            plugins: {
              legend: {
                position: "right",
                labels: { padding: 14, font: { size: 12 } },
              },
              tooltip: {
                callbacks: {
                  label: (ctx: { label: string; parsed: number }) =>
                    ` ${ctx.label}: ₹${ctx.parsed.toLocaleString()}`,
                },
              },
            },
          },
        })
      );
    }

    // 3. Project-wise Horizontal Bar
    if (projectChartRef.current) {
      const ctx = projectChartRef.current.getContext("2d");
      chartsRef.current.push(
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: projectLabels.length ? projectLabels : ["No data"],
            datasets: [
              {
                label: "Total Spent (₹)",
                data: projectAmounts.length ? projectAmounts : [0],
                backgroundColor: projectAmounts.map(
                  (_, i) => `rgba(30, 91, 182, ${0.85 - i * 0.12 > 0.2 ? 0.85 - i * 0.12 : 0.2})`
                ),
                borderColor: "rgba(30, 91, 182, 1)",
                borderWidth: 2,
                borderRadius: 6,
              },
            ],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                beginAtZero: true,
                ticks: { callback: (v: number) => "₹" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v) },
                grid: { color: "rgba(0,0,0,0.05)" },
              },
              y: { grid: { display: false } },
            },
          },
        })
      );
    }
  };

  useEffect(() => {
    if (window.Chart) initCharts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthLabels, categoryLabels, projectLabels]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
        strategy="afterInteractive"
        onLoad={initCharts}
      />

      {/* Chart 1: Month-wise */}
      <div className="premium-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-text-primary">Month-wise Expense vs Income</h3>
            <p className="text-text-secondary text-sm">Monthly comparison for the current year</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-brand-blue rounded-full border border-blue-100">
            Bar Chart
          </span>
        </div>
        <div style={{ height: "320px" }}>
          <canvas ref={monthChartRef} />
        </div>
      </div>

      {/* Charts 2 & 3: Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="premium-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Category-wise Distribution</h3>
              <p className="text-text-secondary text-sm">Expenses by category</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100">
              Doughnut
            </span>
          </div>
          <div style={{ height: "280px" }}>
            <canvas ref={categoryChartRef} />
          </div>
        </div>

        <div className="premium-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Project-wise Summary</h3>
              <p className="text-text-secondary text-sm">Total expenses per project</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-brand-blue rounded-full border border-blue-100">
              Horizontal Bar
            </span>
          </div>
          <div style={{ height: "280px" }}>
            <canvas ref={projectChartRef} />
          </div>
        </div>
      </div>
    </>
  );
}
