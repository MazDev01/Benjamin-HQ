"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import {
  hqFinanceSummary, hqFinanceByMonth, hqInvoiceAging,
  hqServiceLineRevenue,
} from "@/lib/mock";
import { usePeriod } from "@/context/PeriodContext";
import { PeriodSelector } from "@/components/hq/PeriodSelector";

// ── Helpers ─────────────────────────────────────────────────────

function fmtM(n: number, decimals = 1) {
  return n >= 1_000_000 ? `฿${(n / 1_000_000).toFixed(decimals)}M` : `฿${(n / 1000).toFixed(0)}K`;
}
function pctBar(n: number, total: number) {
  return total > 0 ? Math.round(n / total * 100) : 0;
}

const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
  boxShadow: "0 2px 14px rgba(0,0,0,.07)",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {children}
    </p>
  );
}

// ── SVG grouped bar chart (revenue vs target + collected) ───────

function RevenueBarChart() {
  const W = 560, H = 180, padL = 8, padR = 8, padT = 28, padB = 26;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const n = hqFinanceByMonth.length;
  const max = Math.max(...hqFinanceByMonth.map(r => r.target)) * 1.12;
  const groupW = innerW / n;
  const barW   = groupW * 0.52;

  function barY(v: number) { return padT + innerH - (v / max) * innerH; }
  function barH(v: number) { return (v / max) * innerH; }

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#003366" stopOpacity="1" />
            <stop offset="100%" stopColor="#1a5b8f" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line key={t}
            x1={padL} x2={W - padR}
            y1={padT + t * innerH} y2={padT + t * innerH}
            stroke="#f0f0f5" strokeWidth="1"
          />
        ))}

        {hqFinanceByMonth.map((row, i) => {
          const cx    = padL + (i + 0.5) * groupW;
          const bx    = cx - barW / 2;
          const pct   = Math.round(row.revenue / row.target * 100);
          const isLast = i === n - 1;
          const barColor = pct >= 100 ? "#059669" : pct >= 80 ? (isLast ? "url(#revGrad)" : "#8fa3c0") : "#f59e0b";
          const pctColor = pct >= 100 ? "#059669" : pct >= 80 ? "#003366" : "#f59e0b";
          const tarY  = barY(row.target);
          const colY  = barY(row.collected);

          return (
            <g key={row.month}>
              {/* Revenue bar */}
              <rect
                x={bx} y={barY(row.revenue)}
                width={barW} height={barH(row.revenue)}
                fill={barColor} rx={4}
                opacity={isLast ? 1 : 0.8}
              />
              {/* Collected dot on revenue bar */}
              <circle cx={cx} cy={colY} r="4" fill="#059669" stroke="white" strokeWidth="1.5" />
              {/* Target dashed line spanning bar width */}
              <line
                x1={bx - 4} x2={bx + barW + 4}
                y1={tarY} y2={tarY}
                stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4,2"
              />
              {/* % achievement badge above bar */}
              <text x={cx} y={barY(row.revenue) - 5}
                textAnchor="middle" fontSize="8.5" fontWeight="700" fill={pctColor}>
                {pct}%
              </text>
              {/* Month label */}
              <text x={cx} y={H - 4}
                textAnchor="middle" fontSize="9" fill={isLast ? "#2D2D2D" : "#6b7280"} fontWeight={isLast ? "700" : "400"}>
                {row.month}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 2 }}>
        {[
          { color: "#003366", label: "ยอดขาย (แท่ง)" },
          { color: "#059669", label: "เก็บได้ (จุดเขียว)" },
          { color: "#9ca3af", label: "เป้าหมาย (เส้นประ)", dashed: true },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {l.dashed
              ? <div style={{ width: 14, borderTop: "2px dashed #9ca3af" }} />
              : <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
            }
            <span style={{ fontSize: "0.62rem", color: "#6b7280" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Invoice aging ────────────────────────────────────────────────

function InvoiceAging() {
  const total = hqInvoiceAging.reduce((s, b) => s + b.amount, 0);
  return (
    <div>
      {hqInvoiceAging.map(b => (
        <div key={b.label} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: "0.76rem", color: "#2D2D2D", fontWeight: 600 }}>{b.label}</span>
            <span style={{ fontSize: "0.76rem", fontWeight: 700, color: b.color }}>{fmtM(b.amount)}</span>
          </div>
          <div style={{ height: 6, background: "#f0f0f5", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pctBar(b.amount, total)}%`, background: b.color, borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: "0.62rem", color: "#9ca3af", marginTop: 2 }}>{pctBar(b.amount, total)}% ของยอดค้าง</div>
        </div>
      ))}
      <div style={{ padding: "10px 14px", background: "#f3f7fc", borderRadius: 8, display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#003366" }}>รวมค้างชำระ</span>
        <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#003366" }}>{fmtM(total)}</span>
      </div>
    </div>
  );
}

// ── Service line revenue ─────────────────────────────────────────

function ServiceLineRevenue() {
  const total = hqServiceLineRevenue.reduce((s, r) => s + r.value, 0);
  return (
    <div>
      {hqServiceLineRevenue.map(r => (
        <div key={r.line} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, minWidth: 88, color: r.color }}>{r.line}</span>
          <div style={{ flex: 1, height: 7, background: "#f0f0f5", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pctBar(r.value, total)}%`, background: r.color, borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2D2D2D", minWidth: 55, textAlign: "right" }}>{fmtM(r.value)}</span>
          <span style={{ fontSize: "0.62rem", color: "#9ca3af", minWidth: 30, textAlign: "right" }}>{pctBar(r.value, total)}%</span>
        </div>
      ))}
    </div>
  );
}

// ── Monthly detail table ─────────────────────────────────────────

function MonthlyTable() {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8f9fb", borderBottom: "1px solid #e5e7eb" }}>
            {["เดือน", "ยอดขาย", "เป้า", "% เป้า", "เก็บได้", "ค่าใช้จ่าย", "กำไรขั้นต้น"].map(h => (
              <th key={h} style={{ padding: "10px 14px", fontSize: "0.67rem", fontWeight: 700, color: "#6b7280", textAlign: h === "เดือน" ? "left" : "right", whiteSpace: "nowrap", textTransform: "uppercase" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hqFinanceByMonth.map((row, i) => {
            const pct   = Math.round(row.revenue / row.target * 100);
            const gp    = row.revenue - row.expenses;
            const gpPct = Math.round(gp / row.revenue * 100);
            const pctColor = pct >= 100 ? "#059669" : pct >= 80 ? "#f59e0b" : "#dc2626";
            const isLast = i === hqFinanceByMonth.length - 1;
            return (
              <tr key={row.month} style={{ borderBottom: "1px solid #f0f4f8", background: isLast ? "#f8fafd" : "transparent" }}>
                <td style={{ padding: "11px 14px", fontSize: "0.82rem", fontWeight: isLast ? 700 : 400, color: "#2D2D2D" }}>{row.month}{isLast ? " (ปัจจุบัน)" : ""}</td>
                <td style={{ padding: "11px 14px", textAlign: "right", fontWeight: 700, color: "#003366", fontSize: "0.82rem" }}>{fmtM(row.revenue)}</td>
                <td style={{ padding: "11px 14px", textAlign: "right", fontSize: "0.78rem", color: "#6b7280" }}>{fmtM(row.target)}</td>
                <td style={{ padding: "11px 14px", textAlign: "right" }}>
                  <span style={{ fontSize: "0.74rem", fontWeight: 700, color: pctColor }}>{pct}%</span>
                </td>
                <td style={{ padding: "11px 14px", textAlign: "right", fontSize: "0.78rem", color: "#059669", fontWeight: 600 }}>{fmtM(row.collected)}</td>
                <td style={{ padding: "11px 14px", textAlign: "right", fontSize: "0.78rem", color: "#dc2626", fontWeight: 600 }}>({fmtM(row.expenses)})</td>
                <td style={{ padding: "11px 14px", textAlign: "right" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2D2D2D" }}>{fmtM(gp)}</span>
                  <span style={{ fontSize: "0.64rem", color: "#6b7280", marginLeft: 4 }}>({gpPct}%)</span>
                </td>
              </tr>
            );
          })}
          {/* YTD total row */}
          {(() => {
            const rev  = hqFinanceByMonth.reduce((s, r) => s + r.revenue,   0);
            const tar  = hqFinanceByMonth.reduce((s, r) => s + r.target,    0);
            const col  = hqFinanceByMonth.reduce((s, r) => s + r.collected, 0);
            const exp  = hqFinanceByMonth.reduce((s, r) => s + r.expenses,  0);
            const gp   = rev - exp;
            const pct  = Math.round(rev / tar * 100);
            return (
              <tr style={{ background: "#f3f7fc", borderTop: "2px solid #e5e7eb" }}>
                <td style={{ padding: "12px 14px", fontWeight: 800, fontSize: "0.82rem", color: "#003366" }}>YTD รวม</td>
                <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 800, color: "#003366", fontSize: "0.88rem" }}>{fmtM(rev)}</td>
                <td style={{ padding: "12px 14px", textAlign: "right", fontSize: "0.78rem", color: "#6b7280" }}>{fmtM(tar)}</td>
                <td style={{ padding: "12px 14px", textAlign: "right" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 800, color: pct >= 80 ? "#059669" : "#f59e0b" }}>{pct}%</span>
                </td>
                <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 700, color: "#059669", fontSize: "0.82rem" }}>{fmtM(col)}</td>
                <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 700, color: "#dc2626", fontSize: "0.82rem" }}>({fmtM(exp)})</td>
                <td style={{ padding: "12px 14px", textAlign: "right" }}>
                  <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "#2D2D2D" }}>{fmtM(gp)}</span>
                  <span style={{ fontSize: "0.66rem", color: "#6b7280", marginLeft: 4 }}>({Math.round(gp / rev * 100)}%)</span>
                </td>
              </tr>
            );
          })()}
        </tbody>
      </table>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────

export default function HQFinancePage() {
  const { period } = usePeriod();
  const pf = period.factor;

  const s        = hqFinanceSummary;
  const ytdRev   = Math.round(s.ytdRevenue   * pf);
  const ytdTgt   = Math.round(s.ytdTarget    * pf);
  const monRev   = Math.round(s.monthRevenue * pf);
  const monTgt   = Math.round(s.monthTarget  * pf);
  const ytdPct   = Math.round(ytdRev / ytdTgt * 100);
  const monPct   = Math.round(monRev / monTgt * 100);
  const totalOut = Math.round(hqInvoiceAging.reduce((x, b) => x + b.amount, 0) * Math.min(pf, 1.6));

  const [toast, setToast]         = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  function doExport(format: string) {
    setShowExport(false);
    setToast(`กำลังส่งออก ${format}... ดาวน์โหลดจะเริ่มในไม่ช้า`);
    setTimeout(() => setToast(null), 2800);
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#2D2D2D", color: "#fff", padding: "10px 18px", borderRadius: 12, fontSize: "0.78rem", fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,.25)", display: "flex", alignItems: "center", gap: 8 }}>
          <Download size={14} /> {toast}
        </div>
      )}

      <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.55rem", fontWeight: 800, color: "#2D2D2D", marginBottom: 3 }}>ภาพรวมการเงิน</h1>
          <p style={{ fontSize: "0.76rem", color: "#6b7280" }}>รายรับ · ใบแจ้งหนี้ · การชำระเงิน · กำไร · {period.subtitle}</p>
        </div>
        {/* Period + Export buttons */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <PeriodSelector />
          <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowExport(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#2D2D2D", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f8f9fb"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
          >
            <Download size={14} /> ส่งออก
          </button>
          {showExport && (
            <>
              <div onClick={() => setShowExport(false)} style={{ position: "fixed", inset: 0, zIndex: 100 }} />
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.12)", zIndex: 101, minWidth: 160, overflow: "hidden" }}>
                {["Excel (.xlsx)", "PDF รายงาน"].map(f => (
                  <button key={f} onClick={() => doExport(f)}
                    style={{ width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", fontSize: "0.78rem", color: "#2D2D2D", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f3f7fc"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; }}
                  >
                    <Download size={12} style={{ color: "#6b7280" }} /> {f}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "ยอดขาย",              value: fmtM(ytdRev),          sub: `${ytdPct}% ของเป้า ${fmtM(ytdTgt)}`,        color: "#003366",  subColor: ytdPct >= 80 ? "#059669" : "#f59e0b" },
          { label: "ยอดขายล่าสุด",        value: fmtM(monRev),          sub: `${monPct}% ของเป้า ${fmtM(monTgt)}`,         color: "#003366",  subColor: monPct >= 80 ? "#059669" : "#f59e0b" },
          { label: "ค้างชำระทั้งหมด",    value: fmtM(totalOut),         sub: `เกินกำหนด ${fmtM(Math.round(s.overdue * Math.min(pf, 1.4)))}`, color: "#f59e0b", subColor: "#dc2626" },
          { label: "Gross Margin",          value: `${s.grossMarginPct}%`, sub: "หลังหักต้นทุนประมาณ",                    color: s.grossMarginPct >= 20 ? "#059669" : "#f59e0b", subColor: "#6b7280" },
        ].map(k => (
          <div key={k.label} style={{ ...CARD, padding: "14px 18px" }}>
            <p style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 500, marginBottom: 4 }}>{k.label}</p>
            <p style={{ fontSize: "1.4rem", fontWeight: 800, color: k.color, lineHeight: 1, marginBottom: 4 }}>{k.value}</p>
            <p style={{ fontSize: "0.66rem", color: k.subColor, fontWeight: 600 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: 16 }}>
        {/* Revenue chart */}
        <div style={{ ...CARD, padding: "20px 24px" }}>
          <SectionTitle>รายรับรายเดือน vs เป้าหมาย</SectionTitle>
          <RevenueBarChart />
        </div>

        {/* Invoice aging */}
        <div style={{ ...CARD, padding: "18px 20px" }}>
          <SectionTitle>อายุใบแจ้งหนี้ค้างชำระ</SectionTitle>
          <InvoiceAging />
        </div>
      </div>

      {/* Service line + Monthly table */}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, marginBottom: 16 }}>
        {/* Service line */}
        <div style={{ ...CARD, padding: "18px 20px" }}>
          <SectionTitle>รายได้ตามสายบริการ (YTD)</SectionTitle>
          <ServiceLineRevenue />
          <div style={{ marginTop: 14, padding: "10px 14px", background: "#f3f7fc", borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#003366" }}>รวม YTD</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#003366" }}>{fmtM(hqServiceLineRevenue.reduce((s, r) => s + r.value, 0))}</span>
          </div>
        </div>

        {/* Monthly table */}
        <div style={{ ...CARD, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: "0.84rem", fontWeight: 700, color: "#2D2D2D", margin: 0 }}>ตารางรายรับรายเดือน</p>
          </div>
          <MonthlyTable />
        </div>
      </div>

      {/* Collection rate summary */}
      <div style={{ ...CARD, padding: "18px 24px" }}>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {[
            { label: "เก็บได้เดือนนี้",   value: fmtM(s.collectedMonth),  note: `${Math.round(s.collectedMonth / s.monthRevenue * 100)}% ของยอดขาย`, color: "#059669" },
            { label: "ค้างชำระ",           value: fmtM(totalOut),           note: "รวมทุกอายุ",  color: "#f59e0b" },
            { label: "เกินกำหนด",          value: fmtM(s.overdue),          note: "ต้องติดตามด่วน", color: "#dc2626" },
            { label: "ค่าใช้จ่าย YTD",    value: fmtM(s.ytdExpenses),      note: `${Math.round(s.ytdExpenses / s.ytdRevenue * 100)}% ของรายรับ`,  color: "#6b7280" },
          ].map(k => (
            <div key={k.label}>
              <p style={{ fontSize: "0.68rem", color: "#6b7280", fontWeight: 600, marginBottom: 3 }}>{k.label}</p>
              <p style={{ fontSize: "1.1rem", fontWeight: 800, color: k.color, marginBottom: 2 }}>{k.value}</p>
              <p style={{ fontSize: "0.64rem", color: "#9ca3af" }}>{k.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
