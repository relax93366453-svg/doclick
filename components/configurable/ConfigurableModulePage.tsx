"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import {
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Settings2,
  Trash2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export type FieldType = "text" | "number" | "date" | "select" | "textarea";

export type CustomField = {
  key: string;
  label: string;
  type: FieldType;
  visible: boolean;
  options?: string[];
};

export type DataRecord = {
  id: string;
  [key: string]: string;
};

type ConfigurableModulePageProps = {
  storageKey: string;
  title: string;
  description: string;
  defaultFields: CustomField[];
  defaultRecords: DataRecord[];
  primaryFieldKey?: string;
  addButtonLabel?: string;
};

function createEmptyRecord(fields: CustomField[], recordCount: number) {
  const record: DataRecord = { id: crypto.randomUUID() };

  fields.forEach((field) => {
    if (field.key === "code" || field.key.endsWith("No")) {
      record[field.key] = `NEW-${String(recordCount + 1).padStart(3, "0")}`;
    } else if (field.type === "date") {
      record[field.key] = new Date().toISOString().slice(0, 10);
    } else if (field.type === "select") {
      record[field.key] = field.options?.[0] ?? "";
    } else if (field.type === "number") {
      record[field.key] = "0";
    } else {
      record[field.key] = "";
    }
  });

  return record;
}

