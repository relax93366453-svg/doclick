"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  Search,
  Settings2,
  Store,
  Sparkles,
  Plus
} from "lucide-react";
import { useMemo, useState } from "react";

type AppliedForm = {
  id: string;
  title: string;
  category: string;
  description: string;
  fields: string[];
  source: string;
  appliedAt: string;
};

const singleTemplates = [
  {
    id: "salary-reward",
    title: "勞務報酬單",
    category: "行政",
    description: "輸入應付金額，自動試算預扣所得稅、二代健保補充費與實領金額。",
    fields: ["報酬單編號", "填表日期", "姓名", "聯絡電話", "身分證號碼", "通訊地址", "勞務內容", "所得類別", "應付金額", "代扣所得稅", "二代健保補充費", "實領金額", "付款方式", "領款人簽章"]
  },
  {
    id: "document-receive",
    title: "公文收發管理",
    category: "行政",
    description: "管理公文收文、發文、承辦人、期限、狀態與附件。",
    fields: ["公文編號", "收發類型", "來文單位", "承辦人", "收文日期", "辦理期限", "狀態", "附件"]
  },
  {
    id: "meeting-room",
    title: "會議室管理",
    category: "行政",
    description: "公司內部會議室預約、設備需求與使用紀錄。",
    fields: ["會議室", "申請人", "部門", "日期", "時間", "用途", "設備需求", "狀態"]
  },
  {
    id: "fixed-assets",
    title: "固定資產管理",
    category: "行政",
    description: "管理公司資產、保管人、位置、折舊與盤點狀態。",
    fields: ["資產編號", "資產名稱", "類別", "購入日期", "金額", "保管人", "位置", "狀態"]
  },
  {
    id: "repair",
    title: "設備報修單",
    category: "行政",
    description: "設備故障申報、維修進度、費用與處理紀錄。",
    fields: ["報修編號", "設備名稱", "申請人", "故障描述", "報修日期", "維修人員", "維修狀態", "維修費用"]
  },
  {
    id: "equipment-rental",
    title: "設備出借",
    category: "行政",
    description: "公司設備借用、歸還、逾期提醒與保管人管理。",
    fields: ["借用編號", "設備名稱", "借用人", "借用日期", "預計歸還", "實際歸還", "狀態"]
  },
  {
    id: "announcement",
    title: "公告系統",
    category: "行政",
    description: "發布公司公告、附件、閱讀確認與發布對象設定。",
    fields: ["公告編號", "公告標題", "公告內容", "發布日期", "發布人", "對象", "附件", "閱讀確認"]
  },
  {
    id: "office-supplies",
    title: "辦公用品管理",
    category: "行政",
    description: "辦公用品庫存、領用、補貨與安全庫存提醒。",
    fields: ["用品編號", "用品名稱", "分類", "庫存", "安全庫存", "領用人", "領用數量", "補貨狀態"]
  },
  {
    id: "contacts",
    title: "員工通訊錄",
    category: "行政",
    description: "員工電話、Email、部門、職稱與緊急聯絡人。",
    fields: ["員工編號", "姓名", "部門", "職稱", "電話", "Email", "緊急聯絡人", "備註"]
  },
  {
    id: "expense",
    title: "費用報支",
    category: "行政",
    description: "費用申請、發票附件、主管審核與付款狀態。",
    fields: ["報支編號", "申請人", "費用項目", "金額", "發票號碼", "附件", "審核狀態", "付款狀態"]
  }
];

