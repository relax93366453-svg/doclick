import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DOCLICK.TW",
  description: "多產業管理系統",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
