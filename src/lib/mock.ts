// Mock data สำหรับ frontend (ยังไม่เชื่อม backend)
// ─── ROLE / SESSION ───────────────────────────────────────────
export type UserRole =
  | "SUPER_ADMIN"
  | "HQ_MANAGEMENT"
  | "HQ_STAFF"
  | "DEALER_ADMIN"
  | "DEALER_SALES"
  | "DEALER_SITE";

export type MockSession = {
  name: string;
  role: UserRole;
  dealerName: string;
  scopeAll: boolean; // true = HQ เห็นทุก dealer
};

export const sessions: Record<string, MockSession> = {
  hq: {
    name: "วิชัย ประสิทธิ์",
    role: "HQ_MANAGEMENT",
    dealerName: "Benjamin HQ",
    scopeAll: true,
  },
  dealer: {
    name: "สมชาย เชียงใหม่",
    role: "DEALER_ADMIN",
    dealerName: "Benjamin สาขาเชียงใหม่",
    scopeAll: false,
  },
};


// โครงสร้างอ้างอิง prisma/schema.prisma

export type LeadStatus =
  | "NEW"
  | "WAITING"
  | "BULLET"
  | "QUOTED"
  | "PAID"
  | "CANCELLED";

export const leadStatusLabel: Record<LeadStatus, string> = {
  NEW:       "รับลีดใหม่",
  WAITING:   "สำรวจหน้างาน",
  BULLET:    "ออกแบบ & คิดราคา",
  QUOTED:    "เสนอราคาแล้ว",
  PAID:      "ปิดดีล",
  CANCELLED: "เสียดีล",
};

export const leadStatusColor: Record<LeadStatus, { bg: string; text: string }> = {
  NEW:       { bg: "#f0f0f5",  text: "#6b7280" },
  WAITING:   { bg: "#dce5f0",  text: "#003366" },
  BULLET:    { bg: "#dce5f0",  text: "#003366" },
  QUOTED:    { bg: "#dce5f0",  text: "#003366" },
  PAID:      { bg: "#e5faf0",  text: "#059669" },
  CANCELLED: { bg: "#fee2e2",  text: "#dc2626" },
};

export const kpis = [
  { key: "target", label: "เป้า vs ยอดขาย", value: "68%", delta: 10.4, icon: "target" },
  { key: "pipeline", label: "มูลค่า Pipeline", value: "฿4.2M", delta: 8.6, icon: "trending" },
  { key: "win", label: "Win Rate", value: "35%", delta: 4.2, icon: "award" },
  { key: "projects", label: "โครงการกำลังทำ", value: "5", delta: 16.4, icon: "building" },
] as const;

// ยอดขาย/ลีด รายเดือน (กราฟเส้น)
export const salesByMonth = [
  { month: "ม.ค.", value: 820 },
  { month: "ก.พ.", value: 640 },
  { month: "มี.ค.", value: 980 },
  { month: "เม.ย.", value: 1200 },
  { month: "พ.ค.", value: 760 },
  { month: "มิ.ย.", value: 1080 },
  { month: "ก.ค.", value: 900 },
  { month: "ส.ค.", value: 1320 },
];

// สัดส่วน pipeline ตามสถานะ (โดนัท)
export const pipelineBreakdown = [
  { label: "เสนอราคา", value: 58, color: "var(--color-brand-blue)" },
  { label: "ต่อรอง", value: 24, color: "var(--color-silver)" },
  { label: "อื่นๆ", value: 18, color: "var(--color-steel)" },
];

export const schedule = [
  { title: "สำรวจไซต์ — โกดังแม่สอด", time: "10:00 - 11:00", place: "แม่สอด, ตาก", kind: "survey" },
  { title: "นัดลูกค้า — CCS บางใหญ่", time: "13:30 - 14:30", place: "บางใหญ่, นนทบุรี", kind: "meet" },
];

export const upcoming = [
  { title: "ส่งมอบ — โครงการ CCS-02", date: "30 มิ.ย. 2026", who: "บจ. ซีซีเอส", kind: "handover" },
  { title: "เริ่มติดตั้ง — โกดังปากน้ำ", date: "3 ก.ค. 2026", who: "คุณสมชาย", kind: "install" },
];

export type LeadRow = {
  id: string;
  numId: number;
  name: string;
  company: string;
  contact: string;
  phone?: string;
  email?: string;
  province: string;
  product: string;
  category: string;
  status: LeadStatus;
  value: string;
  assigned: string;
  source?: string;
  note?: string;
  customerId?: number;
};

export const leads: LeadRow[] = [
  { id: "#L-40322", numId: 1, name: "บจ. ไทยสตีล", company: "บจ. ไทยสตีล", contact: "คุณสมชาย ใจดี", phone: "081-234-5678", email: "somchai@thaisteel.co.th", province: "นนทบุรี", product: "โกดัง / โชว์รูม", category: "โกดังสินค้า", status: "QUOTED", value: "฿1.2M", assigned: "สมชาย", source: "โทรเข้า", note: "ต้องการโกดัง 1,200 ตร.ม. พร้อมสำนักงาน", customerId: 1 },
  { id: "#L-40323", numId: 2, name: "บจ. ซีซีเอส", company: "บจ. ซีซีเอส", contact: "คุณกาญจนา ม.", phone: "082-345-6789", email: "kanchana@ccs.co.th", province: "เชียงใหม่", product: "อาคารสำเร็จรูป", category: "โรงงาน", status: "NEW", value: "฿480K", assigned: "วิภา", source: "เว็บไซต์", customerId: 2 },
  { id: "#L-40324", numId: 3, name: "หจก. ราชบุรีโลหะ", company: "หจก. ราชบุรีโลหะ", contact: "คุณประยุทธ ร.", phone: "083-456-7890", email: "prayut@rajburimetal.com", province: "ราชบุรี", product: "โกดัง / โชว์รูม", category: "โกดังสินค้า", status: "BULLET", value: "฿3.1M", assigned: "วิภา", source: "แนะนำ", note: "ขอต่อรองราคาค่าก่อสร้าง", customerId: 3 },
  { id: "#L-40325", numId: 4, name: "บจ. สมุทรโกดัง", company: "บจ. สมุทรโกดัง", contact: "คุณดารัล ส.", phone: "084-567-8901", email: "daran@samutwarehouse.co.th", province: "สมุทรปราการ", product: "โกดัง / โชว์รูม", category: "โกดังสินค้า", status: "WAITING", value: "฿2.0M", assigned: "สมชาย", source: "งานแสดงสินค้า", customerId: 4 },
  { id: "#L-40326", numId: 5, name: "บจ. นครสวรรค์โลหะ", company: "บจ. นครสวรรค์โลหะ", contact: "คุณวิชัย น.", phone: "085-678-9012", email: "wichai@nsmetal.co.th", province: "นครสวรรค์", product: "Main Contractor", category: "Main Contractor", status: "WAITING", value: "฿760K", assigned: "กาญจนา", source: "Facebook", customerId: 8 },
  { id: "#L-40327", numId: 6, name: "บจ. ทีทีวาย", company: "บจ. ทีทีวาย อินเตอร์", contact: "คุณวิทยา ท.", phone: "086-789-0123", email: "wittaya@ttyinter.com", province: "นครสวรรค์", product: "โกดัง / โชว์รูม", category: "โกดังสินค้า", status: "PAID", value: "฿5.4M", assigned: "สมชาย", source: "แนะนำ", note: "ปิดดีลแล้ว รอทำสัญญา" },
];

// ─── PROJECTS ─────────────────────────────────────────────────
export type ProjectStatus = "not_started" | "in_progress" | "on_hold" | "completed" | "cancelled";

export type ProjectMock = {
  id: number; title: string; client: string; status: ProjectStatus;
  progress: number; start: string; due: string; assigned: string[]; value: string;
  customerId: number;    // link to customers[]
  quotationId?: string;  // link to quotations[]
};

export const projectStatusLabel: Record<ProjectStatus, string> = {
  not_started: "ยังไม่เริ่ม", in_progress: "กำลังดำเนินการ",
  on_hold: "หยุดชั่วคราว", completed: "เสร็จแล้ว", cancelled: "ยกเลิก",
};
export const projectStatusColor: Record<ProjectStatus, { bg: string; text: string }> = {
  not_started: { bg: "#f0f0f5", text: "#6b7280" },
  in_progress:  { bg: "#dce5f0", text: "#003366" },
  on_hold:      { bg: "#fef3cd", text: "#f59e0b" },
  completed:    { bg: "#e5faf0", text: "#059669" },
  cancelled:    { bg: "#fee2e2", text: "#dc2626" },
};

export const projects: ProjectMock[] = [
  { id: 1, title: "โกดังสำเร็จรูป บจ. ไทยสตีล", client: "บจ. ไทยสตีล", status: "in_progress", progress: 65, start: "2026-04-01", due: "2026-07-31", assigned: ["สมชาย", "วิภา"], value: "฿1.8M", customerId: 1, quotationId: "Q-2026-0089" },
  { id: 2, title: "ระบบ ERP บจ. ซีซีเอส", client: "บจ. ซีซีเอส", status: "in_progress", progress: 28, start: "2026-05-15", due: "2026-08-15", assigned: ["วิชัย"], value: "฿3.2M", customerId: 2, quotationId: "Q-2026-0095" },
  { id: 3, title: "โกดังปากน้ำ พระปราชญ์", client: "คุณสมชาย", status: "not_started", progress: 0, start: "2026-07-01", due: "2026-10-31", assigned: [], value: "฿2.0M", customerId: 1, quotationId: "Q-2026-0097" },
  { id: 4, title: "โรงงาน RANBUILD นครสวรรค์", client: "บจ. นครสวรรค์โลหะ", status: "completed", progress: 100, start: "2026-01-01", due: "2026-03-31", assigned: ["สมชาย", "กาญจนา"], value: "฿5.4M", customerId: 8 },
  { id: 5, title: "โกดัง PEB ราชบุรี", client: "หจก. ราชบุรีโลหะ", status: "on_hold", progress: 40, start: "2026-03-01", due: "2026-09-01", assigned: ["วิภา"], value: "฿760K", customerId: 3, quotationId: "Q-2026-0091" },
  { id: 6, title: "EASYBUILD แม่สอด", client: "บจ. แม่สอดโลหะ", status: "in_progress", progress: 82, start: "2026-02-01", due: "2026-06-30", assigned: ["สมชาย"], value: "฿4.1M", customerId: 6 },
  { id: 7, title: "PREFAB อุตรดิตถ์", client: "บจ. อุตรดิตถ์โลหะ", status: "not_started", progress: 0, start: "2026-08-01", due: "2026-12-31", assigned: [], value: "฿2.8M", customerId: 7, quotationId: "Q-2026-0098" },
  { id: 8, title: "โกดังระยอง VCS Asia", client: "VCS Asia", status: "completed", progress: 100, start: "2025-11-01", due: "2026-02-28", assigned: ["วิชัย", "กาญจนา"], value: "฿6.2M", customerId: 5, quotationId: "Q-2026-0092" },
];

// ─── TASKS ────────────────────────────────────────────────────
export type TaskPriority = "urgent" | "high" | "normal" | "low";
export type TaskStatus = "todo" | "in_progress" | "review" | "done" | "cancelled";

export type TaskMock = {
  id: number; title: string; project: string | null; projectId: number | null;
  priority: TaskPriority; status: TaskStatus; statusTitle: string; statusColor: string;
  due: string | null; assigned: string[];
};

export const taskStatusLabel: Record<TaskStatus, string> = {
  todo: "รอดำเนินการ", in_progress: "กำลังทำ",
  review: "กำลังรีวิว", done: "เสร็จแล้ว", cancelled: "ยกเลิก",
};
export const taskStatusBadge: Record<TaskStatus, { bg: string; text: string }> = {
  todo:        { bg: "#f0f0f5", text: "#6b7280" },
  in_progress: { bg: "#dce5f0", text: "#003366" },
  review:      { bg: "#fef3cd", text: "#f59e0b" },
  done:        { bg: "#e5faf0", text: "#059669" },
  cancelled:   { bg: "#fee2e2", text: "#dc2626" },
};
export const taskPriorityColor: Record<TaskPriority, string> = {
  urgent: "#dc2626", high: "#f59e0b", normal: "#003366", low: "#6b7280",
};
export const taskPriorityLabel: Record<TaskPriority, string> = {
  urgent: "เร่งด่วน", high: "สูง", normal: "ปกติ", low: "ต่ำ",
};

