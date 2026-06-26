"use client";

import { hqServiceLineRevenue } from "@/lib/mock";

const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
  boxShadow: "0 2px 14px rgba(0,0,0,.07)", overflow: "hidden",
};

export function ServiceLineWidget() {
  const max = Math.max(...hqServiceLineRevenue.map((r) => r.value));
  const totalValue = hqServiceLineRevenue.reduce((s, r) => s + r.value, 0);

  return (
    <div style={CARD}>
      <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "0.84rem", fontWeight: 700, color: "#2D2D2D", margin: 0 }}>รายได้ตามสายบริการ</p>
          <span style={{ fontSize: "0.68rem", color: "#6b7280" }}>YTD 2026</span>
        </div>
        <p style={{ fontSize: "0.7rem", color: "#6b7280", margin: "4px 0 0" }}>
          รวม <strong style={{ color: "#003366" }}>฿{(totalValue / 1_000_000).toFixed(1)}M</strong>
        </p>
      </div>

      <div style={{ padding: "14px 18px" }}>
        {hqServiceLineRevenue.map((r) => {
          const barPct = Math.round((r.value / max) * 100);
          const sharePct = Math.round((r.value / totalValue) * 100);
          const label = `฿${(r.value / 1_000_000).toFixed(1)}M`;
          return (
            <div key={r.line} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, flexShrink: 0, display: "inline-block", marginTop: 1 }} />
                  <span style={{ fontSize: "0.74rem", fontWeight: 600, color: "#2D2D2D" }}>{r.line}</span>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "#2D2D2D" }}>{label}</div>
                  <div style={{ fontSize: "0.62rem", color: "#9ca3af", marginTop: 1 }}>{sharePct}% ของรายได้รวม</div>
                </div>
              </div>
              <div style={{ height: 6, background: "#f0f4f8", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${barPct}%`, background: r.color, borderRadius: 99 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
