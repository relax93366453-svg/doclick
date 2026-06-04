"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  BriefcaseBusiness,
  CalendarCheck,
  FileCheck2,
  FileText,
  Laptop,
  Megaphone,
  PackageCheck,
  Search,
  UserRound,
  WalletCards,
  Wrench
} from "lucide-react";
import { useMemo, useState } from "react";

type TemplateItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  fields: string[];
  sections: {
    title: string;
    rows: string[][];
  }[];
};

const categories = [
  "全部",
  "業務",
  "行銷",
  "客服",
  "行政",
  "專案管理",
  "人資",
  "會計",
  "資訊",
  "法務",
  "研發",
  "採購",
  "製造",
  "品保",
  "倉儲",
  "系統報表"
];

const iconMap = {
  money: WalletCards,
  document: FileText,
  meeting: CalendarCheck,
  asset: BriefcaseBusiness,
  wrench: Wrench,
  laptop: Laptop,
  announce: Megaphone,
  package: PackageCheck,
  user: UserRound,
  file: FileCheck2
};

const templates: TemplateItem[] = [
  {
    id: "salary-reward",
    category: "行政",
    title: "勞務報酬單",
    description: "輸入應付金額，自動試算預扣所得稅、二代健保補充費與實領金額。",
    icon: "money",
    fields: ["報酬單編號", "填表日期", "姓名", "聯絡電話", "身分證號碼", "通訊地址", "勞務內容", "所得類別", "應付金額", "代扣所得稅", "二代健保補充費", "實領金額", "付款方式", "領款人簽章"],
    sections: [
      { title: "領款人基本資料", rows: [["報酬單編號", "202309-001", "填表日期", "2023/09/25"], ["姓名", "李東生", "聯絡電話", "0912-000-000"], ["身分證號碼", "A123456789", "通訊地址", "台北市"]] },
      { title: "勞務與金額", rows: [["勞務內容", "講師費", "所得類別", "9A 執行業務所得"], ["應付金額", "NT$ 30,000", "實領金額", "NT$ 26,367"]] }
    ]
  },
  {
    id: "document-receive",
    category: "行政",
    title: "公文收發管理",
    description: "管理公文收文、發文、承辦人、期限、狀態與附件。",
    icon: "document",
    fields: ["公文編號", "收發類型", "來文單位", "承辦人", "收文日期", "辦理期限", "狀態", "附件"],
    sections: [
      { title: "公文基本資料", rows: [["公文編號", "DOC-2026-001", "收發類型", "收文"], ["來文單位", "客戶 A", "承辦人", "行政部"], ["辦理期限", "2026/05/20", "狀態", "處理中"]] }
    ]
  },
  {
    id: "meeting-room",
    category: "行政",
    title: "會議室管理",
    description: "公司內部會議室預約、設備需求與使用紀錄。",
    icon: "meeting",
    fields: ["會議室", "申請人", "部門", "日期", "時間", "用途", "設備需求", "狀態"],
    sections: [
      { title: "預約資料", rows: [["會議室", "A 會議室", "申請人", "Amy"], ["日期", "2026/05/15", "時間", "10:00-12:00"], ["用途", "教育訓練", "狀態", "已核准"]] }
    ]
  },
  {
    id: "fixed-assets",
    category: "行政",
    title: "固定資產管理",
    description: "管理公司資產、保管人、位置、折舊與盤點狀態。",
    icon: "asset",
    fields: ["資產編號", "資產名稱", "類別", "購入日期", "金額", "保管人", "位置", "狀態"],
    sections: [
      { title: "資產資料", rows: [["資產編號", "AS-001", "資產名稱", "筆電"], ["類別", "資訊設備", "金額", "NT$ 32,000"], ["保管人", "林可欣", "狀態", "使用中"]] }
    ]
  },
  {
    id: "repair",
    category: "行政",
    title: "設備報修單",
    description: "設備故障申報、維修進度、費用與處理紀錄。",
    icon: "wrench",
    fields: ["報修編號", "設備名稱", "申請人", "故障描述", "報修日期", "維修人員", "維修狀態", "維修費用"],
    sections: [
      { title: "報修資料", rows: [["報修編號", "RP-001", "設備名稱", "印表機"], ["申請人", "行政部", "報修日期", "2026/05/10"], ["故障描述", "無法列印", "維修狀態", "處理中"]] }
    ]
  },
  {
    id: "equipment-rental",
    category: "行政",
    title: "設備出借",
    description: "公司設備借用、歸還、逾期提醒與保管人管理。",
    icon: "laptop",
    fields: ["借用編號", "設備名稱", "借用人", "借用日期", "預計歸還", "實際歸還", "狀態"],
    sections: [
      { title: "出借資料", rows: [["借用編號", "BR-001", "設備名稱", "投影機"], ["借用人", "王小明", "預計歸還", "2026/05/20"], ["狀態", "借出中", "", ""]] }
    ]
  },
  {
    id: "announcement",
    category: "行政",
    title: "公告系統",
    description: "發布公司公告、附件、閱讀確認與發布對象設定。",
    icon: "announce",
    fields: ["公告編號", "公告標題", "公告內容", "發布日期", "發布人", "對象", "附件", "閱讀確認"],
    sections: [
      { title: "公告資料", rows: [["公告編號", "AN-001", "公告標題", "端午節放假公告"], ["發布人", "行政部", "發布日期", "2026/05/20"], ["對象", "全體員工", "閱讀確認", "需確認"]] }
    ]
  },
  {
    id: "office-supplies",
    category: "行政",
    title: "辦公用品管理",
    description: "辦公用品庫存、領用、補貨與安全庫存提醒。",
    icon: "package",
    fields: ["用品編號", "用品名稱", "分類", "庫存", "安全庫存", "領用人", "領用數量", "補貨狀態"],
    sections: [
      { title: "用品資料", rows: [["用品編號", "OS-001", "用品名稱", "A4 紙"], ["庫存", "20", "安全庫存", "10"], ["補貨狀態", "正常", "", ""]] }
    ]
  },
  {
    id: "contacts",
    category: "行政",
    title: "員工通訊錄",
    description: "員工電話、Email、部門、職稱與緊急聯絡人。",
    icon: "user",
    fields: ["員工編號", "姓名", "部門", "職稱", "電話", "Email", "緊急聯絡人", "備註"],
    sections: [
      { title: "員工通訊資料", rows: [["員工編號", "E001", "姓名", "陳美美"], ["部門", "門市部", "職稱", "店長"], ["電話", "0912-000-000", "Email", "demo@example.com"]] }
    ]
  },
  {
    id: "expense",
    category: "行政",
    title: "費用報支",
    description: "費用申請、發票附件、主管審核與付款狀態。",
    icon: "money",
    fields: ["報支編號", "申請人", "費用項目", "金額", "發票號碼", "附件", "審核狀態", "付款狀態"],
    sections: [
      { title: "報支資料", rows: [["報支編號", "EX-001", "申請人", "王小明"], ["費用項目", "交通費", "金額", "NT$ 1,200"], ["審核狀態", "待審核", "付款狀態", "未付款"]] }
    ]
  }
];