export const tasks: TaskMock[] = [
  { id: 1,  title: "สำรวจไซต์ บจ. ไทยสตีล",       project: "โกดังสำเร็จรูป บจ. ไทยสตีล", projectId: 1, priority: "urgent", status: "done",        statusTitle: "เสร็จแล้ว",      statusColor: "#059669", due: "2026-06-10", assigned: ["สมชาย"] },
  { id: 2,  title: "ออกแบบโครงสร้าง Phase 1",       project: "โกดังสำเร็จรูป บจ. ไทยสตีล", projectId: 1, priority: "high",   status: "in_progress", statusTitle: "กำลังทำ",       statusColor: "#003366", due: "2026-06-30", assigned: ["วิภา", "สมชาย"] },
  { id: 3,  title: "จัดซื้อเหล็กโครงสร้าง",         project: "โกดังสำเร็จรูป บจ. ไทยสตีล", projectId: 1, priority: "high",   status: "todo",        statusTitle: "รอดำเนินการ", statusColor: "#6b7280", due: "2026-07-05", assigned: [] },
  { id: 4,  title: "นำเสนอ ERP Blueprint",            project: "ระบบ ERP บจ. ซีซีเอส",        projectId: 2, priority: "urgent", status: "review",      statusTitle: "กำลังรีวิว",   statusColor: "#f59e0b", due: "2026-06-25", assigned: ["วิชัย"] },
  { id: 5,  title: "ทดสอบระบบ module HR",             project: "ระบบ ERP บจ. ซีซีเอส",        projectId: 2, priority: "normal", status: "todo",        statusTitle: "รอดำเนินการ", statusColor: "#6b7280", due: "2026-07-15", assigned: ["วิชัย"] },
  { id: 6,  title: "ส่งมอบโครงการ RANBUILD",          project: "โรงงาน RANBUILD นครสวรรค์",   projectId: 4, priority: "normal", status: "done",        statusTitle: "เสร็จแล้ว",      statusColor: "#059669", due: "2026-03-31", assigned: ["สมชาย", "กาญจนา"] },
  { id: 7,  title: "ตรวจสอบคุณภาพงาน Phase 3",       project: "โกดัง PEB ราชบุรี",            projectId: 5, priority: "high",   status: "in_progress", statusTitle: "กำลังทำ",       statusColor: "#003366", due: "2026-07-01", assigned: ["วิภา"] },
  { id: 8,  title: "ประชุมลูกค้า แม่สอด",            project: "EASYBUILD แม่สอด",             projectId: 6, priority: "normal", status: "done",        statusTitle: "เสร็จแล้ว",      statusColor: "#059669", due: "2026-06-15", assigned: ["สมชาย"] },
  { id: 9,  title: "เตรียมเอกสารส่งมอบ EASYBUILD",   project: "EASYBUILD แม่สอด",             projectId: 6, priority: "high",   status: "in_progress", statusTitle: "กำลังทำ",       statusColor: "#003366", due: "2026-06-28", assigned: ["สมชาย"] },
  { id: 10, title: "ตรวจรับงานโครงการระยอง",         project: "โกดังระยอง VCS Asia",          projectId: 8, priority: "normal", status: "done",        statusTitle: "เสร็จแล้ว",      statusColor: "#059669", due: "2026-02-28", assigned: ["วิชัย", "กาญจนา"] },
  { id: 11, title: "อัปเดตรายงานความก้าวหน้า",        project: null,                            projectId: null, priority: "low", status: "todo",       statusTitle: "รอดำเนินการ", statusColor: "#6b7280", due: "2026-06-30", assigned: [] },
  { id: 12, title: "ประชุมทีมรายสัปดาห์",            project: null,                            projectId: null, priority: "normal", status: "in_progress", statusTitle: "กำลังทำ", statusColor: "#003366", due: "2026-06-22", assigned: ["สมชาย", "วิภา", "วิชัย"] },
  { id: 13, title: "ทบทวนสัญญา CRM",                project: "ระบบ ERP บจ. ซีซีเอส",        projectId: 2, priority: "urgent", status: "cancelled",   statusTitle: "ยกเลิก",        statusColor: "#dc2626", due: "2026-06-18", assigned: [] },
  { id: 14, title: "สรุปผลงาน Q2 2026",              project: null,                            projectId: null, priority: "high", status: "todo",       statusTitle: "รอดำเนินการ", statusColor: "#6b7280", due: "2026-06-30", assigned: [] },
];

// ─── CUSTOMERS ────────────────────────────────────────────────
export type CustomerMock = {
  id: number; name: string; company: string; phone: string; email: string;
  province: string; category: string; initials: string; color: string;
  tags: string[]; projectCount: number;
};

export const customers: CustomerMock[] = [
  { id: 1, name: "คุณสมชาย ใจดี", company: "บจ. ไทยสตีล", phone: "081-234-5678", email: "somchai@thaisteel.co.th", province: "นนทบุรี", category: "EASYBUILD", initials: "สช", color: "#003366", tags: ["VIP", "สัญญาใหม่"], projectCount: 2 },
  { id: 2, name: "คุณกาญจนา ม.", company: "บจ. ซีซีเอส", phone: "082-345-6789", email: "kanjana@ccs.co.th", province: "เชียงใหม่", category: "PREFAB", initials: "กม", color: "#059669", tags: ["ต่อเนื่อง"], projectCount: 1 },
  { id: 3, name: "คุณประยุทธ ร.", company: "หจก. ราชบุรีโลหะ", phone: "083-456-7890", email: "prayuth@rajburi.co.th", province: "ราชบุรี", category: "RANBUILD", initials: "ปร", color: "#f59e0b", tags: ["โซนตะวันตก"], projectCount: 1 },
  { id: 4, name: "คุณดารัล ส.", company: "บจ. สมุทรโกดัง", phone: "084-567-8901", email: "darat@smgodown.co.th", province: "สมุทรปราการ", category: "EASYBUILD", initials: "ดส", color: "#0891b2", tags: ["ลูกค้าเดิม"], projectCount: 2 },
  { id: 5, name: "VCS Asia (ระยอง)", company: "VCS Asia Co., Ltd.", phone: "085-678-9012", email: "vcs@vcsasia.com", province: "ระยอง", category: "RANBUILD", initials: "VC", color: "#002244", tags: ["Enterprise", "Contract"], projectCount: 3 },
  { id: 6, name: "คุณสุรัตน์ ล.", company: "บจ. แม่สอดโลหะ", phone: "086-789-0123", email: "surat@maesot.co.th", province: "ตาก", category: "EASYBUILD", initials: "สล", color: "#C0C0C0", tags: ["โซนตะวันตก"], projectCount: 1 },
  { id: 7, name: "บจ. อุตรดิตถ์โลหะ", company: "บจ. อุตรดิตถ์โลหะ", phone: "087-890-1234", email: "info@uttaradit.co.th", province: "อุตรดิตถ์", category: "RANBUILD", initials: "อต", color: "#8fa3b8", tags: ["ลีดใหม่"], projectCount: 0 },
  { id: 8, name: "บจ. นครสวรรค์โลหะ", company: "บจ. นครสวรรค์โลหะ", phone: "088-901-2345", email: "nakhon@nsloha.co.th", province: "นครสวรรค์", category: "Custom", initials: "นส", color: "#059669", tags: ["ลูกค้าเดิม", "VIP"], projectCount: 2 },
];

// ─── QUOTATIONS ───────────────────────────────────────────────
export type QuotationStatus = "draft" | "sent_to_client" | "pending_hq" | "approved" | "rejected" | "won" | "lost" | "expired";

export type QuotationMock = {
  id: string; customer: string; project: string;
  total: string; totalValue: number;
  materialCost: number;
  province: string; buildingType: string; area: number;
  status: QuotationStatus; date: string; items: number;
  customerId: number;
  projectId: number;
};

export const quotationStatusLabel: Record<QuotationStatus, string> = {
  draft: "ร่าง", sent_to_client: "ส่งลูกค้าแล้ว", pending_hq: "รอ HQ อนุมัติ",
  approved: "อนุมัติ", rejected: "ปฏิเสธ", won: "ปิดการขาย", lost: "ไม่ได้งาน", expired: "หมดอายุ",
};
export const quotationStatusColor: Record<QuotationStatus, { bg: string; text: string }> = {
  draft:          { bg: "#f0f0f5", text: "#6b7280" },
  sent_to_client: { bg: "#dce5f0", text: "#003366" },
  pending_hq:     { bg: "#fef3cd", text: "#f59e0b" },
  approved:       { bg: "#dce5f0", text: "#003366" },
  rejected:       { bg: "#fee2e2", text: "#dc2626" },
  won:            { bg: "#e5faf0", text: "#059669" },
  lost:           { bg: "#f5f5f5", text: "#9ca3af" },
  expired:        { bg: "#f5f5f5", text: "#9ca3af" },
};

export const quotations: QuotationMock[] = [
  { id: "Q-2026-0089", customer: "บจ. ไทยสตีล", project: "โกดังสำเร็จรูป บจ. ไทยสตีล", total: "฿1,800,000", totalValue: 1800000, materialCost: 1800000, province: "นนทบุรี", buildingType: "โกดังสินค้า", area: 960, status: "won", date: "2026-05-15", items: 8, customerId: 1, projectId: 1 },
  { id: "Q-2026-0091", customer: "หจก. ราชบุรีโลหะ", project: "โกดัง PEB ราชบุรี", total: "฿760,000", totalValue: 760000, materialCost: 760000, province: "ราชบุรี", buildingType: "โกดังสินค้า", area: 480, status: "sent_to_client", date: "2026-06-01", items: 5, customerId: 3, projectId: 5 },
  { id: "Q-2026-0092", customer: "VCS Asia", project: "โกดังระยอง VCS Asia", total: "฿6,200,000", totalValue: 6200000, materialCost: 6200000, province: "ระยอง", buildingType: "โรงงาน", area: 3200, status: "won", date: "2025-11-10", items: 15, customerId: 5, projectId: 8 },
  { id: "Q-2026-0095", customer: "บจ. ซีซีเอส", project: "โรงงาน PREFAB เชียงใหม่", total: "฿3,200,000", totalValue: 3200000, materialCost: 3200000, province: "เชียงใหม่", buildingType: "โรงงาน", area: 1800, status: "sent_to_client", date: "2026-06-10", items: 12, customerId: 2, projectId: 2 },
  { id: "Q-2026-0097", customer: "บจ. สมุทรโกดัง", project: "โกดังปากน้ำ พระปราชญ์", total: "฿2,000,000", totalValue: 2000000, materialCost: 2000000, province: "สมุทรปราการ", buildingType: "โกดังสินค้า", area: 1200, status: "approved", date: "2026-06-18", items: 7, customerId: 4, projectId: 3 },
  { id: "Q-2026-0098", customer: "บจ. อุตรดิตถ์โลหะ", project: "PREFAB อุตรดิตถ์", total: "฿2,800,000", totalValue: 2800000, materialCost: 2800000, province: "อุตรดิตถ์", buildingType: "โรงงาน", area: 1600, status: "draft", date: "2026-06-20", items: 9, customerId: 7, projectId: 7 },
  { id: "Q-2026-0099", customer: "บจ. นครสวรรค์โลหะ", project: "โรงงาน Custom นครสวรรค์", total: "฿5,400,000", totalValue: 5400000, materialCost: 5400000, province: "นครสวรรค์", buildingType: "โรงงาน", area: 2800, status: "won", date: "2026-04-05", items: 18, customerId: 8, projectId: 6 },
  { id: "Q-2026-0100", customer: "บจ. เชียงรายเมทัล", project: "โกดัง EASYBUILD เชียงราย", total: "฿1,500,000", totalValue: 1500000, materialCost: 1500000, province: "เชียงราย", buildingType: "โกดังสินค้า", area: 720, status: "lost", date: "2026-05-28", items: 6, customerId: 9, projectId: 9 },
];

// ─── TEAM ─────────────────────────────────────────────────────
export type TeamMock = {
  id: number; name: string; role: string; dept: string;
  initials: string; color: string; tasks: number; projects: number; phone: string;
};

export const teamRoleLabel: Record<string, string> = {
  DEALER_ADMIN: "ผู้จัดการ", DEALER_SALES: "เซลส์", DEALER_SITE: "ช่างหน้างาน",
};

export const team: TeamMock[] = [
  { id: 1, name: "สมชาย เชียงใหม่",  role: "DEALER_ADMIN", dept: "บริหาร",    initials: "สช", color: "#003366", tasks: 5, projects: 4, phone: "081-234-5678" },
  { id: 2, name: "วิภา รัตนกุล",      role: "DEALER_SALES", dept: "ขาย",       initials: "วร", color: "#059669", tasks: 3, projects: 3, phone: "082-345-6789" },
  { id: 3, name: "วิชัย ประสิทธิ์",   role: "DEALER_SITE",  dept: "ไซต์งาน",  initials: "วป", color: "#f59e0b", tasks: 4, projects: 2, phone: "083-456-7890" },
  { id: 4, name: "กาญจนา มีสุข",      role: "DEALER_SALES", dept: "ขาย",       initials: "กม", color: "#4d94d4", tasks: 2, projects: 2, phone: "084-567-8901" },
  { id: 5, name: "ประสิทธิ์ ดีงาน",   role: "DEALER_SITE",  dept: "ไซต์งาน",  initials: "ปด", color: "#002244", tasks: 1, projects: 1, phone: "085-678-9012" },
  { id: 6, name: "สุดาวรรณ สวยงาม",   role: "DEALER_SALES", dept: "ขาย",       initials: "สส", color: "#8fa3b8", tasks: 2, projects: 2, phone: "086-789-0123" },
];

// ─── HQ MOCK DATA ─────────────────────────────────────────────

// KPI รวมทั้งเครือ
export const hqKpis = [
  { key: "revenue",  label: "ยอดขายรวมเดือนนี้", value: "฿18.4M", delta: 12.3, icon: "dollar",   currentNum: 18.4, targetNum: 22,  unit: "M", targetLabel: "฿22M" },
  { key: "pipeline", label: "Pipeline รวม",       value: "฿54.2M", delta: 6.8,  icon: "trending", currentNum: 54.2, targetNum: 60,  unit: "M", targetLabel: "฿60M" },
  { key: "projects", label: "โครงการ Active",     value: "23",     delta: 16.4, icon: "building", currentNum: 23,   targetNum: 25,  unit: "",  targetLabel: "25 โครงการ" },
  { key: "ontime",   label: "On-time %",          value: "87%",    delta: -3.2, icon: "clock",    currentNum: 87,   targetNum: 90,  unit: "%", targetLabel: "90%" },
];

// สาขา Benjamin
export type DealerCredentials = { email: string; password: string };

export type DealerRow = {
  id: string;
  code: string;
  name: string;
  region: string;
  revenueActual: number;
  revenueTarget: number;
  winRate: number;
  activeProjects: number;
  onTimePct: number;
  status: "active" | "inactive";
  credentials: DealerCredentials;
};

export const dealerLeaderboard: DealerRow[] = [
  { id: "RYG", code: "RYG", name: "Benjamin สาขาระยอง",      region: "ตะวันออก", revenueActual: 5400000, revenueTarget: 6000000, winRate: 48, activeProjects: 6, onTimePct: 91, status: "active",   credentials: { email: "ryg@benjamin.co.th", password: "PEB-RYG-4821" } },
  { id: "CNX", code: "CNX", name: "Benjamin สาขาเชียงใหม่",   region: "เหนือ",    revenueActual: 4200000, revenueTarget: 6200000, winRate: 35, activeProjects: 5, onTimePct: 78, status: "active",   credentials: { email: "cnx@benjamin.co.th", password: "PEB-CNX-3317" } },
  { id: "MST", code: "MST", name: "Benjamin สาขาแม่สอด",      region: "ตะวันตก", revenueActual: 3800000, revenueTarget: 5000000, winRate: 52, activeProjects: 4, onTimePct: 85, status: "active",   credentials: { email: "mst@benjamin.co.th", password: "PEB-MST-7749" } },
  { id: "CRI", code: "CRI", name: "Benjamin สาขาเชียงราย",    region: "เหนือ",    revenueActual: 3100000, revenueTarget: 5800000, winRate: 41, activeProjects: 3, onTimePct: 72, status: "active",   credentials: { email: "cri@benjamin.co.th", password: "PEB-CRI-5563" } },
  { id: "NSN", code: "NSN", name: "Benjamin สาขานครสวรรค์",   region: "กลาง",     revenueActual: 1900000, revenueTarget: 5000000, winRate: 29, activeProjects: 2, onTimePct: 61, status: "active",   credentials: { email: "nsn@benjamin.co.th", password: "PEB-NSN-2294" } },
  { id: "HYI", code: "HYI", name: "Benjamin สาขาหาดใหญ่",    region: "ใต้",      revenueActual: 920000,  revenueTarget: 4000000, winRate: 18, activeProjects: 1, onTimePct: 0,  status: "inactive", credentials: { email: "hyi@benjamin.co.th", password: "PEB-HYI-1108" } },
];

