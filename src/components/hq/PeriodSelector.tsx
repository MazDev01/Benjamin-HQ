"use client";

import { usePeriod, PERIOD_OPTIONS, type PeriodKey } from "@/context/PeriodContext";
import { CalendarDays, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const GROUPS = [
  { label: "รายเดือน",   keys: ["jun-2026", "may-2026"] },
  { label: "รายไตรมาส", keys: ["q2-2026",  "q1-2026"]  },
  { label: "รายปี",      keys: ["ytd-2026", "fy-2025"]  },
] as const;

export function PeriodSelector() {
  const { period, setPeriodKey } = usePeriod();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#fff", border: "1px solid #d1d5db", borderRadius: 9,
          padding: "7px 13px", boxShadow: "0 1px 4px rgba(0,0,0,.07)",
          cursor: "pointer", outline: "none", transition: "border-color .15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#003366")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "#d1d5db")}
      >
        <CalendarDays size={14} style={{ color: "#6b7280", flexShrink: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}>
          <span style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500 }}>ช่วงเวลา</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#003366", whiteSpace: "nowrap" }}>
            {period.subtitle}
          </span>
        </div>
        <ChevronDown
          size={14}
          style={{
            color: "#9ca3af", flexShrink: 0, marginLeft: 2,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .2s",
          }}
        />
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0,
          background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
          boxShadow: "0 8px 28px rgba(0,0,0,.13)", minWidth: 230,
          zIndex: 50, overflow: "hidden",
        }}>
          {GROUPS.map((group, gi) => (
            <div key={gi}>
              <div style={{
                padding: "10px 16px 4px",
                fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af",
                letterSpacing: "0.06em", textTransform: "uppercase",
                borderTop: gi > 0 ? "1px solid #f3f4f6" : "none",
              }}>
                {group.label}
              </div>
              {group.keys.map(key => {
                const opt = PERIOD_OPTIONS.find(p => p.key === key)!;
                const selected = period.key === key;
                return (
                  <button
                    key={key}
                    onClick={() => { setPeriodKey(key as PeriodKey); setOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", padding: "9px 16px",
                      background: selected ? "#eff6ff" : "transparent",
                      border: "none", cursor: "pointer", textAlign: "left",
                      transition: "background .12s",
                    }}
                    onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "#f9fafb"; }}
                    onMouseLeave={e => { if (!selected) e.currentTarget.style.background = "transparent"; }}
                  >
                    <Check
                      size={14}
                      style={{ color: selected ? "#003366" : "transparent", flexShrink: 0 }}
                    />
                    <div>
                      <div style={{
                        fontSize: "0.82rem", fontWeight: selected ? 700 : 400,
                        color: selected ? "#003366" : "#374151",
                        lineHeight: 1.3,
                      }}>
                        {opt.subtitle}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: 1 }}>
                        {opt.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
