"use client";

import { useMemo, useState } from "react";
import { leadPool, dealerLeaderboard, regionOfProvince, type LeadPoolRow, type DealerRow } from "@/lib/mock";
import { Globe, MessageCircle, UserPlus, X, MapPin, Sparkles, Check, ChevronDown, ChevronUp, ChevronsUpDown, XCircle, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
  boxShadow: "0 2px 14px rgba(0,0,0,.07)", overflow: "hidden",
};

// ── SLA helpers ──────────────────────────────────────────────────────────────

type SlaLevel = "ok" | "warn" | "critical";

function slaLevel(h: number): SlaLevel {
  if (h >= 48) return "critical";
  if (h >= 24) return "warn";
  return "ok";
}

const SLA_STYLE: Record<SlaLevel, { icon: React.ReactNode; text: string; bg: string; rowBg: string; label: string }> = {
  ok:       { icon: <CheckCircle2 size={11} />,  text: "#059669", bg: "#e5faf0", rowBg: "",        label: "ปกติ" },
  warn:     { icon: <AlertTriangle size={11} />, text: "#d97706", bg: "#fef3cd", rowBg: "#fffdf7", label: "เฝ้าระวัง" },
  critical: { icon: <AlertCircle size={11} />,   text: "#dc2626", bg: "#fee2e2", rowBg: "#fff8f8", label: "เกิน SLA" },
};

function formatWait(h: number): string {
  if (h < 1) return "< 1 ชม.";
  if (h < 24) return `${h} ชม.`;
  const days = Math.floor(h / 24);
  const rem = h % 24;
  return rem > 0 ? `${days} วัน ${rem} ชม.` : `${days} วัน`;
}

// ── Channel style ─────────────────────────────────────────────────────────────

const channelStyle = (ch: string) =>
  ch === "LINE OA"
    ? { bg: "#e5faf0", text: "#059669" }
    : { bg: "#dce5f0", text: "#003366" };

// ── Sort helpers ──────────────────────────────────────────────────────────────

type SortKey = "wait" | "value";
type SortDir = "asc" | "desc";