// Lead pool กลาง (ยังไม่มอบหมาย dealer)
export type LeadPoolRow = {
  id: string;
  name: string;
  province: string;
  channel: string;
  product: string;
  value: string;
  valueNum: number;   // numeric สำหรับ sort
  createdAt: string;
  waitHours: number;  // จำนวนชั่วโมงที่รอ (ใช้คำนวณ SLA)
};

export const leadPool: LeadPoolRow[] = [
  { id: "#LP-001", name: "บจ. อุตรดิตถ์โลหะ",      province: "อุตรดิตถ์",    channel: "เว็บไซต์", product: "RANBUILD",  value: "฿2.8M", valueNum: 2800000, createdAt: "วันนี้ 09:14",    waitHours: 4  },
  { id: "#LP-002", name: "คุณพรทิพย์ ว.",            province: "ลำปาง",        channel: "LINE OA",  product: "EASYBUILD", value: "฿650K", valueNum:  650000, createdAt: "วันนี้ 08:32",    waitHours: 5  },
  { id: "#LP-003", name: "หจก. พะเยาก่อสร้าง",       province: "พะเยา",        channel: "เว็บไซต์", product: "PREFAB",    value: "฿1.1M", valueNum: 1100000, createdAt: "เมื่อวาน 17:05",  waitHours: 28 },
  { id: "#LP-004", name: "บจ. โคราชอุตสาหกรรม",      province: "นครราชสีมา",   channel: "เว็บไซต์", product: "EASYBUILD", value: "฿3.4M", valueNum: 3400000, createdAt: "เมื่อวาน 14:20",  waitHours: 45 },
  { id: "#LP-005", name: "หจก. ชลบุรีคลังสินค้า",    province: "ชลบุรี",       channel: "LINE OA",  product: "RANBUILD",  value: "฿1.9M", valueNum: 1900000, createdAt: "2 วันก่อน",       waitHours: 56 },
];

// แผนที่ จังหวัด → ภาค (ใช้แนะนำสาขาที่รับผิดชอบตอนมอบหมายลีด)
export const provinceToRegion: Record<string, string> = {
  // เหนือ
  เชียงใหม่: "เหนือ", เชียงราย: "เหนือ", ลำปาง: "เหนือ", ลำพูน: "เหนือ", พะเยา: "เหนือ",
  แพร่: "เหนือ", น่าน: "เหนือ", อุตรดิตถ์: "เหนือ", แม่ฮ่องสอน: "เหนือ",
  // กลาง
  กรุงเทพมหานคร: "กลาง", นนทบุรี: "กลาง", ปทุมธานี: "กลาง", สมุทรปราการ: "กลาง",
  สมุทรสาคร: "กลาง", นครสวรรค์: "กลาง", พระนครศรีอยุธยา: "กลาง", สุพรรณบุรี: "กลาง",
  สระบุรี: "กลาง", ลพบุรี: "กลาง", พิษณุโลก: "กลาง",
  // ตะวันออก
  ระยอง: "ตะวันออก", ชลบุรี: "ตะวันออก", จันทบุรี: "ตะวันออก", ตราด: "ตะวันออก",
  ฉะเชิงเทรา: "ตะวันออก", ปราจีนบุรี: "ตะวันออก", สระแก้ว: "ตะวันออก",
  // ตะวันตก
  ราชบุรี: "ตะวันตก", กาญจนบุรี: "ตะวันตก", เพชรบุรี: "ตะวันตก",
  ประจวบคีรีขันธ์: "ตะวันตก", ตาก: "ตะวันตก", สมุทรสงคราม: "ตะวันตก",
  // ใต้
  สงขลา: "ใต้", ภูเก็ต: "ใต้", สุราษฎร์ธานี: "ใต้", นครศรีธรรมราช: "ใต้", กระบี่: "ใต้", ตรัง: "ใต้",
  // อีสาน
  นครราชสีมา: "อีสาน", ขอนแก่น: "อีสาน", อุดรธานี: "อีสาน", อุบลราชธานี: "อีสาน", บุรีรัมย์: "อีสาน",
};

export function regionOfProvince(province: string): string {
  return provinceToRegion[province] ?? "";
}

// รออนุมัติ (ใบเสนอราคาเกินวงเงิน)
export type ApprovalRow = {
  id: string;
  quoteNo: string;
  dealer: string;
  customer: string;
  total: string;
  totalValue: number;
  discountPct: number;
  requestedAt: string;
};

export const pendingApprovals: ApprovalRow[] = [
  { id: "1", quoteNo: "Q-2026-0089", dealer: "เชียงใหม่", customer: "บจ. ไทยสตีล",      total: "฿3.2M", totalValue: 3200000, discountPct: 15, requestedAt: "2 ชม. ที่แล้ว" },
  { id: "2", quoteNo: "Q-2026-0091", dealer: "ระยอง",      customer: "หจก. ราชบุรีโลหะ", total: "฿1.8M", totalValue: 1800000, discountPct: 12, requestedAt: "5 ชม. ที่แล้ว" },
];

// รายละเอียดใบเสนอราคา (สำหรับ detail panel)
export type ApprovalLineItem = { name: string; amount: number };
export type ExceptionRecord  = { date: string; quoteNo: string; discountPct: number; outcome: "approved" | "rejected" };

export type ApprovalDetail = {
  approvalId: string;
  listPrice: number;
  costEstimate: number;
  buildingType: string;
  areaSqm: number;
  requestReason: string;
  items: ApprovalLineItem[];
  exceptionHistory: ExceptionRecord[];
};

export const approvalDetails: Record<string, ApprovalDetail> = {
  "1": {
    approvalId: "1",
    listPrice: 3764706,
    costEstimate: 2823529,
    buildingType: "โกดังสินค้า EASYBUILD",
    areaSqm: 1200,
    requestReason: "ลูกค้า VIP ต้องการต่อสัญญาระยะยาว 3 ปี คาดว่าจะมีโครงการเพิ่มอีก 2 แห่งในปีหน้า",
    items: [
      { name: "โครงสร้างเหล็ก PEB", amount: 1920000 },
      { name: "แผ่นหลังคา + ผนัง", amount: 680000 },
      { name: "งานฐานราก คอนกรีต", amount: 350000 },
      { name: "งานระบบไฟฟ้า + สาธารณูปโภค", amount: 250000 },
    ],
    exceptionHistory: [
      { date: "15 เม.ย. 2026", quoteNo: "Q-2026-0078", discountPct: 12,   outcome: "approved" },
      { date: "02 มี.ค. 2026", quoteNo: "Q-2026-0063", discountPct: 18,   outcome: "rejected" },
      { date: "20 ม.ค. 2026", quoteNo: "Q-2026-0051", discountPct: 11,   outcome: "approved" },
    ],
  },
  "2": {
    approvalId: "2",
    listPrice: 2045455,
    costEstimate: 1534091,
    buildingType: "โกดังสินค้า RANBUILD",
    areaSqm: 480,
    requestReason: "ลูกค้าต้องการปิดราคาก่อน end of quarter มีคู่แข่งเสนอราคาต่ำกว่า",
    items: [
      { name: "โครงสร้างเหล็ก PEB", amount: 1080000 },
      { name: "แผ่นหลังคา + ผนัง",  amount: 420000  },
      { name: "งานฐานราก",           amount: 200000  },
      { name: "งานระบบสาธารณูปโภค",  amount: 100000  },
    ],
    exceptionHistory: [
      { date: "01 พ.ค. 2026", quoteNo: "Q-2026-0081", discountPct: 10.5, outcome: "approved" },
    ],
  },
};

// ยอดขายรายเดือน (รวมทั้งเครือ)
export const hqSalesByMonth = [
  { month: "ม.ค.",   value: 11.4, prevValue: 9.8  },
  { month: "ก.พ.",  value: 10.3, prevValue: 11.1 },
  { month: "มี.ค.", value: 15.1, prevValue: 12.7 },
  { month: "เม.ย.", value: 19.2, prevValue: 16.0 },
  { month: "พ.ค.",  value: 13.3, prevValue: 14.4 },
  { month: "มิ.ย.", value: 18.4, prevValue: 15.2 },
  { month: "ก.ค.",  value: 14.6, prevValue: 16.5 },
  { month: "ส.ค.",  value: 22.2, prevValue: 19.0 },
];

// สรุปสุขภาพโครงการ HQ (ทั้งเครือ)
export const hqProjectSummary = {
  total: 23,
  inProgress: 14,
  onHold: 3,
  notStarted: 4,
  overdue: 2,
};

// รายได้ตามประเภทโครงการ (YTD รวมทั้งเครือ)
// ประเภทงานตามจริง: โกดัง/โชว์รูม · อาคารสำเร็จรูป · สนามกีฬา + งาน Main Contractor
export const hqServiceLineRevenue = [
  { line: "โกดัง / โชว์รูม",     value: 8900000, color: "#003366" },
  { line: "อาคารสำเร็จรูป",      value: 6200000, color: "#0a4f8c" },
  { line: "สนามกีฬา",            value: 4800000, color: "#1e6fbf" },
  { line: "Main Contractor",     value: 3200000, color: "#4d94d4" },
  { line: "Turnkey (ครบวงจร)",   value: 1800000, color: "#82b4e3" },
];

// กิจกรรมล่าสุดทั้งเครือ
export type ActivityKind = "win" | "lead" | "approve" | "assign" | "project" | "invoice";
export type ActivityItem = {
  kind: ActivityKind;
  text: string;
  branch: string;
  time: string;
};

export const hqRecentActivity: ActivityItem[] = [
  { kind: "win",     text: "ปิดงาน โกดัง VCS Asia ฿6.2M",               branch: "ระยอง",     time: "30 นาที" },
  { kind: "lead",    text: "ลีดใหม่: หจก. ชลบุรีคลังสินค้า ฿1.9M",       branch: "ส่วนกลาง",  time: "2 ชม." },
  { kind: "approve", text: "อนุมัติ Q-2026-0097 สมุทรปราการ ฿2.0M",      branch: "เชียงใหม่",  time: "3 ชม." },
  { kind: "assign",  text: "มอบหมาย LP-004 โคราช → สาขาระยอง",           branch: "ส่วนกลาง",  time: "5 ชม." },
  { kind: "project", text: "EASYBUILD แม่สอด อัปเดตความก้าวหน้า 82%",    branch: "แม่สอด",    time: "เมื่อวาน" },
  { kind: "win",     text: "ปิดงาน RANBUILD นครสวรรค์ ฿5.4M",           branch: "นครสวรรค์", time: "2 วัน" },
];

// ─── APPOINTMENTS ─────────────────────────────────────────────
export type ApptType = "survey" | "design_meet" | "presentation" | "contract_sign" | "handover" | "follow_up";
export type ApptStatus = "upcoming" | "done" | "cancelled";

export const apptTypeLabel: Record<ApptType, string> = {
  survey: "สำรวจพื้นที่",
  design_meet: "ประชุมออกแบบ",
  presentation: "นำเสนอราคา",
  contract_sign: "เซ็นสัญญา",
  handover: "ส่งมอบงาน",
  follow_up: "โทรติดตาม",
};

export const apptTypeColor: Record<ApptType, { bg: string; text: string }> = {
  survey:        { bg: "#dce5f0", text: "#003366" },
  design_meet:   { bg: "#f0f4f8", text: "#2D2D2D" },
  presentation:  { bg: "#fef3cd", text: "#f59e0b" },
  contract_sign: { bg: "#dce5f0", text: "#003366" },
  handover:      { bg: "#e5faf0", text: "#059669" },
  follow_up:     { bg: "#f0f0f5", text: "#6b7280" },
};

export const apptStatusLabel: Record<ApptStatus, string> = {
  upcoming: "กำลังจะมาถึง", done: "เสร็จแล้ว", cancelled: "ยกเลิก",
};
export const apptStatusColor: Record<ApptStatus, { bg: string; text: string }> = {
  upcoming:  { bg: "#dce5f0", text: "#003366" },
  done:      { bg: "#e5faf0", text: "#059669" },
  cancelled: { bg: "#fee2e2", text: "#dc2626" },
};

export type AppointmentMock = {
  id: number; company: string; contact: string; phone: string;
  project: string; buildingType: string; area: number; province: string;
  date: string; time: string; type: ApptType; assigned: string;
  status: ApptStatus; note: string;
};

