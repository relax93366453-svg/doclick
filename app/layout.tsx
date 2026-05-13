import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BizFlow 多產業企業管理系統",
  description: "進銷存、CRM、人事、財務、自訂表單與自動化流程的多產業 SaaS 模板"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
