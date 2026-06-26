"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Clock, Target } from "lucide-react";
import { hqDealSummary } from "@/lib/mock";

function fmt(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K`;
  return `${v}`;
}

export function DealSummaryStrip() {
  const { won, lost, negotiating, annualTarget, ytdActual } = hqDealSummary;
  const pct = Math.round((ytdActual / annualTarget) * 100);

  const metrics = [
    {
      href: "/hq/pipeline",
      Icon: TrendingUp,
      label: "ปิดดีลแล้ว",
      value: `฿${fmt(won.value)}`,
      sub: `${won.count} ดีล`,
      valueColor: "#059669",
    },
    {
      href: "/hq/pipeline",
      Icon: TrendingDown,
      label: "เสียไป",
      value: `฿${fmt(lost.value)}`,
      sub: `${lost.count} ดีล`,
      valueColor: "#dc2626",
    },
    {
      href: "/hq/pipeline",
      Icon: Clock,
      label: "กำลังเจรจา",
      value: `฿${fmt(negotiating.value)}`,
      sub: `${negotiating.count} ดีล`,
      valueColor: "#2D2D2D",
    },
  ];

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      display: "grid",
      gridTemplateColumns: "1fr 1px 1fr 1px 1fr 1px 1.6fr",
      overflow: "hidden",
    }}>
      {metrics.map((m, i) => (
        <>
          <Link key={m.label} href={m.href} style={{ textDecoration: "none", padding: "16px 20px", display: "block" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <m.Icon size={12} color="#9ca3af" />
              <span style={{ fontSize: "0.66rem", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.04em" }}>
                {m.label}
              </span>
            </div>
            <p style={{ fontSize: "1.4rem", fontWeight: 700, color: m.valueColor, margin: "0 0 3px", lineHeight: 1 }}>
              {m.value}
            </p>
            <p style={{ fontSize: "0.65rem", color: "#9ca3af", margin: 0 }}>{m.sub}</p>
          </Link>

          {/* Divider */}
          <div key={`div-${i}`} style={{ background: "#e5e7eb" }} />
        </>
      ))}

      {/* Annual target */}
      <Link href="/hq/finance" style={{ textDecoration: "none", padding: "16px 20px", display: "block" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Target size={12} color="#9ca3af" />
          <span style={{ fontSize: "0.66rem", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.04em" }}>
            เป้ารายปี 2026
          </span>
          <span style={{ marginLeft: "auto", fontSize: "0.7rem", fontWeight: 700, color: "#003366" }}>
            {pct}%
          </span>
        </div>
        <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "#003366", margin: "0 0 8px", lineHeight: 1 }}>
          ฿{fmt(ytdActual)}
          <span style={{ fontSize: "0.72rem", fontWeight: 400, color: "#9ca3af", marginLeft: 5 }}>
            / ฿{fmt(annualTarget)}
          </span>
        </p>
        <div style={{ height: 4, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${Math.min(pct, 100)}%`,
            background: "#003366",
            borderRadius: 99,
            transition: "width .4s ease",
          }} />
        </div>
      </Link>
    </div>
  );
}
