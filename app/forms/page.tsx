"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { ClipboardList, Eye, FileText, Plus, Search, Settings2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type AppliedForm = {
  id: string;
  title: string;
  category: string;
  description: string;
  fields: string[];
  source: string;
  appliedAt: string;
};

const defaultForms: AppliedForm[] = [
  {
    id: "demo-customer",
    title: "客戶資料表",
    category: "銷售",
    description: "管理客戶基本資料、來源、負責人與聯絡紀錄。",
    fields: ["客戶名稱", "聯絡人", "電話", "Email", "來源", "負責人", "狀態", "備註"],
    source: "系統預設",
    appliedAt: "系統建立"
  },
  {
    id: "demo-order",
    title: "訂單管理表",
    category: "銷售",
    description: "管理訂單編號、客戶、金額、付款與出貨狀態。",
    fields: ["訂單編號", "客戶名稱", "訂單日期", "金額", "付款狀態", "出貨狀態"],
    source: "系統預設",
    appliedAt: "系統建立"
  }
];

function getStoredForms(): AppliedForm[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("doclickAppliedForms") || "[]");
  } catch {
    return [];
  }
}

function saveStoredForms(forms: AppliedForm[]) {
  localStorage.setItem("doclickAppliedForms", JSON.stringify(forms));
  window.dispatchEvent(new Event("doclickFormsUpdated"));
}

export default function FormsPage() {
  const [forms, setForms] = useState<AppliedForm[]>([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("全部");

  useEffect(() => {
    setForms([...getStoredForms(), ...defaultForms]);

    function handleUpdate() {
      setForms([...getStoredForms(), ...defaultForms]);
    }

    window.addEventListener("doclickFormsUpdated", handleUpdate);
    return () => window.removeEventListener("doclickFormsUpdated", handleUpdate);
  }, []);

  const categories = useMemo(() => {
    return ["全部", ...Array.from(new Set(forms.map((form) => form.category)))];
  }, [forms]);

  const filteredForms = useMemo(() => {
    return forms.filter((form) => {
      const matchKeyword = [form.title, form.description, form.category, form.source].join(" ").includes(keyword);
      const matchCategory = category === "全部" || form.category === category;
      return matchKeyword && matchCategory;
    });
  }, [forms, keyword, category]);

  function deleteForm(id: string) {
    const stored = getStoredForms();
    const next = stored.filter((form) => form.id !== id);
    saveStoredForms(next);
    setForms([...next, ...defaultForms]);
  }

  return (
    <AppLayout title="表單列表">
      <PageHeader
        title="表單列表"
        description="從產業範本庫套用的表單會出現在這裡，可查看欄位、進入表單設計器、設定權限與簽核流程。"
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/templates" className="btn-secondary">
              <Plus className="mr-2 h-4 w-4" />
              從範本建立
            </Link>
            <Link href="/form-builder/ragic" className="btn-primary">
              <Settings2 className="mr-2 h-4 w-4" />
              新增空白表單
            </Link>
          </div>
        }
      />

      <div className="card mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="搜尋表單名稱、分類、來源..." value={keyword} onChange={(event) => setKeyword(event.target.value)} />
          </div>

          <select className="input max-w-44" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>

          <span className="rounded-full bg-brand-50 px-3 py-2 text-sm text-brand-700">
            共 {filteredForms.length} 張表單
          </span>
        </div>
      </div>

      {filteredForms.length === 0 ? (
        <div className="card text-center">
          <ClipboardList className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h3 className="font-bold">目前沒有表單</h3>
          <p className="mt-2 text-sm text-slate-500">請先到產業範本庫套用範本。</p>
          <Link href="/templates" className="btn-primary mt-5 inline-flex">前往產業範本庫</Link>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          {filteredForms.map((form) => {
            const isStored = !form.id.startsWith("demo-");

            return (
              <div key={form.id} className="card">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500">{form.category}</span>
                </div>

                <h3 className="text-lg font-bold">{form.title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{form.description}</p>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">欄位數</p>
                  <p className="mt-1 text-xl font-bold">{form.fields.length} 個欄位</p>
                  <p className="mt-2 text-xs text-slate-400">來源：{form.source}</p>
                  <p className="text-xs text-slate-400">套用時間：{form.appliedAt}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {form.fields.slice(0, 6).map((field) => (
                    <span key={field} className="rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-700">{field}</span>
                  ))}
                  {form.fields.length > 6 && <span className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500">+{form.fields.length - 6}</span>}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Link href={`/forms/${form.id}`} className="btn-primary justify-center">
                    <Eye className="mr-2 h-4 w-4" />
                    查看
                  </Link>
                  <Link href="/form-builder/ragic" className="btn-secondary justify-center">設計</Link>
                  <Link href="/permissions/advanced" className="btn-secondary justify-center">權限</Link>
                  <Link href="/hr/approval/advanced" className="btn-secondary justify-center">簽核</Link>
                </div>

                {isStored && (
                  <button className="mt-3 flex w-full items-center justify-center rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50" onClick={() => deleteForm(form.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    移除套用表單
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
