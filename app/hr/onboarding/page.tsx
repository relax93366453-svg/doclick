"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  CheckCircle2,
  Download,
  FileCheck2,
  GraduationCap,
  Plus,
  RefreshCcw,
  ShieldCheck,
  UserMinus,
  UserPlus
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type FlowRecord = {
  id: string;
  employee: string;
  type: string;
  department: string;
  owner: string;
  progress: number;
  status: string;
  note: string;
};

type TrainingRecord = {
  id: string;
  employee: string;
  course: string;
  hours: number;
  status: string;
  trainer: string;
};

const defaultFlows: FlowRecord[] = [
  {
    id: "flow-1",
    employee: "張小萱",
    type: "到職",
    department: "門市部",
    owner: "人資 A",
    progress: 80,
    status: "進行中",
    note: "已完成員工資料、勞健保加保，待新人訓練"
  },
  {
    id: "flow-2",
    employee: "林可欣",
    type: "調動",
    department: "客服部 → 外勤部",
    owner: "人資 B",
    progress: 60,
    status: "待主管確認",
    note: "需確認新部門排班與權限"
  },
  {
    id: "flow-3",
    employee: "曾思穎",
    type: "離職",
    department: "行政部",
    owner: "人資 A",
    progress: 40,
    status: "待交接",
    note: "需完成離職交接、資產歸還、勞健保退保"
  }
];

const defaultTraining: TrainingRecord[] = [
  {
    id: "train-1",
    employee: "張小萱",
    course: "新人入職訓練",
    hours: 3,
    status: "已完成",
    trainer: "店長"
  },
  {
    id: "train-2",
    employee: "林可欣",
    course: "外勤服務流程",
    hours: 2,
    status: "進行中",
    trainer: "區域主管"
  }
];

function badgeClass(status: string) {
  if (status.includes("完成")) return "bg-emerald-50 text-emerald-700";
  if (status.includes("待")) return "bg-amber-50 text-amber-700";
  return "bg-brand-50 text-brand-700";
}

