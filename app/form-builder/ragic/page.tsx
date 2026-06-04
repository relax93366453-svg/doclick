"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Calculator,
  Copy,
  Database,
  FileText,
  Link2,
  Plus,
  Save,
  Settings2,
  Table2
} from "lucide-react";
import { useMemo, useState } from "react";

type CellType = "標題" | "自由輸入" | "從其它表單選擇" | "日期" | "金額" | "電話" | "地址" | "公式" | "多選" | "空白";

type CanvasCell = {
  id: string;
  row: number;
  col: string;
  label: string;
  value: string;
  type: CellType;
  required?: boolean;
  formula?: string;
  colSpan?: number;
};

const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
const rows = Array.from({ length: 18 }, (_, index) => index + 1);

const defaultCells: CanvasCell[] = [
  { id: "title", row: 4, col: "C", label: "報價單", value: "報價單", type: "標題", colSpan: 4 },
  { id: "customer-name", row: 5, col: "A", label: "客戶名稱", value: "從其它表單選擇", type: "從其它表單選擇" },
  { id: "quote-code-label", row: 5, col: "D", label: "統一編號", value: "自由輸入", type: "自由輸入" },
  { id: "payment-method", row: 5, col: "G", label: "付款方式", value: "從選單選擇", type: "從其它表單選擇" },
  { id: "contact-code", row: 6, col: "A", label: "聯絡人編號", value: "從其它表單選擇", type: "從其它表單選擇" },
  { id: "payment-terms", row: 6, col: "D", label: "付款條件", value: "從選單選擇", type: "從其它表單選擇" },
  { id: "close-date", row: 6, col: "G", label: "結帳日", value: "日期", type: "日期" },
  { id: "contact-person", row: 7, col: "A", label: "聯絡人", value: "自由輸入", type: "自由輸入" },
  { id: "department", row: 7, col: "D", label: "部門", value: "自由輸入", type: "自由輸入" },
  { id: "transport", row: 7, col: "G", label: "運輸條件", value: "從選單選擇", type: "從其它表單選擇" },
  { id: "email", row: 8, col: "A", label: "E-mail", value: "電子郵件信箱", type: "自由輸入" },
  { id: "phone", row: 8, col: "D", label: "電話", value: "XX-XXXX-XXXX", type: "電話" },
  { id: "branch", row: 8, col: "G", label: "分機", value: "自由輸入", type: "自由輸入" },
  { id: "address", row: 9, col: "A", label: "客戶地址", value: "地址", type: "地址" },
  { id: "mobile", row: 9, col: "D", label: "行動電話", value: "XXXX-XXX-XXX", type: "電話" },
  { id: "quote-no", row: 9, col: "G", label: "報價單號", value: "系統編號", type: "自由輸入" },
  { id: "ship-address", row: 10, col: "A", label: "送貨地址", value: "地址", type: "地址" },
  { id: "fax", row: 10, col: "D", label: "傳真", value: "XX-XXXX-XXXX", type: "電話" },
  { id: "quote-date", row: 10, col: "G", label: "報價日期", value: "2026/05/23", type: "日期" },
  { id: "item-header", row: 12, col: "A", label: "項次", value: "項次", type: "標題" },
  { id: "product-code-header", row: 12, col: "B", label: "商品編號", value: "商品編號", type: "標題" },
  { id: "product-name-header", row: 12, col: "C", label: "商品名稱", value: "商品名稱", type: "標題" },
  { id: "spec-header", row: 12, col: "D", label: "規格", value: "規格", type: "標題" },
  { id: "qty-header", row: 12, col: "F", label: "數量", value: "數量", type: "標題" },
  { id: "price-header", row: 12, col: "G", label: "單價", value: "單價", type: "標題" },
  { id: "subtotal-header", row: 12, col: "H", label: "小計", value: "小計", type: "標題", formula: "數量 × 單價" },
  { id: "item-1", row: 13, col: "A", label: "項次", value: "#,###", type: "自由輸入" },
  { id: "product-code-1", row: 13, col: "B", label: "商品編號", value: "從其它表單選擇", type: "從其它表單選擇" },
  { id: "product-name-1", row: 13, col: "C", label: "商品名稱", value: "自由輸入", type: "自由輸入" },
  { id: "spec-1", row: 13, col: "D", label: "規格", value: "自由輸入", type: "自由輸入" },
  { id: "qty-1", row: 13, col: "F", label: "數量", value: "#,###", type: "自由輸入" },
  { id: "price-1", row: 13, col: "G", label: "單價", value: "$#,###.##", type: "金額" },
  { id: "subtotal-1", row: 13, col: "H", label: "小計", value: "$#,###", type: "公式", formula: "F13 * G13" },
  { id: "amount", row: 16, col: "G", label: "金額（未稅）", value: "$#,###", type: "公式", formula: "SUM(H13:H15)" },
  { id: "tax", row: 17, col: "G", label: "稅額", value: "$#,###", type: "公式", formula: "金額 × 5%" },
  { id: "total", row: 18, col: "G", label: "總額", value: "$#,###", type: "公式", formula: "金額 + 稅額" }
];