export const appointments: AppointmentMock[] = [
  { id: 1, company: "บจ. ไทยสตีล", contact: "คุณสมชาย ใจดี", phone: "081-234-5678", project: "โกดังสำเร็จรูป บจ. ไทยสตีล", buildingType: "EASYBUILD", area: 1200, province: "นนทบุรี", date: "2026-06-24", time: "09:00", type: "survey", assigned: "สมชาย", status: "upcoming", note: "สำรวจพื้นที่ก่อสร้างโกดังสินค้า" },
  { id: 2, company: "บจ. ซีซีเอส", contact: "คุณกาญจนา ม.", phone: "082-345-6789", project: "ระบบ ERP บจ. ซีซีเอส", buildingType: "PREFAB", area: 800, province: "เชียงใหม่", date: "2026-06-24", time: "13:30", type: "design_meet", assigned: "วิภา", status: "upcoming", note: "ประชุมออกแบบ Layout และ BIM" },
  { id: 3, company: "บจ. ไทยสตีล", contact: "คุณสมชาย ใจดี", phone: "081-234-5678", project: "โกดังสำเร็จรูป บจ. ไทยสตีล", buildingType: "EASYBUILD", area: 1200, province: "นนทบุรี", date: "2026-06-26", time: "09:00", type: "contract_sign", assigned: "สมชาย", status: "upcoming", note: "เซ็นสัญญาจ้างก่อสร้าง" },
  { id: 4, company: "บจ. ซีซีเอส", contact: "คุณกาญจนา ม.", phone: "082-345-6789", project: "ระบบ ERP บจ. ซีซีเอส", buildingType: "PREFAB", area: 800, province: "เชียงใหม่", date: "2026-06-30", time: "13:00", type: "handover", assigned: "สมชาย", status: "upcoming", note: "ส่งมอบงาน Phase 1" },
  { id: 5, company: "บจ. สมุทรโกดัง", contact: "คุณดารัล ส.", phone: "084-567-8901", project: "โกดังปากน้ำ พระปราชญ์", buildingType: "EASYBUILD", area: 2000, province: "สมุทรปราการ", date: "2026-07-03", time: "08:00", type: "survey", assigned: "วิชัย", status: "upcoming", note: "สำรวจพื้นที่และตรวจสอบดิน" },
  { id: 6, company: "หจก. ราชบุรีโลหะ", contact: "คุณประยุทธ ร.", phone: "083-456-7890", project: "โกดัง PEB ราชบุรี", buildingType: "RANBUILD", area: 3100, province: "ราชบุรี", date: "2026-07-05", time: "10:00", type: "presentation", assigned: "วิภา", status: "upcoming", note: "นำเสนอใบเสนอราคาฉบับปรับปรุง" },
  { id: 7, company: "บจ. แม่สอดโลหะ", contact: "คุณสุรัตน์ ล.", phone: "086-789-0123", project: "EASYBUILD แม่สอด", buildingType: "EASYBUILD", area: 4100, province: "ตาก", date: "2026-06-15", time: "10:00", type: "survey", assigned: "สมชาย", status: "done", note: "สำรวจพื้นที่เรียบร้อย รอส่งรายงาน" },
  { id: 8, company: "VCS Asia", contact: "VCS Asia (ระยอง)", phone: "085-678-9012", project: "โกดังระยอง VCS Asia", buildingType: "RANBUILD", area: 6200, province: "ระยอง", date: "2026-02-25", time: "13:00", type: "handover", assigned: "วิชัย", status: "done", note: "ส่งมอบงานเสร็จสมบูรณ์" },
  { id: 9, company: "บจ. นครสวรรค์โลหะ", contact: "บจ. นครสวรรค์โลหะ", phone: "088-901-2345", project: "โรงงาน RANBUILD นครสวรรค์", buildingType: "RANBUILD", area: 5400, province: "นครสวรรค์", date: "2026-03-15", time: "14:00", type: "follow_up", assigned: "กาญจนา", status: "done", note: "โทรติดตามหลังส่งมอบ" },
  { id: 10, company: "บจ. อุตรดิตถ์โลหะ", contact: "บจ. อุตรดิตถ์โลหะ", phone: "087-890-1234", project: "PREFAB อุตรดิตถ์", buildingType: "PREFAB", area: 2800, province: "อุตรดิตถ์", date: "2026-07-10", time: "10:00", type: "presentation", assigned: "วิภา", status: "cancelled", note: "ลูกค้าขอเลื่อน" },
];

// ─── CONTRACTS ────────────────────────────────────────────────
export type ContractStatus = "draft" | "active" | "completed" | "cancelled";

export const contractStatusLabel: Record<ContractStatus, string> = {
  draft: "ร่าง", active: "มีผล", completed: "เสร็จสิ้น", cancelled: "ยกเลิก",
};
export const contractStatusColor: Record<ContractStatus, { bg: string; text: string }> = {
  draft:     { bg: "#f0f0f5", text: "#6b7280" },
  active:    { bg: "#dce5f0", text: "#003366" },
  completed: { bg: "#e5faf0", text: "#059669" },
  cancelled: { bg: "#fee2e2", text: "#dc2626" },
};

export type ContractMock = {
  id: string; client: string; contact: string; phone: string;
  project: string; value: number; deposit: number; remaining: number;
  agentName: string; signDate: string; transferDate: string;
  status: ContractStatus; quotationRef?: string;
};

export const contracts: ContractMock[] = [
  { id: "C-2026-001", client: "บจ. ไทยสตีล", contact: "คุณสมชาย ใจดี", phone: "081-234-5678", project: "โกดังสำเร็จรูป บจ. ไทยสตีล", value: 1800000, deposit: 540000, remaining: 1260000, agentName: "สมชาย", signDate: "2026-04-01", transferDate: "2026-07-31", status: "active", quotationRef: "Q-2026-0089" },
  { id: "C-2026-002", client: "บจ. ซีซีเอส", contact: "คุณกาญจนา ม.", phone: "082-345-6789", project: "ระบบ ERP บจ. ซีซีเอส", value: 3200000, deposit: 960000, remaining: 2240000, agentName: "วิภา", signDate: "2026-05-15", transferDate: "2026-08-15", status: "active", quotationRef: "Q-2026-0095" },
  { id: "C-2026-003", client: "บจ. นครสวรรค์โลหะ", contact: "บจ. นครสวรรค์โลหะ", phone: "088-901-2345", project: "โรงงาน RANBUILD นครสวรรค์", value: 5400000, deposit: 5400000, remaining: 0, agentName: "สมชาย", signDate: "2026-01-01", transferDate: "2026-03-31", status: "completed" },
  { id: "C-2026-004", client: "VCS Asia", contact: "VCS Asia (ระยอง)", phone: "085-678-9012", project: "โกดังระยอง VCS Asia", value: 6200000, deposit: 6200000, remaining: 0, agentName: "วิชัย", signDate: "2025-11-01", transferDate: "2026-02-28", status: "completed", quotationRef: "Q-2026-0092" },
  { id: "C-2026-005", client: "คุณสมชาย", contact: "คุณสมชาย ใจดี", phone: "081-234-5678", project: "โกดังปากน้ำ พระปราชญ์", value: 2000000, deposit: 0, remaining: 2000000, agentName: "สมชาย", signDate: "—", transferDate: "—", status: "draft", quotationRef: "Q-2026-0097" },
];

// ─── INVOICES ─────────────────────────────────────────────────
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  draft: "ร่าง", sent: "ส่งแล้ว", paid: "ชำระแล้ว", overdue: "เกินกำหนด", cancelled: "ยกเลิก",
};
export const invoiceStatusColor: Record<InvoiceStatus, { bg: string; text: string }> = {
  draft:     { bg: "#f0f0f5", text: "#6b7280" },
  sent:      { bg: "#dce5f0", text: "#003366" },
  paid:      { bg: "#e5faf0", text: "#059669" },
  overdue:   { bg: "#fee2e2", text: "#dc2626" },
  cancelled: { bg: "#f5f5f5", text: "#9ca3af" },
};

export type InvoiceMock = {
  id: string; client: string; project: string; contractRef: string;
  issueDate: string; dueDate: string;
  subtotal: number; vatRate: number; vatAmount: number; total: number;
  status: InvoiceStatus; milestone: string; note: string;
};

export const invoices: InvoiceMock[] = [
  { id: "INV-2026-0041", client: "บจ. ไทยสตีล", project: "โกดังสำเร็จรูป บจ. ไทยสตีล", contractRef: "C-2026-001", issueDate: "2026-05-01", dueDate: "2026-05-30", subtotal: 504673, vatRate: 7, vatAmount: 35327, total: 540000, status: "paid", milestone: "งวดที่ 1 (30%)", note: "วางฐานราก" },
  { id: "INV-2026-0055", client: "VCS Asia", project: "โกดังระยอง VCS Asia", contractRef: "C-2026-004", issueDate: "2026-02-20", dueDate: "2026-03-15", subtotal: 1158879, vatRate: 7, vatAmount: 81121, total: 1240000, status: "paid", milestone: "งวดสุดท้าย", note: "ส่งมอบงานครบถ้วน" },
  { id: "INV-2026-0062", client: "บจ. ซีซีเอส", project: "ระบบ ERP บจ. ซีซีเอส", contractRef: "C-2026-002", issueDate: "2026-06-01", dueDate: "2026-06-30", subtotal: 747664, vatRate: 7, vatAmount: 52336, total: 800000, status: "sent", milestone: "งวดที่ 2 (30%)", note: "ติดตั้งโครงสร้าง" },
  { id: "INV-2026-0068", client: "หจก. ราชบุรีโลหะ", project: "โกดัง PEB ราชบุรี", contractRef: "C-2026-001", issueDate: "2026-05-20", dueDate: "2026-06-15", subtotal: 177570, vatRate: 7, vatAmount: 12430, total: 190000, status: "overdue", milestone: "งวดที่ 1", note: "มัดจำ 25%" },
  { id: "INV-2026-0071", client: "คุณสมชาย", project: "โกดังปากน้ำ พระปราชญ์", contractRef: "C-2026-005", issueDate: "2026-07-01", dueDate: "2026-07-15", subtotal: 373832, vatRate: 7, vatAmount: 26168, total: 400000, status: "draft", milestone: "มัดจำ (20%)", note: "รอลูกค้าอนุมัติ" },
];

// ─── PAYMENTS ─────────────────────────────────────────────────
export type PaymentMethod = "transfer" | "cheque" | "cash";
export type PaymentStatus = "confirmed" | "pending" | "cancelled";

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  transfer: "โอนเงิน", cheque: "เช็ค", cash: "เงินสด",
};
export const paymentMethodColor: Record<PaymentMethod, { bg: string; text: string }> = {
  transfer: { bg: "#dce5f0", text: "#003366" },
  cheque:   { bg: "#f0f4f8", text: "#2D2D2D" },
  cash:     { bg: "#e5faf0", text: "#059669" },
};
export const paymentStatusLabel: Record<PaymentStatus, string> = {
  confirmed: "ยืนยันแล้ว", pending: "รอยืนยัน", cancelled: "ยกเลิก",
};
export const paymentStatusColor: Record<PaymentStatus, { bg: string; text: string }> = {
  confirmed: { bg: "#e5faf0", text: "#059669" },
  pending:   { bg: "#fef3cd", text: "#f59e0b" },
  cancelled: { bg: "#fee2e2", text: "#dc2626" },
};

export type PaymentMock = {
  id: string; invoiceRef: string; client: string; amount: number;
  method: PaymentMethod; paidDate: string; salesPerson: string;
  status: PaymentStatus; note: string;
};

export const payments: PaymentMock[] = [
  { id: "PAY-2026-001", invoiceRef: "INV-2026-0041", client: "บจ. ไทยสตีล", amount: 540000, method: "transfer", paidDate: "2026-05-28", salesPerson: "สมชาย", status: "confirmed", note: "งวดที่ 1 วางรากฐาน" },
  { id: "PAY-2026-002", invoiceRef: "INV-2026-0055", client: "VCS Asia", amount: 1240000, method: "cheque", paidDate: "2026-03-14", salesPerson: "วิชัย", status: "confirmed", note: "งวดสุดท้าย ส่งมอบแล้ว" },
  { id: "PAY-2026-003", invoiceRef: "INV-2026-0062", client: "บจ. ซีซีเอส", amount: 800000, method: "transfer", paidDate: "2026-06-20", salesPerson: "วิภา", status: "confirmed", note: "งวดที่ 2 ติดตั้งโครงสร้าง" },
  { id: "PAY-2026-004", invoiceRef: "INV-2026-0071", client: "คุณสมชาย", amount: 400000, method: "cash", paidDate: "—", salesPerson: "สมชาย", status: "pending", note: "มัดจำ รอยืนยันสลิป" },
];

// ─── EXPENSES ─────────────────────────────────────────────────────
export type ExpenseCategory = "travel" | "printing" | "testing" | "equipment" | "other";
export type BillingStatus = "billable" | "not_billable" | "billed";

export const expenseCategoryLabel: Record<ExpenseCategory, string> = {
  travel: "เดินทาง", printing: "พิมพ์เอกสาร", testing: "ทดสอบ", equipment: "อุปกรณ์", other: "อื่นๆ",
};
export const billingStatusLabel: Record<BillingStatus, string> = {
  billable: "เรียกเก็บได้", not_billable: "ไม่เรียกเก็บ", billed: "เรียกเก็บแล้ว",
};
export const billingStatusColor: Record<BillingStatus, { bg: string; text: string }> = {
  billable: { bg: "#e5faf0", text: "#059669" },
  not_billable: { bg: "#fee2e2", text: "#dc2626" },
  billed: { bg: "#f0f0f5", text: "#6b7280" },
};
export type ExpenseMock = {
  id: string; date: string; client: string; project: string;
  category: ExpenseCategory; amount: number; description: string;
  billingStatus: BillingStatus;
};
export const expenses: ExpenseMock[] = [
  { id: "EXP-001", date: "2026-06-10", client: "บจ. ไทยสตีล", project: "โกดังสำเร็จรูป บจ. ไทยสตีล", category: "travel", amount: 4800, description: "ค่าเดินทางสำรวจหน้างาน นนทบุรี", billingStatus: "billable" },
  { id: "EXP-002", date: "2026-06-12", client: "บจ. ซีซีเอส", project: "โรงงาน PREFAB เชียงใหม่", category: "printing", amount: 1200, description: "พิมพ์แบบก่อสร้าง A0 จำนวน 4 ชุด", billingStatus: "billed" },
  { id: "EXP-003", date: "2026-06-14", client: "VCS Asia", project: "โกดังระยอง VCS Asia", category: "testing", amount: 32000, description: "ทดสอบดินและฐานราก", billingStatus: "billable" },
  { id: "EXP-004", date: "2026-06-18", client: "บจ. สมุทรโกดัง", project: "โกดังปากน้ำ พระปราชญ์", category: "travel", amount: 2800, description: "ค่าน้ำมันและทางด่วน", billingStatus: "not_billable" },
  { id: "EXP-005", date: "2026-06-20", client: "หจก. ราชบุรีโลหะ", project: "โกดัง PEB ราชบุรี", category: "equipment", amount: 8500, description: "เช่าเครื่องมือสำรวจ Total Station", billingStatus: "billable" },
];


// ─── MILESTONES ───────────────────────────────────────────────────
export type MilestoneMock = {
  id: number; title: string; projectId: number; position: number;
  type: "general" | "major"; dueDate: string; done: boolean;
};
export const milestones: MilestoneMock[] = [
  { id: 1, title: "สำรวจหน้างานและวัดพื้นที่", projectId: 1, position: 1, type: "general", dueDate: "2026-03-10", done: true },
  { id: 2, title: "เสร็จสิ้นงานฐานราก", projectId: 1, position: 2, type: "major", dueDate: "2026-04-15", done: true },
  { id: 3, title: "ติดตั้งโครงเหล็ก", projectId: 1, position: 3, type: "major", dueDate: "2026-05-20", done: false },
  { id: 4, title: "ติดตั้งหลังคาและผนัง", projectId: 2, position: 1, type: "major", dueDate: "2026-06-30", done: false },
  { id: 5, title: "ส่งมอบงาน", projectId: 2, position: 2, type: "major", dueDate: "2026-07-15", done: false },
  { id: 6, title: "ตรวจรับงานขั้นสุดท้าย", projectId: 3, position: 1, type: "major", dueDate: "2026-08-01", done: false },
];

