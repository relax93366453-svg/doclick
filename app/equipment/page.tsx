"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import {
  ConfigurableModulePage,
  type CustomField,
  type DataRecord
} from "@/components/configurable/ConfigurableModulePage";

const defaultFields: CustomField[] = [
  { key: "code", label: "設備編號", type: "text", visible: true },
  { key: "name", label: "設備名稱", type: "text", visible: true },
  { key: "location", label: "位置", type: "text", visible: true },
  { key: "category", label: "類型", type: "select", visible: true, options: ['生產設備', '辦公設備', '美容設備', '外勤設備', '其他'] },
  { key: "owner", label: "負責人", type: "text", visible: true },
  { key: "lastMaintain", label: "上次保養", type: "date", visible: true },
  { key: "nextMaintain", label: "下次保養", type: "date", visible: true },
  { key: "status", label: "狀態", type: "select", visible: true, options: ['正常', '需保養', '維修中', '停用'] },
  { key: "vendor", label: "維修廠商", type: "text", visible: true },
  { key: "note", label: "備註", type: "textarea", visible: false }
];

const defaultRecords: DataRecord[] = [{"id": "eq-1", "code": "EQ-001", "name": "封膜機", "location": "一廠 A 區", "category": "生產設備", "owner": "設備 A", "lastMaintain": "2026-04-20", "nextMaintain": "2026-06-20", "status": "正常", "vendor": "大安機械", "note": ""}, {"id": "eq-2", "code": "EQ-002", "name": "美容儀器", "location": "林口店", "category": "美容設備", "owner": "店長", "lastMaintain": "2026-04-01", "nextMaintain": "2026-05-30", "status": "需保養", "vendor": "美材維修", "note": "需檢查電源"}];

export default function Page() {
  return (
    <AppLayout title="設備管理">
      <ConfigurableModulePage
        storageKey="bizflow-equipment"
        title="設備管理"
        description="管理設備清單、保養週期、維修紀錄、異常原因與負責人。"
        defaultFields={defaultFields}
        defaultRecords={defaultRecords}
        primaryFieldKey="name"
        addButtonLabel="新增設備"
      />
    </AppLayout>
  );
}
