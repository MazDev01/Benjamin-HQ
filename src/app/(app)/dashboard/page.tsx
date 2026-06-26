"use client";

import { useState, useMemo } from "react";
import {
  leads, projects, tasks, appointments, customers, payments,
  leadStatusLabel,
} from "@/lib/mock";
import type { LeadStatus } from "@/lib/mock";

// --- TOKENS ------------------------------------------------------
const PRIMARY = "#003366";
const BG      = "#f4f6f9";
const DARK    = "#2D2D2D";
const MUTED   = "#6b7280";
const CARD: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 2px 14px rgba(0,51,102,.07)",
};

// --- MONTHLY CHART DATA ------------------------------------------
const MONTHLY = [
  { m:"ม.ค.", a:380, p:450 }, { m:"ก.พ.", a:490, p:520 },
  { m:"มี.ค.", a:650, p:600 }, { m:"เม.ย.", a:420, p:480 },
  { m:"พ.ค.", a:820, p:700 }, { m:"มิ.ย.", a:290, p:350 },
  { m:"ก.ค.", a:0, p:580 },   { m:"ส.ค.", a:0, p:620 },
  { m:"ก.ย.", a:0, p:540 },   { m:"ต.ค.", a:0, p:590 },
  { m:"พ.ย.", a:0, p:610 },   { m:"ธ.ค.", a:0, p:680 },
];

// --- CALENDAR DATA -----------------------------------------------
const THAI_DAYS = ["อา","จ","อ","พ","พฤ","ศ","ส"];
const THAI_MONTHS_FULL = [
  "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
  "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",
];

const APPT_COLOR: Record<string, string> = {
  survey:"#003366", design_meet:"#8fa3b8", contract_sign:"#059669",
  client_meet:"#f59e0b", quotation:"#dc2626",
};
const APPT_LABEL: Record<string, string> = {
  survey:"สำรวจพื้นที่", design_meet:"ประชุมออกแบบ",
  contract_sign:"เซ็นสัญญา", client_meet:"พบลูกค้า", quotation:"เสนอราคา",
};
const MONTHS_SHORT = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];

// --- STATUS COLORS (leads) ---------------------------------------
const STATUS_PILL: Record<string, { bg: string; text: string }> = {
  NEW:       { bg:"#f0f0f5",  text:"#6b7280" },
  WAITING:   { bg:"#dce5f0",  text:"#003366" },
  BULLET:    { bg:"#dce5f0",  text:"#003366" },
  QUOTED:    { bg:"#dce5f0",  text:"#003366" },
  PAID:      { bg:"#e5faf0",  text:"#059669" },
  CANCELLED: { bg:"#fee2e2",  text:"#dc2626" },
};

// --- HELPERS -----------------------------------------------------
function fmt(n: number) {
  if (n >= 1e6) return `฿${(n / 1e6).toFixed(1)}M`;
  if (n >= 1000) return `฿${(n / 1000).toFixed(0)}K`;
  return `฿${n.toLocaleString()}`;
}
function leadValue(v: string): number {
  const n = parseFloat(v.replace(/[฿,]/g, ""));
  if (v.includes("M")) return n * 1e6;
  if (v.includes("K")) return n * 1e3;
  return n || 0;
}

