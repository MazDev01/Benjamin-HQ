"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Phone, Users, ContactRound,
  FileText, FileSignature, Receipt, CreditCard,
  Briefcase, BarChart2, ClipboardList,
  Store, ShieldCheck, Package, Bell, DollarSign, Settings,
  ChevronDown, Check, GitMerge, HardHat,
  Megaphone, Target, UserSearch, ScrollText, UsersRound,
} from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { useApprovals } from "@/context/ApprovalContext";

const ROLE_OPTIONS: { key: "dealer" | "hq"; dot: string; label: string }[] = [
  { key: "dealer", dot: "#ECC94B", label: "Dealer · สาขา" },
  { key: "hq",     dot: "#059669", label: "HQ · สำนักงานใหญ่" },
];

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
};
type NavSeparator = { separator: true; label: string };
type NavEntry = NavItem | NavSeparator;
type NavGroup = { group: string; items: NavItem[] };

const DEALER_NAV: NavEntry[] = [
  { label: "แผงควบคุม",   href: "/dashboard",  icon: <LayoutDashboard size={15} /> },
  { label: "ผู้สนใจ",     href: "/leads",      icon: <Phone size={15} />,     badge: 6 },
  { label: "ลูกค้า",      href: "/customers",  icon: <Users size={15} /> },
  { label: "ผู้ติดต่อ",   href: "/contacts",   icon: <ContactRound size={15} /> },
  { separator: true, label: "เอกสาร" },
  { label: "ใบเสนอราคา", href: "/quotations", icon: <FileText size={15} /> },
  { label: "สัญญา",       href: "/contracts",  icon: <FileSignature size={15} /> },
  { label: "ใบแจ้งหนี้",  href: "/invoices",   icon: <Receipt size={15} /> },
  { label: "การชำระเงิน", href: "/payments",   icon: <CreditCard size={15} /> },
  { separator: true, label: "โครงการ" },
  { label: "โครงการ",     href: "/projects",   icon: <Briefcase size={15} /> },
  { label: "งาน",         href: "/tasks",      icon: <ClipboardList size={15} /> },
  { label: "รายงาน",      href: "/reports",    icon: <BarChart2 size={15} /> },
];

const HQ_NAV: NavGroup[] = [
  {
    group: "ภาพรวม",
    items: [
      { label: "แดชบอร์ด",         href: "/hq/dashboard",      icon: <LayoutDashboard size={15} /> },
      { label: "รออนุมัติ",         href: "/hq/approvals",      icon: <ShieldCheck size={15} />,    badge: 2 },
      { label: "ประกาศ/แจ้งเวียน", href: "/hq/announcements",  icon: <Megaphone size={15} /> },
    ],
  },
  {
    group: "ไปป์ไลน์",
    items: [
      { label: "ลีด",          href: "/hq/lead-pool",  icon: <Bell size={15} />,      badge: 3 },
      { label: "ไปป์ไลน์",    href: "/hq/pipeline",   icon: <GitMerge size={15} /> },
      { label: "ใบเสนอราคา",  href: "/hq/quotations", icon: <ScrollText size={15} /> },
    ],
  },
  {
    group: "งานส่งมอบ",
    items: [
      { label: "โครงการ", href: "/hq/projects", icon: <HardHat size={15} /> },
    ],
  },
  {
    group: "เครือข่ายตัวแทน",
    items: [
      { label: "ตัวแทนจำหน่าย", href: "/hq/dealers",   icon: <Store size={15} /> },
      { label: "ลูกค้า",         href: "/hq/customers", icon: <UserSearch size={15} /> },
    ],
  },
  {
    group: "วิเคราะห์",
    items: [
      { label: "การเงิน",          href: "/hq/finance", icon: <DollarSign size={15} /> },
      { label: "รายงาน",           href: "/reports",    icon: <BarChart2 size={15} /> },
      { label: "เป้าหมายการขาย",  href: "/hq/targets", icon: <Target size={15} /> },
    ],
  },
  {
    group: "จัดการ",
    items: [
      { label: "ศูนย์ติดตามงาน", href: "/tasks",      icon: <ClipboardList size={15} /> },
      { label: "ทีมงาน",          href: "/team",       icon: <UsersRound size={15} /> },
      { label: "ราคากลาง",        href: "/hq/master",  icon: <Package size={15} /> },
      { label: "ตั้งค่า",         href: "/settings",   icon: <Settings size={15} /> },
    ],
  },
];