function SortIcon({ col, sortBy, dir }: { col: SortKey; sortBy: SortKey; dir: SortDir }) {
  if (sortBy !== col) return <ChevronsUpDown size={11} style={{ opacity: 0.35 }} />;
  return dir === "desc" ? <ChevronDown size={11} style={{ color: "#003366" }} /> : <ChevronUp size={11} style={{ color: "#003366" }} />;
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Assignment = { code: string; name: string };

// ─────────────────────────────────────────────────────────────────────────────

export function LeadPoolTable() {
  const [assignments, setAssignments]   = useState<Record<string, Assignment>>({});
  const [rejected, setRejected]         = useState<Set<string>>(new Set());
  const [routingLead, setRoutingLead]   = useState<LeadPoolRow | null>(null);
  const [rejectTarget, setRejectTarget] = useState<LeadPoolRow | null>(null);
  const [sortBy, setSortBy]             = useState<SortKey>("wait");
  const [sortDir, setSortDir]           = useState<SortDir>("desc");

  function toggleSort(col: SortKey) {
    if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  }

  const sorted = useMemo(() => {
    return [...leadPool].sort((a, b) => {
      const factor = sortDir === "desc" ? -1 : 1;
      if (sortBy === "wait")  return factor * (a.waitHours - b.waitHours);
      return factor * (a.valueNum - b.valueNum);
    });
  }, [sortBy, sortDir]);

  const pending = sorted.filter(l => !assignments[l.id] && !rejected.has(l.id)).length;
  const criticalCount = sorted.filter(l => !assignments[l.id] && !rejected.has(l.id) && slaLevel(l.waitHours) === "critical").length;

  function confirmAssign(lead: LeadPoolRow, dealer: DealerRow) {
    setAssignments(prev => ({ ...prev, [lead.id]: { code: dealer.code, name: dealer.name } }));
    setRoutingLead(null);
  }

  function confirmReject(lead: LeadPoolRow) {
    setRejected(prev => new Set([...prev, lead.id]));
    setRejectTarget(null);
  }

  const thStyle: React.CSSProperties = {
    fontSize: "0.67rem", fontWeight: 700, color: "#6b7280",
    textTransform: "uppercase", letterSpacing: "0.05em",
    padding: "10px 14px", whiteSpace: "nowrap", userSelect: "none",
  };

  return (
    <div style={CARD}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 14px", borderBottom: "1px solid #e5e7eb", gap: 8, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: "0.86rem", fontWeight: 700, color: "#2D2D2D", margin: 0 }}>ลีดส่วนกลาง</p>
          <p style={{ fontSize: "0.72rem", color: "#6b7280", margin: "2px 0 0" }}>ลีดจากช่องทาง HQ ยังไม่มีสาขารับผิดชอบ</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {criticalCount > 0 && (
            <span style={{ fontSize: "0.68rem", fontWeight: 700, background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: 99, padding: "3px 10px", display: "flex", alignItems: "center", gap: 4 }}>
              <AlertCircle size={12} /> {criticalCount} เกิน SLA
            </span>
          )}
          {pending > 0 && (
            <span style={{ fontSize: "0.68rem", fontWeight: 700, background: "#fef3cd", color: "#d97706", border: "1px solid #fde68a", borderRadius: 99, padding: "3px 10px" }}>
              {pending} รอมอบหมาย
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ ...thStyle, textAlign: "center", width: 36 }}>SLA</th>
              <th style={{ ...thStyle }}>ลูกค้า</th>
              <th style={{ ...thStyle }}>จังหวัด</th>
              <th style={{ ...thStyle }}>ช่องทาง</th>

              {/* sort: รอมา */}
              <th
                style={{ ...thStyle, cursor: "pointer" }}
                onClick={() => toggleSort("wait")}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  รอมา <SortIcon col="wait" sortBy={sortBy} dir={sortDir} />
                </span>
              </th>

              <th style={{ ...thStyle }}>ประเภท</th>

              {/* sort: มูลค่า */}
              <th
                style={{ ...thStyle, cursor: "pointer" }}
                onClick={() => toggleSort("value")}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  มูลค่า <SortIcon col="value" sortBy={sortBy} dir={sortDir} />
                </span>
              </th>

              <th style={{ ...thStyle, textAlign: "right" }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(lead => {
              const assignment = assignments[lead.id];
              const isRejected = rejected.has(lead.id);
              const done = !!assignment || isRejected;
              const lvl = slaLevel(lead.waitHours);
              const sla = SLA_STYLE[lvl];
              const ch = channelStyle(lead.channel);
              const region = regionOfProvince(lead.province);

              return (
                <tr
                  key={lead.id}
                  style={{
                    borderBottom: "1px solid #f0f4f8",
                    background: done ? "" : sla.rowBg,
                    opacity: done ? 0.55 : 1,
                    transition: "background .12s",
                  }}
                  onMouseEnter={e => { if (!done) (e.currentTarget as HTMLElement).style.background = "#f1f5f9"; }}
                  onMouseLeave={e => { if (!done) (e.currentTarget as HTMLElement).style.background = sla.rowBg; }}
                >
                  {/* SLA dot */}
                  <td style={{ padding: "12px 10px", textAlign: "center" }}>
                    <span
                      title={`${sla.label} · รอ ${formatWait(lead.waitHours)}`}
                      style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 24, height: 24, borderRadius: "50%",
                        background: done ? "#f0f0f5" : sla.bg,
                        fontSize: "0.68rem", fontWeight: 700, color: done ? "#9ca3af" : sla.text,
                      }}
                    >
                      {done ? "—" : sla.icon}
                    </span>
                  </td>

                  {/* ลูกค้า */}
                  <td style={{ padding: "12px 14px" }}>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2D2D2D", margin: 0 }}>{lead.name}</p>
                    <p style={{ fontSize: "0.65rem", color: "#6b7280", margin: "2px 0 0" }}>{lead.id}</p>
                  </td>

                  {/* จังหวัด */}
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: "0.78rem", color: "#2D2D2D", fontWeight: 600 }}>{lead.province}</span>
                    {region && <span style={{ display: "block", fontSize: "0.64rem", color: "#6b7280", marginTop: 1 }}>ภาค{region}</span>}
                  </td>

                  {/* ช่องทาง */}
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, fontSize: "0.68rem", fontWeight: 600, background: ch.bg, color: ch.text }}>
                      {lead.channel === "LINE OA" ? <MessageCircle size={10} /> : <Globe size={10} />} {lead.channel}
                    </span>
                  </td>

                  {/* รอมา */}
                  <td style={{ padding: "12px 14px" }}>
                    {done ? (
                      <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>—</span>
                    ) : (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontSize: "0.72rem", fontWeight: 700, color: sla.text,
                        background: sla.bg, borderRadius: 99, padding: "2px 8px",
                      }}>
                        {formatWait(lead.waitHours)}
                      </span>
                    )}
                  </td>

                  {/* ประเภท */}
                  <td style={{ padding: "12px 14px", fontSize: "0.78rem", color: "#475569", fontWeight: 600 }}>{lead.product}</td>

                  {/* มูลค่า */}
                  <td style={{ padding: "12px 14px", fontSize: "0.84rem", fontWeight: 700, color: "#2D2D2D" }}>{lead.value}</td>

                  {/* จัดการ */}
                  <td style={{ padding: "12px 14px", textAlign: "right" }}>
                    {isRejected ? (
                      <span style={{ fontSize: "0.72rem", color: "#dc2626", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <XCircle size={12} /> ปฏิเสธแล้ว
                      </span>
                    ) : assignment ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.72rem", color: "#059669", fontWeight: 700 }}>
                        <Check size={12} /> {assignment.code} · {assignment.name.replace("Benjamin สาขา", "")}
                      </span>
                    ) : (
                      <div style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                        <button
                          onClick={() => setRejectTarget(lead)}
                          title="ปฏิเสธลีดนี้"
                          style={{
                            width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                            background: "#fff", border: "1px solid #fca5a5", borderRadius: 8,
                            color: "#dc2626", cursor: "pointer",
                          }}
                        >
                          <XCircle size={13} />
                        </button>
                        <button
                          onClick={() => setRoutingLead(lead)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "6px 12px", background: "#003366", color: "#fff",
                            border: "none", borderRadius: 9, fontSize: "0.72rem", fontWeight: 700,
                            cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,.2)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <UserPlus size={11} /> มอบหมาย
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer hint */}
      <div style={{ padding: "8px 16px", borderTop: "1px solid #f0f4f8", display: "flex", gap: 16, flexWrap: "wrap" }}>
        {(["ok", "warn", "critical"] as SlaLevel[]).map(lvl => {
          const s = SLA_STYLE[lvl];
          const labels = { ok: "< 24 ชม.", warn: "24–48 ชม.", critical: "> 48 ชม." };
          return (
            <span key={lvl} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.63rem", color: "#9ca3af" }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: s.bg, border: `1px solid ${s.text}22`, display: "inline-block" }} />
              {s.icon} {s.label} ({labels[lvl]})
            </span>
          );
        })}
      </div>

      {/* Routing modal */}
      {routingLead && (
        <RoutingModal
          lead={routingLead}
          onClose={() => setRoutingLead(null)}
          onConfirm={(dealer) => confirmAssign(routingLead, dealer)}
        />
      )}

      {/* Reject confirm modal */}
      {rejectTarget && (
        <RejectModal
          lead={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={() => confirmReject(rejectTarget)}
        />
      )}
    </div>
  );
}

// ── Reject Modal ─────────────────────────────────────────────────────────────

function RejectModal({ lead, onClose, onConfirm }: { lead: LeadPoolRow; onClose: () => void; onConfirm: () => void }) {
  const [reason, setReason] = useState("");
  const REASONS = ["ข้อมูลลีดไม่ครบถ้วน / ไม่สามารถติดต่อได้", "ลีดซ้ำกับที่มีอยู่แล้ว", "อยู่นอกพื้นที่บริการ", "ไม่ตรงกับสายบริการของเรา"];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", width: 440, maxWidth: "100%", boxShadow: "0 20px 60px rgba(0,0,0,.18)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "0.96rem", fontWeight: 800, color: "#2D2D2D" }}>ปฏิเสธลีดนี้</h2>
            <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#6b7280" }}>{lead.id} · {lead.name}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex" }}><X size={17} /></button>
        </div>

        <div style={{ padding: "16px 20px" }}>
          <p style={{ fontSize: "0.78rem", color: "#475569", margin: "0 0 12px" }}>เลือกเหตุผล (ไม่บังคับ)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
            {REASONS.map(r => (
              <button
                key={r}
                onClick={() => setReason(r)}
                style={{
                  textAlign: "left", padding: "8px 12px", borderRadius: 9, fontSize: "0.78rem",
                  border: `1px solid ${reason === r ? "#dc2626" : "#e5e7eb"}`,
                  background: reason === r ? "#fee2e2" : "#fafafa",
                  color: reason === r ? "#dc2626" : "#475569",
                  cursor: "pointer", fontWeight: reason === r ? 700 : 400,
                }}
              >
                {r}
              </button>
            ))}
          </div>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="หรือระบุเหตุผลอื่น..."
            rows={2}
            style={{ width: "100%", fontSize: "0.8rem", border: "1px solid #e5e7eb", borderRadius: 9, padding: "8px 12px", outline: "none", color: "#2D2D2D", resize: "vertical", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ padding: "12px 20px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 9, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>ยกเลิก</button>
          <button onClick={onConfirm} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px", borderRadius: 9, border: "none", background: "#dc2626", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
            <XCircle size={14} /> ยืนยันปฏิเสธ
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Routing Modal ─────────────────────────────────────────────────────────────

function RoutingModal({ lead, onClose, onConfirm }: { lead: LeadPoolRow; onClose: () => void; onConfirm: (d: DealerRow) => void }) {
  const leadRegion = regionOfProvince(lead.province);

  const dealers = useMemo(() => {
    return [...dealerLeaderboard]
      .filter(d => d.status === "active")
      .sort((a, b) => {
        const am = a.region === leadRegion ? 0 : 1;
        const bm = b.region === leadRegion ? 0 : 1;
        if (am !== bm) return am - bm;
        return a.activeProjects - b.activeProjects;
      });
  }, [leadRegion]);

  const recommendedId = dealers.find(d => d.region === leadRegion)?.id ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(recommendedId);
  const [note, setNote] = useState("");
  const selected = dealers.find(d => d.id === selectedId) ?? null;
  const lvl = slaLevel(lead.waitHours);
  const sla = SLA_STYLE[lvl];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ ...CARD, width: 520, maxWidth: "100%", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#2D2D2D" }}>มอบหมายลีดให้สาขา</h2>
            <p style={{ margin: "3px 0 0", fontSize: "0.72rem", color: "#6b7280" }}>{lead.id} · เลือกสาขาที่จะรับผิดชอบลีดนี้</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", display: "flex" }}><X size={18} /></button>
        </div>

        {/* Lead summary */}
        <div style={{ padding: "12px 20px", background: "#f8f9fb", borderBottom: "1px solid #f0f4f8" }}>
          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#2D2D2D", marginBottom: 6 }}>{lead.name}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 14px", fontSize: "0.72rem", color: "#6b7280" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={11} /> {lead.province}{leadRegion && ` · ภาค${leadRegion}`}</span>
            <span>ประเภท: <b style={{ color: "#2D2D2D" }}>{lead.product}</b></span>
            <span>มูลค่า: <b style={{ color: "#2D2D2D" }}>{lead.value}</b></span>
            <span>ช่องทาง: {lead.channel}</span>
          </div>
          {/* SLA badge */}
          <div style={{ marginTop: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.68rem", fontWeight: 700, color: sla.text, background: sla.bg, borderRadius: 99, padding: "2px 10px" }}>
              {sla.icon} {sla.label} · รอมา {formatWait(lead.waitHours)}
            </span>
          </div>
        </div>

        {/* Dealer list */}
        <div style={{ padding: "14px 20px", overflowY: "auto", flex: 1 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
            เลือกสาขา ({dealers.length} สาขาที่เปิดใช้งาน)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {dealers.map(d => {
              const isRec = d.id === recommendedId;
              const isSel = d.id === selectedId;
              const matched = d.region === leadRegion;
              return (
                <button key={d.id} onClick={() => setSelectedId(d.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left",
                    padding: "11px 14px", borderRadius: 11, cursor: "pointer",
                    border: `2px solid ${isSel ? "#003366" : "#e5e8ee"}`,
                    background: isSel ? "#f3f7fc" : "#fff", transition: "border-color .12s, background .12s",
                  }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${isSel ? "#003366" : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {isSel && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#003366" }} />}
                  </span>
                  <span style={{ fontWeight: 800, color: "#003366", fontSize: "0.8rem", letterSpacing: "0.04em", flexShrink: 0, width: 38 }}>{d.code}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2D2D2D" }}>{d.name.replace("Benjamin สาขา", "")}</span>
                      {isRec && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: "0.6rem", fontWeight: 800, background: "#e5faf0", color: "#059669", borderRadius: 99, padding: "2px 7px" }}>
                          <Sparkles size={9} /> แนะนำ · พื้นที่ตรง
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.66rem", color: "#6b7280", marginTop: 2 }}>
                      <span style={{ color: matched ? "#059669" : "#6b7280", fontWeight: matched ? 700 : 400 }}>ภาค{d.region}</span>
                      {" · "}{d.activeProjects} โครงการกำลังทำ · ปิดการขาย {d.winRate}%
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {!leadRegion && (
            <p style={{ fontSize: "0.68rem", color: "#f59e0b", marginTop: 10 }}>
              * ไม่พบภาคของจังหวัดนี้ในระบบ — เลือกสาขาที่เหมาะสมด้วยตนเอง
            </p>
          )}

          <div style={{ marginTop: 14 }}>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5 }}>หมายเหตุถึงสาขา (ไม่บังคับ)</label>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="เช่น ลูกค้าต้องการให้ติดต่อกลับด่วน"
              style={{ width: "100%", fontSize: "0.8rem", border: "1px solid #e5e7eb", borderRadius: 9, padding: "8px 12px", outline: "none", color: "#2D2D2D", boxSizing: "border-box" }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "13px 20px", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "#fafafa" }}>
          <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>
            {selected ? <>มอบหมายให้ <b style={{ color: "#003366" }}>{selected.name.replace("Benjamin ", "")}</b></> : "ยังไม่ได้เลือกสาขา"}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>ยกเลิก</button>
            <button onClick={() => selected && onConfirm(selected)} disabled={!selected}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 10, border: "none", background: selected ? "#003366" : "#e5e7eb", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: selected ? "pointer" : "not-allowed", boxShadow: selected ? "0 4px 10px rgba(0,0,0,.2)" : "none" }}>
              <UserPlus size={13} /> มอบหมาย
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
