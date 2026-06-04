"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  BellRing,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileCheck2,
  Image as ImageIcon,
  LayoutTemplate,
  LockKeyhole,
  MessageSquareText,
  MonitorSmartphone,
  Send,
  Smartphone,
  TabletSmartphone,
  UserCheck,
  XCircle
} from "lucide-react";
import { useState } from "react";

type RequestStatus = "待簽核" | "已核准" | "已退回";

const mobileRequests = [
  {
    id: "REQ-001",
    type: "請購單",
    applicant: "陳美美",
    title: "門市用品請購",
    amount: "NT$ 12,600",
    status: "待簽核" as RequestStatus,
    description: "補充 A4 紙、清潔用品、收納用品。",
    image: "商品圖片／附件"
  },
  {
    id: "REQ-002",
    type: "請假單",
    applicant: "王小明",
    title: "特休申請",
    amount: "8 小時",
    status: "待簽核" as RequestStatus,
    description: "2026/05/28 特休一天。",
    image: "無附件"
  },
  {
    id: "REQ-003",
    type: "費用報支",
    applicant: "林可欣",
    title: "交通費報支",
    amount: "NT$ 1,280",
    status: "已核准" as RequestStatus,
    description: "拜訪客戶交通費用。",
    image: "發票附件"
  }
];

const features = [
  {
    title: "手機即時簽核",
    description: "主管外出時可直接用手機核准或退回請購單、請假單、費用報支。",
    icon: UserCheck
  },
  {
    title: "APP 查看表單資料",
    description: "可查看客戶、訂單、請購、庫存、人事等表單資料。",
    icon: ClipboardCheck
  },
  {
    title: "圖片展示給客戶",
    description: "商品圖片、施工照片、療程前後照、附件都可以在手機上展示。",
    icon: ImageIcon
  },
  {
    title: "手機版欄位獨立設定",
    description: "電腦版與 APP 版顯示欄位可不同，讓手機畫面更簡潔。",
    icon: LayoutTemplate
  },
  {
    title: "行動權限控管",
    description: "不同角色可看到不同資料，例如業務只能看自己的客戶。",
    icon: LockKeyhole
  },
  {
    title: "即時通知",
    description: "待簽核、派工、表單更新可推播通知主管或負責人。",
    icon: BellRing
  }
];

