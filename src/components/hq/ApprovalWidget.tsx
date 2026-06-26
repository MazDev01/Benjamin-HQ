"use client";

import Link from "next/link";
import { FileText, CheckCircle } from "lucide-react";
import { pendingApprovals } from "@/lib/mock";
import { useApprovals } from "@/context/ApprovalContext";

const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
  boxShadow: "0 2px 14px rgba(0,0,0,.07)", overflow: "hidden", display: "flex", flexDirection: "column",
};

export function ApprovalWidget() {
  const { actions, pendingCount } = useApprovals();
  const remaining = pendingApprovals.filter(r => !actions[r.id]);
  const oldest = remaining[remaining.length - 1];

  return (
    <div style={CARD}>
      <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "0.84rem", fontWeight: 700, color: "#2D2D2D", margin: 0 }}>รออนุมัติ</p>
          {pendingCount > 0 ? (
            <span style={{
              fontSize: "0.68rem", fontWeight: 700, background: "#fef3cd", color: "#d97706",
              borderRadius: 99, padding: "2px 10px",
            }}>{pendingCount} รายการ</span>
          ) : (
            <span style={{
              fontSize: "0.68rem", fontWeight: 700, background: "#e5faf0", color: "#059669",
              borderRadius: 99, padding: "2px 10px",
            }}>ครบแล้ว ✓</span>
          )}
        </div>
        {oldest && (
          <p style={{ fontSize: "0.7rem", color: "#6b7280", margin: "4px 0 0" }}>
            รายการเก่าสุด: <strong style={{ color: "#d97706" }}>{oldest.requestedAt}</strong>
          </p>
        )}
      </div>

      <div style={{ flex: 1 }}>
        {remaining.length > 0 ? remaining.map((r) => (
          <div key={r.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 18px", borderBottom: "1px solid #f0f4f8",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: "#fef3cd",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <FileText size={14} color="#d97706" strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.74rem", fontWeight: 600, color: "#2D2D2D", margin: 0,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.quoteNo} · {r.customer}
              </p>
              <p style={{ fontSize: "0.62rem", color: "#6b7280", margin: "1px 0 0" }}>
                สาขา{r.dealer} · ส่วนลด {r.discountPct}%
              </p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: "0.74rem", fontWeight: 700, color: "#2D2D2D", margin: 0 }}>{r.total}</p>
              <p style={{ fontSize: "0.6rem", color: "#9ca3af", margin: "1px 0 0" }}>{r.requestedAt}</p>
            </div>
          </div>
        )) : (
          <div style={{ padding: "24px 18px", textAlign: "center" }}>
            <CheckCircle size={28} color="#059669" style={{ marginBottom: 8 }} />
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2D2D2D", margin: "0 0 3px" }}>ทุกรายการพิจารณาแล้ว</p>
            <p style={{ fontSize: "0.7rem", color: "#6b7280", margin: 0 }}>ไม่มีใบเสนอราคารออนุมัติ</p>
          </div>
        )}
      </div>

      <div style={{ padding: "10px 18px", borderTop: "1px solid #f0f4f8" }}>
        <Link href="/hq/approvals" style={{
          fontSize: "0.72rem", fontWeight: 700, color: "#d97706", textDecoration: "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
        }}>
          ไปหน้าอนุมัติ →
        </Link>
      </div>
    </div>
  );
}
