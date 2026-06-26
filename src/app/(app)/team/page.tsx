"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  tasks, projects,
  taskStatusBadge, taskStatusLabel,
  projectStatusColor, projectStatusLabel,
} from "@/lib/mock";
import { Plus, Download, Pencil, Trash2, X, Search, ArrowRight, ExternalLink, ChevronDown, ClipboardList } from "lucide-react";

// ── Tokens ────────────────────────────────────────────────────
const PRIMARY = "#003366";
const STEEL   = "#2D2D2D";
const BORDER  = "#e5e7eb";
const MUTED   = "#6b7280";
const CARD: React.CSSProperties = { background:"#fff", borderRadius:16, border:`1px solid ${BORDER}`, boxShadow:"0 2px 14px rgba(0,0,0,.07)" };
const AVATAR_COLORS = ["#003366","#059669","#f59e0b","#0369a1","#002244","#8fa3b8","#2D2D2D","#C0C0C0"];

// ── Types ─────────────────────────────────────────────────────
type MemberStatus = "online"|"busy"|"offline";
type PermLevel    = "full"|"view"|"none";

type TeamMember = {
  id: number; name: string; position: string; dept: string;
  initial: string; color: string; status: MemberStatus;
  projects: number; done: number; pending: number;
  nickname?: string; // matches mock task/project assigned[] short names
};
type RoleRow = {
  id: number; role: string; members: number;
  projects: PermLevel; tasks: PermLevel; clients: PermLevel;
  reports: PermLevel; settings: PermLevel;
};
type MemberForm = { name:string; position:string; dept:string; status:MemberStatus; };
type RoleForm   = { role:string; members:number; projects:PermLevel; tasks:PermLevel; clients:PermLevel; reports:PermLevel; settings:PermLevel; };

// ── Initial Data ──────────────────────────────────────────────
const DEPTS = ["บริหารโครงการ","พัฒนาซอฟต์แวร์","ทดสอบระบบ","โครงสร้างพื้นฐาน","ออกแบบ","วิเคราะห์ข้อมูล","วิเคราะห์ธุรกิจ","ขาย"];
const POSITIONS = ["Project Manager","Senior Developer","QA Engineer","DevOps Engineer","UI/UX Designer","Backend Developer","Data Analyst","Business Analyst","Sales Manager"];

const MEMBERS_INIT: TeamMember[] = [
  { id:1, name:"อารยา สุขวิเศษ",    position:"Project Manager",   dept:"บริหารโครงการ",    initial:"อ", color:AVATAR_COLORS[0], status:"online",  projects:4, done:8,  pending:2 },
  { id:2, name:"กิตติ พรมมา",        position:"Senior Developer",  dept:"พัฒนาซอฟต์แวร์",   initial:"ก", color:AVATAR_COLORS[1], status:"online",  projects:3, done:12, pending:3 },
  { id:3, name:"ประภัสสร ดาวรุ่ง",   position:"QA Engineer",       dept:"ทดสอบระบบ",         initial:"ป", color:AVATAR_COLORS[2], status:"busy",    projects:2, done:6,  pending:4 },
  { id:4, name:"ธนพล วิชาศิลป์",    position:"DevOps Engineer",   dept:"โครงสร้างพื้นฐาน",  initial:"ธ", color:AVATAR_COLORS[3], status:"online",  projects:4, done:9,  pending:1 },
  { id:5, name:"นิภาพร จันทร์สว่าง", position:"UI/UX Designer",    dept:"ออกแบบ",            initial:"น", color:AVATAR_COLORS[4], status:"online",  projects:3, done:7,  pending:2 },
  { id:6, name:"สมชาย พันธ์ดี",      position:"Backend Developer", dept:"พัฒนาซอฟต์แวร์",   initial:"ส", color:AVATAR_COLORS[5], status:"busy",    projects:2, done:5,  pending:3, nickname:"สมชาย" },
  { id:7, name:"มานี รักดี",          position:"Data Analyst",      dept:"วิเคราะห์ข้อมูล",   initial:"ม", color:AVATAR_COLORS[6], status:"offline", projects:1, done:3,  pending:1 },
  { id:8, name:"วรรณา ศรีสุข",       position:"Business Analyst",  dept:"วิเคราะห์ธุรกิจ",   initial:"ว", color:AVATAR_COLORS[7], status:"offline", projects:2, done:4,  pending:2 },
];
const ROLES_INIT: RoleRow[] = [
  { id:1, role:"Admin",           members:1, projects:"full", tasks:"full", clients:"full", reports:"full", settings:"full" },
  { id:2, role:"Project Manager", members:2, projects:"full", tasks:"full", clients:"view", reports:"full", settings:"none" },
  { id:3, role:"Developer",       members:3, projects:"view", tasks:"full", clients:"none", reports:"view", settings:"none" },
  { id:4, role:"Viewer",          members:2, projects:"view", tasks:"view", clients:"view", reports:"view", settings:"none" },
];