function statusClass(status: RequestStatus) {
  if (status === "已核准") return "bg-emerald-50 text-emerald-700";
  if (status === "已退回") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

export default function MobileAppAccessPage() {
  const [requests, setRequests] = useState(mobileRequests);
  const [selectedId, setSelectedId] = useState("REQ-001");

  const selected = requests.find((item) => item.id === selectedId) ?? requests[0];

  function updateStatus(status: RequestStatus) {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === selected.id ? { ...item, status } : item
      )
    );
  }

  return (
    <AppLayout title="行動裝置 APP 存取">
      <PageHeader
        title="行動裝置 APP 存取"
        description="主管外出也能用手機查看表單、核准請購與請假，也能展示商品圖片或附件給客戶參考。"
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/hr/approval/advanced" className="btn-secondary">
              <FileCheck2 className="mr-2 h-4 w-4" />
              簽核流程
            </Link>
            <Link href="/permissions/advanced" className="btn-primary">
              <LockKeyhole className="mr-2 h-4 w-4" />
              權限設定
            </Link>
          </div>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="待手機簽核" value={`${requests.filter((item) => item.status === "待簽核").length} 筆`} icon={<Smartphone className="h-5 w-5" />} />
        <Stat label="可行動查看表單" value="28 張" icon={<Eye className="h-5 w-5" />} />
        <Stat label="今日推播通知" value="12 則" icon={<BellRing className="h-5 w-5" />} />
        <Stat label="APP 權限群組" value="5 組" icon={<LockKeyhole className="h-5 w-5" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="space-y-5">
          <div className="card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">行動功能總覽</h2>
                <p className="mt-1 text-sm text-slate-500">
                  保留 DOCLICK.TW 原本藍白後台風格，只取 APP 存取與手機簽核功能架構。
                </p>
              </div>
              <MonitorSmartphone className="h-6 w-6 text-brand-600" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">電腦版與 APP 版顯示設定</h2>
                <p className="mt-1 text-sm text-slate-500">
                  同一張表單可以設定不同顯示欄位，手機只顯示必要資訊。
                </p>
              </div>
              <TabletSmartphone className="h-6 w-6 text-brand-600" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">表單</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">電腦版顯示</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">APP 版顯示</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">手機操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b border-slate-100 px-4 py-3 font-medium">請購單</td>
                    <td className="border-b border-slate-100 px-4 py-3">完整欄位、採購明細、簽核紀錄</td>
                    <td className="border-b border-slate-100 px-4 py-3">申請人、金額、附件、狀態</td>
                    <td className="border-b border-slate-100 px-4 py-3">核准／退回</td>
                  </tr>
                  <tr>
                    <td className="border-b border-slate-100 px-4 py-3 font-medium">商品資料</td>
                    <td className="border-b border-slate-100 px-4 py-3">成本、庫存、供應商、價格</td>
                    <td className="border-b border-slate-100 px-4 py-3">商品名稱、圖片、售價、規格</td>
                    <td className="border-b border-slate-100 px-4 py-3">展示給客戶</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">外勤回報</td>
                    <td className="px-4 py-3">完整紀錄、GPS、附件、客戶簽名</td>
                    <td className="px-4 py-3">定位、拍照、簽名、送出</td>
                    <td className="px-4 py-3">填寫／上傳</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold">待簽核清單</h2>
            <p className="mt-1 text-sm text-slate-500">這些資料可在手機 APP 上直接核准或退回。</p>

            <div className="mt-5 space-y-3">
              {requests.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    selectedId === item.id ? "border-brand-300 bg-brand-50" : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{item.title}</h3>
                      <span className={`rounded-full px-2 py-1 text-xs ${statusClass(item.status)}`}>{item.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{item.type}｜{item.applicant}｜{item.amount}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <h2 className="text-xl font-bold">手機 APP 預覽</h2>
            <p className="mt-1 text-sm text-slate-500">模擬主管手機上看到的請購單與簽核按鈕。</p>

            <div className="mt-5 rounded-[2rem] border-8 border-slate-900 bg-slate-100 p-4 shadow-lg">
              <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-slate-400" />

              <div className="rounded-2xl bg-white p-4">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-xs text-brand-600">DOCLICK.TW APP</p>
                    <h3 className="mt-1 font-bold">{selected.type}</h3>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs ${statusClass(selected.status)}`}>{selected.status}</span>
                </div>

                <div className="space-y-3 text-sm">
                  <MobileRow label="單號" value={selected.id} />
                  <MobileRow label="申請人" value={selected.applicant} />
                  <MobileRow label="主旨" value={selected.title} />
                  <MobileRow label="金額／時數" value={selected.amount} />
                  <MobileRow label="內容" value={selected.description} />
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <ImageIcon className="h-4 w-4 text-brand-600" />
                    圖片／附件預覽
                  </div>
                  <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">
                    {selected.image}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="rounded-xl bg-red-50 px-3 py-3 text-sm font-bold text-red-600" onClick={() => updateStatus("已退回")}>
                    <XCircle className="mr-1 inline h-4 w-4" />
                    退回
                  </button>
                  <button className="rounded-xl bg-brand-600 px-3 py-3 text-sm font-bold text-white" onClick={() => updateStatus("已核准")}>
                    <CheckCircle2 className="mr-1 inline h-4 w-4" />
                    核准
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold">通知與權限</h2>
            <div className="mt-4 space-y-3">
              <ActionCard icon={<BellRing className="h-4 w-4" />} title="推播通知" text="有待簽核時通知主管手機。" />
              <ActionCard icon={<MessageSquareText className="h-4 w-4" />} title="留言與退回原因" text="退回時可填寫補件原因。" />
              <ActionCard icon={<LockKeyhole className="h-4 w-4" />} title="角色權限" text="主管、業務、外勤、人資顯示不同資料。" />
              <ActionCard icon={<Send className="h-4 w-4" />} title="送出同步" text="手機填寫後同步到電腦後台。" />
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold">建議放在左側選單</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              可以把「員工自助 App」或新增「行動 APP」連到這頁：
            </p>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-mono text-slate-600">
              href: "/mobile-app"
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

function MobileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-2">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  );
}

function ActionCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        {icon}
      </div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{text}</p>
      </div>
    </div>
  );
}
