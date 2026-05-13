"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CloudCog,
  Download,
  Edit3,
  Eye,
  EyeOff,
  FileCheck2,
  FileSpreadsheet,
  Fingerprint,
  KeyRound,
  Landmark,
  MapPin,
  Plus,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Smartphone,
  Trash2,
  UsersRound,
  WalletCards
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type EmployeeField = {
  key: string;
  label: string;
  type: "text" | "date" | "select";
  visible: boolean;
  options?: string[];
};

type Employee = {
  id: string;
  [key: string]: string;
};

type Attendance = {
  id: string;
  employee: string;
  department: string;
  method: string;
  location: string;
  clockIn: string;
  clockOut: string;
  status: string;
  overtimeHours: number;
  leaveHours: number;
};

type Schedule = {
  id: string;
  employee: string;
  shift: string;
  date: string;
  time: string;
  ruleCheck: string;
};

type Approval = {
  id: string;
  employee: string;
  type: string;
  hours: number;
  reason: string;
  status: string;
};

type Payroll = {
  id: string;
  employee: string;
  base: number;
  overtime: number;
  deduction: number;
  tax: number;
  net: number;
  status: string;
};

const defaultEmployeeFields: EmployeeField[] = [
  { key: "employeeNo", label: "員工編號", type: "text", visible: true },
  { key: "name", label: "姓名", type: "text", visible: true },
  { key: "gender", label: "性別", type: "select", visible: true, options: ["女", "男", "其他"] },
  { key: "department", label: "部門", type: "select", visible: true, options: ["外勤部", "門市部", "客服部", "行政部", "財務部", "人資部", "生產部"] },
  { key: "position", label: "職位", type: "text", visible: true },
  { key: "employmentType", label: "任用型態", type: "select", visible: true, options: ["正職", "兼職", "約聘", "遠端", "實習"] },
  { key: "status", label: "狀態", type: "select", visible: true, options: ["在職", "留職停薪", "離職", "待報到"] },
  { key: "phone", label: "電話", type: "text", visible: true },
  { key: "email", label: "Email", type: "text", visible: true },
  { key: "onboardDate", label: "到職日", type: "date", visible: true },
  { key: "manager", label: "主管", type: "text", visible: true },
  { key: "branch", label: "分店／廠區", type: "text", visible: true },
  { key: "leaveBalance", label: "假別餘額", type: "text", visible: true },
  { key: "salaryType", label: "薪資類型", type: "select", visible: true, options: ["月薪", "時薪", "日薪", "件薪"] },
  { key: "note", label: "備註", type: "text", visible: true }
];

const defaultEmployees: Employee[] = [
  {
    id: "emp-1",
    employeeNo: "EMP001",
    name: "王小明",
    gender: "男",
    department: "外勤部",
    position: "外勤專員",
    employmentType: "正職",
    status: "在職",
    phone: "0912-000-001",
    email: "ming@example.com",
    onboardDate: "2024-03-01",
    manager: "區域主管 A",
    branch: "台北區",
    leaveBalance: "特休 7 天",
    salaryType: "月薪",
    note: "可支援跨店外勤"
  },
  {
    id: "emp-2",
    employeeNo: "EMP002",
    name: "陳美美",
    gender: "女",
    department: "門市部",
    position: "店長",
    employmentType: "正職",
    status: "在職",
    phone: "0912-000-002",
    email: "mei@example.com",
    onboardDate: "2023-08-15",
    manager: "營運主管",
    branch: "林口店",
    leaveBalance: "特休 5 天",
    salaryType: "月薪",
    note: "負責門市排班"
  },
  {
    id: "emp-3",
    employeeNo: "EMP003",
    name: "林志豪",
    gender: "男",
    department: "客服部",
    position: "客服主管",
    employmentType: "遠端",
    status: "在職",
    phone: "0912-000-003",
    email: "hao@example.com",
    onboardDate: "2022-11-20",
    manager: "總管理處",
    branch: "居家辦公",
    leaveBalance: "特休 10 天",
    salaryType: "月薪",
    note: "居家辦公，需 GPS 打卡"
  }
];

