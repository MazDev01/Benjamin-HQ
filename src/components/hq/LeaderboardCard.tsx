"use client";

import Link from "next/link";
import { dealerLeaderboard } from "@/lib/mock";
import { TrendingUp, Trophy, AlertTriangle, AlertCircle } from "lucide-react";

const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
  boxShadow: "0 2px 14px rgba(0,0,0,.07)", overflow: "hidden",
};

const RANK_COLORS = [
  { bg: "#fbbf24", text: "#78350f" },
  { bg: "#C0C0C0", text: "#fff" },
  { bg: "#f59e0b", text: "#fff" },
];

export function LeaderboardCard() {
  const ranked = [...dealerLeaderboard]
    .filter(d => d.status === "active")
    .sort((a, b) => b.revenueActual - a.revenueActual);

  return (
    <div style={CARD}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 14px", borderBottom: "1px solid #e5e7eb" }}>
        <div>
          <p style={{ fontSize: "0.86rem", fontWeight: 700, color: "#2D2D2D", margin: 0, display: "flex", alignItems: "center", gap: 6 }}><Trophy size={15} color="#f59e0b" strokeWidth={2} /> อันดับสาขา</p>
          <p style={{ fontSize: "0.72rem", color: "#6b7280", margin: "2px 0 0" }}>เดือนมิถุนายน 2026</p>
        </div>
        <Link href="/hq/dealers" style={{ fontSize: "0.72rem", color: "#003366", fontWeight: 600, textDecoration: "none" }}>ดูทั้งหมด →</Link>
      </div>

      {/* List */}
      <div>
        {ranked.map((d, i) => {
          const targetPct = d.revenueTarget > 0 ? Math.min(100, Math.round(d.revenueActual / d.revenueTarget * 100)) : 0;
          const revenueLabel = `฿${(d.revenueActual / 1_000_000).toFixed(1)}M`;
          const rankColor = RANK_COLORS[i] ?? { bg: "#f0f0f5", text: "#6b7280" };

          const isAtRisk  = targetPct < 50;
          const isWarn    = targetPct >= 50 && targetPct < 70;
          const barColor  = isAtRisk ? "#dc2626" : isWarn ? "#d97706" : "#003366";
          const pctColor  = isAtRisk ? "#dc2626" : isWarn ? "#d97706" : "#2D2D2D";
          const rowBg     = isAtRisk ? "#fef2f2" : "";

          return (
            <div key={d.code}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid #f0f4f8", background: rowBg, position: "relative" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isAtRisk ? "#fee2e2" : "#f8f9fb"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = rowBg; }}>

              {/* At-risk left border accent */}
              {isAtRisk && (
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "#dc2626", borderRadius: "0 2px 2px 0" }} />
              )}

              {/* Rank badge */}
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: rankColor.bg, color: rankColor.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, flexShrink: 0 }}>
                {i + 1}
              </div>

              {/* Branch info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2D2D2D", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {d.name.startsWith("Benjamin ") ? d.name.slice(9) : d.name}
                </p>
                <p style={{ fontSize: "0.65rem", color: "#6b7280", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                  <span>{d.region} · {d.activeProjects} โครงการ</span>
                  {isAtRisk && <AlertCircle size={11} color="#dc2626" strokeWidth={2.5} />}
                  {isWarn && <AlertTriangle size={11} color="#d97706" strokeWidth={2.5} />}
                </p>
              </div>

              {/* Mini circular ring — % ต่อเป้า */}
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <svg width="44" height="44" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="17" fill="none" stroke="#e5e7eb" strokeWidth="4.5" />
                  <circle
                    cx="22" cy="22" r="17"
                    fill="none"
                    stroke={barColor}
                    strokeWidth="4.5"
                    strokeDasharray={`${2 * Math.PI * 17 * targetPct / 100} ${2 * Math.PI * 17}`}
                    strokeLinecap="round"
                    transform="rotate(-90 22 22)"
                    style={{ transition: "stroke-dasharray 0.4s ease" }}
                  />
                  <text x="22" y="26" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={pctColor}>
                    {targetPct}%
                  </text>
                </svg>
                <span style={{ fontSize: "0.58rem", color: "#9ca3af", lineHeight: 1 }}>เป้า</span>
              </div>

              {/* Revenue */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 800, color: "#2D2D2D", margin: 0 }}>{revenueLabel}</p>
                <p style={{ fontSize: "0.62rem", color: "#6b7280", margin: "2px 0 0", display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end" }}>
                  <TrendingUp size={9} /> {d.winRate}% ปิดการขาย
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
