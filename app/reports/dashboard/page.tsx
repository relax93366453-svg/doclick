"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileSpreadsheet,
  Filter,
  GanttChartSquare,
  PieChart,
  Printer,
  UsersRound,
  WalletCards
} from "lucide-react";
import { useMemo, useState } from "react";

type DepartmentRow = {
  department: string;
  employees: number;
  hours: number;
  leaveHours: number;
  abnormal: number;
  pending: number;
  completion: number;
};

type TrendRow = {
  month: string;
  hours: number;
  salary: number;
};

type GanttTask = {
  name: string;
  owner: string;
  start: number;
  duration: number;
  progress: number;
  status: "進行中" | "待確認" | "已完成" | "逾期";
};

const departments: DepartmentRow[] = [
  { department: "外勤部", employees: 42, hours: 680, leaveHours: 12, abnormal: 3, pending: 5, completion: 82 },
  { department: "門市部", employees: 28, hours: 420, leaveHours: 8, abnormal: 1, pending: 2, completion: 90 },
  { department: "行政部", employees: 16, hours: 320, leaveHours: 4, abnormal: 0, pending: 3, completion: 86 },
  { department: "財務部", employees: 9, hours: 180, leaveHours: 2, abnormal: 0, pending: 1, completion: 94 },
  { department: "其他", employees: 33, hours: 510, leaveHours: 10, abnormal: 2, pending: 4, completion: 78 }
];

const trendRows: TrendRow[] = [
  { month: "1月", hours: 980, salary: 580000 },
  { month: "2月", hours: 1080, salary: 620000 },
  { month: "3月", hours: 1020, salary: 596000 },
  { month: "4月", hours: 1180, salary: 710000 },
  { month: "5月", hours: 1280, salary: 772600 },
  { month: "6月", hours: 1360, salary: 820000 }
];

const reminders = [
  { title: "8 筆簽核申請待審核", type: "簽核", tone: "bg-amber-50 text-amber-700" },
  { title: "3 位員工超過 7 天未跟進", type: "人事", tone: "bg-blue-50 text-blue-700" },
  { title: "2 位員工投保資料待補", type: "投保", tone: "bg-violet-50 text-violet-700" },
  { title: "1 位員工離職流程未完成", type: "離職", tone: "bg-red-50 text-red-700" },
  { title: "18 項商品低於安全庫存", type: "庫存", tone: "bg-rose-50 text-rose-700" }
];

const ganttTasks: GanttTask[] = [
  { name: "新人到職流程", owner: "人資 A", start: 5, duration: 26, progress: 80, status: "進行中" },
  { name: "五月薪資結算", owner: "財務 B", start: 20, duration: 24, progress: 60, status: "待確認" },
  { name: "投保資料補件", owner: "人資 A", start: 38, duration: 18, progress: 45, status: "進行中" },
  { name: "系統導入專案", owner: "Alisha", start: 50, duration: 38, progress: 72, status: "進行中" },
  { name: "報表中心優化", owner: "工程 C", start: 64, duration: 25, progress: 35, status: "待確認" }
];

const years = ["2026", "2025", "2024"];
const months = ["全部", "1月", "2月", "3月", "4月", "5月", "6月"];
const departmentOptions = ["全部部門", "外勤部", "門市部", "行政部", "財務部", "其他"];

function formatMoney(value: number) {
  return `NT$ ${value.toLocaleString()}`;
}

function statusClass(status: GanttTask["status"]) {
  if (status === "已完成") return "bg-emerald-50 text-emerald-700";
  if (status === "逾期") return "bg-red-50 text-red-700";
  if (status === "待確認") return "bg-amber-50 text-amber-700";
  return "bg-brand-50 text-brand-700";
}

