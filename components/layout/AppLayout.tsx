"use client";

import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Bell, Home, Search } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";

type AppLayoutProps = {
  children: ReactNode;
  title?: string;
};

function SidebarFallback() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-72 border-r border-slate-200 bg-white p-4">
      <div className="mb-5 rounded-2xl bg-brand-600 p-4 text-white">
        <p className="text-xs opacity-80">BizFlow</p>
        <h1 className="text-lg font-bold">多產業管理系統</h1>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="h-9 rounded-xl bg-slate-100" />
        ))}
      </div>
    </aside>
  );
}

export function AppLayout({ children, title = "主控台" }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Suspense fallback={<SidebarFallback />}>
        <Sidebar />
      </Suspense>

      <main className="min-h-screen pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-6">
            <div>
              <p className="text-xs text-slate-400">目前位置</p>
              <h2 className="font-bold">{title}</h2>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/" className="btn-secondary">
                <Home className="mr-2 h-4 w-4" />
                回首頁
              </Link>

              <div className="hidden min-w-72 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400 md:flex">
                <Search className="h-4 w-4" />
                搜尋客戶、訂單、表單...
              </div>

              <button className="rounded-2xl border border-slate-200 bg-white p-2">
                <Bell className="h-4 w-4" />
              </button>

              <div className="h-9 w-9 rounded-full bg-brand-50" />
            </div>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export default AppLayout;
