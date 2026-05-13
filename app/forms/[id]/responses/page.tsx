"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";
import { useEffect, useState } from "react";

type ResponseRow = {
  id: string;
  formId: string;
  formName: string;
  templateName?: string;
  values: Record<string, string>;
  createdAt: string;
};

export default function FormResponsesPage({ params }: { params: { id: string } }) {
  const formId = decodeURIComponent(params.id);
  const [responses, setResponses] = useState<ResponseRow[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("bizflow-form-responses");
    const allResponses: ResponseRow[] = saved ? JSON.parse(saved) : [];
    setResponses(allResponses.filter((item) => item.formId === formId));
  }, [formId]);

  function clearResponses() {
    if (!confirm("確定要清空這張表單的回覆嗎？")) return;

    const saved = localStorage.getItem("bizflow-form-responses");
    const allResponses: ResponseRow[] = saved ? JSON.parse(saved) : [];
    const next = allResponses.filter((item) => item.formId !== formId);

    localStorage.setItem("bizflow-form-responses", JSON.stringify(next));
    setResponses([]);
  }

  return (
    <AppLayout title="表單回覆">
      <PageHeader
        title="表單回覆"
        description="這裡會顯示此表單送出的資料。"
        action={
          <div className="flex gap-2">
            <Link href={`/forms/${encodeURIComponent(formId)}`} className="btn-primary">
              填寫表單
            </Link>
            <Link href="/forms" className="btn-secondary">
              回表單列表
            </Link>
          </div>
        }
      />

      {responses.length === 0 ? (
        <div className="card text-center">
          <h3 className="text-lg font-bold">目前沒有回覆</h3>
          <p className="mt-2 text-sm text-slate-500">請先填寫表單，送出後會出現在這裡。</p>
          <div className="mt-5 flex justify-center gap-2">
            <Link href={`/forms/${encodeURIComponent(formId)}`} className="btn-primary">
              去填寫表單
            </Link>
            <Link href="/forms" className="btn-secondary">
              回表單列表
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="btn-secondary" onClick={clearResponses}>
              清空回覆
            </button>
          </div>

          {responses.map((response) => (
            <div key={response.id} className="card">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{response.formName}</h3>
                  {response.templateName && (
                    <p className="text-xs text-slate-500">來源：{response.templateName}</p>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(response.createdAt).toLocaleString("zh-TW")}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(response.values).map(([key, value]) => (
                  <div key={key} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">{key}</p>
                    <p className="mt-1 font-medium">{value || "未填寫"}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
