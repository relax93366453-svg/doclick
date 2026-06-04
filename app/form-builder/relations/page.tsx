"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  ArrowRightLeft,
  BadgeDollarSign,
  Barcode,
  CalendarDays,
  CheckSquare,
  Database,
  FileImage,
  FileInput,
  FileOutput,
  FileSignature,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Paperclip,
  Phone,
  Plus,
  RefreshCcw,
  Rows3,
  Settings2,
  Share2,
  TextCursorInput,
  Upload,
  UsersRound,
  Workflow
} from "lucide-react";
import { useState } from "react";

type RelationStatus = "啟用中" | "待設定" | "異常";

const relations = [
  {
    id: "customer-quote",
    title: "客戶資料 → 報價單",
    from: "客戶資料",
    to: "報價單",
    action: "選擇客戶後，自動帶入姓名、電話、地址、負責業務。",
    status: "啟用中" as RelationStatus
  },
  {
    id: "quote-order",
    title: "報價單 → 訂單",
    from: "報價單",
    to: "訂單管理",
    action: "報價確認後，一鍵拋轉成訂單。",
    status: "啟用中" as RelationStatus
  },
  {
    id: "order-inventory",
    title: "訂單管理 → 庫存扣減",
    from: "訂單管理",
    to: "進銷存",
    action: "訂單成立後，自動扣減商品庫存。",
    status: "待設定" as RelationStatus
  },
  {
    id: "leave-calendar",
    title: "請假單 → 整合行事曆",
    from: "請假單",
    to: "整合行事曆",
    action: "請假核准後，自動建立 Google / Outlook 行程。",
    status: "啟用中" as RelationStatus
  },
  {
    id: "purchase-approval",
    title: "請購單 → 電子簽核",
    from: "請購單",
    to: "電子簽核",
    action: "送出請購單後，自動送主管簽核。",
    status: "啟用中" as RelationStatus
  }
];

const fieldTypes = [
  { title: "自由輸入", description: "一般文字欄位，可填姓名、備註、說明。", icon: TextCursorInput },
  { title: "從選單選擇", description: "建立下拉選單，例如狀態、分類、付款方式。", icon: Rows3 },
  { title: "從選單多選", description: "同一欄位可選多個選項，例如標籤、需求項目。", icon: CheckSquare },
  { title: "從其它表單選擇", description: "選客戶、商品、人員後，自動帶入相關資料。", icon: Database },
  { title: "檔案上傳", description: "可上傳合約、發票、附件與文件。", icon: Paperclip },
  { title: "圖片上傳", description: "可上傳商品圖、施工照、療程前後照。", icon: FileImage },
  { title: "選擇使用者或群組", description: "指定負責人、主管、簽核人或部門群組。", icon: UsersRound },
  { title: "日期", description: "排程、到期日、請假日期、簽核日期。", icon: CalendarDays },
  { title: "數值／金額", description: "數量、單價、總額、工時、薪資，可搭配公式。", icon: BadgeDollarSign },
  { title: "電子郵件信箱", description: "Email 欄位，可用於通知與寄送表單。", icon: Mail },
  { title: "電話", description: "客戶電話、員工電話、聯絡方式。", icon: Phone },
  { title: "地址", description: "客戶地址、送貨地址、外勤地點。", icon: MapPin },
  { title: "簽名", description: "客戶簽名、主管簽核、領款人簽章。", icon: FileSignature },
  { title: "條碼／編號", description: "商品條碼、系統編號、單據編號。", icon: Barcode },
  { title: "網址", description: "外部連結、商品頁、文件連結。", icon: Link2 }
];

const shareOptions = [
  { title: "LINE 分享", description: "將表單連結傳給客戶、主管或同事填寫。", icon: MessageCircle },
  { title: "WhatsApp 分享", description: "海外客戶或外勤人員可用 WhatsApp 傳送。", icon: MessageCircle },
  { title: "Email 寄送", description: "寄送表單連結、簽核通知或報價單。", icon: Mail },
  { title: "匯出資料", description: "匯出 Excel / CSV / PDF，方便備份或給客戶。", icon: FileOutput },
  { title: "匯入資料", description: "從 Excel 匯入客戶、商品、人員或表單資料。", icon: FileInput },
  { title: "批次更新", description: "大量更新狀態、分類、負責人與欄位資料。", icon: Upload }
];

