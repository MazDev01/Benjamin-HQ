"use client";

import { useState, useMemo } from "react";
import { hqProjects, type HQProject, type HQProjectStatus } from "@/lib/mock";
import { Download, HardHat, AlertTriangle, CheckCircle2, Clock, PauseCircle, X, MessageSquare, Users } from "lucide-react";
import { usePeriod } from "@/context/PeriodContext";
import { PeriodSelector } from "@/components/hq/PeriodSelector";

// -- Helpers ------------------------------------------------------

function fmtM(n: number) {
  return n >= 1_000_000 ? `฿${(n / 1_000_000).toFixed(1)}M` : `฿${(n / 1000).toFixed(0)}K`;
}

const STATUS_META: Record<HQProjectStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  in_progress:  { label: "กำลังดำเนินการ", bg: "#dce5f0", text: "#003366", icon: <Clock size={11} /> },
  completed:    { label: "เสร็จสิ้น",       bg: "#e5faf0", text: "#059669", icon: <CheckCircle2 size={11} /> },
  overdue:      { label: "เกินกำหนด",       bg: "#fee2e2", text: "#dc2626", icon: <AlertTriangle size={11} /> },
  on_hold:      { label: "พักโครงการ",      bg: "#fef3cd", text: "#d97706", icon: <PauseCircle size={11} /> },
  not_started:  { label: "ยังไม่เริ่ม",     bg: "#f3f4f6", text: "#6b7280", icon: <HardHat size={11} /> },
};

const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
  boxShadow: "0 2px 14px rgba(0,0,0,.07)",
};

// -- Status badge ------------------------------------------------

function StatusBadge({ status }: { status: HQProjectStatus }) {
  const m = STATUS_META[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.68rem", fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: m.bg, color: m.text, whiteSpace: "nowrap" }}>
      {m.icon} {m.label}
    </span>
  );
}

// -- Progress bar ------------------------------------------------

function ProgressBar({ pct, status }: { pct: number; status: HQProjectStatus }) {
  const color = status === "overdue" ? "#dc2626" : status === "completed" ? "#059669" : "#003366";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ flex: 1, height: 6, background: "#f0f0f5", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: "0.66rem", fontWeight: 700, color, minWidth: 28, textAlign: "right" }}>{pct}%</span>
    </div>
  );
}

// -- Main ---------------------------------------------------------

const DEALERS = ["ทั้งหมด", ...Array.from(new Set(hqProjects.map(p => p.dealerName)))];
const STATUSES: { key: HQProjectStatus | "all"; label: string }[] = [
  { key: "all",          label: "ทุกสถานะ" },
  { key: "in_progress",  label: "กำลังทำ" },
  { key: "overdue",      label: "เกินกำหนด" },
  { key: "on_hold",      label: "พักโครงการ" },
  { key: "completed",    label: "เสร็จสิ้น" },
  { key: "not_started",  label: "ยังไม่เริ่ม" },
];

