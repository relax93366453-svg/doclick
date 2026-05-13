"use client";
import { useState } from "react";
import { GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { fieldPalette, FormFieldConfig } from "./field-definitions";
import { DynamicFormRenderer } from "./DynamicFormRenderer";
export function FormBuilder() {
  const [formName, setFormName] = useState("外勤客戶拜訪回報");
  const [fields, setFields] = useState<FormFieldConfig[]>([{ id: "customer", type: "text", label: "客戶名稱", key: "customerName", required: true }, { id: "gps", type: "gps", label: "GPS 定位", key: "gps", required: true }]);
  function addField(type: FormFieldConfig["type"], label: string) { setFields((prev) => [...prev, { id: crypto.randomUUID(), type, label, key: `${type}_${prev.length + 1}`, required: false, options: type === "select" ? ["待處理", "進行中", "已完成"] : undefined }]); }
  function saveForm() { localStorage.setItem("bizflow-demo-form", JSON.stringify({ name: formName, fields, savedAt: new Date().toISOString() })); alert("表單已儲存到本機 Demo。\n正式版會寫入 Prisma Form / FormField。"); }
  return (
    <div className="space-y-6">
      <div className="card flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div className="flex-1"><label className="mb-1 block text-sm font-medium">表單名稱</label><input className="input" value={formName} onChange={(e) => setFormName(e.target.value)} /></div><button className="btn-primary" onClick={saveForm}><Save className="mr-2 h-4 w-4" />儲存表單</button></div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr_360px]">
        <div className="card"><h3 className="mb-4 font-semibold">欄位元件</h3><div className="space-y-2">{fieldPalette.map((field) => <button key={field.type} onClick={() => addField(field.type, field.label)} className="w-full rounded-xl border border-slate-200 p-3 text-left hover:border-brand-500 hover:bg-brand-50"><div className="flex items-center gap-2 font-medium"><Plus className="h-4 w-4" />{field.label}</div><p className="mt-1 text-xs text-slate-500">{field.description}</p></button>)}</div></div>
        <div className="card"><div className="mb-4"><h3 className="font-semibold">表單畫布</h3><p className="text-sm text-slate-500">點選左側欄位即可加入表單。正式版可接 DnD Kit 做拖曳排序。</p></div><div className="space-y-3">{fields.map((field) => <div key={field.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><GripVertical className="h-4 w-4 text-slate-400" /><div className="flex-1"><p className="font-medium">{field.label}</p><p className="text-xs text-slate-500">{field.type} / {field.key}</p></div><button onClick={() => setFields((prev) => prev.filter((item) => item.id !== field.id))} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>)}</div></div>
        <div className="card"><h3 className="mb-4 font-semibold">即時預覽</h3><DynamicFormRenderer fields={fields} /></div>
      </div>
    </div>
  );
}
