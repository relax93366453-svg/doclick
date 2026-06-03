"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  BellRing,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Mail,
  MessageSquareText,
  Plus,
  RotateCcw,
  Save,
  Send,
  Settings2,
  Smartphone,
  UserCheck,
  XCircle
} from "lucide-react";
import { useMemo, useState } from "react";

type ApprovalStatus = "待簽核" | "已核准" | "已退回" | "轉簽中";
type FormType = "請假單" | "請購單" | "費用報支" | "加班申請";

type ApprovalItem = {
  id: string;
  formType: FormType;
  applicant: string;
  department: string;
  title: string;
  amount?: number;
  hours?: number;
  date: string;
  currentApprover: string;
  status: ApprovalStatus;
  progress: number;
  description: string;
  steps: {
    role: string;
    approver: string;
    status: "已送出" | "待簽核" | "已核准" | "已退回";
    time?: string;
    comment?: string;
  }[];
};

type Rule = {
  id: string;
  formType: FormType;
  condition: string;
  approvers: string[];
  notifyEmail: boolean;
  notifyApp: boolean;
  enabled: boolean;
};

const defaultApprovals: ApprovalItem[] = [
  {
    id: "a1",
    formType: "請假單",
    applicant: "王小明",
    department: "外勤部",
    title: "特休申請｜2026/05/28",
    hours: 8,
    date: "2026-05-23",
    currentApprover: "直屬主管",
    status: "待簽核",
    progress: 50,
    description: "因私人行程申請特休一天。",
    steps: [
      { role: "申請人", approver: "王小明", status: "已送出", time: "2026/05/23 09:00" },
      { role: "直屬主管", approver: "林主管", status: "待簽核" },
      { role: "人資", approver: "人資 A", status: "待簽核" }
    ]
  },
  {
    id: "a2",
    formType: "請購單",
    applicant: "陳美美",
    department: "門市部",
    title: "辦公用品請購",
    amount: 12600,
    date: "2026-05-22",
    currentApprover: "部門主管",
    status: "待簽核",
    progress: 33,
    description: "門市補充 A4 紙、清潔用品與收納用品。",
    steps: [
      { role: "申請人", approver: "陳美美", status: "已送出", time: "2026/05/22 14:30" },
      { role: "部門主管", approver: "門市主管", status: "待簽核" },
      { role: "採購", approver: "採購 A", status: "待簽核" },
      { role: "財務", approver: "財務 B", status: "待簽核" }
    ]
  },
  {
    id: "a3",
    formType: "費用報支",
    applicant: "林可欣",
    department: "行政部",
    title: "交通費報支",
    amount: 1280,
    date: "2026-05-21",
    currentApprover: "財務",
    status: "轉簽中",
    progress: 70,
    description: "拜訪客戶交通費用報支。",
    steps: [
      { role: "申請人", approver: "林可欣", status: "已送出", time: "2026/05/21 10:15" },
      { role: "主管", approver: "行政主管", status: "已核准", time: "2026/05/21 11:00", comment: "同意" },
      { role: "財務", approver: "財務 B", status: "待簽核" }
    ]
  },
  {
    id: "a4",
    formType: "加班申請",
    applicant: "張小萱",
    department: "外勤部",
    title: "活動支援加班",
    hours: 2,
    date: "2026-05-20",
    currentApprover: "人資",
    status: "已核准",
    progress: 100,
    description: "活動支援加班 2 小時。",
    steps: [
      { role: "申請人", approver: "張小萱", status: "已送出", time: "2026/05/20 20:00" },
      { role: "主管", approver: "外勤主管", status: "已核准", time: "2026/05/20 21:00", comment: "同意" },
      { role: "人資", approver: "人資 A", status: "已核准", time: "2026/05/21 09:00", comment: "已登錄" }
    ]
  }
];

