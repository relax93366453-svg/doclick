"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Search, X } from "lucide-react";

type Field = { key: string; label: string; placeholder?: string; type?: "text" | "number" | "date" | "select"; options?: string[] };

type Props = { title: string; description: string; buttonText: string; columns: string[]; initialRows: Record<string, any>[]; fields: Field[] };

export function InteractiveCrudPage({ title, description, buttonText, columns, initialRows, fields }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  const filteredRows = useMemo(() => {
    if (!keyword.trim()) return rows;
    return rows.filter((row) => Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(keyword.toLowerCase())));
  }, [rows, keyword]);

  function submit() {
    const newRow: Record<string, any> = {};
    columns.forEach((column) => { newRow[column] = form[column] ?? ""; });
    setRows((prev) => [newRow, ...prev]);
    setForm({});
    setOpen(false);
  }

  return (
    <>
      <PageHeader title={title} description={description} action={<button className="btn-primary" onClick={() => setOpen(true)}>{buttonText}</button>} />
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 md:w-96">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="w-full text-sm outline-none" placeholder={`搜尋${title}資料...`} />
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => alert("Demo：這裡可接 Excel 匯入功能。")}>匯入 Excel</button>
          <button className="btn-secondary" onClick={() => alert("Demo：這裡可接 CSV 匯出功能。")}>匯出 CSV</button>
        </div>
      </div>
      <DataTable columns={columns} rows={filteredRows} />
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div><h3 className="text-xl font-bold">{buttonText}</h3><p className="mt-1 text-sm text-slate-500">送出後會直接新增到目前表格。</p></div>
              <button className="rounded-xl p-2 hover:bg-slate-100" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-sm font-medium">{field.label}</label>
                  {field.type === "select" ? (
                    <select className="input" value={form[field.key] ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}>
                      <option value="">請選擇</option>{(field.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : (
                    <input className="input" type={field.type ?? "text"} placeholder={field.placeholder ?? field.label} value={form[field.key] ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2"><button className="btn-secondary" onClick={() => setOpen(false)}>取消</button><button className="btn-primary" onClick={submit}>儲存</button></div>
          </div>
        </div>
      )}
    </>
  );
}
