"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  BadgeDollarSign,
  CalendarDays,
  Download,
  Edit3,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Filter,
  GripVertical,
  Plus,
  ReceiptText,
  Save,
  Search,
  Settings2,
  Trash2,
  TrendingDown,
  TrendingUp,
  WalletCards,
  X
} from "lucide-react";
import { useMemo, useState } from "react";

type CashflowType = "收入" | "支出" | "應收款" | "代墊";
type Currency = "NTD" | "USD" | "JPY";
type FieldType = "文字" | "下拉選單" | "日期" | "數值" | "金額" | "備註";

type FieldSetting = {
  key: keyof CashflowItem | "actions";
  label: string;
  type: FieldType;
  required: boolean;
  visible: boolean;
  editable: boolean;
  width: string;
};

type CashflowItem = {
  id: string;
  type: CashflowType;
  item: string;
  project: string;
  invoiceDate: string;
  originalAmount: number;
  currency: Currency;
  rate: number;
  amountTwd: number;
  note: string;
};

const initialData: CashflowItem[] = [
  { id: "CF-20200430-01", type: "應收款", item: "10萬元支票", project: "合作店家管理", invoiceDate: "2020/04/28", originalAmount: 100000, currency: "NTD", rate: 1, amountTwd: 100000, note: "月結應收票據" },
  { id: "CF-20200415-01", type: "支出", item: "禮盒印刷尾款", project: "端午節活促銷活動", invoiceDate: "2020/04/15", originalAmount: 16240, currency: "NTD", rate: 1, amountTwd: -10000, note: "4/8 已先付 50%，本次結清尾款" },
  { id: "CF-20200408-02", type: "支出", item: "禮盒印刷訂金", project: "端午節活促銷活動", invoiceDate: "2020/04/08", originalAmount: 16240, currency: "NTD", rate: 1, amountTwd: -6240, note: "先付 50%，拿到樣品確認後再付尾款" },
  { id: "CF-20200408-01", type: "支出", item: "油漆工程", project: "二店裝潢", invoiceDate: "2020/04/08", originalAmount: 7500, currency: "NTD", rate: 1, amountTwd: -2390, note: "" },
  { id: "CF-20200406-02", type: "支出", item: "第二批食材原料", project: "五月新品研發", invoiceDate: "2020/04/06", originalAmount: 12390, currency: "NTD", rate: 1, amountTwd: -12390, note: "" },
  { id: "CF-20200404-01", type: "代墊", item: "代墊音樂版權費", project: "KOL 合作影片", invoiceDate: "2020/04/04", originalAmount: 37, currency: "USD", rate: 30.315, amountTwd: -1122, note: "行銷影片使用有版權音樂" },
  { id: "CF-20200401-07", type: "收入", item: "4/1 線上營收", project: "線上商城", invoiceDate: "2020/04/01", originalAmount: 25690, currency: "NTD", rate: 1, amountTwd: 25690, note: "" },
  { id: "CF-20200401-06", type: "收入", item: "4/1 一店營收", project: "門市營收", invoiceDate: "2020/04/01", originalAmount: 17580, currency: "NTD", rate: 1, amountTwd: 17580, note: "" },
  { id: "CF-20200401-05", type: "支出", item: "土木工程", project: "二店裝潢", invoiceDate: "2020/04/01", originalAmount: 13890, currency: "NTD", rate: 1, amountTwd: -13890, note: "" },
  { id: "CF-20200331-04", type: "支出", item: "4月一店租金", project: "門市營運", invoiceDate: "2020/03/31", originalAmount: 42000, currency: "NTD", rate: 1, amountTwd: -42000, note: "下個月調漲 5% 房租" }
];

