"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type GeneratedForm = {
  id: string;
  templateId: string;
  templateName: string;
  name: string;
  description: string;
  fields: string[];
  targetModule?: string;
  createdAt: string;
};

const moduleLabel: Record<string, string> = {
  inventory: "進銷存",
  crm: "銷售客戶",
  production: "生產管理",
  equipment: "設備管理",
  hr: "人事管理",
  "admin-office": "行政管理",
  finance: "財務管理",
  projects: "專案任務"
};

export default function FormsPage() {
  const [forms, setForms] = useState<GeneratedForm[]>([]);
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");

  useEffect(() => {
    const saved = localStorage.getItem("bizflow-generated-forms");
    if (saved) setForms(JSON.parse(saved));
  }, []);

  const filteredForms = useMemo(() => {
    if (!keyword.trim()) return forms;
    return forms.filter((form) =>
      [form.name, form.description, form.templateName, form.targetModule, ...form.fields]
        .join(" ")
        .toLowerCase()
        .includes(keyword.toLowerCase())
    );
  }, [forms, keyword]);

  function clearForms() {
    if (!confirm("確定要清空目前套用產生的表單嗎？")) return;
    localStorage.removeItem("bizflow-generated-forms");
    localStorage.removeItem("bizflow-applied-templates");
    setForms([]);
  }

  return (
    <AppLayout title="表單列表">
      <PageHeader
        title="表單列表"
        description="這裡會顯示從所有產業範本套用後自動建立的表單。"
        action={
          <div className="flex gap-2">
            <Link href="/templates" className="btn-secondary">
              套用範本
            </Link>
            <Link href="/form-builder" className="btn-primary">
              新增表單
            </Link>
          </div>
        }
      />

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <input
          className="input md:max-w-md"
          placeholder="搜尋表單、欄位、來源範本或模組..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <div className="flex gap-2">
          <Link href="/templates" className="btn-secondary">
            回範本庫
          </Link>
          <button className="btn-secondary" onClick={clearForms}>
            清空套用資料
          </button>
        </div>
      </div>

      {forms.length === 0 ? (
        <div className="card text-center">
          <h3 className="text-lg font-bold">目前還沒有表單</h3>
          <p className="mt-2 text-sm text-slate-500">
            請先到「產業範本庫」按下「套用並查看」，系統就會自動產生表單。
          </p>
          <Link href="/templates" className="btn-primary mt-5">
            前往產業範本庫
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredForms.map((form) => (
            <div key={form.id} className="card">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">{form.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{form.description}</p>
                </div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                  {form.templateName}
                </span>
              </div>

              {form.targetModule && (
                <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  對應模組：{moduleLabel[form.targetModule] ?? form.targetModule}
                </div>
              )}

              <div className="space-y-2">
                {form.fields.map((field) => (
                  <div key={field} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    {field}
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <Link href={`/forms/${encodeURIComponent(form.id)}`} className="btn-primary">
                  填寫
                </Link>
                <Link href={`/forms/${encodeURIComponent(form.id)}/responses`} className="btn-secondary">
                  回覆
                </Link>
                <Link href={form.targetModule ? `/${form.targetModule}` : "/form-builder"} className="btn-secondary">
                  模組
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
