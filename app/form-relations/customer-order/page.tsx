"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  ArrowRightLeft,
  CheckCircle2,
  Database,
  Edit3,
  Eye,
  EyeOff,
  Filter,
  GripVertical,
  Link2,
  Plus,
  Save,
  Search,
  Settings2,
  TestTube2,
  Trash2,
  X
} from "lucide-react";
import { useMemo, useState } from "react";

type FieldType = "文字" | "下拉選單" | "日期" | "金額" | "關聯選擇" | "備註";
type RelationStatus = "啟用" | "停用";
type RelationType = "客戶 → 訂單" | "訂單 → 客戶" | "專案 → 收支" | "專案 → 附件" | "人員 → 薪資";

type Relation = {
  id: string;
  name: string;
  relationType: RelationType;
  sourceForm: string;
  targetForm: string;
  triggerField: string;
  targetField: string;
  autoFillFields: string;
  status: RelationStatus;
  note: string;
};

type FieldSetting = {
  key: keyof Relation;
  label: string;
  type: FieldType;
  visible: boolean;
  required: boolean;
  editable: boolean;
  width: string;
};

type Customer = {
  customerId: string;
  customerName: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  owner: string;
};

type OrderRecord = {
  orderNo: string;
  orderDate: string;
  status: string;
  amount: number;
};

const customers: Customer[] = [
  {
    customerId: "C-00817",
    customerName: "李怡瑜",
    contact: "李怡瑜",
    phone: "0917-888-999",
    email: "maglee@example.com",
    address: "578 宜蘭縣礁溪鄉東十二路776巷879弄160號43樓",
    owner: "Gina"
  },
  {
    customerId: "C-00818",
    customerName: "陳皓靖",
    contact: "陳皓靖",
    phone: "0918-999-000",
    email: "chen@example.com",
    address: "759-65 苗栗縣三義鄉漁港中一路991巷876弄801號",
    owner: "Rex"
  },
  {
    customerId: "C-00819",
    customerName: "黃嘉慧",
    contact: "黃嘉慧",
    phone: "0919-000-111",
    email: "huang@example.com",
    address: "台中市中科路734號46樓",
    owner: "Kayline"
  }
];

const ordersByCustomer: Record<string, OrderRecord[]> = {
  "C-00817": [
    { orderNo: "PO-20200407-005", orderDate: "2020/04/07", status: "已成立", amount: 90540 },
    { orderNo: "PO-20200406-018", orderDate: "2020/04/06", status: "發貨中", amount: 222080 },
    { orderNo: "PO-20200203-003", orderDate: "2020/02/03", status: "已完成", amount: 22770 }
  ],
  "C-00818": [
    { orderNo: "PO-20200501-006", orderDate: "2020/05/01", status: "已成立", amount: 32000 }
  ],
  "C-00819": [
    { orderNo: "PO-20200421-001", orderDate: "2020/04/21", status: "已完成", amount: 68000 }
  ]
};

const initialRelations: Relation[] = [
  {
    id: "REL-001",
    name: "訂單自動帶入客戶資料",
    relationType: "客戶 → 訂單",
    sourceForm: "銷售客戶",
    targetForm: "訂單管理",
    triggerField: "客戶姓名",
    targetField: "客戶資料區塊",
    autoFillFields: "客戶編號、聯絡人、電話、Email、收件地址、負責業務",
    status: "啟用",
    note: "新增訂單時選客戶，自動帶入基本資料"
  },
  {
    id: "REL-002",
    name: "客戶頁顯示過去訂購紀錄",
    relationType: "訂單 → 客戶",
    sourceForm: "訂單管理",
    targetForm: "銷售客戶",
    triggerField: "客戶編號",
    targetField: "訂購紀錄",
    autoFillFields: "訂單編號、訂單日期、訂單狀態、訂單金額",
    status: "啟用",
    note: "客戶詳細頁可查看歷史訂購紀錄"
  }
];

const defaultFields: FieldSetting[] = [
  { key: "id", label: "關聯編號", type: "文字", visible: true, required: true, editable: true, width: "120px" },
  { key: "name", label: "關聯名稱", type: "文字", visible: true, required: true, editable: true, width: "220px" },
  { key: "relationType", label: "關聯類型", type: "下拉選單", visible: true, required: true, editable: true, width: "160px" },
  { key: "sourceForm", label: "來源表單", type: "下拉選單", visible: true, required: true, editable: true, width: "130px" },
  { key: "targetForm", label: "目標表單", type: "下拉選單", visible: true, required: true, editable: true, width: "130px" },
  { key: "triggerField", label: "觸發欄位", type: "文字", visible: true, required: false, editable: true, width: "140px" },
  { key: "targetField", label: "帶入位置", type: "文字", visible: true, required: false, editable: true, width: "150px" },
  { key: "autoFillFields", label: "自動帶入欄位", type: "備註", visible: true, required: false, editable: true, width: "300px" },
  { key: "status", label: "狀態", type: "下拉選單", visible: true, required: true, editable: true, width: "100px" },
  { key: "note", label: "備註", type: "備註", visible: true, required: false, editable: true, width: "240px" }
];

