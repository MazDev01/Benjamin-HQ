"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Phone, Mail, MapPin, Users2, FileText, FilePlus, CalendarPlus,
  StickyNote, CheckCircle2, Paperclip, Upload, X, type LucideIcon,
} from "lucide-react";
import {
  leads, customers, quotations, projects,
  leadStatusLabel, quotationStatusLabel, quotationStatusColor,
  projectStatusLabel, projectStatusColor,
  type LeadStatus,
} from "@/lib/mock";

const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
  boxShadow: "0 2px 14px rgba(0,0,0,.07)",
};
const PRIMARY = "#003366";
const STEEL   = "#2D2D2D";
const BORDER  = "#e5e7eb";
const SUCCESS = "#059669";
const MUTED   = "#6b7280";

// ─── Pipeline step definitions ──────────────────────────────────────────────
const PIPELINE_STEPS: { key: LeadStatus; label: string; short: string; fileHint: string }[] = [
  { key: "NEW",     label: "รับลีดใหม่",       short: "รับลีด",   fileHint: "ข้อมูลเบื้องต้น, แบบฟอร์ม" },
  { key: "WAITING", label: "สำรวจหน้างาน",     short: "สำรวจ",    fileHint: "ภาพถ่ายไซต์, แผนที่, โฉนด" },
  { key: "BULLET",  label: "ออกแบบ & คิดราคา", short: "คิดราคา",  fileHint: "แบบร่าง, BOQ, ใบคำนวณ" },
  { key: "QUOTED",  label: "เสนอราคาแล้ว",      short: "เสนอราคา", fileHint: "ใบเสนอราคา PDF, Terms" },
  { key: "PAID",    label: "ปิดดีล",            short: "ปิดดีล",   fileHint: "สัญญา, เอกสารยืนยัน" },
];

const STEP_INDEX: Record<LeadStatus, number> = {
  NEW: 0, WAITING: 1, BULLET: 2, QUOTED: 3, PAID: 4, CANCELLED: -1,
};

const ACT_ICON: Record<string, LucideIcon> = {
  call: Phone, email: Mail, meeting: Users2,
  note: StickyNote, visit: MapPin, doc: FileText,
};

type ActivityEntry = { id: number; date: string; icon: string; text: string; type: string };
type MockFile = { id: string; name: string; date: string; size: string; step: LeadStatus };

const INIT_ACTS: ActivityEntry[] = [
  { id: 1, date: "22 มิ.ย. 2569", icon: "call",  text: "โทรติดตามลูกค้า — ยืนยันนัดสำรวจ", type: "call" },
  { id: 2, date: "18 มิ.ย. 2569", icon: "doc",   text: "ส่งใบเสนอราคาเบื้องต้น", type: "doc" },
  { id: 3, date: "10 มิ.ย. 2569", icon: "visit", text: "สำรวจหน้างานพร้อมทีม", type: "visit" },
  { id: 4, date: "2 มิ.ย. 2569",  icon: "note",  text: "บันทึกลีดใหม่เข้าระบบ", type: "note" },
];

