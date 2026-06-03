"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  BriefcaseBusiness,
  CalendarCheck,
  Car,
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
  "組合餐",
  "產業應用",
  "生活應用",
  "系統報表",
  "系統",
  "防疫專區"
];

const iconMap = {
  money: WalletCards,
  document: FileText,
  meeting: CalendarCheck,
  car: Car,
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
    description: "輸入應付金額，自動計算預扣所得及健保補充費。",
    icon: "money",
    fields: ["報酬單編號", "填表日期", "團體", "姓名", "聯絡電話", "身分證號碼", "居留證號碼", "通訊地址", "戶籍地址", "勞務內容", "所得類別", "應付金額", "代扣所得稅", "二代健保補充費", "實領金額", "付款方式", "領款人簽章", "領款日期"],
    sections: [
      {
        title: "領款人基本資料",
        rows: [
          ["報酬單編號", "202309-001", "填表日期", "2023/09/25"],
          ["團體", "本國籍", "姓名", "李東生"],
          ["身分證號碼", "", "居留證／護照號碼", ""],
          ["通訊地址", "", "", ""],
          ["戶籍地址", "", "", ""]
        ]
      },
      {
        title: "勞務內容",
        rows: [
          ["勞務內容", "", "", ""],
          ["所得類別", "9A 執行業務所得", "", ""]
        ]
      },
      {
        title: "領款金額",
        rows: [
          ["應付金額", "新台幣 $30,000 元", "", ""],
          ["代扣所得稅（10%）", "新台幣 $3,000 元", "", ""],
          ["二代健保補充費（2.11%）", "新台幣 $633 元", "", ""],
          ["實領金額", "新台幣 $26,367 元", "", ""],
          ["付款方式", "現金", "", ""]
        ]
      }
    ]
  },
  {
    id: "document-receive",
    category: "行政",
    title: "公文收發管理",
    description: "管理公文收文、發文、承辦人、期限與附件。",
    icon: "document",
    fields: ["公文編號", "收發類型", "來文單位", "承辦人", "收文日期", "辦理期限", "狀態", "附件"],
    sections: [
      { title: "公文基本資料", rows: [["公文編號", "DOC-2026-001", "收發類型", "收文"], ["來文單位", "客戶 A", "承辦人", "行政部"], ["收文日期", "2026/05/12", "辦理期限", "2026/05/20"]] },
      { title: "辦理內容", rows: [["狀態", "處理中", "附件", "來文.pdf"]] }
    ]
  },
  {
    id: "meeting-room-open",
    category: "行政",
    title: "會議室管理（開放大眾使用）",
    description: "適合共享空間、會議室出租、預約與收費管理。",
    icon: "meeting",
    fields: ["預約編號", "會議室", "申請人", "日期", "開始時間", "結束時間", "費用", "付款狀態"],
    sections: [
      { title: "預約資訊", rows: [["預約編號", "MR-001", "會議室", "A 會議室"], ["申請人", "王小明", "日期", "2026/05/12"], ["開始時間", "10:00", "結束時間", "12:00"]] },
      { title: "收費資訊", rows: [["費用", "NT$ 1,200", "付款狀態", "已付款"]] }
    ]
  },
  {
    id: "meeting-room",
    category: "行政",
    title: "會議室管理",
    description: "公司內部會議室預約、設備與使用紀錄。",
    icon: "meeting",
    fields: ["會議室", "申請人", "部門", "日期", "時間", "用途", "設備需求", "狀態"],
    sections: [
      { title: "會議預約", rows: [["會議室", "B 會議室", "申請人", "Amy"], ["部門", "行政部", "日期", "2026/05/15"], ["用途", "教育訓練", "狀態", "已核准"]] }
    ]
  },
  {
    id: "fixed-assets",
    category: "行政",
    title: "固定資產管理",
    description: "管理公司資產、保管人、位置、折舊與盤點。",
    icon: "car",
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
    description: "發布公司公告、附件、閱讀確認與對象設定。",
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
    if (!installed.includes(template.id)) {
      setInstalled((prev) => [...prev, template.id]);
    }

    alert(`已取得「${template.title}」範本。\nDemo 版先顯示取得狀態；正式版會新增到表單列表。`);
  }

  return (
    <AppLayout title="表單範本市集">
      <PageHeader
        title="表單範本市集"
        description="依產業與部門快速取得常用表單，套用後可再進入表單設計器修改欄位。"
      />

      <div className="grid gap-5 xl:grid-cols-[260px_1fr_560px]">
        <div className="card">
          <h3 className="mb-4 font-bold">分類</h3>

          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
                  activeCategory === category ? "bg-slate-200 font-bold text-slate-900" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="搜尋範本..."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <Search className="h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold">{activeCategory}範本</h3>
              <p className="mt-1 text-sm text-slate-500">點選範本可在右側預覽，按取得即可套用。</p>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
              {filteredTemplates.length} 個
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold">{template.title}</h4>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">{template.description}</p>
                  </div>

                  <span
                    onClick={(event) => {
                      event.stopPropagation();
                      installTemplate(template);
                    }}
                    className={`rounded-full px-4 py-2 text-sm ${
                      isInstalled ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isInstalled ? "已取得" : "取得"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">{selected.title}</h3>
              <span className="mt-2 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">取得</span>
              <p className="mt-4 text-sm leading-6 text-slate-500">{selected.description}</p>
              <p className="mt-3 text-sm text-slate-500">包含表單：</p>
              <p className="font-bold">{selected.title}</p>
            </div>

            <button className="btn-primary" onClick={() => installTemplate(selected)}>
              取得
            </button>
          </div>

          <div className="rounded-3xl bg-slate-100 p-5">
            <div className="mx-auto max-w-[520px] rounded-2xl bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-brand-700">BizFlow</h2>
                  <p className="mt-1 text-xs text-slate-400">表單範本預覽</p>
                </div>
                <FileText className="h-6 w-6 text-brand-600" />
              </div>

              {selected.sections.map((section) => (
                <div key={section.title} className="mb-5">
                  <div className="rounded-md bg-brand-700 px-3 py-2 text-center text-sm font-bold text-white">
                    {section.title}
                  </div>

                  <div className="overflow-hidden border border-slate-200">
                    {section.rows.map((row, rowIndex) => (
                      <div key={rowIndex} className="grid grid-cols-4 border-b border-slate-100 last:border-b-0 text-xs">
                        <div className="bg-slate-50 px-2 py-2 font-medium text-slate-600">{row[0]}</div>
                        <div className="px-2 py-2">{row[1]}</div>
                        <div className="bg-slate-50 px-2 py-2 font-medium text-slate-600">{row[2]}</div>
                        <div className="px-2 py-2">{row[3]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-8 grid grid-cols-[1fr_1fr] gap-2 text-xs">
                <div className="bg-slate-50 px-3 py-2 text-right font-medium">領款人簽章</div>
                <div className="border-b border-slate-200 px-3 py-2"></div>
                <div className="bg-slate-50 px-3 py-2 text-right font-medium">領款日期</div>
                <div className="border-b border-slate-200 px-3 py-2"></div>
              </div>
            </div>
          </div>

          <div className="mt-5">
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
