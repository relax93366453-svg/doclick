"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  CalendarDays,
  Download,
  Edit3,
  Eye,
  EyeOff,
  Filter,
  GripVertical,
  Mail,
  Phone,
  Plus,
  Save,
  Search,
  Settings2,
  Star,
  Trash2,
  UserCheck,
  UsersRound,
  X
} from "lucide-react";
import { useMemo, useState } from "react";

type CustomerStatus = "追蹤中" | "已合作";
type TrackingStage = "初步接洽" | "需求確認" | "報價中" | "等待回覆" | "考慮中" | "已流失";
type PartnerStage = "合作中" | "已成交" | "長期合作" | "暫停合作" | "已結案";
type FieldType = "文字" | "下拉選單" | "日期" | "金額" | "電話" | "Email" | "地址" | "備註";

type Customer = {
  id: string;
  name: string;
  level: "A" | "B" | "C";
  contact: string;
  owner: string;
  phone: string;
  email: string;
  address: string;
  taxId: string;
  source: string;
  status: CustomerStatus;
  stage: TrackingStage | PartnerStage;
  need: string;
  lastContactDate: string;
  nextFollowDate: string;
  expectedAmount: number;
  partnerDate: string;
  partnerItem: string;
  totalSpent: number;
  lastPartnerDate: string;
  paymentStatus: string;
  note: string;
};

type FieldSetting = {
  key: keyof Customer;
  label: string;
  type: FieldType;
  visible: boolean;
  required: boolean;
  editable: boolean;
  width: string;
};

const initialCustomers: Customer[] = [
  {
    id: "C-00149",
    name: "米朵電商",
    level: "A",
    contact: "Alisha",
    owner: "業務 A",
    phone: "0912-111-222",
    email: "service@mido.com",
    address: "102 新北市汐止區東泰二街236巷122號41樓",
    taxId: "73028394",
    source: "LINE",
    status: "追蹤中",
    stage: "報價中",
    need: "電商訂單與客服流程",
    lastContactDate: "2026-05-12",
    nextFollowDate: "2026-05-18",
    expectedAmount: 128000,
    partnerDate: "",
    partnerItem: "",
    totalSpent: 0,
    lastPartnerDate: "",
    paymentStatus: "未成交",
    note: "活動整合公司採購"
  },
  {
    id: "C-00148",
    name: "日日寵物店",
    level: "B",
    contact: "店長",
    owner: "業務 B",
    phone: "0912-222-333",
    email: "petday@example.com",
    address: "959 臺南市仁德區橋和街四段302巷986弄616號",
    taxId: "",
    source: "IG",
    status: "追蹤中",
    stage: "需求確認",
    need: "寵物美容預約與會員儲值",
    lastContactDate: "2026-05-10",
    nextFollowDate: "2026-05-20",
    expectedAmount: 68000,
    partnerDate: "",
    partnerItem: "",
    totalSpent: 0,
    lastPartnerDate: "",
    paymentStatus: "未成交",
    note: ""
  },
  {
    id: "C-00147",
    name: "晨光製造",
    level: "A",
    contact: "採購",
    owner: "業務 A",
    phone: "0912-333-444",
    email: "factory@example.com",
    address: "498 屏東縣車城鄉之麻五路479號",
    taxId: "23684690",
    source: "官網",
    status: "已合作",
    stage: "合作中",
    need: "生產訂單與設備維修",
    lastContactDate: "2026-05-08",
    nextFollowDate: "2026-06-01",
    expectedAmount: 156000,
    partnerDate: "2026-04-20",
    partnerItem: "製造業範本導入",
    totalSpent: 156000,
    lastPartnerDate: "2026-05-08",
    paymentStatus: "已收款",
    note: "後續加購報表模組"
  },
  {
    id: "C-00146",
    name: "經營咖啡廳",
    level: "B",
    contact: "何淑君",
    owner: "業務 C",
    phone: "0904-555-666",
    email: "coffee@example.com",
    address: "697-61 臺東縣成功鎮龍德街720號51樓",
    taxId: "23436853",
    source: "轉介紹",
    status: "已合作",
    stage: "長期合作",
    need: "門市營收、庫存與會員管理",
    lastContactDate: "2026-05-15",
    nextFollowDate: "2026-06-05",
    expectedAmount: 98000,
    partnerDate: "2026-03-11",
    partnerItem: "門市營運系統",
    totalSpent: 198000,
    lastPartnerDate: "2026-05-15",
    paymentStatus: "月結",
    note: "長期維護客戶"
  }
];