const INIT_FILES: MockFile[] = [
  { id: "f1", name: "ภาพไซต์งาน-01.jpg",     date: "10 มิ.ย.", size: "2.4 MB", step: "WAITING" },
  { id: "f2", name: "BOQ-ร่าง-v2.xlsx",       date: "22 มิ.ย.", size: "340 KB", step: "BULLET"  },
  { id: "f3", name: "แบบร่างอาคาร-v1.pdf",    date: "18 มิ.ย.", size: "1.8 MB", step: "BULLET"  },
];

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f4f8" }}>
      <span style={{ fontSize: "0.73rem", color: MUTED, fontWeight: 600, minWidth: 110 }}>{label}</span>
      <span style={{ fontSize: "0.82rem", color: STEEL, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function LeadDetailPage() {
  const params = useParams();
  const numId  = Number(params.id);
  const lead   = leads.find(l => l.numId === numId);

  const [status,         setStatus]         = useState<LeadStatus>(lead?.status ?? "NEW");
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [activities,     setActivities]     = useState<ActivityEntry[]>(INIT_ACTS);
  const [actText,        setActText]        = useState("");
  const [actType,        setActType]        = useState("note");
  const [phone,          setPhone]          = useState(lead?.phone ?? "089-123-4567");
  const [email,          setEmail]          = useState(lead?.email ?? "customer@mail.com");
  const [editPhone,      setEditPhone]      = useState(false);
  const [editEmail,      setEditEmail]      = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [qName,          setQName]          = useState("");
  const [qValue,         setQValue]         = useState("");
  const [qProduct,       setQProduct]       = useState("");
  const [qProvince,      setQProvince]      = useState("");
  const [qNotes,         setQNotes]         = useState("");
  const [qSaved,         setQSaved]         = useState(false);

  // Job Card state
  const [activeStep,      setActiveStep]     = useState<LeadStatus>(
    lead?.status === "CANCELLED" || lead?.status === "PAID" ? "QUOTED" : (lead?.status ?? "NEW")
  );
  const [stepProgress,    setStepProgress]   = useState<Record<LeadStatus, number>>({
    NEW: 100, WAITING: 100, BULLET: 60, QUOTED: 0, PAID: 0, CANCELLED: 0,
  });
  const [files,           setFiles]          = useState<MockFile[]>(INIT_FILES);
  const [uploadSuccess,   setUploadSuccess]  = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!lead) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: MUTED }}>ไม่พบข้อมูลลีด</p>
        <Link href="/leads" style={{ color: PRIMARY, fontSize: "0.85rem" }}>← กลับ</Link>
      </div>
    );
  }

  const customer          = lead.customerId ? customers.find(c => c.id === lead.customerId) : null;
  const relatedQuotations = lead.customerId ? quotations.filter(q => q.customerId === lead.customerId) : [];
  const relatedProjects   = lead.customerId ? projects.filter(p => p.customerId === lead.customerId) : [];
  const currentStepIdx    = STEP_INDEX[status];
  const activeStepDef     = PIPELINE_STEPS.find(s => s.key === activeStep) ?? PIPELINE_STEPS[0];
  const stepFiles         = files.filter(f => f.step === activeStep);

  function addActivity() {
    if (!actText.trim()) return;
    setActivities(prev => [{
      id: Date.now(), date: "26 มิ.ย. 2569",
      icon: actType, text: actText.trim(), type: actType,
    }, ...prev]);
    setActText("");
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFiles(prev => [...prev, {
      id: `f-${Date.now()}`, name: f.name,
      date: "26 มิ.ย.",
      size: f.size > 1_000_000 ? `${(f.size / 1_000_000).toFixed(1)} MB` : `${Math.round(f.size / 1000)} KB`,
      step: activeStep,
    }]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
    e.target.value = "";
  }

  return (
    <div style={{ maxWidth: 1100 }}>

      {/* Back + Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <Link href="/leads" style={{ fontSize: "0.82rem", color: PRIMARY, fontWeight: 600, textDecoration: "none" }}>
          ← กลับ
        </Link>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/appointments" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 10,
            border: `1px solid ${BORDER}`, background: "#fff",
            color: STEEL, fontSize: "0.78rem", fontWeight: 600, textDecoration: "none",
          }}>
            <CalendarPlus size={14} strokeWidth={2} /> เพิ่มนัดหมาย
          </a>
          <button
            onClick={() => { setQName(lead.name); setQValue(lead.value); setQProduct(lead.product); setQProvince(lead.province); setQNotes(""); setQSaved(false); setShowQuoteModal(true); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 10,
              background: PRIMARY, color: "#fff",
              fontSize: "0.78rem", fontWeight: 700, border: "none", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,.25)",
            }}>
            <FilePlus size={14} strokeWidth={2} /> สร้างใบเสนอราคา
          </button>
        </div>
      </div>

      {/* ─── Header Card ──────────────────────────────────────────── */}
      <div style={{ ...CARD, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED, background: "#f0f0f5", borderRadius: 8, padding: "4px 10px" }}>
              {lead.id}
            </span>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: STEEL, margin: 0 }}>{lead.name}</h1>

            {/* Status badge + dropdown */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowStatusDrop(p => !p)} style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "4px 12px 4px 10px", borderRadius: 99,
                fontSize: "0.72rem", fontWeight: 700, border: "none", cursor: "pointer",
                background: status === "PAID" ? "#d1fae5" : status === "CANCELLED" ? "#fee2e2" : "#dce5f0",
                color:      status === "PAID" ? SUCCESS   : status === "CANCELLED" ? "#dc2626" : PRIMARY,
              }}>
                {leadStatusLabel[status]} ▾
              </button>
              {showStatusDrop && (
                <>
                  <div onClick={() => setShowStatusDrop(false)} style={{ position: "fixed", inset: 0, zIndex: 9 }} />
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 10,
                    background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,.12)", minWidth: 190, overflow: "hidden",
                  }}>
                    {(["NEW","WAITING","BULLET","QUOTED","PAID","CANCELLED"] as LeadStatus[]).map(s => (
                      <button key={s} onClick={() => {
                        setStatus(s);
                        setShowStatusDrop(false);
                        if (s !== "CANCELLED" && s !== "PAID") setActiveStep(s);
                      }} style={{
                        display: "flex", alignItems: "center", gap: 8, width: "100%",
                        padding: "9px 14px", border: "none",
                        background: s === status ? "#f8f9fb" : "transparent",
                        cursor: "pointer", textAlign: "left",
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: s === "PAID" ? SUCCESS : s === "CANCELLED" ? "#dc2626" : PRIMARY }} />
                        <span style={{ fontSize: "0.78rem", color: s === status ? PRIMARY : STEEL, fontWeight: s === status ? 700 : 400 }}>
                          {leadStatusLabel[s]}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.65rem", color: MUTED, fontWeight: 600 }}>มูลค่าประมาณการ</div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: PRIMARY }}>{lead.value}</div>
          </div>
        </div>

        {/* Sub info row */}
        <div style={{ display: "flex", gap: 24, marginTop: 14, paddingTop: 14, borderTop: "1px solid #f0f4f8", flexWrap: "wrap" }}>
          {[
            { label: "ประเภทงาน", val: lead.product },
            { label: "จังหวัด",   val: lead.province },
            { label: "แหล่งที่มา", val: lead.source ?? "—" },
            { label: "ผู้รับผิดชอบ", val: lead.assigned },
          ].map(r => (
            <span key={r.label} style={{ fontSize: "0.75rem", color: MUTED }}>
              <span style={{ fontWeight: 700, color: STEEL }}>{r.label}:</span> {r.val}
            </span>
          ))}
        </div>
      </div>

      {/* ─── JOB CARD TIMELINE ───────────────────────────────────── */}
      <div style={{ ...CARD, marginBottom: 16, overflow: "hidden" }}>

        {/* Timeline strip */}
        <div style={{ padding: "20px 28px 0", background: "#fafbfc", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: "0.62rem", fontWeight: 800, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18 }}>
            การ์ดงาน · ขั้นตอนการขาย
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", paddingBottom: 20 }}>
            {PIPELINE_STEPS.map((step, idx) => {
              const done    = status !== "CANCELLED" ? currentStepIdx > idx : false;
              const isCurr  = step.key === status && status !== "CANCELLED" && status !== "PAID";
              const isPaid  = status === "PAID";
              const filled  = done || (isPaid) || (isCurr);
              const isActive = step.key === activeStep;

              return (
                <div key={step.key} style={{ display: "flex", alignItems: "flex-start", flex: idx < 4 ? 1 : 0 }}>
                  {/* Step node */}
                  <div
                    onClick={() => setActiveStep(step.key)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", minWidth: 72 }}
                  >
                    {/* Circle */}
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "0.82rem",
                      background: filled ? PRIMARY : "#f3f4f6",
                      color: filled ? "#fff" : "#9ca3af",
                      outline: isActive ? `3px solid rgba(0,51,102,0.25)` : "none",
                      outlineOffset: 2,
                      boxShadow: isCurr ? "0 0 0 6px rgba(0,51,102,.08)" : "none",
                      transition: "all .2s",
                      flexShrink: 0,
                    }}>
                      {done || (isPaid && idx < 5)
                        ? <CheckCircle2 size={19} strokeWidth={2.5} />
                        : idx + 1}
                    </div>

                    {/* Label */}
                    <span style={{
                      fontSize: "0.68rem",
                      fontWeight: isActive ? 800 : done || isCurr ? 700 : 500,
                      color: isActive || done || isCurr ? PRIMARY : MUTED,
                      textAlign: "center", whiteSpace: "nowrap",
                    }}>
                      {step.short}
                    </span>

                    {/* Sub-status */}
                    {isCurr && (
                      <span style={{ fontSize: "0.6rem", color: "#d97706", fontWeight: 700, marginTop: -2 }}>
                        กำลังดำเนินการ
                      </span>
                    )}
                    {done && (
                      <span style={{ fontSize: "0.6rem", color: SUCCESS, fontWeight: 600, marginTop: -2 }}>
                        เสร็จแล้ว
                      </span>
                    )}
                    {isPaid && (
                      <span style={{ fontSize: "0.6rem", color: SUCCESS, fontWeight: 600, marginTop: -2 }}>
                        {idx < 4 ? "เสร็จแล้ว" : "ปิดดีล ✓"}
                      </span>
                    )}
                  </div>

                  {/* Connector */}
                  {idx < 4 && (
                    <div style={{
                      flex: 1, height: 3, borderRadius: 99, marginTop: 17,
                      background: done || isPaid ? PRIMARY : "#e5e7eb",
                      transition: "background .3s",
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Cancelled badge */}
          {status === "CANCELLED" && (
            <div style={{ paddingBottom: 14 }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, background: "#fee2e2", color: "#dc2626", borderRadius: 8, padding: "4px 14px" }}>
                ✕ เสียดีลแล้ว — ลีดนี้ถูกปิดโดยไม่ได้ขาย
              </span>
            </div>
          )}
        </div>

        {/* Active Step Detail */}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%", background: PRIMARY, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 800, color: "#fff",
            }}>
              {PIPELINE_STEPS.findIndex(s => s.key === activeStep) + 1}
            </div>
            <div>
              <div style={{ fontSize: "0.92rem", fontWeight: 800, color: STEEL }}>{activeStepDef.label}</div>
              <div style={{ fontSize: "0.68rem", color: MUTED }}>เอกสารที่ควรมี: {activeStepDef.fileHint}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            {/* Progress panel */}
            <div style={{ background: "#f8f9fb", borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED, marginBottom: 12 }}>
                ความคืบหน้าขั้นตอนนี้
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <input
                  type="range" min={0} max={100} step={5}
                  value={stepProgress[activeStep]}
                  onChange={e => setStepProgress(p => ({ ...p, [activeStep]: Number(e.target.value) }))}
                  style={{ flex: 1, accentColor: PRIMARY, cursor: "pointer", height: 4 }}
                />
                <span style={{ fontSize: "1.2rem", fontWeight: 900, color: PRIMARY, minWidth: 44, textAlign: "right" }}>
                  {stepProgress[activeStep]}%
                </span>
              </div>
              <div style={{ height: 8, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 99,
                  width: `${stepProgress[activeStep]}%`,
                  background: stepProgress[activeStep] === 100 ? SUCCESS : PRIMARY,
                  transition: "width .3s ease",
                }} />
              </div>
              {stepProgress[activeStep] === 100 ? (
                <div style={{ fontSize: "0.7rem", color: SUCCESS, fontWeight: 700, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle2 size={13} strokeWidth={2.5} /> ขั้นตอนนี้เสร็จสมบูรณ์
                </div>
              ) : (
                <div style={{ fontSize: "0.68rem", color: MUTED, marginTop: 8 }}>
                  เลื่อนเพื่ออัปเดตความคืบหน้า
                </div>
              )}
            </div>

            {/* Files panel */}
            <div style={{ background: "#f8f9fb", borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: MUTED }}>
                  ไฟล์แนบ ({stepFiles.length})
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "5px 11px", borderRadius: 8,
                    background: PRIMARY, color: "#fff",
                    fontSize: "0.66rem", fontWeight: 700,
                    border: "none", cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(0,51,102,.3)",
                  }}>
                  <Upload size={11} strokeWidth={2.5} /> แนบไฟล์
                </button>
                <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileUpload} />
              </div>

              {uploadSuccess && (
                <div style={{ fontSize: "0.7rem", color: SUCCESS, fontWeight: 700, background: "#d1fae5", borderRadius: 8, padding: "5px 10px", marginBottom: 8 }}>
                  ✓ อัปโหลดไฟล์เรียบร้อยแล้ว
                </div>
              )}

              {stepFiles.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "16px 8px",
                  border: "1.5px dashed #d1d5db", borderRadius: 10, color: MUTED,
                }}>
                  <Paperclip size={18} color="#d1d5db" style={{ display: "block", margin: "0 auto 6px" }} />
                  <span style={{ fontSize: "0.7rem" }}>ยังไม่มีไฟล์แนบในขั้นตอนนี้</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 120, overflowY: "auto" }}>
                  {stepFiles.map(f => (
                    <div key={f.id} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "6px 10px", background: "#fff",
                      borderRadius: 9, border: `1px solid ${BORDER}`,
                    }}>
                      <FileText size={13} color={PRIMARY} strokeWidth={2} style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 600, color: STEEL, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {f.name}
                        </div>
                        <div style={{ fontSize: "0.6rem", color: MUTED }}>{f.date} · {f.size}</div>
                      </div>
                      <button
                        onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#d1d5db", padding: 2, lineHeight: 0 }}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Info + Activity ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Left: Info */}
        <div style={{ ...CARD, padding: "20px 24px" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: STEEL, marginBottom: 14 }}>ข้อมูลลีด</div>
          <InfoRow label="จังหวัด"    value={lead.province} />
          <InfoRow label="ประเภทงาน" value={
            <span style={{ background: "#dce5f0", color: PRIMARY, borderRadius: 99, padding: "2px 10px", fontSize: "0.72rem", fontWeight: 700 }}>
              {lead.product}
            </span>
          } />
          <InfoRow label="มูลค่า"    value={<span style={{ color: PRIMARY, fontWeight: 700 }}>{lead.value}</span>} />
          <InfoRow label="หมายเหตุ"  value={lead.note ?? "—"} />

          {/* Editable phone */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f4f8" }}>
            <span style={{ fontSize: "0.73rem", color: MUTED, fontWeight: 600, minWidth: 110 }}>โทรศัพท์</span>
            {editPhone ? (
              <div style={{ display: "flex", gap: 6, flex: 1 }}>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && setEditPhone(false)}
                  style={{ flex: 1, fontSize: "0.82rem", border: `1px solid ${BORDER}`, borderRadius: 7, padding: "3px 8px", outline: "none", color: STEEL }} />
                <button onClick={() => setEditPhone(false)}
                  style={{ padding: "3px 10px", borderRadius: 7, border: "none", background: PRIMARY, color: "#fff", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}>
                  บันทึก
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <span style={{ fontSize: "0.82rem", color: STEEL, fontWeight: 500 }}>{phone}</span>
                <button onClick={() => setEditPhone(true)} style={{ fontSize: "0.67rem", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>แก้ไข</button>
                <a href={`tel:${phone}`} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.68rem", color: PRIMARY, background: "#dce5f0", borderRadius: 99, padding: "2px 8px", fontWeight: 600, textDecoration: "none" }}>
                  <Phone size={11} strokeWidth={2.5} /> โทร
                </a>
              </div>
            )}
          </div>

          {/* Editable email */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f4f8" }}>
            <span style={{ fontSize: "0.73rem", color: MUTED, fontWeight: 600, minWidth: 110 }}>อีเมล</span>
            {editEmail ? (
              <div style={{ display: "flex", gap: 6, flex: 1 }}>
                <input value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && setEditEmail(false)}
                  style={{ flex: 1, fontSize: "0.82rem", border: `1px solid ${BORDER}`, borderRadius: 7, padding: "3px 8px", outline: "none", color: STEEL }} />
                <button onClick={() => setEditEmail(false)}
                  style={{ padding: "3px 10px", borderRadius: 7, border: "none", background: PRIMARY, color: "#fff", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}>
                  บันทึก
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <span style={{ fontSize: "0.82rem", color: STEEL, fontWeight: 500 }}>{email}</span>
                <button onClick={() => setEditEmail(true)} style={{ fontSize: "0.67rem", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>แก้ไข</button>
              </div>
            )}
          </div>

          {customer && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e5e7eb" }}>
              <Link href={`/customers/${customer.id}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: PRIMARY, color: "#fff", borderRadius: 10, padding: "8px 16px", fontSize: "0.78rem", fontWeight: 700, textDecoration: "none" }}>
                ดูโปรไฟล์ลูกค้า →
              </Link>
            </div>
          )}
        </div>

        {/* Right: Activity log */}
        <div style={{ ...CARD, padding: "20px 24px" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: STEEL, marginBottom: 12 }}>ประวัติกิจกรรม</div>

          <div style={{ marginBottom: 14, padding: "12px 14px", background: "#f8f9fb", borderRadius: 12, border: "1px solid #f0f0f5" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {(Object.entries(ACT_ICON) as [string, LucideIcon][]).map(([k, Icon]) => (
                <button key={k} onClick={() => setActType(k)} style={{
                  width: 30, height: 30, borderRadius: 8,
                  border: actType === k ? `2px solid ${PRIMARY}` : "1px solid #e2e8f0",
                  background: actType === k ? "#dce5f0" : "#fff",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={14} color={actType === k ? PRIMARY : "#9ca3af"} strokeWidth={2} />
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={actText} onChange={e => setActText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addActivity()}
                placeholder="บันทึกกิจกรรม..."
                style={{ flex: 1, fontSize: "0.8rem", border: `1px solid ${BORDER}`, borderRadius: 9, padding: "7px 12px", outline: "none", color: STEEL }} />
              <button onClick={addActivity} style={{ padding: "7px 14px", borderRadius: 9, border: "none", background: PRIMARY, color: "#fff", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
                บันทึก
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxHeight: 260, overflowY: "auto" }}>
            {activities.map((a, i) => (
              <div key={a.id} style={{ display: "flex", gap: 14, position: "relative", paddingBottom: i < activities.length - 1 ? 18 : 0 }}>
                {i < activities.length - 1 && (
                  <div style={{ position: "absolute", left: 14, top: 30, bottom: 0, width: 2, background: "#e5e7eb" }} />
                )}
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#dce5f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                  {(() => { const Icon = ACT_ICON[a.icon] ?? FileText; return <Icon size={14} color={PRIMARY} strokeWidth={2} />; })()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.82rem", color: STEEL, fontWeight: 500, marginBottom: 2 }}>{a.text}</div>
                  <div style={{ fontSize: "0.68rem", color: MUTED }}>{a.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Related Quotations ───────────────────────────────────── */}
      {relatedQuotations.length > 0 && (
        <div style={{ ...CARD, padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: STEEL, marginBottom: 14 }}>ใบเสนอราคาที่เกี่ยวข้อง</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                {["เลขที่","โครงการ","มูลค่า","สถานะ","วันที่"].map(h => (
                  <th key={h} style={{ fontSize: "0.65rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", padding: "8px 12px", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {relatedQuotations.map(q => {
                const qc = quotationStatusColor[q.status];
                return (
                  <tr key={q.id} style={{ borderBottom: "1px solid #f0f4f8" }}>
                    <td style={{ padding: "9px 12px", fontSize: "0.78rem", fontWeight: 700, color: STEEL }}>{q.id}</td>
                    <td style={{ padding: "9px 12px", fontSize: "0.78rem", color: MUTED }}>{q.project}</td>
                    <td style={{ padding: "9px 12px", fontSize: "0.78rem", fontWeight: 700, color: STEEL }}>{q.total}</td>
                    <td style={{ padding: "9px 12px" }}>
                      <span style={{ background: qc.bg, color: qc.text, borderRadius: 99, padding: "2px 9px", fontSize: "0.68rem", fontWeight: 700 }}>
                        {quotationStatusLabel[q.status]}
                      </span>
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: "0.75rem", color: MUTED }}>{q.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Related Projects ─────────────────────────────────────── */}
      {relatedProjects.length > 0 && (
        <div style={{ ...CARD, padding: "20px 24px" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 800, color: STEEL, marginBottom: 14 }}>โครงการที่เกี่ยวข้อง</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                {["ชื่อโครงการ","สถานะ","ความคืบหน้า","มูลค่า","กำหนดส่ง"].map(h => (
                  <th key={h} style={{ fontSize: "0.65rem", fontWeight: 700, color: MUTED, textTransform: "uppercase", padding: "8px 12px", textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {relatedProjects.map(p => {
                const pc = projectStatusColor[p.status];
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #f0f4f8", cursor: "pointer" }}
                    onClick={() => { window.location.href = `/projects/${p.id}`; }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f8f9fb"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ""; }}>
                    <td style={{ padding: "9px 12px", fontSize: "0.82rem", fontWeight: 600, color: STEEL }}>{p.title}</td>
                    <td style={{ padding: "9px 12px" }}>
                      <span style={{ background: pc.bg, color: pc.text, borderRadius: 99, padding: "2px 9px", fontSize: "0.68rem", fontWeight: 700 }}>
                        {projectStatusLabel[p.status]}
                      </span>
                    </td>
                    <td style={{ padding: "9px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 100 }}>
                        <div style={{ flex: 1, height: 5, background: "#f0f0f5", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${p.progress}%`, background: p.progress === 100 ? SUCCESS : PRIMARY, borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: "0.68rem", color: MUTED, fontWeight: 700 }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: "0.78rem", fontWeight: 700, color: STEEL }}>{p.value}</td>
                    <td style={{ padding: "9px 12px", fontSize: "0.75rem", color: MUTED }}>{p.due}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── Create Quotation Modal ───────────────────────────────── */}
      {showQuoteModal && (
        <>
          <div onClick={() => setShowQuoteModal(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 100 }} />
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 101,
            background: "#fff", borderRadius: 20, boxShadow: "0 20px 60px rgba(0,0,0,.22)",
            width: "100%", maxWidth: 520, padding: "28px 32px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: STEEL, display: "flex", alignItems: "center", gap: 8 }}>
                  <FilePlus size={18} color={PRIMARY} strokeWidth={2} /> สร้างใบเสนอราคา
                </div>
                <div style={{ fontSize: "0.72rem", color: MUTED, marginTop: 3 }}>จากลีด {lead.id} · {lead.company}</div>
              </div>
              <button onClick={() => setShowQuoteModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "1.2rem", lineHeight: 1 }}>✕</button>
            </div>

            {qSaved ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}><CheckCircle2 size={48} color={SUCCESS} strokeWidth={1.5} /></div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: SUCCESS, marginBottom: 6 }}>สร้างใบเสนอราคาสำเร็จ</div>
                <div style={{ fontSize: "0.78rem", color: MUTED, marginBottom: 20 }}>ระบบบันทึก {qName} เรียบร้อยแล้ว</div>
                <button onClick={() => setShowQuoteModal(false)}
                  style={{ padding: "9px 28px", borderRadius: 10, background: PRIMARY, color: "#fff", border: "none", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                  ปิด
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>ชื่อโครงการ *</label>
                  <input value={qName} onChange={e => setQName(e.target.value)}
                    style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 12px", fontSize: "0.85rem", color: STEEL, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>ประเภทอาคาร</label>
                    <select value={qProduct} onChange={e => setQProduct(e.target.value)}
                      style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 12px", fontSize: "0.85rem", color: STEEL, outline: "none", boxSizing: "border-box", background: "#fff" }}>
                      <option value="">เลือกประเภท</option>
                      <option>โกดัง / โชว์รูม</option>
                      <option>อาคารสำเร็จรูป</option>
                      <option>สนามกีฬา</option>
                      <option>Main Contractor</option>
                      <option>Turnkey (ครบวงจร)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>จังหวัด</label>
                    <input value={qProvince} onChange={e => setQProvince(e.target.value)}
                      style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 12px", fontSize: "0.85rem", color: STEEL, outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>มูลค่าโครงการ (ประมาณการ)</label>
                  <input value={qValue} onChange={e => setQValue(e.target.value)}
                    placeholder="฿0"
                    style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 12px", fontSize: "0.85rem", color: STEEL, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151", display: "block", marginBottom: 5 }}>หมายเหตุ</label>
                  <textarea value={qNotes} onChange={e => setQNotes(e.target.value)} rows={3}
                    placeholder="รายละเอียดเพิ่มเติม เช่น ขนาดอาคาร, วัสดุ, เงื่อนไขพิเศษ..."
                    style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 12px", fontSize: "0.82rem", color: STEEL, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                  <button onClick={() => setShowQuoteModal(false)}
                    style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", color: STEEL, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
                    ยกเลิก
                  </button>
                  <button onClick={() => {
                    if (!qName.trim()) return;
                    setActivities(prev => [{
                      id: Date.now(), date: "26 มิ.ย. 2569",
                      icon: "doc", text: `สร้างใบเสนอราคา "${qName}" มูลค่า ${qValue}`, type: "doc",
                    }, ...prev]);
                    setQSaved(true);
                  }} style={{
                    padding: "9px 24px", borderRadius: 10, border: "none",
                    background: PRIMARY, color: "#fff",
                    fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,.25)",
                  }}>
                    ✓ สร้างใบเสนอราคา
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
