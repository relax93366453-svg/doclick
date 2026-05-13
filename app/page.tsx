import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const features = [
    "進銷存",
    "CRM 客戶管理",
    "人事管理",
    "財務管理",
    "拖曳式表單",
    "權限控管",
    "自動化流程",
    "即時儀表板",
  ];

  const templates = [
    "電商公司範本",
    "寵物店範本",
    "美容業範本",
    "製造業範本",
    "行政辦公室範本",
    "外勤服務範本",
  ];

  return (
    <main className="bg-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/qieyiju-logo.jpg"
            alt="愜易居 Logo"
            width={56}
            height={56}
            className="h-12 w-12 rounded-2xl object-cover shadow-sm"
            priority
          />
          <div>
            <p className="text-xs font-medium text-brand-600">找我們公司購買</p>
            <h1 className="text-2xl font-bold tracking-wide text-slate-900">愜易居</h1>
          </div>
        </Link>

        <div className="hidden gap-3 md:flex">
          <Link href="/templates" className="btn-secondary">
            查看範本
          </Link>
          <Link href="/dashboard" className="btn-primary">
            免費試用
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-104px)] max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
            多產業低代碼企業管理系統
          </p>

          <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            一套系統，建立你公司專屬的管理流程
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            從進銷存、CRM、人事、財務到自訂表單與自動化流程，快速套用各產業範本，讓企業管理不再靠 Excel。
          </p>

          <div className="mt-8 flex gap-3">
            <Link href="/dashboard" className="btn-primary">
              免費試用 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link href="/templates" className="btn-secondary">
              查看範本
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-xl">
          <div className="grid gap-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"
              >
                <CheckCircle2 className="h-5 w-5 text-brand-600" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold">產業範本庫</h2>
          <p className="mt-2 text-slate-600">
            不用從零開始，直接套用各行各業常用管理流程。
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {templates.map((item) => (
              <div key={item} className="card">
                <h3 className="font-semibold">{item}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  可快速建立表單、欄位、流程、權限與儀表板。
                </p>
                <Link href="/templates" className="btn-secondary mt-4 w-full">
                  查看範本
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