const defaultFields: FieldSetting[] = [
  { key: "id", label: "客戶編號", type: "文字", visible: true, required: true, editable: true, width: "130px" },
  { key: "name", label: "客戶名稱", type: "文字", visible: true, required: true, editable: true, width: "160px" },
  { key: "level", label: "等級", type: "下拉選單", visible: true, required: false, editable: true, width: "90px" },
  { key: "contact", label: "聯絡人", type: "文字", visible: true, required: false, editable: true, width: "120px" },
  { key: "owner", label: "負責業務", type: "文字", visible: true, required: false, editable: true, width: "130px" },
  { key: "phone", label: "電話", type: "電話", visible: true, required: false, editable: true, width: "140px" },
  { key: "email", label: "email", type: "Email", visible: true, required: false, editable: true, width: "200px" },
  { key: "address", label: "收件地址", type: "地址", visible: true, required: false, editable: true, width: "280px" },
  { key: "taxId", label: "統一編號", type: "文字", visible: true, required: false, editable: true, width: "120px" },
  { key: "source", label: "來源", type: "下拉選單", visible: true, required: false, editable: true, width: "110px" },
  { key: "status", label: "名單類型", type: "下拉選單", visible: true, required: true, editable: true, width: "110px" },
  { key: "stage", label: "銷售／合作階段", type: "下拉選單", visible: true, required: false, editable: true, width: "150px" },
  { key: "need", label: "需求內容", type: "備註", visible: true, required: false, editable: true, width: "220px" },
  { key: "lastContactDate", label: "最後聯繫日", type: "日期", visible: true, required: false, editable: true, width: "140px" },
  { key: "nextFollowDate", label: "下次跟進", type: "日期", visible: true, required: false, editable: true, width: "140px" },
  { key: "expectedAmount", label: "預估金額", type: "金額", visible: true, required: false, editable: true, width: "130px" },
  { key: "partnerDate", label: "合作日期", type: "日期", visible: false, required: false, editable: true, width: "140px" },
  { key: "partnerItem", label: "合作項目", type: "文字", visible: false, required: false, editable: true, width: "180px" },
  { key: "totalSpent", label: "累積消費", type: "金額", visible: false, required: false, editable: true, width: "130px" },
  { key: "lastPartnerDate", label: "最近一次合作日", type: "日期", visible: false, required: false, editable: true, width: "150px" },
  { key: "paymentStatus", label: "付款狀態", type: "下拉選單", visible: false, required: false, editable: true, width: "120px" },
  { key: "note", label: "備註", type: "備註", visible: true, required: false, editable: true, width: "240px" }
];

function money(value: number) {
  return `NT$ ${Number(value || 0).toLocaleString("zh-TW")}`;
}

function statusClass(status: CustomerStatus) {
  return status === "已合作" ? "bg-emerald-50 text-emerald-700" : "bg-brand-50 text-brand-700";
}

function levelClass(level: Customer["level"]) {
  if (level === "A") return "bg-red-50 text-red-700";
  if (level === "B") return "bg-amber-50 text-amber-700";
  return "bg-slate-50 text-slate-600";
}

function todayId() {
  return `C-${String(new Date().getTime()).slice(-5)}`;
}