const fieldTypes: CellType[] = ["自由輸入", "從其它表單選擇", "日期", "金額", "電話", "地址", "公式", "多選", "標題"];

function typeClass(type: CellType) {
  if (type === "公式") return "bg-brand-600 text-white";
  if (type === "從其它表單選擇") return "bg-blue-50 text-blue-700";
  if (type === "金額") return "bg-emerald-50 text-emerald-700";
  if (type === "日期") return "bg-violet-50 text-violet-700";
  if (type === "標題") return "bg-slate-100 text-slate-700";
  return "bg-slate-50 text-slate-600";
}

export default function RagicFormBuilderPage() {
  const [cells, setCells] = useState<CanvasCell[]>(defaultCells);
  const [selectedCellId, setSelectedCellId] = useState("customer-name");
  const [autoSave, setAutoSave] = useState(false);

  const selectedCell = useMemo(() => cells.find((cell) => cell.id === selectedCellId), [cells, selectedCellId]);

  function getCell(row: number, col: string) {
    return cells.find((cell) => cell.row === row && cell.col === col);
  }

  function updateSelected(key: keyof CanvasCell, value: string | boolean | number) {
    if (!selectedCell) return;
    setCells((prev) => prev.map((cell) => cell.id === selectedCell.id ? { ...cell, [key]: value } : cell));
  }

  function addCell() {
    const next: CanvasCell = {
      id: crypto.randomUUID(),
      row: 11,
      col: "A",
      label: "新增欄位",
      value: "自由輸入",
      type: "自由輸入"
    };
    setCells([...cells, next]);
    setSelectedCellId(next.id);
  }

  return (
    <AppLayout title="表單設計器">
      <PageHeader
        title="表單設計器"
        description="保留 DOCLICK.TW 藍白風格，以表格畫布方式建立報價單、訂單、專案表與費用報支。"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={addCell}><Plus className="mr-2 h-4 w-4" />新增欄位</button>
            <button className="btn-primary" onClick={() => alert("Demo：已儲存表單設計。")}><Save className="mr-2 h-4 w-4" />儲存設計</button>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
        <div className="card">
          <div className="mb-5 flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-brand-600" />
            <h3 className="font-bold">欄位設定</h3>
          </div>

          {selectedCell ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
                目前選取：{selectedCell.col}{selectedCell.row}｜{selectedCell.label}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">欄位名稱</label>
                <input className="input" value={selectedCell.label} onChange={(event) => updateSelected("label", event.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">顯示文字</label>
                <textarea className="input min-h-20" value={selectedCell.value} onChange={(event) => updateSelected("value", event.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">欄位類型</label>
                <select className="input" value={selectedCell.type} onChange={(event) => updateSelected("type", event.target.value)}>
                  {fieldTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </div>

              {selectedCell.type === "公式" && (
                <div>
                  <label className="mb-1 block text-sm font-medium">公式設定</label>
                  <input className="input" value={selectedCell.formula ?? ""} onChange={(event) => updateSelected("formula", event.target.value)} />
                </div>
              )}

              <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">
                必填欄位
                <input type="checkbox" checked={Boolean(selectedCell.required)} onChange={(event) => updateSelected("required", event.target.checked)} />
              </label>

              <div>
                <label className="mb-1 block text-sm font-medium">跨欄數</label>
                <select className="input" value={selectedCell.colSpan ?? 1} onChange={(event) => updateSelected("colSpan", Number(event.target.value))}>
                  {[1, 2, 3, 4].map((num) => <option key={num} value={num}>{num}</option>)}
                </select>
              </div>

              <button className="btn-secondary w-full" onClick={() => alert("Demo：已複製欄位樣式。")}>
                <Copy className="mr-2 h-4 w-4" />
                複製欄位樣式
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">請點選右側畫布中的欄位。</p>
          )}
        </div>

        <div className="card">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <button className="btn-secondary"><FileText className="mr-2 h-4 w-4" />表單工具</button>
            <button className="btn-secondary"><Table2 className="mr-2 h-4 w-4" />新增子表格</button>
            <button className="btn-secondary"><Calculator className="mr-2 h-4 w-4" />新增公式</button>
            <button className="btn-secondary"><Database className="mr-2 h-4 w-4" />連結表單</button>
            <button className="btn-secondary"><Link2 className="mr-2 h-4 w-4" />插入連結</button>
            <label className="ml-auto flex items-center gap-2 text-sm text-slate-500">
              <input type="checkbox" checked={autoSave} onChange={(event) => setAutoSave(event.target.checked)} />
              自動儲存
            </label>
          </div>

          <div className="overflow-auto rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="min-w-[1080px] rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-3 grid grid-cols-[44px_repeat(8,1fr)] text-center text-sm text-slate-400">
                <div />
                {columns.map((col) => <div key={col} className="border border-slate-100 bg-slate-50 py-1">{col}</div>)}
              </div>

              {rows.map((row) => (
                <div key={row} className="grid grid-cols-[44px_repeat(8,1fr)]">
                  <div className="border border-slate-100 bg-slate-50 py-2 text-center text-xs text-slate-400">{row}</div>
                  {columns.map((col) => {
                    const cell = getCell(row, col);

                    const coveredBySpan = cells.some((spanCell) => {
                      if (!spanCell.colSpan || spanCell.colSpan <= 1 || spanCell.row !== row) return false;
                      const start = columns.indexOf(spanCell.col);
                      const current = columns.indexOf(col);
                      return current > start && current < start + spanCell.colSpan;
                    });

                    if (coveredBySpan) return null;

                    return (
                      <button
                        key={`${col}${row}`}
                        onClick={() => cell && setSelectedCellId(cell.id)}
                        className={`relative min-h-10 border border-slate-100 px-2 py-2 text-left text-sm transition ${
                          selectedCellId === cell?.id ? "ring-2 ring-brand-500" : ""
                        } ${
                          cell?.type === "標題" ? "bg-slate-100 text-center font-bold text-slate-800" : cell ? "bg-white hover:bg-brand-50" : "bg-white"
                        }`}
                        style={cell?.colSpan && cell.colSpan > 1 ? { gridColumn: `span ${cell.colSpan}` } : undefined}
                      >
                        {cell ? (
                          <>
                            <div className="flex items-center gap-1">
                              {cell.required && <span className="text-red-500">*</span>}
                              <span>{cell.value}</span>
                            </div>
                            {cell.type !== "標題" && (
                              <span className={`absolute right-1 top-1 rounded-full px-2 py-0.5 text-[10px] ${typeClass(cell.type)}`}>
                                {cell.type}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-transparent">.</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
