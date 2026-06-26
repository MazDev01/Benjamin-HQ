"use client";

import { useState } from "react";
import { hqSalesTargets, SalesTarget } from "@/lib/mock";
import { Target, TrendingUp, TrendingDown, CheckCircle2, AlertCircle } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const PRIMARY = "#003366";
const STEEL = "#2D2D2D";
const BORDER = "#e5e7eb";
const MUTED = "#6b7280";
const AMBER = "#d97706";
const RED = "#dc2626";
const GREEN = "#059669";

const CARD: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: `1px solid ${BORDER}`,
  boxShadow: "0 2px 14px rgba(0,0,0,.07)",
};

// ─── Helper functions ─────────────────────────────────────────────────────────
function fmtM(n: number): string {
  if (n >= 1_000_000) return "฿" + (n / 1_000_000).toFixed(1) + "M";
  return "฿" + (n / 1_000).toFixed(0) + "K";
}

function pctColor(pct: number, threshold = 100): string {
  if (pct >= threshold) return GREEN;
  if (pct >= 80) return AMBER;
  return RED;
}

type QuarterView = "Q1" | "Q2" | "overview";

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div style={{ ...CARD, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </span>
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div style={{ fontSize: "1.55rem", fontWeight: 800, color: STEEL, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: "0.72rem", color: MUTED }}>{sub}</div>}
    </div>
  );
}

function QuarterBadge({ q, actual, target }: { q: string; actual: number; target: number }) {
  const pct = Math.round((actual / target) * 100);
  const color = pct >= 100 ? GREEN : pct >= 80 ? AMBER : RED;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontSize: "0.8rem", color: STEEL, fontWeight: 600 }}>{fmtM(actual)}</span>
      <span style={{ fontSize: "0.68rem", color: color, fontWeight: 700 }}>{pct}% {pct >= 100 ? "✓" : ""}</span>
    </div>
  );
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const clamped = Math.min(pct, 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, background: "#f0f4f8", borderRadius: 99, height: 8, overflow: "hidden" }}>
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            background: color,
            borderRadius: 99,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: color, minWidth: 36, textAlign: "right" }}>
        {pct}%
      </span>
    </div>
  );
}

