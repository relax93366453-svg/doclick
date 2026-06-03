"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Calculator,
  CheckCircle2,
  Download,
  FileText,
  Paperclip,
  Plus,
  Printer,
  ReceiptText,
  Save,
  Trash2,
  WalletCards
} from "lucide-react";
import { useMemo, useState } from "react";

type Project = {
  no: string;
  name: string;
  category: string;
  stage: string;
  completed: boolean;
  owner: string;
  startDate: string;
  endDate: string;
  description: string;
  attachment: string;
};

type WorkItem = {
  id: string;
  no: string;
  name: string;
  completed: boolean;
  description: string;
  assignee: string;
  dueDate: string;
  startDate: string;
  endDate: string;
  attachment: string;
};

type MoneyItem = {
  id: string;
  item: string;
  type: "收入" | "支出";
  amount: number;
  invoiceNo: string;
  paymentStatus: string;
  note: string;
};

const defaultProject: Project = {
  no: "PO-20200510-001",
  name: "端午節活促銷活動",
  category: "行銷",
  stage: "規劃",
  completed: false,
  owner: "Rex",
  startDate: "2026-05-10",
  endDate: "2026-05-29",
  description: "指定六角新品規劃促銷活動、設計商品包裝。",
  attachment: "端午促銷活動.pdf"
};

const defaultWorks: WorkItem[] = [
  {
    id: "w1",
    no: "W-00065",
    name: "促銷活動提案",
    completed: true,
    description: "請每人提出兩項方案",
    assignee: "Rex, Gina",
    dueDate: "2026-05-13",
    startDate: "2026-05-10",
    endDate: "2026-05-11",
    attachment: "提案簡報.pdf"
  },
  {
    id: "w2",
    no: "W-00066",
    name: "包裝設計",
    completed: false,
    description: "外包設計師，需有端午節慶元素",
    assignee: "Gina",
    dueDate: "2026-05-20",
    startDate: "2026-05-13",
    endDate: "",
    attachment: ""
  },
  {
    id: "w3",
    no: "W-00067",
    name: "拍攝六角新品",
    completed: true,
    description: "拍攝新品形象照",
    assignee: "Kayline",
    dueDate: "2026-05-20",
    startDate: "2026-05-13",
    endDate: "2026-05-13",
    attachment: "拍攝合約.pdf"
  },
  {
    id: "w4",
    no: "W-00068",
    name: "禮盒印刷",
    completed: false,
    description: "先確認樣品顏色再大量印刷",
    assignee: "Gina",
    dueDate: "2026-05-27",
    startDate: "2026-05-20",
    endDate: "",
    attachment: ""
  }
];

const defaultMoney: MoneyItem[] = [
  { id: "m1", item: "商品銷售", type: "收入", amount: 557480, invoiceNo: "INV-001", paymentStatus: "已收款", note: "端午禮盒預購" },
  { id: "m2", item: "包裝材料", type: "支出", amount: 12000, invoiceNo: "EXP-001", paymentStatus: "已付款", note: "禮盒包材" },
  { id: "m3", item: "攝影費", type: "支出", amount: 18000, invoiceNo: "EXP-002", paymentStatus: "待付款", note: "新品拍攝" },
  { id: "m4", item: "廣告投放", type: "支出", amount: 35000, invoiceNo: "EXP-003", paymentStatus: "已付款", note: "社群廣告" }
];

const stages = ["規劃", "進行中", "待確認", "已完成", "暫停"];
const categories = ["行銷", "行政", "製造", "外勤", "系統導入", "其他"];
const paymentStatusOptions = ["已收款", "待收款", "已付款", "待付款", "作廢"];

function formatMoney(value: number) {
  return `NT$ ${value.toLocaleString()}`;
}

