"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { dealerLeaderboard, hqProjectSummary, hqDealSummary } from "@/lib/mock";

export function AlertBanner() {
  const atRisk = dealerLeaderboard
    .filter(d => d.status === "active")
    .filter(d => d.revenueActual / d.revenueTarget < 0.7);

  const overdue   = hqProjectSummary.overdue;
  const lateLeads = hqDealSummary.leadsOverdue;

  type Alert = { text: string; detail?: string; href: string };

  const alerts: Alert[] = [
    atRisk.length > 0 && {
      text: `${atRisk.length} สาขาต่ำกว่าเป้า`,
      detail: atRisk.map(d => d.name.replace("Benjamin ", "")).join(", "),
      href: "/hq/dealers",
    },
    overdue > 0 && {
      text: `${overdue} โครงการเกินกำหนด`,
      href: "/hq/projects",
    },
    lateLeads > 0 && {
      text: `${lateLeads} leads รอติดตาม > 48 ชม.`,
      href: "/hq/pipeline",
    },
  ].filter(Boolean) as Alert[];

  if (alerts.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8 }}>
        <CheckCircle2 size={13} color="#059669" />
        <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>ทุกอย่างปกติ</span>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 0,
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
      overflow: "hidden",
    }}>
      {/* Icon label */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRight: "1px solid #e5e7eb", flexShrink: 0 }}>
        <AlertTriangle size={13} color="#d97706" />
        <span style={{ fontSize: "0.67rem", fontWeight: 700, color: "#374151" }}>แจ้งเตือน</span>
      </div>

      {/* Alerts — plain text links separated by dots */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", padding: "0 12px", gap: 0 }}>
        {alerts.map((a, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
            {i > 0 && <span style={{ color: "#d1d5db", margin: "0 8px", fontSize: "0.7rem" }}>·</span>}
            <Link href={a.href} style={{ textDecoration: "none" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                fontSize: "0.72rem", color: "#374151", fontWeight: 500,
                padding: "6px 4px",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#003366"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#374151"; }}
              >
                {a.text}
                {a.detail && <span style={{ color: "#9ca3af", fontWeight: 400 }}> ({a.detail})</span>}
                <ChevronRight size={10} color="#9ca3af" />
              </span>
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}