// ─── MESSAGES ─────────────────────────────────────────────────────
export type MessageMock = {
  id: number; text: string; senderName: string; senderId: string; created: string;
};
export const messages: MessageMock[] = [
  { id: 1, text: "แบบแปลนโกดัง VCS Asia ผ่านการอนุมัติจาก engineering แล้ว สามารถเริ่ม fabricate ได้เลย", senderName: "สุรชัย", senderId: "surachai", created: "2026-06-20 09:15" },
  { id: 2, text: "ลูกค้า บจ. ซีซีเอส โอนเงินมัดจำมาแล้ว 30% รอตรวจสอบ statement", senderName: "วิภา", senderId: "wipa", created: "2026-06-20 10:30" },
  { id: 3, text: "งาน TKT-002 ได้สั่งวัสดุใหม่แล้ว ETA 3-5 วันทำการ", senderName: "สมชาย", senderId: "somchai", created: "2026-06-21 14:00" },
  { id: 4, text: "นัด site visit โครงการใหม่ที่นครสวรรค์ วันศุกร์ที่ 26 มิ.ย. เวลา 10:00", senderName: "กาญจนา", senderId: "kanchana", created: "2026-06-22 08:45" },
];

// ─── TAGS ─────────────────────────────────────────────────────────
export type TagVisibility = "public" | "team" | "private";
export type TagMock = {
  id: number; title: string; visibility: TagVisibility; color: string; created: string;
};
export const tags: TagMock[] = [
  { id: 1, title: "VIP", visibility: "public", color: "#f59e0b", created: "2026-01-01" },
  { id: 2, title: "ลูกค้าประจำ", visibility: "public", color: "#059669", created: "2026-01-01" },
  { id: 3, title: "ติดตามด่วน", visibility: "team", color: "#dc2626", created: "2026-02-01" },
  { id: 4, title: "โครงการใหญ่", visibility: "public", color: "#003366", created: "2026-02-01" },
  { id: 5, title: "รอ BOQ", visibility: "team", color: "#6b7280", created: "2026-03-01" },
];

// ─── DEALER DRILL-DOWN ────────────────────────────────────────
export type DealerLeadItem = {
  id: string; name: string; province: string; product: string;
  valueNum: number; status: "new" | "contacted" | "quoted" | "won" | "lost";
  assignedAt: string;
};
export type DealerProjectItem = {
  id: string; name: string; product: string;
  valueNum: number; progress: number;
  status: "in_progress" | "completed" | "on_hold" | "overdue";
  dueDate: string;
};
export type DealerQuoteItem = {
  quoteNo: string; customer: string; product: string;
  valueNum: number; discountPct: number;
  status: "draft" | "sent" | "approved" | "won" | "lost";
  date: string;
};
export type DealerDetail = {
  code: string;
  monthlySales: { month: string; value: number }[];
  leads: DealerLeadItem[];
  projects: DealerProjectItem[];
  quotes: DealerQuoteItem[];
};

export const dealerDetails: Record<string, DealerDetail> = {
  RYG: {
    code: "RYG",
    monthlySales: [
      { month: "ม.ค.", value: 3200 }, { month: "ก.พ.", value: 6200 }, { month: "มี.ค.", value: 4800 },
      { month: "เม.ย.", value: 5600 }, { month: "พ.ค.", value: 7100 }, { month: "มิ.ย.", value: 5400 },
    ],
    leads: [
      { id: "LD-R01", name: "บจ. แหลมฉบัง อุตสาหกรรม", province: "ชลบุรี",    product: "RANBUILD",  valueNum: 4200000, status: "quoted",    assignedAt: "3 วันก่อน" },
      { id: "LD-R02", name: "หจก. มาบตาพุดโลหะ",       province: "ระยอง",     product: "EASYBUILD", valueNum: 1800000, status: "contacted", assignedAt: "1 สัปดาห์" },
      { id: "LD-R03", name: "บจ. ชลอุตสาหกรรม",        province: "ชลบุรี",    product: "PREFAB",    valueNum: 2600000, status: "new",       assignedAt: "2 วันก่อน" },
      { id: "LD-R04", name: "นาย อนันต์ ศ.",            province: "จันทบุรี",  product: "EASYBUILD", valueNum: 850000,  status: "won",       assignedAt: "2 สัปดาห์" },
    ],
    projects: [
      { id: "PRJ-R01", name: "โกดัง VCS Asia ระยอง",        product: "RANBUILD",  valueNum: 6200000, progress: 100, status: "completed",  dueDate: "28 ก.พ. 2026" },
      { id: "PRJ-R02", name: "โรงงาน บจ. แหลมฉบัง",         product: "PREFAB",    valueNum: 3800000, progress: 62,  status: "in_progress", dueDate: "31 ส.ค. 2026" },
      { id: "PRJ-R03", name: "โกดัง มาบตาพุดโลหะ",           product: "EASYBUILD", valueNum: 1800000, progress: 38,  status: "in_progress", dueDate: "15 ก.ย. 2026" },
      { id: "PRJ-R04", name: "คลังสินค้า ชลบุรี เฟส 2",       product: "RANBUILD",  valueNum: 2400000, progress: 10,  status: "in_progress", dueDate: "30 ต.ค. 2026" },
      { id: "PRJ-R05", name: "โกดัง จันทบุรี อนันต์",         product: "EASYBUILD", valueNum: 850000,  progress: 0,   status: "in_progress", dueDate: "15 พ.ย. 2026" },
      { id: "PRJ-R06", name: "โรงงาน ตราด อุตสาหกรรม",        product: "RANBUILD",  valueNum: 3100000, progress: 0,   status: "in_progress", dueDate: "31 ธ.ค. 2026" },
    ],
    quotes: [
      { quoteNo: "Q-2026-0091", customer: "หจก. ราชบุรีโลหะ",      product: "RANBUILD",  valueNum: 1800000, discountPct: 12, status: "approved", date: "3 ชม." },
      { quoteNo: "Q-2026-0086", customer: "บจ. แหลมฉบัง อุตฯ",     product: "PREFAB",    valueNum: 3800000, discountPct: 8,  status: "sent",     date: "2 วัน" },
      { quoteNo: "Q-2026-0079", customer: "หจก. มาบตาพุดโลหะ",      product: "EASYBUILD", valueNum: 1800000, discountPct: 5,  status: "won",      date: "2 สัปดาห์" },
      { quoteNo: "Q-2026-0065", customer: "VCS Asia",                product: "RANBUILD",  valueNum: 6200000, discountPct: 0,  status: "won",      date: "4 สัปดาห์" },
    ],
  },
  CNX: {
    code: "CNX",
    monthlySales: [
      { month: "ม.ค.", value: 2100 }, { month: "ก.พ.", value: 1800 }, { month: "มี.ค.", value: 3200 },
      { month: "เม.ย.", value: 4100 }, { month: "พ.ค.", value: 2600 }, { month: "มิ.ย.", value: 4200 },
    ],
    leads: [
      { id: "LD-C01", name: "บจ. ไทยสตีล",          province: "เชียงใหม่",  product: "EASYBUILD", valueNum: 3200000, status: "quoted",    assignedAt: "5 วันก่อน" },
      { id: "LD-C02", name: "หจก. สันทรายก่อสร้าง",  province: "เชียงใหม่",  product: "PREFAB",    valueNum: 1200000, status: "contacted", assignedAt: "1 สัปดาห์" },
      { id: "LD-C03", name: "บจ. ลำพูนโลหะ",         province: "ลำพูน",      product: "RANBUILD",  valueNum: 2800000, status: "new",       assignedAt: "1 วันก่อน" },
    ],
    projects: [
      { id: "PRJ-C01", name: "โกดัง บจ. ไทยสตีล เชียงใหม่",  product: "EASYBUILD", valueNum: 3200000, progress: 45, status: "in_progress", dueDate: "31 ก.ค. 2026" },
      { id: "PRJ-C02", name: "โรงงาน PREFAB ซีซีเอส",          product: "PREFAB",    valueNum: 3200000, progress: 72, status: "in_progress", dueDate: "15 ส.ค. 2026" },
      { id: "PRJ-C03", name: "คลังสินค้า ลำพูน อุตฯ",          product: "RANBUILD",  valueNum: 1600000, progress: 0,  status: "in_progress", dueDate: "30 ก.ย. 2026" },
      { id: "PRJ-C04", name: "โกดัง เชียงใหม่-ลำปาง",          product: "EASYBUILD", valueNum: 2100000, progress: 25, status: "on_hold",     dueDate: "31 ต.ค. 2026" },
      { id: "PRJ-C05", name: "โรงงาน น่าน CUSTOM",             product: "CUSTOM",    valueNum: 4800000, progress: 5,  status: "in_progress", dueDate: "28 ก.พ. 2027" },
    ],
    quotes: [
      { quoteNo: "Q-2026-0089", customer: "บจ. ไทยสตีล",       product: "EASYBUILD", valueNum: 3200000, discountPct: 15, status: "approved", date: "2 ชม." },
      { quoteNo: "Q-2026-0083", customer: "หจก. สันทราย",       product: "PREFAB",    valueNum: 1200000, discountPct: 6,  status: "sent",     date: "4 วัน" },
      { quoteNo: "Q-2026-0074", customer: "บจ. ลำพูนโลหะ",     product: "RANBUILD",  valueNum: 2800000, discountPct: 4,  status: "draft",    date: "1 สัปดาห์" },
    ],
  },
  MST: {
    code: "MST",
    monthlySales: [
      { month: "ม.ค.", value: 1800 }, { month: "ก.พ.", value: 2400 }, { month: "มี.ค.", value: 3100 },
      { month: "เม.ย.", value: 4200 }, { month: "พ.ค.", value: 3600 }, { month: "มิ.ย.", value: 3800 },
    ],
    leads: [
      { id: "LD-M01", name: "บจ. แม่สอดโลหะ",        province: "ตาก",    product: "EASYBUILD", valueNum: 4100000, status: "quoted",    assignedAt: "3 วันก่อน" },
      { id: "LD-M02", name: "หจก. กาญจน์อุตฯ",       province: "กาญจนบุรี", product: "RANBUILD", valueNum: 2200000, status: "contacted", assignedAt: "5 วันก่อน" },
      { id: "LD-M03", name: "นาย ธนกร ป.",            province: "ตาก",    product: "PREFAB",    valueNum: 980000,  status: "new",       assignedAt: "2 วันก่อน" },
    ],
    projects: [
      { id: "PRJ-M01", name: "EASYBUILD แม่สอด บจ. แม่สอดโลหะ", product: "EASYBUILD", valueNum: 4100000, progress: 82, status: "in_progress", dueDate: "31 ก.ค. 2026" },
      { id: "PRJ-M02", name: "โกดัง RANBUILD กาญจนบุรี",         product: "RANBUILD",  valueNum: 2200000, progress: 55, status: "in_progress", dueDate: "30 ส.ค. 2026" },
      { id: "PRJ-M03", name: "โรงงาน PREFAB ตาก",                product: "PREFAB",    valueNum: 1600000, progress: 30, status: "in_progress", dueDate: "30 ก.ย. 2026" },
      { id: "PRJ-M04", name: "คลังสินค้า ราชบุรี",               product: "EASYBUILD", valueNum: 1800000, progress: 0,  status: "in_progress", dueDate: "31 ต.ค. 2026" },
    ],
    quotes: [
      { quoteNo: "Q-2026-0085", customer: "บจ. แม่สอดโลหะ", product: "EASYBUILD", valueNum: 4100000, discountPct: 7,  status: "won",  date: "1 สัปดาห์" },
      { quoteNo: "Q-2026-0080", customer: "หจก. กาญจน์อุตฯ", product: "RANBUILD",  valueNum: 2200000, discountPct: 5,  status: "sent", date: "2 สัปดาห์" },
      { quoteNo: "Q-2026-0077", customer: "นาย ธนกร ป.",     product: "PREFAB",    valueNum: 980000,  discountPct: 3,  status: "draft", date: "2 สัปดาห์" },
    ],
  },
  CRI: {
    code: "CRI",
    monthlySales: [
      { month: "ม.ค.", value: 1200 }, { month: "ก.พ.", value: 900 }, { month: "มี.ค.", value: 2200 },
      { month: "เม.ย.", value: 3100 }, { month: "พ.ค.", value: 2800 }, { month: "มิ.ย.", value: 3100 },
    ],
    leads: [
      { id: "LD-CR01", name: "บจ. เชียงรายอุตสาหกรรม", province: "เชียงราย", product: "RANBUILD",  valueNum: 3600000, status: "quoted",    assignedAt: "4 วันก่อน" },
      { id: "LD-CR02", name: "หจก. พะเยาก่อสร้าง",    province: "พะเยา",    product: "PREFAB",    valueNum: 1100000, status: "new",       assignedAt: "1 วันก่อน" },
    ],
    projects: [
      { id: "PRJ-CR01", name: "โรงงาน RANBUILD เชียงราย",     product: "RANBUILD",  valueNum: 3600000, progress: 40, status: "in_progress", dueDate: "30 ก.ย. 2026" },
      { id: "PRJ-CR02", name: "โกดัง EASYBUILD พะเยา",        product: "EASYBUILD", valueNum: 1800000, progress: 60, status: "in_progress", dueDate: "31 ส.ค. 2026" },
      { id: "PRJ-CR03", name: "PREFAB เชียงราย เฟส 1",        product: "PREFAB",    valueNum: 2100000, progress: 15, status: "overdue",     dueDate: "15 มิ.ย. 2026" },
    ],
    quotes: [
      { quoteNo: "Q-2026-0082", customer: "บจ. เชียงรายอุตฯ", product: "RANBUILD",  valueNum: 3600000, discountPct: 9,  status: "sent",  date: "3 วัน" },
      { quoteNo: "Q-2026-0075", customer: "หจก. พะเยาก่อสร้าง", product: "PREFAB",  valueNum: 1100000, discountPct: 5,  status: "draft", date: "1 สัปดาห์" },
      { quoteNo: "Q-2026-0070", customer: "บจ. เชียงรายอุตฯ", product: "EASYBUILD", valueNum: 1800000, discountPct: 6,  status: "won",   date: "3 สัปดาห์" },
    ],
  },
  NSN: {
    code: "NSN",
    monthlySales: [
      { month: "ม.ค.", value: 5400 }, { month: "ก.พ.", value: 800 }, { month: "มี.ค.", value: 600 },
      { month: "เม.ย.", value: 400 }, { month: "พ.ค.", value: 500 }, { month: "มิ.ย.", value: 1900 },
    ],
    leads: [
      { id: "LD-N01", name: "บจ. นครสวรรค์โกดัง", province: "นครสวรรค์", product: "EASYBUILD", valueNum: 2400000, status: "contacted", assignedAt: "6 วันก่อน" },
      { id: "LD-N02", name: "หจก. สุโขทัยอุตฯ",  province: "สุโขทัย",   product: "RANBUILD",  valueNum: 1800000, status: "new",       assignedAt: "2 วันก่อน" },
    ],
    projects: [
      { id: "PRJ-N01", name: "โรงงาน RANBUILD นครสวรรค์",    product: "RANBUILD",  valueNum: 5400000, progress: 100, status: "completed",  dueDate: "31 มี.ค. 2026" },
      { id: "PRJ-N02", name: "โกดัง EASYBUILD นครสวรรค์",    product: "EASYBUILD", valueNum: 1900000, progress: 20,  status: "in_progress", dueDate: "31 ส.ค. 2026" },
    ],
    quotes: [
      { quoteNo: "Q-2026-0087", customer: "บจ. นครสวรรค์โกดัง", product: "EASYBUILD", valueNum: 2400000, discountPct: 8, status: "sent", date: "4 วัน" },
      { quoteNo: "Q-2026-0072", customer: "หจก. สุโขทัยอุตฯ",    product: "RANBUILD",  valueNum: 1800000, discountPct: 5, status: "draft", date: "1 สัปดาห์" },
    ],
  },
};

