"use client";

import { industryTemplates } from "@/lib/templates";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export function TemplatesClient() {
  const [applied, setApplied] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("bizflow-applied-templates");
    if (saved) setApplied(JSON.parse(saved));
  }, []);

  function applyTemplate(templateId: string, templateName: string) {
    const template = industryTemplates.find((item) => item.id === templateId);
    if (!template) return;

    const oldFormsRaw = localStorage.getItem("bizflow-generated-forms");
    const oldForms: GeneratedForm[] = oldFormsRaw ? JSON.parse(oldFormsRaw) : [];

    const newForms: GeneratedForm[] = template.modules.map((module) => ({
      id: `${template.id}-${module.name}`,
      templateId: template.id,
      templateName: template.name,
      name: module.name,
      description: module.description,
      fields: module.fields,
      targetModule: module.targetModule,
      createdAt: new Date().toISOString()
    }));

    const mergedForms = [
      ...newForms,
      ...oldForms.filter((oldForm) => oldForm.templateId !== template.id)
    ];

    const nextApplied = Array.from(new Set([templateId, ...applied]));

    localStorage.setItem("bizflow-generated-forms", JSON.stringify(mergedForms));
    localStorage.setItem("bizflow-applied-templates", JSON.stringify(nextApplied));

    setApplied(nextApplied);

    alert(`已套用「${templateName}」，已建立 ${newForms.length} 張表單，接下來會跳到表單列表。`);
    router.push("/forms");
  }

  return (
    <div className="space-y-5">
      {applied.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          已套用 {applied.length} 個範本。
          <Link href="/forms" className="ml-2 font-semibold underline">
            前往表單列表查看
          </Link>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {industryTemplates.map((template) => (
          <div key={template.id} className="card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">{template.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{template.description}</p>
              </div>
              {applied.includes(template.id) && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  已套用
                </span>
              )}
            </div>

            <div className="mt-4 space-y-2">
              {template.modules.map((module) => (
                <div key={module.name} className="rounded-xl bg-slate-50 p-3">
                  <p className="font-medium">{module.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{module.description}</p>
                  <p className="mt-1 text-xs text-slate-400">欄位：{module.fields.join("、")}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button className="btn-primary w-full" onClick={() => applyTemplate(template.id, template.name)}>
                套用並查看
              </button>
              <Link href="/forms" className="btn-secondary w-full">
                表單列表
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
