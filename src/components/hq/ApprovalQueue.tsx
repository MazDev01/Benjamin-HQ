"use client";

import { useState } from "react";
import { pendingApprovals, approvalDetails, type ApprovalRow, type ApprovalDetail } from "@/lib/mock";
import { CheckCircle, XCircle, AlertTriangle, X, FileText, TrendingDown, Clock, PartyPopper } from "lucide-react";
import { useApprovals } from "@/context/ApprovalContext";

const DISCOUNT_THRESHOLD = 10;
const MARGIN_THRESHOLD   = 18; // % minimum acceptable gross margin

type Outcome = { action: "approved" | "rejected"; reason?: string };

const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
  boxShadow: "0 2px 14px rgba(0,0,0,.07)", overflow: "hidden",
};

const REJECT_REASONS = [
  "ส่วนลดสูงเกินไป กระทบกำไรขั้นต่ำ",
  "ขอเอกสารต้นทุน/BOQ เพิ่มก่อนพิจารณา",
  "ให้เจรจาเงื่อนไขกับลูกค้าใหม่",
  "ราคาต่ำกว่าราคากลางที่กำหนด",
];

function fmtMoney(n: number) {
  return n >= 1_000_000
    ? `฿${(n / 1_000_000).toFixed(2)}M`
    : `฿${n.toLocaleString()}`;
}