function StatusBadge({ pct }: { pct: number }) {
  if (pct >= 100) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "2px 10px", borderRadius: 99, fontSize: "0.68rem", fontWeight: 700,
        background: "#dcfce7", color: GREEN,
      }}>
        <CheckCircle2 size={11} strokeWidth={2.5} /> บรรลุเป้า
      </span>
    );
  }
  if (pct >= 80) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "2px 10px", borderRadius: 99, fontSize: "0.68rem", fontWeight: 700,
        background: "#fef3c7", color: AMBER,
      }}>
        <TrendingUp size={11} strokeWidth={2.5} /> ใกล้เป้า
      </span>
    );
  }
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 10px", borderRadius: 99, fontSize: "0.68rem", fontWeight: 700,
      background: "#fee2e2", color: RED,
    }}>
      <AlertCircle size={11} strokeWidth={2.5} /> ต่ำกว่าเป้า
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HQTargetsPage() {
  const [selectedQ, setSelectedQ] = useState<QuarterView>("overview");

  // Sort by annualTarget descending
  const sorted: SalesTarget[] = [...hqSalesTargets].sort((a, b) => b.annualTarget - a.annualTarget);

  // Summary calculations
  const totalAnnual = sorted.reduce((s, t) => s + t.annualTarget, 0);
  const totalH1Actual = sorted.reduce((s, t) => s + t.q1Actual + t.q2Actual, 0);
  const totalH1Target = sorted.reduce((s, t) => s + t.q1Target + t.q2Target, 0);
  const h1Pct = Math.round((totalH1Actual / totalH1Target) * 100);
  const onTrackCount = sorted.filter((t) => t.q1Actual + t.q2Actual >= (t.q1Target + t.q2Target) * 0.9).length;

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "7px 20px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: 700,
    background: active ? PRIMARY : "#f3f4f6",
    color: active ? "#fff" : MUTED,
    transition: "all 0.15s",
  });

  const thStyle: React.CSSProperties = {
    fontSize: "0.68rem",
    fontWeight: 700,
    color: MUTED,
    padding: "8px 14px",
    background: "#fafafa",
    borderBottom: `1px solid ${BORDER}`,
    textAlign: "left" as const,
    whiteSpace: "nowrap" as const,
  };

  const tdStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    color: STEEL,
    padding: "11px 14px",
    borderBottom: "1px solid #f0f4f8",
    verticalAlign: "middle",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: STEEL, display: "flex", alignItems: "center", gap: 8 }}>
            <Target size={22} color={PRIMARY} strokeWidth={2} />
            เป้าหมายการขาย 2026
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: MUTED }}>
            ติดตามยอดขายรายสาขาเทียบกับเป้าหมายประจำปี
          </p>
        </div>

        {/* Quarter Tabs */}
        <div style={{ display: "flex", gap: 8, background: "#f3f4f6", borderRadius: 12, padding: 4 }}>
          {(["overview", "Q1", "Q2"] as QuarterView[]).map((q) => (
            <button key={q} style={tabStyle(selectedQ === q)} onClick={() => setSelectedQ(q)}>
              {q === "overview" ? "ภาพรวม" : q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <StatCard
          label="เป้ารวมปี"
          value={fmtM(totalAnnual)}
          sub="6 สาขา ทั่วประเทศ"
          icon={<Target size={18} strokeWidth={2} />}
          accent={PRIMARY}
        />
        <StatCard
          label="ยอดจริง H1"
          value={fmtM(totalH1Actual)}
          sub={`จากเป้า H1 ${fmtM(totalH1Target)}`}
          icon={<TrendingUp size={18} strokeWidth={2} />}
          accent={totalH1Actual >= totalH1Target ? GREEN : AMBER}
        />
        <StatCard
          label="% บรรลุเป้า H1"
          value={`${h1Pct}%`}
          sub={h1Pct >= 100 ? "บรรลุเป้า H1 แล้ว" : `ขาดอีก ${fmtM(totalH1Target - totalH1Actual)}`}
          icon={
            h1Pct >= 100 ? (
              <CheckCircle2 size={18} strokeWidth={2} />
            ) : (
              <TrendingDown size={18} strokeWidth={2} />
            )
          }
          accent={pctColor(h1Pct)}
        />
        <StatCard
          label="สาขาตามเป้า"
          value={`${onTrackCount}/6`}
          sub="H1 actual ≥ 90% of H1 target"
          icon={<AlertCircle size={18} strokeWidth={2} />}
          accent={onTrackCount >= 5 ? GREEN : onTrackCount >= 3 ? AMBER : RED}
        />
      </div>

      {/* ── Main Table ── */}
      {selectedQ === "overview" && (
        <div style={{ ...CARD, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: STEEL }}>
              ผลงานรายสาขา — ภาพรวม H1 2026
            </span>
            <span style={{ fontSize: "0.72rem", color: MUTED }}>เรียงตามเป้าปีสูงสุด</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["สาขา", "ภาค", "เป้า Q1", "ผล Q1", "เป้า Q2", "ผล Q2", "รวม H1", "เป้ารวมปี", "ความคืบหน้า"].map((h) => (
                    <th key={h} style={{ ...thStyle, textAlign: h === "ความคืบหน้า" ? "center" : "left" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((row) => {
                  const h1Actual = row.q1Actual + row.q2Actual;
                  const pct = Math.round((h1Actual / row.annualTarget) * 100);
                  const barColor = pct >= 50 ? PRIMARY : pct >= 35 ? AMBER : RED;

                  const q1Color =
                    row.q1Actual >= row.q1Target ? GREEN
                    : row.q1Actual < row.q1Target * 0.8 ? RED
                    : AMBER;

                  const q2Color =
                    row.q2Actual >= row.q2Target ? GREEN
                    : row.q2Actual < row.q2Target * 0.8 ? RED
                    : AMBER;

                  return (
                    <tr key={row.dealerCode} style={{ transition: "background 0.1s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* สาขา */}
                      <td style={tdStyle}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <span style={{ fontWeight: 700, color: PRIMARY }}>{row.dealerCode}</span>
                          <span style={{ fontSize: "0.72rem", color: MUTED }}>{row.dealerName}</span>
                        </div>
                      </td>
                      {/* ภาค */}
                      <td style={tdStyle}>
                        <span style={{
                          display: "inline-block", padding: "2px 10px", borderRadius: 99,
                          fontSize: "0.68rem", fontWeight: 700,
                          background: "#f0f4f8", color: MUTED,
                        }}>
                          {row.region}
                        </span>
                      </td>
                      {/* เป้า Q1 */}
                      <td style={{ ...tdStyle, color: MUTED }}>{fmtM(row.q1Target)}</td>
                      {/* ผล Q1 */}
                      <td style={tdStyle}>
                        <QuarterBadge q="Q1" actual={row.q1Actual} target={row.q1Target} />
                      </td>
                      {/* เป้า Q2 */}
                      <td style={{ ...tdStyle, color: MUTED }}>{fmtM(row.q2Target)}</td>
                      {/* ผล Q2 */}
                      <td style={tdStyle}>
                        <QuarterBadge q="Q2" actual={row.q2Actual} target={row.q2Target} />
                      </td>
                      {/* รวม H1 */}
                      <td style={tdStyle}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <span style={{ fontWeight: 700, color: STEEL }}>{fmtM(h1Actual)}</span>
                          <span style={{ fontSize: "0.68rem", color: q1Color }}>
                            {q1Color === GREEN && q2Color === GREEN ? "✓ ทั้ง 2 ไตรมาส" : ""}
                          </span>
                        </div>
                      </td>
                      {/* เป้ารวมปี */}
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{fmtM(row.annualTarget)}</td>
                      {/* ความคืบหน้า */}
                      <td style={{ ...tdStyle, minWidth: 160 }}>
                        <ProgressBar pct={pct} color={barColor} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Q1 Single-Quarter View ── */}
      {selectedQ === "Q1" && (
        <div style={{ ...CARD, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={16} color={PRIMARY} strokeWidth={2} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: STEEL }}>ผลงาน Q1 (ม.ค. – มี.ค. 2026)</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["สาขา", "เป้า Q1", "ผล Q1", "% ของเป้า", "สถานะ"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const pct = Math.round((row.q1Actual / row.q1Target) * 100);
                const color = pct >= 100 ? GREEN : pct >= 80 ? AMBER : RED;
                return (
                  <tr key={row.dealerCode}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <span style={{ fontWeight: 700, color: PRIMARY }}>{row.dealerCode}</span>
                        <span style={{ fontSize: "0.72rem", color: MUTED }}>{row.dealerName}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: MUTED }}>{fmtM(row.q1Target)}</td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: color }}>{fmtM(row.q1Actual)}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 80, background: "#f0f4f8", borderRadius: 99, height: 6, overflow: "hidden" }}>
                          <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: color, borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: color }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={tdStyle}><StatusBadge pct={pct} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Q2 Single-Quarter View ── */}
      {selectedQ === "Q2" && (
        <div style={{ ...CARD, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={16} color={PRIMARY} strokeWidth={2} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: STEEL }}>ผลงาน Q2 (เม.ย. – มิ.ย. 2026)</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["สาขา", "เป้า Q2", "ผล Q2", "% ของเป้า", "สถานะ"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const pct = Math.round((row.q2Actual / row.q2Target) * 100);
                const color = pct >= 100 ? GREEN : pct >= 80 ? AMBER : RED;
                return (
                  <tr key={row.dealerCode}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <span style={{ fontWeight: 700, color: PRIMARY }}>{row.dealerCode}</span>
                        <span style={{ fontSize: "0.72rem", color: MUTED }}>{row.dealerName}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: MUTED }}>{fmtM(row.q2Target)}</td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: color }}>{fmtM(row.q2Actual)}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 80, background: "#f0f4f8", borderRadius: 99, height: 6, overflow: "hidden" }}>
                          <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: color, borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: color }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={tdStyle}><StatusBadge pct={pct} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Footer note ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 0" }}>
        <AlertCircle size={13} color={MUTED} strokeWidth={2} />
        <span style={{ fontSize: "0.72rem", color: MUTED }}>
          Q3–Q4 ยังไม่มีข้อมูลจริง · แสดงเฉพาะเป้าหมาย · อัปเดตล่าสุด: 26 มิ.ย. 2026
        </span>
      </div>
    </div>
  );
}
