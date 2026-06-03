"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  GraduationCap,
  KeyRound,
  Laptop,
  Plus,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  UserMinus,
  UsersRound
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type FlowType = "到職" | "調動" | "離職";

type FlowTask = {
  id: string;
  name: string;
  owner: string;
  type: FlowType;
  employee: string;
  department: string;
  startDate: string;
  dueDate: string;
  progress: number;
  status: "進行中" | "待主管確認" | "已完成" | "逾期";
  steps: {
    label: string;
    done: boolean;
  }[];
};

const defaultTasks: FlowTask[] = [
  {
    id: "flow-1",
    name: "新進員工到職流程",
    owner: "人資 A",
    type: "到職",
    employee: "張小萱",
    department: "門市部",
    startDate: "2026-05-12",
    dueDate: "2026-05-18",
    progress: 80,
    status: "進行中",
    steps: [
      { label: "員工基本資料建檔", done: true },
      { label: "勞健保加保流程確認", done: true },
      { label: "帳號與權限開通", done: true },
      { label: "設備與制服發放", done: true },
      { label: "新人訓練完成", done: false },
      { label: "主管到職確認", done: false }
    ]
  },
  {
    id: "flow-2",
    name: "員工調動流程",
    owner: "人資 B",
    type: "調動",
    employee: "林可欣",
    department: "外勤部 → 門市部",
    startDate: "2026-05-10",
    dueDate: "2026-05-16",
    progress: 60,
    status: "待主管確認",
    steps: [
      { label: "調動申請單建立", done: true },
      { label: "原部門主管確認", done: true },
      { label: "新部門主管確認", done: false },
      { label: "權限與班表調整", done: false },
      { label: "薪資或津貼變更確認", done: false }
    ]
  },
  {
    id: "flow-3",
    name: "員工離職流程",
    owner: "人資 A",
    type: "離職",
    employee: "王小明",
    department: "行政部",
    startDate: "2026-05-08",
    dueDate: "2026-05-20",
    progress: 45,
    status: "進行中",
    steps: [
      { label: "離職申請建立", done: true },
      { label: "工作交接清單", done: true },
      { label: "設備與資產歸還", done: false },
      { label: "系統權限停用", done: false },
      { label: "退保流程通知", done: false },
      { label: "離職證明與薪資結清", done: false }
    ]
  }
];

const featureCards = [
  {
    title: "流程進度控管",
    description: "到職、調動、離職每個步驟都能追蹤，不再靠人資人工記憶。",
    icon: FileCheck2
  },
  {
    title: "權限開通與停用",
    description: "新員工到職時開通系統權限，離職時提醒停用帳號避免資安風險。",
    icon: KeyRound
  },
  {
    title: "資產與設備歸還",
    description: "筆電、手機、制服、門禁卡、設備可建立交接與歸還紀錄。",
    icon: Laptop
  },
  {
    title: "新人訓練追蹤",
    description: "入職訓練、制度說明、職務訓練、主管確認都能變成流程節點。",
    icon: GraduationCap
  }
];

function statusClass(status: FlowTask["status"]) {
  if (status === "已完成") return "bg-emerald-50 text-emerald-700";
  if (status === "逾期") return "bg-red-50 text-red-700";
  if (status === "待主管確認") return "bg-amber-50 text-amber-700";
  return "bg-brand-50 text-brand-700";
}

function typeIcon(type: FlowType) {
  if (type === "到職") return UserCheck;
  if (type === "離職") return UserMinus;
  return RotateCcw;
}

