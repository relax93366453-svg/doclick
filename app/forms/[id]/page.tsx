"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function FormFillPage({ params }: { params: { id: string } }) {
  const formId = decodeURIComponent(params.id);
  const [form, setForm] = useState<GeneratedForm | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("bizflow-generated-forms");
    const forms: GeneratedForm[] = saved ? JSON.parse(saved) : [];
    const found = forms.find((item) => item.id === formId);
    setForm(found ?? null);
  }, [formId]);

  function submit() {
    if (!form) return;

    const oldRaw = localStorage.getItem("bizflow-form-responses");
    const oldResponses = oldRaw ? JSON.parse(oldRaw) : [];

    const nextResponses = [
      {
        id: crypto.randomUUID(),
        formId: form.id,
        formName: form.name,
        templateName: form.templateName,
        values,
        createdAt: new Date().toISOString()
      },
      ...oldResponses
    ];

    localStorage.setItem("bizflow-form-responses", JSON.stringify(nextResponses));
    alert("表單已送出，接下來會跳到回覆列表。");
    router.push(`/forms/${encodeURIComponent(form.id)}/responses`);
  }

  if (!form) {
    return (
      <AppLayout title="填寫表單">
        <div className="card text-center">
          <h1 className="text-xl font-bold">找不到表單</h1>
          <p className="mt-2 text-sm text-slate-500">
            可能是瀏覽器資料被清空，或是還沒有套用範本。
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link href="/forms" className="btn-secondary">
              回表單列表
            </Link>
            <Link href="/templates" className="btn-primary">
              去套用範本
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`填寫：${form.name}`}>
      <PageHeader
        title={`填寫：${form.name}`}
        description={`${form.description}｜來源：${form.templateName}`}
        action={
          <div className="flex gap-2">
            <Link href="/forms" className="btn-secondary">回表單列表</Link>
            <Link href={`/forms/${encodeURIComponent(form.id)}/responses`} className="btn-secondary">查看回覆</Link>
          </div>
        }
      />

      <div className="card max-w-3xl">
        <div className="space-y-4">
          {form.fields.map((field) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium">{field}</label>
              <input
                className="input"
                placeholder={`請輸入${field}`}
                value={values[field] ?? ""}
                onChange={(event) => setValues((prev) => ({ ...prev, [field]: event.target.value }))}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Link href="/forms" className="btn-secondary">取消</Link>
          <button className="btn-primary" onClick={submit}>送出並查看回覆</button>
        </div>
      </div>
    </AppLayout>
  );
}
