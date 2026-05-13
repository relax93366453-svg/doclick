"use client";

import { Bell, Home, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Topbar({ title }: { title: string }) {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  function doSearch() {
    if (!keyword.trim()) {
      router.push("/forms");
      return;
    }

    router.push(`/forms?keyword=${encodeURIComponent(keyword.trim())}`);
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur">
      <div>
        <p className="text-xs text-slate-500">目前位置</p>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/" className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 md:flex">
          <Home className="h-4 w-4" />
          回首頁
        </Link>

        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") doSearch();
            }}
            className="w-56 text-sm outline-none"
            placeholder="搜尋客戶、訂單、表單..."
          />
          <button className="text-xs font-medium text-brand-700" onClick={doSearch}>
            搜尋
          </button>
        </div>

        <button
          className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
          onClick={() => router.push("/forms")}
          title="前往待辦與表單列表"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          className="h-9 w-9 rounded-full bg-brand-100"
          onClick={() => router.push("/settings")}
          title="前往系統設定"
        />
      </div>
    </header>
  );
}
