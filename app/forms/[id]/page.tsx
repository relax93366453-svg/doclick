"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLeft, FileText, Settings2, ShieldCheck, Workflow } from "lucide-react";
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

export default function FormDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const [forms, setForms] = useState<AppliedForm[]>([]);

  useEffect(() => {
    setForms([...getStoredForms(), ...defaultForms]);
  }, []);

  const form = useMemo(() => forms.find((item) => item.id === id), [forms, id]);

  if (!form) {
    return (
      <AppLayout title="表單明細">
        <div className="card text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-slate-300" />
          <h3 className="font-bold">找不到這張表單</h3>
          <p className="mt-2 text-sm text-slate-500">可能尚未套用範本，或已被移除。</p>
          <Link href="/forms" className="btn-primary mt-5 inline-flex">返回表單列表</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={form.title}>
      <PageHeader
        title={form.title}
        description={form.description}
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/forms" className="btn-secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回列表
            </Link>
            <Link href="/form-builder/ragic" className="btn-primary">
              <Settings2 className="mr-2 h-4 w-4" />
              編輯欄位
            </Link>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <div className="card"><p className="text-sm text-slate-500">分類</p><p className="mt-2 text-xl font-bold">{form.category}</p></div>
        <div className="card"><p className="text-sm text-slate-500">欄位數</p><p className="mt-2 text-xl font-bold">{form.fields.length} 個</p></div>
        <div className="card"><p className="text-sm text-slate-500">來源</p><p className="mt-2 text-xl font-bold">{form.source}</p></div>
        <div className="card"><p className="text-sm text-slate-500">套用時間</p><p className="mt-2 text-sm font-bold">{form.appliedAt}</p></div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="card">
          <h3 className="font-bold">欄位清單</h3>
          <p className="mt-1 text-sm text-slate-500">這些欄位會帶入表單設計器，之後可再增減或調整權限。</p>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">順序</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">欄位名稱</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">欄位類型</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">狀態</th>
                </tr>
              </thead>
              <tbody>
                {form.fields.map((field, index) => (
                  <tr key={field}>
                    <td className="border-b border-slate-100 px-4 py-3">{index + 1}</td>
                    <td className="border-b border-slate-100 px-4 py-3 font-medium">{field}</td>
                    <td className="border-b border-slate-100 px-4 py-3">文字／可調整</td>
                    <td className="border-b border-slate-100 px-4 py-3"><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">已建立</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <h3 className="font-bold">表單預覽</h3>
            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="rounded-2xl bg-white p-5">
                <div className="mb-4 border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-black text-brand-700">DOCLICK.TW</h2>
                  <p className="mt-1 text-xs text-slate-400">{form.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {form.fields.slice(0, 8).map((field) => (
                    <div key={field}>
                      <label className="mb-1 block text-xs font-medium text-slate-500">{field}</label>
                      <div className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-400">請輸入</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold">下一步</h3>
            <div className="mt-4 space-y-2">
              <Link href="/form-builder/ragic" className="flex items-center rounded-2xl bg-slate-50 px-4 py-3 text-sm hover:bg-brand-50">
                <Settings2 className="mr-3 h-4 w-4 text-brand-600" />
                進入表單設計器調整欄位
              </Link>
              <Link href="/permissions/advanced" className="flex items-center rounded-2xl bg-slate-50 px-4 py-3 text-sm hover:bg-brand-50">
                <ShieldCheck className="mr-3 h-4 w-4 text-brand-600" />
                設定誰可以看、誰可以改
              </Link>
              <Link href="/hr/approval/advanced" className="flex items-center rounded-2xl bg-slate-50 px-4 py-3 text-sm hover:bg-brand-50">
                <Workflow className="mr-3 h-4 w-4 text-brand-600" />
                設定簽核流程
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
