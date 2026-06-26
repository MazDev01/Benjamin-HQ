"use client";

import { useState } from "react";
import {
  Download, Users, Target, CheckCircle2, Trophy, TrendingDown,
} from "lucide-react";
import {
  hqPipelineStages, hqPipelineLostReasons, hqPipelineByProduct,
  dealerLeaderboard,
} from "@/lib/mock";
import { usePeriod } from "@/context/PeriodContext";
import { PeriodSelector } from "@/components/hq/PeriodSelector";

function fmtM(n: number) {
  return n >= 1_000_000 ? `฿${(n / 1_000_000).toFixed(1)}M` : `฿${(n / 1000).toFixed(0)}K`;
}

const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
  boxShadow: "0 2px 14px rgba(0,0,0,.07)",
};

// Color ramp: slate → light blue → blue → dark blue → navy
const STAGE_PALETTE = ["#94a3b8", "#60a5fa", "#2563eb", "#1e40af", "#003366"];

// ── Funnel ────────────────────────────────────────────────────────
function FunnelChart() {
  const maxCount = hqPipelineStages[0]?.count ?? 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {hqPipelineStages.map((stage, i) => {
        const prev      = hqPipelineStages[i - 1];
        const convRate  = prev ? Math.round((stage.count / prev.count) * 100) : null;
        const widthPct  = Math.round((stage.count / maxCount) * 100);
        const isLast    = i === hqPipelineStages.length - 1;
        const color     = STAGE_PALETTE[Math.min(i, STAGE_PALETTE.length - 1)];
        const convColor = !convRate ? "#6b7280"
          : convRate >= 70 ? "#059669"
          : convRate >= 50 ? "#d97706"
          : "#dc2626";

        return (
          <div key={stage.key}>
            {/* Conversion connector */}
            {convRate !== null && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0 4px 19px" }}>
                <div style={{ width: 1.5, height: 16, background: "#dde1e7", flexShrink: 0 }} />
                <span style={{
                  fontSize: "0.63rem", fontWeight: 700, color: convColor,
                  background: convColor + "18", borderRadius: 20,
                  padding: "2px 9px", border: `1px solid ${convColor}28`,
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <TrendingDown size={9} color={convColor} /> {convRate}% ผ่านมา
                </span>
              </div>
            )}

            {/* Stage card */}
            <div style={{
              border: `1.5px solid ${isLast ? "#003366" : "#e9edf2"}`,
              borderRadius: 12, padding: "13px 16px",
              background: isLast ? "#f0f5ff" : "#fff",
              boxShadow: isLast ? "0 4px 16px rgba(0,51,102,.10)" : "0 1px 3px rgba(0,0,0,.04)",
            }}>
              {/* Top row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                    background: isLast ? "#003366" : color + "20",
                    color: isLast ? "#fff" : color,
                    fontSize: "0.63rem", fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{i + 1}</div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: isLast ? "#003366" : "#1e293b" }}>
                    {stage.label}
                  </span>
                </div>
                <span style={{
                  fontSize: "0.72rem", fontWeight: 800,
                  color: isLast ? "#003366" : color,
                  background: (isLast ? "#003366" : color) + "15",
                  borderRadius: 8, padding: "3px 10px",
                }}>
                  {stage.count} ราย
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: 7, background: "#edf0f5", borderRadius: 99, overflow: "hidden", marginBottom: 9 }}>
                <div style={{
                  height: "100%", width: `${widthPct}%`, borderRadius: 99,
                  background: isLast ? "#003366" : color,
                  transition: "width 0.6s ease",
                }} />
              </div>

              {/* Bottom row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: "0.6rem", color: "#9ca3af", marginBottom: 1 }}>มูลค่ารวม</div>
                  <div style={{ fontSize: "0.96rem", fontWeight: 800, color: isLast ? "#003366" : "#1e293b" }}>
                    {fmtM(stage.valueNum)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.6rem", color: "#9ca3af", marginBottom: 1 }}>เฉลี่ย/ดีล</div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b7280" }}>
                    {fmtM(Math.round(stage.valueNum / stage.count))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Lost reasons ──────────────────────────────────────────────────
function LostReasons() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {hqPipelineLostReasons.map((r, i) => (
        <div key={r.reason} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
            background: i === 0 ? "#fef2f2" : "#f8f9fb",
            color: i === 0 ? "#dc2626" : "#9ca3af",
            fontSize: "0.62rem", fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{i + 1}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: "0.73rem", color: "#1e293b", fontWeight: 600 }}>{r.reason}</span>
              <span style={{ fontSize: "0.67rem", fontWeight: 700, color: "#dc2626", flexShrink: 0, marginLeft: 8 }}>
                {r.count} ราย
              </span>
            </div>
            <div style={{ height: 5, background: "#fef2f2", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${r.pct}%`,
                background: i === 0 ? "#dc2626" : "#f87171",
                opacity: 1 - i * 0.14, borderRadius: 99,
              }} />
            </div>
          </div>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#9ca3af", minWidth: 28, textAlign: "right" }}>
            {r.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Product breakdown ─────────────────────────────────────────────
function ProductBreakdown() {
  const total = hqPipelineByProduct.reduce((s, p) => s + p.valueNum, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {hqPipelineByProduct.map(p => {
        const pct = Math.round((p.valueNum / total) * 100);
        return (
          <div key={p.product} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px",
              borderRadius: 6, background: p.color + "18", color: p.color,
              minWidth: 80, textAlign: "center", flexShrink: 0,
            }}>{p.product}</span>
            <div style={{ flex: 1, height: 6, background: "#f0f4f8", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: p.color, borderRadius: 99 }} />
            </div>
            <div style={{ textAlign: "right", flexShrink: 0, minWidth: 70 }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1e293b" }}>{fmtM(p.valueNum)}</div>
              <div style={{ fontSize: "0.6rem", color: "#9ca3af" }}>{pct}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Dealer table ──────────────────────────────────────────────────
function DealerPipeline() {
  const dealers = [...dealerLeaderboard]
    .filter(d => d.status === "active")
    .sort((a, b) => b.revenueActual - a.revenueActual);
  const maxRev = Math.max(...dealers.map(d => d.revenueActual));

  function RateTag({ value, hi, lo }: { value: number; hi: number; lo: number }) {
    const color = value >= hi ? "#059669" : value >= lo ? "#d97706" : "#dc2626";
    const bg    = value >= hi ? "#f0fdf4" : value >= lo ? "#fffbeb" : "#fef2f2";
    return (
      <span style={{ fontSize: "0.74rem", fontWeight: 700, color, background: bg, borderRadius: 8, padding: "3px 10px" }}>
        {value}%
      </span>
    );
  }

  const RANK_STYLE = [
    { bg: "#fef3c7", color: "#d97706" },
    { bg: "#f1f5f9", color: "#475569" },
    { bg: "#fef3c7", color: "#92400e" },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8f9fb" }}>
            {["#", "สาขา", "ยอดขาย", "Win Rate", "Active", "On-time"].map((h, hi) => (
              <th key={h} style={{
                padding: "11px 16px", fontSize: "0.64rem", fontWeight: 700,
                color: "#6b7280", textAlign: hi <= 1 ? "left" : "center",
                textTransform: "uppercase", letterSpacing: "0.04em",
                borderBottom: "1px solid #e5e7eb", whiteSpace: "nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dealers.map((d, i) => {
            const revPct = Math.round((d.revenueActual / maxRev) * 100);
            const rs = RANK_STYLE[i] ?? { bg: "#f0f4f8", color: "#9ca3af" };
            return (
              <tr key={d.code} style={{ borderBottom: "1px solid #f0f4f8" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f8faff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; }}>

                <td style={{ padding: "13px 16px", width: 44 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: rs.bg, color: rs.color,
                    fontWeight: 800, fontSize: "0.7rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{i + 1}</div>
                </td>

                <td style={{ padding: "13px 16px" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e293b" }}>
                    {d.name.startsWith("Benjamin ") ? d.name.slice(9) : d.name}
                  </div>
                  <div style={{ fontSize: "0.63rem", color: "#9ca3af", marginTop: 1 }}>{d.region}</div>
                </td>

                <td style={{ padding: "13px 16px", minWidth: 160 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 5, background: "#f0f0f5", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${revPct}%`, background: "#003366", borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#003366", minWidth: 52 }}>
                      {fmtM(d.revenueActual)}
                    </span>
                  </div>
                </td>

                <td style={{ padding: "13px 16px", textAlign: "center" }}>
                  <RateTag value={d.winRate} hi={45} lo={30} />
                </td>
                <td style={{ padding: "13px 16px", textAlign: "center", fontSize: "0.78rem", fontWeight: 600, color: "#475569" }}>
                  {d.activeProjects}
                </td>
                <td style={{ padding: "13px 16px", textAlign: "center" }}>
                  <RateTag value={d.onTimePct} hi={80} lo={65} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function HQPipelinePage() {
  const { period } = usePeriod();
  const pf = period.factor;

  const [toast, setToast]           = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  const first = hqPipelineStages[0];
  const last  = hqPipelineStages[hqPipelineStages.length - 1];
  const overallConv = Math.round((last.count / first.count) * 100);
  const activeDealers = dealerLeaderboard.filter(d => d.status === "active").length;

  function doExport(fmt: string) {
    setShowExport(false);
    setToast(`กำลังส่งออก ${fmt}...`);
    setTimeout(() => setToast(null), 2800);
  }

  const kpis = [
    {
      label: "ลีดทั้งหมด",
      value: `${Math.round(first.count * pf).toLocaleString()} ราย`,
      sub: fmtM(Math.round(first.valueNum * pf)),
      color: "#003366", bg: "#f0f5ff",
      icon: <Users size={15} color="#003366" />,
    },
    {
      label: "ในกระบวนการ",
      value: `${Math.round(hqPipelineStages[2].count * pf).toLocaleString()} ราย`,
      sub: "ส่งใบเสนอราคาแล้ว",
      color: "#2563eb", bg: "#eff6ff",
      icon: <Target size={15} color="#2563eb" />,
    },
    {
      label: "อัตราปิดดีล",
      value: `${overallConv}%`,
      sub: "Lead → Win",
      color: overallConv >= 30 ? "#059669" : "#d97706",
      bg:   overallConv >= 30 ? "#f0fdf4" : "#fffbeb",
      icon: <CheckCircle2 size={15} color={overallConv >= 30 ? "#059669" : "#d97706"} />,
    },
    {
      label: "ปิดได้ช่วงนี้",
      value: fmtM(Math.round(last.valueNum * pf)),
      sub: `${Math.round(last.count * pf)} ดีล`,
      color: "#059669", bg: "#f0fdf4",
      icon: <Trophy size={15} color="#059669" />,
    },
  ];

  const summaryStat = [
    { label: "อัตราปิดรวม",    value: `${overallConv}%`,                                                        color: "#003366" },
    { label: "มูลค่า Pipeline", value: fmtM(first.valueNum),                                                     color: "#1e293b" },
    { label: "ปิดได้เดือนนี้", value: fmtM(last.valueNum),                                                      color: "#059669" },
    { label: "รอปิด (Quoted+)", value: fmtM(hqPipelineStages.slice(2).reduce((s, x) => s + x.valueNum, 0)),     color: "#d97706" },
  ];

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          background: "#1e293b", color: "#fff",
          padding: "11px 18px", borderRadius: 12, fontSize: "0.78rem", fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,.25)", display: "flex", alignItems: "center", gap: 8,
        }}>
          <Download size={14} /> {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: 22, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.55rem", fontWeight: 800, color: "#2D2D2D", margin: "0 0 4px" }}>
            ภาพรวม Pipeline การขาย
          </h1>
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", margin: 0 }}>
            เส้นทางการขายทั้งเครือ · {period.subtitle}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <PeriodSelector />
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowExport(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 10,
                border: "1px solid #e5e7eb", background: "#fff",
                color: "#1e293b", fontSize: "0.78rem", fontWeight: 700,
                cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,.06)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f8f9fb"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
            >
              <Download size={14} /> ส่งออก
            </button>
            {showExport && (
              <>
                <div onClick={() => setShowExport(false)} style={{ position: "fixed", inset: 0, zIndex: 100 }} />
                <div style={{
                  position: "absolute", top: "calc(100% + 6px)", right: 0,
                  background: "#fff", border: "1px solid #e5e7eb",
                  borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.12)",
                  zIndex: 101, minWidth: 158, overflow: "hidden",
                }}>
                  {["Excel (.xlsx)", "PDF รายงาน"].map(f => (
                    <button key={f} onClick={() => doExport(f)} style={{
                      width: "100%", padding: "10px 16px", textAlign: "left",
                      background: "none", border: "none", fontSize: "0.78rem",
                      color: "#1e293b", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f3f7fc"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; }}
                    >
                      <Download size={12} color="#6b7280" /> {f}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} style={{
            ...CARD, padding: "16px 18px",
            borderLeft: `4px solid ${k.color}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <p style={{ fontSize: "0.67rem", fontWeight: 600, color: "#9ca3af", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {k.label}
              </p>
              <div style={{ padding: 7, borderRadius: 9, background: k.bg }}>{k.icon}</div>
            </div>
            <p style={{ fontSize: "1.46rem", fontWeight: 800, color: k.color, lineHeight: 1, margin: "0 0 4px" }}>{k.value}</p>
            <p style={{ fontSize: "0.67rem", color: "#9ca3af", margin: 0 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main content ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 310px", gap: 16, alignItems: "start" }}>

        {/* Funnel */}
        <div style={{ ...CARD, padding: "20px 22px" }}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: "0.86rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>ช่องทางการขาย</p>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af", margin: "3px 0 0" }}>จาก Lead จนถึงการปิดดีล</p>
          </div>
          <FunnelChart />

          {/* Summary strip */}
          <div style={{
            marginTop: 16, paddingTop: 14,
            borderTop: "1px solid #f0f4f8",
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          }}>
            {summaryStat.map((s, si) => (
              <div key={s.label} style={{
                textAlign: "center", padding: "0 8px",
                borderRight: si < 3 ? "1px solid #f0f4f8" : "none",
              }}>
                <div style={{ fontSize: "0.59rem", color: "#9ca3af", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {s.label}
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ ...CARD, padding: "18px 20px" }}>
            <p style={{ fontSize: "0.84rem", fontWeight: 700, color: "#1e293b", margin: "0 0 14px" }}>เหตุผลที่เสียดีล</p>
            <LostReasons />
          </div>
          <div style={{ ...CARD, padding: "18px 20px" }}>
            <p style={{ fontSize: "0.84rem", fontWeight: 700, color: "#1e293b", margin: "0 0 14px" }}>แยกตามสินค้า / บริการ</p>
            <ProductBreakdown />
          </div>
        </div>
      </div>

      {/* ── Dealer table ── */}
      <div style={{ ...CARD, marginTop: 16 }}>
        <div style={{
          padding: "16px 20px 14px", borderBottom: "1px solid #e5e7eb",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <p style={{ fontSize: "0.86rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>Performance ต่อสาขา</p>
            <p style={{ fontSize: "0.7rem", color: "#9ca3af", margin: "3px 0 0" }}>ยอดขาย · Win Rate · On-time Delivery</p>
          </div>
          <span style={{
            fontSize: "0.68rem", color: "#6b7280", fontWeight: 600,
            background: "#f0f4f8", padding: "3px 12px", borderRadius: 99,
          }}>
            {activeDealers} สาขา
          </span>
        </div>
        <DealerPipeline />
      </div>
    </div>
  );
}