const defaultFields: FieldSetting[] = [
  { key: "id", label: "收支編號", type: "文字", required: true, visible: true, editable: true, width: "160px" },
  { key: "type", label: "類別", type: "下拉選單", required: true, visible: true, editable: true, width: "110px" },
  { key: "item", label: "項目", type: "文字", required: true, visible: true, editable: true, width: "180px" },
  { key: "project", label: "專案名稱", type: "文字", required: false, visible: true, editable: true, width: "180px" },
  { key: "invoiceDate", label: "發票日期", type: "日期", required: true, visible: true, editable: true, width: "150px" },
  { key: "originalAmount", label: "原始幣別金額", type: "金額", required: true, visible: true, editable: true, width: "150px" },
  { key: "currency", label: "幣別", type: "下拉選單", required: true, visible: true, editable: true, width: "100px" },
  { key: "rate", label: "匯率", type: "數值", required: true, visible: true, editable: true, width: "90px" },
  { key: "amountTwd", label: "台幣金額", type: "金額", required: true, visible: true, editable: true, width: "140px" },
  { key: "note", label: "備註", type: "備註", required: false, visible: true, editable: true, width: "260px" },
  { key: "actions", label: "操作", type: "文字", required: false, visible: true, editable: false, width: "120px" }
];

function typeClass(type: CashflowType) {
  if (type === "收入") return "bg-emerald-50 text-emerald-700";
  if (type === "應收款") return "bg-amber-50 text-amber-700";
  if (type === "代墊") return "bg-red-600 text-white";
  return "bg-rose-50 text-rose-700";
}

function money(value: number) {
  const sign = value < 0 ? "-" : "";
  return `${sign}NT$ ${Math.abs(value).toLocaleString("zh-TW")}`;
}

function todayId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const t = String(now.getTime()).slice(-4);
  return `CF-${y}${m}${d}-${t}`;
}

function toInputDate(value: string) {
  return value.replaceAll("/", "-");
}

function toDisplayDate(value: string) {
  return value.replaceAll("-", "/");
}

