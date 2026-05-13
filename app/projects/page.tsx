"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import {
  ConfigurableModulePage,
  type CustomField,
  type DataRecord
} from "@/components/configurable/ConfigurableModulePage";

const defaultFields: CustomField[] = [
  { key: "projectNo", label: "專案編號", type: "text", visible: true },
  { key: "project", label: "專案名稱", type: "text", visible: true },
  { key: "task", label: "任務名稱", type: "text", visible: true },
  { key: "owner", label: "負責人", type: "text", visible: true },
  { key: "priority", label: "優先級", type: "select", visible: true, options: ['低', '中', '高', '緊急'] },
  { key: "startDate", label: "開始日", type: "date", visible: true },
  { key: "dueDate", label: "截止日", type: "date", visible: true },
  { key: "progress", label: "進度", type: "text", visible: true },
  { key: "status", label: "狀態", type: "select", visible: true, options: ['未開始', '進行中', '待確認', '已完成', '延遲'] },
  { key: "note", label: "備註", type: "textarea", visible: false }
];

const defaultRecords: DataRecord[] = [{"id": "pj-1", "projectNo": "PJ-001", "project": "BizFlow 導入", "task": "完成進銷存欄位設定", "owner": "Alisha", "priority": "高", "startDate": "2026-05-12", "dueDate": "2026-05-18", "progress": "70%", "status": "進行中", "note": ""}, {"id": "pj-2", "projectNo": "PJ-002", "project": "人事模組", "task": "月排班功能測試", "owner": "開發 A", "priority": "緊急", "startDate": "2026-05-12", "dueDate": "2026-05-15", "progress": "50%", "status": "待確認", "note": ""}];

export default function Page() {
  return (
    <AppLayout title="專案任務">
      <ConfigurableModulePage
        storageKey="bizflow-projects"
        title="專案任務"
        description="管理專案、任務、負責人、期限、進度、優先級與交付狀態。"
        defaultFields={defaultFields}
        defaultRecords={defaultRecords}
        primaryFieldKey="task"
        addButtonLabel="新增任務"
      />
    </AppLayout>
  );
}