export default function HrOnboardingPage() {
  const [tasks, setTasks] = useState<FlowTask[]>(defaultTasks);
  const [activeType, setActiveType] = useState<"全部" | FlowType>("全部");

  useEffect(() => {
    const saved = localStorage.getItem("bizflow-hr-onboarding-flow");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bizflow-hr-onboarding-flow", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (activeType === "全部") return tasks;
    return tasks.filter((task) => task.type === activeType);
  }, [tasks, activeType]);

  const summary = useMemo(() => ({
    onboarding: tasks.filter((task) => task.type === "到職").length,
    transfer: tasks.filter((task) => task.type === "調動").length,
    offboarding: tasks.filter((task) => task.type === "離職").length,
    pending: tasks.filter((task) => task.status !== "已完成").length
  }), [tasks]);

  function addFlow(type: FlowType) {
    const next: FlowTask = {
      id: crypto.randomUUID(),
      name: `${type}流程`,
      owner: "人資 A",
      type,
      employee: "新增員工",
      department: "待設定",
      startDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date().toISOString().slice(0, 10),
      progress: 0,
      status: "進行中",
      steps: type === "到職"
        ? [
            { label: "員工基本資料建檔", done: false },
            { label: "投保流程通知", done: false },
            { label: "帳號與權限開通", done: false },
            { label: "設備發放", done: false },
            { label: "新人訓練完成", done: false }
          ]
        : type === "離職"
          ? [
              { label: "離職申請建立", done: false },
              { label: "工作交接清單", done: false },
              { label: "設備與資產歸還", done: false },
              { label: "權限停用", done: false },
              { label: "退保流程通知", done: false }
            ]
          : [
              { label: "調動申請單建立", done: false },
              { label: "原主管確認", done: false },
              { label: "新主管確認", done: false },
              { label: "權限與班表調整", done: false }
            ]
    };

    setTasks([next, ...tasks]);
  }

  function toggleStep(taskId: string, stepIndex: number) {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        const steps = task.steps.map((step, index) =>
          index === stepIndex ? { ...step, done: !step.done } : step
        );

        const doneCount = steps.filter((step) => step.done).length;
        const progress = Math.round((doneCount / steps.length) * 100);

        return {
          ...task,
          steps,
          progress,
          status: progress === 100 ? "已完成" : task.status === "已完成" ? "進行中" : task.status
        };
      })
    );
  }

  return (
    <AppLayout title="到離職流程">
      <PageHeader
        title="到離職流程"
        description="專門管理員工到職、調動、離職的流程進度、交接、訓練、權限與資產，不放詳細投保資料。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => addFlow("到職")}>
              <Plus className="mr-2 h-4 w-4" />
              新增到職
            </button>
            <button className="btn-secondary" onClick={() => addFlow("調動")}>
              <RotateCcw className="mr-2 h-4 w-4" />
              新增調動
            </button>
            <button className="btn-secondary" onClick={() => addFlow("離職")}>
              <UserMinus className="mr-2 h-4 w-4" />
              新增離職
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="到職流程" value={`${summary.onboarding} 筆`} icon={<UserCheck className="h-5 w-5" />} />
        <Stat label="調動流程" value={`${summary.transfer} 筆`} icon={<RotateCcw className="h-5 w-5" />} />
        <Stat label="離職流程" value={`${summary.offboarding} 筆`} icon={<UserMinus className="h-5 w-5" />} />
        <Stat label="待處理流程" value={`${summary.pending} 筆`} icon={<Clock3 className="h-5 w-5" />} />
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-4">
        {featureCards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className="card mb-5">
        <div className="flex flex-wrap gap-2">
          {["全部", "到職", "調動", "離職"].map((item) => (
            <button
              key={item}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                activeType === item ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-700"
              }`}
              onClick={() => setActiveType(item as "全部" | FlowType)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const Icon = typeIcon(task.type);

          return (
            <div key={task.id} className="card">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{task.type}</span>
                      <span className={`rounded-full px-2 py-1 text-xs ${statusClass(task.status)}`}>{task.status}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold">{task.employee}｜{task.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {task.department}｜負責人：{task.owner}｜{task.startDate} ～ {task.dueDate}
                    </p>
                  </div>
                </div>

                <div className="min-w-60">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">完成度</span>
                    <span className="font-bold text-brand-700">{task.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div className="h-3 rounded-full bg-brand-600" style={{ width: `${task.progress}%` }} />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {task.steps.map((step, index) => (
                  <button
                    key={`${task.id}-${step.label}`}
                    onClick={() => toggleStep(task.id, index)}
                    className={`flex items-center gap-2 rounded-2xl border p-3 text-left text-sm transition ${
                      step.done ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    <CheckCircle2 className={`h-4 w-4 ${step.done ? "text-emerald-600" : "text-slate-300"}`} />
                    {step.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card mt-5">
        <h3 className="text-lg font-bold">與員工投保頁的分工</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <h4 className="font-bold">到離職流程</h4>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              管理流程進度、交接、訓練、資產、權限開通／停用，只保留投保作業提醒，不顯示詳細投保金額。
            </p>
          </div>
          <div className="rounded-2xl bg-brand-50 p-4 text-brand-800">
            <h4 className="font-bold">員工投保</h4>
            <p className="mt-2 text-sm leading-6">
              管理勞保、健保、退休金、投保等級、投保金額、眷屬資料與申報媒體檔。
            </p>
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
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