const defaultRules: Rule[] = [
  {
    id: "r1",
    formType: "請假單",
    condition: "所有請假單皆需直屬主管 + 人資簽核",
    approvers: ["直屬主管", "人資"],
    notifyEmail: true,
    notifyApp: true,
    enabled: true
  },
  {
    id: "r2",
    formType: "請購單",
    condition: "金額超過 NT$ 10,000 需主管 + 採購 + 財務簽核",
    approvers: ["部門主管", "採購", "財務"],
    notifyEmail: true,
    notifyApp: true,
    enabled: true
  },
  {
    id: "r3",
    formType: "費用報支",
    condition: "所有費用報支需主管 + 財務簽核",
    approvers: ["主管", "財務"],
    notifyEmail: true,
    notifyApp: false,
    enabled: true
  }
];

const formTypes: FormType[] = ["請假單", "請購單", "費用報支", "加班申請"];
const statuses: ("全部" | ApprovalStatus)[] = ["全部", "待簽核", "轉簽中", "已核准", "已退回"];

function statusClass(status: ApprovalStatus) {
  if (status === "已核准") return "bg-emerald-50 text-emerald-700";
  if (status === "已退回") return "bg-red-50 text-red-700";
  if (status === "轉簽中") return "bg-violet-50 text-violet-700";
  return "bg-amber-50 text-amber-700";
}

