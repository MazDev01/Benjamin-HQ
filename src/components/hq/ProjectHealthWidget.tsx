"use client";

import { hqProjectSummary } from "@/lib/mock";

const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
  boxShadow: "0 2px 14px rgba(0,0,0,.07)", overflow: "hidden",
};

const DR = 46;
const DC = 2 * Math.PI * DR; // ≈ 289

export function ProjectHealthWidget() {
  const { total, inProgress, onHold, notStarted, overdue } = hqProjectSummary;

  const rows = [
    { label: "กำลังดำเนินการ", count: inProgress,  color: "#003366", bg: "#dce5f0" },
    { label: "ยังไม่เริ่ม",     count: notStarted,  color: "#94a3b8", bg: "#f0f0f5" },
    { label: "หยุดชั่วคราว",    count: onHold,      color: "#d97706", bg: "#fef3cd" },
    { label: "เกินกำหนด",       count: overdue,     color: "#dc2626", bg: "#fee2e2" },
  ];

  // Cumulative start angles for donut segments (12 o'clock = -90°)
  let cumAngle = -90;
  const segments = rows.map(r => {
    const pct = total > 0 ? r.count / total : 0;
    const startAngle = cumAngle;
    cumAngle += pct * 360;
    return { ...r, pct, startAngle };
  });

  return (
    <div style={CARD}>
      <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "0.84rem", fontWeight: 700, color: "#2D2D2D", margin: 0 }}>สุขภาพโครงการ</p>
          <span style={{
            fontSize: "0.68rem", fontWeight: 700, background: "#dce5f0", color: "#003366",
            borderRadius: 99, padding: "2px 10px",
          }}>{total} โครงการทั้งหมด</span>
        </div>
        <p style={{ fontSize: "0.7rem", color: "#6b7280", margin: "4px 0 0" }}>รวมทุกสาขา · มิถุนายน 2026</p>
      </div>

      <div style={{ padding: "16px 18px" }}>
        {/* Donut chart */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <svg width="130" height="130" viewBox="0 0 120 120" style={{ userSelect: "none" }}>
            {/* Track */}
            <circle cx="60" cy="60" r={DR} fill="none" stroke="#f0f4f8" strokeWidth="16" />

            {/* Segments — rotate each circle to its start angle (no dashoffset math needed) */}
            {segments.map((s, i) =>
              s.count > 0 ? (
                <circle
                  key={i}
                  cx="60" cy="60" r={DR}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="16"
                  strokeDasharray={`${DC * s.pct} ${DC}`}
                  transform={`rotate(${s.startAngle}, 60, 60)`}
                />
              ) : null
            )}

            {/* Center label */}
            <text x="60" y="56" textAnchor="middle" fontSize="22" fontWeight="800" fill="#2D2D2D">{total}</text>
            <text x="60" y="71" textAnchor="middle" fontSize="10" fill="#9ca3af">โครงการ</text>
          </svg>
        </div>

        {/* Legend grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 6px" }}>
          {rows.map(r => {
            const pct = Math.round((r.count / total) * 100);
            return (
              <div key={r.label} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                <span style={{
                  width: 9, height: 9, borderRadius: "50%", background: r.color,
                  flexShrink: 0, display: "inline-block", marginTop: 3,
                }} />
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#475569", fontWeight: 500, whiteSpace: "nowrap" }}>{r.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <span style={{
                      fontSize: "0.65rem", fontWeight: 700, color: r.color,
                      background: r.bg, borderRadius: 99, padding: "0px 6px",
                    }}>{r.count}</span>
                    <span style={{ fontSize: "0.62rem", color: "#9ca3af" }}>{pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