export function ApprovalQueue() {
  const { actions, pendingCount, approve: ctxApprove, reject: ctxReject } = useApprovals();
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailItem, setDetailItem]   = useState<ApprovalRow | null>(null);

  function approve(id: string)  { ctxApprove(id); setDetailItem(null); }
  function openReject(id: string) { setRejectTarget(id); setRejectReason(""); setDetailItem(null); }
  function confirmReject() {
    if (!rejectTarget || !rejectReason.trim()) return;
    ctxReject(rejectTarget, rejectReason.trim());
    setRejectTarget(null); setRejectReason("");
  }

  return (
    <>
      <div style={CARD}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 14px", borderBottom: "1px solid #e5e7eb" }}>
          <div>
            <p style={{ fontSize: "0.86rem", fontWeight: 700, color: "#2D2D2D", margin: 0 }}>รออนุมัติใบเสนอราคา</p>
            <p style={{ fontSize: "0.72rem", color: "#6b7280", margin: "2px 0 0" }}>ส่วนลดเกินเกณฑ์ {DISCOUNT_THRESHOLD}% — ต้องผ่าน HQ</p>
          </div>
          {pendingCount > 0 && (
            <span style={{ fontSize: "0.68rem", fontWeight: 700, background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: 99, padding: "3px 10px" }}>
              {pendingCount} รายการ
            </span>
          )}
        </div>

        {/* Items */}
        <div>
          {pendingApprovals.map(item => {
            const outcome     = actions[item.id];
            const highDiscount = item.discountPct >= 15;
            const overBy      = item.discountPct - DISCOUNT_THRESHOLD;
            const detail      = approvalDetails[item.id];
            const margin      = detail
              ? Math.round(((item.totalValue - detail.costEstimate) / item.totalValue) * 100)
              : null;
            const marginLow   = margin !== null && margin < MARGIN_THRESHOLD;

            return (
              <div key={item.id}
                style={{ padding: "14px 20px", borderBottom: "1px solid #f0f4f8", opacity: outcome ? 0.62 : 1, background: outcome ? "#f8f9fb" : "transparent" }}
                onMouseEnter={e => { if (!outcome) (e.currentTarget as HTMLElement).style.background = "#f8f9fb"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = outcome ? "#f8f9fb" : "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2D2D2D" }}>{item.quoteNo}</span>
                      <span style={{ fontSize: "0.65rem", color: "#6b7280" }}>· สาขา{item.dealer}</span>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "#2D2D2D", margin: "0 0 5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.customer}</p>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.68rem", color: "#6b7280" }}>
                        มูลค่า: <span style={{ fontWeight: 700, color: "#2D2D2D" }}>{item.total}</span>
                      </span>
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: highDiscount ? "#fee2e2" : "#fef3cd", color: highDiscount ? "#dc2626" : "#d97706" }}>
                        ส่วนลด {item.discountPct}% · เกินเกณฑ์ {overBy}%
                      </span>
                      {margin !== null && (
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: marginLow ? "#fee2e2" : "#e5faf0", color: marginLow ? "#dc2626" : "#059669" }}>
                          {marginLow ? <TrendingDown size={9} style={{ display: "inline", marginRight: 3 }} /> : null}
                          กำไร ~{margin}%{marginLow ? " ⚠" : ""}
                        </span>
                      )}
                      <span style={{ fontSize: "0.65rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: 3 }}>
                        <Clock size={10} /> {item.requestedAt}
                      </span>
                    </div>

                    {outcome?.action === "rejected" && outcome.reason && (
                      <p style={{ fontSize: "0.66rem", color: "#dc2626", margin: "6px 0 0", fontStyle: "italic" }}>
                        เหตุผล: {outcome.reason}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    {outcome?.action === "approved" ? (
                      <span style={{ fontSize: "0.72rem", color: "#059669", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                        <CheckCircle size={13} /> อนุมัติแล้ว
                      </span>
                    ) : outcome?.action === "rejected" ? (
                      <span style={{ fontSize: "0.72rem", color: "#dc2626", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                        <XCircle size={13} /> ปฏิเสธแล้ว
                      </span>
                    ) : (
                      <>
                        {/* ดูรายละเอียด */}
                        <button
                          onClick={() => setDetailItem(item)}
                          style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#003366", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f3f7fc"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
                        >
                          <FileText size={11} /> ดูรายละเอียด
                        </button>
                        {/* ปฏิเสธ */}
                        <button onClick={() => openReject(item.id)}
                          style={{ width: 30, height: 30, borderRadius: 9, border: "1px solid #fca5a5", background: "#fff", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fee2e2"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}>
                          <XCircle size={15} />
                        </button>
                        {/* อนุมัติ */}
                        <button onClick={() => approve(item.id)}
                          style={{ width: 30, height: 30, borderRadius: 9, border: "1px solid #d1fae5", background: "#fff", color: "#059669", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#e5faf0"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}>
                          <CheckCircle size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {pendingCount === 0 && (
            <div style={{ padding: "36px 20px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#e5faf0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PartyPopper size={26} color="#059669" />
                </div>
              </div>
              <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#2D2D2D", margin: "0 0 4px" }}>ดำเนินการครบแล้ว!</p>
              <p style={{ fontSize: "0.74rem", color: "#6b7280", margin: 0 }}>ทุกใบเสนอราคาได้รับการพิจารณาแล้ว</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Quotation Detail Drawer ─────────────────────────────────────── */}
      {detailItem && (() => {
        const detail = approvalDetails[detailItem.id];
        if (!detail) return null;
        const outcome = actions[detailItem.id];
        const discountAmount = detail.listPrice - detailItem.totalValue;
        const grossProfit    = detailItem.totalValue - detail.costEstimate;
        const margin         = Math.round((grossProfit / detailItem.totalValue) * 100);
        const normalMargin   = Math.round(((detail.listPrice - detail.costEstimate) / detail.listPrice) * 100);
        const marginLow      = margin < MARGIN_THRESHOLD;

        return (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setDetailItem(null)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 1040 }}
            />
            {/* Drawer */}
            <div style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: 480,
              background: "#fff", zIndex: 1050, display: "flex", flexDirection: "column",
              boxShadow: "-8px 0 40px rgba(0,0,0,.16)",
            }}>
              {/* Drawer header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#2D2D2D" }}>{detailItem.quoteNo}</h2>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "#fef3cd", color: "#d97706" }}>รออนุมัติ</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.73rem", color: "#6b7280" }}>
                    {detailItem.customer} · สาขา{detailItem.dealer} · {detail.buildingType} {detail.areaSqm} ตร.ม.
                  </p>
                </div>
                <button onClick={() => setDetailItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", marginTop: 2 }}><X size={18} /></button>
              </div>

              {/* Scrollable content */}
              <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>

                {/* ── Margin Analysis ── */}
                <div style={{ background: marginLow ? "#fff8f8" : "#f8fffe", border: `1px solid ${marginLow ? "#fca5a5" : "#d1fae5"}`, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                  <p style={{ margin: "0 0 10px", fontSize: "0.72rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>วิเคราะห์กำไร</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[
                      { label: "ราคากลาง",    value: fmtMoney(detail.listPrice),         color: "#2D2D2D" },
                      { label: "ส่วนลด",       value: `−${fmtMoney(discountAmount)} (${detailItem.discountPct}%)`, color: "#dc2626" },
                      { label: "ราคาเสนอ",    value: fmtMoney(detailItem.totalValue),    color: "#003366" },
                      { label: "ต้นทุนประมาณ", value: fmtMoney(detail.costEstimate),       color: "#2D2D2D" },
                      { label: "กำไรขั้นต้น",  value: fmtMoney(grossProfit),              color: marginLow ? "#dc2626" : "#059669" },
                      { label: "Gross Margin", value: `${margin}%`,                       color: marginLow ? "#dc2626" : "#059669" },
                    ].map(r => (
                      <div key={r.label} style={{ textAlign: "center" }}>
                        <p style={{ margin: "0 0 2px", fontSize: "0.6rem", color: "#6b7280", fontWeight: 600 }}>{r.label}</p>
                        <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 800, color: r.color }}>{r.value}</p>
                      </div>
                    ))}
                  </div>
                  {marginLow && (
                    <div style={{ marginTop: 10, padding: "6px 10px", background: "#fee2e2", borderRadius: 7, fontSize: "0.7rem", color: "#dc2626", fontWeight: 600 }}>
                      ⚠ กำไร {margin}% ต่ำกว่าเกณฑ์ขั้นต่ำ {MARGIN_THRESHOLD}% · ปกติสาขานี้ทำได้ {normalMargin}%
                    </div>
                  )}
                </div>

                {/* ── Line Items ── */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: "0 0 8px", fontSize: "0.72rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>รายการในใบเสนอ</p>
                  <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
                    {detail.items.map((it, i) => (
                      <div key={it.name} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "9px 14px", borderBottom: i < detail.items.length - 1 ? "1px solid #f0f4f8" : "none",
                        background: i % 2 === 0 ? "#fafafa" : "#fff",
                      }}>
                        <span style={{ fontSize: "0.78rem", color: "#2D2D2D" }}>{it.name}</span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2D2D2D" }}>{fmtMoney(it.amount)}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", background: "#f3f7fc", borderTop: "2px solid #e5e7eb" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#003366" }}>รวมหลังส่วนลด {detailItem.discountPct}%</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#003366" }}>{fmtMoney(detailItem.totalValue)}</span>
                    </div>
                  </div>
                </div>

                {/* ── Request Reason ── */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ margin: "0 0 6px", fontSize: "0.72rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>เหตุผลที่สาขาขอส่วนลด</p>
                  <div style={{ background: "#f8f9fb", border: "1px solid #e5e7eb", borderRadius: 9, padding: "10px 14px", fontSize: "0.78rem", color: "#2D2D2D", lineHeight: 1.6 }}>
                    "{detail.requestReason}"
                  </div>
                </div>

                {/* ── Exception History ── */}
                <div>
                  <p style={{ margin: "0 0 8px", fontSize: "0.72rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    ประวัติขอ Exception · สาขา{detailItem.dealer} (90 วันล่าสุด)
                    <span style={{ marginLeft: 6, fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                      background: detail.exceptionHistory.length >= 3 ? "#fee2e2" : "#fef3cd",
                      color: detail.exceptionHistory.length >= 3 ? "#dc2626" : "#d97706",
                    }}>
                      {detail.exceptionHistory.length} ครั้ง
                    </span>
                  </p>
                  {detail.exceptionHistory.length === 0 ? (
                    <p style={{ fontSize: "0.76rem", color: "#6b7280" }}>ไม่มีประวัติ</p>
                  ) : (
                    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
                      {detail.exceptionHistory.map((h, i) => (
                        <div key={h.quoteNo} style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "9px 14px", borderBottom: i < detail.exceptionHistory.length - 1 ? "1px solid #f0f4f8" : "none",
                          background: i % 2 === 0 ? "#fafafa" : "#fff",
                        }}>
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: h.outcome === "approved" ? "#e5faf0" : "#fee2e2", color: h.outcome === "approved" ? "#059669" : "#dc2626" }}>
                            {h.outcome === "approved" ? "✓ อนุมัติ" : "✗ ปฏิเสธ"}
                          </span>
                          <span style={{ fontSize: "0.74rem", fontWeight: 600, color: "#2D2D2D" }}>{h.quoteNo}</span>
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#d97706" }}>−{h.discountPct}%</span>
                          <span style={{ fontSize: "0.68rem", color: "#9ca3af", marginLeft: "auto" }}>{h.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer footer actions */}
              {!outcome && (
                <div style={{ padding: "14px 20px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 10, background: "#fafafa" }}>
                  <button
                    onClick={() => openReject(detailItem.id)}
                    style={{ flex: 1, padding: "11px", borderRadius: 11, border: "1px solid #fca5a5", background: "#fff", color: "#dc2626", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fee2e2"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}>
                    ✗ ปฏิเสธ
                  </button>
                  <button
                    onClick={() => approve(detailItem.id)}
                    style={{ flex: 1, padding: "11px", borderRadius: 11, border: "none", background: "#003366", color: "#fff", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,51,102,.3)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#002244"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#003366"; }}>
                    ✓ อนุมัติ
                  </button>
                </div>
              )}
              {outcome && (
                <div style={{ padding: "14px 20px", borderTop: "1px solid #e5e7eb", textAlign: "center", background: "#fafafa" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: outcome.action === "approved" ? "#059669" : "#dc2626" }}>
                    {outcome.action === "approved" ? "✓ อนุมัติแล้ว" : "✗ ปฏิเสธแล้ว"}
                    {outcome.reason && ` — ${outcome.reason}`}
                  </span>
                </div>
              )}
            </div>
          </>
        );
      })()}

      {/* ── Reject Reason Modal ─────────────────────────────────────────── */}
      {rejectTarget && (() => {
        const item = pendingApprovals.find(a => a.id === rejectTarget);
        return (
          <div onClick={() => setRejectTarget(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1060, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div onClick={e => e.stopPropagation()} style={{ ...CARD, width: 440, maxWidth: "100%" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "0.96rem", fontWeight: 800, color: "#2D2D2D" }}>ปฏิเสธใบเสนอราคา</h2>
                  {item && <p style={{ margin: "3px 0 0", fontSize: "0.72rem", color: "#6b7280" }}>{item.quoteNo} · สาขา{item.dealer} · ส่วนลด {item.discountPct}%</p>}
                </div>
                <button onClick={() => setRejectTarget(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex" }}><X size={18} /></button>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 8 }}>เหตุผลที่ปฏิเสธ (ส่งกลับให้สาขา) *</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {REJECT_REASONS.map(r => (
                    <button key={r} onClick={() => setRejectReason(r)}
                      style={{ fontSize: "0.7rem", padding: "5px 10px", borderRadius: 99, cursor: "pointer", border: `1px solid ${rejectReason === r ? "#003366" : "#e5e7eb"}`, background: rejectReason === r ? "#f3f7fc" : "#fff", color: rejectReason === r ? "#003366" : "#6b7280", fontWeight: 600 }}>
                      {r}
                    </button>
                  ))}
                </div>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={2} placeholder="หรือพิมพ์เหตุผลเอง..."
                  style={{ width: "100%", fontSize: "0.8rem", border: "1px solid #e5e7eb", borderRadius: 9, padding: "8px 12px", outline: "none", color: "#2D2D2D", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
                  <button onClick={() => setRejectTarget(null)} style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>ยกเลิก</button>
                  <button onClick={confirmReject} disabled={!rejectReason.trim()}
                    style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: rejectReason.trim() ? "#dc2626" : "#e5e7eb", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: rejectReason.trim() ? "pointer" : "not-allowed" }}>
                    ยืนยันปฏิเสธ
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