export default function CrmPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [fields, setFields] = useState<FieldSetting[]>(defaultFields);
  const [activeTab, setActiveTab] = useState<"tracking" | "partner" | "all" | "fields" | "create">("tracking");
  const [keyword, setKeyword] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Customer | null>(null);
  const [newFieldLabel, setNewFieldLabel] = useState("");

  const visibleFields = fields.filter((field) => field.visible);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchTab =
        activeTab === "tracking"
          ? customer.status === "追蹤中"
          : activeTab === "partner"
          ? customer.status === "已合作"
          : true;

      const text = Object.values(customer).join(" ");
      return matchTab && text.includes(keyword);
    });
  }, [customers, keyword, activeTab]);

  const trackingCount = customers.filter((customer) => customer.status === "追蹤中").length;
  const partnerCount = customers.filter((customer) => customer.status === "已合作").length;
  const expectedTotal = customers.filter((customer) => customer.status === "追蹤中").reduce((sum, item) => sum + item.expectedAmount, 0);
  const partnerTotal = customers.filter((customer) => customer.status === "已合作").reduce((sum, item) => sum + item.totalSpent, 0);

  function addCustomer(status: CustomerStatus = "追蹤中") {
    const newCustomer: Customer = {
      id: todayId(),
      name: "",
      level: "B",
      contact: "",
      owner: "",
      phone: "",
      email: "",
      address: "",
      taxId: "",
      source: "",
      status,
      stage: status === "追蹤中" ? "初步接洽" : "合作中",
      need: "",
      lastContactDate: "",
      nextFollowDate: "",
      expectedAmount: 0,
      partnerDate: "",
      partnerItem: "",
      totalSpent: 0,
      lastPartnerDate: "",
      paymentStatus: "",
      note: ""
    };

    setCustomers([newCustomer, ...customers]);
    setDraft(newCustomer);
    setEditingId(newCustomer.id);
    setActiveTab(status === "追蹤中" ? "tracking" : "partner");
  }

  function startEdit(customer: Customer) {
    setDraft({ ...customer });
    setEditingId(customer.id);
  }

  function cancelEdit() {
    setDraft(null);
    setEditingId(null);
  }

  function saveEdit() {
    if (!draft || !editingId) return;
    setCustomers((prev) => prev.map((customer) => customer.id === editingId ? draft : customer));
    cancelEdit();
  }

  function deleteCustomer(id: string) {
    if (!confirm("確定要刪除這筆客戶資料嗎？")) return;
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  }

  function updateDraft<K extends keyof Customer>(key: K, value: Customer[K]) {
    if (!draft) return;
    setDraft({ ...draft, [key]: value });
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

  function addField() {
    if (!newFieldLabel.trim()) return;

    setFields([
      ...fields,
      {
        key: "note",
        label: newFieldLabel.trim(),
        type: "文字",
        visible: true,
        required: false,
        editable: true,
        width: "160px"
      }
    ]);

    setNewFieldLabel("");
  }

  function renderValue(customer: Customer, field: FieldSetting) {
    const value = customer[field.key];

    if (field.key === "status") {
      return <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass(customer.status)}`}>{customer.status}</span>;
    }

    if (field.key === "level") {
      return <span className={`rounded-full px-2 py-1 text-xs font-medium ${levelClass(customer.level)}`}>{customer.level}</span>;
    }

    if (field.key === "phone") {
      return <span className="inline-flex items-center gap-2 text-brand-700"><Phone className="h-3.5 w-3.5" />{customer.phone}</span>;
    }

    if (field.key === "email") {
      return <span className="inline-flex items-center gap-2 text-brand-700"><Mail className="h-3.5 w-3.5" />{customer.email}</span>;
    }

    if (["lastContactDate", "nextFollowDate", "partnerDate", "lastPartnerDate"].includes(String(field.key))) {
      return value ? <span className="inline-flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-slate-400" />{String(value)}</span> : "-";
    }

    if (field.key === "expectedAmount" || field.key === "totalSpent") {
      return <span className="font-bold text-slate-800">{money(Number(value || 0))}</span>;
    }

    return <span>{String(value ?? "") || "-"}</span>;
  }

  return (
    <AppLayout title="銷售客戶">
      <PageHeader
        title="銷售客戶"
        description="追蹤名單、已合作名單、欄位設定都保留，並固定顯示編輯／刪除操作。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => alert("Demo：已匯出客戶資料。")}>
              <Download className="mr-2 h-4 w-4" />
              匯出
            </button>
            <button className="btn-primary" onClick={() => addCustomer("追蹤中")}>
              <Plus className="mr-2 h-4 w-4" />
              新增客戶
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="追蹤名單" value={`${trackingCount} 筆`} icon={<UsersRound className="h-5 w-5" />} />
        <Stat label="已合作名單" value={`${partnerCount} 筆`} icon={<UserCheck className="h-5 w-5" />} />
        <Stat label="追蹤預估金額" value={money(expectedTotal)} icon={<Star className="h-5 w-5" />} />
        <Stat label="合作累積金額" value={money(partnerTotal)} icon={<Star className="h-5 w-5" />} />
      </div>

      <div className="card mb-5">
        <div className="flex flex-wrap gap-2">
          <TabButton active={activeTab === "tracking"} onClick={() => setActiveTab("tracking")}>追蹤名單</TabButton>
          <TabButton active={activeTab === "partner"} onClick={() => setActiveTab("partner")}>已合作名單</TabButton>
          <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>全部客戶</TabButton>
          <TabButton active={activeTab === "fields"} onClick={() => setActiveTab("fields")}>欄位設定</TabButton>
          <TabButton active={activeTab === "create"} onClick={() => setActiveTab("create")}>新增客戶</TabButton>
        </div>
      </div>

      {(activeTab === "tracking" || activeTab === "partner" || activeTab === "all") && (
        <>
          <div className="card mb-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="搜尋客戶名稱、電話、Email、地址、備註..."
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </div>
              <span className="flex items-center rounded-full bg-brand-50 px-3 py-2 text-sm text-brand-700">
                <Filter className="mr-2 h-4 w-4" />
                {filteredCustomers.length} 筆資料
              </span>
            </div>
          </div>

          <div className="card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {activeTab === "tracking" ? "追蹤名單" : activeTab === "partner" ? "已合作名單" : "全部客戶"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  操作欄固定在左邊，編輯、刪除不用再滑到最右側。
                </p>
              </div>
              <button className="btn-secondary" onClick={() => setActiveTab("fields")}>
                <Settings2 className="mr-2 h-4 w-4" />
                欄位設定
              </button>
            </div>

            <div className="overflow-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm" style={{ minWidth: `${visibleFields.length * 125 + 140}px` }}>
                <thead className="bg-slate-50">
                  <tr>
                    <th className="sticky left-0 z-20 border-b border-r border-slate-200 bg-slate-50 px-4 py-3 text-center" style={{ minWidth: "130px" }}>
                      操作
                    </th>
                    {visibleFields.map((field, index) => (
                      <th key={`${field.key}-${index}`} className="border-b border-slate-200 px-4 py-3 text-left" style={{ minWidth: field.width }}>
                        {field.label}
                        {field.required && <span className="ml-1 text-red-500">*</span>}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => {
                    const isEditing = editingId === customer.id && draft;

                    if (isEditing && draft) {
                      return (
                        <tr key={customer.id} className="bg-brand-50">
                          <td className="sticky left-0 z-10 border-b border-r border-slate-100 bg-brand-50 px-3 py-3">
                            <div className="flex justify-center gap-2">
                              <button className="rounded-xl bg-brand-600 px-3 py-2 text-white" onClick={saveEdit}>
                                <Save className="h-4 w-4" />
                              </button>
                              <button className="rounded-xl bg-slate-100 px-3 py-2 text-slate-600" onClick={cancelEdit}>
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          {visibleFields.map((field, index) => (
                            <td key={`${field.key}-${index}`} className="border-b border-slate-100 px-3 py-3" style={{ minWidth: field.width }}>
                              <EditableCell field={field} draft={draft} updateDraft={updateDraft} />
                            </td>
                          ))}
                        </tr>
                      );
                    }

                    return (
                      <tr key={customer.id} className="hover:bg-slate-50">
                        <td className="sticky left-0 z-10 border-b border-r border-slate-100 bg-white px-3 py-3">
                          <div className="flex justify-center gap-2">
                            <button className="rounded-xl bg-brand-50 px-3 py-2 text-brand-700 hover:bg-brand-100" onClick={() => startEdit(customer)}>
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="rounded-xl bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100" onClick={() => deleteCustomer(customer.id)}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        {visibleFields.map((field, index) => (
                          <td key={`${field.key}-${index}`} className="border-b border-slate-100 px-4 py-3" style={{ minWidth: field.width }}>
                            {renderValue(customer, field)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "fields" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="card">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">客戶欄位設定</h2>
                <p className="mt-1 text-sm text-slate-500">可調整欄位名稱、類型、顯示、必填、可編輯與排序。</p>
              </div>
              <button className="btn-secondary" onClick={() => setFields(defaultFields)}>恢復預設</button>
            </div>

            <div className="overflow-auto rounded-2xl border border-slate-200">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">排序</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">欄位名稱</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">欄位類型</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">顯示</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">必填</th>
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
                          <option>金額</option>
                          <option>電話</option>
                          <option>Email</option>
                          <option>地址</option>
                          <option>備註</option>
                        </select>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <button className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600" onClick={() => updateField(index, { visible: !field.visible })}>
                          {field.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <input type="checkbox" checked={field.required} onChange={(event) => updateField(index, { required: event.target.checked })} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <input type="checkbox" checked={field.editable} onChange={(event) => updateField(index, { editable: event.target.checked })} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <input className="input min-w-24" value={field.width} onChange={(event) => updateField(index, { width: event.target.value })} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <button className="rounded-xl bg-red-50 px-3 py-2 text-red-600" onClick={() => setFields((prev) => prev.filter((_, i) => i !== index))}>
                          <Trash2 className="h-4 w-4" />
                        </button>
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
              <p className="mt-1 text-sm text-slate-500">例如：產業別、生日、推薦人、合約到期日。</p>
              <div className="mt-4 space-y-3">
                <input className="input" placeholder="輸入欄位名稱" value={newFieldLabel} onChange={(event) => setNewFieldLabel(event.target.value)} />
                <button className="btn-primary w-full justify-center" onClick={addField}>
                  <Plus className="mr-2 h-4 w-4" />
                  新增欄位
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold">分流說明</h2>
              <div className="mt-4 space-y-3">
                <Info title="追蹤名單" text="未成交、正在洽談、需要持續追蹤的客戶。" />
                <Info title="已合作名單" text="已成交、已簽約、已購買或長期合作的客戶。" />
                <Info title="操作欄固定" text="編輯、刪除會固定在左側，不會被表格欄位擠到看不到。" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <div className="card">
          <div className="grid gap-5 md:grid-cols-2">
            <button className="rounded-3xl border border-slate-200 bg-white p-8 text-left hover:border-brand-300 hover:bg-brand-50" onClick={() => addCustomer("追蹤中")}>
              <UsersRound className="mb-4 h-10 w-10 text-brand-600" />
              <h2 className="text-xl font-bold">新增追蹤客戶</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">適合尚未成交、需要跟進、報價中、等待回覆的客戶。</p>
            </button>

            <button className="rounded-3xl border border-slate-200 bg-white p-8 text-left hover:border-brand-300 hover:bg-brand-50" onClick={() => addCustomer("已合作")}>
              <UserCheck className="mb-4 h-10 w-10 text-brand-600" />
              <h2 className="text-xl font-bold">新增已合作客戶</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">適合已成交、已簽約、長期合作或已結案的客戶。</p>
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
  updateDraft
}: {
  field: FieldSetting;
  draft: Customer;
  updateDraft: <K extends keyof Customer>(key: K, value: Customer[K]) => void;
}) {
  if (!field.editable) return <span className="text-slate-400">不可編輯</span>;

  if (field.key === "status") {
    return (
      <select className="input min-w-28" value={draft.status} onChange={(event) => updateDraft("status", event.target.value as CustomerStatus)}>
        <option>追蹤中</option>
        <option>已合作</option>
      </select>
    );
  }

  if (field.key === "stage") {
    const options = draft.status === "追蹤中"
      ? ["初步接洽", "需求確認", "報價中", "等待回覆", "考慮中", "已流失"]
      : ["合作中", "已成交", "長期合作", "暫停合作", "已結案"];

    return (
      <select className="input min-w-32" value={draft.stage} onChange={(event) => updateDraft("stage", event.target.value as Customer["stage"])}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    );
  }

  if (field.key === "level") {
    return (
      <select className="input min-w-20" value={draft.level} onChange={(event) => updateDraft("level", event.target.value as Customer["level"])}>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </select>
    );
  }

  if (["lastContactDate", "nextFollowDate", "partnerDate", "lastPartnerDate"].includes(String(field.key))) {
    return <input className="input min-w-36" type="date" value={String(draft[field.key] || "")} onChange={(event) => updateDraft(field.key as keyof Customer, event.target.value as any)} />;
  }

  if (field.key === "expectedAmount" || field.key === "totalSpent") {
    return <input className="input min-w-32 text-right" type="number" value={Number(draft[field.key] || 0)} onChange={(event) => updateDraft(field.key as keyof Customer, Number(event.target.value) as any)} />;
  }

  return <input className="input min-w-36" value={String(draft[field.key] ?? "")} onChange={(event) => updateDraft(field.key as keyof Customer, event.target.value as any)} />;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={`rounded-xl px-4 py-2 text-sm font-medium ${active ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-600"}`} onClick={onClick}>
      {children}
    </button>
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

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