// ─── PIPELINE FUNNEL ─────────────────────────────────────────
export type PipelineStage = {
  key: string;
  label: string;
  count: number;
  valueNum: number;
  color: string;
};
export const hqPipelineStages: PipelineStage[] = [
  { key: "lead",      label: "ลีดทั้งหมด",   count: 42, valueNum: 94200000, color: "#dce5f0" },
  { key: "contacted", label: "ติดต่อแล้ว",   count: 28, valueNum: 62400000, color: "#8fa3c0" },
  { key: "quoted",    label: "ส่งใบเสนอ",    count: 16, valueNum: 38600000, color: "#4d7aa8" },
  { key: "approved",  label: "รออนุมัติ/อนุมัติ", count: 9, valueNum: 22100000, color: "#1a5b8f" },
  { key: "won",       label: "ปิดการขาย",    count: 5,  valueNum: 14300000, color: "#003366" },
];

// สรุปดีลเดือนนี้ (HQ รวมทุกสาขา)
export const hqDealSummary = {
  won:         { count: 5,  value: 14300000 },
  lost:        { count: 4,  value: 9800000  },
  negotiating: { count: 16, value: 38600000 },
  // เป้าปีนี้ (annual) vs YTD จริง
  annualTarget: 260000000,
  ytdActual:    124600000,
  // leads รอติดตาม > 48 ชม.
  leadsOverdue: 5,
};

export type PipelineLostReason = { reason: string; count: number; pct: number };
export const hqPipelineLostReasons: PipelineLostReason[] = [
  { reason: "ราคาสูงกว่าคู่แข่ง",    count: 6, pct: 38 },
  { reason: "ลูกค้าเลื่อนโครงการ",    count: 4, pct: 25 },
  { reason: "ลูกค้าติดต่อไม่ได้",     count: 3, pct: 19 },
  { reason: "เปลี่ยนประเภทอาคาร",     count: 2, pct: 13 },
  { reason: "อื่นๆ",                   count: 1, pct: 6 },
];

export type PipelineByProduct = { product: string; count: number; valueNum: number; color: string };
export const hqPipelineByProduct: PipelineByProduct[] = [
  { product: "RANBUILD",   count: 14, valueNum: 32400000, color: "#003366" },
  { product: "EASYBUILD",  count: 12, valueNum: 24600000, color: "#0a4f8c" },
  { product: "CUSTOM",     count: 8,  valueNum: 18900000, color: "#1e6fbf" },
  { product: "PREFAB",     count: 5,  valueNum: 11200000, color: "#4d94d4" },
  { product: "TURNKEY",    count: 2,  valueNum: 5800000,  color: "#82b4e3" },
  { product: "CONSULTANT", count: 1,  valueNum: 1300000,  color: "#b8d4f0" },
];

// ─── FINANCIAL OVERVIEW ───────────────────────────────────────
export const hqFinanceSummary = {
  ytdRevenue:       85200000,
  ytdTarget:        132000000,
  monthRevenue:     18400000,
  monthTarget:      22000000,
  outstanding:      12400000,
  overdue:           1900000,
  collectedMonth:   15200000,
  ytdExpenses:       8600000,
  grossMarginPct:    23.4,
};

export type FinanceMonthRow = {
  month: string;
  revenue: number;
  target: number;
  collected: number;
  expenses: number;
};
export const hqFinanceByMonth: FinanceMonthRow[] = [
  { month: "ม.ค.",  revenue: 4200000,  target: 11000000, collected: 3800000,  expenses: 820000  },
  { month: "ก.พ.",  revenue: 9800000,  target: 11000000, collected: 9200000,  expenses: 740000  },
  { month: "มี.ค.", revenue: 11600000, target: 11000000, collected: 10900000, expenses: 950000  },
  { month: "เม.ย.", revenue: 14200000, target: 15000000, collected: 13400000, expenses: 1100000 },
  { month: "พ.ค.",  revenue: 12600000, target: 15000000, collected: 11800000, expenses: 980000  },
  { month: "มิ.ย.", revenue: 18400000, target: 22000000, collected: 15200000, expenses: 1420000 },
];

export type InvoiceAgingBucket = { label: string; amount: number; color: string };
export const hqInvoiceAging: InvoiceAgingBucket[] = [
  { label: "ยังไม่ถึงกำหนด",   amount: 8600000, color: "#059669" },
  { label: "1–30 วัน",          amount: 1900000, color: "#f59e0b" },
  { label: "31–60 วัน",         amount:  950000, color: "#f97316" },
  { label: "61+ วัน (เสี่ยง)",  amount:  950000, color: "#dc2626" },
];

// ─── HQ PROJECTS (ทั้งเครือ) ──────────────────────────────────────────────

export type HQProjectStatus = "in_progress" | "completed" | "overdue" | "on_hold" | "not_started";

export type HQProject = {
  id: string;
  name: string;
  dealerCode: string;
  dealerName: string;
  region: string;
  customer: string;
  product: string;
  valueNum: number;
  status: HQProjectStatus;
  progressPct: number;
  startDate: string;
  deadline: string;
  pm: string;
  daysLeft: number;   // < 0 = เกินกำหนด
  issues?: string[];
  updates?: { date: string; note: string }[];
};

export const hqProjects: HQProject[] = [
  // RYG — ระยอง (6 โครงการ)
  { id: "PRJ-001", name: "โกดังสินค้า บ.อุตสาหกรรมไทย จก.",     dealerCode: "RYG", dealerName: "สาขาระยอง",       region: "ตะวันออก", customer: "บ.อุตสาหกรรมไทย จก.",     product: "RANBUILD",  valueNum: 4200000,  status: "in_progress",  progressPct: 65, startDate: "1 เม.ย. 2026",   deadline: "30 ก.ค. 2026",  pm: "สมชาย ว.",    daysLeft: 35,
    updates: [{ date: "23 มิ.ย. 2026", note: "ติดตั้งโครงสร้างเสร็จ 65% — อยู่ในแผน ไม่มีปัญหา" }, { date: "10 มิ.ย. 2026", note: "ลูกค้าตรวจงานและผ่าน QC รอบแรกแล้ว" }] },
  { id: "PRJ-002", name: "โรงงานผลิตชิ้นส่วน ABC",                dealerCode: "RYG", dealerName: "สาขาระยอง",       region: "ตะวันออก", customer: "บ.เอบีซี แมนูแฟคเจอริ่ง", product: "EASYBUILD", valueNum: 2800000,  status: "in_progress",  progressPct: 42, startDate: "15 เม.ย. 2026",  deadline: "15 ส.ค. 2026",  pm: "ประภาส ร.",   daysLeft: 51 },
  { id: "PRJ-003", name: "ศูนย์กระจายสินค้า WMS ระยอง",           dealerCode: "RYG", dealerName: "สาขาระยอง",       region: "ตะวันออก", customer: "หจก. ไอซ์โลจิสติกส์",     product: "RANBUILD",  valueNum: 6800000,  status: "completed",    progressPct: 100, startDate: "1 ม.ค. 2026",   deadline: "31 พ.ค. 2026",  pm: "สมชาย ว.",    daysLeft: 999 },
  { id: "PRJ-004", name: "หอพักพนักงาน นิคมอุตสาหกรรม",           dealerCode: "RYG", dealerName: "สาขาระยอง",       region: "ตะวันออก", customer: "บ.เอสทีพี โฮลดิ้ง",       product: "PREFAB",    valueNum: 1900000,  status: "overdue",      progressPct: 30, startDate: "1 มี.ค. 2026",   deadline: "30 พ.ค. 2026",  pm: "ประภาส ร.",   daysLeft: -25,
    issues: ["งานเทฐานรากล่าช้า 3 สัปดาห์ เนื่องจากฝนตกต่อเนื่อง", "ผู้รับเหมาย่อย (ประตู-หน้าต่าง) ยังไม่ส่งวัสดุ"],
    updates: [{ date: "20 มิ.ย. 2026", note: "ประชุมลูกค้า — ขอขยายเวลา 30 วัน อยู่ระหว่างรออนุมัติ" }, { date: "10 มิ.ย. 2026", note: "งานโครงสร้างเสร็จ 30% ช้ากว่าแผน 2 สัปดาห์" }] },
  { id: "PRJ-005", name: "อาคารสำนักงาน EPC ชลบุรี",               dealerCode: "RYG", dealerName: "สาขาระยอง",       region: "ตะวันออก", customer: "บ.พีซีบี คอนสตรัคชั่น",   product: "CUSTOM",    valueNum: 3500000,  status: "in_progress",  progressPct: 78, startDate: "1 มี.ค. 2026",   deadline: "31 ก.ค. 2026",  pm: "สมชาย ว.",    daysLeft: 36 },
  { id: "PRJ-006", name: "โรงเก็บวัตถุดิบ บ.ปิโตรเคม",             dealerCode: "RYG", dealerName: "สาขาระยอง",       region: "ตะวันออก", customer: "บ.ปิโตรเคม (ไทย)",        product: "RANBUILD",  valueNum: 5100000,  status: "not_started",  progressPct: 0,  startDate: "1 ก.ค. 2026",   deadline: "31 ต.ค. 2026",  pm: "ประภาส ร.",   daysLeft: 128 },
  // CNX — เชียงใหม่ (5 โครงการ)
  { id: "PRJ-007", name: "โกดังเกษตร สหกรณ์ลำพูน",                dealerCode: "CNX", dealerName: "สาขาเชียงใหม่",   region: "เหนือ",    customer: "สหกรณ์ลำพูน จก.",          product: "EASYBUILD", valueNum: 2200000,  status: "in_progress",  progressPct: 55, startDate: "15 มี.ค. 2026",  deadline: "15 ก.ค. 2026",  pm: "วิภา ป.",     daysLeft: 20 },
  { id: "PRJ-008", name: "อาคารแสดงสินค้า OTOP เชียงใหม่",         dealerCode: "CNX", dealerName: "สาขาเชียงใหม่",   region: "เหนือ",    customer: "อบจ.เชียงใหม่",             product: "CUSTOM",    valueNum: 4600000,  status: "overdue",      progressPct: 48, startDate: "1 ก.พ. 2026",   deadline: "30 พ.ค. 2026",  pm: "สุรชัย ท.",   daysLeft: -26,
    issues: ["ลูกค้า (อบจ.) ขอเพิ่ม spec ระบบไฟฟ้า ทำให้ scope เพิ่ม 15%", "รอ BOQ แก้ไขจากฝ่ายออกแบบ ค้างมา 2 สัปดาห์"],
    updates: [{ date: "22 มิ.ย. 2026", note: "ส่ง Change Request ให้ลูกค้าพิจารณา มูลค่าเพิ่มประมาณ ฿680K" }, { date: "5 มิ.ย. 2026", note: "งานโครงสร้างหลัก 48% เสร็จ แต่ระบบงานระงับรอแก้แบบ" }] },
  { id: "PRJ-009", name: "โรงงานแปรรูปอาหาร CNX Food",             dealerCode: "CNX", dealerName: "สาขาเชียงใหม่",   region: "เหนือ",    customer: "บ.ซีเอ็นเอ็กซ์ ฟูด",      product: "RANBUILD",  valueNum: 3800000,  status: "in_progress",  progressPct: 22, startDate: "1 มิ.ย. 2026",   deadline: "30 ก.ย. 2026",  pm: "วิภา ป.",     daysLeft: 97 },
  { id: "PRJ-010", name: "ศูนย์บริการยานยนต์ Bigbike",             dealerCode: "CNX", dealerName: "สาขาเชียงใหม่",   region: "เหนือ",    customer: "บ.บิ๊กไบค์เซ็นเตอร์",     product: "PREFAB",    valueNum: 1400000,  status: "completed",    progressPct: 100, startDate: "1 ก.พ. 2026",   deadline: "30 เม.ย. 2026", pm: "สุรชัย ท.",   daysLeft: 999 },
  { id: "PRJ-011", name: "โรงเรือนผักไฮโดรโปนิกส์ขนาดใหญ่",       dealerCode: "CNX", dealerName: "สาขาเชียงใหม่",   region: "เหนือ",    customer: "กลุ่มเกษตรลำพูน",          product: "CUSTOM",    valueNum: 2900000,  status: "on_hold",      progressPct: 15, startDate: "1 พ.ค. 2026",   deadline: "31 ส.ค. 2026",  pm: "วิภา ป.",     daysLeft: 67 },
  // MST — แม่สอด (4 โครงการ)
  { id: "PRJ-012", name: "โกดังส่งออกชายแดน SEZ แม่สอด",          dealerCode: "MST", dealerName: "สาขาแม่สอด",      region: "ตะวันตก", customer: "บ.ทีดีเค ลอจิสติกส์",      product: "RANBUILD",  valueNum: 5800000,  status: "in_progress",  progressPct: 72, startDate: "15 ก.พ. 2026",  deadline: "15 ก.ค. 2026",  pm: "อนันต์ ส.",   daysLeft: 20 },
  { id: "PRJ-013", name: "อาคารพาณิชย์ย่านการค้า MST",             dealerCode: "MST", dealerName: "สาขาแม่สอด",      region: "ตะวันตก", customer: "หจก. แม่สอดพาณิชย์",       product: "CUSTOM",    valueNum: 2100000,  status: "in_progress",  progressPct: 88, startDate: "1 ก.พ. 2026",   deadline: "30 มิ.ย. 2026", pm: "อนันต์ ส.",   daysLeft: 5 },
  { id: "PRJ-014", name: "คลังสินค้าเย็น อาหารสด",                 dealerCode: "MST", dealerName: "สาขาแม่สอด",      region: "ตะวันตก", customer: "บ.เฟรชโลจิส",              product: "RANBUILD",  valueNum: 3200000,  status: "completed",    progressPct: 100, startDate: "1 ธ.ค. 2025",   deadline: "28 ก.พ. 2026", pm: "พิมพ์ ท.",    daysLeft: 999 },
  { id: "PRJ-015", name: "โรงงานตัดเย็บเสื้อผ้าส่งออก",            dealerCode: "MST", dealerName: "สาขาแม่สอด",      region: "ตะวันตก", customer: "บ.เอ็มเอสที การ์เม้นต์",    product: "PREFAB",    valueNum: 1800000,  status: "not_started",  progressPct: 0,  startDate: "1 ส.ค. 2026",   deadline: "30 พ.ย. 2026",  pm: "อนันต์ ส.",   daysLeft: 158 },
  // CRI — เชียงราย (3 โครงการ)
  { id: "PRJ-016", name: "ศูนย์แปรรูปชา-กาแฟ CRI",                 dealerCode: "CRI", dealerName: "สาขาเชียงราย",    region: "เหนือ",    customer: "วิสาหกิจชุมชนดอยอินทนนท์",  product: "CUSTOM",    valueNum: 3100000,  status: "in_progress",  progressPct: 35, startDate: "1 เม.ย. 2026",   deadline: "30 ก.ย. 2026",  pm: "เกรียงไกร จ.", daysLeft: 97 },
  { id: "PRJ-017", name: "โกดังรับฝากสินค้า Golden Triangle",       dealerCode: "CRI", dealerName: "สาขาเชียงราย",    region: "เหนือ",    customer: "บ.โกลเด้น ทรี โลจิส",      product: "RANBUILD",  valueNum: 2400000,  status: "overdue",      progressPct: 60, startDate: "1 มี.ค. 2026",   deadline: "31 พ.ค. 2026",  pm: "เกรียงไกร จ.", daysLeft: -25,
    issues: ["วัสดุหลังคา RANBUILD ล็อตใหม่มาช้า — รอจากโรงงานภาคกลาง"],
    updates: [{ date: "18 มิ.ย. 2026", note: "โครงสร้างเสร็จ 60% รอวัสดุหลังคาชุดสุดท้าย ETA 30 มิ.ย." }, { date: "1 มิ.ย. 2026", note: "ลูกค้าแจ้งว่าต้องการใช้งานภายใน ก.ค. — เพิ่มแรงงาน 20%" }] },
  { id: "PRJ-018", name: "อาคารเรียนมหาวิทยาลัย CRI",               dealerCode: "CRI", dealerName: "สาขาเชียงราย",    region: "เหนือ",    customer: "ม.ราชภัฏเชียงราย",          product: "CUSTOM",    valueNum: 4900000,  status: "on_hold",      progressPct: 5,  startDate: "1 มิ.ย. 2026",   deadline: "30 พ.ย. 2026",  pm: "สุชาติ ม.",   daysLeft: 158 },
  // NSN — นครสวรรค์ (2 โครงการ)
  { id: "PRJ-019", name: "โกดังสินค้าเกษตร NSN",                    dealerCode: "NSN", dealerName: "สาขานครสวรรค์",   region: "กลาง",     customer: "สหกรณ์การเกษตรนครสวรรค์",  product: "EASYBUILD", valueNum: 1600000,  status: "in_progress",  progressPct: 50, startDate: "1 พ.ค. 2026",   deadline: "31 ส.ค. 2026",  pm: "ธีรพล อ.",    daysLeft: 67 },
  { id: "PRJ-020", name: "ศาลาอเนกประสงค์เทศบาล NSN",               dealerCode: "NSN", dealerName: "สาขานครสวรรค์",   region: "กลาง",     customer: "เทศบาลเมืองนครสวรรค์",      product: "PREFAB",    valueNum: 900000,   status: "overdue",      progressPct: 40, startDate: "1 ก.พ. 2026",   deadline: "30 เม.ย. 2026", pm: "ธีรพล อ.",    daysLeft: -56,
    issues: ["ลูกค้าขอปรับแบบ 3 ครั้ง ทำให้เสียเวลารวม 6 สัปดาห์", "งบประมาณลูกค้าถูกตรวจสอบโดยสำนักงานตรวจเงินแผ่นดิน — ชำระเงินงวดถัดไปล่าช้า"],
    updates: [{ date: "24 มิ.ย. 2026", note: "ประชุมเร่งด่วนกับเทศบาล — กำหนดส่งใหม่ 31 ก.ค. 2026 รอทำ MOU แก้ไขสัญญา" }, { date: "15 พ.ค. 2026", note: "แบบสุดท้ายได้รับอนุมัติแล้ว เริ่มก่อสร้างจริงได้" }] },
  // HYI — หาดใหญ่ (1 โครงการ inactive)
  { id: "PRJ-021", name: "ซ่อมหลังคาโรงงานเดิม",                    dealerCode: "HYI", dealerName: "สาขาหาดใหญ่",    region: "ใต้",      customer: "บ.หาดใหญ่อุตสาหกรรม",      product: "CUSTOM",    valueNum: 480000,   status: "on_hold",      progressPct: 0,  startDate: "1 มิ.ย. 2026",   deadline: "31 ก.ค. 2026",  pm: "-",            daysLeft: 36 },
  // เพิ่มให้ครบ 23
  { id: "PRJ-022", name: "คลังสินค้า บ.แอลอาร์เอส อีสาน",          dealerCode: "NSN", dealerName: "สาขานครสวรรค์",   region: "กลาง",     customer: "บ.แอลอาร์เอส จก.",          product: "RANBUILD",  valueNum: 2700000,  status: "not_started",  progressPct: 0,  startDate: "1 ส.ค. 2026",   deadline: "31 ธ.ค. 2026",  pm: "ธีรพล อ.",    daysLeft: 189 },
  { id: "PRJ-023", name: "อาคารโชว์รูมรถยนต์ RYG",                  dealerCode: "RYG", dealerName: "สาขาระยอง",       region: "ตะวันออก", customer: "บ.ระยองยานยนต์",            product: "CUSTOM",    valueNum: 3300000,  status: "in_progress",  progressPct: 18, startDate: "1 มิ.ย. 2026",   deadline: "30 ก.ย. 2026",  pm: "สมชาย ว.",    daysLeft: 97 },
];