const defaultAttendance: Attendance[] = [
  { id: "a1", employee: "王小明", department: "外勤部", method: "手機 App GPS", location: "台北市信義區", clockIn: "09:01", clockOut: "18:12", status: "正常", overtimeHours: 0.2, leaveHours: 0 },
  { id: "a2", employee: "陳美美", department: "門市部", method: "網頁打卡", location: "林口店", clockIn: "09:18", clockOut: "18:03", status: "遲到", overtimeHours: 0, leaveHours: 0 },
  { id: "a3", employee: "林志豪", department: "客服部", method: "手機 App", location: "居家辦公", clockIn: "08:55", clockOut: "19:10", status: "加班", overtimeHours: 1.1, leaveHours: 0 }
];

const defaultSchedules: Schedule[] = [
  { id: "s1", employee: "王小明", shift: "早班", date: "2026-05-12", time: "09:00 - 18:00", ruleCheck: "合法" },
  { id: "s2", employee: "陳美美", shift: "晚班", date: "2026-05-12", time: "14:00 - 23:00", ruleCheck: "需檢查休息間隔" }
];

const defaultApprovals: Approval[] = [
  { id: "p1", employee: "陳美美", type: "加班申請", hours: 2, reason: "門市盤點", status: "待主管簽核" },
  { id: "p2", employee: "林志豪", type: "特休申請", hours: 8, reason: "家庭因素", status: "已核准" }
];

const defaultPayroll: Payroll[] = [
  { id: "pay1", employee: "王小明", base: 42000, overtime: 360, deduction: 0, tax: 2100, net: 40260, status: "可結薪" },
  { id: "pay2", employee: "陳美美", base: 38000, overtime: 1200, deduction: 300, tax: 1900, net: 37000, status: "待檢核" }
];

const tabs = [
  ["overview", "人事總覽"],
  ["people", "人員資料"],
  ["attendance", "考勤打卡"],
  ["schedule", "智慧排班"],
  ["approval", "電子簽核"],
  ["payroll", "薪資稅務"],
  ["reports", "數據報表"],
  ["security", "資安法規"],
  ["mobile", "員工自助 App"],
];

