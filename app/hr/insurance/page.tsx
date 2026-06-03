"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  UserCheck,
  WalletCards
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type InsuranceRecord = {
  id: string;
  employeeNo: string;
  name: string;
  department: string;
  jobTitle: string;
  startDate: string;
  identityNo: string;
  birthday: string;
  laborStatus: string;
  laborDate: string;
  laborLevel: string;
  laborAmount: string;
  healthStatus: string;
  healthDate: string;
  healthLevel: string;
  healthAmount: string;
  pensionStatus: string;
  pensionRate: string;
  employmentInsurance: string;
  socialSubsidy: string;
  disabilitySubsidy: string;
  familyCount: string;
  note: string;
};

const defaultRecords: InsuranceRecord[] = [
  {
    id: "ins-1",
    employeeNo: "A0010",
    name: "陳人資",
    department: "人力資源部",
    jobTitle: "經理",
    startDate: "2022-02-01",
    identityNo: "K290923525",
    birthday: "1986-09-22",
    laborStatus: "投保中",
    laborDate: "2022-02-01",
    laborLevel: "11",
    laborAmount: "42000",
    healthStatus: "投保中",
    healthDate: "2022-02-01",
    healthLevel: "11",
    healthAmount: "42000",
    pensionStatus: "正常提繳",
    pensionRate: "6%",
    employmentInsurance: "有",
    socialSubsidy: "無",
    disabilitySubsidy: "無",
    familyCount: "0",
    note: ""
  },
  {
    id: "ins-2",
    employeeNo: "A0011",
    name: "鍾小美",
    department: "門市部",
    jobTitle: "店長",
    startDate: "2024-01-29",
    identityNo: "A223456789",
    birthday: "1992-03-18",
    laborStatus: "待加保",
    laborDate: "2024-01-29",
    laborLevel: "8",
    laborAmount: "33000",
    healthStatus: "待加保",
    healthDate: "2024-01-29",
    healthLevel: "8",
    healthAmount: "33000",
    pensionStatus: "待設定",
    pensionRate: "6%",
    employmentInsurance: "有",
    socialSubsidy: "無",
    disabilitySubsidy: "無",
    familyCount: "1",
    note: "需補眷屬資料"
  }
];

const operationItems = [
  "加保作業",
  "退保作業",
  "投保薪資調整作業",
  "留停續保／復職作業",
  "申報媒體資料檔",
  "健保局資料下載轉帳"
];

const statusOptions = ["投保中", "待加保", "已退保", "留停續保", "復職待確認"];
const pensionOptions = ["正常提繳", "待設定", "暫停提繳", "已終止"];

function statusClass(status: string) {
  if (status.includes("投保中") || status.includes("正常")) return "bg-emerald-50 text-emerald-700";
  if (status.includes("待")) return "bg-amber-50 text-amber-700";
  if (status.includes("退")) return "bg-red-50 text-red-700";
  return "bg-slate-100 text-slate-700";
}

