"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import {
  ConfigurableModulePage,
  type CustomField,
  type DataRecord
} from "@/components/configurable/ConfigurableModulePage";

const defaultFields: CustomField[] = [
  { key: "name", label: "客戶名稱", type: "text", visible: true },
  { key: "contact", label: "聯絡人", type: "text", visible: true },
  { key: "phone", label: "電話", type: "text", visible: true },
  { key: "source", label: "來源", type: "select", visible: true, options: ['官網', 'IG', 'LINE', '轉介紹', '展會', '其他'] },
  { key: "stage", label: "銷售階段", type: "select", visible: true, options: ['新客', '需求確認', '報價中', '成交', '流失'] },
  { key: "owner", label: "負責人", type: "text", visible: true },
  { key: "lastContact", label: "最後聯繫日", type: "date", visible: true },
  { key: "nextFollow", label: "下次跟進", type: "date", visible: true },
  { key: "amount", label: "預估金額", type: "number", visible: true },
  { key: "note", label: "備註", type: "textarea", visible: false }
];

const defaultRecords: DataRecord[] = [{"id": "crm-1", "name": "米朵電商", "contact": "Alisha", "phone": "0912-111-222", "source": "LINE", "stage": "報價中", "owner": "業務 A", "lastContact": "2026-05-12", "nextFollow": "2026-05-18", "amount": "128000", "note": "關心進銷存與表單功能"}, {"id": "crm-2", "name": "日日寵物店", "contact": "店長", "phone": "0912-222-333", "source": "IG", "stage": "需求確認", "owner": "業務 B", "lastContact": "2026-05-10", "nextFollow": "2026-05-20", "amount": "68000", "note": "想套用寵物店範本"}, {"id": "crm-3", "name": "晨光製造", "contact": "採購", "phone": "0912-333-444", "source": "官網", "stage": "成交", "owner": "業務 A", "lastContact": "2026-05-08", "nextFollow": "2026-06-01", "amount": "156000", "note": ""}];

export default function Page() {
  return (
    <AppLayout title="銷售客戶">
      <ConfigurableModulePage
        storageKey="bizflow-crm"
        title="銷售客戶"
        description="管理客戶資料、來源、階段、負責人、跟進紀錄與成交狀態。"
        defaultFields={defaultFields}
        defaultRecords={defaultRecords}
        primaryFieldKey="name"
        addButtonLabel="新增客戶"
      />
    </AppLayout>
  );
}