const industryTemplates = [
  {
    id: "ecommerce",
    title: "電商公司範本",
    description: "商品、訂單、客戶、物流、退貨、庫存與客服工單。",
    icon: "store",
    forms: [
      { id: "ecommerce-product", title: "商品管理", category: "電商", description: "管理商品、SKU、售價、成本、庫存與商品圖片。", fields: ["商品名稱", "SKU", "商品分類", "售價", "成本", "庫存", "安全庫存", "商品圖片", "狀態"] },
      { id: "ecommerce-order", title: "訂單管理", category: "電商", description: "管理訂單編號、客戶、金額、付款狀態與物流狀態。", fields: ["訂單編號", "客戶名稱", "訂單金額", "付款狀態", "物流狀態", "出貨日期", "備註"] },
      { id: "ecommerce-service", title: "客服工單", category: "電商", description: "管理客戶問題、處理狀態、負責人與附件。", fields: ["客戶名稱", "問題類型", "問題內容", "處理狀態", "負責人", "附件", "結案日期"] }
    ]
  },
  {
    id: "beauty",
    title: "美容業範本",
    description: "顧客、療程、預約、產品銷售、會員儲值、回訪提醒與美容師績效。",
    icon: "sparkles",
    forms: [
      { id: "beauty-customer", title: "顧客資料", category: "美容", description: "管理顧客姓名、電話、膚況、過敏史與照片附件。", fields: ["姓名", "電話", "膚況", "過敏史", "主要需求", "顧客來源", "照片附件", "備註"] },
      { id: "beauty-treatment", title: "療程紀錄", category: "美容", description: "管理療程日期、療程項目、美容師、前後照片與顧客簽名。", fields: ["療程日期", "顧客姓名", "療程項目", "美容師", "前後照片", "顧客簽名", "下次建議"] },
      { id: "beauty-followup", title: "回訪提醒", category: "美容", description: "管理顧客、回訪日期、回訪狀態與備註。", fields: ["顧客姓名", "回訪日期", "回訪狀態", "回訪內容", "負責人", "備註"] }
    ]
  },
  {
    id: "office",
    title: "行政辦公室範本",
    description: "公告、文件、採購、用印、會議室、人事請假、資產與費用報銷。",
    icon: "clipboard",
    forms: [
      { id: "office-admin-request", title: "行政申請", category: "行政", description: "管理申請人、申請類型、金額、附件與簽核狀態。", fields: ["申請人", "申請類型", "申請內容", "金額", "附件", "簽核狀態", "審核人"] },
      { id: "office-meeting", title: "會議室管理", category: "行政", description: "管理會議室預約、設備需求與使用紀錄。", fields: ["會議室", "申請人", "日期", "時間", "用途", "設備需求", "狀態"] },
      { id: "office-asset", title: "固定資產", category: "行政", description: "管理資產編號、資產名稱、保管人、位置與盤點狀態。", fields: ["資產編號", "資產名稱", "類別", "保管人", "位置", "狀態", "盤點日期"] }
    ]
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

function iconFor(name: string) {
  if (name === "store") return <Store className="h-5 w-5" />;
  if (name === "sparkles") return <Sparkles className="h-5 w-5" />;
  return <ClipboardList className="h-5 w-5" />;
}

export default function TemplatesPage() {
  const [mode, setMode] = useState<"overview" | "marketplace">("overview");
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState("salary-reward");
  const [installedIds, setInstalledIds] = useState<string[]>(() => getStoredForms().map((form) => form.id));

  const selected = singleTemplates.find((item) => item.id === selectedId) ?? singleTemplates[0];

  const filteredSingle = useMemo(() => {
    return singleTemplates.filter((item) => [item.title, item.category, item.description].join(" ").includes(keyword));
  }, [keyword]);

  function upsert(forms: AppliedForm[], goToForms: boolean) {
    const current = getStoredForms();
    const merged = [...current];

    forms.forEach((form) => {
      const index = merged.findIndex((item) => item.id === form.id);
      if (index >= 0) merged[index] = { ...merged[index], ...form };
      else merged.unshift(form);
    });

    saveStoredForms(merged);
    setInstalledIds(merged.map((item) => item.id));

    if (goToForms) {
      window.location.href = "/forms";
    } else {
      alert(`已套用 ${forms.length} 張表單，可到「表單列表」查看。`);
    }
  }

  function applySingle(template: typeof singleTemplates[number], goToForms: boolean) {
    upsert([
      {
        id: template.id,
        title: template.title,
        category: template.category,
        description: template.description,
        fields: template.fields,
        source: "單張表單範本市集",
        appliedAt: new Date().toLocaleString("zh-TW")
      }
    ], goToForms);
  }

  function applyIndustry(template: typeof industryTemplates[number], goToForms: boolean) {
    upsert(template.forms.map((form) => ({
      id: form.id,
      title: form.title,
      category: form.category,
      description: form.description,
      fields: form.fields,
      source: template.title,
      appliedAt: new Date().toLocaleString("zh-TW")
    })), goToForms);
  }

  return (
    <AppLayout title="產業範本庫">
      <PageHeader
        title="產業範本庫"
        description="套用範本後會自動出現在「表單列表」，可再進入表單設計器、權限設定與電子簽核。"
        action={
          <Link href="/forms" className="btn-secondary">
            前往表單列表
          </Link>
        }
      />

      <div className="card mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button className={`rounded-xl px-4 py-2 text-sm font-medium ${mode === "overview" ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-600"}`} onClick={() => setMode("overview")}>
              產業範本總覽
            </button>
            <button className={`rounded-xl px-4 py-2 text-sm font-medium ${mode === "marketplace" ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-600"}`} onClick={() => setMode("marketplace")}>
              單張表單範本市集
            </button>
          </div>
          <div className="text-sm text-slate-500">已套用 {installedIds.length} 張表單</div>
        </div>
      </div>

      {mode === "overview" && (
        <div className="grid gap-5 xl:grid-cols-3">
          {industryTemplates.map((template) => (
            <div key={template.id} className="card">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                {iconFor(template.icon)}
              </div>
              <h3 className="text-lg font-bold">{template.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{template.description}</p>

              <div className="mt-5 space-y-3">
                {template.forms.map((form) => (
                  <div key={form.id} className="rounded-2xl bg-slate-50 p-4">
                    <h4 className="font-bold">{form.title}</h4>
                    <p className="mt-1 text-sm text-slate-500">{form.description}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">欄位：{form.fields.join("、")}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button className="btn-primary" onClick={() => applyIndustry(template, true)}>
                  套用並前往列表
                </button>
                <button className="btn-secondary" onClick={() => applyIndustry(template, false)}>
                  只套用
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === "marketplace" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
          <div className="card">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input className="w-full bg-transparent text-sm outline-none" placeholder="搜尋範本..." value={keyword} onChange={(event) => setKeyword(event.target.value)} />
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-2 text-sm text-brand-700">{filteredSingle.length} 個範本</span>
            </div>

            <div className="space-y-3">
              {filteredSingle.map((template) => {
                const isInstalled = installedIds.includes(template.id);

                return (
                  <button key={template.id} onClick={() => setSelectedId(template.id)} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${selectedId === template.id ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold">{template.title}</h4>
                      <p className="mt-1 line-clamp-1 text-sm text-slate-500">{template.description}</p>
                      <p className="mt-2 text-xs text-slate-400">{template.fields.length} 個欄位｜{template.category}</p>
                    </div>
                    <span onClick={(event) => { event.stopPropagation(); applySingle(template, true); }} className={`rounded-xl px-4 py-2 text-sm font-medium ${isInstalled ? "bg-emerald-50 text-emerald-700" : "bg-brand-600 text-white"}`}>
                      {isInstalled ? "已套用" : "套用"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{selected.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{selected.description}</p>
              </div>
              <button className="btn-primary" onClick={() => applySingle(selected, true)}>
                套用並前往
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black text-brand-700">DOCLICK.TW</h2>
                <p className="mt-1 text-xs text-slate-400">表單範本預覽</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {selected.fields.slice(0, 8).map((field) => (
                    <div key={field}>
                      <label className="mb-1 block text-xs font-medium text-slate-500">{field}</label>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400">請輸入</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-400">
                  套用後會出現在「表單列表」
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