export default function HrOnboardingPage() {
  const [flows, setFlows] = useState<FlowRecord[]>(defaultFlows);
  const [training, setTraining] = useState<TrainingRecord[]>(defaultTraining);
  const [active, setActive] = useState("flow");

  useEffect(() => {
    const savedFlows = localStorage.getItem("bizflow-hr-onboarding-flows");
    const savedTraining = localStorage.getItem("bizflow-hr-training");
    if (savedFlows) setFlows(JSON.parse(savedFlows));
    if (savedTraining) setTraining(JSON.parse(savedTraining));
  }, []);

  useEffect(() => {
    localStorage.setItem("bizflow-hr-onboarding-flows", JSON.stringify(flows));
  }, [flows]);

  useEffect(() => {
    localStorage.setItem("bizflow-hr-training", JSON.stringify(training));
  }, [training]);

  const stats = useMemo(() => {
    return {
      onboarding: flows.filter((item) => item.type === "到職").length,
      transfer: flows.filter((item) => item.type === "調動").length,
      offboarding: flows.filter((item) => item.type === "離職").length,
      trainingHours: training.reduce((sum, item) => sum + item.hours, 0)
    };
  }, [flows, training]);

  function addFlow(type: string) {
    const record: FlowRecord = {
      id: crypto.randomUUID(),
      employee: "新增人員",
      type,
      department: type === "調動" ? "原部門 → 新部門" : "待設定",
      owner: "人資",
      progress: 10,
      status: "待處理",
      note: type === "到職"
        ? "建立員工資料、加保、權限、教育訓練"
        : type === "離職"
          ? "離職交接、資產歸還、退保、權限停用"
          : "調動簽核、部門權限、班表重新設定"
    };

    setFlows([record, ...flows]);
    setActive("flow");
  }

  function addTraining() {
    const record: TrainingRecord = {
      id: crypto.randomUUID(),
      employee: "新增人員",
      course: "新人教育訓練",
      hours: 1,
      status: "待安排",
      trainer: "主管"
    };

    setTraining([record, ...training]);
    setActive("training");
  }

  function exportMediaFile() {
    alert("Demo：已產生勞健保媒體申報檔。\n正式版會依資料庫資料輸出指定格式檔案。");
  }

  return (
    <AppLayout title="到離職管理">
      <PageHeader
        title="到離職管理"
        description="管理員工到職、調動、離職流程，並串接加退保、薪調、教育訓練與媒體申報檔。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => addFlow("到職")}>
              <UserPlus className="mr-2 h-4 w-4" />
              新增到職
            </button>
            <button className="btn-secondary" onClick={() => addFlow("調動")}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              新增調動
            </button>
            <button className="btn-secondary" onClick={() => addFlow("離職")}>
              <UserMinus className="mr-2 h-4 w-4" />
              新增離職
            </button>
            <button className="btn-primary" onClick={addTraining}>
              <GraduationCap className="mr-2 h-4 w-4" />
              新增訓練
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="到職流程" value={`${stats.onboarding} 筆`} icon={<UserPlus className="h-5 w-5" />} />
        <Stat label="調動流程" value={`${stats.transfer} 筆`} icon={<RefreshCcw className="h-5 w-5" />} />
        <Stat label="離職流程" value={`${stats.offboarding} 筆`} icon={<UserMinus className="h-5 w-5" />} />
        <Stat label="訓練耗時" value={`${stats.trainingHours} 小時`} icon={<GraduationCap className="h-5 w-5" />} />
      </div>

      <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="text-sm font-bold text-brand-600">01</p>
            <h3 className="mt-2 text-2xl font-bold leading-snug">
              人員到離職頻繁，加退保程序及人事訓練耗時
            </h3>
            <p className="mt-4 leading-7 text-slate-600">
              到職、調動、離職流程都能快速完成設定，並保留異動軌跡。系統可協助追蹤加退保、
              薪調、權限停用、新人訓練與媒體申報檔匯出。
            </p>

            <div className="mt-5 space-y-3 text-sm">
              {[
                "人員到職、調動、離職流程可快速完成設定，並保留異動軌跡",
                "自動計算加保、薪調、轉出相關作業，可一鍵產出媒體申報檔",
                "系統操作介面簡單直覺，新進員工也容易上手"
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-bold text-brand-700">員工與眷屬保險作業</h4>
                <button className="rounded-lg bg-emerald-500 px-3 py-1 text-xs text-white" onClick={exportMediaFile}>
                  匯出
                </button>
              </div>

              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2">員工編號</th>
                    <th>姓名</th>
                    <th>投保狀態</th>
                    <th>勞保薪資</th>
                  </tr>
                </thead>
                <tbody>
                  {["陳馨雯", "王小明", "林可欣"].map((name, index) => (
                    <tr key={name} className="border-b">
                      <td className="py-2">MT00{index + 1}</td>
                      <td>{name}</td>
                      <td>{index === 2 ? "待加保" : "已加保"}</td>
                      <td>{index === 0 ? "45,800" : index === 1 ? "63,800" : "52,000"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 grid gap-2 md:grid-cols-2">
                <button className="rounded-xl bg-brand-50 p-3 text-left text-sm font-semibold text-brand-700">
                  投保明細
                </button>
                <button className="rounded-xl bg-brand-50 p-3 text-left text-sm font-semibold text-brand-700">
                  媒體申報檔
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        {[
          ["flow", "到離職流程"],
          ["training", "人事訓練"],
          ["insurance", "加退保作業"]
        ].map(([key, label]) => (
          <button
            key={key}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${active === key ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-700"}`}
            onClick={() => setActive(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {active === "flow" && (
        <div className="grid gap-4">
          {flows.map((flow) => (
            <div key={flow.id} className="card">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                      {flow.type}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClass(flow.status)}`}>
                      {flow.status}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold">{flow.employee}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {flow.department}｜負責人：{flow.owner}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{flow.note}</p>
                </div>

                <div className="w-full md:w-64">
                  <div className="mb-2 flex justify-between text-xs text-slate-500">
                    <span>完成度</span>
                    <span>{flow.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div className="h-3 rounded-full bg-brand-600" style={{ width: `${flow.progress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === "training" && (
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">人事訓練紀錄</h3>
              <p className="mt-1 text-sm text-slate-500">追蹤新人訓練、調動訓練、制度訓練與主管交接課程。</p>
            </div>
            <button className="btn-primary" onClick={addTraining}>
              <Plus className="mr-2 h-4 w-4" />
              新增訓練
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-slate-500">
                  <th className="p-3">員工</th>
                  <th className="p-3">課程</th>
                  <th className="p-3">時數</th>
                  <th className="p-3">講師</th>
                  <th className="p-3">狀態</th>
                </tr>
              </thead>
              <tbody>
                {training.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3 font-medium">{item.employee}</td>
                    <td className="p-3">{item.course}</td>
                    <td className="p-3">{item.hours} 小時</td>
                    <td className="p-3">{item.trainer}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs ${badgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {active === "insurance" && (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">勞健保加退保作業</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              到職時自動提醒加保，離職時自動提醒退保，並保留作業紀錄與負責人。
            </p>
            <button className="btn-primary mt-5" onClick={exportMediaFile}>
              <Download className="mr-2 h-4 w-4" />
              匯出媒體申報檔
            </button>
          </div>

          <div className="card">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">流程自動檢查</h3>
            <div className="mt-4 space-y-3 text-sm">
              {["員工資料是否完整", "是否完成加保／退保", "是否建立薪資資料", "是否完成新人訓練", "是否停用離職員工權限"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                  <CheckCircle2 className="h-4 w-4 text-brand-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
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
