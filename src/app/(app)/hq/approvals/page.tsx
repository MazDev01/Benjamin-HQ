"use client";

import { ApprovalQueue } from "@/components/hq/ApprovalQueue";
import { pendingApprovals } from "@/lib/mock";

const CARD: React.CSSProperties = { background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", boxShadow: "0 2px 14px rgba(0,0,0,.07)" };

export default function HQApprovalsPage() {
  const totalValue = pendingApprovals.reduce((s, a) => {
    const v = parseFloat(a.total.replace(/[฿,.M]/g, "").trim()) * (a.total.includes("M") ? 1000000 : 1);
    return s + v;
  }, 0);
  const maxDiscount = Math.max(...pendingApprovals.map(a => a.discountPct));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: "1.55rem", fontWeight: 800, color: "#2D2D2D", marginBottom: 3 }}>รออนุมัติ</h1>
        <p style={{ fontSize: "0.76rem", color: "#6b7280" }}>ใบเสนอราคาที่ส่วนลดเกินเกณฑ์ — รอการอนุมัติจาก HQ</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { label: "รออนุมัติ", value: pendingApprovals.length, color: "#dc2626" },
          { label: "มูลค่ารวม", value: `฿${(totalValue / 1000000).toFixed(1)}M`, color: "#003366" },
          { label: "ส่วนลดสูงสุด", value: `${maxDiscount}%`, color: "#f59e0b" },
        ].map((s, i) => (
          <div key={i} style={{ ...CARD, padding: "14px 16px" }}>
            <div style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {pendingApprovals.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "9px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: "#fff7f7", border: "1px solid #fecaca", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700, color: "#dc2626", flexShrink: 0 }}>
            {pendingApprovals.length} รายการ
          </span>
          <span style={{ fontSize: "0.76rem", color: "#2D2D2D", fontWeight: 600 }}>ใบเสนอราคารอการพิจารณาจาก HQ</span>
        </div>
      )}

      <ApprovalQueue />
    </div>
  );
}
