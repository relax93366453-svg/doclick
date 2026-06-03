"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { BarChart3, Download, FileSpreadsheet, GanttChartSquare, LineChart, PieChart, Plus, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const salesData = [
  { month: "1月", sales: 690000, cost: 350000 },
  { month: "2月", sales: 760000, cost: 380000 },
  { month: "3月", sales: 720000, cost: 360000 },
  { month: "4月", sales: 980000, cost: 460000 },
  { month: "5月", sales: 1280000, cost: 700000 }
];

const ganttData = [
  { task: "表單設計器", start: 5, duration: 28, owner: "Alisha" },
  { task: "人事管理", start: 15, duration: 35, owner: "工程 A" },
  { task: "進銷存", start: 25, duration: 30, owner: "工程 B" },
  { task: "報表中心", start: 42, duration: 38, owner: "工程 A" },
  { task: "權限控管", start: 60, duration: 28, owner: "工程 C" }
];

export default function AdvancedReportsPage() {
  const [active, setActive] = useState("營運總覽");
  return (
    <AppLayout title="報表中心升級版">
      <PageHeader
        title="報表中心升級版"
        description="自動產生圖表、甘特圖、統計表，並支援 Excel / PDF 匯出。"
        action={<div className="flex flex-wrap gap-2"><button className="btn-secondary"><SlidersHorizontal className="mr-2 h-4 w-4" />報表條件</button><button className="btn-secondary"><FileSpreadsheet className="mr-2 h-4 w-4" />匯出 Excel</button><button className="btn-primary"><Download className="mr-2 h-4 w-4" />匯出 PDF</button></div>}
      />
      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="本月營收" value="NT$ 1,280,000" icon={<BarChart3 className="h-5 w-5" />} />
        <Stat label="毛利率" value="45.3%" icon={<LineChart className="h-5 w-5" />} />
        <Stat label="進行中專案" value="18 件" icon={<GanttChartSquare className="h-5 w-5" />} />
        <Stat label="待審核表單" value="26 筆" icon={<PieChart className="h-5 w-5" />} />
      </div>
      <div className="card mb-5"><div className="flex flex-wrap gap-2">{["營運總覽", "銷售分析", "人事分析", "財務分析", "專案甘特圖", "自訂報表"].map((item) => <button key={item} className={`rounded-xl px-4 py-2 text-sm font-medium ${active === item ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-700"}`} onClick={() => setActive(item)}>{item}</button>)}</div></div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_.9fr]">
        <div className="space-y-5">
          <div className="card">
            <h3 className="mb-4 font-bold">銷售與成本趨勢</h3>
            <div className="flex h-72 items-end gap-5 border-b border-l border-slate-200 px-5 pb-4">
              {salesData.map((item) => <div key={item.month} className="flex flex-1 items-end justify-center gap-2"><div className="w-8 rounded-t-xl bg-brand-500" style={{ height: `${item.sales / 10000}px`, maxHeight: "220px" }} /><div className="w-8 rounded-t-xl bg-slate-300" style={{ height: `${item.cost / 10000}px`, maxHeight: "220px" }} /></div>)}
            </div>
            <div className="mt-3 grid grid-cols-5 text-center text-sm text-slate-500">{salesData.map((item) => <span key={item.month}>{item.month}</span>)}</div>
          </div>
          <div className="card">
            <div className="mb-4 flex items-center justify-between"><h3 className="font-bold">專案甘特圖</h3><button className="btn-secondary"><Plus className="mr-2 h-4 w-4" />新增專案</button></div>
            <div className="space-y-4">
              {ganttData.map((item) => <div key={item.task} className="grid grid-cols-[120px_1fr_80px] items-center gap-3 text-sm"><div><p className="font-medium">{item.task}</p><p className="text-xs text-slate-400">{item.owner}</p></div><div className="relative h-8 rounded-full bg-slate-100"><div className="absolute top-1 h-6 rounded-full bg-brand-500" style={{ left: `${item.start}%`, width: `${item.duration}%` }} /></div><span className="text-right text-slate-500">{item.duration} 天</span></div>)}
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="card"><h3 className="font-bold">產業別占比</h3><div className="mt-5 space-y-3">{[{label:"電商",value:36},{label:"美容",value:24},{label:"外勤",value:18},{label:"行政",value:12},{label:"製造",value:10}].map((item) => <div key={item.label}><div className="mb-1 flex justify-between text-sm"><span>{item.label}</span><span>{item.value}%</span></div><div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-brand-500" style={{ width: `${item.value}%` }} /></div></div>)}</div></div>
          <div className="card"><h3 className="font-bold">自訂報表欄位</h3><div className="mt-4 space-y-2">{["日期區間", "產業別", "負責人", "狀態", "金額", "完成度", "部門"].map((item) => <label key={item} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">{item}<input type="checkbox" defaultChecked /></label>)}</div></div>
        </div>
      </div>
    </AppLayout>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="card"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">{icon}</div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>;
}