function statusClass(status: RelationStatus) {
  if (status === "啟用中") return "bg-emerald-50 text-emerald-700";
  if (status === "異常") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

export default function FormRelationsPage() {
  const [selectedRelation, setSelectedRelation] = useState(relations[0]);
  const [autoFill, setAutoFill] = useState(true);
  const [autoTransfer, setAutoTransfer] = useState(true);

  return (
    <AppLayout title="表單關聯與欄位設定">
      <PageHeader
        title="表單關聯與欄位設定"
        description="表單可以互相連結，自動帶入資料、拋轉資料，也可以設定各種欄位型態與分享匯出功能。"
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/form-builder/ragic" className="btn-secondary">
              <Settings2 className="mr-2 h-4 w-4" />
              表單設計器
            </Link>
            <button className="btn-primary" onClick={() => alert("Demo：已新增一組表單關聯。")}>
              <Plus className="mr-2 h-4 w-4" />
              新增關聯
            </button>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="表單關聯" value="5 組" icon={<ArrowRightLeft className="h-5 w-5" />} />
        <Stat label="欄位類型" value="15 種" icon={<TextCursorInput className="h-5 w-5" />} />
        <Stat label="自動帶入" value="啟用" icon={<RefreshCcw className="h-5 w-5" />} />
        <Stat label="分享匯入匯出" value="6 項" icon={<Share2 className="h-5 w-5" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_430px]">
        <div className="space-y-5">
          <div className="card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">表單關聯流程</h2>
                <p className="mt-1 text-sm text-slate-500">
                  讓表單跟表單互相帶資料，不用重複輸入。
                </p>
              </div>
              <Workflow className="h-6 w-6 text-brand-600" />
            </div>

            <div className="space-y-3">
              {relations.map((relation) => (
                <button
                  key={relation.id}
                  onClick={() => setSelectedRelation(relation)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedRelation.id === relation.id ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2 py-1 text-xs ${statusClass(relation.status)}`}>{relation.status}</span>
                        <span className="rounded-full bg-slate-50 px-2 py-1 text-xs text-slate-500">{relation.from}</span>
                        <span className="text-slate-400">→</span>
                        <span className="rounded-full bg-slate-50 px-2 py-1 text-xs text-slate-500">{relation.to}</span>
                      </div>
                      <h3 className="font-bold">{relation.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{relation.action}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">欄位類型設定</h2>
                <p className="mt-1 text-sm text-slate-500">
                  表單欄位可依需求設定不同型態，支援圖片、附件、簽名、金額與編號。
                </p>
              </div>
              <TextCursorInput className="h-6 w-6 text-brand-600" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {fieldTypes.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold">{field.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{field.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">分享、匯入與匯出</h2>
                <p className="mt-1 text-sm text-slate-500">
                  表單可以透過 LINE、WhatsApp、Email 分享，也可以匯出或匯入資料。
                </p>
              </div>
              <Share2 className="h-6 w-6 text-brand-600" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.title} className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-brand-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold">{option.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{option.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <h2 className="text-xl font-bold">關聯設定明細</h2>
            <p className="mt-1 text-sm text-slate-500">目前選取的表單關聯流程。</p>

            <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-4 border-b border-slate-100 pb-4">
                  <p className="text-xs text-brand-600">DOCLICK.TW Relation</p>
                  <h3 className="mt-1 text-lg font-bold">{selectedRelation.title}</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <Info label="來源表單" value={selectedRelation.from} />
                  <Info label="目標表單" value={selectedRelation.to} />
                  <Info label="狀態" value={selectedRelation.status} />
                  <Info label="動作" value={selectedRelation.action} />
                </div>

                <div className="mt-5 space-y-3">
                  <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-sm">
                    自動帶入資料
                    <input type="checkbox" checked={autoFill} onChange={(event) => setAutoFill(event.target.checked)} />
                  </label>

                  <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-sm">
                    允許拋轉資料
                    <input type="checkbox" checked={autoTransfer} onChange={(event) => setAutoTransfer(event.target.checked)} />
                  </label>
                </div>

                <button className="btn-primary mt-5 w-full justify-center" onClick={() => alert("Demo：已儲存關聯設定。")}>
                  儲存關聯設定
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold">自動帶入範例</h2>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-bold">客戶資料 → 報價單</p>
              <div className="mt-4 space-y-3 text-sm">
                <AutoFillRow from="客戶名稱" to="報價單：客戶姓名" />
                <AutoFillRow from="聯絡電話" to="報價單：電話" />
                <AutoFillRow from="公司地址" to="報價單：地址" />
                <AutoFillRow from="負責業務" to="報價單：業務" />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold">實際使用情境</h2>
            <div className="mt-4 space-y-3">
              <Scenario title="報價轉訂單" text="報價單確認後，一鍵拋轉成訂單，不用重新輸入品項與金額。" />
              <Scenario title="客戶資料帶入" text="選客戶後自動帶出電話、地址、Email 與負責人。" />
              <Scenario title="表單送簽核" text="請購單送出後，自動建立電子簽核流程。" />
              <Scenario title="LINE 分享表單" text="把表單連結傳給客戶填寫，回覆資料自動進系統。" />
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold">建議放在左側選單</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              可以放在「表單設計器」旁邊，或新增一個「表單關聯」入口。
            </p>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-mono text-slate-600">
              href: "/form-relations"
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="card">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        {icon}
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-3">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  );
}

function AutoFillRow({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
      <span className="text-slate-600">{from}</span>
      <ArrowRightLeft className="h-4 w-4 text-brand-600" />
      <span className="font-medium text-slate-800">{to}</span>
    </div>
  );
}

function Scenario({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