// ── Helpers ───────────────────────────────────────────────────
const STATUS_COLOR: Record<MemberStatus,string> = { online:"#059669", busy:"#f59e0b", offline:"#94a3b8" };
const STATUS_LABEL: Record<MemberStatus,string> = { online:"ออนไลน์", busy:"ไม่ว่าง", offline:"ออฟไลน์" };
const PERM_STYLES: Record<PermLevel,{bg:string;color:string;label:string}> = {
  full:{ bg:"#dce5f0", color:PRIMARY, label:"เต็ม" },
  view:{ bg:"#f0f4f8", color:"#6b7280", label:"ดู" },
  none:{ bg:"#f5f5f5", color:"#9ca3af", label:"ไม่ได้" },
};

function nextMemberId(members:TeamMember[]){ return Math.max(...members.map(m=>m.id),0)+1; }
function nextRoleId(roles:RoleRow[]){ return Math.max(...roles.map(r=>r.id),0)+1; }
function exportCSV(members:TeamMember[]){
  const h=["ชื่อ","ตำแหน่ง","แผนก","สถานะ","โครงการ","งานเสร็จ","ค้างอยู่"];
  const lines=members.map(m=>[m.name,m.position,m.dept,STATUS_LABEL[m.status],m.projects,m.done,m.pending].join(","));
  const blob=new Blob(["﻿"+[h.join(","),...lines].join("\n")],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="team.csv"; a.click(); URL.revokeObjectURL(url);
}
// Match member to mock tasks/projects by nickname or first name prefix
function memberTasks(m:TeamMember){ const key=m.nickname||null; if(!key) return []; return tasks.filter(t=>t.assigned.includes(key)); }
function memberProjects(m:TeamMember){ const key=m.nickname||null; if(!key) return []; return projects.filter(p=>p.assigned.includes(key)); }

// ── Sub-components ────────────────────────────────────────────
function StatusDot({status}:{status:MemberStatus}){
  return <span style={{display:"flex",alignItems:"center",gap:5,fontSize:".68rem",fontWeight:700,color:STATUS_COLOR[status]}}><span style={{width:7,height:7,borderRadius:"50%",background:STATUS_COLOR[status],display:"inline-block",flexShrink:0}}/>{STATUS_LABEL[status]}</span>;
}
function PermBadge({level}:{level:PermLevel}){
  const s=PERM_STYLES[level];
  return <span style={{display:"inline-block",padding:"2px 9px",borderRadius:6,background:s.bg,color:s.color,fontSize:".7rem",fontWeight:700}}>{s.label}</span>;
}
function Avatar({m,size=44}:{m:TeamMember;size?:number}){
  return <div style={{width:size,height:size,borderRadius:size/3,flexShrink:0,background:m.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:size*0.4}}>
    {m.initial}
  </div>;
}

// ── Member Card ───────────────────────────────────────────────
function MemberCard({m,selected,onClick}:{m:TeamMember;selected:boolean;onClick:()=>void}){
  return (
    <div onClick={onClick} style={{...CARD,padding:"16px 14px 13px",cursor:"pointer",position:"relative",transition:"all .18s",borderColor:selected?PRIMARY:BORDER,boxShadow:selected?"0 0 0 2px rgba(0,0,0,.18), 0 2px 14px rgba(0,0,0,.07)":"0 2px 14px rgba(0,0,0,.07)",minHeight:170,display:"flex",flexDirection:"column"}}
      onMouseEnter={e=>{if(!selected)(e.currentTarget as HTMLElement).style.boxShadow="0 6px 24px rgba(0,0,0,.13)";}}
      onMouseLeave={e=>{if(!selected)(e.currentTarget as HTMLElement).style.boxShadow="0 2px 14px rgba(0,0,0,.07)";}}>
      <div style={{position:"absolute",top:10,right:10}}><StatusDot status={m.status}/></div>
      <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12,paddingRight:68,flex:1}}>
        <Avatar m={m} size={42}/>
        <div style={{minWidth:0,flex:1}}>
          <div style={{fontSize:".84rem",fontWeight:700,color:STEEL,lineHeight:1.35,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{m.name}</div>
          <div style={{fontSize:".7rem",color:MUTED,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.position}</div>
          <div style={{fontSize:".66rem",color:PRIMARY,fontWeight:600,marginTop:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.dept}</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,paddingTop:10,borderTop:`1px solid ${BORDER}`}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:".95rem",fontWeight:800,color:"#003366"}}>{m.projects}</div>
          <div style={{fontSize:".6rem",color:MUTED,marginTop:1}}>โครงการ</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:".95rem",fontWeight:800,color:"#059669"}}>{m.done}</div>
          <div style={{fontSize:".6rem",color:MUTED,marginTop:1}}>งานเสร็จ</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:".95rem",fontWeight:800,color:m.pending<=2?"#059669":m.pending<=3?"#f59e0b":"#dc2626"}}>{m.pending}</div>
          <div style={{fontSize:".6rem",color:MUTED,marginTop:1}}>ค้างอยู่</div>
        </div>
      </div>
    </div>
  );
}