export default function FinanceCashflowPage() {
  const [items, setItems] = useState<CashflowItem[]>(initialData);
  const [fields, setFields] = useState<FieldSetting[]>(defaultFields);
  const [activeTab, setActiveTab] = useState<"list" | "fields" | "create">("list");
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState<"全部" | CashflowType>("全部");
  const [project, setProject] = useState("全部專案");
  const [month, setMonth] = useState("全部月份");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CashflowItem | null>(null);
  const [newFieldLabel, setNewFieldLabel] = useState("");

  const visibleFields = fields.filter((field) => field.visible);

  const projects = useMemo(() => ["全部專案", ...Array.from(new Set(items.map((item) => item.project)))], [items]);
  const months = useMemo(() => ["全部月份", ...Array.from(new Set(items.map((item) => item.invoiceDate.slice(0, 7))))], [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchKeyword = [item.id, item.item, item.project, item.note].join(" ").includes(keyword);
      const matchType = type === "全部" || item.type === type;
      const matchProject = project === "全部專案" || item.project === project;
      const matchMonth = month === "全部月份" || item.invoiceDate.startsWith(month);
      return matchKeyword && matchType && matchProject && matchMonth;
    });
  }, [items, keyword, type, project, month]);

  const summary = useMemo(() => {
    const income = filteredItems.filter((item) => item.amountTwd > 0).reduce((sum, item) => sum + item.amountTwd, 0);
    const expense = filteredItems.filter((item) => item.amountTwd < 0).reduce((sum, item) => sum + Math.abs(item.amountTwd), 0);
    const receivable = filteredItems.filter((item) => item.type === "應收款").reduce((sum, item) => sum + Math.abs(item.amountTwd), 0);
    const advance = filteredItems.filter((item) => item.type === "代墊").reduce((sum, item) => sum + Math.abs(item.amountTwd), 0);
    return { income, expense, receivable, advance, balance: income - expense };
  }, [filteredItems]);

  function startEdit(item: CashflowItem) {
    setEditingId(item.id);
    setDraft({ ...item });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  function saveEdit() {
    if (!draft) return;
    setItems((prev) => prev.map((item) => item.id === draft.id ? draft : item));
    setEditingId(null);
    setDraft(null);
  }

  function updateDraft<K extends keyof CashflowItem>(key: K, value: CashflowItem[K]) {
    if (!draft) return;
    setDraft({ ...draft, [key]: value });
  }

  function autoCalculateTwd() {
    if (!draft) return;
    const base = Number(draft.originalAmount || 0) * Number(draft.rate || 1);
    const sign = draft.type === "收入" || draft.type === "應收款" ? 1 : -1;
    setDraft({ ...draft, amountTwd: Math.round(base * sign) });
  }

  function addItem() {
    const newItem: CashflowItem = {
      id: todayId(),
      type: "支出",
      item: "",
      project: "",
      invoiceDate: new Date().toISOString().slice(0, 10).replaceAll("-", "/"),
      originalAmount: 0,
      currency: "NTD",
      rate: 1,
      amountTwd: 0,
      note: ""
    };
    setItems([newItem, ...items]);
    setEditingId(newItem.id);
    setDraft(newItem);
    setActiveTab("list");
  }

  function deleteItem(id: string) {
    if (!confirm("確定要刪除這筆收支資料嗎？")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) cancelEdit();
  }

  function updateField(index: number, patch: Partial<FieldSetting>) {
    setFields((prev) => prev.map((field, i) => i === index ? { ...field, ...patch } : field));
  }

  function moveField(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;

    const next = [...fields];
    const current = next[index];
    next[index] = next[target];
    next[target] = current;
    setFields(next);
  }

  function addCustomField() {
    if (!newFieldLabel.trim()) return;

    const newField: FieldSetting = {
      key: "note",
      label: newFieldLabel.trim(),
      type: "文字",
      required: false,
      visible: true,
      editable: true,
      width: "160px"
    };

    const actions = fields.find((field) => field.key === "actions");
    const withoutActions = fields.filter((field) => field.key !== "actions");
    setFields([...withoutActions, newField, ...(actions ? [actions] : [])]);
    setNewFieldLabel("");
  }

  function resetFields() {
    if (!confirm("確定要恢復預設欄位設定嗎？")) return;
    setFields(defaultFields);
  }

  function renderCell(item: CashflowItem, field: FieldSetting) {
    if (field.key === "actions") {
      return (
        <div className="flex justify-center gap-2">
          <button className="rounded-xl bg-brand-50 px-3 py-2 text-brand-700 hover:bg-brand-100" onClick={() => startEdit(item)}>
            <Edit3 className="h-4 w-4" />
          </button>
          <button className="rounded-xl bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100" onClick={() => deleteItem(item.id)}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      );
    }

    const value = item[field.key];

    if (field.key === "type") {
      return <span className={`rounded-full px-2 py-1 text-xs font-medium ${typeClass(item.type)}`}>{item.type}</span>;
    }

    if (field.key === "project") {
      return <span className="text-brand-700">{item.project}</span>;
    }

    if (field.key === "invoiceDate") {
      return <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-slate-400" />{item.invoiceDate}</div>;
    }

    if (field.key === "originalAmount") {
      return <span className="block text-right">{item.currency === "USD" ? "$" : "NT$"} {item.originalAmount.toLocaleString("zh-TW")}</span>;
    }

    if (field.key === "rate") {
      return <span className="block text-right">{item.rate}</span>;
    }

    if (field.key === "amountTwd") {
      return <span className={`block text-right font-bold ${item.amountTwd >= 0 ? "text-emerald-600" : "text-red-600"}`}>{money(item.amountTwd)}</span>;
    }

    return <span className="text-slate-700">{String(value ?? "")}</span>;
  }

  return (
    <AppLayout title="收入與支出">
      <PageHeader
        title="收入與支出"
        description="保留欄位設定，方便新增欄位、調整顯示與管理收支資料。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => alert("Demo：已匯出 Excel。")}>
              <Download className="mr-2 h-4 w-4" />
              匯出 Excel
            </button>
            <button className="btn-primary" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              新增收支
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-5">
        <Stat label="收入合計" value={money(summary.income)} icon={<TrendingUp className="h-5 w-5" />} tone="green" />
        <Stat label="支出合計" value={money(summary.expense)} icon={<TrendingDown className="h-5 w-5" />} tone="red" />
        <Stat label="應收款" value={money(summary.receivable)} icon={<ReceiptText className="h-5 w-5" />} tone="amber" />
        <Stat label="代墊款" value={money(summary.advance)} icon={<WalletCards className="h-5 w-5" />} tone="red" />
        <Stat label="現金流結餘" value={money(summary.balance)} icon={<BadgeDollarSign className="h-5 w-5" />} tone={summary.balance >= 0 ? "green" : "red"} />
      </div>

      <div className="card mb-5">
        <div className="flex flex-wrap gap-2">
          <button className={`rounded-xl px-4 py-2 text-sm font-medium ${activeTab === "list" ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-600"}`} onClick={() => setActiveTab("list")}>
            收支明細
          </button>
          <button className={`rounded-xl px-4 py-2 text-sm font-medium ${activeTab === "fields" ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-600"}`} onClick={() => setActiveTab("fields")}>
            欄位設定
          </button>
          <button className={`rounded-xl px-4 py-2 text-sm font-medium ${activeTab === "create" ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-600"}`} onClick={() => setActiveTab("create")}>
            新增收支
          </button>
        </div>
      </div>

      {activeTab === "list" && (
        <>
          <div className="card mb-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input className="w-full bg-transparent text-sm outline-none" placeholder="搜尋編號、項目、專案、備註..." value={keyword} onChange={(event) => setKeyword(event.target.value)} />
              </div>

              <select className="input max-w-40" value={type} onChange={(event) => setType(event.target.value as any)}>
                <option>全部</option>
                <option>收入</option>
                <option>支出</option>
                <option>應收款</option>
                <option>代墊</option>
              </select>

              <select className="input max-w-48" value={project} onChange={(event) => setProject(event.target.value)}>
                {projects.map((item) => <option key={item}>{item}</option>)}
              </select>

              <select className="input max-w-44" value={month} onChange={(event) => setMonth(event.target.value)}>
                {months.map((item) => <option key={item}>{item}</option>)}
              </select>

              <span className="flex items-center rounded-full bg-brand-50 px-3 py-2 text-sm text-brand-700">
                <Filter className="mr-2 h-4 w-4" />
                {filteredItems.length} 筆資料
              </span>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
            <div className="card">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">收支明細</h2>
                  <p className="mt-1 text-sm text-slate-500">可在「欄位設定」控制欄位顯示、順序、必填與可編輯狀態。</p>
                </div>
                <FileSpreadsheet className="h-6 w-6 text-brand-600" />
              </div>

              <div className="overflow-auto rounded-2xl border border-slate-200">
                <table className="w-full text-sm" style={{ minWidth: `${visibleFields.length * 130}px` }}>
                  <thead className="bg-slate-50">
                    <tr>
                      {visibleFields.map((field, index) => (
                        <th key={`${field.label}-${index}`} className="border-b border-slate-200 px-4 py-3 text-left" style={{ minWidth: field.width }}>
                          {field.label}
                          {field.required && <span className="ml-1 text-red-500">*</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item) => {
                      const isEditing = editingId === item.id && draft;

                      if (isEditing && draft) {
                        return (
                          <tr key={item.id} className="bg-brand-50">
                            {visibleFields.map((field, index) => (
                              <td key={`${field.key}-${index}`} className="border-b border-slate-100 px-3 py-3" style={{ minWidth: field.width }}>
                                <EditableCell field={field} draft={draft} updateDraft={updateDraft} autoCalculateTwd={autoCalculateTwd} saveEdit={saveEdit} cancelEdit={cancelEdit} />
                              </td>
                            ))}
                          </tr>
                        );
                      }

                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          {visibleFields.map((field, index) => (
                            <td key={`${field.key}-${index}`} className="border-b border-slate-100 px-4 py-3" style={{ minWidth: field.width }}>
                              {renderCell(item, field)}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <SidebarStats items={filteredItems} />
          </div>
        </>
      )}

      {activeTab === "fields" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <div className="card">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">欄位設定</h2>
                <p className="mt-1 text-sm text-slate-500">可調整欄位名稱、類型、是否必填、顯示、可編輯與排序。</p>
              </div>
              <button className="btn-secondary" onClick={resetFields}>
                恢復預設
              </button>
            </div>

            <div className="overflow-auto rounded-2xl border border-slate-200">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">排序</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">欄位名稱</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">欄位類型</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">必填</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">顯示</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">可編輯</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">寬度</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={`${field.key}-${index}`} className="hover:bg-slate-50">
                      <td className="border-b border-slate-100 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-slate-300" />
                          <button className="rounded-lg bg-slate-100 px-2 py-1 text-xs" onClick={() => moveField(index, -1)}>上</button>
                          <button className="rounded-lg bg-slate-100 px-2 py-1 text-xs" onClick={() => moveField(index, 1)}>下</button>
                        </div>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <input className="input min-w-36" value={field.label} onChange={(event) => updateField(index, { label: event.target.value })} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <select className="input min-w-32" value={field.type} onChange={(event) => updateField(index, { type: event.target.value as FieldType })}>
                          <option>文字</option>
                          <option>下拉選單</option>
                          <option>日期</option>
                          <option>數值</option>
                          <option>金額</option>
                          <option>備註</option>
                        </select>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <input type="checkbox" checked={field.required} onChange={(event) => updateField(index, { required: event.target.checked })} disabled={field.key === "actions"} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <button className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600" onClick={() => updateField(index, { visible: !field.visible })}>
                          {field.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <input type="checkbox" checked={field.editable} onChange={(event) => updateField(index, { editable: event.target.checked })} disabled={field.key === "actions"} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <input className="input min-w-24" value={field.width} onChange={(event) => updateField(index, { width: event.target.value })} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        {field.key !== "actions" && (
                          <button className="rounded-xl bg-red-50 px-3 py-2 text-red-600" onClick={() => setFields((prev) => prev.filter((_, i) => i !== index))}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card">
              <h2 className="text-xl font-bold">新增欄位</h2>
              <p className="mt-1 text-sm text-slate-500">新增後會出現在欄位設定與表格中，Demo 版先以備註資料顯示。</p>
              <div className="mt-4 space-y-3">
                <input className="input" placeholder="例如：付款方式、發票號碼、負責人" value={newFieldLabel} onChange={(event) => setNewFieldLabel(event.target.value)} />
                <button className="btn-primary w-full justify-center" onClick={addCustomField}>
                  <Plus className="mr-2 h-4 w-4" />
                  新增欄位
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold">欄位設定說明</h2>
              <div className="mt-4 space-y-3">
                <Info title="顯示" text="關閉後，欄位不會出現在收支明細表格。" />
                <Info title="可編輯" text="關閉後，該欄位在編輯模式不能修改。" />
                <Info title="寬度" text="可輸入 120px、180px、260px 等寬度。" />
                <Info title="必填" text="正式版可用於送出前檢查是否漏填。" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <div className="card">
          <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
            <Settings2 className="mb-4 h-12 w-12 text-brand-600" />
            <h2 className="text-xl font-bold">新增收支</h2>
            <p className="mt-2 text-sm text-slate-500">點下方按鈕會新增一筆空白資料，並切回收支明細讓你直接編輯。</p>
            <button className="btn-primary mt-5" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              新增一筆收支
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function EditableCell({
  field,
  draft,
  updateDraft,
  autoCalculateTwd,
  saveEdit,
  cancelEdit
}: {
  field: FieldSetting;
  draft: CashflowItem;
  updateDraft: <K extends keyof CashflowItem>(key: K, value: CashflowItem[K]) => void;
  autoCalculateTwd: () => void;
  saveEdit: () => void;
  cancelEdit: () => void;
}) {
  if (field.key === "actions") {
    return (
      <div className="flex justify-center gap-2">
        <button className="rounded-xl bg-brand-600 px-3 py-2 text-white" onClick={saveEdit}>
          <Save className="h-4 w-4" />
        </button>
        <button className="rounded-xl bg-slate-100 px-3 py-2 text-slate-600" onClick={cancelEdit}>
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (!field.editable) {
    return <span className="text-slate-400">不可編輯</span>;
  }

  if (field.key === "type") {
    return (
      <select className="input min-w-28" value={draft.type} onChange={(event) => updateDraft("type", event.target.value as CashflowType)}>
        <option>收入</option>
        <option>支出</option>
        <option>應收款</option>
        <option>代墊</option>
      </select>
    );
  }

  if (field.key === "currency") {
    return (
      <select className="input min-w-24" value={draft.currency} onChange={(event) => updateDraft("currency", event.target.value as Currency)}>
        <option>NTD</option>
        <option>USD</option>
        <option>JPY</option>
      </select>
    );
  }

  if (field.key === "invoiceDate") {
    return <input className="input min-w-36" type="date" value={toInputDate(draft.invoiceDate)} onChange={(event) => updateDraft("invoiceDate", toDisplayDate(event.target.value))} />;
  }

  if (field.key === "originalAmount") {
    return <input className="input min-w-32 text-right" type="number" value={draft.originalAmount} onChange={(event) => updateDraft("originalAmount", Number(event.target.value))} />;
  }

  if (field.key === "rate") {
    return <input className="input min-w-24 text-right" type="number" step="0.001" value={draft.rate} onChange={(event) => updateDraft("rate", Number(event.target.value))} />;
  }

  if (field.key === "amountTwd") {
    return (
      <div className="flex gap-2">
        <input className="input min-w-32 text-right" type="number" value={draft.amountTwd} onChange={(event) => updateDraft("amountTwd", Number(event.target.value))} />
        <button className="rounded-xl bg-slate-100 px-3 text-xs text-slate-600" onClick={autoCalculateTwd}>換算</button>
      </div>
    );
  }

  return <input className="input min-w-36" value={String(draft[field.key] ?? "")} onChange={(event) => updateDraft(field.key as keyof CashflowItem, event.target.value as any)} />;
}

function SidebarStats({ items }: { items: CashflowItem[] }) {
  return (
    <div className="space-y-5">
      <div className="card">
        <h2 className="text-xl font-bold">專案收支排行</h2>
        <p className="mt-1 text-sm text-slate-500">依目前篩選結果統計。</p>
        <div className="mt-5 space-y-3">
          {Array.from(new Set(items.map((item) => item.project))).map((projectName) => {
            const total = items.filter((item) => item.project === projectName).reduce((sum, item) => sum + item.amountTwd, 0);
            return (
              <div key={projectName || "未命名專案"} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold">{projectName || "未命名專案"}</h3>
                  <span className={total >= 0 ? "font-bold text-emerald-600" : "font-bold text-red-600"}>{money(total)}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200">
                  <div className={`h-2 rounded-full ${total >= 0 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${Math.min(100, Math.max(12, Math.abs(total) / 1200))}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold">操作提醒</h2>
        <div className="mt-4 space-y-3">
          <Info title="欄位設定" text="想增加付款方式、負責人、發票號碼，可到欄位設定新增。" />
          <Info title="編輯資料" text="收支明細最右側鉛筆圖示可以修改資料。" />
          <Info title="Demo 說明" text="目前重新整理會回到預設資料，正式版可接 Supabase 保存。" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone: "green" | "red" | "amber" }) {
  const color = tone === "green" ? "bg-emerald-50 text-emerald-700" : tone === "red" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700";
  return (
    <div className="card">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${color}`}>{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
