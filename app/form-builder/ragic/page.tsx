"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  ArrowLeft,
  Calculator,
  Copy,
  Database,
  FileText,
  Image,
  Link2,
  MousePointerClick,
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
  section?: string;
  required?: boolean;
  formula?: string;
  colSpan?: number;
};

const columns = ["A", "B", "C", "D", "E", "F", "G", "H"];
const rows = Array.from({ length: 18 }, (_, index) => index + 1);

const defaultCells: CanvasCell[] = [
  { id: "title", row: 4, col: "C", label: "報價單", value: "報價單", type: "標題", colSpan: 4 },

  { id: "customer-name", row: 5, col: "A", label: "客戶名稱", value: "從其它表單選擇", type: "從其它表單選擇", section: "客戶資料" },
  { id: "quote-code-label", row: 5, col: "D", label: "統一編號", value: "自由輸入", type: "自由輸入" },
  { id: "payment-method", row: 5, col: "G", label: "付款方式", value: "從選單選擇", type: "從其它表單選擇" },

  { id: "contact-code", row: 6, col: "A", label: "聯絡人編號", value: "從其它表單選擇", type: "從其它表單選擇" },
  { id: "payment-terms", row: 6, col: "D", label: "付款條件", value: "從選單選擇", type: "從其它表單選擇" },
  { id: "close-date", row: 6, col: "G", label: "結帳日", value: "從選單選擇", type: "日期" },

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

  { id: "item-2", row: 14, col: "A", label: "項次", value: "#,###", type: "自由輸入" },
  { id: "product-code-2", row: 14, col: "B", label: "商品編號", value: "從其它表單選擇", type: "從其它表單選擇" },
  { id: "product-name-2", row: 14, col: "C", label: "商品名稱", value: "自由輸入", type: "自由輸入" },
  { id: "spec-2", row: 14, col: "D", label: "規格", value: "自由輸入", type: "自由輸入" },
  { id: "qty-2", row: 14, col: "F", label: "數量", value: "#,###", type: "自由輸入" },
  { id: "price-2", row: 14, col: "G", label: "單價", value: "$#,###.##", type: "金額" },
  { id: "subtotal-2", row: 14, col: "H", label: "小計", value: "$#,###", type: "公式", formula: "F14 * G14" },

  { id: "end-customer", row: 16, col: "A", label: "終端客戶", value: "自由輸入", type: "自由輸入" },
  { id: "amount", row: 16, col: "G", label: "金額（未稅）", value: "$#,###", type: "公式", formula: "SUM(H13:H15)" },
  { id: "start-date", row: 17, col: "A", label: "起始日", value: "自由輸入", type: "日期" },
  { id: "tax", row: 17, col: "G", label: "稅額", value: "$#,###", type: "公式", formula: "金額 × 5%" },
  { id: "required", row: 18, col: "A", label: "以上報價", value: "從選單多選", type: "多選", required: true },
  { id: "total", row: 18, col: "G", label: "總額", value: "$#,###", type: "公式", formula: "金額 + 稅額" }
];

const fieldTypes: CellType[] = ["自由輸入", "從其它表單選擇", "日期", "金額", "電話", "地址", "公式", "多選", "標題"];

function cellKey(row: number, col: string) {
  return `${col}${row}`;
}

function typeBadge(type: CellType) {
  if (type === "公式") return "bg-slate-900 text-white";
  if (type === "從其它表單選擇") return "bg-sky-600 text-white";
  if (type === "日期") return "bg-violet-600 text-white";
  if (type === "金額") return "bg-emerald-600 text-white";
  if (type === "標題") return "bg-slate-600 text-white";
  return "bg-slate-500 text-white";
}