export default function HrInsurancePage() {
  const [records, setRecords] = useState<InsuranceRecord[]>(defaultRecords);
  const [selectedId, setSelectedId] = useState(defaultRecords[0]?.id ?? "");
  const [keyword, setKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("labor");

  useEffect(() => {
    const saved = localStorage.getItem("bizflow-hr-insurance-records");
    if (saved) {
      const parsed = JSON.parse(saved) as InsuranceRecord[];
      setRecords(parsed);
      setSelectedId(parsed[0]?.id ?? "");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bizflow-hr-insurance-records", JSON.stringify(records));
  }, [records]);

  const filteredRecords = useMemo(() => {
    const lower = keyword.toLowerCase();
    return records.filter((item) =>
      [item.employeeNo, item.name, item.department, item.jobTitle, item.identityNo]
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );
  }, [records, keyword]);

  const selected = records.find((item) => item.id === selectedId) ?? records[0];

  const summary = useMemo(() => ({
    total: records.length,
    active: records.filter((item) => item.laborStatus === "投保中").length,
    pending: records.filter((item) => item.laborStatus.includes("待") || item.healthStatus.includes("待")).length,
    family: records.reduce((sum, item) => sum + Number(item.familyCount || 0), 0)
  }), [records]);

  function updateSelected(key: keyof InsuranceRecord, value: string) {
    if (!selected) return;
    setRecords((prev) => prev.map((item) => item.id === selected.id ? { ...item, [key]: value } : item));
  }

  function addRecord() {
    const next: InsuranceRecord = {
      id: crypto.randomUUID(),
      employeeNo: `A${String(records.length + 1).padStart(4, "0")}`,
      name: "新增員工",
      department: "待設定",
      jobTitle: "待設定",
      startDate: new Date().toISOString().slice(0, 10),
      identityNo: "",
      birthday: "",
      laborStatus: "待加保",
      laborDate: new Date().toISOString().slice(0, 10),
      laborLevel: "1",
      laborAmount: "0",
      healthStatus: "待加保",
      healthDate: new Date().toISOString().slice(0, 10),
      healthLevel: "1",
      healthAmount: "0",
      pensionStatus: "待設定",
      pensionRate: "6%",
      employmentInsurance: "有",
      socialSubsidy: "無",
      disabilitySubsidy: "無",
      familyCount: "0",
      note: ""
    };
    setRecords([next, ...records]);
    setSelectedId(next.id);
  }

  function exportMedia() {
    alert("Demo：已產生申報媒體資料檔。正式版會依勞保／健保格式匯出指定申報檔。");
  }

  function exportTransfer() {
    alert("Demo：已產生健保局資料下載轉帳檔。正式版會連動員工投保資料與眷屬資料。");
  }

  function runOperation(name: string) {
    alert(`Demo：已執行「${name}」。正式版會寫入 PostgreSQL，並產生申報紀錄。`);
  }

  return (
    <AppLayout title="員工投保">
      <PageHeader
        title="員工投保"
        description="管理勞保、健保、退休金、投保等級、投保金額、投保日期、就業保險、補助與申報檔。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={exportMedia}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              申報媒體檔
            </button>
            <button className="btn-secondary" onClick={exportTransfer}>
              <Download className="mr-2 h-4 w-4" />
              健保轉帳檔
            </button>
            <button className="btn-primary" onClick={addRecord}>
              <Plus className="mr-2 h-4 w-4" />
              新增員工投保
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="投保員工" value={`${summary.total} 人`} icon={<UserCheck className="h-5 w-5" />} />
        <Stat label="投保中" value={`${summary.active} 人`} icon={<ShieldCheck className="h-5 w-5" />} />
        <Stat label="待處理" value={`${summary.pending} 筆`} icon={<RefreshCcw className="h-5 w-5" />} />
        <Stat label="眷屬人數" value={`${summary.family} 人`} icon={<WalletCards className="h-5 w-5" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="card">
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="搜尋員工編號、姓名、部門..."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>

          <div className="max-h-[640px] space-y-2 overflow-y-auto pr-1">
            {filteredRecords.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  selected?.id === item.id ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{item.employeeNo}｜{item.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.department}｜{item.jobTitle}</p>
                    <p className="mt-1 text-xs text-slate-400">到職日：{item.startDate}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs ${statusClass(item.laborStatus)}`}>
                    {item.laborStatus}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <div className="space-y-5">
            <div className="card">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selected.employeeNo}｜{selected.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {selected.department}｜{selected.jobTitle}｜到職日：{selected.startDate}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {operationItems.map((item) => (
                    <button key={item} className="btn-secondary text-xs" onClick={() => runOperation(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <Input label="員工編號" value={selected.employeeNo} onChange={(v) => updateSelected("employeeNo", v)} />
                <Input label="姓名" value={selected.name} onChange={(v) => updateSelected("name", v)} />
                <Input label="部門名稱" value={selected.department} onChange={(v) => updateSelected("department", v)} />
                <Input label="職稱" value={selected.jobTitle} onChange={(v) => updateSelected("jobTitle", v)} />
                <Input label="到職日期" type="date" value={selected.startDate} onChange={(v) => updateSelected("startDate", v)} />
                <Input label="身分證字號" value={selected.identityNo} onChange={(v) => updateSelected("identityNo", v)} />
                <Input label="出生日期" type="date" value={selected.birthday} onChange={(v) => updateSelected("birthday", v)} />
                <Input label="眷屬人數" type="number" value={selected.familyCount} onChange={(v) => updateSelected("familyCount", v)} />
              </div>
            </div>

            <div className="card">
              <div className="mb-5 flex flex-wrap gap-2">
                {[["labor", "勞保"], ["health", "健保"], ["pension", "退休金"], ["subsidy", "補助與申報"]].map(([key, label]) => (
                  <button
                    key={key}
                    className={`rounded-xl px-4 py-2 text-sm font-medium ${
                      activeTab === key ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-700"
                    }`}
                    onClick={() => setActiveTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === "labor" && (
                <Section title="勞保資料">
                  <Select label="勞保狀態" value={selected.laborStatus} options={statusOptions} onChange={(v) => updateSelected("laborStatus", v)} />
                  <Input label="投保日期" type="date" value={selected.laborDate} onChange={(v) => updateSelected("laborDate", v)} />
                  <Input label="投保等級" value={selected.laborLevel} onChange={(v) => updateSelected("laborLevel", v)} />
                  <Input label="投保金額" type="number" value={selected.laborAmount} onChange={(v) => updateSelected("laborAmount", v)} />
                  <Select label="就業保險" value={selected.employmentInsurance} options={["有", "無"]} onChange={(v) => updateSelected("employmentInsurance", v)} />
                  <Input label="備註" value={selected.note} onChange={(v) => updateSelected("note", v)} />
                </Section>
              )}

              {activeTab === "health" && (
                <Section title="健保資料">
                  <Select label="健保狀態" value={selected.healthStatus} options={statusOptions} onChange={(v) => updateSelected("healthStatus", v)} />
                  <Input label="投保日期" type="date" value={selected.healthDate} onChange={(v) => updateSelected("healthDate", v)} />
                  <Input label="投保等級" value={selected.healthLevel} onChange={(v) => updateSelected("healthLevel", v)} />
                  <Input label="投保金額" type="number" value={selected.healthAmount} onChange={(v) => updateSelected("healthAmount", v)} />
                  <Input label="眷屬人數" type="number" value={selected.familyCount} onChange={(v) => updateSelected("familyCount", v)} />
                  <Select label="身心障礙補助" value={selected.disabilitySubsidy} options={["無", "有"]} onChange={(v) => updateSelected("disabilitySubsidy", v)} />
                </Section>
              )}

              {activeTab === "pension" && (
                <Section title="退休金資料">
                  <Select label="退休金狀態" value={selected.pensionStatus} options={pensionOptions} onChange={(v) => updateSelected("pensionStatus", v)} />
                  <Input label="提繳率" value={selected.pensionRate} onChange={(v) => updateSelected("pensionRate", v)} />
                  <Input label="投保金額" type="number" value={selected.laborAmount} onChange={(v) => updateSelected("laborAmount", v)} />
                </Section>
              )}

              {activeTab === "subsidy" && (
                <div>
                  <Section title="補助與申報">
                    <Select label="社會補助" value={selected.socialSubsidy} options={["無", "有"]} onChange={(v) => updateSelected("socialSubsidy", v)} />
                    <Select label="身心障礙補助" value={selected.disabilitySubsidy} options={["無", "有"]} onChange={(v) => updateSelected("disabilitySubsidy", v)} />
                    <Select label="就業保險" value={selected.employmentInsurance} options={["有", "無"]} onChange={(v) => updateSelected("employmentInsurance", v)} />
                  </Section>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <button className="rounded-2xl bg-brand-50 p-4 text-left text-brand-700" onClick={exportMedia}>
                      <FileSpreadsheet className="mb-2 h-5 w-5" />
                      <p className="font-bold">申報媒體資料檔</p>
                      <p className="mt-1 text-sm">產生勞保／健保申報媒體檔。</p>
                    </button>
                    <button className="rounded-2xl bg-brand-50 p-4 text-left text-brand-700" onClick={exportTransfer}>
                      <Download className="mb-2 h-5 w-5" />
                      <p className="font-bold">健保局資料下載轉帳</p>
                      <p className="mt-1 text-sm">下載健保局轉帳與比對資料。</p>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="text-lg font-bold">作業檢核</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {["員工基本資料完整", "勞保投保資料完整", "健保投保資料完整", "退休金提繳資料完整", "眷屬資料已確認", "申報媒體檔可產出"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-brand-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="card">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold">{title}</h3>
      <div className="grid gap-4 md:grid-cols-3">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input className="input" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