export default function AdvancedProjectsPage() {
  const [project, setProject] = useState<Project>(defaultProject);
  const [works, setWorks] = useState<WorkItem[]>(defaultWorks);
  const [moneyItems, setMoneyItems] = useState<MoneyItem[]>(defaultMoney);
  const [activeTab, setActiveTab] = useState("工作項目");

  const totalIncome = useMemo(
    () => moneyItems.filter((item) => item.type === "收入").reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [moneyItems]
  );

  const totalExpense = useMemo(
    () => moneyItems.filter((item) => item.type === "支出").reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [moneyItems]
  );

  const grossProfit = totalIncome - totalExpense;
  const grossMargin = totalIncome ? Math.round((grossProfit / totalIncome) * 1000) / 10 : 0;
  const completedWorks = works.filter((item) => item.completed).length;
  const progress = works.length ? Math.round((completedWorks / works.length) * 100) : 0;

  function updateProject(key: keyof Project, value: string | boolean) {
    setProject((prev) => ({ ...prev, [key]: value }));
  }

  function updateWork(id: string, key: keyof WorkItem, value: string | boolean) {
    setWorks((prev) => prev.map((item) => item.id === id ? { ...item, [key]: value } : item));
  }

  function updateMoney(id: string, key: keyof MoneyItem, value: string | number) {
    setMoneyItems((prev) => prev.map((item) => item.id === id ? { ...item, [key]: value } : item));
  }

  function addWork() {
    setWorks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        no: `W-${String(prev.length + 65).padStart(5, "0")}`,
        name: "新增工作項目",
        completed: false,
        description: "",
        assignee: "",
        dueDate: "",
        startDate: "",
        endDate: "",
        attachment: ""
      }
    ]);
  }

  function addMoney(type: "收入" | "支出") {
    setMoneyItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        item: type === "收入" ? "新增收入" : "新增支出",
        type,
        amount: 0,
        invoiceNo: "",
        paymentStatus: type === "收入" ? "待收款" : "待付款",
        note: ""
      }
    ]);
  }

  function removeWork(id: string) {
    setWorks((prev) => prev.filter((item) => item.id !== id));
  }

  function removeMoney(id: string) {
    setMoneyItems((prev) => prev.filter((item) => item.id !== id));
  }

  function demoAction(name: string) {
    alert(`Demo：${name}\n正式版可串接資料庫、PDF 產生器與附件儲存空間。`);
  }

  return (
    <AppLayout title="專案管理升級版">
      <PageHeader
        title="專案管理升級版"
        description="專案主表、工作項目子表、收入支出、公式自動計算、附件與列印預覽。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => demoAction("已儲存專案資料")}>
              <Save className="mr-2 h-4 w-4" />
              儲存
            </button>
            <button className="btn-secondary" onClick={() => demoAction("匯出 PDF")}>
              <Download className="mr-2 h-4 w-4" />
              匯出 PDF
            </button>
            <button className="btn-primary" onClick={() => demoAction("列印專案表")}>
              <Printer className="mr-2 h-4 w-4" />
              列印專案表
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="總收入" value={formatMoney(totalIncome)} icon={<WalletCards className="h-5 w-5" />} />
        <Stat label="總支出" value={formatMoney(totalExpense)} icon={<ReceiptText className="h-5 w-5" />} />
        <Stat label="毛利" value={formatMoney(grossProfit)} icon={<Calculator className="h-5 w-5" />} />
        <Stat label="完成率" value={`${progress}%`} icon={<CheckCircle2 className="h-5 w-5" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="card">
            <div className="mb-5 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-4 py-2 text-center font-bold text-white">
              專案資訊
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="專案名稱" value={project.name} onChange={(value) => updateProject("name", value)} />
              <Input label="專案編號" value={project.no} onChange={(value) => updateProject("no", value)} />
              <Select label="專案類別" value={project.category} options={categories} onChange={(value) => updateProject("category", value)} />
              <Select label="專案階段" value={project.stage} options={stages} onChange={(value) => updateProject("stage", value)} />
              <Checkbox label="已完成" checked={project.completed} onChange={(value) => updateProject("completed", value)} />
              <Input label="負責人" value={project.owner} onChange={(value) => updateProject("owner", value)} />
              <Input label="開始日期" type="date" value={project.startDate} onChange={(value) => updateProject("startDate", value)} />
              <Input label="結束日期" type="date" value={project.endDate} onChange={(value) => updateProject("endDate", value)} />
              <Input label="附件" value={project.attachment} onChange={(value) => updateProject("attachment", value)} />
              <Input label="描述" value={project.description} onChange={(value) => updateProject("description", value)} />
            </div>
          </div>

          <div className="card">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {["工作項目", "收入支出", "附件紀錄", "列印預覽"].map((item) => (
                  <button
                    key={item}
                    className={`rounded-xl px-4 py-2 text-sm font-medium ${activeTab === item ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-700"}`}
                    onClick={() => setActiveTab(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {activeTab === "工作項目" && (
                <button className="btn-secondary" onClick={addWork}>
                  <Plus className="mr-2 h-4 w-4" />
                  新增工作項目
                </button>
              )}

              {activeTab === "收入支出" && (
                <div className="flex gap-2">
                  <button className="btn-secondary" onClick={() => addMoney("收入")}>+ 收入</button>
                  <button className="btn-secondary" onClick={() => addMoney("支出")}>+ 支出</button>
                </div>
              )}
            </div>

            {activeTab === "工作項目" && (
              <div className="overflow-auto rounded-2xl border border-slate-200">
                <table className="min-w-[1080px] w-full text-sm">
                  <thead className="bg-violet-50">
                    <tr>
                      {["工作項目編號", "工作項目", "完成", "描述", "指派", "到期日", "開始日期", "結束日期", "附件", ""].map((head) => (
                        <th key={head} className="border-b border-slate-200 px-3 py-3 text-left">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {works.map((item) => (
                      <tr key={item.id}>
                        <Td><input className="w-full bg-transparent outline-none" value={item.no} onChange={(e) => updateWork(item.id, "no", e.target.value)} /></Td>
                        <Td><input className="w-full bg-transparent font-medium outline-none" value={item.name} onChange={(e) => updateWork(item.id, "name", e.target.value)} /></Td>
                        <Td><input type="checkbox" checked={item.completed} onChange={(e) => updateWork(item.id, "completed", e.target.checked)} /></Td>
                        <Td><input className="w-full bg-transparent outline-none" value={item.description} onChange={(e) => updateWork(item.id, "description", e.target.value)} /></Td>
                        <Td><input className="w-full bg-transparent outline-none" value={item.assignee} onChange={(e) => updateWork(item.id, "assignee", e.target.value)} /></Td>
                        <Td><input className="w-full bg-transparent outline-none" type="date" value={item.dueDate} onChange={(e) => updateWork(item.id, "dueDate", e.target.value)} /></Td>
                        <Td><input className="w-full bg-transparent outline-none" type="date" value={item.startDate} onChange={(e) => updateWork(item.id, "startDate", e.target.value)} /></Td>
                        <Td><input className="w-full bg-transparent outline-none" type="date" value={item.endDate} onChange={(e) => updateWork(item.id, "endDate", e.target.value)} /></Td>
                        <Td><input className="w-full bg-transparent outline-none" value={item.attachment} onChange={(e) => updateWork(item.id, "attachment", e.target.value)} /></Td>
                        <Td><button onClick={() => removeWork(item.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></button></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "收入支出" && (
              <div>
                <div className="mb-4 rounded-2xl bg-brand-50 p-4">
                  <div className="grid gap-3 md:grid-cols-4">
                    <Formula label="總收入" value={formatMoney(totalIncome)} formula="收入加總" />
                    <Formula label="總支出" value={formatMoney(totalExpense)} formula="支出加總" />
                    <Formula label="毛利" value={formatMoney(grossProfit)} formula="總收入 - 總支出" />
                    <Formula label="毛利率" value={`${grossMargin}%`} formula="毛利 / 總收入" />
                  </div>
                </div>

                <div className="overflow-auto rounded-2xl border border-slate-200">
                  <table className="min-w-[980px] w-full text-sm">
                    <thead className="bg-rose-50">
                      <tr>
                        {["項目", "類別", "金額", "發票號碼", "付款狀態", "備註", ""].map((head) => (
                          <th key={head} className="border-b border-slate-200 px-3 py-3 text-left">{head}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {moneyItems.map((item) => (
                        <tr key={item.id}>
                          <Td><input className="w-full bg-transparent outline-none" value={item.item} onChange={(e) => updateMoney(item.id, "item", e.target.value)} /></Td>
                          <Td>
                            <select className="w-full bg-transparent outline-none" value={item.type} onChange={(e) => updateMoney(item.id, "type", e.target.value)}>
                              <option>收入</option>
                              <option>支出</option>
                            </select>
                          </Td>
                          <Td><input className="w-full bg-transparent outline-none" type="number" value={item.amount} onChange={(e) => updateMoney(item.id, "amount", Number(e.target.value))} /></Td>
                          <Td><input className="w-full bg-transparent outline-none" value={item.invoiceNo} onChange={(e) => updateMoney(item.id, "invoiceNo", e.target.value)} /></Td>
                          <Td>
                            <select className="w-full bg-transparent outline-none" value={item.paymentStatus} onChange={(e) => updateMoney(item.id, "paymentStatus", e.target.value)}>
                              {paymentStatusOptions.map((option) => <option key={option}>{option}</option>)}
                            </select>
                          </Td>
                          <Td><input className="w-full bg-transparent outline-none" value={item.note} onChange={(e) => updateMoney(item.id, "note", e.target.value)} /></Td>
                          <Td><button onClick={() => removeMoney(item.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></button></Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "附件紀錄" && (
              <div className="grid gap-3 md:grid-cols-2">
                {[project.attachment, ...works.map((item) => item.attachment).filter(Boolean)].map((file) => (
                  <div key={file} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <Paperclip className="h-5 w-5 text-brand-600" />
                      <span className="font-medium">{file}</span>
                    </div>
                    <button className="text-sm text-brand-600" onClick={() => demoAction(`下載 ${file}`)}>下載</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "列印預覽" && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-rose-600">BizFlow</h2>
                    <p className="mt-1 text-sm text-slate-500">專案管理.pdf</p>
                  </div>
                  <button className="btn-secondary" onClick={() => demoAction("列印專案表")}>
                    <Printer className="mr-2 h-4 w-4" />
                    列印
                  </button>
                </div>

                <div className="mb-5 rounded-xl bg-rose-500 px-4 py-2 text-center font-bold text-white">專案資訊</div>
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <PrintInfo label="專案名稱" value={project.name} />
                  <PrintInfo label="專案編號" value={project.no} />
                  <PrintInfo label="專案類別" value={project.category} />
                  <PrintInfo label="專案階段" value={project.stage} />
                  <PrintInfo label="負責人" value={project.owner} />
                  <PrintInfo label="收入" value={formatMoney(totalIncome)} />
                  <PrintInfo label="開始日期" value={project.startDate} />
                  <PrintInfo label="結束日期" value={project.endDate} />
                </div>

                <div className="mb-3 mt-6 rounded-xl bg-violet-500 px-4 py-2 text-center font-bold text-white">工作項目</div>
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>{["編號", "工作項目", "完成", "指派", "到期日"].map((head) => <th key={head} className="border px-2 py-2 text-left">{head}</th>)}</tr>
                  </thead>
                  <tbody>
                    {works.map((item) => (
                      <tr key={item.id}>
                        <td className="border px-2 py-2">{item.no}</td>
                        <td className="border px-2 py-2">{item.name}</td>
                        <td className="border px-2 py-2">{item.completed ? "✓" : ""}</td>
                        <td className="border px-2 py-2">{item.assignee}</td>
                        <td className="border px-2 py-2">{item.dueDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mb-3 mt-6 rounded-xl bg-rose-500 px-4 py-2 text-center font-bold text-white">收入與支出</div>
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>{["項目", "類別", "金額", "狀態"].map((head) => <th key={head} className="border px-2 py-2 text-left">{head}</th>)}</tr>
                  </thead>
                  <tbody>
                    {moneyItems.map((item) => (
                      <tr key={item.id}>
                        <td className="border px-2 py-2">{item.item}</td>
                        <td className="border px-2 py-2">{item.type}</td>
                        <td className="border px-2 py-2">{formatMoney(item.amount)}</td>
                        <td className="border px-2 py-2">{item.paymentStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <h3 className="font-bold">公式自動計算</h3>
            <p className="mt-1 text-sm text-slate-500">依收入支出子表格即時計算。</p>

            <div className="mt-4 space-y-3">
              <Formula label="總收入" value={formatMoney(totalIncome)} formula="SUMIF(類別=收入)" />
              <Formula label="總支出" value={formatMoney(totalExpense)} formula="SUMIF(類別=支出)" />
              <Formula label="毛利" value={formatMoney(grossProfit)} formula="總收入 - 總支出" />
              <Formula label="毛利率" value={`${grossMargin}%`} formula="毛利 ÷ 總收入" />
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold">工作進度</h3>
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-sm">
                <span>完成進度</span>
                <span className="font-bold text-brand-700">{progress}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 rounded-full bg-brand-600" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-sm text-slate-500">已完成 {completedWorks} / {works.length} 項工作。</p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold">快速操作</h3>
            <div className="mt-4 space-y-2">
              {["新增工作項目", "新增收入", "新增支出", "上傳附件", "寄送專案摘要", "複製專案"].map((item) => (
                <button key={item} className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-left text-sm hover:bg-brand-50" onClick={() => demoAction(item)}>
                  {item}
                </button>
              ))}
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
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
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
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex h-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="border-b border-slate-100 px-3 py-3 align-middle">{children}</td>;
}

function Formula({ label, value, formula }: { label: string; value: string; formula: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
      <p className="mt-1 text-xs text-brand-700">{formula}</p>
    </div>
  );
}

function PrintInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[100px_1fr] border-b border-slate-100 py-2">
      <span className="font-medium text-slate-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}