function money(value: number) {
  return `NT$ ${value.toLocaleString("zh-TW")}`;
}
function HrPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "overview";

  const [employees, setEmployees] = useState<Employee[]>(defaultEmployees);
  const [employeeFields, setEmployeeFields] = useState<EmployeeField[]>(defaultEmployeeFields);
  const [attendance, setAttendance] = useState<Attendance[]>(defaultAttendance);
  const [schedules, setSchedules] = useState<Schedule[]>(defaultSchedules);
  const [approvals, setApprovals] = useState<Approval[]>(defaultApprovals);
  const [payroll, setPayroll] = useState<Payroll[]>(defaultPayroll);

  useEffect(() => {
    const e = localStorage.getItem("bizflow-hr-employees");
    const f = localStorage.getItem("bizflow-hr-employee-fields");
    const a = localStorage.getItem("bizflow-hr-attendance");
    const s = localStorage.getItem("bizflow-hr-schedules");
    const p = localStorage.getItem("bizflow-hr-approvals");
    const y = localStorage.getItem("bizflow-hr-payroll");
    if (e) setEmployees(JSON.parse(e));
    if (f) setEmployeeFields(JSON.parse(f));
    if (a) setAttendance(JSON.parse(a));
    if (s) setSchedules(JSON.parse(s));
    if (p) setApprovals(JSON.parse(p));
    if (y) setPayroll(JSON.parse(y));
  }, []);

  useEffect(() => localStorage.setItem("bizflow-hr-employees", JSON.stringify(employees)), [employees]);
  useEffect(() => localStorage.setItem("bizflow-hr-employee-fields", JSON.stringify(employeeFields)), [employeeFields]);
  useEffect(() => localStorage.setItem("bizflow-hr-attendance", JSON.stringify(attendance)), [attendance]);
  useEffect(() => localStorage.setItem("bizflow-hr-schedules", JSON.stringify(schedules)), [schedules]);
  useEffect(() => localStorage.setItem("bizflow-hr-approvals", JSON.stringify(approvals)), [approvals]);
  useEffect(() => localStorage.setItem("bizflow-hr-payroll", JSON.stringify(payroll)), [payroll]);

  const stats = useMemo(() => {
    return {
      employees: employees.length,
      abnormal: attendance.filter((x) => x.status !== "正常").length,
      overtime: attendance.reduce((sum, x) => sum + x.overtimeHours, 0),
      leave: attendance.reduce((sum, x) => sum + x.leaveHours, 0),
      payable: payroll.reduce((sum, x) => sum + x.net, 0)
    };
  }, [employees, attendance, payroll]);

  function goTab(tab: string) {
    router.push(tab === "overview" ? "/hr" : `/hr?tab=${tab}`);
  }

  function addAttendance() {
    setAttendance((prev) => [{
      id: crypto.randomUUID(),
      employee: "新增員工",
      department: "外勤部",
      method: "手機 App GPS",
      location: "GPS 已定位",
      clockIn: new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }),
      clockOut: "未打卡",
      status: "待確認",
      overtimeHours: 0,
      leaveHours: 0
    }, ...prev]);
    goTab("attendance");
  }

  function addSchedule() {
    setSchedules((prev) => [{
      id: crypto.randomUUID(),
      employee: "新增員工",
      shift: "早班",
      date: new Date().toISOString().slice(0, 10),
      time: "09:00 - 18:00",
      ruleCheck: "合法"
    }, ...prev]);
    goTab("schedule");
  }

  function runPayroll() {
    setPayroll((prev) => [{
      id: crypto.randomUUID(),
      employee: "新增員工",
      base: 36000,
      overtime: 0,
      deduction: 0,
      tax: 1800,
      net: 34200,
      status: "已試算"
    }, ...prev]);
    goTab("payroll");
  }

  function exportReport(name: string) {
    alert(`${name} 已產生 Demo。\n正式版會從 PostgreSQL 產出 Excel / PDF 報表。`);
  }

  return (
    <AppLayout title="人事管理">
      <PageHeader
        title="人事管理"
        description="整合人員資料、考勤、排班、薪資、簽核、員工自助、資安與報表。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={addAttendance}>新增打卡</button>
            <button className="btn-secondary" onClick={addSchedule}>新增班表</button>
            <button className="btn-primary" onClick={runPayroll}>薪資試算</button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-5">
        <Stat label="員工總數" value={`${stats.employees} 人`} />
        <Stat label="異常出勤" value={`${stats.abnormal} 筆`} />
        <Stat label="本月加班" value={`${stats.overtime.toFixed(1)} 小時`} />
        <Stat label="請假時數" value={`${stats.leave.toFixed(1)} 小時`} />
        <Stat label="本月應發薪資" value={money(stats.payable)} />
      </div>

      <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${activeTab === key ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
            onClick={() => goTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <Overview />}
      {activeTab === "people" && (
        <People
          employees={employees}
          setEmployees={setEmployees}
          fields={employeeFields}
          setFields={setEmployeeFields}
        />
      )}
      {activeTab === "attendance" && <AttendanceSection attendance={attendance} addAttendance={addAttendance} />}
      {activeTab === "schedule" && <ScheduleSection schedules={schedules} addSchedule={addSchedule} />}
      {activeTab === "approval" && <ApprovalSection approvals={approvals} setApprovals={setApprovals} />}
      {activeTab === "payroll" && <PayrollSection payroll={payroll} runPayroll={runPayroll} />}
      {activeTab === "reports" && <Reports exportReport={exportReport} />}
      {activeTab === "security" && <Security />}
      {activeTab === "mobile" && <Mobile />}
    </AppLayout>
  );
}