// ─── HQ SALES TARGETS ────────────────────────────────────────────────────────

export type SalesTarget = {
  dealerCode: string;
  dealerName: string;
  region: string;
  annualTarget: number;
  q1Target: number; q1Actual: number;
  q2Target: number; q2Actual: number;
  q3Target: number;
  q4Target: number;
};

export const hqSalesTargets: SalesTarget[] = [
  { dealerCode:"RYG", dealerName:"สาขาระยอง",       region:"ตะวันออก", annualTarget:30000000, q1Target:7000000, q1Actual:7200000, q2Target:8000000, q2Actual:6100000, q3Target:8000000, q4Target:7000000 },
  { dealerCode:"CNX", dealerName:"สาขาเชียงใหม่",   region:"เหนือ",    annualTarget:20000000, q1Target:5000000, q1Actual:5800000, q2Target:5000000, q2Actual:4200000, q3Target:5000000, q4Target:5000000 },
  { dealerCode:"MST", dealerName:"สาขาแม่สอด",      region:"ตะวันตก",  annualTarget:15000000, q1Target:3500000, q1Actual:3900000, q2Target:4000000, q2Actual:3100000, q3Target:4000000, q4Target:3500000 },
  { dealerCode:"CRI", dealerName:"สาขาเชียงราย",    region:"เหนือ",    annualTarget:12000000, q1Target:3000000, q1Actual:2400000, q2Target:3000000, q2Actual:2800000, q3Target:3000000, q4Target:3000000 },
  { dealerCode:"NSN", dealerName:"สาขานครสวรรค์",   region:"กลาง",     annualTarget:8000000,  q1Target:2000000, q1Actual:1900000, q2Target:2000000, q2Actual:1200000, q3Target:2000000, q4Target:2000000 },
  { dealerCode:"HYI", dealerName:"สาขาหาดใหญ่",    region:"ใต้",      annualTarget:6000000,  q1Target:1500000, q1Actual:800000,  q2Target:1500000, q2Actual:500000,  q3Target:1500000, q4Target:1500000 },
];

// ─── HQ ALL CUSTOMERS ────────────────────────────────────────────────────────

export type HQCustomer = {
  id: number;
  name: string;
  dealerCode: string;
  dealerName: string;
  type: "บริษัท" | "หจก." | "บุคคล" | "หน่วยงานรัฐ";
  province: string;
  dealsWon: number;
  totalRevenue: number;
  status: "active" | "inactive";
  lastContact: string;
  segment: "enterprise" | "sme" | "government";
};

export const hqAllCustomers: HQCustomer[] = [
  { id:1,  name:"บ.อุตสาหกรรมไทย จก.",        dealerCode:"RYG", dealerName:"สาขาระยอง",     type:"บริษัท",        province:"ระยอง",       dealsWon:2, totalRevenue:7400000,  status:"active",   lastContact:"23 มิ.ย. 2026", segment:"enterprise" },
  { id:2,  name:"บ.เอบีซี แมนูแฟคเจอริ่ง",    dealerCode:"RYG", dealerName:"สาขาระยอง",     type:"บริษัท",        province:"ชลบุรี",      dealsWon:1, totalRevenue:2800000,  status:"active",   lastContact:"18 มิ.ย. 2026", segment:"enterprise" },
  { id:3,  name:"หจก. ไอซ์โลจิสติกส์",         dealerCode:"RYG", dealerName:"สาขาระยอง",     type:"หจก.",          province:"ระยอง",       dealsWon:3, totalRevenue:9200000,  status:"active",   lastContact:"10 มิ.ย. 2026", segment:"sme" },
  { id:4,  name:"บ.พีซีบี คอนสตรัคชั่น",       dealerCode:"RYG", dealerName:"สาขาระยอง",     type:"บริษัท",        province:"ชลบุรี",      dealsWon:1, totalRevenue:3500000,  status:"active",   lastContact:"15 มิ.ย. 2026", segment:"sme" },
  { id:5,  name:"บ.ปิโตรเคม (ไทย)",            dealerCode:"RYG", dealerName:"สาขาระยอง",     type:"บริษัท",        province:"ระยอง",       dealsWon:1, totalRevenue:5100000,  status:"active",   lastContact:"5 มิ.ย. 2026",  segment:"enterprise" },
  { id:6,  name:"สหกรณ์ลำพูน จก.",             dealerCode:"CNX", dealerName:"สาขาเชียงใหม่", type:"หจก.",          province:"ลำพูน",       dealsWon:2, totalRevenue:3600000,  status:"active",   lastContact:"20 มิ.ย. 2026", segment:"sme" },
  { id:7,  name:"อบจ.เชียงใหม่",               dealerCode:"CNX", dealerName:"สาขาเชียงใหม่", type:"หน่วยงานรัฐ",   province:"เชียงใหม่",   dealsWon:1, totalRevenue:4600000,  status:"active",   lastContact:"22 มิ.ย. 2026", segment:"government" },
  { id:8,  name:"บ.ซีเอ็นเอ็กซ์ ฟูด",         dealerCode:"CNX", dealerName:"สาขาเชียงใหม่", type:"บริษัท",        province:"เชียงใหม่",   dealsWon:1, totalRevenue:3800000,  status:"active",   lastContact:"12 มิ.ย. 2026", segment:"sme" },
  { id:9,  name:"กลุ่มเกษตรลำพูน",             dealerCode:"CNX", dealerName:"สาขาเชียงใหม่", type:"บุคคล",         province:"ลำพูน",       dealsWon:1, totalRevenue:2900000,  status:"inactive", lastContact:"2 มิ.ย. 2026",  segment:"sme" },
  { id:10, name:"บ.ทีดีเค ลอจิสติกส์",         dealerCode:"MST", dealerName:"สาขาแม่สอด",    type:"บริษัท",        province:"ตาก",         dealsWon:2, totalRevenue:8100000,  status:"active",   lastContact:"21 มิ.ย. 2026", segment:"enterprise" },
  { id:11, name:"หจก. แม่สอดพาณิชย์",          dealerCode:"MST", dealerName:"สาขาแม่สอด",    type:"หจก.",          province:"ตาก",         dealsWon:2, totalRevenue:4200000,  status:"active",   lastContact:"18 มิ.ย. 2026", segment:"sme" },
  { id:12, name:"บ.เฟรชโลจิส",                 dealerCode:"MST", dealerName:"สาขาแม่สอด",    type:"บริษัท",        province:"ตาก",         dealsWon:1, totalRevenue:3200000,  status:"active",   lastContact:"15 มิ.ย. 2026", segment:"sme" },
  { id:13, name:"วิสาหกิจชุมชนดอยอินทนนท์",   dealerCode:"CRI", dealerName:"สาขาเชียงราย",  type:"บุคคล",         province:"เชียงราย",    dealsWon:1, totalRevenue:3100000,  status:"active",   lastContact:"20 มิ.ย. 2026", segment:"sme" },
  { id:14, name:"บ.โกลเด้น ทรี โลจิส",         dealerCode:"CRI", dealerName:"สาขาเชียงราย",  type:"บริษัท",        province:"เชียงราย",    dealsWon:2, totalRevenue:4500000,  status:"active",   lastContact:"18 มิ.ย. 2026", segment:"sme" },
  { id:15, name:"ม.ราชภัฏเชียงราย",            dealerCode:"CRI", dealerName:"สาขาเชียงราย",  type:"หน่วยงานรัฐ",   province:"เชียงราย",    dealsWon:1, totalRevenue:4900000,  status:"inactive", lastContact:"5 มิ.ย. 2026",  segment:"government" },
  { id:16, name:"สหกรณ์การเกษตรนครสวรรค์",    dealerCode:"NSN", dealerName:"สาขานครสวรรค์", type:"หจก.",          province:"นครสวรรค์",   dealsWon:1, totalRevenue:1600000,  status:"active",   lastContact:"10 มิ.ย. 2026", segment:"sme" },
  { id:17, name:"เทศบาลเมืองนครสวรรค์",        dealerCode:"NSN", dealerName:"สาขานครสวรรค์", type:"หน่วยงานรัฐ",   province:"นครสวรรค์",   dealsWon:1, totalRevenue:900000,   status:"active",   lastContact:"24 มิ.ย. 2026", segment:"government" },
  { id:18, name:"บ.ระยองยานยนต์",              dealerCode:"RYG", dealerName:"สาขาระยอง",     type:"บริษัท",        province:"ระยอง",       dealsWon:1, totalRevenue:3300000,  status:"active",   lastContact:"8 มิ.ย. 2026",  segment:"sme" },
  { id:19, name:"บ.ไทยสตีล",                   dealerCode:"CNX", dealerName:"สาขาเชียงใหม่", type:"บริษัท",        province:"เชียงใหม่",   dealsWon:0, totalRevenue:0,        status:"active",   lastContact:"25 มิ.ย. 2026", segment:"enterprise" },
  { id:20, name:"หจก. ราชบุรีโลหะ",            dealerCode:"RYG", dealerName:"สาขาระยอง",     type:"หจก.",          province:"ราชบุรี",     dealsWon:0, totalRevenue:0,        status:"active",   lastContact:"24 มิ.ย. 2026", segment:"sme" },
];