function money(value: number) {
  return `NT$ ${Number(value || 0).toLocaleString("zh-TW")}`;
}

function statusClass(status: RelationStatus) {
  return status === "啟用" ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600";
}

function relationClass(type: RelationType) {
  if (type === "客戶 → 訂單") return "bg-brand-50 text-brand-700";
  if (type === "訂單 → 客戶") return "bg-purple-50 text-purple-700";
  if (type === "專案 → 收支") return "bg-amber-50 text-amber-700";
  if (type === "專案 → 附件") return "bg-sky-50 text-sky-700";
  return "bg-emerald-50 text-emerald-700";
}

function todayId() {
  return `REL-${String(new Date().getTime()).slice(-5)}`;
}

export default function CustomerOrderRelationPage() {
  const [relations, setRelations] = useState<Relation[]>(initialRelations);
  const [fields, setFields] = useState<FieldSetting[]>(defaultFields);
  const [activeTab, setActiveTab] = useState<"list" | "test" | "fields" | "create">("test");
  const [keyword, setKeyword] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Relation | null>(null);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("C-00817");

  const visibleFields = fields.filter((field) => field.visible);
  const selectedCustomer = customers.find((customer) => customer.customerId === selectedCustomerId) || customers[0];
  const customerOrders = ordersByCustomer[selectedCustomerId] || [];

  const filteredRelations = useMemo(() => {
    return relations.filter((relation) => Object.values(relation).join(" ").includes(keyword));
  }, [relations, keyword]);

  function addRelation() {
    const newRelation: Relation = {
      id: todayId(),
      name: "",
      relationType: "客戶 → 訂單",
      sourceForm: "銷售客戶",
      targetForm: "訂單管理",
      triggerField: "",
      targetField: "",
      autoFillFields: "",
      status: "啟用",
      note: ""
    };

    setRelations([newRelation, ...relations]);
    setDraft(newRelation);
    setEditingId(newRelation.id);
    setActiveTab("list");
  }

  function startEdit(relation: Relation) {
    setDraft({ ...relation });
    setEditingId(relation.id);
  }

  function cancelEdit() {
    setDraft(null);
    setEditingId(null);
  }

  function saveEdit() {
    if (!draft || !editingId) return;
    setRelations((prev) => prev.map((relation) => relation.id === editingId ? draft : relation));
    cancelEdit();
  }

  function deleteRelation(id: string) {
    if (!confirm("確定要刪除這筆表單關聯嗎？")) return;
    setRelations((prev) => prev.filter((relation) => relation.id !== id));
  }

  function updateDraft<K extends keyof Relation>(key: K, value: Relation[K]) {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
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

  function renderValue(relation: Relation, field: FieldSetting) {
    const value = relation[field.key];

    if (field.key === "relationType") {
      return <span className={`rounded-full px-2 py-1 text-xs font-medium ${relationClass(relation.relationType)}`}>{relation.relationType}</span>;
    }

    if (field.key === "status") {
      return <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass(relation.status)}`}>{relation.status}</span>;
    }

    if (field.key === "sourceForm" || field.key === "targetForm") {
      return <span className="inline-flex items-center gap-2 text-brand-700"><Database className="h-3.5 w-3.5" />{String(value)}</span>;
    }

    return <span>{String(value ?? "") || "-"}</span>;
  }

  return (
    <AppLayout title="客戶訂單關聯">
      <PageHeader
        title="客戶訂單關聯"
        description="這是表單關聯的新增示範頁，不會覆蓋原本表單關聯內容。示範客戶資料自動帶入訂單與過去訂購紀錄。"
        action={
          <button className="btn-primary" onClick={addRelation}>
            <Plus className="mr-2 h-4 w-4" />
            新增關聯
          </button>
        }
      />

      <div className="mb-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
        原本的表單關聯頁仍在 <b>/form-relations</b>；這個頁面是新增的安全版：<b>/form-relations/customer-order</b>
      </div>

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="關聯規則" value={`${relations.length} 筆`} icon={<Link2 className="h-5 w-5" />} />
        <Stat label="啟用中" value={`${relations.filter((item) => item.status === "啟用").length} 筆`} icon={<CheckCircle2 className="h-5 w-5" />} />
        <Stat label="來源表單" value="2 種" icon={<Database className="h-5 w-5" />} />
        <Stat label="測試帶入" value="可使用" icon={<TestTube2 className="h-5 w-5" />} />
      </div>

      <div className="card mb-5">
        <div className="flex flex-wrap gap-2">
          <TabButton active={activeTab === "list"} onClick={() => setActiveTab("list")}>關聯列表</TabButton>
          <TabButton active={activeTab === "test"} onClick={() => setActiveTab("test")}>測試帶入</TabButton>
          <TabButton active={activeTab === "fields"} onClick={() => setActiveTab("fields")}>欄位設定</TabButton>
          <TabButton active={activeTab === "create"} onClick={() => setActiveTab("create")}>新增關聯</TabButton>
        </div>
      </div>

      {activeTab === "list" && (
        <>
          <div className="card mb-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="搜尋關聯名稱、來源表單、目標表單、欄位..."
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </div>
              <span className="flex items-center rounded-full bg-brand-50 px-3 py-2 text-sm text-brand-700">
                <Filter className="mr-2 h-4 w-4" />
                {filteredRelations.length} 筆資料
              </span>
            </div>
          </div>

          <div className="card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">客戶訂單關聯列表</h2>
                <p className="mt-1 text-sm text-slate-500">保留編輯、刪除、欄位設定。</p>
              </div>
              <button className="btn-secondary" onClick={() => setActiveTab("fields")}>
                <Settings2 className="mr-2 h-4 w-4" />
                欄位設定
              </button>
            </div>

            <div className="overflow-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm" style={{ minWidth: `${visibleFields.length * 135 + 140}px` }}>
                <thead className="bg-slate-50">
                  <tr>
                    <th className="sticky left-0 z-20 border-b border-r border-slate-200 bg-slate-50 px-4 py-3 text-center" style={{ minWidth: "130px" }}>操作</th>
                    {visibleFields.map((field, index) => (
                      <th key={`${field.key}-${index}`} className="border-b border-slate-200 px-4 py-3 text-left" style={{ minWidth: field.width }}>
                        {field.label}
                        {field.required && <span className="ml-1 text-red-500">*</span>}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredRelations.map((relation) => {
                    const isEditing = editingId === relation.id && draft;

                    if (isEditing && draft) {
                      return (
                        <tr key={relation.id} className="bg-brand-50">
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
                      <tr key={relation.id} className="hover:bg-slate-50">
                        <td className="sticky left-0 z-10 border-b border-r border-slate-100 bg-white px-3 py-3">
                          <div className="flex justify-center gap-2">
                            <button className="rounded-xl bg-brand-50 px-3 py-2 text-brand-700 hover:bg-brand-100" onClick={() => startEdit(relation)}>
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="rounded-xl bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100" onClick={() => deleteRelation(relation.id)}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        {visibleFields.map((field, index) => (
                          <td key={`${field.key}-${index}`} className="border-b border-slate-100 px-4 py-3" style={{ minWidth: field.width }}>
                            {renderValue(relation, field)}
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

      {activeTab === "test" && (
        <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
          <div className="card">
            <h2 className="text-xl font-bold">測試：客戶資料自動帶入訂單</h2>
            <p className="mt-1 text-sm text-slate-500">選擇客戶後，右側會自動帶入客戶資料與過去訂購紀錄。</p>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">選擇客戶</span>
                <select className="input" value={selectedCustomerId} onChange={(event) => setSelectedCustomerId(event.target.value)}>
                  {customers.map((customer) => (
                    <option key={customer.customerId} value={customer.customerId}>
                      {customer.customerName}｜{customer.customerId}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-3xl bg-brand-50 p-5">
                <h3 className="font-bold text-brand-700">自動帶入欄位</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p>客戶編號、聯絡人、電話、Email</p>
                  <p>收件地址、負責業務、過去訂購紀錄</p>
                </div>
              </div>

              <button className="btn-primary w-full justify-center" onClick={() => alert("測試完成：客戶資料已自動帶入訂單。")}>
                <TestTube2 className="mr-2 h-4 w-4" />
                測試帶入
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">訂單表單預覽</h2>
                  <p className="mt-1 text-sm text-slate-500">此區示範選擇客戶後，自動帶入訂單中的客戶資料。</p>
                </div>
                <ArrowRightLeft className="h-6 w-6 text-brand-600" />
              </div>

              <div className="rounded-3xl border border-slate-200">
                <div className="rounded-t-3xl bg-brand-600 px-5 py-3 text-center font-bold text-white">客戶資料</div>
                <div className="grid gap-0 md:grid-cols-2">
                  <PreviewItem label="客戶姓名" value={selectedCustomer.customerName} />
                  <PreviewItem label="客戶編號" value={selectedCustomer.customerId} />
                  <PreviewItem label="聯絡人" value={selectedCustomer.contact} />
                  <PreviewItem label="負責業務" value={selectedCustomer.owner} />
                  <PreviewItem label="電話" value={selectedCustomer.phone} />
                  <PreviewItem label="Email" value={selectedCustomer.email} />
                  <div className="md:col-span-2">
                    <PreviewItem label="地址" value={selectedCustomer.address} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold">過去訂購紀錄</h2>
              <p className="mt-1 text-sm text-slate-500">客戶頁面也可以反向顯示此客戶所有訂單。</p>

              <div className="mt-5 overflow-auto rounded-2xl border border-slate-200">
                <table className="min-w-[640px] w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="border-b border-slate-200 px-4 py-3 text-left">訂單編號</th>
                      <th className="border-b border-slate-200 px-4 py-3 text-left">訂單日期</th>
                      <th className="border-b border-slate-200 px-4 py-3 text-left">訂單狀態</th>
                      <th className="border-b border-slate-200 px-4 py-3 text-right">訂單金額</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((order) => (
                      <tr key={order.orderNo} className="hover:bg-slate-50">
                        <td className="border-b border-slate-100 px-4 py-3 text-brand-700">{order.orderNo}</td>
                        <td className="border-b border-slate-100 px-4 py-3">{order.orderDate}</td>
                        <td className="border-b border-slate-100 px-4 py-3">{order.status}</td>
                        <td className="border-b border-slate-100 px-4 py-3 text-right font-bold">{money(order.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "fields" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="card">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">關聯欄位設定</h2>
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
                          <option>關聯選擇</option>
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
              <p className="mt-1 text-sm text-slate-500">例如：關聯條件、同步方式、更新頻率。</p>
              <div className="mt-4 space-y-3">
                <input className="input" placeholder="輸入欄位名稱" value={newFieldLabel} onChange={(event) => setNewFieldLabel(event.target.value)} />
                <button className="btn-primary w-full justify-center" onClick={addField}>
                  <Plus className="mr-2 h-4 w-4" />
                  新增欄位
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold">安全版說明</h2>
              <div className="mt-4 space-y-3">
                <Info title="不覆蓋原本頁" text="此頁新增在 /form-relations/customer-order，不會改掉原本 /form-relations。" />
                <Info title="可展示關聯" text="可展示客戶資料自動帶入訂單與過去訂購紀錄。" />
                <Info title="保留操作" text="保留欄位設定、編輯、刪除、新增關聯、測試帶入。" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <div className="card">
          <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
            <Link2 className="mb-4 h-12 w-12 text-brand-600" />
            <h2 className="text-xl font-bold">新增客戶訂單關聯</h2>
            <p className="mt-2 text-sm text-slate-500">點下方按鈕會新增一筆空白關聯，並切回關聯列表讓你直接編輯。</p>
            <button className="btn-primary mt-5" onClick={addRelation}>
              <Plus className="mr-2 h-4 w-4" />
              新增一筆關聯
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
  draft: Relation;
  updateDraft: <K extends keyof Relation>(key: K, value: Relation[K]) => void;
}) {
  if (!field.editable) return <span className="text-slate-400">不可編輯</span>;

  if (field.key === "relationType") {
    return (
      <select className="input min-w-40" value={draft.relationType} onChange={(event) => updateDraft("relationType", event.target.value as RelationType)}>
        <option>客戶 → 訂單</option>
        <option>訂單 → 客戶</option>
        <option>專案 → 收支</option>
        <option>專案 → 附件</option>
        <option>人員 → 薪資</option>
      </select>
    );
  }

  if (field.key === "sourceForm" || field.key === "targetForm") {
    return (
      <select className="input min-w-36" value={String(draft[field.key])} onChange={(event) => updateDraft(field.key, event.target.value as any)}>
        <option>銷售客戶</option>
        <option>訂單管理</option>
        <option>專案任務</option>
        <option>收入與支出</option>
        <option>人事管理</option>
        <option>薪資稅務</option>
        <option>員工投保</option>
      </select>
    );
  }

  if (field.key === "status") {
    return (
      <select className="input min-w-24" value={draft.status} onChange={(event) => updateDraft("status", event.target.value as RelationStatus)}>
        <option>啟用</option>
        <option>停用</option>
      </select>
    );
  }

  return <input className="input min-w-36" value={String(draft[field.key] ?? "")} onChange={(event) => updateDraft(field.key, event.target.value as any)} />;
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] border-b border-slate-100">
      <div className="bg-slate-50 px-4 py-3 text-right text-sm font-medium text-slate-500">{label}</div>
      <div className="px-4 py-3 font-medium text-slate-800">{value || "-"}</div>
    </div>
  );
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