export default function HQProjectsPage() {
  const { period } = usePeriod();
  const [dealerFilter, setDealerFilter] = useState("ทั้งหมด");
  const [statusFilter, setStatusFilter] = useState<HQProjectStatus | "all">("all");
  const [selectedProject, setSelectedProject] = useState<HQProject | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  function doExport(format: string) {
    setShowExport(false);
    setToast(`กำลังส่งออก ${format}... ไฟล์จะดาวน์โหลดอัตโนมัติ`);
    setTimeout(() => setToast(null), 2800);
  }

  const filtered = useMemo(() => hqProjects.filter(p => {
    const matchDealer = dealerFilter === "ทั้งหมด" || p.dealerName === dealerFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchDealer && matchStatus;
  }), [dealerFilter, statusFilter]);

  // KPIs
  const total       = hqProjects.length;
  const active      = hqProjects.filter(p => p.status === "in_progress").length;
  const overdue     = hqProjects.filter(p => p.status === "overdue").length;
  const completed   = hqProjects.filter(p => p.status === "completed").length;
  const totalValue  = hqProjects.reduce((s, p) => s + p.valueNum, 0);
  const onTimePct   = Math.round((hqProjects.filter(p => p.status !== "overdue" && p.daysLeft >= 0).length / total) * 100);

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#2D2D2D", color: "#fff", padding: "10px 18px", borderRadius: 12, fontSize: "0.78rem", fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,.25)", display: "flex", alignItems: "center", gap: 8 }}>
          <Download size={14} /> {toast}
        </div>
      )}

      {/* Project Detail Drawer */}
      {selectedProject && (
        <>
          <div onClick={() => setSelectedProject(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 1040 }} />
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, width: 460,
            background: "#fff", zIndex: 1050, display: "flex", flexDirection: "column",
            boxShadow: "-8px 0 40px rgba(0,0,0,.16)",
          }}>
            {/* Drawer header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af" }}>{selectedProject.id}</span>
                  <StatusBadge status={selectedProject.status} />
                </div>
                <h2 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 800, color: "#2D2D2D", lineHeight: 1.3 }}>{selectedProject.name}</h2>
                <p style={{ margin: "4px 0 0", fontSize: "0.73rem", color: "#6b7280" }}>
                  {selectedProject.dealerName} · {selectedProject.customer}
                </p>
              </div>
              <button onClick={() => setSelectedProject(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", marginTop: 2 }}>
                <X size={18} />
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>

              {/* Value + PM */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
                {[
                  { label: "มูลค่าโครงการ", value: fmtM(selectedProject.valueNum), color: "#003366" },
                  { label: "ผู้จัดการโครงการ", value: selectedProject.pm, color: "#2D2D2D" },
                  { label: "ผลิตภัณฑ์", value: selectedProject.product, color: "#2D2D2D" },
                  { label: "ภูมิภาค", value: selectedProject.region, color: "#2D2D2D" },
                ].map(r => (
                  <div key={r.label} style={{ background: "#f8f9fb", borderRadius: 10, padding: "10px 14px" }}>
                    <p style={{ margin: "0 0 3px", fontSize: "0.62rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>{r.label}</p>
                    <p style={{ margin: 0, fontSize: "0.84rem", fontWeight: 700, color: r.color }}>{r.value}</p>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ margin: "0 0 10px", fontSize: "0.72rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>ไทม์ไลน์</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: "0.7rem", color: "#6b7280", minWidth: 90 }}>{selectedProject.startDate}</span>
                  <div style={{ flex: 1, height: 8, background: "#f0f0f5", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${selectedProject.progressPct}%`,
                      background: selectedProject.status === "overdue" ? "#dc2626" : selectedProject.status === "completed" ? "#059669" : "#003366",
                      borderRadius: 99,
                    }} />
                  </div>
                  <span style={{ fontSize: "0.7rem", color: selectedProject.status === "overdue" ? "#dc2626" : "#6b7280", fontWeight: selectedProject.status === "overdue" ? 700 : 400, minWidth: 90, textAlign: "right" }}>
                    {selectedProject.deadline}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.66rem", color: "#9ca3af" }}>วันเริ่ม</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: selectedProject.status === "overdue" ? "#dc2626" : "#003366" }}>
                    {selectedProject.progressPct}% เสร็จแล้ว
                    {selectedProject.status === "overdue" && ` · เกิน ${Math.abs(selectedProject.daysLeft)} วัน`}
                    {selectedProject.status !== "overdue" && selectedProject.status !== "completed" && selectedProject.daysLeft < 999 && ` · เหลือ ${selectedProject.daysLeft} วัน`}
                  </span>
                  <span style={{ fontSize: "0.66rem", color: "#9ca3af" }}>กำหนดส่ง</span>
                </div>
              </div>

              {/* Issues */}
              {(selectedProject as HQProject & { issues?: string[] }).issues?.length ? (
                <div style={{ marginBottom: 18 }}>
                  <p style={{ margin: "0 0 8px", fontSize: "0.72rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    ปัญหา / อุปสรรค
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {(selectedProject as HQProject & { issues?: string[] }).issues!.map((issue, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, padding: "9px 12px", background: "#fff8f8", border: "1px solid #fca5a5", borderRadius: 9 }}>
                        <AlertTriangle size={13} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: "0.78rem", color: "#2D2D2D" }}>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Updates */}
              {(selectedProject as HQProject & { updates?: {date: string; note: string}[] }).updates?.length ? (
                <div style={{ marginBottom: 18 }}>
                  <p style={{ margin: "0 0 8px", fontSize: "0.72rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    อัปเดตล่าสุด
                  </p>
                  <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
                    {(selectedProject as HQProject & { updates?: {date: string; note: string}[] }).updates!.map((u, i, arr) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", borderBottom: i < arr.length - 1 ? "1px solid #f0f4f8" : "none", background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                        <MessageSquare size={13} style={{ flexShrink: 0, marginTop: 2, color: "#9ca3af" }} />
                        <div>
                          <p style={{ margin: "0 0 2px", fontSize: "0.78rem", color: "#2D2D2D" }}>{u.note}</p>
                          <p style={{ margin: 0, fontSize: "0.62rem", color: "#9ca3af" }}>{u.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: 18 }}>
                  <p style={{ margin: "0 0 8px", fontSize: "0.72rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>อัปเดตล่าสุด</p>
                  <p style={{ fontSize: "0.78rem", color: "#9ca3af" }}>ยังไม่มีการอัปเดต</p>
                </div>
              )}
            </div>

            {/* Drawer footer */}
            <div style={{ padding: "14px 20px", borderTop: "1px solid #e5e7eb", background: "#fafafa", display: "flex", gap: 8 }}>
              <button style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#003366", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f3f7fc"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}>
                <MessageSquare size={14} /> บันทึกความเห็น
              </button>
              <button style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "#003366", color: "#fff", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#002244"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#003366"; }}>
                <Users size={14} /> ติดต่อ PM
              </button>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.55rem", fontWeight: 800, color: "#2D2D2D", marginBottom: 3 }}>ภาพรวมโครงการดีล</h1>
          <p style={{ fontSize: "0.76rem", color: "#6b7280" }}>บริหารโครงการทั้งดีลเลอร์ · {period.subtitle}</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <PeriodSelector />
          <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowExport(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: "#2D2D2D", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f8f9fb"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
          >
            <Download size={14} /> ส่งออก
          </button>
          {showExport && (
            <>
              <div onClick={() => setShowExport(false)} style={{ position: "fixed", inset: 0, zIndex: 100 }} />
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.12)", zIndex: 101, minWidth: 160, overflow: "hidden" }}>
                {["Excel (.xlsx)", "PDF รายงาน"].map(f => (
                  <button key={f} onClick={() => doExport(f)}
                    style={{ width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", fontSize: "0.78rem", color: "#2D2D2D", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f3f7fc"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; }}
                  >
                    <Download size={12} style={{ color: "#6b7280" }} /> {f}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "โครงการทั้งหมด",  value: `${total} โครงการ`,  sub: `มูลค่า ${fmtM(totalValue)}`,      color: "#003366",  subColor: "#6b7280" },
          { label: "กำลังดำเนินการ",  value: `${active} โครงการ`, sub: `${Math.round(active/total*100)}% จากทั้งหมด`, color: "#003366", subColor: "#6b7280" },
          { label: "เกินกำหนด",       value: `${overdue} โครงการ`, sub: "สถานะต้องแก้ไข",                 color: "#dc2626",  subColor: "#dc2626" },
          { label: "เสร็จสิ้น (YTD)", value: `${completed} โครงการ`, sub: `${Math.round(completed/total*100)}% complete rate`, color: "#059669", subColor: "#059669" },
          { label: "ส่งตรงเวลา",      value: `${onTimePct}%`,      sub: "จากโครงการทั้งหมด",              color: onTimePct >= 80 ? "#059669" : "#d97706", subColor: "#6b7280" },
        ].map(k => (
          <div key={k.label} style={{ ...CARD, padding: "14px 16px" }}>
            <p style={{ fontSize: "0.68rem", color: "#6b7280", fontWeight: 500, marginBottom: 4 }}>{k.label}</p>
            <p style={{ fontSize: "1.28rem", fontWeight: 800, color: k.color, lineHeight: 1, marginBottom: 3 }}>{k.value}</p>
            <p style={{ fontSize: "0.64rem", color: k.subColor, fontWeight: 600 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Alert row · overdue projects */}
      {overdue > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 16, flexWrap: "wrap", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
          <AlertTriangle size={13} color="#dc2626" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: "0.72rem", color: "#dc2626", fontWeight: 700, flexShrink: 0 }}>
            มี {overdue} โครงการเกินกำหนด ·
          </span>
          {hqProjects.filter(p => p.status === "overdue").map(p => (
            <span key={p.id} style={{ fontSize: "0.69rem", fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: "#fff7f7", border: "1px solid #fecaca", color: "#dc2626" }}>
              {p.dealerCode} · {p.name.length > 24 ? p.name.slice(0, 24) + "…" : p.name} ({Math.abs(p.daysLeft)} วันเกิน)
            </span>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <select
          value={dealerFilter}
          onChange={e => setDealerFilter(e.target.value)}
          style={{ fontSize: "0.76rem", border: "1px solid #e5e7eb", borderRadius: 9, padding: "7px 12px", color: "#2D2D2D", background: "#fff", outline: "none", cursor: "pointer" }}
        >
          {DEALERS.map(d => <option key={d}>{d}</option>)}
        </select>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {STATUSES.map(s => {
            const active = statusFilter === s.key;
            return (
              <button key={s.key} onClick={() => setStatusFilter(s.key)}
                style={{ fontSize: "0.72rem", fontWeight: active ? 700 : 500, padding: "5px 12px", borderRadius: 99, border: `1px solid ${active ? "#003366" : "#e5e7eb"}`, background: active ? "#f3f7fc" : "#fff", color: active ? "#003366" : "#6b7280", cursor: "pointer" }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "#f8f9fb"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "#fff"; }}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "#6b7280" }}>
          แสดง {filtered.length} / {total} โครงการ
        </span>
      </div>

      {/* Table */}
      <div style={{ ...CARD, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fb", borderBottom: "1px solid #e5e7eb" }}>
                {["รหัส", "ชื่อโครงการ", "สาขา", "ลูกค้า", "มูลค่า", "สถานะ", "ความคืบหน้า", "กำหนดส่ง", "PM"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", fontSize: "0.67rem", fontWeight: 700, color: "#6b7280", textAlign: "left", whiteSpace: "nowrap", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const isOverdue = p.status === "overdue";
                return (
                  <tr key={p.id}
                    onClick={() => setSelectedProject(p)}
                    style={{ borderBottom: "1px solid #f0f4f8", background: isOverdue ? "#fff8f8" : "transparent", cursor: "pointer" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isOverdue ? "#fef2f2" : "#f8f9fb"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isOverdue ? "#fff8f8" : "transparent"; }}
                  >
                    <td style={{ padding: "11px 14px", fontSize: "0.72rem", color: "#9ca3af", fontWeight: 600, whiteSpace: "nowrap" }}>{p.id}</td>
                    <td style={{ padding: "11px 14px", maxWidth: 220 }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2D2D2D", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                      <span style={{ fontSize: "0.64rem", color: "#9ca3af" }}>{p.product}</span>
                    </td>
                    <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#003366" }}>{p.dealerCode}</span>
                      <span style={{ display: "block", fontSize: "0.62rem", color: "#9ca3af" }}>{p.region}</span>
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: "0.76rem", color: "#2D2D2D", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.customer}</td>
                    <td style={{ padding: "11px 14px", fontSize: "0.78rem", fontWeight: 700, color: "#003366", whiteSpace: "nowrap" }}>{fmtM(p.valueNum)}</td>
                    <td style={{ padding: "11px 14px" }}><StatusBadge status={p.status} /></td>
                    <td style={{ padding: "11px 14px", minWidth: 120 }}>
                      {p.status === "not_started"
                        ? <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>ยังไม่เริ่ม</span>
                        : <ProgressBar pct={p.progressPct} status={p.status} />
                      }
                    </td>
                    <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "0.74rem", color: isOverdue ? "#dc2626" : "#2D2D2D", fontWeight: isOverdue ? 700 : 400 }}>{p.deadline}</span>
                      {isOverdue && <span style={{ display: "block", fontSize: "0.62rem", color: "#dc2626", fontWeight: 700 }}>เกิน {Math.abs(p.daysLeft)} วัน</span>}
                      {!isOverdue && p.status !== "completed" && p.status !== "not_started" && p.daysLeft <= 14 && (
                        <span style={{ display: "block", fontSize: "0.62rem", color: "#f59e0b", fontWeight: 700 }}>เหลือ {p.daysLeft} วัน</span>
                      )}
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: "0.74rem", color: "#6b7280", whiteSpace: "nowrap" }}>{p.pm}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: "32px 20px", textAlign: "center", fontSize: "0.78rem", color: "#9ca3af" }}>
                    ไม่พบโครงการในตัวกรองที่เลือก
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
