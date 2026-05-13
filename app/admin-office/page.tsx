"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import {
  ConfigurableModulePage,
  type CustomField,
  type DataRecord
} from "@/components/configurable/ConfigurableModulePage";

const defaultFields: CustomField[] = [
  { key: "requestNo", label: "申請單號", type: "text", visible: true },
  { key: "subject", label: "申請主旨", type: "text", visible: true },
  { key: "type", label: "申請類型", type: "select", visible: true, options: ['採購', '用印', '文件', '會議室', '資產', '請假', '其他'] },
  { key: "applicant", label: "申請人", type: "text", visible: true },
  { key: "department", label: "部門", type: "text", visible: true },
  { key: "amount", label: "金額", type: "number", visible: true },
  { key: "applyDate", label: "申請日期", type: "date", visible: true },
  { key: "status", label: "狀態", type: "select", visible: true, options: ['草稿', '待審核', '已核准', '退回', '完成'] },
  { key: "approver", label: "審核人", type: "text", visible: true },
  { key: "note", label: "備註", type: "textarea", visible: false }
];

const defaultRecords: DataRecord[] = [{"id": "adm-1", "requestNo": "ADM-001", "subject": "辦公用品採購", "type": "採購", "applicant": "行政 A", "department": "行政部", "amount": "3500", "applyDate": "2026-05-12", "status": "待審核", "approver": "主管 A", "note": ""}, {"id": "adm-2", "requestNo": "ADM-002", "subject": "合約用印", "type": "用印", "applicant": "業務 A", "department": "業務部", "amount": "0", "applyDate": "2026-05-13", "status": "已核准", "approver": "主管 B", "note": ""}];

export default function Page() {
  return (
    <AppLayout title="行政管理">
      <ConfigurableModulePage
        storageKey="bizflow-admin-office"
        title="行政管理"
        description="管理公告、文件、採購、用印、會議室、人事請假、資產與費用申請。"
        defaultFields={defaultFields}
        defaultRecords={defaultRecords}
        primaryFieldKey="subject"
        addButtonLabel="新增行政申請"
      />
    </AppLayout>
  );
}