export default function ReportsDashboardPage() {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("5月");
  const [department, setDepartment] = useState("全部部門");

  const filteredDepartments = useMemo(() => {
    if (department === "全部部門") return departments;
    return departments.filter((item) => item.department === department);
  }, [department]);

  const totalEmployees = filteredDepartments.reduce((sum, item) => sum + item.employees, 0);
  const totalHours = filteredDepartments.reduce((sum, item) => sum + item.hours, 0);
  const totalPending = filteredDepartments.reduce((sum, item) => sum + item.pending, 0);
  const totalAbnormal = filteredDepartments.reduce((sum, item) => sum + item.abnormal, 0);
  const totalSalary = 772600;
  const insuredCount = 96;

  function demoExport(type: string) {
    alert(`Demo：已準備匯出 ${type}。\n正式版可串接 PostgreSQL 資料，產出 Excel / PDF / 列印報表。`);
  }

  return (
    <AppLayout title="數據報表中心">
      <PageHeader
        title="數據報表中心"
        description="整合人事、排班、薪資、投保、表單與專案資料，產生圖表、統計表與甘特圖。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => demoExport("Excel")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              匯出 Excel
            </button>
            <button className="btn-secondary" onClick={() => demoExport("PDF")}>
              <Download className="mr-2 h-4 w-4" />
              匯出 PDF
            </button>
            <button className="btn-primary" onClick={() => demoExport("列印")}>
              <Printer className="mr-2 h-4 w-4" />
              列印報表
            </button>
          </div>
        }
      />

      <div className="card mb-5">
        <div className="flex flex-wrap items-end gap-3">
          <Filter className="mb-3 h-5 w-5 text-brand-600" />

          <div>
            <label className="mb-1 block text-sm font-medium">年份</label>
            <select className="input min-w-32" value={year} onChange={(event) => setYear(event.target.value)}>
              {years.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">月份</label>
            <select className="input min-w-32" value={month} onChange={(event) => setMonth(event.target.value)}>
              {months.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">部門</label>
            <select className="input min-w-40" value={department} onChange={(event) => setDepartment(event.target.value)}>
              {departmentOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <div className="ml-auto rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            目前篩選：{year}｜{month}｜{department}
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="本月總工時" value={`${totalHours.toLocaleString()} 小時`} icon={<Clock3 className="h-5 w-5" />} />
        <Stat label="本月薪資總額" value={formatMoney(totalSalary)} icon={<WalletCards className="h-5 w-5" />} />
        <Stat label="在職員工" value={`${totalEmployees} 人`} icon={<UsersRound className="h-5 w-5" />} />
        <Stat label="待簽核表單" value={`${totalPending} 筆`} icon={<FileSpreadsheet className="h-5 w-5" />} />
        <Stat label="投保中人數" value={`${insuredCount} 人`} icon={<CheckCircle2 className="h-5 w-5" />} />
        <Stat label="異常提醒" value={`${totalAbnormal} 筆`} icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[.8fr_1fr_1fr]">
        <div className="card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold">部門人數占比</h3>
              <p className="mt-1 text-sm text-slate-500">以目前篩選部門統計。</p>
            </div>
            <PieChart className="h-5 w-5 text-brand-600" />
          </div>

          <div className="relative mx-auto mb-5 flex h-52 w-52 items-center justify-center rounded-full bg-[conic-gradient(#2563eb_0_36%,#60a5fa_36%_60%,#a78bfa_60%_78%,#f59e0b_78%_90%,#f97316_90%_100%)]">
            <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-inner">
              <span className="text-3xl font-bold">{totalEmployees}</span>
              <span className="text-xs text-slate-500">總人數</span>
            </div>
          </div>

          <div className="space-y-3">
            {filteredDepartments.map((item, index) => {
              const percent = totalEmployees ? Math.round((item.employees / totalEmployees) * 100) : 0;
              return (
                <div key={item.department} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${["bg-brand-600", "bg-blue-400", "bg-violet-400", "bg-amber-500", "bg-orange-500"][index % 5]}`} />
                    {item.department}
                  </div>
                  <span className="font-medium">{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold">部門統計表</h3>
              <p className="mt-1 text-sm text-slate-500">人員、工時、請假、異常與待簽核彙總。</p>
            </div>
            <BarChart3 className="h-5 w-5 text-brand-600" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["部門", "員工", "工時", "請假", "異常", "待簽核", "完成率"].map((head) => (
                    <th key={head} className="border-b border-slate-200 px-3 py-3 text-left">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.map((item) => (
                  <tr key={item.department}>
                    <td className="border-b border-slate-100 px-3 py-3 font-medium">{item.department}</td>
                    <td className="border-b border-slate-100 px-3 py-3">{item.employees}</td>
                    <td className="border-b border-slate-100 px-3 py-3">{item.hours}</td>
                    <td className="border-b border-slate-100 px-3 py-3">{item.leaveHours}</td>
                    <td className="border-b border-slate-100 px-3 py-3">{item.abnormal}</td>
                    <td className="border-b border-slate-100 px-3 py-3">{item.pending}</td>
                    <td className="border-b border-slate-100 px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-brand-600" style={{ width: `${item.completion}%` }} />
                        </div>
                        {item.completion}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold">每月薪資／工時趨勢</h3>
              <p className="mt-1 text-sm text-slate-500">雙指標趨勢比較。</p>
            </div>
            <CalendarDays className="h-5 w-5 text-brand-600" />
          </div>

          <div className="flex h-64 items-end gap-4 border-b border-l border-slate-200 px-5 pb-4">
            {trendRows.map((item) => (
              <div key={item.month} className="flex flex-1 items-end justify-center gap-2">
                <div className="w-7 rounded-t-xl bg-brand-500" style={{ height: `${item.hours / 8}px`, maxHeight: "210px" }} title={`工時：${item.hours}`} />
                <div className="w-7 rounded-t-xl bg-slate-300" style={{ height: `${item.salary / 4500}px`, maxHeight: "210px" }} title={`薪資：${item.salary}`} />
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-6 text-center text-sm text-slate-500">
            {trendRows.map((item) => <span key={item.month}>{item.month}</span>)}
          </div>

          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-brand-500" />總工時</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slate-300" />薪資總額</div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
        <div className="card">
          <h3 className="font-bold">重點提醒</h3>
          <p className="mt-1 text-sm text-slate-500">彙整需要主管或人資優先處理的事項。</p>

          <div className="mt-5 space-y-3">
            {reminders.map((item) => (
              <div key={item.title} className={`rounded-2xl px-4 py-3 ${item.tone}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{item.title}</span>
                  <span className="rounded-full bg-white/70 px-2 py-1 text-xs">{item.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold">專案／流程甘特圖</h3>
              <p className="mt-1 text-sm text-slate-500">追蹤專案任務、到離職流程、投保補件與系統導入進度。</p>
            </div>
            <GanttChartSquare className="h-5 w-5 text-brand-600" />
          </div>

          <div className="space-y-4">
            {ganttTasks.map((task) => (
              <div key={task.name} className="grid grid-cols-[160px_1fr_90px] items-center gap-4 text-sm">
                <div>
                  <p className="font-medium">{task.name}</p>
                  <p className="text-xs text-slate-400">{task.owner}</p>
                </div>
                <div className="relative h-8 rounded-full bg-slate-100">
                  <div
                    className="absolute top-1 h-6 rounded-full bg-brand-500"
                    style={{ left: `${task.start}%`, width: `${task.duration}%` }}
                  />
                  <div
                    className="absolute top-1 h-6 rounded-full bg-brand-700/60"
                    style={{ left: `${task.start}%`, width: `${Math.round(task.duration * task.progress / 100)}%` }}
                  />
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-2 py-1 text-xs ${statusClass(task.status)}`}>{task.status}</span>
                  <p className="mt-1 text-xs text-slate-400">{task.progress}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Stat({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        {icon}
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}