// ── Light theme (matches design-system template .ds-sidebar) ──
const SIDEBAR_BG   = "#ffffff";
const SIDE_BORDER  = "#e5e7eb";
const PRIMARY      = "#003366";
const ACTIVE_BG    = "#e9eef6";   // light CI-blue tint (accent)
const HOVER_BG     = "#f5f6f8";   // muted
const ACTIVE_COL   = "#003366";
const INACTIVE_COL = "#475569";   // readable slate on white
const MUTED        = "#9ca3af";

function navLinkStyle(active: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "9px 12px",
    borderRadius: 10,
    fontSize: "0.82rem",
    fontWeight: active ? 700 : 500,
    color: active ? ACTIVE_COL : INACTIVE_COL,
    background: active ? ACTIVE_BG : "transparent",
    boxShadow: "none",
    textDecoration: "none",
    marginBottom: 2,
    cursor: "pointer",
    border: "none",
    width: "100%",
    textAlign: "left",
    transition: "background .12s, color .12s",
  };
}

function hoverIn(el: HTMLElement) {
  el.style.background = HOVER_BG;
  el.style.color = PRIMARY;
}
function hoverOut(el: HTMLElement, active: boolean) {
  el.style.background = active ? ACTIVE_BG : "transparent";
  el.style.color = active ? ACTIVE_COL : INACTIVE_COL;
}

