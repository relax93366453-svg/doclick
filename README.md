# BizFlow 多產業企業管理系統模板

這是一套可作為 GitHub Template 販售或二次開發的「多產業企業管理 SaaS」起始專案。  
它的定位不是單純 CRM、ERP 或表單工具，而是結合：

- 進銷存
- CRM 銷售客戶
- 生產管理
- 設備管理
- 人事管理
- 行政管理
- 財務管理
- 專案任務
- 拖曳式表單設計器
- 動態表單填寫
- RBAC 權限控管
- 產業範本庫
- 工作流程與邏輯引擎
- Dashboard 與報表

## 技術棧

- Next.js 14 App Router
- React + TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth / Auth.js 架構預留
- Recharts
- DnD Kit
- Zod
- React Hook Form

## 安裝

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

開啟：

```bash
http://localhost:3000
```

## 測試帳號

| 角色 | Email | 密碼 |
|---|---|---|
| Owner | owner@demo.com | password123 |
| Admin | admin@demo.com | password123 |
| Manager | manager@demo.com | password123 |
| Staff | staff@demo.com | password123 |
| Field Staff | field@demo.com | password123 |
| Finance | finance@demo.com | password123 |
| HR | hr@demo.com | password123 |

## 專案目錄

```txt
app/
  page.tsx                  銷售頁 Landing Page
  dashboard/page.tsx         主控台
  templates/page.tsx         產業範本庫
  form-builder/page.tsx      拖曳式表單設計器
  forms/page.tsx             表單列表
  inventory/page.tsx         進銷存
  crm/page.tsx               CRM
  hr/page.tsx                人事管理
  finance/page.tsx           財務管理
components/
  layout/                    後台 layout
  dashboard/                 圖表與 KPI 元件
  forms/                     表單設計器與動態表單
  ui/                        共用 UI
lib/
  permissions.ts             RBAC 權限
  workflow.ts                工作流程引擎
  modules.ts                 模組設定
  templates.ts               產業範本資料
  mock-data.ts               demo 資料
prisma/
  schema.prisma              資料庫 schema
  seed.ts                    測試資料
```

## 如何新增產業範本

編輯：

```txt
lib/templates.ts
```

新增 industry object：

```ts
{
  id: "beauty",
  name: "美容業範本",
  description: "顧客、療程、預約、產品銷售與會員儲值",
  modules: [...]
}
```

## 如何新增表單欄位

編輯：

```txt
components/forms/field-definitions.ts
```

新增欄位型別，例如：

```ts
{
  type: "signature",
  label: "手寫簽名",
  icon: "PenLine"
}
```

然後在：

```txt
components/forms/DynamicFormRenderer.tsx
```

加入對應 renderer。

## 如何設定權限

編輯：

```txt
lib/permissions.ts
```

目前支援：

- canViewModule
- canCreateRecord
- canEditRecord
- canDeleteRecord
- canApproveRecord
- canExportData
- canViewField
- filterDataByScope

## SaaS 收費方案建議

| 方案 | 適合對象 | 限制 |
|---|---|---|
| Free | 個人測試 | 3 位使用者、3 個表單 |
| Starter | 小型團隊 | 10 位使用者、20 個表單 |
| Pro | 成長型公司 | 50 位使用者、完整模組 |
| Business | 多部門企業 | 高階權限、Webhook、API |
| Enterprise | 大型企業 | SSO、客製部署、專人導入 |

## 部署到 Vercel

1. 將此專案上傳到 GitHub。
2. 到 Vercel 匯入 GitHub Repository。
3. 設定環境變數。
4. 使用 Neon / Supabase / Railway 建立 PostgreSQL。
5. 執行 `npm run db:push` 與 `npm run db:seed`。
6. 完成部署。

## 後續開發路線圖

- 串接真正登入與組織邀請
- 完整 CRUD API 與資料庫串接
- 表單回覆資料儲存到 FormResponse
- 審核流程視覺化
- Webhook 與 Email 通知
- Stripe 付費升級
- 多語系
- 行動版外勤 APP


## V2 Demo 按鈕功能

此版本已補上可操作 demo：新增商品、客戶、員工、收支、匯入/匯出提示、表單儲存、表單送出、GPS/簽名 demo、套用範本、Topbar 搜尋/通知/頭像、其他模組新增/刪除資料。

注意：目前是前端本機 demo 狀態。正式版可把這些動作接到 Prisma + PostgreSQL。