// ── Member Modal ──────────────────────────────────────────────
function MemberModal({initial,title,onSave,onClose}:{initial:MemberForm;title:string;onSave:(f:MemberForm)=>void;onClose:()=>void}){
  const [form,setForm]=useState<MemberForm>(initial);
  const INP:React.CSSProperties={width:"100%",border:`1px solid ${BORDER}`,borderRadius:9,padding:"8px 12px",fontSize:"0.82rem",outline:"none",color:STEEL,boxSizing:"border-box"};
  const LBL:React.CSSProperties={fontSize:"0.68rem",fontWeight:700,color:MUTED,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.04em"};
  function submit(){if(!form.name.trim()) return; onSave(form); onClose();}
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(45,45,45,.4)",zIndex:200}}/>
      <div style={{position:"fixed",inset:0,zIndex:210,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div onClick={e=>e.stopPropagation()} style={{...CARD,width:"100%",maxWidth:440,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,.2)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:`1px solid ${BORDER}`,background:PRIMARY}}>
            <div style={{fontSize:"0.92rem",fontWeight:800,color:"#fff"}}>{title}</div>
            <button onClick={onClose} style={{width:28,height:28,borderRadius:8,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.1)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={13}/></button>
          </div>
          <div style={{padding:"20px 22px",display:"flex",flexDirection:"column",gap:12}}>
            <div><label style={LBL}>ชื่อ-นามสกุล *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="ชื่อสมาชิก" style={INP}/></div>
            <div><label style={LBL}>ตำแหน่ง</label>
              <select value={form.position} onChange={e=>setForm(p=>({...p,position:e.target.value}))} style={INP}>
                {POSITIONS.map(pos=><option key={pos} value={pos}>{pos}</option>)}
              </select>
            </div>
            <div><label style={LBL}>แผนก</label>
              <select value={form.dept} onChange={e=>setForm(p=>({...p,dept:e.target.value}))} style={INP}>
                {DEPTS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div><label style={LBL}>สถานะ</label>
              <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value as MemberStatus}))} style={INP}>
                <option value="online">ออนไลน์</option>
                <option value="busy">ไม่ว่าง</option>
                <option value="offline">ออฟไลน์</option>
              </select>
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

// ── Role Modal ────────────────────────────────────────────────
function RoleModal({initial,title,onSave,onClose}:{initial:RoleForm;title:string;onSave:(f:RoleForm)=>void;onClose:()=>void}){
  const [form,setForm]=useState<RoleForm>(initial);
  const INP:React.CSSProperties={width:"100%",border:`1px solid ${BORDER}`,borderRadius:9,padding:"8px 12px",fontSize:"0.82rem",outline:"none",color:STEEL,boxSizing:"border-box"};
  const LBL:React.CSSProperties={fontSize:"0.68rem",fontWeight:700,color:MUTED,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.04em"};
  const PERMS:[keyof RoleForm,string][]=[["projects","โครงการ"],["tasks","งาน"],["clients","ลูกค้า"],["reports","รายงาน"],["settings","ตั้งค่า"]];
  function submit(){if(!form.role.trim()) return; onSave(form); onClose();}
  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(45,45,45,.4)",zIndex:200}}/>
      <div style={{position:"fixed",inset:0,zIndex:210,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div onClick={e=>e.stopPropagation()} style={{...CARD,width:"100%",maxWidth:440,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,.2)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:`1px solid ${BORDER}`,background:PRIMARY}}>
            <div style={{fontSize:"0.92rem",fontWeight:800,color:"#fff"}}>{title}</div>
            <button onClick={onClose} style={{width:28,height:28,borderRadius:8,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.1)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={13}/></button>
          </div>
          <div style={{padding:"20px 22px",display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={LBL}>ชื่อบทบาท *</label><input value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} placeholder="ชื่อบทบาท" style={INP}/></div>
              <div><label style={LBL}>จำนวนสมาชิก</label><input type="number" min={0} value={form.members} onChange={e=>setForm(p=>({...p,members:Number(e.target.value)}))} style={INP}/></div>
            </div>
            <div style={{fontSize:"0.68rem",fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:"0.04em",marginTop:4}}>สิทธิ์การเข้าถึง</div>
            {PERMS.map(([key,label])=>(
              <div key={key} style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:"0.82rem",color:STEEL,fontWeight:600}}>{label}</span>
                <div style={{display:"flex",gap:6}}>
                  {(["full","view","none"] as PermLevel[]).map(lv=>{
                    const sel=form[key]===lv;
                    const s=PERM_STYLES[lv];
                    return <button key={lv} type="button" onClick={()=>setForm(p=>({...p,[key]:lv}))}
                      style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${sel?s.color:BORDER}`,background:sel?s.bg:"#fff",color:sel?s.color:MUTED,fontSize:"0.7rem",fontWeight:sel?700:500,cursor:"pointer"}}>
                      {s.label}
                    </button>;
                  })}
                </div>
              </div>
            ))}
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

// ── Detail Panel ──────────────────────────────────────────────
function DetailPanel({m,allMembers,onClose,onEdit,onChangeStatus,onDelete}:{
  m:TeamMember; allMembers:TeamMember[]; onClose:()=>void; onEdit:()=>void; onChangeStatus:(s:MemberStatus)=>void; onDelete:()=>void;
}){
  const router=useRouter();
  const [tab,setTab]=useState<"info"|"work">("info");
  const [delConfirm,setDelConfirm]=useState(false);
  const mTasks=memberTasks(m);
  const mProjects=memberProjects(m);
  const doneTaskCount=mTasks.filter(t=>t.status==="done").length;
  const totalTasks=m.done+m.pending;
  const pct=totalTasks>0?Math.round((m.done/totalTasks)*100):0;
  return (
    <div style={{width:320,minWidth:300,flexShrink:0,...CARD,borderRadius:16,overflowY:"auto",maxHeight:"calc(100vh - 140px)",alignSelf:"flex-start",position:"sticky",top:0}}>
      {/* Header */}
      <div style={{background:PRIMARY,padding:"16px 14px 12px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:42,height:42,borderRadius:12,flexShrink:0,background:m.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:"1rem"}}>{m.initial}</div>
            <div>
              <div style={{fontSize:"0.88rem",fontWeight:800,color:"#fff",lineHeight:1.3}}>{m.name}</div>
              <div style={{fontSize:"0.7rem",color:"rgba(255,255,255,.75)",marginTop:2}}>{m.position}</div>
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><X size={14}/></button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:"0.68rem",fontWeight:600,color:"rgba(255,255,255,.8)"}}>{m.dept}</span>
          <span style={{color:"rgba(255,255,255,.4)"}}>·</span>
          <StatusDot status={m.status}/>
        </div>
      </div>
      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${BORDER}`}}>
        {([["info","ข้อมูล"],["work","งาน/โครงการ"]] as [string,string][]).map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k as typeof tab)}
            style={{flex:1,padding:"9px 0",border:"none",background:"none",cursor:"pointer",fontSize:"0.72rem",fontWeight:tab===k?700:500,color:tab===k?PRIMARY:MUTED,borderBottom:tab===k?`2px solid ${PRIMARY}`:"2px solid transparent",marginBottom:-1}}>
            {l}
          </button>
        ))}
      </div>

      {/* Tab: ข้อมูล */}
      {tab==="info"&&(
        <div style={{padding:"14px 14px"}}>
          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
            {[{l:"โครงการ",v:m.projects,c:"#003366"},{l:"งานเสร็จ",v:m.done,c:"#059669"},{l:"ค้างอยู่",v:m.pending,c:m.pending<=2?"#059669":m.pending<=3?"#f59e0b":"#dc2626"}].map((s,i)=>(
              <div key={i} style={{textAlign:"center",padding:"10px 6px",borderRadius:10,background:"#f8f9fb",border:`1px solid ${BORDER}`}}>
                <div style={{fontSize:"1.3rem",fontWeight:800,color:s.c,lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:"0.62rem",color:MUTED,marginTop:2}}>{s.l}</div>
              </div>
            ))}
          </div>
          {/* Completion rate */}
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:"0.7rem",color:MUTED,fontWeight:600}}>อัตราสำเร็จ</span>
              <span style={{fontSize:"0.7rem",fontWeight:800,color:"#059669"}}>{pct}%</span>
            </div>
            <div style={{height:6,background:"#f0f4f8",borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${pct}%`,background:"#059669",borderRadius:99,transition:"width .3s"}}/>
            </div>
          </div>
          {/* Status change */}
          <div style={{fontSize:"0.63rem",fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>เปลี่ยนสถานะ</div>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
            {(["online","busy","offline"] as MemberStatus[]).filter(s=>s!==m.status).map(s=>(
              <button key={s} onClick={()=>onChangeStatus(s)}
                style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:10,background:s==="online"?"#e5faf0":s==="busy"?"#fff3e0":"#f5f5f5",border:"none",cursor:"pointer"}}>
                <span style={{fontSize:"0.76rem",fontWeight:700,color:STATUS_COLOR[s]}}>→ {STATUS_LABEL[s]}</span>
                <ArrowRight size={13} color={STATUS_COLOR[s]}/>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab: งาน/โครงการ */}
      {tab==="work"&&(
        <div style={{padding:"12px 14px"}}>
          {/* Real projects from mock */}
          {mProjects.length>0&&(
            <>
              <div style={{fontSize:"0.63rem",fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>โครงการในระบบ ({mProjects.length})</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
                {mProjects.map(p=>{
                  const pc=projectStatusColor[p.status];
                  return (
                    <div key={p.id} onClick={()=>router.push("/projects")} style={{padding:"9px 11px",borderRadius:10,background:"#f8f9fb",border:`1px solid ${BORDER}`,cursor:"pointer"}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=PRIMARY;}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BORDER;}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <div style={{fontSize:"0.74rem",fontWeight:700,color:STEEL,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginRight:6}}>{p.title}</div>
                        <span style={{padding:"1px 6px",borderRadius:99,fontSize:"0.6rem",fontWeight:700,background:pc.bg,color:pc.text,flexShrink:0}}>{projectStatusLabel[p.status]}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{flex:1,height:4,background:"#e8ecf2",borderRadius:99,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${p.progress}%`,background:pc.text,borderRadius:99}}/>
                        </div>
                        <span style={{fontSize:"0.62rem",color:MUTED}}>{p.progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {/* Real tasks from mock */}
          {mTasks.length>0&&(
            <>
              <div style={{fontSize:"0.63rem",fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>งานในระบบ ({mTasks.length} รายการ · เสร็จ {doneTaskCount})</div>
              <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
                {mTasks.slice(0,5).map(t=>{
                  const b=taskStatusBadge[t.status];
                  return (
                    <div key={t.id} onClick={()=>router.push("/tasks")} style={{padding:"8px 10px",borderRadius:9,background:"#f8f9fb",border:`1px solid ${BORDER}`,cursor:"pointer"}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=PRIMARY;}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=BORDER;}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                        <div style={{fontSize:"0.73rem",fontWeight:600,color:STEEL,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</div>
                        <span style={{padding:"1px 7px",borderRadius:99,fontSize:"0.6rem",fontWeight:700,background:b.bg,color:b.text,flexShrink:0}}>{taskStatusLabel[t.status]}</span>
                      </div>
                    </div>
                  );
                })}
                {mTasks.length>5&&<div style={{fontSize:"0.68rem",color:MUTED,textAlign:"center",padding:4}}>และอีก {mTasks.length-5} งาน</div>}
              </div>
            </>
          )}
          {mTasks.length===0&&mProjects.length===0&&(
            <div style={{textAlign:"center",padding:"16px 0 8px",color:MUTED,fontSize:"0.76rem",lineHeight:1.6}}>
              <div style={{marginBottom:8,display:"flex",justifyContent:"center"}}><ClipboardList size={28} color="#9ca3af" strokeWidth={1.5} /></div>
              ไม่มีข้อมูลงานในระบบสำหรับสมาชิกนี้<br/>
              <span style={{fontSize:"0.68rem"}}>ข้อมูลจาก Projects และ Tasks ใช้ชื่อย่อ</span>
            </div>
          )}
          {/* Navigation */}
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <button onClick={()=>router.push("/tasks")}
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px",borderRadius:10,background:"#dce5f0",color:PRIMARY,border:"none",fontSize:"0.74rem",fontWeight:700,cursor:"pointer"}}>
              <ExternalLink size={13}/> ดูงานทั้งหมด
            </button>
            <button onClick={()=>router.push("/projects")}
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px",borderRadius:10,background:"#f0f4f8",color:STEEL,border:"none",fontSize:"0.74rem",fontWeight:700,cursor:"pointer"}}>
              <ExternalLink size={13}/> ดูโครงการทั้งหมด
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{padding:"12px 14px",borderTop:`1px solid ${BORDER}`,display:"flex",flexDirection:"column",gap:6}}>
        <button onClick={onEdit}
          style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px 0",borderRadius:10,background:PRIMARY,color:"#fff",border:"none",fontSize:"0.76rem",fontWeight:700,cursor:"pointer"}}>
          <Pencil size={13}/> แก้ไขข้อมูล
        </button>
        {!delConfirm?(
          <button onClick={()=>setDelConfirm(true)}
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"7px 0",borderRadius:10,background:"#fff",color:"#dc2626",border:"1px solid #fee2e2",fontSize:"0.72rem",fontWeight:700,cursor:"pointer"}}>
            <Trash2 size={12}/> ลบสมาชิก
          </button>
        ):(
          <div style={{borderRadius:10,border:"1px solid #fca5a5",overflow:"hidden"}}>
            <div style={{padding:"7px 12px",background:"#fee2e2",fontSize:"0.7rem",color:"#dc2626",fontWeight:600}}>ยืนยันลบ {m.name}?</div>
            <div style={{display:"flex"}}>
              <button onClick={onDelete} style={{flex:1,padding:"7px",background:"#dc2626",border:"none",color:"#fff",fontSize:"0.7rem",fontWeight:700,cursor:"pointer"}}>ลบ</button>
              <button onClick={()=>setDelConfirm(false)} style={{flex:1,padding:"7px",background:"#fff",border:"none",borderLeft:"1px solid #fca5a5",color:STEEL,fontSize:"0.7rem",cursor:"pointer"}}>ยกเลิก</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function TeamPage(){
  const [members,setMembers]     = useState<TeamMember[]>(MEMBERS_INIT);
  const [roles,setRoles]         = useState<RoleRow[]>(ROLES_INIT);
  const [view,setView]           = useState<"card"|"table">("card");
  const [query,setQuery]         = useState("");
  const [filterDept,setFilterDept] = useState("ALL");
  const [filterStatus,setFilterStatus] = useState<MemberStatus|"ALL">("ALL");
  const [selectedId,setSelectedId] = useState<number|null>(null);
  const [showMemberModal,setShowMemberModal] = useState(false);
  const [showRoleModal,setShowRoleModal]     = useState(false);
  const [editingMember,setEditingMember]     = useState<TeamMember|null>(null);
  const [editingRole,setEditingRole]         = useState<RoleRow|null>(null);

  const depts = useMemo(()=>Array.from(new Set(members.map(m=>m.dept))).sort(),[members]);
  const filtered = useMemo(()=>{
    const q=query.toLowerCase();
    return members.filter(m=>{
      const matchQ=!q||m.name.toLowerCase().includes(q)||m.position.toLowerCase().includes(q)||m.dept.includes(q);
      const matchD=filterDept==="ALL"||m.dept===filterDept;
      const matchS=filterStatus==="ALL"||m.status===filterStatus;
      return matchQ&&matchD&&matchS;
    });
  },[members,query,filterDept,filterStatus]);

  const selectedMember=selectedId!==null?members.find(m=>m.id===selectedId)??null:null;
  const totalOnline=members.filter(m=>m.status==="online").length;
  const totalPending=members.reduce((s,m)=>s+m.pending,0);

  function openAddMember(){ setEditingMember(null); setShowMemberModal(true); }
  function openEditMember(m:TeamMember){ setEditingMember(m); setShowMemberModal(true); }
  function openAddRole(){ setEditingRole(null); setShowRoleModal(true); }
  function openEditRole(r:RoleRow){ setEditingRole(r); setShowRoleModal(true); }

  function saveMember(form:MemberForm){
    if(editingMember){
      setMembers(d=>d.map(m=>m.id===editingMember.id?{...m,...form}:m));
    } else {
      const idx=members.length;
      const newM:TeamMember={id:nextMemberId(members),initial:form.name.charAt(0),color:AVATAR_COLORS[idx%AVATAR_COLORS.length],projects:0,done:0,pending:0,...form};
      setMembers(d=>[...d,newM]);
    }
  }
  function saveRole(form:RoleForm){
    if(editingRole){
      setRoles(d=>d.map(r=>r.id===editingRole.id?{...r,...form}:r));
    } else {
      setRoles(d=>[...d,{id:nextRoleId(roles),...form}]);
    }
  }
  function changeStatus(id:number,s:MemberStatus){
    setMembers(d=>d.map(m=>m.id===id?{...m,status:s}:m));
  }
  function deleteMember(){
    if(!selectedId) return;
    setMembers(d=>d.filter(m=>m.id!==selectedId));
    setSelectedId(null);
  }
  function deleteRole(id:number){ setRoles(d=>d.filter(r=>r.id!==id)); }

  function toMemberForm(m:TeamMember):MemberForm{ return {name:m.name,position:m.position,dept:m.dept,status:m.status}; }
  function blankMemberForm():MemberForm{ return {name:"",position:POSITIONS[0],dept:DEPTS[0],status:"online"}; }
  function toRoleForm(r:RoleRow):RoleForm{ return {role:r.role,members:r.members,projects:r.projects,tasks:r.tasks,clients:r.clients,reports:r.reports,settings:r.settings}; }
  function blankRoleForm():RoleForm{ return {role:"",members:0,projects:"view",tasks:"view",clients:"none",reports:"view",settings:"none"}; }

  const SEL:React.CSSProperties={border:`1px solid ${BORDER}`,borderRadius:9,padding:"6px 10px",fontSize:"0.78rem",color:MUTED,background:"#fff",outline:"none",cursor:"pointer",appearance:"none",paddingRight:24};

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontSize:"1.55rem",fontWeight:800,color:STEEL,marginBottom:3}}>ทีมงาน</h1>
          <p style={{fontSize:".76rem",color:MUTED}}>จัดการสมาชิกทีมและสิทธิ์การเข้าถึง · {members.length} คน</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>exportCSV(filtered)}
            style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:9,border:`1px solid ${BORDER}`,background:"#fff",color:STEEL,fontSize:".78rem",fontWeight:600,cursor:"pointer"}}>
            <Download size={13}/> ส่งออก
          </button>
          <button onClick={openAddMember}
            style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:9,border:"none",background:PRIMARY,color:"#fff",fontSize:".78rem",fontWeight:700,cursor:"pointer",boxShadow:"0 3px 10px rgba(0,0,0,.22)"}}>
            <Plus size={13}/> เพิ่มสมาชิก
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[
          {l:"สมาชิกทั้งหมด",v:members.length,c:"#003366",bg:"#dce5f0",filter:()=>setFilterStatus("ALL")},
          {l:"ออนไลน์ตอนนี้", v:totalOnline,    c:"#059669",bg:"#e5faf0",filter:()=>setFilterStatus("online")},
          {l:"ไม่ว่าง",        v:members.filter(m=>m.status==="busy").length,c:"#f59e0b",bg:"#fff3e0",filter:()=>setFilterStatus("busy")},
          {l:"งานที่ดำเนินการ",v:totalPending,   c:"#dc2626",bg:"#fee2e2",filter:()=>setFilterStatus("ALL")},
        ].map((s,i)=>(
          <div key={i} onClick={s.filter} style={{...CARD,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(0,0,0,.12)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 2px 14px rgba(0,0,0,.07)";}}>
            <div style={{width:42,height:42,borderRadius:12,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:"1.1rem",color:s.c}}>●</span>
            </div>
            <div>
              <div style={{fontSize:"1.3rem",fontWeight:800,color:s.c,lineHeight:1}}>{s.v}</div>
              <div style={{fontSize:".68rem",color:MUTED,fontWeight:600,marginTop:2}}>{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
        <div style={{flex:1,minWidth:0}}>
          {/* Toolbar */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,gap:10,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,background:"#fff",border:`1px solid ${BORDER}`,borderRadius:9,padding:"6px 12px",minWidth:200}}>
                <Search size={14} color="#9ca3af"/>
                <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ค้นหาสมาชิก..."
                  style={{border:"none",outline:"none",fontSize:".8rem",color:STEEL,background:"transparent",flex:1}}/>
                {query&&<button onClick={()=>setQuery("")} style={{background:"none",border:"none",cursor:"pointer",padding:0,color:MUTED,display:"flex"}}><X size={12}/></button>}
              </div>
              <div style={{position:"relative"}}>
                <select value={filterDept} onChange={e=>setFilterDept(e.target.value)} style={SEL}>
                  <option value="ALL">ทั้งหมด</option>
                  {depts.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown size={11} color={MUTED} style={{position:"absolute",right:7,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
              </div>
              <div style={{position:"relative"}}>
                <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value as MemberStatus|"ALL")} style={SEL}>
                  <option value="ALL">ทั้งหมด</option>
                  <option value="online">ออนไลน์</option>
                  <option value="busy">ไม่ว่าง</option>
                  <option value="offline">ออฟไลน์</option>
                </select>
                <ChevronDown size={11} color={MUTED} style={{position:"absolute",right:7,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
              </div>
              {(filterDept!=="ALL"||filterStatus!=="ALL"||query)&&(
                <button onClick={()=>{setFilterDept("ALL");setFilterStatus("ALL");setQuery("");}}
                  style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:99,background:"#fee2e2",color:"#dc2626",border:"none",fontSize:"0.72rem",fontWeight:700,cursor:"pointer"}}>
                  <X size={10}/> ล้าง
                </button>
              )}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:"0.72rem",color:MUTED}}>{filtered.length} คน</span>
              {[["card","การ์ด"],["table","ตาราง"]].map(([v,l])=>(
                <button key={v} onClick={()=>{setView(v as "card"|"table");if(v==="table")setSelectedId(null);}}
                  style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:8,border:`1px solid ${view===v?PRIMARY:BORDER}`,background:view===v?"#dce5f0":"#fff",color:view===v?PRIMARY:MUTED,fontSize:".76rem",fontWeight:view===v?700:500,cursor:"pointer"}}>
                  {l}
                </button>
              ))}
              <button onClick={openAddMember}
                style={{width:34,height:34,borderRadius:9,border:"none",background:PRIMARY,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Plus size={16}/>
              </button>
            </div>
          </div>

          {/* Card Grid */}
          {view==="card"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:14}}>
              {filtered.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"40px 0",color:MUTED,fontSize:"0.84rem"}}>ไม่พบสมาชิก</div>}
              {filtered.map(m=><MemberCard key={m.id} m={m} selected={selectedId===m.id} onClick={()=>setSelectedId(selectedId===m.id?null:m.id)}/>)}
            </div>
          )}

          {/* Table */}
          {view==="table"&&(
            <div style={{...CARD,overflow:"hidden",marginBottom:14}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:".82rem"}}>
                  <thead><tr style={{background:"#f8fafc",borderBottom:`1px solid ${BORDER}`}}>
                    {["สมาชิก","ตำแหน่ง","แผนก","สถานะ","โครงการ","งานเสร็จ","ค้างอยู่",""].map((h,i)=>(
                      <th key={i} style={{padding:"10px 14px",textAlign:"left",fontSize:".7rem",fontWeight:700,color:MUTED,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filtered.length===0&&<tr><td colSpan={8} style={{textAlign:"center",padding:"32px",color:MUTED}}>ไม่พบสมาชิก</td></tr>}
                    {filtered.map(m=>(
                      <tr key={m.id} style={{borderBottom:`1px solid ${BORDER}`,cursor:"pointer",transition:"background .1s"}}
                        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#f8f9fb";}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="";}}>
                        <td style={{padding:"10px 14px"}} onClick={()=>setSelectedId(selectedId===m.id?null:m.id)}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <div style={{width:32,height:32,borderRadius:9,flexShrink:0,background:m.color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:".8rem"}}>{m.initial}</div>
                            <span style={{fontWeight:600,color:STEEL}}>{m.name}</span>
                          </div>
                        </td>
                        <td style={{padding:"10px 14px",color:MUTED}}>{m.position}</td>
                        <td style={{padding:"10px 14px",color:PRIMARY,fontSize:".72rem",fontWeight:600}}>{m.dept}</td>
                        <td style={{padding:"10px 14px"}}><StatusDot status={m.status}/></td>
                        <td style={{padding:"10px 14px",fontWeight:700,color:"#003366"}}>{m.projects}</td>
                        <td style={{padding:"10px 14px",fontWeight:700,color:"#059669"}}>{m.done}</td>
                        <td style={{padding:"10px 14px",fontWeight:700,color:m.pending<=2?"#059669":m.pending<=3?"#f59e0b":"#dc2626"}}>{m.pending}</td>
                        <td style={{padding:"10px 10px"}}>
                          <button onClick={()=>openEditMember(m)}
                            style={{width:29,height:29,borderRadius:8,border:`1px solid ${BORDER}`,background:"#fff",color:MUTED,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
                            onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background="#dce5f0";el.style.borderColor=PRIMARY;el.style.color=PRIMARY;}}
                            onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background="#fff";el.style.borderColor=BORDER;el.style.color=MUTED;}}>
                            <Pencil size={12}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Roles & Permissions */}
          <div style={{...CARD,overflow:"hidden"}}>
            <div style={{padding:"14px 16px",borderBottom:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:".84rem",fontWeight:700,color:STEEL}}>บทบาทและสิทธิ์</span>
              <button onClick={openAddRole}
                style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:8,border:"none",background:PRIMARY,color:"#fff",fontSize:".72rem",fontWeight:700,cursor:"pointer"}}>
                <Plus size={12}/> เพิ่มบทบาท
              </button>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:".82rem"}}>
                <thead><tr style={{background:"#f8fafc",borderBottom:`1px solid ${BORDER}`}}>
                  {["บทบาท","สมาชิก","โครงการ","งาน","ลูกค้า","รายงาน","ตั้งค่า",""].map((h,i)=>(
                    <th key={i} style={{padding:"10px 14px",textAlign:"left",fontSize:".7rem",fontWeight:700,color:MUTED,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {roles.map((r,i)=>(
                    <tr key={r.id} style={{borderBottom:i<roles.length-1?`1px solid ${BORDER}`:"none"}}>
                      <td style={{padding:"12px 14px",fontWeight:700,color:STEEL}}>{r.role}</td>
                      <td style={{padding:"12px 14px",color:MUTED}}>{r.members}</td>
                      <td style={{padding:"12px 14px"}}><PermBadge level={r.projects}/></td>
                      <td style={{padding:"12px 14px"}}><PermBadge level={r.tasks}/></td>
                      <td style={{padding:"12px 14px"}}><PermBadge level={r.clients}/></td>
                      <td style={{padding:"12px 14px"}}><PermBadge level={r.reports}/></td>
                      <td style={{padding:"12px 14px"}}><PermBadge level={r.settings}/></td>
                      <td style={{padding:"12px 10px"}}>
                        <div style={{display:"flex",gap:4}}>
                          <button onClick={()=>openEditRole(r)}
                            style={{width:29,height:29,borderRadius:8,border:`1px solid ${BORDER}`,background:"#fff",color:MUTED,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
                            onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background="#dce5f0";el.style.borderColor=PRIMARY;el.style.color=PRIMARY;}}
                            onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background="#fff";el.style.borderColor=BORDER;el.style.color=MUTED;}}>
                            <Pencil size={12}/>
                          </button>
                          {r.id>1&&(
                            <button onClick={()=>deleteRole(r.id)}
                              style={{width:29,height:29,borderRadius:8,border:"1px solid #fee2e2",background:"#fff",color:"#dc2626",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}
                              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#fee2e2";}}
                              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#fff";}}>
                              <Trash2 size={12}/>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedMember&&(
          <DetailPanel
            m={selectedMember}
            allMembers={members}
            onClose={()=>setSelectedId(null)}
            onEdit={()=>openEditMember(selectedMember)}
            onChangeStatus={(s)=>changeStatus(selectedMember.id,s)}
            onDelete={deleteMember}/>
        )}
      </div>

      {showMemberModal&&(
        <MemberModal
          title={editingMember?"แก้ไขสมาชิก":"เพิ่มสมาชิกใหม่"}
          initial={editingMember?toMemberForm(editingMember):blankMemberForm()}
          onSave={saveMember}
          onClose={()=>{setShowMemberModal(false);setEditingMember(null);}}/>
      )}
      {showRoleModal&&(
        <RoleModal
          title={editingRole?"แก้ไขบทบาท":"เพิ่มบทบาทใหม่"}
          initial={editingRole?toRoleForm(editingRole):blankRoleForm()}
          onSave={saveRole}
          onClose={()=>{setShowRoleModal(false);setEditingRole(null);}}/>
      )}
    </div>
  );
}
