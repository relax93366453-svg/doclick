"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Boxes,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Factory,
  FileCheck2,
  FileText,
  HandCoins,
  Home,
  LayoutDashboard,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  UserRoundCog,
  UsersRound,
  WalletCards,
  Wrench,
  Settings
} from "lucide-react";

const mainItems = [
  { key: "home", label: "銷售首頁", href: "/", icon: Home },
  { key: "dashboard", label: "主控台", href: "/dashboard", icon: LayoutDashboard },
  { key: "templates", label: "產業範本庫", href: "/templates", icon: Building2 },
  { key: "forms", label: "表單列表", href: "/forms", icon: ClipboardList },
  { key: "form-builder", label: "表單設計器", href: "/form-builder", icon: FileText },
  { key: "inventory", label: "進銷存", href: "/inventory", icon: Boxes },
  { key: "crm", label: "銷售客戶", href: "/crm", icon: UsersRound },
  { key: "production", label: "生產管理", href: "/production", icon: Factory },
  { key: "equipment", label: "設備管理", href: "/equipment", icon: Wrench },
];

const hrChildren = [
  { key: "overview", label: "人事總覽", href: "/hr", icon: LayoutDashboard },
  { key: "people", label: "人員資料", href: "/hr?tab=people", icon: UsersRound },
  { key: "onboarding", label: "到離職管理", href: "/hr/onboarding", icon: RefreshCcw },
  { key: "attendance", label: "考勤打卡", href: "/hr?tab=attendance", icon: ClipboardCheck },
  { key: "schedule", label: "智慧排班", href: "/hr/schedule", icon: CalendarDays },
  { key: "approval", label: "電子簽核", href: "/hr?tab=approval", icon: FileCheck2 },
  { key: "payroll", label: "薪資稅務", href: "/hr?tab=payroll", icon: WalletCards },
  { key: "reports", label: "數據報表", href: "/hr?tab=reports", icon: BarChart3 },
  { key: "security", label: "資安法規", href: "/hr?tab=security", icon: ShieldCheck },
  { key: "mobile", label: "員工自助 App", href: "/hr?tab=mobile", icon: Smartphone },
];

const bottomItems = [
  { key: "admin-office", label: "行政管理", href: "/admin-office", icon: ClipboardList },
  { key: "finance", label: "財務管理", href: "/finance", icon: HandCoins },
  { key: "projects", label: "專案任務", href: "/projects", icon: BarChart3 },
  { key: "permissions", label: "權限設定", href: "/permissions", icon: ShieldCheck },
  { key: "settings", label: "系統設定", href: "/settings", icon: Settings },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab =
    pathname === "/hr/onboarding" ? "onboarding" :
    pathname === "/hr/schedule" ? "schedule" :
    searchParams.get("tab") ?? "overview";

  const [hrOpen, setHrOpen] = useState(pathname.startsWith("/hr"));

  useEffect(() => {
    if (pathname.startsWith("/hr")) setHrOpen(true);
  }, [pathname]);

  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-72 overflow-y-auto border-r border-slate-200 bg-white p-4">
      <Link href="/" className="mb-5 block rounded-2xl bg-brand-600 p-4 text-white hover:bg-brand-700">
        <p className="text-xs opacity-80">BizFlow</p>
        <h1 className="text-lg font-bold">多產業管理系統</h1>
        <div className="mt-3 flex items-center gap-2 text-xs opacity-90">
          <Home className="h-3.5 w-3.5" />
          點我回銷售首頁
        </div>
      </Link>

      <nav className="space-y-1">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cx("flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition", active ? "bg-slate-100 font-semibold text-slate-950" : "text-slate-700 hover:bg-slate-100")}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-1">
          <button
            type="button"
            onClick={() => setHrOpen((prev) => !prev)}
            className={cx("flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition", pathname.startsWith("/hr") ? "bg-slate-100 font-semibold text-slate-950" : "text-slate-700 hover:bg-slate-100")}
          >
            <span className="flex items-center gap-3">
              <UserRoundCog className="h-4 w-4" />
              人事管理
            </span>
            <ChevronDown className={cx("h-4 w-4 transition", hrOpen && "rotate-180")} />
          </button>

          {hrOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 pl-3">
              {hrChildren.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.key;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cx("flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition", active ? "bg-brand-50 font-semibold text-brand-700" : "text-slate-600 hover:bg-slate-100")}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {bottomItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cx("flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition", active ? "bg-slate-100 font-semibold text-slate-950" : "text-slate-700 hover:bg-slate-100")}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
