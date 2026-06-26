"use client";

import { useState } from "react";
import { hqAnnouncements, HQAnnouncement, AnnouncementCategory } from "@/lib/mock";
import { Plus, Pin, Bell, Tag, Megaphone, X, ChevronDown } from "lucide-react";

const PRIMARY = "#003366";
const STEEL = "#2D2D2D";
const BORDER = "#e5e7eb";
const MUTED = "#6b7280";
const AMBER = "#d97706";
const RED = "#dc2626";
const GREEN = "#059669";

const CARD: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: `1px solid ${BORDER}`,
  boxShadow: "0 2px 14px rgba(0,0,0,.07)",
};

function categoryBadgeStyle(cat: AnnouncementCategory): React.CSSProperties {
  switch (cat) {
    case "ราคา":
      return { background: "#fee2e2", color: "#dc2626" };
    case "โปรโมชั่น":
      return { background: "#fef3cd", color: "#d97706" };
    case "นโยบาย":
      return { background: "#dce5f0", color: PRIMARY };
    case "ทั่วไป":
    default:
      return { background: "#f0f0f5", color: MUTED };
  }
}

const BADGE_BASE: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: 99,
  fontSize: "0.68rem",
  fontWeight: 700,
};

type FilterCategory = "ทั้งหมด" | AnnouncementCategory;

const FILTER_TABS: FilterCategory[] = ["ทั้งหมด", "ราคา", "โปรโมชั่น", "นโยบาย", "ทั่วไป"];