export function ConfigurableModulePage({
  storageKey,
  title,
  description,
  defaultFields,
  defaultRecords,
  primaryFieldKey = "name",
  addButtonLabel = "新增資料"
}: ConfigurableModulePageProps) {
  const [fields, setFields] = useState<CustomField[]>(defaultFields);
  const [records, setRecords] = useState<DataRecord[]>(defaultRecords);
  const [keyword, setKeyword] = useState("");
  const [fieldPanelOpen, setFieldPanelOpen] = useState(false);
  const [editing, setEditing] = useState<DataRecord | null>(null);

  const fieldStorageKey = `${storageKey}-fields`;
  const recordStorageKey = `${storageKey}-records`;

  useEffect(() => {
    const savedFields = localStorage.getItem(fieldStorageKey);
    const savedRecords = localStorage.getItem(recordStorageKey);

    if (savedFields) setFields(JSON.parse(savedFields));
    if (savedRecords) setRecords(JSON.parse(savedRecords));
  }, [fieldStorageKey, recordStorageKey]);

  useEffect(() => {
    localStorage.setItem(fieldStorageKey, JSON.stringify(fields));
  }, [fieldStorageKey, fields]);

  useEffect(() => {
    localStorage.setItem(recordStorageKey, JSON.stringify(records));
  }, [recordStorageKey, records]);

  const visibleFields = fields.filter((field) => field.visible);

  const filteredRecords = useMemo(() => {
    const lowerKeyword = keyword.toLowerCase();

    return records.filter((record) =>
      fields
        .map((field) => record[field.key] ?? "")
        .join(" ")
        .toLowerCase()
        .includes(lowerKeyword)
    );
  }, [records, fields, keyword]);

  function openNewRecord() {
    setEditing(createEmptyRecord(fields, records.length));
  }

  function saveRecord() {
    if (!editing) return;

    const primaryValue = editing[primaryFieldKey] ?? editing[visibleFields[0]?.key] ?? "";
    if (!String(primaryValue).trim()) {
      alert("請至少填寫主要欄位");
      return;
    }

    const exists = records.some((record) => record.id === editing.id);

    if (exists) {
      setRecords(records.map((record) => (record.id === editing.id ? editing : record)));
    } else {
      setRecords([editing, ...records]);
    }

    setEditing(null);
  }

  function deleteRecord(id: string) {
    if (!confirm("確定要刪除這筆資料嗎？")) return;
    setRecords(records.filter((record) => record.id !== id));
  }

  function updateRecordValue(key: string, value: string) {
    if (!editing) return;
    setEditing({ ...editing, [key]: value });
  }

  function updateField(index: number, updates: Partial<CustomField>) {
    setFields(fields.map((field, i) => (i === index ? { ...field, ...updates } : field)));
  }

  function addField() {
    setFields([
      ...fields,
      {
        key: `custom_${Date.now()}`,
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
    if (!confirm("確定要恢復此模組預設欄位嗎？")) return;
    setFields(defaultFields);
  }

  function resetRecords() {
    if (!confirm("確定要恢復此模組 Demo 資料嗎？目前資料會被覆蓋。")) return;
    setRecords(defaultRecords);
  }

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => setFieldPanelOpen((prev) => !prev)}>
              <Settings2 className="mr-2 h-4 w-4" />
              欄位設定
            </button>
            <button className="btn-secondary" onClick={resetRecords}>
              恢復 Demo
            </button>
            <button className="btn-primary" onClick={openNewRecord}>
              <Plus className="mr-2 h-4 w-4" />
              {addButtonLabel}
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <div className="card">
          <p className="text-sm text-slate-500">資料筆數</p>
          <p className="mt-2 text-2xl font-bold">{records.length} 筆</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">顯示欄位</p>
          <p className="mt-2 text-2xl font-bold">{visibleFields.length} 個</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">全部欄位</p>
          <p className="mt-2 text-2xl font-bold">{fields.length} 個</p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">目前狀態</p>
          <p className="mt-2 text-2xl font-bold">可編輯</p>
        </div>
      </div>

      {fieldPanelOpen && (
        <div className="card mb-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold">{title}欄位設定</h3>
              <p className="mt-1 text-sm text-slate-500">
                可改欄位名稱、顯示／隱藏、新增欄位、刪除欄位，也可設定選單選項。
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary" onClick={addField}>
                新增欄位
              </button>
              <button className="btn-secondary" onClick={resetFields}>
                恢復預設欄位
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {fields.map((field, index) => (
              <div
                key={field.key}
                className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_160px_120px_120px] md:items-center"
              >
                <input
                  className="input"
                  value={field.label}
                  onChange={(event) => updateField(index, { label: event.target.value })}
                  placeholder="欄位名稱"
                />

                <select
                  className="input"
                  value={field.type}
                  onChange={(event) => updateField(index, { type: event.target.value as FieldType })}
                >
                  <option value="text">文字</option>
                  <option value="number">數字</option>
                  <option value="date">日期</option>
                  <option value="select">選單</option>
                  <option value="textarea">長文字</option>
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
                        options: event.target.value
                          .split("、")
                          .map((item) => item.trim())
                          .filter(Boolean)
                      })
                    }
                    placeholder="選單選項，用頓號分隔，例如：啟用、停用、待確認"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold">{title}資料列表</h3>
            <p className="mt-1 text-sm text-slate-500">
              目前資料會暫存在瀏覽器 localStorage；正式版可接 PostgreSQL 永久保存。
            </p>
          </div>

          <input
            className="input max-w-md"
            placeholder="搜尋任一欄位內容..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-slate-500">
                {visibleFields.map((field) => (
                  <th key={field.key} className="p-3">{field.label}</th>
                ))}
                <th className="p-3">操作</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b">
                  {visibleFields.map((field) => (
                    <td key={field.key} className="p-3">
                      {field.key === primaryFieldKey ? (
                        <span className="font-medium">{record[field.key] || "-"}</span>
                      ) : field.type === "textarea" ? (
                        <span className="line-clamp-2 block max-w-xs">{record[field.key] || "-"}</span>
                      ) : (
                        record[field.key] || "-"
                      )}
                    </td>
                  ))}

                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="btn-secondary px-3 py-1 text-xs" onClick={() => setEditing(record)}>
                        <Edit3 className="mr-1 h-3 w-3" />
                        編輯
                      </button>
                      <button className="btn-secondary px-3 py-1 text-xs" onClick={() => deleteRecord(record.id)}>
                        <Trash2 className="mr-1 h-3 w-3" />
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-slate-500" colSpan={visibleFields.length + 1}>
                    沒有符合搜尋條件的資料。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {records.some((record) => record.id === editing.id) ? `編輯${title}資料` : `新增${title}資料`}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  表單欄位會依照欄位設定自動變動。
                </p>
              </div>
              <button className="btn-secondary" onClick={() => setEditing(null)}>
                關閉
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {fields.map((field) => (
                <DynamicField
                  key={field.key}
                  field={field}
                  value={editing[field.key] ?? ""}
                  onChange={(value) => updateRecordValue(field.key, value)}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => setEditing(null)}>
                取消
              </button>
              <button className="btn-primary" onClick={saveRecord}>
                儲存資料
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DynamicField({
  field,
  value,
  onChange
}: {
  field: CustomField;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={field.type === "textarea" ? "md:col-span-3" : ""}>
      <label className="mb-1 block text-sm font-medium">{field.label}</label>

      {field.type === "select" ? (
        <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          className="input min-h-28"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="input"
          type={field.type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
