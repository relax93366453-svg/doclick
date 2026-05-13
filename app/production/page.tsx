"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import {
  ConfigurableModulePage,
  type CustomField,
  type DataRecord
} from "@/components/configurable/ConfigurableModulePage";

const defaultFields: CustomField[] = [
  { key: "orderNo", label: "生產單號", type: "text", visible: true },
  { key: "product", label: "產品名稱", type: "text", visible: true },
  { key: "quantity", label: "數量", type: "number", visible: true },
  { key: "startDate", label: "開始日期", type: "date", visible: true },
  { key: "dueDate", label: "預計完工日", type: "date", visible: true },
  { key: "line", label: "產線", type: "text", visible: true },
  { key: "owner", label: "負責人", type: "text", visible: true },
  { key: "status", label: "狀態", type: "select", visible: true, options: ['待排程', '生產中', '品檢中', '已完成', '異常'] },
  { key: "defectRate", label: "不良率", type: "text", visible: true },
  { key: "note", label: "備註", type: "textarea", visible: false }
];

const defaultRecords: DataRecord[] = [{"id": "pro-1", "orderNo": "MO-202605-001", "product": "精華液 A01", "quantity": "500", "startDate": "2026-05-12", "dueDate": "2026-05-18", "line": "A 線", "owner": "生產 A", "status": "生產中", "defectRate": "1.2%", "note": ""}, {"id": "pro-2", "orderNo": "MO-202605-002", "product": "面膜 B02", "quantity": "1000", "startDate": "2026-05-13", "dueDate": "2026-05-20", "line": "B 線", "owner": "生產 B", "status": "待排程", "defectRate": "0%", "note": ""}];

export default function Page() {
  return (
    <AppLayout title="生產管理">
      <ConfigurableModulePage
        storageKey="bizflow-production"
        title="生產管理"
        description="管理生產訂單、物料需求、工單、品檢、良率與異常回報。"
        defaultFields={defaultFields}
        defaultRecords={defaultRecords}
        primaryFieldKey="orderNo"
        addButtonLabel="新增工單"
      />
    </AppLayout>
  );
}