function stepClass(status: ApprovalItem["steps"][number]["status"]) {
  if (status === "已核准" || status === "已送出") return "bg-emerald-50 text-emerald-700";
  if (status === "已退回") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

export default function AdvancedApprovalPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(defaultApprovals);
  const [rules, setRules] = useState<Rule[]>(defaultRules);
  const [activeStatus, setActiveStatus] = useState<"全部" | ApprovalStatus>("全部");
  const [selectedId, setSelectedId] = useState(defaultApprovals[0].id);
  const [activeRuleId, setActiveRuleId] = useState(defaultRules[0].id);

  const filteredApprovals = useMemo(() => {
    if (activeStatus === "全部") return approvals;
    return approvals.filter((item) => item.status === activeStatus);
  }, [approvals, activeStatus]);

  const selected = approvals.find((item) => item.id === selectedId) ?? approvals[0];
  const activeRule = rules.find((rule) => rule.id === activeRuleId) ?? rules[0];

  function updateRule(key: keyof Rule, value: string | boolean | string[]) {
    setRules((prev) => prev.map((rule) => rule.id === activeRule.id ? { ...rule, [key]: value } : rule));
  }

  function approveSelected() {
    setApprovals((prev) =>
      prev.map((item) => {
        if (item.id !== selected.id) return item;

        return {
          ...item,
          status: "已核准",
          progress: 100,
          currentApprover: "已完成",
          steps: item.steps.map((step) =>
            step.status === "待簽核"
              ? { ...step, status: "已核准", time: new Date().toLocaleString("zh-TW"), comment: "同意" }
              : step
          )
        };
      })
    );
  }

  function rejectSelected() {
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              status: "已退回",
              currentApprover: "申請人",
              steps: item.steps.map((step) =>
                step.status === "待簽核"
                  ? { ...step, status: "已退回", time: new Date().toLocaleString("zh-TW"), comment: "資料需補充" }
                  : step
              )
            }
          : item
      )
    );
  }

  function transferSelected() {
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === selected.id
          ? { ...item, status: "轉簽中", currentApprover: "代理主管" }
          : item
      )
    );
  }

  function addApproval() {
    const next: ApprovalItem = {
      id: crypto.randomUUID(),
      formType: "請假單",
      applicant: "新增申請人",
      department: "待設定",
      title: "新增簽核申請",
      date: new Date().toISOString().slice(0, 10),
      currentApprover: "直屬主管",
      status: "待簽核",
      progress: 25,
      description: "請填寫申請內容。",
      steps: [
        { role: "申請人", approver: "新增申請人", status: "已送出", time: new Date().toLocaleString("zh-TW") },
        { role: "直屬主管", approver: "待設定", status: "待簽核" }
      ]
    };

    setApprovals((prev) => [next, ...prev]);
    setSelectedId(next.id);
  }

  function addRule() {
    const next: Rule = {
      id: crypto.randomUUID(),
      formType: "請假單",
      condition: "新增簽核條件",
      approvers: ["直屬主管"],
      notifyEmail: true,
      notifyApp: true,
      enabled: true
    };

    setRules((prev) => [...prev, next]);
    setActiveRuleId(next.id);
  }

  function demoNotify() {
    alert("Demo：已發送 Email / App 簽核通知。\n正式版可串接 Email、LINE Notify、App 推播或簡訊。");
  }

  return (
    <AppLayout title="電子簽核進階版">
      <PageHeader
        title="電子簽核進階版"
        description="請假、請購、費用報支與加班申請可設定簽核條件、人數、通知方式，主管可用手機或 Email 線上簽核。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={addRule}>
              <Settings2 className="mr-2 h-4 w-4" />
              新增簽核規則
            </button>
            <button className="btn-primary" onClick={addApproval}>
              <Plus className="mr-2 h-4 w-4" />
              新增申請單
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="待簽核" value={`${approvals.filter((a) => a.status === "待簽核").length} 筆`} icon={<Clock3 className="h-5 w-5" />} />
        <Stat label="已核准" value={`${approvals.filter((a) => a.status === "已核准").length} 筆`} icon={<CheckCircle2 className="h-5 w-5" />} />
        <Stat label="轉簽中" value={`${approvals.filter((a) => a.status === "轉簽中").length} 筆`} icon={<RotateCcw className="h-5 w-5" />} />
        <Stat label="簽核規則" value={`${rules.length} 組`} icon={<FileCheck2 className="h-5 w-5" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_1fr_420px]">
        <div className="space-y-5">
          <div className="card">
            <h3 className="mb-4 font-bold">待簽核清單</h3>

            <div className="mb-4 flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  className={`rounded-xl px-3 py-2 text-sm ${activeStatus === status ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-600"}`}
                  onClick={() => setActiveStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredApprovals.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-2xl border p-4 text-left ${
                    selectedId === item.id ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{item.formType}</span>
                    <span className={`rounded-full px-2 py-1 text-xs ${statusClass(item.status)}`}>{item.status}</span>
                  </div>
                  <h4 className="font-bold">{item.title}</h4>
                  <p className="mt-1 text-sm text-slate-500">{item.applicant}｜{item.department}</p>
                  <p className="mt-1 text-xs text-slate-400">目前簽核：{item.currentApprover}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold">手機簽核情境</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              老闆不在公司時，可透過手機 App、Email 或通知連結直接核准或退回，不需要登入後台找表單。
            </p>

            <div className="mt-4 rounded-[2rem] border-8 border-slate-900 bg-white p-4">
              <div className="mb-3 h-1.5 w-16 rounded-full bg-slate-300 mx-auto" />
              <div className="rounded-2xl bg-brand-50 p-4">
                <p className="text-xs text-brand-600">BizFlow 簽核通知</p>
                <h4 className="mt-2 font-bold">{selected.formType}待簽核</h4>
                <p className="mt-1 text-sm text-slate-600">{selected.title}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="rounded-xl bg-emerald-600 px-3 py-2 text-sm text-white" onClick={approveSelected}>核准</button>
                  <button className="rounded-xl bg-red-500 px-3 py-2 text-sm text-white" onClick={rejectSelected}>退回</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{selected.formType}</span>
                  <span className={`rounded-full px-2 py-1 text-xs ${statusClass(selected.status)}`}>{selected.status}</span>
                </div>
                <h3 className="mt-3 text-xl font-bold">{selected.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{selected.applicant}｜{selected.department}｜{selected.date}</p>
              </div>

              <div className="flex gap-2">
                <button className="btn-secondary" onClick={transferSelected}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  轉簽
                </button>
                <button className="btn-secondary" onClick={rejectSelected}>
                  <XCircle className="mr-2 h-4 w-4" />
                  退回
                </button>
                <button className="btn-primary" onClick={approveSelected}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  核准
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Info label="目前簽核人" value={selected.currentApprover} />
              <Info label="金額" value={selected.amount ? `NT$ ${selected.amount.toLocaleString()}` : "-"} />
              <Info label="時數" value={selected.hours ? `${selected.hours} 小時` : "-"} />
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium">申請內容</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{selected.description}</p>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm">
                <span>簽核進度</span>
                <span className="font-bold text-brand-700">{selected.progress}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 rounded-full bg-brand-600" style={{ width: `${selected.progress}%` }} />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4 font-bold">簽核流程</h3>

            <div className="space-y-3">
              {selected.steps.map((step, index) => (
                <div key={`${step.role}-${index}`} className="flex gap-3 rounded-2xl border border-slate-200 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold">{step.role}｜{step.approver}</h4>
                      <span className={`rounded-full px-2 py-1 text-xs ${stepClass(step.status)}`}>{step.status}</span>
                    </div>
                    {step.time && <p className="mt-1 text-xs text-slate-400">{step.time}</p>}
                    {step.comment && <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">{step.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4 font-bold">簽核通知</h3>

            <div className="grid gap-3 md:grid-cols-3">
              <button className="rounded-2xl bg-slate-50 p-4 text-left hover:bg-brand-50" onClick={demoNotify}>
                <Mail className="mb-3 h-5 w-5 text-brand-600" />
                <p className="font-bold">Email 通知</p>
                <p className="mt-1 text-sm text-slate-500">寄送待簽核連結</p>
              </button>
              <button className="rounded-2xl bg-slate-50 p-4 text-left hover:bg-brand-50" onClick={demoNotify}>
                <Smartphone className="mb-3 h-5 w-5 text-brand-600" />
                <p className="font-bold">App 推播</p>
                <p className="mt-1 text-sm text-slate-500">手機即時核准</p>
              </button>
              <button className="rounded-2xl bg-slate-50 p-4 text-left hover:bg-brand-50" onClick={demoNotify}>
                <MessageSquareText className="mb-3 h-5 w-5 text-brand-600" />
                <p className="font-bold">LINE / 簡訊</p>
                <p className="mt-1 text-sm text-slate-500">外出也能簽核</p>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <h3 className="mb-4 font-bold">簽核規則設定</h3>

            <div className="mb-4 space-y-2">
              {rules.map((rule) => (
                <button
                  key={rule.id}
                  onClick={() => setActiveRuleId(rule.id)}
                  className={`w-full rounded-2xl border p-3 text-left ${
                    activeRuleId === rule.id ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">{rule.formType}</span>
                    <span className={rule.enabled ? "text-emerald-600 text-sm" : "text-slate-400 text-sm"}>
                      {rule.enabled ? "啟用" : "停用"}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{rule.condition}</p>
                </button>
              ))}
            </div>

            <div className="space-y-4 border-t border-slate-200 pt-4">
              <div>
                <label className="mb-1 block text-sm font-medium">表單類型</label>
                <select className="input" value={activeRule.formType} onChange={(e) => updateRule("formType", e.target.value)}>
                  {formTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">簽核條件</label>
                <textarea className="input min-h-24" value={activeRule.condition} onChange={(e) => updateRule("condition", e.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">簽核人員／角色</label>
                <input
                  className="input"
                  value={activeRule.approvers.join("、")}
                  onChange={(e) => updateRule("approvers", e.target.value.split("、").filter(Boolean))}
                />
                <p className="mt-1 text-xs text-slate-500">用「、」分隔，例如：主管、人資、財務。</p>
              </div>

              <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">
                Email 通知
                <input type="checkbox" checked={activeRule.notifyEmail} onChange={(e) => updateRule("notifyEmail", e.target.checked)} />
              </label>

              <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">
                App 推播
                <input type="checkbox" checked={activeRule.notifyApp} onChange={(e) => updateRule("notifyApp", e.target.checked)} />
              </label>

              <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">
                啟用規則
                <input type="checkbox" checked={activeRule.enabled} onChange={(e) => updateRule("enabled", e.target.checked)} />
              </label>

              <button className="btn-primary w-full" onClick={() => alert("Demo：簽核規則已儲存。")}>
                <Send className="mr-2 h-4 w-4" />
                儲存規則
              </button>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-brand-600" />
              <h3 className="font-bold">流程重點</h3>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <p>採購填好請購單後，主管會立即收到待簽核通知。</p>
              <p>主管可透過 Email 或 App 直接核准，不必登入後台尋找表單。</p>
              <p>可以設定金額、表單類型、部門或角色作為簽核條件。</p>
              <p>支援轉簽、退回補件、簽核紀錄保存。</p>
            </div>
          </div>
        </div>
      </div>
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}
