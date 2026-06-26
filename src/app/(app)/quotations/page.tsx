"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  quotations as INIT_Q, customers, projects, leads,
  quotationStatusLabel, quotationStatusColor,
  projectStatusLabel, projectStatusColor,
  type QuotationStatus, type QuotationMock,
} from "@/lib/mock";
import {
  Plus, Search, X, FileText, LayoutList, LayoutGrid,
  Download, Edit2, Trash2, ChevronUp, ChevronDown,
  Building2, MapPin, Calendar, ExternalLink, ArrowRight,
} from "lucide-react";

// ── Tokens ────────────────────────────────────────────────────
const PRIMARY = "#003366";
const STEEL   = "#2D2D2D";
const BORDER  = "#e5e7eb";
const MUTED   = "#6b7280";
const CARD: React.CSSProperties = { background:"#fff", borderRadius:16, border:`1px solid ${BORDER}`, boxShadow:"0 2px 14px rgba(0,0,0,.07)" };

// ── Status workflow (HQ Approval Flow) ───────────────────────────────────
// Dealer: draft → pending_hq (ส่ง HQ อนุมัติ)
// HQ: pending_hq → approved / rejected
// After approved: sent_to_client → won / lost
const STATUS_ORDER: QuotationStatus[] = ["draft","pending_hq","approved","sent_to_client","won","lost","expired","rejected"];

const STATUS_ACTIONS: Record<QuotationStatus,{label:string;next:QuotationStatus;bg:string;color:string;hqOnly?:boolean}[]> = {
  draft:          [
    {label:"ส่ง HQ อนุมัติ", next:"pending_hq", bg:"#dce5f0", color:"#d97706"},
  ],
  pending_hq:     [
    {label:"✓ อนุมัติ (HQ)", next:"approved",  bg:"#e5faf0", color:"#059669", hqOnly:true},
    {label:"ปฏิเสธ (HQ)",    next:"rejected",  bg:"#fee2e2", color:"#dc2626", hqOnly:true},
  ],
  approved:       [
    {label:"ส่งให้ลูกค้า",  next:"sent_to_client", bg:"#dce5f0", color:PRIMARY},
    {label:"หมดอายุ",        next:"expired",        bg:"#f0f0f5", color:"#6b7280"},
  ],
  sent_to_client: [
    {label:"ลูกค้ายืนยัน → ปิดการขาย ✓", next:"won",  bg:"#e5faf0", color:"#059669"},
    {label:"ลูกค้าปฏิเสธ",                 next:"lost", bg:"#fee2e2", color:"#dc2626"},
  ],
  won:      [],
  lost:     [{label:"เปิดร่างใหม่", next:"draft", bg:"#f0f0f5", color:"#6b7280"}],
  rejected: [{label:"เปิดร่างใหม่", next:"draft", bg:"#f0f0f5", color:"#6b7280"}],
  expired:  [{label:"เปิดร่างใหม่", next:"draft", bg:"#f0f0f5", color:"#6b7280"}],
};

// ── Types ─────────────────────────────────────────────────────
type SortKey = "id"|"customer"|"project"|"totalValue"|"date"|"status";
type SortDir = "asc"|"desc";
type QForm = {
  customerId:number; customer:string;
  project:string; projectId:number;
  province:string; buildingType:string; area:number;
  materialCost:number;
  status:QuotationStatus; date:string; items:number;
};

const BUILDING_TYPES = ["โกดังสินค้า","โรงงาน","งานตามแบบ","อาคารพาณิชย์","เกษตรกรรม","อื่นๆ"];