// --- STAT CARD ---------------------------------------------------
function StatCard({ icon, label, value, sub, href, iconBg, iconColor }: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  href: string; iconBg: string; iconColor: string;
}) {
  return (
    <a href={href} style={{ textDecoration: "none" }}>
      <div style={{ ...CARD, padding: "20px 22px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "translateY(-2px)";
          el.style.boxShadow = "0 8px 32px rgba(0,0,0,.1)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "";
          el.style.boxShadow = "0 2px 24px rgba(0,0,0,.06)";
        }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, color: iconColor,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>{label}</div>
          <div style={{ fontSize: "1.65rem", fontWeight: 800, color: DARK, lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: "0.68rem", color: MUTED, marginTop: 4 }}>{sub}</div>
        </div>
      </div>
    </a>
  );
}

// --- MONTHLY BAR CHART -------------------------------------------
function MonthlyBarChart() {
  const [hov, setHov] = useState<number | null>(null);
  const W = 680, H = 200, PL = 42, PR = 14, PT = 18, PB = 30;
  const cW = W - PL - PR, cH = H - PT - PB;
  const maxV = Math.max(...MONTHLY.flatMap(d => [d.a, d.p])) * 1.18 || 1;
  const n = MONTHLY.length, gW = cW / n;
  const bW = Math.min(16, gW * 0.26), gap = 4;

  function yp(v: number) { return PT + cH - (v / maxV) * cH; }

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet" style={{ minWidth: 420, display: "block" }}>
        {[0, 0.25, 0.5, 0.75, 1].map(f => {
          const v = Math.round(maxV * f / 100) * 100, y = yp(v);
          return (
            <g key={f}>
              <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f0f2f6" strokeWidth="1.5" />
              {f > 0 && (
                <text x={PL - 6} y={y + 3.5} textAnchor="end" fontSize="8" fill="#c4cbd4">
                  {v >= 1000 ? `${v / 1000}K` : `${v}`}
                </text>
              )}
            </g>
          );
        })}
        {MONTHLY.map((d, i) => {
          const cx = PL + i * gW + gW / 2;
          const ax = cx - bW - gap / 2, px = cx + gap / 2;
          const pY = yp(d.p), pH = cH - (pY - PT);
          const aY = yp(d.a), aH = d.a > 0 ? cH - (aY - PT) : 0;
          const isHov = hov === i;
          return (
            <g key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{ cursor: "pointer" }}>
              {isHov && (
                <rect x={cx - gW / 2 + 2} y={PT} width={gW - 4} height={cH}
                  rx="6" fill="#f8f9fc" />
              )}
              {/* Plan bar - yellow */}
              <rect x={px} y={pY} width={bW} height={pH} rx="4"
                fill="#ECC94B" opacity={d.a === 0 ? 0.25 : 0.65} />
              {/* Actual bar - dark blue */}
              {d.a > 0 && (
                <rect x={ax} y={aY} width={bW} height={aH} rx="4"
                  fill={PRIMARY} opacity={isHov ? 1 : 0.9} />
              )}
              <text x={cx} y={H - 6} textAnchor="middle" fontSize="8.5"
                fill={isHov ? PRIMARY : "#b0b8c4"} fontWeight={isHov ? "700" : "400"}>
                {d.m}
              </text>
              {isHov && d.a > 0 && (() => {
                const ttW = 110, ttH = 40;
                const tx = Math.min(Math.max(cx - ttW / 2, 2), W - ttW - 2);
                const ty = Math.min(aY, pY) - ttH - 8;
                return (
                  <g>
                    <rect x={tx} y={ty} width={ttW} height={ttH} rx="8" fill={DARK} />
                    <text x={tx + 10} y={ty + 14} fontSize="8.5" fill="#9ca3af">จริง</text>
                    <text x={tx + ttW - 8} y={ty + 14} textAnchor="end" fontSize="8.5"
                      fill="#059669" fontWeight="700">{d.a}K฿</text>
                    <text x={tx + 10} y={ty + 28} fontSize="8.5" fill="#9ca3af">แผน</text>
                    <text x={tx + ttW - 8} y={ty + 28} textAnchor="end" fontSize="8.5"
                      fill="#ECC94B" fontWeight="700">{d.p}K฿</text>
                  </g>
                );
              })()}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// --- MINI CALENDAR -----------------------------------------------
function MiniCalendar({ year, month, apptDates }: {
  year: number; month: number; apptDates: Set<string>;
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 }}>
        {THAI_DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "0.62rem", fontWeight: 700,
            color: "#c4cbd4", padding: "2px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} style={{ height: 32 }} />;
          const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday = ds === "2026-06-24";
          const hasAppt = apptDates.has(ds);
          return (
            <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "center",
              height: 32, position: "relative" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isToday ? PRIMARY : "transparent",
                cursor: "pointer",
              }}>
                <span style={{ fontSize: "0.78rem", fontWeight: isToday ? 700 : 400,
                  color: isToday ? "#fff" : "#4a5568" }}>{day}</span>
              </div>
              {hasAppt && !isToday && (
                <div style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)",
                  width: 4, height: 4, borderRadius: "50%", background: "#ECC94B" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- TOP LEADS TABLE ---------------------------------------------
function TopLeadsTable({ tab }: { tab: "week" | "month" | "year" }) {
  const limit = tab === "week" ? 4 : tab === "month" ? 6 : 8;
  const sorted = [...leads]
    .sort((a, b) => leadValue(b.value) - leadValue(a.value))
    .slice(0, limit);

  const avatarColors = ["#003366","#059669","#f59e0b","#dc2626","#002244","#8fa3b8","#2D2D2D","#C0C0C0"];

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["ลูกค้า","สินค้า","มูลค่า","จังหวัด","สถานะ"].map(h => (
              <th key={h} style={{ padding: "8px 12px", textAlign: "left",
                fontSize: "0.63rem", fontWeight: 700, color: "#b0b8c4",
                textTransform: "uppercase", letterSpacing: "0.05em",
                borderBottom: "1px solid #f4f6f9" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((l, i) => {
            const sc = STATUS_PILL[l.status] ?? STATUS_PILL.NEW;
            const c = avatarColors[i % avatarColors.length];
            return (
              <tr key={l.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f8f9fc"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; }}>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #f8f9fc" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: c + "22",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.68rem", fontWeight: 800, color: c, flexShrink: 0 }}>
                      {l.name.charAt(0)}
                    </div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: DARK }}>{l.name}</span>
                  </div>
                </td>
                <td style={{ padding: "10px 12px", fontSize: "0.74rem", color: MUTED,
                  borderBottom: "1px solid #f8f9fc" }}>{l.product}</td>
                <td style={{ padding: "10px 12px", fontSize: "0.82rem", fontWeight: 700,
                  color: DARK, borderBottom: "1px solid #f8f9fc" }}>{l.value}</td>
                <td style={{ padding: "10px 12px", fontSize: "0.74rem", color: MUTED,
                  borderBottom: "1px solid #f8f9fc" }}>{l.province}</td>
                <td style={{ padding: "10px 12px", borderBottom: "1px solid #f8f9fc" }}>
                  <span style={{ background: sc.bg, color: sc.text, borderRadius: 99,
                    padding: "3px 10px", fontSize: "0.66rem", fontWeight: 700 }}>
                    {leadStatusLabel[l.status as LeadStatus] ?? l.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// --- LEAD PIPELINE DONUT -----------------------------------------
function LeadDonut() {
  const total = leads.length;
  const paid   = leads.filter(l => l.status === "PAID").length;
  const active = leads.filter(l => l.status !== "PAID" && l.status !== "CANCELLED").length;
  const paidPct   = total > 0 ? Math.round(paid / total * 100) : 0;
  const activePct = total > 0 ? Math.round(active / total * 100) : 0;

  const R1 = 54, R2 = 38, CX = 80, CY = 80, SW = 14;
  const c1 = 2 * Math.PI * R1, c2 = 2 * Math.PI * R2;
  const d1 = paidPct / 100 * c1, d2 = activePct / 100 * c2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {/* Outer ring - paid (yellow) */}
        <circle cx={CX} cy={CY} r={R1} fill="none" stroke="#f4f6f9" strokeWidth={SW} />
        <circle cx={CX} cy={CY} r={R1} fill="none" stroke="#ECC94B" strokeWidth={SW}
          strokeDasharray={`${d1} ${c1 - d1}`}
          strokeDashoffset={c1 * 0.25}
          strokeLinecap="round" style={{ transition: "stroke-dasharray .6s" }} />
        {/* Inner ring - active (blue) */}
        <circle cx={CX} cy={CY} r={R2} fill="none" stroke="#f4f6f9" strokeWidth={SW} />
        <circle cx={CX} cy={CY} r={R2} fill="none" stroke={PRIMARY} strokeWidth={SW}
          strokeDasharray={`${d2} ${c2 - d2}`}
          strokeDashoffset={c2 * 0.25}
          strokeLinecap="round" style={{ transition: "stroke-dasharray .6s" }} />
        {/* Center */}
        <text x={CX} y={CY - 8} textAnchor="middle" fontSize="9" fill="#9ca3af">ลีดทั้งหมด</text>
        <text x={CX} y={CY + 12} textAnchor="middle" fontSize="22" fontWeight="800" fill={DARK}>{total}</text>
      </svg>
      <div style={{ display: "flex", gap: 24, marginTop: 2 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "0.67rem", color: "#b0b8c4", marginBottom: 2 }}>อัตราปิด</div>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ECC94B" }}>{paidPct}%</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "0.67rem", color: "#b0b8c4", marginBottom: 2 }}>กำลังดำเนินการ</div>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, color: PRIMARY }}>{activePct}%</div>
        </div>
      </div>
    </div>
  );
}

// --- ICONS (SVG) -------------------------------------------------
const IcoMoney = ({ size = 26, color = "#059669" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);
const IcoPhone = ({ size = 26, color = "#003366" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.9 10.82 19.79 19.79 0 01.84 2.18 2 2 0 012.83 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l.98-.98a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const IcoFolder = ({ size = 26, color = "#f59e0b" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);
const IcoUsers = ({ size = 26, color = "#003366" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

// --- PAGE ---------------------------------------------------------
export default function DashboardPage() {
  const [tab, setTab]         = useState<"week" | "month" | "year">("month");
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(5); // June = index 5

  const totalRevenue = useMemo(() =>
    payments.filter(p => p.status === "confirmed").reduce((s, p) => s + p.amount, 0), []);
  const activeLeads = useMemo(() =>
    leads.filter(l => l.status !== "PAID" && l.status !== "CANCELLED"), []);

  const upcomingAppts = useMemo(() =>
    [...appointments]
      .filter(a => a.date >= "2026-06-24" && a.status === "upcoming")
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 2), []);

  const apptDates = useMemo(() => new Set(appointments.map(a => a.date)), []);

  const inProgressProjects = useMemo(() =>
    projects.filter(p => p.status === "in_progress"), []);

  return (
    <div style={{ background: BG, minHeight: "100vh", paddingBottom: 40 }}>

      {/* -- Header -------------------------------------------- */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: DARK, marginBottom: 3 }}>
          แดชบอร์ด
        </h1>
        <p style={{ fontSize: "0.76rem", color: MUTED }}>
          ยินดีต้อนรับ · สรุปภาพรวมระบบ Benjamin PMS อัปเดต 24 มิถุนายน 2569
        </p>
      </div>

      {/* -- 4 Stat Cards -------------------------------------- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        <StatCard
          icon={<IcoMoney />} label="รายได้รวม" value={fmt(totalRevenue)}
          sub="จากการชำระเงิน" iconBg="#e5faf0" iconColor="#059669" href="/payments" />
        <StatCard
          icon={<IcoPhone />} label="ลีดทั้งหมด" value={String(leads.length)}
          sub={`${activeLeads.length} กำลังดำเนินการ`} iconBg="#dce5f0" iconColor="#003366" href="/leads" />
        <StatCard
          icon={<IcoFolder />} label="โครงการ" value={String(projects.length)}
          sub={`${inProgressProjects.length} กำลังดำเนินการ`} iconBg="#fef3cd" iconColor="#f59e0b" href="/projects" />
        <StatCard
          icon={<IcoUsers />} label="ลูกค้า" value={String(customers.length)}
          sub="ทั้งหมดในระบบ" iconBg="#f0f0f5" iconColor="#2D2D2D" href="/customers" />
      </div>

      {/* -- Middle: Chart + Calendar --------------------------- */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 316px", gap: 16, marginBottom: 16 }}>

        {/* Monthly Bar Chart */}
        <div style={{ ...CARD, padding: "22px 22px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: DARK }}>รายได้รายเดือน</div>
              <div style={{ fontSize: "0.68rem", color: MUTED, marginTop: 2 }}>ยอดขาย เทียบ เป้าหมายปี (K฿)</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: MUTED }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: PRIMARY }} />
                ยอดจริง
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.7rem", color: MUTED }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: "#ECC94B" }} />
                แผน
              </div>
              <div style={{ background: "#f4f6f9", borderRadius: 10, padding: "5px 14px",
                fontSize: "0.75rem", fontWeight: 600, color: "#4a5568", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5, userSelect: "none" }}>
                2569 <span style={{ fontSize: "0.6rem" }}>▾</span>
              </div>
            </div>
          </div>
          <MonthlyBarChart />
        </div>

        {/* Calendar */}
        <div style={{ ...CARD, padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: "0.92rem", fontWeight: 800, color: DARK }}>นัดหมายของฉัน</div>
            <a href="/appointments" style={{ fontSize: "0.68rem", color: MUTED, textDecoration: "none",
              fontWeight: 600, background: "#f4f6f9", borderRadius: 8, padding: "3px 10px" }}>
              ดูทั้ง ›
            </a>
          </div>

          {/* Upcoming events */}
          {upcomingAppts.map(a => {
            const [,mm,dd] = a.date.split("-");
            return (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", background: "#f8f9fc", borderRadius: 12, marginBottom: 8,
                cursor: "pointer" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: (APPT_COLOR[a.type] ?? "#003366") + "22",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800,
                    color: APPT_COLOR[a.type] ?? "#003366", lineHeight: 1 }}>{dd}</span>
                  <span style={{ fontSize: "0.52rem", color: APPT_COLOR[a.type] ?? "#003366" }}>
                    {MONTHS_SHORT[parseInt(mm) - 1]}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.76rem", fontWeight: 700, color: DARK,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.company}
                  </div>
                  <div style={{ fontSize: "0.63rem", color: MUTED }}>
                    {APPT_LABEL[a.type] ?? a.type} · {a.time}
                  </div>
                </div>
                <span style={{ color: "#c4cbd4", fontSize: "1.1rem" }}>›</span>
              </div>
            );
          })}

          <div style={{ height: 1, background: "#f4f6f9", margin: "10px 0" }} />

          {/* Month nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <button onClick={() => {
              let m = calMonth - 1, y = calYear;
              if (m < 0) { m = 11; y--; }
              setCalMonth(m); setCalYear(y);
            }} style={{ background: "none", border: "none", cursor: "pointer",
              color: "#b0b8c4", fontSize: "1.1rem", padding: "0 4px", lineHeight: 1 }}>‹</button>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: DARK }}>
              {THAI_MONTHS_FULL[calMonth]} {calYear + 543}
            </span>
            <button onClick={() => {
              let m = calMonth + 1, y = calYear;
              if (m > 11) { m = 0; y++; }
              setCalMonth(m); setCalYear(y);
            }} style={{ background: "none", border: "none", cursor: "pointer",
              color: "#b0b8c4", fontSize: "1.1rem", padding: "0 4px", lineHeight: 1 }}>›</button>
          </div>

          <MiniCalendar year={calYear} month={calMonth} apptDates={apptDates} />
        </div>
      </div>

      {/* -- Bottom: Top Leads + Donut + Dark Card ------------ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px 240px", gap: 16 }}>

        {/* Top Leads Table */}
        <div style={{ ...CARD, padding: "20px 20px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: "0.92rem", fontWeight: 800, color: DARK }}>ลีดอันดับต้น</div>
            <div style={{ display: "flex", gap: 0, background: "#f4f6f9", borderRadius: 12, padding: 3 }}>
              {(["week", "month", "year"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ padding: "5px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                    fontSize: "0.72rem", fontWeight: tab === t ? 700 : 400,
                    background: tab === t ? "#fff" : "transparent",
                    color: tab === t ? DARK : "#9ca3af",
                    boxShadow: tab === t ? "0 1px 6px rgba(0,0,0,.08)" : "none",
                    transition: "all .15s" }}>
                  {t === "week" ? "สัปดาห์" : t === "month" ? "เดือน" : "ปี"}
                </button>
              ))}
            </div>
          </div>
          <TopLeadsTable tab={tab} />
        </div>

        {/* Lead Donut */}
        <div style={{ ...CARD, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ alignSelf: "flex-start", marginBottom: 4 }}>
            <div style={{ fontSize: "0.88rem", fontWeight: 800, color: DARK }}>สถานะลีด</div>
            <div style={{ fontSize: "0.67rem", color: MUTED }}>Pipeline ภาพรวม</div>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <LeadDonut />
          </div>
        </div>

        {/* Dark Quick-Action Card */}
        <div style={{ ...CARD,
          background: "#003366",
          padding: "24px 22px", position: "relative", overflow: "hidden",
          display: "flex", flexDirection: "column" }}>
          {/* Decorative rings */}
          <div style={{ position: "absolute", right: -40, top: -40, width: 140, height: 140,
            borderRadius: "50%", border: "32px solid rgba(255,255,255,.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: -10, bottom: -50, width: 180, height: 180,
            borderRadius: "50%", border: "32px solid rgba(255,255,255,.04)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,.4)", fontWeight: 700,
              letterSpacing: "0.12em", marginBottom: 10 }}>BENJAMIN PMS</div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: "#fff", lineHeight: 1.45, marginBottom: 6 }}>
              เพิ่มยอดขาย<br />ง่ายขึ้น
            </div>
            <div style={{ fontSize: "0.67rem", color: "rgba(255,255,255,.5)", marginBottom: 22, lineHeight: 1.6 }}>
              บันทึกลีด โครงการ และ<br />ผลการดำเนินงาน
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" }}>
              <a href="/leads" style={{ display: "flex", alignItems: "center", gap: 8,
                padding: "10px 14px", background: "rgba(255,255,255,.12)", borderRadius: 12,
                textDecoration: "none", color: "#fff", fontSize: "0.75rem", fontWeight: 600,
                border: "1px solid rgba(255,255,255,.12)" }}>
                <span style={{ fontSize: "1rem" }}>+</span> เพิ่มลีดใหม่
              </a>
              <a href="/projects" style={{ display: "flex", alignItems: "center", gap: 8,
                padding: "10px 14px", background: "#fff", borderRadius: 12,
                textDecoration: "none", color: PRIMARY, fontSize: "0.75rem", fontWeight: 700 }}>
                <span style={{ fontSize: "1rem" }}>+</span> สร้างโครงการ
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
