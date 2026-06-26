"use client";

import { useState, useMemo } from "react";
import { hqAllCustomers, HQCustomer } from "@/lib/mock";
import { Search, Users, Building2, Landmark, User } from "lucide-react";

const PRIMARY = "#003366";
const STEEL = "#2D2D2D";
const BORDER = "#e5e7eb";
const MUTED = "#6b7280";
const GREEN = "#059669";

const CARD: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: `1px solid ${BORDER}`,
  boxShadow: "0 2px 14px rgba(0,0,0,.07)",
};

function fmtM(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("th-TH");
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div style={{ ...CARD, padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: color + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            color: MUTED,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </span>
      </div>
      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: STEEL }}>{value}</div>
    </div>
  );
}

type TypeBadgeConfig = {
  bg: string;
  color: string;
};

const typeBadgeMap: Record<HQCustomer["type"], TypeBadgeConfig> = {
  บริษัท: { bg: "#dce5f0", color: "#003366" },
  "หจก.": { bg: "#fef3cd", color: "#92400e" },
  บุคคล: { bg: "#f0f0f5", color: "#4b5563" },
  หน่วยงานรัฐ: { bg: "#e5faf0", color: "#065f46" },
};

const segmentBadgeMap: Record<HQCustomer["segment"], TypeBadgeConfig> = {
  enterprise: { bg: "#dce5f0", color: "#003366" },
  sme: { bg: "#fef3cd", color: "#92400e" },
  government: { bg: "#e5faf0", color: "#065f46" },
};

const segmentLabel: Record<HQCustomer["segment"], string> = {
  enterprise: "Enterprise",
  sme: "SME",
  government: "Gov",
};

