"use client";

import { Trophy, Inbox, CheckCircle2, ArrowRightLeft, Building2, Receipt } from "lucide-react";
import { hqRecentActivity, ActivityKind } from "@/lib/mock";

const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
  boxShadow: "0 2px 14px rgba(0,0,0,.07)", overflow: "hidden",
};

const KIND_ICON: Record<ActivityKind, React.ElementType> = {
  win:     Trophy,
  lead:    Inbox,
  approve: CheckCircle2,
  assign:  ArrowRightLeft,
  project: Building2,
  invoice: Receipt,
};

const KIND_COLOR: Record<ActivityKind, { bg: string; color: string }> = {
  win:     { bg: "#e5faf0", color: "#059669" },
  lead:    { bg: "#dce5f0", color: "#003366" },
  approve: { bg: "#dce5f0", color: "#003366" },
  assign:  { bg: "#dce5f0", color: "#003366" },
  project: { bg: "#dce5f0", color: "#003366" },
  invoice: { bg: "#dce5f0", color: "#003366" },
};

export function ActivityFeed() {
  return (
    <div style={CARD}>
      <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid #e5e7eb" }}>
        <p style={{ fontSize: "0.84rem", fontWeight: 700, color: "#2D2D2D", margin: 0 }}>กิจกรรมล่าสุด</p>
        <p style={{ fontSize: "0.7rem", color: "#6b7280", margin: "4px 0 0" }}>ทั้งเครือ · อัปเดตอัตโนมัติ</p>
      </div>

      <div>
        {hqRecentActivity.map((item, i) => {
          const style = KIND_COLOR[item.kind];
          return (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "10px 18px", borderBottom: i < hqRecentActivity.length - 1 ? "1px solid #f0f4f8" : "none",
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9, background: style.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 1,
              }}>
                {(() => { const Icon = KIND_ICON[item.kind]; return <Icon size={14} color={style.color} strokeWidth={2} />; })()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.74rem", fontWeight: 500, color: "#2D2D2D", margin: 0, lineHeight: 1.4 }}>
                  {item.text}
                </p>
                <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                  <span style={{
                    fontSize: "0.6rem", fontWeight: 600, color: style.color,
                    background: style.bg, borderRadius: 4, padding: "1px 6px",
                  }}>
                    {item.branch}
                  </span>
                  <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}>{item.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
