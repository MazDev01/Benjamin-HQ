"use client";

import Link from "next/link";
import { XCircle, AlertTriangle, Check } from "lucide-react";
import { leadPool } from "@/lib/mock";

const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
  boxShadow: "0 2px 14px rgba(0,0,0,.07)", overflow: "hidden", display: "flex", flexDirection: "column",
};

function slaStyle(h: number): { Icon: React.ElementType; color: string; bg: string } {
  if (h >= 48) return { Icon: XCircle,       color: "#dc2626", bg: "#fee2e2" };
  if (h >= 24) return { Icon: AlertTriangle, color: "#d97706", bg: "#fef3cd" };
  return               { Icon: Check,        color: "#003366", bg: "#dce5f0" };
}

function formatWait(h: number): string {
  if (h < 24) return `${h} ชม.`;
  const d = Math.floor(h / 24);
  const r = h % 24;
  return r > 0 ? `${d} วัน ${r} ชม.` : `${d} วัน`;
}

export function LeadPoolWidget() {
  const total = leadPool.reduce((sum, r) => sum + r.valueNum, 0);
  const totalLabel = `฿${(total / 1_000_000).toFixed(1)}M`;
  const criticalCount = leadPool.filter(r => r.waitHours >= 48).length;

  // เรียงตาม urgency (รอนานสุดก่อน)
  const topLeads = [...leadPool].sort((a, b) => b.waitHours - a.waitHours).slice(0, 3);

  return (
    <div style={CARD}>
      <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
          <p style={{ fontSize: "0.84rem", fontWeight: 700, color: "#2D2D2D", margin: 0 }}>ลีดส่วนกลาง</p>
          <div style={{ display: "flex", gap: 5 }}>
            {criticalCount > 0 && (
              <span style={{ fontSize: "0.63rem", fontWeight: 700, background: "#fee2e2", color: "#dc2626", borderRadius: 99, padding: "2px 8px", display: "inline-flex", alignItems: "center", gap: 4 }}>
                <XCircle size={10} strokeWidth={2.5} /> {criticalCount} เกิน SLA
              </span>
            )}
            <span style={{ fontSize: "0.63rem", fontWeight: 700, background: "#fef3cd", color: "#d97706", borderRadius: 99, padding: "2px 8px" }}>
              {leadPool.length} รอ
            </span>
          </div>
        </div>
        <p style={{ fontSize: "0.7rem", color: "#6b7280", margin: "4px 0 0" }}>
          มูลค่ารวม <strong style={{ color: "#003366" }}>{totalLabel}</strong>
        </p>
      </div>

      <div style={{ flex: 1 }}>
        {topLeads.map((r) => {
          const sla = slaStyle(r.waitHours);
          return (
            <div key={r.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 18px", borderBottom: "1px solid #f0f4f8",
              background: r.waitHours >= 48 ? "#fff8f8" : r.waitHours >= 24 ? "#fffdf7" : "",
            }}>
              {/* SLA icon */}
              <span style={{
                width: 22, height: 22, borderRadius: "50%", background: sla.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}><sla.Icon size={11} color={sla.color} strokeWidth={2.5} /></span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.74rem", fontWeight: 600, color: "#2D2D2D", margin: 0,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.name}
                </p>
                <p style={{ fontSize: "0.62rem", margin: "1px 0 0", display: "flex", gap: 6 }}>
                  <span style={{ color: "#6b7280" }}>{r.province} · {r.product}</span>
                  <span style={{ color: sla.color, fontWeight: 700 }}>{formatWait(r.waitHours)}</span>
                </p>
              </div>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#003366", flexShrink: 0 }}>
                {r.value}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "10px 18px", borderTop: "1px solid #f0f4f8" }}>
        <Link href="/hq/lead-pool" style={{
          fontSize: "0.72rem", fontWeight: 700, color: "#003366", textDecoration: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          จัดการลีดทั้งหมด →
        </Link>
      </div>
    </div>
  );
}
