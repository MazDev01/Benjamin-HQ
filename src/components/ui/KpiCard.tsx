"use client";

import {
  Target, TrendingUp, Award, Building2, DollarSign, Clock,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  target: Target,
  trending: TrendingUp,
  award: Award,
  building: Building2,
  dollar: DollarSign,
  clock: Clock,
};

type KpiCardProps = {
  label: string;
  value: string;
  delta: number;
  icon: string;
  sub?: string;
  currentNum?: number;
  targetNum?: number;
  targetLabel?: string;
};

export function KpiCard({ label, value, delta, icon, sub, currentNum, targetNum, targetLabel }: KpiCardProps) {
  const Icon = iconMap[icon] ?? TrendingUp;
  const positive = delta >= 0;

  const pct = (currentNum !== undefined && targetNum && targetNum > 0)
    ? Math.min(100, Math.round((currentNum / targetNum) * 100))
    : null;

  const barColor = pct === null ? "#003366"
    : pct >= 80 ? "#059669"
    : pct >= 50 ? "#003366"
    : pct >= 30 ? "#d97706"
    : "#dc2626";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: "16px 18px",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Top: label + icon */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <p style={{ fontSize: "0.68rem", color: "#9ca3af", fontWeight: 600, margin: 0, letterSpacing: "0.03em" }}>
          {label}
        </p>
        <Icon size={14} color="#c0c0c0" />
      </div>

      {/* Value */}
      <p style={{ fontSize: "1.65rem", fontWeight: 700, color: "#2D2D2D", lineHeight: 1, margin: "0 0 8px" }}>
        {value}
      </p>

      {/* Delta */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: pct !== null ? 12 : 0 }}>
        <span style={{
          fontSize: "0.67rem", fontWeight: 700,
          color: positive ? "#059669" : "#dc2626",
        }}>
          {positive ? "▲" : "▼"} {Math.abs(delta)}%
        </span>
        {sub && <span style={{ fontSize: "0.62rem", color: "#9ca3af" }}>{sub}</span>}
      </div>

      {/* Progress bar */}
      {pct !== null && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: "0.6rem", color: "#c0c0c0" }}>เป้า {targetLabel}</span>
            <span style={{ fontSize: "0.63rem", fontWeight: 700, color: barColor }}>{pct}%</span>
          </div>
          <div style={{ height: 3, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              background: barColor,
              borderRadius: 99,
              transition: "width 0.6s ease",
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