export default function RagicFormBuilderPage() {
  const [cells, setCells] = useState<CanvasCell[]>(defaultCells);
  const [selectedCellId, setSelectedCellId] = useState("customer-name");
  const [autoSave, setAutoSave] = useState(false);

  const selectedCell = useMemo(
    () => cells.find((cell) => cell.id === selectedCellId),
    [cells, selectedCellId]
  );

  function getCell(row: number, col: string) {
    return cells.find((cell) => cell.row === row && cell.col === col);
  }

  function updateSelected(key: keyof CanvasCell, value: string | boolean | number) {
    if (!selectedCell) return;
    setCells((prev) =>
      prev.map((cell) => cell.id === selectedCell.id ? { ...cell, [key]: value } : cell)
    );
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

  function duplicateStyle() {
    alert("Demo：已複製欄位樣式。正式版可複製欄位格式到多個儲存格。");
  }

  function saveForm() {
    alert("Demo：已儲存表單設計。正式版會寫入資料庫並建立可填寫表單。");
  }

  return (
    <AppLayout title="Ragic 風格表單設計器">
      <PageHeader
        title="Ragic 風格表單設計器"
        description="用像 Excel 的方式設計報價單、訂單、專案表、費用報支等企業表單。"
      />

      <div className="grid gap-0 xl:grid-cols-[360px_1fr]">
        <div className="rounded-l-3xl border border-slate-200 bg-white">
          <div className="flex border-b border-slate-200 text-sm font-medium">
            <button className="flex-1 border-b-2 border-transparent px-4 py-3 text-slate-500">新增元件</button>
            <button className="flex-1 border-b-2 border-brand-600 px-4 py-3 text-brand-700">欄位設定</button>
            <button className="flex-1 border-b-2 border-transparent px-4 py-3 text-slate-500">表單設定</button>
          </div>

          <div className="p-5">
            <h3 className="mb-4 font-bold">欄位設定</h3>

            {selectedCell ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">選取位置</label>
                  <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                    {selectedCell.col}{selectedCell.row}｜{selectedCell.label}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">欄位名稱</label>
                  <input className="input" value={selectedCell.label} onChange={(event) => updateSelected("label", event.target.value)} />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">描述內容／顯示文字</label>
                  <textarea className="input min-h-24" value={selectedCell.value} onChange={(event) => updateSelected("value", event.target.value)} />
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
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      例如：數量 × 單價、小計加總、金額 + 稅額。
                    </p>
                  </div>
                )}

                <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">
                  必填欄位
                  <input type="checkbox" checked={Boolean(selectedCell.required)} onChange={(event) => updateSelected("required", event.target.checked)} />
                </label>

                <div>
                  <label className="mb-1 block text-sm font-medium">跨欄數（合併儲存格）</label>
                  <select className="input" value={selectedCell.colSpan ?? 1} onChange={(event) => updateSelected("colSpan", Number(event.target.value))}>
                    {[1, 2, 3, 4].map((num) => <option key={num} value={num}>{num}</option>)}
                  </select>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="mb-3 text-sm font-bold">其他設定</p>
                  <button className="btn-secondary w-full" onClick={duplicateStyle}>
                    <Copy className="mr-2 h-4 w-4" />
                    複製欄位樣式
                  </button>

                  <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" />
                    一次把複製的樣式貼上到多個欄位
                  </label>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">請點選右側畫布中的欄位。</p>
            )}
          </div>
        </div>

        <div className="rounded-r-3xl border-y border-r border-slate-200 bg-white">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-4">
            <button className="btn-secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </button>
            <button className="btn-primary" onClick={saveForm}>
              <Save className="mr-2 h-4 w-4" />
              儲存
            </button>
            <button className="btn-secondary">離開</button>

            <button className="btn-secondary">
              <FileText className="mr-2 h-4 w-4" />
              表單工具
            </button>

            <button className="btn-secondary">
              <MousePointerClick className="mr-2 h-4 w-4" />
              編輯描述中
            </button>

            <label className="ml-auto flex items-center gap-2 text-sm text-slate-500">
              <input type="checkbox" checked={autoSave} onChange={(event) => setAutoSave(event.target.checked)} />
              自動儲存？
            </label>

            <button className="btn-secondary">版本紀錄</button>
          </div>

          <div className="overflow-auto bg-slate-50 p-5">
            <div className="min-w-[1080px] rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-3 grid grid-cols-[44px_repeat(8,1fr)] text-center text-sm text-slate-400">
                <div />
                {columns.map((col) => <div key={col} className="border border-slate-100 bg-slate-50 py-1">{col}</div>)}
              </div>

              <div className="space-y-0">
                {rows.map((row) => (
                  <div key={row} className="grid grid-cols-[44px_repeat(8,1fr)]">
                    <div className="border border-slate-100 bg-slate-50 py-2 text-center text-xs text-slate-400">{row}</div>
                    {columns.map((col) => {
                      const cell = getCell(row, col);
                      const key = cellKey(row, col);

                      if (cell?.colSpan && cell.colSpan > 1) {
                        return (
                          <button
                            key={key}
                            onClick={() => setSelectedCellId(cell.id)}
                            className={`relative min-h-10 border border-slate-100 px-2 py-2 text-left text-sm ${
                              selectedCellId === cell.id ? "ring-2 ring-brand-500" : ""
                            } ${
                              cell.type === "標題" ? "bg-slate-700 text-center text-lg font-bold text-white" :
                              row === 12 ? "bg-slate-100 font-bold" :
                              "bg-white"
                            }`}
                            style={{ gridColumn: `span ${cell.colSpan}` }}
                          >
                            {cell.required && <span className="text-red-500">*</span>}
                            {cell.value}
                            <span className={`absolute right-1 top-1 rounded px-1 text-[10px] ${typeBadge(cell.type)}`}>
                              {cell.type === "從其它表單選擇" ? "L" : cell.type === "公式" ? "f(x)" : ""}
                            </span>
                          </button>
                        );
                      }

                      const coveredBySpan = cells.some((spanCell) => {
                        if (!spanCell.colSpan || spanCell.colSpan <= 1 || spanCell.row !== row) return false;
                        const start = columns.indexOf(spanCell.col);
                        const current = columns.indexOf(col);
                        return current > start && current < start + spanCell.colSpan;
                      });

                      if (coveredBySpan) return null;

                      return (
                        <button
                          key={key}
                          onClick={() => cell && setSelectedCellId(cell.id)}
                          className={`relative min-h-10 border border-slate-100 px-2 py-2 text-left text-sm transition ${
                            selectedCellId === cell?.id ? "ring-2 ring-brand-500" : ""
                          } ${
                            cell?.type === "標題" || row === 12 ? "bg-slate-100 font-bold" :
                            cell ? "bg-white hover:bg-brand-50" : "bg-white"
                          }`}
                        >
                          {cell ? (
                            <>
                              <div className="flex items-center gap-1">
                                {cell.required && <span className="text-red-500">*</span>}
                                <span className={cell.type === "公式" ? "text-slate-700 font-semibold" : ""}>{cell.value}</span>
                              </div>

                              {cell.type !== "標題" && (
                                <span className={`absolute right-1 top-1 rounded px-1 text-[10px] ${typeBadge(cell.type)}`}>
                                  {cell.type === "從其它表單選擇" ? "L" : cell.type === "公式" ? "f(x)" : ""}
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

              <div className="mt-5 flex flex-wrap gap-2">
                <button className="btn-secondary" onClick={addCell}>
                  <Plus className="mr-2 h-4 w-4" />
                  新增欄位
                </button>
                <button className="btn-secondary">
                  <Table2 className="mr-2 h-4 w-4" />
                  新增子表格
                </button>
                <button className="btn-secondary">
                  <Calculator className="mr-2 h-4 w-4" />
                  新增公式
                </button>
                <button className="btn-secondary">
                  <Database className="mr-2 h-4 w-4" />
                  連結其他表單
                </button>
                <button className="btn-secondary">
                  <Image className="mr-2 h-4 w-4" />
                  圖片描述
                </button>
                <button className="btn-secondary">
                  <Link2 className="mr-2 h-4 w-4" />
                  插入連結
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