function Badge({ n }: { n: number }) {
  return (
    <span style={{
      marginLeft: "auto",
      fontSize: "0.58rem",
      fontWeight: 700,
      borderRadius: 99,
      padding: "2px 6px",
      background: "#dc2626",
      color: "#fff",
      lineHeight: 1,
    }}>{n}</span>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isHQ, currentKey, switchSession } = useRole();
  const { pendingCount } = useApprovals();
  const [roleOpen, setRoleOpen] = useState(false);

  // Pre-warm both role dashboards so switching feels instant
  useEffect(() => {
    router.prefetch("/hq/dashboard");
    router.prefetch("/dashboard");
  }, [router]);

  function handleSwitch(key: "hq" | "dealer") {
    setRoleOpen(false);
    if (key !== currentKey) {
      switchSession(key);
      router.push(key === "hq" ? "/hq/dashboard" : "/dashboard");
    }
  }

  return (
    <aside style={{
      width: 214, display: "flex", flexDirection: "column",
      height: "100vh", background: SIDEBAR_BG, flexShrink: 0, overflowY: "auto",
      borderRight: `1px solid ${SIDE_BORDER}`,
    }}>

      {/* Brand */}
      <div style={{ padding: "18px 16px 14px" }}>
        {/* Logo icon + BENJAMIN text */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9, flexShrink: 0, overflow: "hidden",
            background: PRIMARY,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* asset is a navy mark on transparent bg; invert to white so it shows on the navy chip */}
            <img src="/benjamin-logo-white.png" alt="Benjamin" style={{ width: 28, height: 28, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          </div>
          <div>
            <div style={{ fontWeight: 900, color: PRIMARY, fontSize: "0.9rem", letterSpacing: "0.04em", lineHeight: 1 }}>
              BENJAMIN
            </div>
            <div style={{ fontSize: "0.52rem", color: MUTED, fontWeight: 500,
              letterSpacing: "0.06em", marginTop: 2 }}>
              PRE-ENGINEERED BUILDING
            </div>
          </div>
        </div>
        {/* Role switcher dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setRoleOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 6, width: "100%",
              background: HOVER_BG, borderRadius: 8, padding: "6px 10px",
              border: `1px solid ${SIDE_BORDER}`, cursor: "pointer", textAlign: "left",
              transition: "background .12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#eef0f4"; }}
            onMouseLeave={e => { e.currentTarget.style.background = HOVER_BG; }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: isHQ ? "#059669" : "#ECC94B" }} />
            <span style={{ fontSize: "0.64rem", color: INACTIVE_COL, fontWeight: 600, flex: 1 }}>
              {isHQ ? "HQ · สำนักงานใหญ่" : "Dealer · สาขา"}
            </span>
            <ChevronDown size={13} style={{ color: MUTED, flexShrink: 0,
              transform: roleOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
          </button>

          {roleOpen && (
            <>
              {/* click-outside backdrop */}
              <div onClick={() => setRoleOpen(false)}
                style={{ position: "fixed", inset: 0, zIndex: 40 }} />
              {/* menu */}
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
                background: "#fff", borderRadius: 10, padding: 4,
                border: `1px solid ${SIDE_BORDER}`,
                boxShadow: "0 12px 32px rgba(0,0,0,.12)",
              }}>
                {ROLE_OPTIONS.map(opt => {
                  const active = currentKey === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSwitch(opt.key)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8, width: "100%",
                        padding: "8px 10px", borderRadius: 7, border: "none", cursor: "pointer",
                        textAlign: "left", transition: "background .12s",
                        background: active ? ACTIVE_BG : "transparent",
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = HOVER_BG; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: opt.dot }} />
                      <span style={{ fontSize: "0.72rem", flex: 1,
                        color: active ? PRIMARY : INACTIVE_COL, fontWeight: active ? 700 : 500 }}>
                        {opt.label}
                      </span>
                      {active && <Check size={13} style={{ color: PRIMARY, flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: SIDE_BORDER, margin: "0 14px 8px" }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: "4px 10px 8px", display: "flex", flexDirection: "column" }}>

        {/* DEALER NAV */}
        {!isHQ && DEALER_NAV.map((entry, idx) => {
          if ("separator" in entry) {
            return (
              <div key={`sep-${idx}`} style={{ margin: "10px 4px 6px" }}>
                <span style={{
                  fontSize: "0.59rem", fontWeight: 600,
                  color: MUTED,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  padding: "0 4px",
                }}>
                  {entry.label}
                </span>
              </div>
            );
          }

          const item = entry as NavItem;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={navLinkStyle(active)}
              onMouseEnter={e => { if (!active) hoverIn(e.currentTarget as HTMLElement); }}
              onMouseLeave={e => { if (!active) hoverOut(e.currentTarget as HTMLElement, active); }}
            >
              <span style={{ flexShrink: 0, opacity: active ? 1 : 0.75 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge ? <Badge n={item.badge} /> : null}
            </Link>
          );
        })}

        {/* HQ NAV */}
        {isHQ && HQ_NAV.map(group => (
          <div key={group.group} style={{ marginBottom: 10 }}>
            <p style={{
              fontSize: "0.59rem", fontWeight: 600, color: MUTED,
              textTransform: "uppercase", letterSpacing: "0.08em",
              padding: "0 12px", marginBottom: 4,
            }}>
              {group.group}
            </p>
            {group.items.map(item => {
              const active = pathname === item.href;
              const badge = item.href === "/hq/approvals" ? pendingCount : item.badge;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={navLinkStyle(active)}
                  onMouseEnter={e => { if (!active) hoverIn(e.currentTarget as HTMLElement); }}
                  onMouseLeave={e => { if (!active) hoverOut(e.currentTarget as HTMLElement, false); }}
                >
                  <span style={{ flexShrink: 0, opacity: active ? 1 : 0.75 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {badge ? <Badge n={badge} /> : null}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ paddingBottom: 16 }} />
    </aside>
  );
}