function People({
  employees,
  setEmployees,
  fields,
  setFields
}: {
  employees: Employee[];
  setEmployees: (value: Employee[]) => void;
  fields: EmployeeField[];
  setFields: (value: EmployeeField[]) => void;
}) {
  const [editing, setEditing] = useState<Employee | null>(null);
  const [keyword, setKeyword] = useState("");
  const [fieldPanelOpen, setFieldPanelOpen] = useState(false);
  const visibleFields = fields.filter((field) => field.visible);

  const filtered = employees.filter((employee) =>
    fields
      .map((field) => employee[field.key] ?? "")
      .join(" ")
      .toLowerCase()
      .includes(keyword.toLowerCase())
  );

  function openNew() {
    const record: Employee = { id: crypto.randomUUID() };
    fields.forEach((field) => {
      record[field.key] = field.key === "employeeNo"
        ? `EMP${String(employees.length + 1).padStart(3, "0")}`
        : field.type === "select"
          ? field.options?.[0] ?? ""
          : field.type === "date"
            ? new Date().toISOString().slice(0, 10)
            : "";
    });
    setEditing(record);
  }

  function saveEmployee() {
    if (!editing) return;
    const nameKey = fields.find((field) => field.label === "姓名")?.key ?? "name";
    if (!(editing[nameKey] ?? "").trim()) {
      alert("請輸入姓名");
      return;
    }

    const exists = employees.some((employee) => employee.id === editing.id);
    if (exists) {
      setEmployees(employees.map((employee) => (employee.id === editing.id ? editing : employee)));
    } else {
      setEmployees([editing, ...employees]);
    }

    setEditing(null);
  }

  function deleteEmployee(id: string) {
    if (!confirm("確定要刪除這位員工資料嗎？")) return;
    setEmployees(employees.filter((employee) => employee.id !== id));
  }

  function updateEmployeeValue(key: string, value: string) {
    if (!editing) return;
    setEditing({ ...editing, [key]: value });
  }

  function updateField(index: number, updates: Partial<EmployeeField>) {
    setFields(fields.map((field, i) => (i === index ? { ...field, ...updates } : field)));
  }

  function addField() {
    const key = `custom_${Date.now()}`;
    setFields([
      ...fields,
      {
        key,
        label: "新增欄位",
        type: "text",
        visible: true
      }
    ]);
  }

  function deleteField(index: number) {
    const target = fields[index];
    if (!target) return;
    if (!confirm(`確定要刪除欄位「${target.label}」嗎？`)) return;
    setFields(fields.filter((_, i) => i !== index));
  }

  function resetFields() {
    if (!confirm("確定要恢復預設欄位嗎？")) return;
    setFields(defaultEmployeeFields);
  }

  return (
    <div className="space-y-5">
      <div className="card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold">人員資料</h3>
            <p className="mt-1 text-sm text-slate-500">
              可新增、編輯、刪除員工資料，也可以自訂欄位名稱、顯示與新增欄位。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => setFieldPanelOpen((prev) => !prev)}>
              <Settings2 className="mr-2 h-4 w-4" />
              欄位設定
            </button>
            <button className="btn-primary" onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" />
              新增員工
            </button>
          </div>
        </div>

        {fieldPanelOpen && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold">人員資料欄位設定</h4>
                <p className="mt-1 text-sm text-slate-500">你可以改欄位名稱、控制是否顯示，或新增公司需要的欄位。</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={addField}>新增欄位</button>
                <button className="btn-secondary" onClick={resetFields}>恢復預設</button>
              </div>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.key} className="grid gap-2 rounded-xl bg-white p-3 md:grid-cols-[1fr_160px_120px_120px] md:items-center">
                  <input
                    className="input"
                    value={field.label}
                    onChange={(event) => updateField(index, { label: event.target.value })}
                    placeholder="欄位名稱"
                  />
                  <select
                    className="input"
                    value={field.type}
                    onChange={(event) => updateField(index, { type: event.target.value as EmployeeField["type"] })}
                  >
                    <option value="text">文字</option>
                    <option value="date">日期</option>
                    <option value="select">選單</option>
                  </select>
                  <button className="btn-secondary" onClick={() => updateField(index, { visible: !field.visible })}>
                    {field.visible ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                    {field.visible ? "顯示" : "隱藏"}
                  </button>
                  <button className="btn-secondary" onClick={() => deleteField(index)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    刪除
                  </button>

                  {field.type === "select" && (
                    <input
                      className="input md:col-span-4"
                      value={(field.options ?? []).join("、")}
                      onChange={(event) =>
                        updateField(index, {
                          options: event.target.value.split("、").map((item) => item.trim()).filter(Boolean)
                        })
                      }
                      placeholder="選單選項，用頓號分隔，例如：在職、離職、留職停薪"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          className="input mt-4 max-w-md"
          placeholder="搜尋任一欄位內容..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-slate-500">
                {visibleFields.map((field) => (
                  <th key={field.key} className="p-3">{field.label}</th>
                ))}
                <th className="p-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((employee) => (
                <tr key={employee.id} className="border-b">
                  {visibleFields.map((field) => (
                    <td key={field.key} className="p-3">
                      {field.key === "status" ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                          {employee[field.key] || "-"}
                        </span>
                      ) : (
                        employee[field.key] || "-"
                      )}
                    </td>
                  ))}
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="btn-secondary px-3 py-1 text-xs" onClick={() => setEditing(employee)}>
                        <Edit3 className="mr-1 h-3 w-3" />
                        編輯
                      </button>
                      <button className="btn-secondary px-3 py-1 text-xs" onClick={() => deleteEmployee(employee.id)}>
                        <Trash2 className="mr-1 h-3 w-3" />
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{employees.some((employee) => employee.id === editing.id) ? "編輯員工" : "新增員工"}</h3>
                <p className="mt-1 text-sm text-slate-500">欄位會依照「欄位設定」自動變動。</p>
              </div>
              <button className="btn-secondary" onClick={() => setEditing(null)}>關閉</button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {fields.map((field) => (
                <DynamicField
                  key={field.key}
                  field={field}
                  value={editing[field.key] ?? ""}
                  onChange={(value) => updateEmployeeValue(field.key, value)}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setEditing(null)}>取消</button>
              <button className="btn-primary" onClick={saveEmployee}>儲存員工資料</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DynamicField({ field, value, onChange }: { field: EmployeeField; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{field.label}</label>
      {field.type === "select" ? (
        <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input className="input" type={field.type} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}

function Overview() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="card">
        <h3 className="text-lg font-bold">人事總覽</h3>
        <p className="mt-1 text-sm text-slate-500">保留原本總覽內容，快速掌握差勤、排班、薪資與簽核狀態。</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            { title: "今日異常出勤", text: "2 位員工遲到／補卡待確認" },
            { title: "待簽核表單", text: "3 筆加班／請假申請待主管簽核" },
            { title: "排班法規提醒", text: "1 筆班表需檢查休息間隔" },
            { title: "薪資結算狀態", text: "本月薪資可開始試算與檢核" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-slate-50 p-4">
              <h4 className="font-semibold">{item.title}</h4>
              <p className="mt-2 text-sm text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <Checklist title="快捷功能" items={["新增員工資料", "新增打卡紀錄", "新增班表", "新增簽核表單", "薪資試算", "下載報表"]} />
    </div>
  );
}

function AttendanceSection({ attendance, addAttendance }: { attendance: Attendance[]; addAttendance: () => void }) {
  return (
    <div className="card">
      <Header title="考勤打卡" text="支援手機 App、網頁、實體設備、GPS、多廠區與居家辦公。" action={<button className="btn-primary" onClick={addAttendance}>新增打卡</button>} />
      <Table headers={["員工", "部門", "打卡方式", "地點", "上班", "下班", "狀態", "加班"]} rows={attendance.map((x) => [x.employee, x.department, x.method, x.location, x.clockIn, x.clockOut, x.status, `${x.overtimeHours} 小時`])} />
    </div>
  );
}

function ScheduleSection({ schedules, addSchedule }: { schedules: Schedule[]; addSchedule: () => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="card">
        <Header title="智慧排班" text="預先檢查一例一休、變形工時、連續工時與休息間隔。" action={<button className="btn-primary" onClick={addSchedule}>新增班表</button>} />
        <div className="space-y-3">
          {schedules.map((x) => (
            <div key={x.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold">{x.employee}｜{x.shift}</p>
                  <p className="mt-1 text-sm text-slate-500">{x.date} {x.time}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${x.ruleCheck === "合法" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{x.ruleCheck}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Checklist title="法規防呆設定" items={["一例一休檢核", "變形工時檢核", "連續上班天數提醒", "每日工時上限提醒", "休息間隔檢核"]} />
    </div>
  );
}

function ApprovalSection({ approvals, setApprovals }: { approvals: Approval[]; setApprovals: (value: Approval[]) => void }) {
  function addApproval() {
    setApprovals([{
      id: crypto.randomUUID(),
      employee: "新增員工",
      type: "請假申請",
      hours: 8,
      reason: "個人事務",
      status: "待主管簽核"
    }, ...approvals]);
  }

  return (
    <div className="card">
      <Header title="電子簽核" text="請假、加班、補卡、出差、報銷都可手機送出與主管即時簽核。" action={<button className="btn-primary" onClick={addApproval}>新增簽核</button>} />
      <div className="grid gap-4 md:grid-cols-2">
        {approvals.map((x) => (
          <div key={x.id} className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold">{x.type}</h4>
                <p className="mt-1 text-sm text-slate-500">{x.employee}｜{x.hours} 小時</p>
                <p className="mt-2 text-sm">{x.reason}</p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-700">{x.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PayrollSection({ payroll, runPayroll }: { payroll: Payroll[]; runPayroll: () => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="card">
        <Header title="薪資稅務" text="差勤、排班、加班、請假直接連動薪資試算與稅務報表。" action={<button className="btn-primary" onClick={runPayroll}>薪資試算</button>} />
        <Table headers={["員工", "本薪", "加班費", "請假扣款", "所得稅", "實發", "狀態"]} rows={payroll.map((x) => [x.employee, money(x.base), money(x.overtime), money(x.deduction), money(x.tax), money(x.net), x.status])} />
      </div>
      <div className="card">
        <h3 className="font-bold">薪資公式設定</h3>
        <div className="mt-4 space-y-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">本薪 + 津貼 + 加班費 - 請假扣款 - 勞健保 - 所得稅</div>
          <div className="rounded-xl bg-slate-50 p-3">支援部門、職級、自訂薪資項目</div>
        </div>
      </div>
    </div>
  );
}

function Reports({ exportReport }: { exportReport: (name: string) => void }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <ReportCard icon={<FileSpreadsheet className="h-5 w-5" />} title="精準差勤統計報表" text="彙整打卡紀錄、請假時數、加班統計、異常出勤，作為發薪前檢核依據。" button="下載差勤報表" onClick={() => exportReport("差勤統計報表")} />
      <ReportCard icon={<ReceiptText className="h-5 w-5" />} title="自動化薪資與稅務報表" text="產出薪資明細表、試算檢核表、所得稅報表，降低人工計算與轉檔錯誤。" button="下載薪資報表" onClick={() => exportReport("薪資與稅務報表")} />
    </div>
  );
}

function Security() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[
        { title: "雲端資安", text: "支援高等級雲端部署、資料加密、存取紀錄與備份策略。", icon: CloudCog },
        { title: "權限分級", text: "依角色設定 HR、主管、員工、財務可見與可操作範圍。", icon: KeyRound },
        { title: "法規版本", text: "維護勞基法、公司制度、排班規範與薪資規則版本。", icon: Landmark },
        { title: "GPS 定位", text: "外勤與居家辦公打卡可保留定位與照片附件。", icon: MapPin },
      ].map((x) => {
        const Icon = x.icon;
        return (
          <div key={x.title} className="card">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon className="h-5 w-5" /></div>
            <h3 className="text-lg font-bold">{x.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{x.text}</p>
          </div>
        );
      })}
    </div>
  );
}

function Mobile() {
  return (
    <div className="card">
      <Header title="員工自助 App" text="員工可用手機查班表、打卡、申請請假、查看薪資單與簽核進度。" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["查詢假別餘額", "查看班表", "查看薪資單", "送出請假／加班"].map((item) => (
          <div key={item} className="rounded-2xl bg-slate-50 p-4">
            <Smartphone className="mb-3 h-5 w-5 text-brand-600" />
            <p className="font-medium">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="card"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>;
}

function Header({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="text-lg font-bold">{title}</h3><p className="mt-1 text-sm text-slate-500">{text}</p></div>{action}</div>;
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-sm">
        <thead><tr className="border-b bg-slate-50 text-left text-slate-500">{headers.map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i} className="border-b">{row.map((cell, j) => <td key={j} className="p-3">{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card">
      <h3 className="font-bold">{title}</h3>
      <div className="mt-4 space-y-3 text-sm">
        {items.map((item) => <div key={item} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3"><CheckCircle2 className="h-4 w-4 text-brand-600" />{item}</div>)}
      </div>
    </div>
  );
}

function ReportCard({ icon, title, text, button, onClick }: { icon: ReactNode; title: string; text: string; button: string; onClick: () => void }) {
  return (
    <div className="card">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">{icon}</div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
      <button className="btn-primary mt-5" onClick={onClick}><Download className="mr-2 h-4 w-4" />{button}</button>
    </div>
  );
}
export default function HrPage() {
  return (
    <Suspense fallback={<div className="p-6">載入中...</div>}>
      <HrPageContent />
    </Suspense>
  );
}