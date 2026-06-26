"use client";

import { useState } from "react";
import Link from "next/link";
import { leadPool, pendingApprovals, hqProjectSummary } from "@/lib/mock";
import { ApprovalQueue } from "@/components/hq/ApprovalQueue";
import { X, AlertTriangle } from "lucide-react";

const BORDER = "#e5e7eb";

export function AlertStrip() {
  const leads     = leadPool.length;
  const approvals = pendingApprovals.length;
  const overdue   = hqProjectSummary.overdue;

  const [showModal, setShowModal] = useState(false);

  if (leads === 0 && approvals === 0 && overdue === 0) return null;

  return (
    <>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
        padding: "9px 14px",
        background: "#fff", border: `1px solid ${BORDER}`,
        borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,.04)",
      }}>
        <span style={{
          fontSize: "0.65rem", fontWeight: 800, color: "#6b7280",
          textTransform: "uppercase", letterSpacing: "0.07em",
          display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
        }}>
          <AlertTriangle size={12} color="#d97706" strokeWidth={2.5} />
          ต้องดำเนินการ
        </span>

        <div style={{ width: 1, height: 16, background: BORDER, flexShrink: 0 }} />

        {approvals > 0 && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: "0.72rem", fontWeight: 700, color: "#dc2626",
              background: "#fff7f7", border: "1px solid #fecaca",
              padding: "4px 11px", borderRadius: 20, cursor: "pointer",
            }}
          >
            {approvals} ใบเสนอรออนุมัติ →
          </button>
        )}

        {leads > 0 && (
          <Link href="/hq/lead-pool" style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: "0.72rem", fontWeight: 700, color: "#003366",
            background: "#f0f4f8", border: "1px solid #b8cadf",
            padding: "4px 11px", borderRadius: 20, textDecoration: "none",
          }}>
            {leads} ลีดรอมอบหมาย →
          </Link>
        )}

        {overdue > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: "0.72rem", fontWeight: 700, color: "#d97706",
            background: "#fffcf0", border: "1px solid #fde68a",
            padding: "4px 11px", borderRadius: 20,
          }}>
            {overdue} โครงการเกินกำหนด
          </span>
        )}
      </div>

      {/* ── Inline Approval Modal ── */}
      {showModal && (
        <>
          <div
            onClick={() => setShowModal(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 1040 }}
          />
          <div style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(700px, 95vw)", maxHeight: "85vh",
            background: "#fff", borderRadius: 18,
            boxShadow: "0 20px 60px rgba(0,0,0,.22)",
            zIndex: 1050, display: "flex", flexDirection: "column",
          }}>
            <div style={{
              padding: "16px 20px", borderBottom: `1px solid ${BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexShrink: 0,
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#2D2D2D" }}>
                  อนุมัติใบเสนอราคา
                </h2>
                <p style={{ margin: "3px 0 0", fontSize: "0.72rem", color: "#6b7280" }}>
                  {approvals} รายการรออนุมัติ · ส่วนลดเกินเกณฑ์ที่กำหนด
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ overflowY: "auto", flex: 1, padding: "16px 20px" }}>
              <ApprovalQueue />
            </div>
          </div>
        </>
      )}
    </>
  );
}
