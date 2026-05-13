export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "money"
  | "date"
  | "datetime"
  | "select"
  | "multiSelect"
  | "switch"
  | "rating"
  | "email"
  | "phone"
  | "address"
  | "gps"
  | "signature"
  | "image"
  | "file"
  | "relation"
  | "subtable"
  | "barcode"
  | "calculation"
  | "autoNumber"
  | "user"
  | "department"
  | "formula";

export type FormFieldConfig = {
  id: string;
  type: FieldType;
  label: string;
  key: string;
  required?: boolean;
  options?: string[];
};

export const fieldPalette: { type: FieldType; label: string; description: string }[] = [
  { type: "text", label: "單行文字", description: "姓名、標題、簡短內容" },
  { type: "number", label: "數字", description: "數量、工時、分數" },
  { type: "money", label: "金額", description: "報價、費用、收款" },
  { type: "date", label: "日期", description: "預約日、到期日" },
  { type: "select", label: "下拉選單", description: "狀態、分類、等級" },
  { type: "gps", label: "GPS 定位", description: "外勤打卡、現場回報" },
  { type: "signature", label: "手寫簽名", description: "客戶確認、簽核" },
  { type: "image", label: "圖片上傳", description: "施工照、商品圖、證明照" },
  { type: "file", label: "附件上傳", description: "合約、發票、文件" },
  { type: "relation", label: "關聯資料", description: "關聯客戶、商品、員工" }
];
