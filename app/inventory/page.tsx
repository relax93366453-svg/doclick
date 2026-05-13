"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import {
  ConfigurableModulePage,
  type CustomField,
  type DataRecord
} from "@/components/configurable/ConfigurableModulePage";

const defaultFields: CustomField[] = [
  { key: "sku", label: "SKU", type: "text", visible: true },
  { key: "name", label: "商品名稱", type: "text", visible: true },
  { key: "category", label: "商品分類", type: "select", visible: true, options: ['保養品', '耗材', '設備', '包材', '其他'] },
  { key: "stock", label: "庫存", type: "number", visible: true },
  { key: "safeStock", label: "安全庫存", type: "number", visible: true },
  { key: "cost", label: "成本", type: "number", visible: true },
  { key: "price", label: "售價", type: "number", visible: true },
  { key: "supplier", label: "供應商", type: "text", visible: true },
  { key: "status", label: "狀態", type: "select", visible: true, options: ['正常', '低庫存', '停用'] },
  { key: "note", label: "備註", type: "textarea", visible: false }
];

const defaultRecords: DataRecord[] = [{"id": "inv-1", "sku": "SKU-A01", "name": "精華液 A01", "category": "保養品", "stock": "128", "safeStock": "30", "cost": "380", "price": "1280", "supplier": "米朵供應", "status": "正常", "note": "熱銷商品"}, {"id": "inv-2", "sku": "SKU-B02", "name": "面膜 B02", "category": "保養品", "stock": "18", "safeStock": "50", "cost": "45", "price": "199", "supplier": "日日美材", "status": "低庫存", "note": "需補貨"}, {"id": "inv-3", "sku": "SKU-C03", "name": "包材 C03", "category": "包材", "stock": "400", "safeStock": "100", "cost": "8", "price": "15", "supplier": "晨光包材", "status": "正常", "note": ""}];

export default function Page() {
  return (
    <AppLayout title="進銷存">
      <ConfigurableModulePage
        storageKey="bizflow-inventory"
        title="進銷存"
        description="管理商品、SKU、庫存、安全庫存、進貨、銷貨與庫存狀態。"
        defaultFields={defaultFields}
        defaultRecords={defaultRecords}
        primaryFieldKey="name"
        addButtonLabel="新增商品"
      />
    </AppLayout>
  );
}
