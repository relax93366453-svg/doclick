# 專案架構說明

此專案採用「模組化 + 低代碼表單 + 權限 + 流程引擎」的架構。

## 核心層

- `lib/modules.ts`：後台模組定義
- `lib/templates.ts`：產業範本庫
- `lib/permissions.ts`：RBAC 權限
- `lib/workflow.ts`：流程與邏輯引擎
- `components/forms/*`：表單設計與動態渲染

## 商業層

- Landing Page
- SaaS 方案設計
- Demo 帳號
- README 部署教學

## 資料層

- Prisma schema 已建立 workspace 多租戶基本架構
- 所有核心資料都預留 workspaceId
- 所有核心資料都預留 createdById / updatedById / deletedAt