export default function HQCustomersPage() {
  const [search, setSearch] = useState("");
  const [dealerFilter, setDealerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const enterpriseCount = hqAllCustomers.filter((c) => c.segment === "enterprise").length;
  const smeCount = hqAllCustomers.filter((c) => c.segment === "sme").length;
  const govCount = hqAllCustomers.filter((c) => c.segment === "government").length;

  const dealerOptions = useMemo(() => {
    const seen = new Map<string, string>();
    hqAllCustomers.forEach((c) => {
      if (!seen.has(c.dealerCode)) seen.set(c.dealerCode, c.dealerName);
    });
    return Array.from(seen.entries()).map(([code, name]) => ({ code, name }));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return hqAllCustomers
      .filter((c) => {
        if (q && !c.name.toLowerCase().includes(q) && !c.province.toLowerCase().includes(q))
          return false;
        if (dealerFilter !== "all" && c.dealerCode !== dealerFilter) return false;
        if (statusFilter !== "all" && c.status !== statusFilter) return false;
        return true;
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [search, dealerFilter, statusFilter]);

  const selectStyle: React.CSSProperties = {
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: "0.82rem",
    outline: "none",
    background: "#fff",
    color: STEEL,
    cursor: "pointer",
  };

  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.35rem", fontWeight: 800, color: STEEL, margin: 0 }}>
          ลูกค้าทั้งเครือ
        </h1>
        <p style={{ fontSize: "0.82rem", color: MUTED, margin: "4px 0 0" }}>
          ฐานข้อมูลลูกค้าทุกสาขา
        </p>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <StatCard
          icon={<Users size={16} color={PRIMARY} strokeWidth={2} />}
          label="ลูกค้าทั้งหมด"
          value={hqAllCustomers.length}
          color={PRIMARY}
        />
        <StatCard
          icon={<Building2 size={16} color={PRIMARY} strokeWidth={2} />}
          label="Enterprise"
          value={enterpriseCount}
          color={PRIMARY}
        />
        <StatCard
          icon={<User size={16} color="#d97706" strokeWidth={2} />}
          label="SME"
          value={smeCount}
          color="#d97706"
        />
        <StatCard
          icon={<Landmark size={16} color={GREEN} strokeWidth={2} />}
          label="หน่วยงานรัฐ"
          value={govCount}
          color={GREEN}
        />
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
          <Search
            size={14}
            color={MUTED}
            strokeWidth={2}
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า หรือจังหวัด..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: "8px 12px 8px 32px",
              fontSize: "0.82rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <select
          value={dealerFilter}
          onChange={(e) => setDealerFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="all">ทุกสาขา</option>
          {dealerOptions.map((d) => (
            <option key={d.code} value={d.code}>
              {d.code} — {d.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "active" | "inactive")
          }
          style={selectStyle}
        >
          <option value="all">ทั้งหมด</option>
          <option value="active">ใช้งาน</option>
          <option value="inactive">ไม่ใช้งาน</option>
        </select>
      </div>

      {/* Table Card */}
      <div style={{ ...CARD, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "ลูกค้า",
                  "ประเภท",
                  "สาขา",
                  "จังหวัด",
                  "Segment",
                  "ดีลที่ชนะ",
                  "มูลค่ารวม",
                  "ติดต่อล่าสุด",
                  "สถานะ",
                ].map((col) => (
                  <th
                    key={col}
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: MUTED,
                      padding: "8px 14px",
                      background: "#fafafa",
                      borderBottom: `1px solid ${BORDER}`,
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      textAlign: "center",
                      padding: "40px 14px",
                      fontSize: "0.85rem",
                      color: MUTED,
                    }}
                  >
                    ไม่พบลูกค้า
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const typeCfg = typeBadgeMap[c.type];
                  const segCfg = segmentBadgeMap[c.segment];
                  return (
                    <tr key={c.id} style={{ transition: "background 0.15s" }}>
                      {/* ลูกค้า */}
                      <td
                        style={{
                          fontSize: "0.82rem",
                          color: STEEL,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.name}
                      </td>

                      {/* ประเภท */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: STEEL,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: 99,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            background: typeCfg.bg,
                            color: typeCfg.color,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {c.type}
                        </span>
                      </td>

                      {/* สาขา */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: STEEL,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span style={{ fontWeight: 600, color: PRIMARY }}>{c.dealerCode}</span>
                        <span style={{ color: MUTED, marginLeft: 4, fontSize: "0.75rem" }}>
                          {c.dealerName}
                        </span>
                      </td>

                      {/* จังหวัด */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: STEEL,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.province}
                      </td>

                      {/* Segment */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: STEEL,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: 99,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            background: segCfg.bg,
                            color: segCfg.color,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {segmentLabel[c.segment]}
                        </span>
                      </td>

                      {/* ดีลที่ชนะ */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: STEEL,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          textAlign: "center",
                        }}
                      >
                        {c.dealsWon}
                      </td>

                      {/* มูลค่ารวม */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          whiteSpace: "nowrap",
                          fontWeight: c.totalRevenue > 0 ? 700 : 400,
                          color: c.totalRevenue > 0 ? PRIMARY : MUTED,
                        }}
                      >
                        {c.totalRevenue > 0 ? fmtM(c.totalRevenue) : "-"}
                      </td>

                      {/* ติดต่อล่าสุด */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: MUTED,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.lastContact}
                      </td>

                      {/* สถานะ */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: STEEL,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                        }}
                      >
                        {c.status === "active" ? (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 10px",
                              borderRadius: 99,
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              background: "#d1fae5",
                              color: "#065f46",
                            }}
                          >
                            ใช้งาน
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 10px",
                              borderRadius: 99,
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              background: "#f3f4f6",
                              color: "#6b7280",
                            }}
                          >
                            ไม่ใช้งาน
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div
            style={{
              padding: "10px 16px",
              borderTop: `1px solid ${BORDER}`,
              fontSize: "0.75rem",
              color: MUTED,
              background: "#fafafa",
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}
          >
            แสดง {filtered.length} รายการ จากทั้งหมด {hqAllCustomers.length} ลูกค้า
          </div>
        )}
      </div>
    </div>
  );
}