export default function HQAnnouncementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("ทั้งหมด");
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<AnnouncementCategory>("ทั่วไป");
  const [formBody, setFormBody] = useState("");
  const [formTarget, setFormTarget] = useState("all");
  const [formPinned, setFormPinned] = useState(false);

  const totalCount = hqAnnouncements.length;
  const pinnedCount = hqAnnouncements.filter((a) => a.pinned).length;
  const specificBranchCount = hqAnnouncements.filter(
    (a) => a.targetBranches !== "all"
  ).length;

  const filtered = hqAnnouncements
    .filter((a) =>
      selectedCategory === "ทั้งหมด" ? true : a.category === selectedCategory
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  function handleSave() {
    if (!formTitle.trim()) return;
    setShowModal(false);
    setFormTitle("");
    setFormCategory("ทั่วไป");
    setFormBody("");
    setFormTarget("all");
    setFormPinned(false);
  }

  function handleCloseModal() {
    setShowModal(false);
    setFormTitle("");
    setFormCategory("ทั่วไป");
    setFormBody("");
    setFormTarget("all");
    setFormPinned(false);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function branchLabel(targetBranches: "all" | string[]) {
    if (targetBranches === "all") return "ทุกสาขา";
    return (targetBranches as string[]).join(", ");
  }

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: STEEL,
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Megaphone size={20} strokeWidth={2} color={PRIMARY} />
          ประกาศ/แจ้งเวียน
        </h1>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: PRIMARY,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "9px 16px",
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Plus size={14} strokeWidth={2} />
          สร้างประกาศ
        </button>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {/* Total */}
        <div style={{ ...CARD, padding: "16px 20px" }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: MUTED,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Bell size={14} strokeWidth={2} color={MUTED} />
            ประกาศทั้งหมด
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: PRIMARY }}>
            {totalCount}
          </div>
        </div>

        {/* Pinned */}
        <div style={{ ...CARD, padding: "16px 20px" }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: MUTED,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Pin size={14} strokeWidth={2} color={MUTED} />
            ปักหมุด
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: AMBER }}>
            {pinnedCount}
          </div>
        </div>

        {/* Specific branches */}
        <div style={{ ...CARD, padding: "16px 20px" }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: MUTED,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 6,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Tag size={14} strokeWidth={2} color={MUTED} />
            เฉพาะบางสาขา
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: STEEL }}>
            {specificBranchCount}
          </div>
        </div>
      </div>

      {/* Category filter tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedCategory(tab)}
            style={{
              borderRadius: 99,
              padding: "6px 16px",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              border: `1.5px solid ${selectedCategory === tab ? PRIMARY : BORDER}`,
              background: selectedCategory === tab ? PRIMARY : "#fff",
              color: selectedCategory === tab ? "#fff" : MUTED,
              transition: "all 0.15s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Announcement list */}
      <div>
        {filtered.length === 0 && (
          <div
            style={{
              ...CARD,
              padding: "40px 24px",
              textAlign: "center",
              color: MUTED,
              fontSize: "0.85rem",
            }}
          >
            ไม่พบประกาศในหมวดหมู่นี้
          </div>
        )}
        {filtered.map((ann) => (
          <AnnouncementCard key={ann.id} ann={ann} formatDate={formatDate} branchLabel={branchLabel} />
        ))}
      </div>

      {/* Create Announcement Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
              width: "100%",
              maxWidth: 520,
              padding: "28px 28px 24px",
              position: "relative",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h2
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: STEEL,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Megaphone size={16} strokeWidth={2} color={PRIMARY} />
                สร้างประกาศใหม่
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: MUTED,
                  padding: 4,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            {/* Form fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Title */}
              <div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: MUTED,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  หัวข้อ <span style={{ color: RED }}>*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="ระบุหัวข้อประกาศ..."
                  style={{
                    width: "100%",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: "8px 12px",
                    fontSize: "0.82rem",
                    outline: "none",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: MUTED,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  หมวดหมู่
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as AnnouncementCategory)}
                    style={{
                      width: "100%",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 10,
                      padding: "8px 36px 8px 12px",
                      fontSize: "0.82rem",
                      outline: "none",
                      appearance: "none",
                      background: "#fff",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="ราคา">ราคา</option>
                    <option value="โปรโมชั่น">โปรโมชั่น</option>
                    <option value="นโยบาย">นโยบาย</option>
                    <option value="ทั่วไป">ทั่วไป</option>
                  </select>
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    color={MUTED}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>

              {/* Body */}
              <div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: MUTED,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  เนื้อหา
                </label>
                <textarea
                  rows={4}
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder="รายละเอียดของประกาศ..."
                  style={{
                    width: "100%",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: "8px 12px",
                    fontSize: "0.82rem",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    lineHeight: 1.6,
                  }}
                />
              </div>

              {/* Target */}
              <div>
                <label
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: MUTED,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  ส่งถึง
                </label>
                <div style={{ position: "relative" }}>
                  <select
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value)}
                    style={{
                      width: "100%",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 10,
                      padding: "8px 36px 8px 12px",
                      fontSize: "0.82rem",
                      outline: "none",
                      appearance: "none",
                      background: "#fff",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="all">ทุกสาขา</option>
                    <option value="specific">เฉพาะสาขา...</option>
                  </select>
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    color={MUTED}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>

              {/* Pinned checkbox */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  color: STEEL,
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  checked={formPinned}
                  onChange={(e) => setFormPinned(e.target.checked)}
                  style={{ width: 16, height: 16, cursor: "pointer", accentColor: PRIMARY }}
                />
                <Pin size={13} strokeWidth={2} color={AMBER} />
                ปักหมุดประกาศนี้
              </label>
            </div>

            {/* Modal actions */}
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 22,
                paddingTop: 16,
                borderTop: `1px solid ${BORDER}`,
              }}
            >
              <button
                onClick={handleCloseModal}
                style={{
                  background: "#fff",
                  color: STEEL,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: "9px 18px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={!formTitle.trim()}
                style={{
                  background: formTitle.trim() ? PRIMARY : "#9cb3cc",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "9px 20px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: formTitle.trim() ? "pointer" : "not-allowed",
                  transition: "background 0.15s",
                }}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Announcement card component
function AnnouncementCard({
  ann,
  formatDate,
  branchLabel,
}: {
  ann: HQAnnouncement;
  formatDate: (d: string) => string;
  branchLabel: (t: "all" | string[]) => string;
}) {
  const catStyle = categoryBadgeStyle(ann.category);
  const branchText = branchLabel(ann.targetBranches);
  const isAllBranches = ann.targetBranches === "all";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: `1px solid ${ann.pinned ? "#fde68a" : BORDER}`,
        boxShadow: ann.pinned
          ? "0 2px 14px rgba(217,119,6,.10)"
          : "0 2px 14px rgba(0,0,0,.07)",
        padding: "16px 18px",
        marginBottom: 12,
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 4,
        }}
      >
        {/* Category badge */}
        <span
          style={{
            ...{ display: "inline-block", padding: "2px 10px", borderRadius: 99, fontSize: "0.68rem", fontWeight: 700 },
            ...catStyle,
          }}
        >
          {ann.category}
        </span>

        {/* Pinned badge */}
        {ann.pinned && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              padding: "2px 8px",
              borderRadius: 99,
              fontSize: "0.68rem",
              fontWeight: 700,
              background: "#fef3c7",
              color: "#d97706",
            }}
          >
            <Pin size={10} strokeWidth={2.5} />
            ปักหมุด
          </span>
        )}

        {/* Date right-aligned */}
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.72rem",
            color: MUTED,
            fontWeight: 500,
          }}
        >
          {formatDate(ann.publishedAt)}
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "1rem",
          fontWeight: 800,
          color: "#1e293b",
          margin: "6px 0 4px",
          lineHeight: 1.4,
        }}
      >
        {ann.title}
      </div>

      {/* Body — 2-line clamp */}
      <div
        style={{
          fontSize: "0.8rem",
          color: "#475569",
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginBottom: 10,
        }}
      >
        {ann.body}
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        {/* Author */}
        <span
          style={{
            fontSize: "0.72rem",
            color: MUTED,
            fontWeight: 500,
          }}
        >
          โดย {ann.author}
        </span>

        {/* Target branches chip */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 10px",
            borderRadius: 99,
            fontSize: "0.68rem",
            fontWeight: 700,
            background: isAllBranches ? "#dce5f0" : "#dce5f0",
            color: isAllBranches ? "#003366" : "#003366",
          }}
        >
          <Bell size={10} strokeWidth={2.5} />
          {branchText}
        </span>
      </div>
    </div>
  );
}
