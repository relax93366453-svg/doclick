"use client";

import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  BarChart3,
  Boxes,
  Building2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  UsersRound,
  Workflow
} from "lucide-react";

const quickLinks = [
  {
    title: "產業範本庫",
    description: "套用電商、美容、行政、外勤等產業常用管理表單。",
    href: "/templates",
    icon: Building2
  },
  {
    title: "表單列表",
    description: "查看已建立與已套用的表單，可進入欄位與流程設定。",
    href: "/forms",
    icon: ClipboardList
  },
  {
    title: "表單設計器",
    description: "用藍白後台風格建立表單欄位、子表格與公式欄位。",
    href: "/form-builder/ragic",
    icon: FileText
  },
  {
    title: "進銷存",
    description: "管理商品、庫存、採購、銷售與出入庫流程。",
    href: "/inventory",
    icon: Boxes
  },
  {
    title: "銷售客戶",
    description: "管理客戶資料、聯絡紀錄、報價與訂單。",
    href: "/crm",
    icon: UsersRound
  },
  {
    title: "數據分析",
    description: "查看工時、薪資、表單與營運數據報表。",
    href: "/reports/dashboard",
    icon: BarChart3
  },
  {
    title: "權限設定",
    description: "設定使用者群組、表單瀏覽、新增與修改權限。",
    href: "/permissions/advanced",
    icon: ShieldCheck
  },
  {
    title: "電子簽核",
    description: "請假、請購、費用報支與加班申請線上簽核。",
    href: "/hr/approval/advanced",
    icon: Workflow
  }
];

export default function HomePage() {
  return (
    <AppLayout title="主控台">
      <PageHeader
        title="DOCLICK.TW 多產業管理系統"
        description="維持原本藍白後台風格，集中管理表單、客戶、進銷存、人事、權限、簽核與報表。"
        action={
          <Link href="/templates" className="btn-primary">
            套用產業範本
          </Link>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <div className="card">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <Building2 className="h-5 w-5" />
          </div>
          <p className="text-sm text-slate-500">產業範本</p>
          <p className="mt-2 text-2xl font-bold">6 套</p>
        </div>

        <div className="card">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <ClipboardList className="h-5 w-5" />
          </div>
          <p className="text-sm text-slate-500">表單模組</p>
          <p className="mt-2 text-2xl font-bold">10+</p>
        </div>

        <div className="card">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="text-sm text-slate-500">權限控管</p>
          <p className="mt-2 text-2xl font-bold">進階版</p>
        </div>

        <div className="card">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <p className="text-sm text-slate-500">系統狀態</p>
          <p className="mt-2 text-2xl font-bold">Ready</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">快速入口</h2>
              <p className="mt-1 text-sm text-slate-500">
                保留原本系統風格，功能都整合在左側選單與下方入口。
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:bg-brand-50"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <h2 className="text-xl font-bold">目前流程</h2>
            <div className="mt-5 space-y-3">
              {[
                "從產業範本庫套用表單",
                "到表單列表查看已套用表單",
                "進入表單設計器調整欄位",
                "設定權限與簽核流程",
                "使用報表中心追蹤數據"
              ].map((text, index) => (
                <div key={text} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold">風格設定</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              這版會回到之前的後台版型：左側選單、上方搜尋列、藍白卡片、圓角按鈕。
              Ragic 只當功能參考，不照抄它的畫面。
            </p>
            <Link href="/templates" className="btn-primary mt-5 inline-flex">
              前往產業範本庫
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
