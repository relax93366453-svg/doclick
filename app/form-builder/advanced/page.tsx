"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Calculator, CheckSquare, FileText, GripVertical, ListPlus, Paperclip, Plus, Save, Settings2, Table2, Type } from "lucide-react";
import { useMemo, useState } from "react";

type FieldType = "文字" | "日期" | "金額" | "下拉選單" | "附件" | "人員" | "勾選" | "公式";
type FieldItem = { id: string; name: string; type: FieldType; required: boolean; visible: boolean; formula?: string; };

const defaultFields: FieldItem[] = [
  { id: "f1", name: "專案編號", type: "文字", required: true, visible: true },
  { id: "f2", name: "專案名稱", type: "文字", required: true, visible: true },
  { id: "f3", name: "專案類別", type: "下拉選單", required: false, visible: true },
  { id: "f4", name: "開始日期", type: "日期", required: false, visible: true },
  { id: "f5", name: "結束日期", type: "日期", required: false, visible: true },
  { id: "f6", name: "負責人", type: "人員", required: false, visible: true },
  { id: "f7", name: "收入", type: "金額", required: false, visible: true },
  { id: "f8", name: "支出", type: "金額", required: false, visible: true },
  { id: "f9", name: "毛利", type: "公式", required: false, visible: true, formula: "收入 - 支出" },
  { id: "f10", name: "附件", type: "附件", required: false, visible: true }
];

const fieldTypes: FieldType[] = ["文字", "日期", "金額", "下拉選單", "附件", "人員", "勾選", "公式"];

function iconByType(type: FieldType) {
  if (type === "公式") return Calculator;
  if (type === "附件") return Paperclip;
  if (type === "勾選") return CheckSquare;
  if (type === "下拉選單") return ListPlus;
  return Type;
}

export default function AdvancedFormBuilderPage() {
  const [fields, setFields] = useState<FieldItem[]>(defaultFields);
  const [activeFieldId, setActiveFieldId] = useState(defaultFields[0].id);
  const [subTables, setSubTables] = useState([{ name: "工作項目", fields: ["工作項目編號", "工作項目", "完成", "指派", "到期日", "開始日", "結束日"] }]);

  const activeField = useMemo(() => fields.find((field) => field.id === activeFieldId) ?? fields[0], [fields, activeFieldId]);

  function addField(type: FieldType = "文字") {
    const next: FieldItem = { id: crypto.randomUUID(), name: `新增${type}欄位`, type, required: false, visible: true, formula: type === "公式" ? "欄位A + 欄位B" : undefined };
    setFields([...fields, next]);
    setActiveFieldId(next.id);
  }

  function updateActiveField(key: keyof FieldItem, value: string | boolean) {
    if (!activeField) return;
    setFields((prev) => prev.map((field) => field.id === activeField.id ? { ...field, [key]: value } : field));
  }

  return (
    <AppLayout title="表單設計器升級版">
      <PageHeader
        title="表單設計器升級版"
        description="欄位可自訂、公式自動計算、附件、人員欄位、子表格，適合建立各產業專屬資料表。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => setSubTables([...subTables, { name: "新增子表格", fields: ["欄位一", "欄位二", "欄位三"] }])}><Table2 className="mr-2 h-4 w-4" />新增子表格</button>
            <button className="btn-primary" onClick={() => addField()}><Plus className="mr-2 h-4 w-4" />新增欄位</button>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[360px_1fr_360px]">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">欄位清單</h3>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-700">{fields.length} 個欄位</span>
          </div>
          <div className="space-y-2">
            {fields.map((field) => {
              const Icon = iconByType(field.type);
              return (
                <button key={field.id} onClick={() => setActiveFieldId(field.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left ${activeFieldId === field.id ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white"}`}>
                  <GripVertical className="h-4 w-4 text-slate-300" />
                  <Icon className="h-4 w-4 text-brand-600" />
                  <div className="flex-1">
                    <p className="font-medium">{field.name}</p>
                    <p className="text-xs text-slate-400">{field.type}{field.required ? "｜必填" : ""}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {fieldTypes.map((type) => <button key={type} className="rounded-xl bg-slate-50 px-3 py-2 text-sm" onClick={() => addField(type)}>+ {type}</button>)}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <div className="mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-brand-600" /><h3 className="text-lg font-bold">表單預覽：專案管理</h3></div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="mb-5 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 px-4 py-2 text-center font-bold text-white">專案資訊</div>
              <div className="grid gap-4 md:grid-cols-2">
                {fields.filter((field) => field.visible).map((field) => (
                  <div key={field.id}>
                    <label className="mb-1 block text-sm font-medium">{field.name}{field.required && <span className="text-red-500"> *</span>}</label>
                    {field.type === "下拉選單" ? <select className="input"><option>請選擇</option><option>行銷</option></select> :
                    field.type === "勾選" ? <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2"><input type="checkbox" />已完成</label> :
                    field.type === "附件" ? <div className="rounded-2xl border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-400">上傳附件</div> :
                    <input className="input" placeholder={field.type === "公式" ? field.formula : `請輸入${field.name}`} readOnly={field.type === "公式"} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4 text-lg font-bold">子表格設定</h3>
            {subTables.map((table) => (
              <div key={table.name} className="mb-4 rounded-2xl border border-slate-200 p-4">
                <h4 className="font-bold">{table.name}</h4>
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-sm"><thead className="bg-slate-50"><tr>{table.fields.map((field) => <th key={field} className="border-b border-slate-200 px-3 py-2 text-left">{field}</th>)}</tr></thead><tbody><tr>{table.fields.map((field) => <td key={field} className="border-b border-slate-100 px-3 py-2 text-slate-400">自由輸入</td>)}</tr></tbody></table>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center gap-2"><Settings2 className="h-5 w-5 text-brand-600" /><h3 className="font-bold">欄位設定</h3></div>
          {activeField && <div className="space-y-4">
            <div><label className="mb-1 block text-sm font-medium">欄位名稱</label><input className="input" value={activeField.name} onChange={(e) => updateActiveField("name", e.target.value)} /></div>
            <div><label className="mb-1 block text-sm font-medium">欄位類型</label><select className="input" value={activeField.type} onChange={(e) => updateActiveField("type", e.target.value)}>{fieldTypes.map((type) => <option key={type}>{type}</option>)}</select></div>
            <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">必填欄位<input type="checkbox" checked={activeField.required} onChange={(e) => updateActiveField("required", e.target.checked)} /></label>
            <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">顯示欄位<input type="checkbox" checked={activeField.visible} onChange={(e) => updateActiveField("visible", e.target.checked)} /></label>
            {activeField.type === "公式" && <div><label className="mb-1 block text-sm font-medium">公式設定</label><input className="input" value={activeField.formula ?? ""} onChange={(e) => updateActiveField("formula", e.target.value)} /></div>}
            <button className="btn-primary w-full"><Save className="mr-2 h-4 w-4" />儲存欄位設定</button>
          </div>}
        </div>
      </div>
    </AppLayout>
  );
}
