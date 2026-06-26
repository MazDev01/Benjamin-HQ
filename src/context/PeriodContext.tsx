"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export const PERIOD_OPTIONS = [
  { key: "jun-2026", label: "มิ.ย. 2026",  subtitle: "มิถุนายน 2026",                    factor: 1.00 },
  { key: "may-2026", label: "พ.ค. 2026",   subtitle: "พฤษภาคม 2026",                     factor: 0.94 },
  { key: "q2-2026",  label: "Q2/2026",      subtitle: "ไตรมาส 2 · เม.ย.–มิ.ย. 2026",     factor: 2.78 },
  { key: "q1-2026",  label: "Q1/2026",      subtitle: "ไตรมาส 1 · ม.ค.–มี.ค. 2026",      factor: 2.43 },
  { key: "ytd-2026", label: "YTD 2026",     subtitle: "ม.ค.–มิ.ย. 2026 (6 เดือน)",        factor: 5.24 },
  { key: "fy-2025",  label: "ปี 2025",      subtitle: "ทั้งปี 2025 (เปรียบเทียบ)",         factor: 9.60 },
] as const;

export type PeriodKey = (typeof PERIOD_OPTIONS)[number]["key"];
export type Period = (typeof PERIOD_OPTIONS)[number];

type Ctx = { period: Period; setPeriodKey: (k: PeriodKey) => void };
const PeriodContext = createContext<Ctx | null>(null);

export function PeriodProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState<PeriodKey>("jun-2026");
  const period = PERIOD_OPTIONS.find(p => p.key === key)!;
  return (
    <PeriodContext.Provider value={{ period, setPeriodKey: setKey }}>
      {children}
    </PeriodContext.Provider>
  );
}

export function usePeriod() {
  const ctx = useContext(PeriodContext);
  if (!ctx) throw new Error("usePeriod must be inside PeriodProvider");
  return ctx;
}
