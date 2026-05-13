"use client";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { useState } from "react";
export default function Page() {
  const [items, setItems] = useState<string[]>([]);
  return <AppLayout title="系統設定"><PageHeader title="系統設定" description="公司資料、分店、部門、方案、通知與系統參數。" action={<button className="btn-primary" onClick={() => { const name = prompt("請輸入要新增的資料名稱"); if (name) setItems((prev) => [name, ...prev]); }}>新增資料</button>} /><div className="card"><p className="text-sm text-slate-500">此頁已建立 demo 新增功能。正式版可沿用 DataTable、RBAC、Workflow 與 Prisma Model 擴充完整 CRUD。</p><div className="mt-4 space-y-2">{items.length === 0 && <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">目前尚無新增資料。</p>}{items.map((item, index) => <div key={index} className="flex items-center justify-between rounded-xl border border-slate-200 p-3"><span>{item}</span><button className="text-sm text-red-600" onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}>刪除</button></div>)}</div></div></AppLayout>;
}
