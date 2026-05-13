import {
  BarChart3,
  Boxes,
  Building2,
  ClipboardList,
  Factory,
  FileText,
  HandCoins,
  Home,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserRoundCog,
  UsersRound,
  Wrench
} from "lucide-react";

export const modules = [
  { key: "home", label: "銷售首頁", href: "/", icon: Home },
  { key: "dashboard", label: "主控台", href: "/dashboard", icon: LayoutDashboard },
  { key: "templates", label: "產業範本庫", href: "/templates", icon: Building2 },
  { key: "forms", label: "表單列表", href: "/forms", icon: ClipboardList },
  { key: "form-builder", label: "表單設計器", href: "/form-builder", icon: FileText },
  { key: "inventory", label: "進銷存", href: "/inventory", icon: Boxes },
  { key: "crm", label: "銷售客戶", href: "/crm", icon: UsersRound },
  { key: "production", label: "生產管理", href: "/production", icon: Factory },
  { key: "equipment", label: "設備管理", href: "/equipment", icon: Wrench },
  { key: "hr", label: "人事管理", href: "/hr", icon: UserRoundCog },
  { key: "admin-office", label: "行政管理", href: "/admin-office", icon: ClipboardList },
  { key: "finance", label: "財務管理", href: "/finance", icon: HandCoins },
  { key: "projects", label: "專案任務", href: "/projects", icon: BarChart3 },
  { key: "permissions", label: "權限設定", href: "/permissions", icon: ShieldCheck },
  { key: "settings", label: "系統設定", href: "/settings", icon: Settings }
] as const;

export type ModuleKey = typeof modules[number]["key"];
