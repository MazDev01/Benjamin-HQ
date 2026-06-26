"use client";

import { useState, useMemo } from "react";
import { hqAllQuotations, HQQuotation } from "@/lib/mock";
import {
  Search,
  FileText,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

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

function fmtM(n: number): string {
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `฿${(n / 1_000).toFixed(0)}K`;
  return `฿${n.toLocaleString()}`;
}

const STATUS_META: Record<
  HQQuotation["status"],
  { label: string; bg: string; color: string }
> = {
  draft: { label: "ร่าง", bg: "#f0f0f5", color: "#6b7280" },
  sent: { label: "ส่งแล้ว", bg: "#dce5f0", color: "#003366" },
  won: { label: "ชนะ ✓", bg: "#e5faf0", color: "#059669" },
  lost: { label: "แพ้", bg: "#fee2e2", color: "#dc2626" },
  pending_approval: { label: "รออนุมัติ", bg: "#fef3cd", color: "#d97706" },
};

const STATUS_ORDER: Record<HQQuotation["status"], number> = {
  pending_approval: 0,
  draft: 1,
  sent: 2,
  won: 3,
  lost: 4,
};

const ALL_DEALERS = Array.from(
  new Map(
    hqAllQuotations.map((q) => [q.dealerCode, q.dealerName])
  ).entries()
).sort((a, b) => a[0].localeCompare(b[0]));

const ALL_PRODUCT_LINES = Array.from(
  new Set(hqAllQuotations.map((q) => q.productLine))
).sort();

const STATUS_OPTIONS: { value: HQQuotation["status"] | "all"; label: string }[] = [
  { value: "all", label: "ทุกสถานะ" },
  { value: "pending_approval", label: "รออนุมัติ" },
  { value: "draft", label: "ร่าง" },
  { value: "sent", label: "ส่งแล้ว" },
  { value: "won", label: "ชนะ" },
  { value: "lost", label: "แพ้" },
];

export default function HQQuotationsPage() {
  const [search, setSearch] = useState("");
  const [dealerFilter, setDealerFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<HQQuotation["status"] | "all">("all");
  const [productFilter, setProductFilter] = useState<string>("all");

  const stats = useMemo(() => {
    const total = hqAllQuotations.length;
    const totalValue = hqAllQuotations.reduce((s, q) => s + q.valueNum, 0);
    const won = hqAllQuotations.filter((q) => q.status === "won").length;
    const lost = hqAllQuotations.filter((q) => q.status === "lost").length;
    const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;
    const pendingApproval = hqAllQuotations.filter(
      (q) => q.status === "pending_approval"
    ).length;
    return { total, totalValue, winRate, pendingApproval };
  }, []);

  const filtered = useMemo(() => {
    let list = [...hqAllQuotations];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.quoteNo.toLowerCase().includes(q) ||
          r.customer.toLowerCase().includes(q)
      );
    }
    if (dealerFilter !== "all") {
      list = list.filter((r) => r.dealerCode === dealerFilter);
    }
    if (statusFilter !== "all") {
      list = list.filter((r) => r.status === statusFilter);
    }
    if (productFilter !== "all") {
      list = list.filter((r) => r.productLine === productFilter);
    }

    list.sort((a, b) => {
      const so = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (so !== 0) return so;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [search, dealerFilter, statusFilter, productFilter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <h1
          style={{
            fontSize: "1.35rem",
            fontWeight: 800,
            color: PRIMARY,
            margin: 0,
          }}
        >
          ใบเสนอราคาทั้งเครือ
        </h1>
        <p style={{ fontSize: "0.82rem", color: MUTED, margin: "2px 0 0" }}>
          ติดตามใบเสนอราคาทุกสาขาในเครือ
        </p>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
        }}
      >
        {/* Total */}
        <div style={{ ...CARD, padding: "16px 18px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <FileText size={15} color={PRIMARY} strokeWidth={2} />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: MUTED,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              ทั้งหมด
            </span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: PRIMARY }}>
            {stats.total}
          </div>
          <div style={{ fontSize: "0.72rem", color: MUTED }}>ใบเสนอราคา</div>
        </div>

        {/* Total Value */}
        <div style={{ ...CARD, padding: "16px 18px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <TrendingUp size={15} color={GREEN} strokeWidth={2} />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: MUTED,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              มูลค่ารวม
            </span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: GREEN }}>
            {fmtM(stats.totalValue)}
          </div>
          <div style={{ fontSize: "0.72rem", color: MUTED }}>มูลค่าทั้งหมด</div>
        </div>

        {/* Win Rate */}
        <div style={{ ...CARD, padding: "16px 18px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <CheckCircle2 size={15} color={PRIMARY} strokeWidth={2} />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: MUTED,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Win Rate
            </span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: PRIMARY }}>
            {stats.winRate}%
          </div>
          <div style={{ fontSize: "0.72rem", color: MUTED }}>
            อัตราชนะต่อปิด
          </div>
        </div>

        {/* Pending Approval */}
        <div
          style={{
            ...CARD,
            padding: "16px 18px",
            border:
              stats.pendingApproval > 0
                ? `1px solid #fca5a5`
                : `1px solid ${BORDER}`,
            background: stats.pendingApproval > 0 ? "#fff9f9" : "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <AlertTriangle
              size={15}
              color={stats.pendingApproval > 0 ? RED : MUTED}
              strokeWidth={2}
            />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: stats.pendingApproval > 0 ? RED : MUTED,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              รออนุมัติ
            </span>
          </div>
          <div
            style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              color: stats.pendingApproval > 0 ? RED : STEEL,
            }}
          >
            {stats.pendingApproval}
          </div>
          <div style={{ fontSize: "0.72rem", color: MUTED }}>
            รายการรอการอนุมัติ
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
          <Search
            size={14}
            color={MUTED}
            strokeWidth={2}
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            placeholder="ค้นหาเลขที่ / ลูกค้า..."
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

        {/* Dealer Filter */}
        <select
          value={dealerFilter}
          onChange={(e) => setDealerFilter(e.target.value)}
          style={{
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: "8px 12px",
            fontSize: "0.82rem",
            outline: "none",
            background: "#fff",
            color: STEEL,
            cursor: "pointer",
          }}
        >
          <option value="all">ทุกสาขา</option>
          {ALL_DEALERS.map(([code, name]) => (
            <option key={code} value={code}>
              {code} – {name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as HQQuotation["status"] | "all")
          }
          style={{
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: "8px 12px",
            fontSize: "0.82rem",
            outline: "none",
            background: "#fff",
            color: STEEL,
            cursor: "pointer",
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Product Line Filter */}
        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          style={{
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: "8px 12px",
            fontSize: "0.82rem",
            outline: "none",
            background: "#fff",
            color: STEEL,
            cursor: "pointer",
          }}
        >
          <option value="all">ทุก Product Line</option>
          {ALL_PRODUCT_LINES.map((pl) => (
            <option key={pl} value={pl}>
              {pl}
            </option>
          ))}
        </select>

        <span style={{ fontSize: "0.78rem", color: MUTED, whiteSpace: "nowrap" }}>
          แสดง {filtered.length} / {hqAllQuotations.length} รายการ
        </span>
      </div>

      {/* Table */}
      <div style={{ ...CARD, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "เลขที่",
                  "ลูกค้า",
                  "สาขา",
                  "สาย Product",
                  "มูลค่า",
                  "ส่วนลด",
                  "พนักงานขาย",
                  "วันที่",
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
                      padding: "32px 14px",
                      fontSize: "0.82rem",
                      color: MUTED,
                    }}
                  >
                    ไม่พบข้อมูลที่ค้นหา
                  </td>
                </tr>
              ) : (
                filtered.map((q, idx) => {
                  const sm = STATUS_META[q.status];
                  const discountColor =
                    q.discountPct >= 10
                      ? RED
                      : q.discountPct >= 5
                      ? AMBER
                      : MUTED;

                  return (
                    <tr
                      key={q.id}
                      style={{
                        background:
                          q.status === "pending_approval"
                            ? "#fffbf0"
                            : idx % 2 === 0
                            ? "#fff"
                            : "#fafbfc",
                      }}
                    >
                      {/* Quote No */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: PRIMARY,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {q.quoteNo}
                      </td>

                      {/* Customer */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: STEEL,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          maxWidth: 180,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {q.customer}
                      </td>

                      {/* Dealer */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: STEEL,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            background: "#eef2f7",
                            color: PRIMARY,
                          }}
                        >
                          {q.dealerCode}
                        </span>
                        <span
                          style={{
                            marginLeft: 6,
                            fontSize: "0.75rem",
                            color: MUTED,
                          }}
                        >
                          {q.dealerName}
                        </span>
                      </td>

                      {/* Product Line */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: STEEL,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {q.productLine}
                      </td>

                      {/* Value */}
                      <td
                        style={{
                          fontSize: "0.82rem",
                          color: PRIMARY,
                          fontWeight: 800,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fmtM(q.valueNum)}
                      </td>

                      {/* Discount */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: discountColor,
                          fontWeight: q.discountPct >= 5 ? 700 : 400,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {q.discountPct}%
                      </td>

                      {/* Salesperson */}
                      <td
                        style={{
                          fontSize: "0.8rem",
                          color: STEEL,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {q.salesperson}
                      </td>

                      {/* Date */}
                      <td
                        style={{
                          fontSize: "0.78rem",
                          color: MUTED,
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(q.createdAt).toLocaleDateString("th-TH", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })}
                      </td>

                      {/* Status Badge */}
                      <td
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid #f0f4f8",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: 99,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            background: sm.bg,
                            color: sm.color,
                          }}
                        >
                          {sm.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