function getIcon(name: string) {
  return iconMap[name as keyof typeof iconMap] ?? FileText;
}

export default function TemplateMarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("行政");
  const [keyword, setKeyword] = useState("");
  const [selectedId, setSelectedId] = useState("salary-reward");
  const [installed, setInstalled] = useState<string[]>([]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchCategory = activeCategory === "全部" || template.category === activeCategory;
      const matchKeyword = [template.title, template.description, template.category].join(" ").includes(keyword);
      return matchCategory && matchKeyword;
    });
  }, [activeCategory, keyword]);

  const selected = templates.find((template) => template.id === selectedId) ?? templates[0];

  function installTemplate(template: TemplateItem) {
    if (!installed.includes(template.id)) setInstalled((prev) => [...prev, template.id]);
    alert(`Demo：已套用「${template.title}」範本。\n正式版會新增到表單列表，並可進入表單設計器調整欄位。`);
  }

  return (
    <AppLayout title="產業範本庫">
      <PageHeader
        title="產業範本庫"
        description="保留 DOCLICK.TW 原始藍白系統風格，提供各部門常用表單範本，可一鍵套用後再自訂欄位。"
        action={
          <button className="btn-primary" onClick={() => installTemplate(selected)}>
            套用目前範本
          </button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[280px_1fr_520px]">
        <div className="card">
          <h3 className="font-bold">範本分類</h3>
          <p className="mt-1 text-sm text-slate-500">依部門或使用情境快速篩選。</p>

          <div className="mt-5 space-y-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                  activeCategory === category ? "bg-brand-600 font-semibold text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {category}
                {activeCategory === category && <span className="text-xs">●</span>}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="搜尋範本..."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>
        </div>

        <div className="card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold">範本清單</h3>
              <p className="mt-1 text-sm text-slate-500">點選範本可查看右側預覽。</p>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
              {filteredTemplates.length} 個範本
            </span>
          </div>

          <div className="space-y-3">
            {filteredTemplates.map((template) => {
              const Icon = getIcon(template.icon);
              const isInstalled = installed.includes(template.id);

              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedId(template.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    selectedId === template.id ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold">{template.title}</h4>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">{template.description}</p>
                    <p className="mt-2 text-xs text-slate-400">{template.fields.length} 個欄位｜{template.category}</p>
                  </div>

                  <span
                    onClick={(event) => {
                      event.stopPropagation();
                      installTemplate(template);
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-medium ${
                      isInstalled ? "bg-emerald-50 text-emerald-700" : "bg-brand-600 text-white"
                    }`}
                  >
                    {isInstalled ? "已套用" : "套用"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{selected.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{selected.description}</p>
              </div>
              <button className="btn-primary" onClick={() => installTemplate(selected)}>
                套用
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-brand-700">DOCLICK.TW</h2>
                    <p className="mt-1 text-xs text-slate-400">表單範本預覽</p>
                  </div>
                  <FileText className="h-6 w-6 text-brand-600" />
                </div>

                {selected.sections.map((section) => (
                  <div key={section.title} className="mb-5">
                    <div className="rounded-xl bg-brand-600 px-4 py-2 text-center text-sm font-bold text-white">
                      {section.title}
                    </div>

                    <div className="mt-2 overflow-hidden rounded-xl border border-slate-200">
                      {section.rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-4 border-b border-slate-100 last:border-b-0 text-xs">
                          <div className="bg-slate-50 px-2 py-3 font-medium text-slate-600">{row[0]}</div>
                          <div className="px-2 py-3">{row[1]}</div>
                          <div className="bg-slate-50 px-2 py-3 font-medium text-slate-600">{row[2]}</div>
                          <div className="px-2 py-3">{row[3]}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-400">
                  套用後可進入表單設計器調整欄位、權限與簽核流程
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 className="font-bold">欄位清單</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.fields.map((field) => (
                <span key={field} className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600">
                  {field}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