// ── Helpers ───────────────────────────────────────────────────
function fmtMoney(v:number){ return "฿"+v.toLocaleString("th-TH"); }
function fmtDate(d:string){ if(!d||d==="—") return "—"; const [y,m,day]=d.split("-"); const mo=["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."]; return `${parseInt(day)} ${mo[parseInt(m)-1]} ${parseInt(y)+543}`; }
function nextQId(data:QuotationMock[]){
  const nums = data.map(q=>parseInt(q.id.split("-")[2]??"")||0);
  return `Q-2026-${String(Math.max(...nums,100)+1).padStart(4,"0")}`;
}
function exportCSV(rows:QuotationMock[]){
  const header=["เลขที่","ลูกค้า","โครงการ","จังหวัด","ประเภท","พื้นที่","มูลค่ารวม","สถานะ","วันที่"];
  const lines=rows.map(q=>[q.id,q.customer,q.project,q.province,q.buildingType,q.area,q.totalValue,quotationStatusLabel[q.status],q.date].join(","));
  const blob=new Blob(["﻿"+[header.join(","),...lines].join("\n")],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="quotations.csv"; a.click(); URL.revokeObjectURL(url);
}

// ── Add / Edit Modal ──────────────────────────────────────────
const TODAY = "2026-06-23";
function buildBlank(): QForm {
  const c=customers[0];
  return { customerId:c.id, customer:c.company, project:"", projectId:0, province:c.province, buildingType:"โกดังสินค้า", area:0, materialCost:0, status:"draft", date:TODAY, items:0 };
}

function QuotationModal({ initial, title, onSave, onClose }:{
  initial:QForm; title:string; onSave:(f:QForm)=>void; onClose:()=>void;
}){
  const [form,setForm]=useState<QForm>(initial);
  const INP:React.CSSProperties={width:"100%",border:`1px solid ${BORDER}`,borderRadius:9,padding:"8px 12px",fontSize:"0.82rem",outline:"none",color:STEEL,boxSizing:"border-box"};
  const LBL:React.CSSProperties={fontSize:"0.68rem",fontWeight:700,color:MUTED,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.04em"};
  function set<K extends keyof QForm>(k:K,v:QForm[K]){setForm(p=>({...p,[k]:v}));}
  const total=form.materialCost;
  function pickCustomer(id:number){
    const c=customers.find(c=>c.id===id);
    if(!c) return;
    setForm(p=>({...p,customerId:c.id,customer:c.company,province:p.province||c.province}));
  }
  function submit(){if(!form.customer||!form.project)return; onSave(form); onClose();}
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(45,45,45,.4)",zIndex:200}}/>
      <div onClick={e=>e.stopPropagation()} style={{position:"fixed",inset:0,zIndex:210,display:"flex",alignItems:"center",justifyContent:"center",padding:20,pointerEvents:"none"}}>
        <div style={{...CARD,width:"100%",maxWidth:580,pointerEvents:"auto",overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,.2)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:`1px solid ${BORDER}`,background:PRIMARY}}>
            <div style={{fontSize:"0.92rem",fontWeight:800,color:"#fff"}}>{title}</div>
            <button onClick={onClose} style={{width:28,height:28,borderRadius:8,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.1)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={13}/></button>
          </div>
          <div style={{padding:"20px 22px",overflowY:"auto",maxHeight:"68vh",display:"flex",flexDirection:"column",gap:14}}>
            {/* Customer */}
            <div>
              <label style={LBL}>ลูกค้า *</label>
              <select value={form.customerId} onChange={e=>pickCustomer(Number(e.target.value))} style={INP}>
                {customers.map(c=><option key={c.id} value={c.id}>{c.company}</option>)}
                <option value={0}>— อื่นๆ (พิมพ์เอง) —</option>
              </select>
              {form.customerId===0&&<input value={form.customer} onChange={e=>set("customer",e.target.value)} placeholder="ชื่อบริษัท..." style={{...INP,marginTop:6}}/>}
            </div>
            {/* Project */}
            <div>
              <label style={LBL}>ชื่อโครงการ *</label>
              <input value={form.project} onChange={e=>set("project",e.target.value)} placeholder="เช่น โกดังสินค้า ABC" style={INP}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label style={LBL}>จังหวัด</label>
                <input value={form.province} onChange={e=>set("province",e.target.value)} placeholder="จังหวัด" style={INP}/>
              </div>
              <div>
                <label style={LBL}>ประเภทอาคาร</label>
                <select value={form.buildingType} onChange={e=>set("buildingType",e.target.value)} style={INP}>
                  {BUILDING_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={LBL}>พื้นที่ (ตร.ม.)</label>
                <input type="number" value={form.area||""} onChange={e=>set("area",Number(e.target.value))} placeholder="0" style={INP}/>
              </div>
              <div>
                <label style={LBL}>จำนวนรายการ</label>
                <input type="number" value={form.items||""} onChange={e=>set("items",Number(e.target.value))} placeholder="0" style={INP}/>
              </div>
              <div>
                <label style={LBL}>มูลค่า (บาท)</label>
                <input type="number" value={form.materialCost||""} onChange={e=>set("materialCost",Number(e.target.value))} placeholder="0" style={INP}/>
              </div>
            </div>
            {/* Total preview */}
            {total>0&&<div style={{padding:"10px 14px",background:"#dce5f0",borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:"0.72rem",fontWeight:700,color:MUTED}}>มูลค่ารวม (คำนวณ)</span>
              <span style={{fontSize:"1.05rem",fontWeight:800,color:PRIMARY}}>{fmtMoney(total)}</span>
            </div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label style={LBL}>สถานะ</label>
                <select value={form.status} onChange={e=>set("status",e.target.value as QuotationStatus)} style={INP}>
                  {STATUS_ORDER.map(s=><option key={s} value={s}>{quotationStatusLabel[s]}</option>)}
                </select>
              </div>
              <div>
                <label style={LBL}>วันที่</label>
                <input type="date" value={form.date} onChange={e=>set("date",e.target.value)} style={INP}/>
              </div>
            </div>
          </div>
          <div style={{padding:"13px 22px",borderTop:`1px solid ${BORDER}`,display:"flex",gap:8,justifyContent:"flex-end",background:"#fafafa"}}>
            <button onClick={onClose} style={{padding:"8px 18px",borderRadius:9,border:`1px solid ${BORDER}`,background:"#fff",color:STEEL,fontSize:"0.78rem",fontWeight:600,cursor:"pointer"}}>ยกเลิก</button>
            <button onClick={submit} style={{padding:"8px 22px",borderRadius:9,border:"none",background:PRIMARY,color:"#fff",fontSize:"0.78rem",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 12px rgba(0,0,0,.3)"}}>บันทึก</button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function QuotationsPage(){
  const router = useRouter();
  const [data, setData]             = useState<QuotationMock[]>(INIT_Q);
  const [query, setQuery]           = useState("");
  const [filterStatus, setFilterStatus] = useState<QuotationStatus|"ALL">("ALL");
  const [view, setView]             = useState<"list"|"card">("list");
  const [sortKey, setSortKey]       = useState<SortKey>("date");
  const [sortDir, setSortDir]       = useState<SortDir>("desc");
  const [selected, setSelected]     = useState<QuotationMock|null>(null);
  const [showModal, setShowModal]   = useState(false);
  const [editingQ, setEditingQ]     = useState<QuotationMock|null>(null);
  const [delConfirm, setDelConfirm] = useState(false);
  const [detailTab, setDetailTab]   = useState<"info"|"customer"|"project"|"lead">("info");

  function handleSort(k:SortKey){ if(sortKey===k) setSortDir(d=>d==="asc"?"desc":"asc"); else{setSortKey(k);setSortDir("asc");} }
  const SortIcon=({k}:{k:SortKey})=>sortKey===k?(sortDir==="asc"?<ChevronUp size={10} style={{marginLeft:2}}/>:<ChevronDown size={10} style={{marginLeft:2}}/>):<ChevronDown size={10} style={{marginLeft:2,opacity:.3}}/>;

  const filtered = useMemo(()=>{
    let rows=data.filter(q=>{
      const matchQ=!query||q.id.toLowerCase().includes(query.toLowerCase())||q.customer.toLowerCase().includes(query.toLowerCase())||q.project.toLowerCase().includes(query.toLowerCase())||q.province?.includes(query);
      const matchS=filterStatus==="ALL"||q.status===filterStatus;
      return matchQ&&matchS;
    });
    rows=[...rows].sort((a,b)=>{
      const va:string|number=a[sortKey] as string|number;
      const vb:string|number=b[sortKey] as string|number;
      const cmp=typeof va==="number"?(va as number)-(vb as number):(va as string).localeCompare(vb as string,"th");
      return sortDir==="asc"?cmp:-cmp;
    });
    return rows;
  },[data,query,filterStatus,sortKey,sortDir]);

  const totalWon     = data.filter(q=>q.status==="won").reduce((s,q)=>s+q.totalValue,0);
  const totalPending = data.filter(q=>q.status==="sent_to_client").reduce((s,q)=>s+q.totalValue,0);
  const totalApproved= data.filter(q=>q.status==="approved").reduce((s,q)=>s+q.totalValue,0);

  // Related data for selected quotation
  const relCustomer  = selected ? customers.find(c=>c.id===selected.customerId) : null;
  const relProject   = selected ? projects.find(p=>p.id===selected.projectId) : null;
  const relLead      = selected ? leads.find(l=>l.company===selected.customer) : null;

  function openAdd(){ setEditingQ(null); setShowModal(true); }
  function openEdit(q:QuotationMock){ setEditingQ(q); setShowModal(true); }

  function saveQ(form:QForm){
    const tv=form.materialCost;
    const total=fmtMoney(tv);
    if(editingQ){
      setData(p=>p.map(q=>q.id===editingQ.id?{...q,...form,total,totalValue:tv}:q));
      setSelected(p=>p?.id===editingQ.id?{...p,...form,total,totalValue:tv}:p);
    } else {
      const newQ:QuotationMock={...form,id:nextQId(data),total,totalValue:tv};
      setData(p=>[newQ,...p]);
    }
  }
  function changeStatus(id:string,s:QuotationStatus){
    setData(p=>p.map(q=>q.id===id?{...q,status:s}:q));
    setSelected(p=>p?.id===id?{...p,status:s}:p);
  }
  function deleteQ(){
    if(!selected) return;
    setData(p=>p.filter(q=>q.id!==selected.id));
    setSelected(null); setDelConfirm(false);
  }
  function selectRow(q:QuotationMock){
    setSelected(p=>p?.id===q.id?null:q);
    setDetailTab("info"); setDelConfirm(false);
  }

  const detailTabs:[string,string][]=[["info","ข้อมูล"],["customer","ลูกค้า"],["project","โครงการ"],["lead","ลีด"]];

  // form initial for edit
  function toForm(q:QuotationMock):QForm{
    return {customerId:q.customerId,customer:q.customer,project:q.project,projectId:q.projectId??0,province:q.province,buildingType:q.buildingType,area:q.area,materialCost:q.materialCost,status:q.status,date:q.date,items:q.items};
  }

  return (
    <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>

      {/* ══ MAIN ════════════════════════════════════════════ */}
      <div style={{flex:1,minWidth:0}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <div>
            <h1 style={{fontSize:"1.55rem",fontWeight:800,color:STEEL,lineHeight:1.2,margin:0}}>ใบเสนอราคา</h1>
            <div style={{fontSize:"0.76rem",color:MUTED,marginTop:4}}>จัดการใบเสนอราคาและติดตามสถานะ</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>exportCSV(filtered)}
              style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:99,border:`1px solid ${BORDER}`,background:"#fff",color:STEEL,fontSize:"0.75rem",fontWeight:600,cursor:"pointer"}}>
              <Download size={13}/> ส่งออก
            </button>
            <button onClick={openAdd}
              style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:99,border:"none",background:PRIMARY,color:"#fff",fontSize:"0.75rem",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 10px rgba(0,0,0,.22)"}}>
              <Plus size={13}/> เพิ่มใบเสนอราคา
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
          {[
            {label:"ทั้งหมด",    value:data.length,                  color:"#003366",  key:"ALL"},
            {label:"ปิดการขาย",  value:`฿${(totalWon/1e6).toFixed(1)}M`,    color:"#059669",  key:"won"},
            {label:"ส่งให้ลูกค้า",value:`฿${(totalPending/1e6).toFixed(1)}M`, color:"#f59e0b",  key:"sent_to_client"},
            {label:"อนุมัติแล้ว",value:`฿${(totalApproved/1e6).toFixed(1)}M`,color:"#003366", key:"approved"},
          ].map((s,i)=>(
            <div key={i} onClick={()=>setFilterStatus(s.key as "ALL"|QuotationStatus)}
              style={{...CARD,padding:"14px 16px",cursor:"pointer"}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(0,0,0,.12)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 2px 14px rgba(0,0,0,.07)";}}>
              <div style={{fontSize:"0.7rem",color:MUTED,fontWeight:600,marginBottom:6}}>{s.label}</div>
              <div style={{fontSize:typeof s.value==="number"?"1.5rem":"1.1rem",fontWeight:800,color:s.color}}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Status filter pills */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          <button onClick={()=>setFilterStatus("ALL")}
            style={{padding:"5px 14px",borderRadius:99,border:`1px solid ${filterStatus==="ALL"?PRIMARY:BORDER}`,background:filterStatus==="ALL"?"#dce5f0":"#fff",color:filterStatus==="ALL"?PRIMARY:MUTED,fontSize:"0.72rem",fontWeight:600,cursor:"pointer"}}>
            ทั้งหมด ({data.length})
          </button>
          {STATUS_ORDER.map(s=>{
            const c=quotationStatusColor[s]; const cnt=data.filter(q=>q.status===s).length; const active=filterStatus===s;
            return cnt>0?(
              <button key={s} onClick={()=>setFilterStatus(s)}
                style={{padding:"5px 14px",borderRadius:99,border:`1px solid ${active?c.text+"60":BORDER}`,background:active?c.bg:"#fff",color:active?c.text:MUTED,fontSize:"0.72rem",fontWeight:600,cursor:"pointer"}}>
                {quotationStatusLabel[s]} ({cnt})
              </button>
            ):null;
          })}
        </div>

        {/* Toolbar */}
        <div style={{...CARD,borderRadius:"14px 14px 0 0",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"none",gap:10,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"#fafafa",border:`1px solid ${BORDER}`,borderRadius:10,padding:"7px 12px",minWidth:280}}>
            <Search size={13} color={MUTED}/>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ค้นหาเลขที่ / ลูกค้า / โครงการ..."
              style={{border:"none",outline:"none",fontSize:"0.78rem",color:STEEL,background:"transparent",flex:1}}/>
            {query&&<button onClick={()=>setQuery("")} style={{background:"none",border:"none",cursor:"pointer",padding:0,color:MUTED,display:"flex"}}><X size={12}/></button>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",alignItems:"center",background:"#f0f4f8",borderRadius:99,padding:3,border:`1px solid ${BORDER}`}}>
              {(["list","card"] as const).map(v=>(
                <button key={v} onClick={()=>setView(v)}
                  style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:99,border:"none",background:view===v?PRIMARY:"transparent",color:view===v?"#fff":MUTED,fontSize:"0.71rem",fontWeight:700,cursor:"pointer",transition:"all .15s"}}>
                  {v==="list"?<LayoutList size={12}/>:<LayoutGrid size={12}/>}
                  {v==="list"?"รายการ":"การ์ด"}
                </button>
              ))}
            </div>
            <span style={{fontSize:"0.72rem",color:MUTED}}>แสดง {filtered.length}/{data.length}</span>
          </div>
        </div>

        {/* ── LIST VIEW ── */}
        {view==="list"&&(
          <div style={{...CARD,borderRadius:"0 0 14px 14px",borderTop:"none"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{borderBottom:`1px solid ${BORDER}`,background:"#f8f9fb"}}>
                    {([{label:"เลขที่",key:"id"},{label:"ลูกค้า",key:"customer"},{label:"โครงการ / จังหวัด",key:"project"},{label:"ประเภท / ขนาด",key:null},{label:"มูลค่า",key:"totalValue"},{label:"สถานะ",key:"status"},{label:"วันที่",key:"date"},{label:"",key:null}] as {label:string;key:SortKey|null}[]).map((col,i)=>(
                      <th key={i} onClick={col.key?()=>handleSort(col.key as SortKey):undefined}
                        style={{fontSize:"0.63rem",fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:"0.05em",padding:"10px 14px",textAlign:"left",whiteSpace:"nowrap",cursor:col.key?"pointer":"default",userSelect:"none"}}>
                        <span style={{display:"inline-flex",alignItems:"center"}}>{col.label}{col.key&&<SortIcon k={col.key}/>}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length===0&&<tr><td colSpan={8} style={{textAlign:"center",padding:"40px 0",color:MUTED,fontSize:"0.82rem"}}>ไม่พบใบเสนอราคา</td></tr>}
                  {filtered.map(q=>{
                    const sc=quotationStatusColor[q.status]; const isSel=selected?.id===q.id;
                    return (
                      <tr key={q.id} onClick={()=>selectRow(q)}
                        style={{borderBottom:"1px solid #f0f4f8",cursor:"pointer",background:isSel?"#f0f6ff":undefined,transition:"background .1s"}}
                        onMouseEnter={e=>{if(!isSel)(e.currentTarget as HTMLElement).style.background="#f8f9fb";}}
                        onMouseLeave={e=>{if(!isSel)(e.currentTarget as HTMLElement).style.background="";}}>
                        <td style={{padding:"11px 14px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{width:28,height:28,borderRadius:8,background:"#dce5f0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><FileText size={12} color={PRIMARY}/></div>
                            <span style={{fontSize:"0.78rem",fontWeight:700,color:STEEL,fontFamily:"monospace"}}>{q.id}</span>
                          </div>
                        </td>
                        <td style={{padding:"11px 14px"}}>
                          <button onClick={e=>{e.stopPropagation();router.push(`/customers/${q.customerId}`);}}
                            style={{background:"none",border:"none",cursor:"pointer",color:PRIMARY,fontSize:"0.82rem",fontWeight:700,padding:0,textAlign:"left"}}>
                            {q.customer}
                          </button>
                        </td>
                        <td style={{padding:"11px 14px",maxWidth:180}}>
                          <div style={{fontSize:"0.78rem",color:STEEL,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{q.project}</div>
                          <div style={{fontSize:"0.64rem",color:MUTED,marginTop:1}}>{q.province}</div>
                        </td>
                        <td style={{padding:"11px 14px"}}>
                          <div style={{fontSize:"0.72rem",color:STEEL,fontWeight:600}}>{q.buildingType}</div>
                          <div style={{fontSize:"0.64rem",color:MUTED}}>{q.area?.toLocaleString()} ม²</div>
                        </td>
                        <td style={{padding:"11px 14px",fontSize:"0.88rem",fontWeight:800,color:STEEL,whiteSpace:"nowrap"}}>{q.total}</td>
                        <td style={{padding:"11px 14px"}}>
                          <span style={{display:"inline-block",padding:"3px 10px",borderRadius:99,fontSize:"0.67rem",fontWeight:700,background:sc.bg,color:sc.text,whiteSpace:"nowrap"}}>{quotationStatusLabel[q.status]}</span>
                        </td>
                        <td style={{padding:"11px 14px",fontSize:"0.75rem",color:MUTED,whiteSpace:"nowrap"}}>{fmtDate(q.date)}</td>
                        <td style={{padding:"11px 14px"}} onClick={e=>e.stopPropagation()}>
                          <div style={{display:"flex",gap:4}}>
                            {q.status==="draft"&&(
                              <button onClick={()=>changeStatus(q.id,"pending_hq")}
                                style={{padding:"4px 9px",borderRadius:7,border:"none",background:"#d97706",color:"#fff",fontSize:"0.67rem",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>ส่ง HQ</button>
                            )}
                            <button onClick={()=>openEdit(q)}
                              style={{padding:"4px 9px",borderRadius:7,border:`1px solid ${BORDER}`,background:"#fff",color:PRIMARY,fontSize:"0.67rem",fontWeight:600,cursor:"pointer"}}>แก้ไข</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{padding:"10px 16px",borderTop:`1px solid ${BORDER}`}}>
              <span style={{fontSize:"0.72rem",color:MUTED}}>แสดง {filtered.length} จาก {data.length} รายการ</span>
            </div>
          </div>
        )}

        {/* ── CARD VIEW ── */}
        {view==="card"&&(
          <div style={{...CARD,borderRadius:"0 0 14px 14px",borderTop:"none",padding:16}}>
            {filtered.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:MUTED,fontSize:"0.82rem"}}>ไม่พบใบเสนอราคา</div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
              {filtered.map(q=>{
                const sc=quotationStatusColor[q.status]; const isSel=selected?.id===q.id;
                return (
                  <div key={q.id} onClick={()=>selectRow(q)}
                    style={{background:"#fff",borderRadius:14,border:isSel?`1.5px solid ${PRIMARY}`:`1px solid ${BORDER}`,boxShadow:isSel?"0 4px 18px rgba(0,0,0,.15)":"0 2px 10px rgba(0,0,0,.06)",cursor:"pointer",overflow:"hidden",transition:"all .15s"}}
                    onMouseEnter={e=>{if(!isSel)(e.currentTarget as HTMLElement).style.boxShadow="0 6px 22px rgba(0,0,0,.13)";}}
                    onMouseLeave={e=>{if(!isSel)(e.currentTarget as HTMLElement).style.boxShadow="0 2px 10px rgba(0,0,0,.06)";}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",borderBottom:"1px solid #f0f4f8"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:28,height:28,borderRadius:8,background:"#dce5f0",display:"flex",alignItems:"center",justifyContent:"center"}}><FileText size={12} color={PRIMARY}/></div>
                        <span style={{fontSize:"0.77rem",fontWeight:700,color:STEEL,fontFamily:"monospace"}}>{q.id}</span>
                      </div>
                      <span style={{display:"inline-block",padding:"2px 9px",borderRadius:99,fontSize:"0.63rem",fontWeight:700,background:sc.bg,color:sc.text,whiteSpace:"nowrap"}}>{quotationStatusLabel[q.status]}</span>
                    </div>
                    <div style={{padding:"12px 14px"}}>
                      <button onClick={e=>{e.stopPropagation();router.push(`/customers/${q.customerId}`);}}
                        style={{background:"none",border:"none",cursor:"pointer",color:PRIMARY,fontSize:"0.92rem",fontWeight:800,padding:0,textAlign:"left",display:"block",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%"}}>
                        {q.customer}
                      </button>
                      <div style={{fontSize:"0.72rem",color:MUTED,marginBottom:8,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{q.project} · {q.province}</div>
                      <div style={{display:"flex",gap:0,borderRadius:9,overflow:"hidden",border:"1px solid #f0f4f8",marginBottom:10}}>
                        {[{label:"พื้นที่",value:`${q.area?.toLocaleString()} ม²`},{label:"ประเภท",value:q.buildingType}].map((item,i)=>(
                          <div key={i} style={{flex:1,padding:"6px 8px",background:i%2===0?"#fafafa":"#f3f6fb",borderRight:i<1?"1px solid #f0f4f8":"none",textAlign:"center"}}>
                            <div style={{fontSize:"0.58rem",color:"#9ca3af",fontWeight:600,marginBottom:2}}>{item.label}</div>
                            <div style={{fontSize:"0.68rem",color:STEEL,fontWeight:700}}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{fontSize:"1.15rem",fontWeight:800,color:PRIMARY}}>{q.total}</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 14px",borderTop:"1px solid #f0f4f8",background:"#fafbfc"}}>
                      <span style={{fontSize:"0.68rem",color:MUTED}}>{fmtDate(q.date)}</span>
                      <div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
                        {q.status==="draft"&&(
                          <button onClick={()=>changeStatus(q.id,"pending_hq")}
                            style={{padding:"4px 9px",borderRadius:7,border:"none",background:"#d97706",color:"#fff",fontSize:"0.65rem",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>ส่ง HQ</button>
                        )}
                        <button onClick={()=>openEdit(q)}
                          style={{padding:"4px 9px",borderRadius:7,border:`1px solid ${BORDER}`,background:"#fff",color:PRIMARY,fontSize:"0.65rem",fontWeight:600,cursor:"pointer"}}>แก้ไข</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ══ DETAIL PANEL ════════════════════════════════════ */}
      {selected&&(
        <div style={{width:340,flexShrink:0,position:"sticky",top:80,maxHeight:"calc(100vh - 100px)",overflowY:"auto"}}>
          <div style={{...CARD,overflow:"hidden"}}>

            {/* Panel header */}
            <div style={{background:PRIMARY,padding:"16px 16px 12px"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{fontSize:"0.64rem",fontWeight:700,color:"rgba(255,255,255,.55)",fontFamily:"monospace",letterSpacing:"0.05em"}}>{selected.id}</div>
                  <div style={{fontSize:"0.88rem",fontWeight:800,color:"#fff",lineHeight:1.25,marginTop:2,maxWidth:240,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selected.customer}</div>
                  <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,.65)",marginTop:2,maxWidth:240,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selected.project}</div>
                </div>
                <button onClick={()=>setSelected(null)} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginLeft:8}}>
                  <X size={14}/>
                </button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                <span style={{padding:"2px 10px",borderRadius:99,fontSize:"0.63rem",fontWeight:700,background:quotationStatusColor[selected.status].bg,color:quotationStatusColor[selected.status].text}}>
                  {quotationStatusLabel[selected.status]}
                </span>
                <span style={{fontSize:"0.88rem",fontWeight:800,color:"rgba(255,255,255,.9)"}}>{selected.total}</span>
              </div>
            </div>

            {/* Tabs */}
            <div style={{display:"flex",borderBottom:`1px solid ${BORDER}`,overflowX:"auto"}}>
              {detailTabs.map(([key,label])=>(
                <button key={key} onClick={()=>setDetailTab(key as typeof detailTab)}
                  style={{padding:"9px 12px",border:"none",background:"none",cursor:"pointer",fontSize:"0.67rem",fontWeight:detailTab===key?700:500,color:detailTab===key?PRIMARY:MUTED,borderBottom:detailTab===key?`2px solid ${PRIMARY}`:"2px solid transparent",whiteSpace:"nowrap",marginBottom:-1}}>
                  {label}
                </button>
              ))}
            </div>

            {/* Tab: ข้อมูล */}
            {detailTab==="info"&&(
              <div style={{padding:"14px 16px"}}>
                {/* Price */}
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:"0.63rem",fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>มูลค่า</div>
                  <div style={{padding:"12px 14px",background:"#dce5f0",borderRadius:11,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:"0.7rem",fontWeight:700,color:MUTED}}>มูลค่ารวม</span>
                    <span style={{fontSize:"1.2rem",fontWeight:800,color:PRIMARY}}>{selected.total}</span>
                  </div>
                </div>
                {/* Details */}
                <div style={{fontSize:"0.63rem",fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>รายละเอียด</div>
                {[
                  {label:"จังหวัด",val:selected.province},{label:"ประเภทอาคาร",val:selected.buildingType},
                  {label:"พื้นที่",val:`${selected.area?.toLocaleString()} ตร.ม.`},{label:"จำนวนรายการ",val:`${selected.items} รายการ`},
                  {label:"วันที่",val:fmtDate(selected.date)},
                ].map((r,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<4?"1px solid #f0f4f8":"none"}}>
                    <span style={{fontSize:"0.72rem",color:MUTED,fontWeight:600}}>{r.label}</span>
                    <span style={{fontSize:"0.76rem",color:STEEL,fontWeight:700}}>{r.val}</span>
                  </div>
                ))}
                {/* Status workflow */}
                {STATUS_ACTIONS[selected.status].length>0&&(
                  <div style={{marginTop:14}}>
                    <div style={{fontSize:"0.63rem",fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>เปลี่ยนสถานะ</div>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {STATUS_ACTIONS[selected.status].map(action=>(
                        <button key={action.next} onClick={()=>changeStatus(selected.id,action.next)}
                          style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",borderRadius:10,background:action.bg,border:"none",cursor:"pointer",width:"100%"}}>
                          <span style={{fontSize:"0.76rem",fontWeight:700,color:action.color}}>{action.label}</span>
                          <ArrowRight size={13} color={action.color}/>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: ลูกค้า */}
            {detailTab==="customer"&&(
              <div style={{padding:"14px 16px"}}>
                {relCustomer?(
                  <>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                      <div style={{width:44,height:44,borderRadius:13,background:relCustomer.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:"1rem",flexShrink:0}}>
                        {relCustomer.initials}
                      </div>
                      <div>
                        <div style={{fontSize:"0.88rem",fontWeight:800,color:STEEL}}>{relCustomer.company}</div>
                        <div style={{fontSize:"0.7rem",color:MUTED,marginTop:2}}>{relCustomer.name}</div>
                      </div>
                    </div>
                    {[{label:"โทรศัพท์",val:relCustomer.phone},{label:"อีเมล",val:relCustomer.email},{label:"จังหวัด",val:relCustomer.province},{label:"หมวด",val:relCustomer.category},{label:"โครงการ",val:`${relCustomer.projectCount} โครงการ`}].map((r,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<4?"1px solid #f0f4f8":"none"}}>
                        <span style={{fontSize:"0.7rem",color:MUTED,fontWeight:600}}>{r.label}</span>
                        <span style={{fontSize:"0.75rem",color:STEEL,fontWeight:700,maxWidth:160,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.val}</span>
                      </div>
                    ))}
                    {relCustomer.tags.length>0&&(
                      <div style={{marginTop:10,display:"flex",gap:5,flexWrap:"wrap"}}>
                        {relCustomer.tags.map(t=><span key={t} style={{padding:"2px 9px",borderRadius:99,fontSize:"0.63rem",fontWeight:700,background:"#dce5f0",color:PRIMARY}}>{t}</span>)}
                      </div>
                    )}
                    <button onClick={()=>router.push(`/customers/${relCustomer.id}`)}
                      style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",padding:"9px 0",borderRadius:10,background:PRIMARY,color:"#fff",border:"none",fontSize:"0.76rem",fontWeight:700,cursor:"pointer",marginTop:14}}>
                      <ExternalLink size={13}/> ดูข้อมูลลูกค้าเต็ม
                    </button>
                  </>
                ):(
                  <div style={{textAlign:"center",padding:"28px 0",color:MUTED,fontSize:"0.78rem"}}>ไม่พบข้อมูลลูกค้า</div>
                )}
              </div>
            )}

            {/* Tab: โครงการ */}
            {detailTab==="project"&&(
              <div style={{padding:"14px 16px"}}>
                {relProject?(
                  <>
                    <div style={{fontSize:"0.9rem",fontWeight:800,color:STEEL,marginBottom:4}}>{relProject.title}</div>
                    <div style={{fontSize:"0.72rem",color:MUTED,marginBottom:14}}>{relProject.client}</div>
                    <div style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontSize:"0.7rem",color:MUTED,fontWeight:600}}>ความคืบหน้า</span>
                        <span style={{fontSize:"0.7rem",fontWeight:700,color:PRIMARY}}>{relProject.progress}%</span>
                      </div>
                      <div style={{height:6,borderRadius:99,background:"#f0f4f8",overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${relProject.progress}%`,background:PRIMARY,borderRadius:99,transition:"width .3s"}}/>
                      </div>
                    </div>
                    {[{label:"สถานะ",val:<span style={{padding:"2px 8px",borderRadius:99,fontSize:"0.65rem",fontWeight:700,background:projectStatusColor[relProject.status].bg,color:projectStatusColor[relProject.status].text,whiteSpace:"nowrap"}}>{projectStatusLabel[relProject.status]}</span>},{label:"มูลค่า",val:relProject.value},{label:"เริ่ม",val:relProject.start},{label:"ครบ",val:relProject.due}].map((r,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:i<3?"1px solid #f0f4f8":"none"}}>
                        <span style={{fontSize:"0.7rem",color:MUTED,fontWeight:600}}>{r.label}</span>
                        <span style={{fontSize:"0.75rem",color:STEEL,fontWeight:700}}>{r.val}</span>
                      </div>
                    ))}
                    <button onClick={()=>router.push(`/projects/${relProject.id}`)}
                      style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",padding:"9px 0",borderRadius:10,background:PRIMARY,color:"#fff",border:"none",fontSize:"0.76rem",fontWeight:700,cursor:"pointer",marginTop:14}}>
                      <ExternalLink size={13}/> ดูโครงการเต็ม
                    </button>
                  </>
                ):(
                  <div style={{textAlign:"center",padding:"28px 0",color:MUTED,fontSize:"0.78rem"}}>ไม่พบข้อมูลโครงการ</div>
                )}
              </div>
            )}

            {/* Tab: ลีด */}
            {detailTab==="lead"&&(
              <div style={{padding:"14px 16px"}}>
                {relLead?(
                  <>
                    <div style={{fontSize:"0.88rem",fontWeight:800,color:STEEL,marginBottom:2}}>{relLead.company}</div>
                    <div style={{fontSize:"0.7rem",color:MUTED,marginBottom:14}}>{relLead.contact} · {relLead.province}</div>
                    {[{label:"โทรศัพท์",val:relLead.phone},{label:"สินค้า",val:relLead.product},{label:"มูลค่า",val:relLead.value},{label:"สถานะ",val:relLead.status},{label:"ผู้รับผิดชอบ",val:relLead.assigned}].map((r,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<4?"1px solid #f0f4f8":"none"}}>
                        <span style={{fontSize:"0.7rem",color:MUTED,fontWeight:600}}>{r.label}</span>
                        <span style={{fontSize:"0.75rem",color:STEEL,fontWeight:700}}>{r.val}</span>
                      </div>
                    ))}
                    <button onClick={()=>router.push(`/leads/${relLead.numId}`)}
                      style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,width:"100%",padding:"9px 0",borderRadius:10,background:PRIMARY,color:"#fff",border:"none",fontSize:"0.76rem",fontWeight:700,cursor:"pointer",marginTop:14}}>
                      <ExternalLink size={13}/> ดูลีดเต็ม
                    </button>
                  </>
                ):(
                  <div style={{textAlign:"center",padding:"28px 0",color:MUTED,fontSize:"0.78rem"}}>ไม่พบลีดที่เกี่ยวข้อง</div>
                )}
              </div>
            )}

            {/* Actions footer */}
            <div style={{padding:"12px 14px",borderTop:`1px solid ${BORDER}`,display:"flex",flexDirection:"column",gap:6}}>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>openEdit(selected)}
                  style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"9px 0",borderRadius:10,background:PRIMARY,color:"#fff",border:"none",fontSize:"0.74rem",fontWeight:700,cursor:"pointer"}}>
                  <Edit2 size={13}/> แก้ไข
                </button>
                <button onClick={()=>{if(relProject) router.push(`/projects/${relProject.id}`);}}
                  disabled={!relProject}
                  style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"9px 0",borderRadius:10,background:"#dce5f0",color:PRIMARY,border:"none",fontSize:"0.74rem",fontWeight:700,cursor:relProject?"pointer":"not-allowed",opacity:relProject?1:0.5}}>
                  <Building2 size={13}/> โครงการ
                </button>
              </div>
              <button onClick={()=>router.push(`/customers/${selected.customerId}`)}
                style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"8px 0",borderRadius:10,background:"#f0f4f8",color:STEEL,border:`1px solid ${BORDER}`,fontSize:"0.73rem",fontWeight:700,cursor:"pointer"}}>
                <ExternalLink size={13}/> ดูลูกค้า
              </button>
              {!delConfirm?(
                <button onClick={()=>setDelConfirm(true)}
                  style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"7px 0",borderRadius:10,background:"#fff",color:"#dc2626",border:"1px solid #fee2e2",fontSize:"0.72rem",fontWeight:700,cursor:"pointer"}}>
                  <Trash2 size={12}/> ลบใบเสนอราคา
                </button>
              ):(
                <div style={{borderRadius:10,border:"1px solid #fca5a5",overflow:"hidden"}}>
                  <div style={{padding:"7px 12px",background:"#fee2e2",fontSize:"0.7rem",color:"#dc2626",fontWeight:600}}>ยืนยันลบ "{selected.id}"?</div>
                  <div style={{display:"flex"}}>
                    <button onClick={deleteQ} style={{flex:1,padding:"7px",background:"#dc2626",border:"none",color:"#fff",fontSize:"0.7rem",fontWeight:700,cursor:"pointer"}}>ลบ</button>
                    <button onClick={()=>setDelConfirm(false)} style={{flex:1,padding:"7px",background:"#fff",border:"none",borderLeft:"1px solid #fca5a5",color:STEEL,fontSize:"0.7rem",cursor:"pointer"}}>ยกเลิก</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal&&(
        <QuotationModal
          title={editingQ?"แก้ไขใบเสนอราคา":"เพิ่มใบเสนอราคาใหม่"}
          initial={editingQ?toForm(editingQ):buildBlank()}
          onSave={saveQ} onClose={()=>setShowModal(false)}/>
      )}
    </div>
  );
}
