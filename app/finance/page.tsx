"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import {
  ConfigurableModulePage,
  type CustomField,
  type DataRecord
} from "@/components/configurable/ConfigurableModulePage";

const defaultFields: CustomField[] = [
  { key: "financeNo", label: "單號", type: "text", visible: true },
  { key: "subject", label: "項目名稱", type: "text", visible: true },
  { key: "type", label: "類型", type: "select", visible: true, options: ['應收', '應付', '費用', '收入', '發票', '退款'] },
  { key: "customer", label: "對象", type: "text", visible: true },
  { key: "amount", label: "金額", type: "number", visible: true },
  { key: "dueDate", label: "到期日", type: "date", visible: true },
  { key: "payDate", label: "付款／收款日", type: "date", visible: true },
  { key: "method", label: "方式", type: "select", visible: true, options: ['現金', '匯款', '信用卡', '支票', '其他'] },
  { key: "status", label: "狀態", type: "select", visible: true, options: ['待收款', '待付款', '已完成', '逾期', '作廢'] },
  { key: "note", label: "備註", type: "textarea", visible: false }
];

const defaultRecords: DataRecord[] = [{"id": "fin-1", "financeNo": "FIN-001", "subject": "系統導入款", "type": "應收", "customer": "米朵電商", "amount": "128000", "dueDate": "2026-05-20", "payDate": "2026-05-20", "method": "匯款", "status": "待收款", "note": ""}, {"id": "fin-2", "financeNo": "FIN-002", "subject": "雲端主機費", "type": "費用", "customer": "供應商", "amount": "3200", "dueDate": "2026-05-15", "payDate": "2026-05-15", "method": "信用卡", "status": "已完成", "note": ""}];

export default function Page() {
  return (
    <AppLayout title="財務管理">
      <ConfigurableModulePage
        storageKey="bizflow-finance"
        title="財務管理"
        description="管理應收、應付、發票、付款、收款、費用、預算與財務報表。"
        defaultFields={defaultFields}
        defaultRecords={defaultRecords}
        primaryFieldKey="subject"
        addButtonLabel="新增財務資料"
      />
    </AppLayout>
  );
}