// ─── HQ ALL QUOTATIONS ───────────────────────────────────────────────────────

export type HQQuotation = {
  id: string;
  quoteNo: string;
  dealerCode: string;
  dealerName: string;
  customer: string;
  valueNum: number;
  discountPct: number;
  status: "draft" | "sent" | "won" | "lost" | "pending_approval";
  createdAt: string;
  salesperson: string;
  productLine: string;
};

export const hqAllQuotations: HQQuotation[] = [
  { id:"HQ-Q01", quoteNo:"Q-2026-0089", dealerCode:"CNX", dealerName:"สาขาเชียงใหม่", customer:"บ.ไทยสตีล",              valueNum:3200000, discountPct:15, status:"pending_approval", createdAt:"24 มิ.ย. 2026", salesperson:"วิภา ป.",      productLine:"RANBUILD"  },
  { id:"HQ-Q02", quoteNo:"Q-2026-0091", dealerCode:"RYG", dealerName:"สาขาระยอง",     customer:"หจก. ราชบุรีโลหะ",       valueNum:1800000, discountPct:12, status:"pending_approval", createdAt:"22 มิ.ย. 2026", salesperson:"สมชาย ว.",     productLine:"EASYBUILD" },
  { id:"HQ-Q03", quoteNo:"Q-2026-0085", dealerCode:"RYG", dealerName:"สาขาระยอง",     customer:"บ.อุตสาหกรรมไทย จก.",    valueNum:4200000, discountPct:5,  status:"won",              createdAt:"10 มิ.ย. 2026", salesperson:"สมชาย ว.",     productLine:"RANBUILD"  },
  { id:"HQ-Q04", quoteNo:"Q-2026-0086", dealerCode:"CNX", dealerName:"สาขาเชียงใหม่", customer:"สหกรณ์ลำพูน จก.",        valueNum:2200000, discountPct:7,  status:"won",              createdAt:"8 มิ.ย. 2026",  salesperson:"วิภา ป.",      productLine:"EASYBUILD" },
  { id:"HQ-Q05", quoteNo:"Q-2026-0082", dealerCode:"MST", dealerName:"สาขาแม่สอด",    customer:"บ.ทีดีเค ลอจิสติกส์",    valueNum:5800000, discountPct:4,  status:"sent",             createdAt:"5 มิ.ย. 2026",  salesperson:"อนันต์ ส.",    productLine:"RANBUILD"  },
  { id:"HQ-Q06", quoteNo:"Q-2026-0080", dealerCode:"CRI", dealerName:"สาขาเชียงราย",  customer:"วิสาหกิจชุมชนดอยอินทนนท์",valueNum:3100000, discountPct:6,  status:"sent",             createdAt:"3 มิ.ย. 2026",  salesperson:"เกรียงไกร จ.", productLine:"CUSTOM"    },
  { id:"HQ-Q07", quoteNo:"Q-2026-0078", dealerCode:"NSN", dealerName:"สาขานครสวรรค์", customer:"สหกรณ์การเกษตรนครสวรรค์",valueNum:1600000, discountPct:3,  status:"won",              createdAt:"1 มิ.ย. 2026",  salesperson:"ธีรพล อ.",    productLine:"EASYBUILD" },
  { id:"HQ-Q08", quoteNo:"Q-2026-0077", dealerCode:"CRI", dealerName:"สาขาเชียงราย",  customer:"บ.โกลเด้น ทรี โลจิส",    valueNum:2400000, discountPct:8,  status:"won",              createdAt:"28 พ.ค. 2026",  salesperson:"เกรียงไกร จ.", productLine:"RANBUILD"  },
  { id:"HQ-Q09", quoteNo:"Q-2026-0075", dealerCode:"RYG", dealerName:"สาขาระยอง",     customer:"บ.ปิโตรเคม (ไทย)",       valueNum:5100000, discountPct:5,  status:"won",              createdAt:"25 พ.ค. 2026",  salesperson:"สมชาย ว.",     productLine:"RANBUILD"  },
  { id:"HQ-Q10", quoteNo:"Q-2026-0073", dealerCode:"CNX", dealerName:"สาขาเชียงใหม่", customer:"บ.ซีเอ็นเอ็กซ์ ฟูด",    valueNum:3800000, discountPct:6,  status:"sent",             createdAt:"20 พ.ค. 2026",  salesperson:"สุรชัย ท.",    productLine:"RANBUILD"  },
  { id:"HQ-Q11", quoteNo:"Q-2026-0070", dealerCode:"MST", dealerName:"สาขาแม่สอด",    customer:"หจก. แม่สอดพาณิชย์",    valueNum:2100000, discountPct:5,  status:"won",              createdAt:"15 พ.ค. 2026",  salesperson:"อนันต์ ส.",    productLine:"CUSTOM"    },
  { id:"HQ-Q12", quoteNo:"Q-2026-0068", dealerCode:"HYI", dealerName:"สาขาหาดใหญ่",  customer:"บ.หาดใหญ่อุตสาหกรรม",   valueNum:480000,  discountPct:0,  status:"draft",            createdAt:"10 พ.ค. 2026",  salesperson:"พิมพ์ ท.",     productLine:"CUSTOM"    },
  { id:"HQ-Q13", quoteNo:"Q-2026-0065", dealerCode:"NSN", dealerName:"สาขานครสวรรค์", customer:"เทศบาลเมืองนครสวรรค์",  valueNum:900000,  discountPct:0,  status:"sent",             createdAt:"5 พ.ค. 2026",   salesperson:"ธีรพล อ.",    productLine:"PREFAB"    },
  { id:"HQ-Q14", quoteNo:"Q-2026-0062", dealerCode:"RYG", dealerName:"สาขาระยอง",     customer:"บ.เอสทีพี โฮลดิ้ง",     valueNum:1900000, discountPct:4,  status:"won",              createdAt:"1 พ.ค. 2026",   salesperson:"ประภาส ร.",    productLine:"PREFAB"    },
  { id:"HQ-Q15", quoteNo:"Q-2026-0058", dealerCode:"CNX", dealerName:"สาขาเชียงใหม่", customer:"กลุ่มเกษตรลำพูน",       valueNum:2900000, discountPct:9,  status:"lost",             createdAt:"20 เม.ย. 2026", salesperson:"วิภา ป.",      productLine:"CUSTOM"    },
  { id:"HQ-Q16", quoteNo:"Q-2026-0055", dealerCode:"CRI", dealerName:"สาขาเชียงราย",  customer:"ม.ราชภัฏเชียงราย",       valueNum:4900000, discountPct:7,  status:"draft",            createdAt:"15 เม.ย. 2026", salesperson:"สุชาติ ม.",    productLine:"CUSTOM"    },
  { id:"HQ-Q17", quoteNo:"Q-2026-0092", dealerCode:"RYG", dealerName:"สาขาระยอง",     customer:"บ.ระยองยานยนต์",         valueNum:3300000, discountPct:6,  status:"sent",             createdAt:"25 มิ.ย. 2026", salesperson:"สมชาย ว.",     productLine:"CUSTOM"    },
];

// ─── HQ ANNOUNCEMENTS ────────────────────────────────────────────────────────

export type AnnouncementCategory = "ราคา" | "โปรโมชั่น" | "นโยบาย" | "ทั่วไป";

export type HQAnnouncement = {
  id: number;
  title: string;
  body: string;
  category: AnnouncementCategory;
  publishedAt: string;
  author: string;
  targetBranches: "all" | string[];
  pinned: boolean;
};

export const hqAnnouncements: HQAnnouncement[] = [
  {
    id: 1,
    title: "ปรับราคากลาง RANBUILD และ EASYBUILD มีผล 1 ก.ค. 2026",
    body: "แจ้งให้ทุกสาขาทราบ ราคากลางผลิตภัณฑ์ RANBUILD ปรับขึ้น 3.5% และ EASYBUILD ปรับขึ้น 2.8% มีผลตั้งแต่ 1 กรกฎาคม 2569 เป็นต้นไป ใบเสนอราคาที่ออกก่อนวันดังกล่าวยังคงใช้ราคาเดิมได้ไม่เกิน 30 วัน กรุณาอัปเดตระบบก่อนออกใบเสนอราคาใหม่",
    category: "ราคา",
    publishedAt: "25 มิ.ย. 2026",
    author: "วิชัย ประสิทธิ์ (GM)",
    targetBranches: "all",
    pinned: true,
  },
  {
    id: 2,
    title: "โปรโมชั่น Q3/2026 — ส่วนลดพิเศษโครงการ SME < 3M",
    body: "เพื่อกระตุ้นยอดขาย Q3 HQ อนุมัติส่วนลดพิเศษสำหรับโครงการ SME มูลค่าต่ำกว่า 3 ล้านบาท สามารถให้ส่วนลดได้สูงสุด 12% โดยไม่ต้องผ่านกระบวนการอนุมัติ มีผลระหว่าง 1 กรกฎาคม ถึง 30 กันยายน 2569 เท่านั้น",
    category: "โปรโมชั่น",
    publishedAt: "24 มิ.ย. 2026",
    author: "ฝ่ายการตลาด",
    targetBranches: "all",
    pinned: true,
  },
  {
    id: 3,
    title: "นโยบายใหม่: การขอ Exception ส่วนลดต้องแนบ BOQ ทุกครั้ง",
    body: "ตั้งแต่วันที่ 1 กรกฎาคม 2569 การขอส่วนลดเกินเกณฑ์ทุกรายการต้องแนบ BOQ (Bill of Quantities) ประกอบด้วย หาก submission ไม่มี BOQ ระบบจะ reject อัตโนมัติ กรุณาแจ้งทีมขายในสาขาให้รับทราบ",
    category: "นโยบาย",
    publishedAt: "20 มิ.ย. 2026",
    author: "วิชัย ประสิทธิ์ (GM)",
    targetBranches: "all",
    pinned: false,
  },
  {
    id: 4,
    title: "ประชุม Sales Review Q2 — 30 มิ.ย. 2026 เวลา 13:00 น.",
    body: "ขอเชิญผู้จัดการสาขาทุกท่านเข้าร่วมประชุม Sales Review ประจำไตรมาส 2/2569 ผ่าน Zoom วันจันทร์ที่ 30 มิถุนายน เวลา 13:00–15:00 น. กรุณาเตรียมตัวเลขยอดขาย pipeline และปัญหาที่ต้องการ support จาก HQ",
    category: "ทั่วไป",
    publishedAt: "18 มิ.ย. 2026",
    author: "ฝ่ายปฏิบัติการ",
    targetBranches: "all",
    pinned: false,
  },
  {
    id: 5,
    title: "สาขาเหนือ: สนับสนุนงบ Co-Marketing Q3 สูงสุด 50,000 บาท",
    body: "HQ อนุมัติงบสนับสนุน Co-Marketing สำหรับสาขาภาคเหนือ (CNX, CRI, MST) มูลค่าสูงสุดสาขาละ 50,000 บาทสำหรับ Q3/2569 สามารถใช้งบนี้ในกิจกรรม นิทรรศการ โฆษณาท้องถิ่น หรือ Demo Day กรุณายื่นแผนงานกลับมาภายใน 5 กรกฎาคม",
    category: "โปรโมชั่น",
    publishedAt: "15 มิ.ย. 2026",
    author: "ฝ่ายการตลาด",
    targetBranches: ["CNX", "CRI", "MST"],
    pinned: false,
  },
  {
    id: 6,
    title: "อัปเดตเอกสาร: Template สัญญาก่อสร้างฉบับใหม่ 2026",
    body: "ฝ่ายกฎหมายได้อัปเดต Template สัญญาก่อสร้างให้สอดคล้องกับ พ.ร.บ. คุ้มครองผู้บริโภค ฉบับปรับปรุง กรุณาใช้ Template ใหม่สำหรับสัญญาที่ลงนามตั้งแต่เดือนกรกฎาคม 2569 เป็นต้นไป Template พร้อมดาวน์โหลดในระบบ Document Library",
    category: "นโยบาย",
    publishedAt: "10 มิ.ย. 2026",
    author: "ฝ่ายกฎหมาย",
    targetBranches: "all",
    pinned: false,
  },
  {
    id: 7,
    title: "ผลการประเมิน KPI สาขา Q1/2026 — สรุป",
    body: "ผลการประเมิน KPI ไตรมาส 1/2569: สาขาระยองและเชียงใหม่ทำได้เกินเป้า ได้รับ bonus ตามเกณฑ์ สาขาเชียงรายและหาดใหญ่ต่ำกว่าเป้า HQ จะนัดประชุม one-on-one เพื่อวางแผนแก้ไขในสัปดาห์หน้า",
    category: "ทั่วไป",
    publishedAt: "5 มิ.ย. 2026",
    author: "วิชัย ประสิทธิ์ (GM)",
    targetBranches: "all",
    pinned: false,
  },
];

