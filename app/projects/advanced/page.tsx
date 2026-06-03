"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { CheckCircle2, Download, Paperclip, Plus, ReceiptText, WalletCards } from "lucide-react";
import { useState } from "react";

const project = { no: "PO-20200510-001", name: "端午節活促銷活動", category: "行銷", stage: "規劃", owner: "Rex", income: 557480, start: "2026-05-10", end: "2026-05-29", file: "端午促銷活動.pdf" };
const tasks = [
  { no: "W-00065", name: "促銷活動提案", done: true, owner: "Rex, Gina", due: "2026-05-13", start: "2026-05-10", end: "2026-05-11" },
  { no: "W-00066", name: "包裝設計", done: false, owner: "Gina", due: "2026-05-20", start: "2026-05-13", end: "2026-05-13" },
  { no: "W-00067", name: "拍攝六角新品", done: true, owner: "Kayline", due: "2026-05-20", start: "2026-05-13", end: "2026-05-13" },
  { no: "W-00068", name: "禮盒印刷", done: false, owner: "Gina", due: "2026-05-27", start: "2026-05-20", end: "" },
];
const expenses = [{ item: "包裝材料", type: "支出", amount: 12000 }, { item: "攝影費", type: "支出", amount: 18000 }, { item: "商品銷售", type: "收入", amount: 557480 }];

export default function AdvancedProjectsPage() {
  const [active, setActive] = useState("工作項目");
  const totalExpense = expenses.filter((item) => item.type === "支出").reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = expenses.filter((item) => item.type === "收入").reduce((sum, item) => sum + item.amount, 0);

  return (
    <AppLayout title="專案管理升級版">
      <PageHeader title="專案管理升級版" description="專案主表、工作項目子表、收入支出、附件、列印與匯出，接近企業資料庫管理邏輯。" action={<div className="flex flex-wrap gap-2"><button className="btn-secondary"><Download className="mr-2 h-4 w-4" />匯出 PDF</button><button className="btn-primary"><Plus className="mr-2 h-4 w-4" />新增專案</button></div>} />

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="card">
            <div className="mb-5 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-4 py-2 text-center font-bold text-white">專案資訊</div>
            <div className="grid gap-4 md:grid-cols-2">
              <Info label="專案名稱" value={project.name} /><Info label="專案編號" value={project.no} /><Info label="專案類別" value={project.category} /><Info label="專案階段" value={project.stage} /><Info label="負責人" value={project.owner} /><Info label="收入" value={`NT$ ${project.income.toLocaleString()}`} /><Info label="開始日期" value={project.start} /><Info label="結束日期" value={project.end} /><Info label="附件" value={project.file} />
            </div>
          </div>

          <div className="card">
            <div className="mb-4 flex flex-wrap gap-2">{["工作項目", "收入支出", "附件紀錄"].map((item) => <button key={item} className={`rounded-xl px-4 py-2 text-sm font-medium ${active === item ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-700"}`} onClick={() => setActive(item)}>{item}</button>)}</div>
            {active === "工作項目" && <DataTable headers={["工作項目編號", "工作項目", "已完成", "指派", "到期日", "開始日", "結束日"]} rows={tasks.map((t) => [t.no, t.name, t.done ? "✓" : "", t.owner, t.due, t.start, t.end || "-"])} />}
            {active === "收入支出" && <DataTable headers={["項目", "類別", "金額"]} rows={expenses.map((e) => [e.item, e.type, `NT$ ${e.amount.toLocaleString()}`])} />}
            {active === "附件紀錄" && <div className="grid gap-3 md:grid-cols-2">{["端午促銷活動.pdf", "包裝設計稿.pdf", "攝影合約.pdf"].map((file) => <div key={file} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"><Paperclip className="h-5 w-5 text-brand-600" /><span className="font-medium">{file}</span></div>)}</div>}
          </div>
        </div>

        <div className="space-y-5">
          <Stat label="專案收入" value={`NT$ ${totalIncome.toLocaleString()}`} icon={<WalletCards className="h-5 w-5" />} />
          <Stat label="專案支出" value={`NT$ ${totalExpense.toLocaleString()}`} icon={<ReceiptText className="h-5 w-5" />} />
          <Stat label="工作完成" value={`${tasks.filter((task) => task.done).length}/${tasks.length}`} icon={<CheckCircle2 className="h-5 w-5" />} />
          <div className="card"><h3 className="font-bold">快速操作</h3><div className="mt-4 space-y-2">{["列印專案表", "新增工作項目", "新增收入支出", "上傳附件", "寄送專案摘要"].map((item) => <button key={item} className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm hover:bg-brand-50">{item}</button>)}</div></div>
        </div>
      </div>
    </AppLayout>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return <div className="overflow-hidden rounded-2xl border border-slate-200"><table className="w-full text-sm"><thead className="bg-slate-50"><tr>{headers.map((h) => <th key={h} className="border-b border-slate-200 px-3 py-3 text-left">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} className="border-b border-slate-100 px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>;
}
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 font-bold">{value}</p></div>; }
function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) { return <div className="card"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">{icon}</div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>; }
