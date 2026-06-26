"use client";

import { hqKpis, hqSalesByMonth } from "@/lib/mock";
import { KpiCard } from "@/components/ui/KpiCard";
import { LineChartCard } from "@/components/ui/LineChart";
import { LeaderboardCard } from "@/components/hq/LeaderboardCard";
import { LeadPoolWidget } from "@/components/hq/LeadPoolWidget";
import { ApprovalWidget } from "@/components/hq/ApprovalWidget";
import { ProjectHealthWidget } from "@/components/hq/ProjectHealthWidget";
import { ServiceLineWidget } from "@/components/hq/ServiceLineWidget";
import { ActivityFeed } from "@/components/hq/ActivityFeed";
import { PeriodSelector } from "@/components/hq/PeriodSelector";
import { AlertBanner } from "@/components/hq/AlertBanner";
import { DealSummaryStrip } from "@/components/hq/DealSummaryStrip";
import { usePeriod } from "@/context/PeriodContext";

function scaledKpis(factor: number) {
  return hqKpis.map(k => {
    const cur  = Math.round(k.currentNum * factor * 10) / 10;
    const tgt  = Math.round(k.targetNum  * factor * 10) / 10;
    const val  = k.unit === "M"  ? `฿${cur}M`
               : k.unit === "%" ? `${cur}%`
               : `${cur}`;
    return { ...k, currentNum: cur, targetNum: tgt, value: val, targetLabel: `฿${tgt}M` };
  });
}

export default function HQDashboardPage() {
  const { period } = usePeriod();
  const kpis = scaledKpis(period.factor);

  const scaledSales = hqSalesByMonth.map(d => ({
    ...d,
    value:     Math.round(d.value     * period.factor * 10) / 10,
    prevValue: d.prevValue ? Math.round(d.prevValue * period.factor * 10) / 10 : undefined,
  }));

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "1.55rem", fontWeight: 800, color: "#2D2D2D", marginBottom: 3 }}>แดชบอร์ด HQ</h1>
          <p style={{ fontSize: "0.76rem", color: "#6b7280" }}>สรุปภาพรวมทั้งเครือ · {period.subtitle}</p>
        </div>
        <PeriodSelector />
      </div>

      {/* Alert banner */}
      <AlertBanner />

      {/* Deal summary strip */}
      <DealSummaryStrip />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <KpiCard key={k.key} label={k.label} value={k.value} delta={k.delta} icon={k.icon}
            currentNum={k.currentNum} targetNum={k.targetNum} targetLabel={k.targetLabel} />
        ))}
      </div>

      {/* Revenue chart — full-width hero (matches reference layout) */}
      <LineChartCard
        data={scaledSales}
        title="ยอดขายรวมทั้งเครือ รายเดือน"
        subtitle="มูลค่าทุกสาขารวมกัน (ล้านบาท)"
        target={Math.round(22 * period.factor * 10) / 10}
      />

      {/* Main content + right rail — balanced, no stretched voids */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5" style={{ alignItems: "start" }}>
        {/* Main column: action cards + service-line breakdown */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ alignItems: "start" }}>
            <LeadPoolWidget />
            <ApprovalWidget />
            <ProjectHealthWidget />
          </div>
          <ServiceLineWidget />
        </div>

        {/* Right rail: ranking + activity feed (both tall list cards) */}
        <div className="space-y-5">
          <LeaderboardCard />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
