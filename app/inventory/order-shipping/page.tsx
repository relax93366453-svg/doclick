"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Box,
  CheckCircle2,
  ClipboardList,
  Edit3,
  Eye,
  EyeOff,
  Filter,
  GripVertical,
  PackageCheck,
  Plus,
  Save,
  Search,
  Settings2,
  ShoppingCart,
  Truck,
  Trash2,
  Warehouse,
  X
} from "lucide-react";
import { useMemo, useState } from "react";

type OrderStatus = "未處理" | "已扣庫存" | "已產生出貨單" | "已出貨";
type FieldType = "文字" | "下拉選單" | "日期" | "金額" | "數字" | "勾選" | "備註";

type OrderItem = {
  productNo: string;
  productName: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  orderNo: string;
  orderDate: string;
  customerName: string;
  customerId: string;
  phone: string;
  email: string;
  address: string;
  shippingMethod: string;
  status: OrderStatus;
  totalAmount: number;
  stockDeducted: boolean;
  shippingNo: string;
  shippingDate: string;
  items: OrderItem[];
  note: string;
};

type Product = {
  productNo: string;
  productName: string;
  category: string;
  price: number;
  stock: number;
  safeStock: number;
};

type Shipping = {
  shippingNo: string;
  orderNo: string;
  customerName: string;
  phone: string;
  address: string;
  shippingMethod: string;
  shippingDate: string;
  status: string;
  itemSummary: string;
  note: string;
};

type FieldSetting = {
  key: keyof Order | "itemSummary";
  label: string;
  type: FieldType;
  visible: boolean;
  required: boolean;
  editable: boolean;
  width: string;
};

const initialProducts: Product[] = [
  { productNo: "P00225", productName: "乳膠枕", category: "寢具", price: 3600, stock: 397, safeStock: 20 },
  { productNo: "P00226", productName: "雙人特大三件組", category: "寢具", price: 4290, stock: 23, safeStock: 10 },
  { productNo: "P00227", productName: "雙人特大棉被", category: "床具", price: 6560, stock: 159, safeStock: 20 },
  { productNo: "P00228", productName: "雙人特大床架", category: "床具", price: 69900, stock: 64, safeStock: 5 },
  { productNo: "P00229", productName: "透明工業茶几餐桌", category: "桌", price: 18800, stock: 64, safeStock: 8 }
];

const initialOrders: Order[] = [
  {
    id: "order-1",
    orderNo: "PO-20200407-005",
    orderDate: "2020/04/07",
    customerName: "李怡瑜",
    customerId: "C-00817",
    phone: "0917-888-999",
    email: "maglee@example.com",
    address: "578 宜蘭縣礁溪鄉東十二路776巷879弄160號43樓",
    shippingMethod: "宅配",
    status: "未處理",
    totalAmount: 90540,
    stockDeducted: false,
    shippingNo: "",
    shippingDate: "",
    items: [
      { productNo: "P00225", productName: "乳膠枕", price: 3600, quantity: 2 },
      { productNo: "P00226", productName: "雙人特大三件組", price: 4290, quantity: 1 },
      { productNo: "P00227", productName: "雙人特大棉被", price: 6560, quantity: 1 },
      { productNo: "P00228", productName: "雙人特大床架", price: 69900, quantity: 1 }
    ],
    note: "客戶資料已自動帶入"
  },
  {
    id: "order-2",
    orderNo: "PO-20200408-001",
    orderDate: "2020/04/08",
    customerName: "陳皓靖",
    customerId: "C-00818",
    phone: "0918-999-000",
    email: "chen@example.com",
    address: "759-65 苗栗縣三義鄉漁港中一路991巷876弄801號",
    shippingMethod: "黑貓宅急便",
    status: "未處理",
    totalAmount: 75460,
    stockDeducted: false,
    shippingNo: "",
    shippingDate: "",
    items: [
      { productNo: "P00224", productName: "乳膠枕", price: 3600, quantity: 2 },
      { productNo: "P00225", productName: "雙人特大保潔墊", price: 1860, quantity: 1 },
      { productNo: "P00226", productName: "雙人特大三件組", price: 4290, quantity: 1 },
      { productNo: "P00228", productName: "雙人特大床架", price: 69900, quantity: 1 }
    ],
    note: ""
  }
];

const defaultFields: FieldSetting[] = [
  { key: "orderNo", label: "訂單編號", type: "文字", visible: true, required: true, editable: true, width: "160px" },
  { key: "orderDate", label: "訂單日期", type: "日期", visible: true, required: false, editable: true, width: "130px" },
  { key: "customerName", label: "客戶姓名", type: "文字", visible: true, required: true, editable: true, width: "130px" },
  { key: "customerId", label: "客戶編號", type: "文字", visible: true, required: false, editable: true, width: "120px" },
  { key: "phone", label: "電話", type: "文字", visible: true, required: false, editable: true, width: "140px" },
  { key: "address", label: "地址", type: "備註", visible: true, required: false, editable: true, width: "280px" },
  { key: "shippingMethod", label: "寄送方式", type: "下拉選單", visible: true, required: false, editable: true, width: "140px" },
  { key: "status", label: "訂單狀態", type: "下拉選單", visible: true, required: true, editable: true, width: "140px" },
  { key: "totalAmount", label: "訂單金額", type: "金額", visible: true, required: false, editable: true, width: "130px" },
  { key: "stockDeducted", label: "已扣庫存", type: "勾選", visible: true, required: false, editable: true, width: "110px" },
  { key: "shippingNo", label: "出貨單號", type: "文字", visible: true, required: false, editable: true, width: "150px" },
  { key: "shippingDate", label: "出貨日期", type: "日期", visible: true, required: false, editable: true, width: "130px" },
  { key: "itemSummary", label: "商品明細", type: "備註", visible: true, required: false, editable: false, width: "260px" },
  { key: "note", label: "備註", type: "備註", visible: true, required: false, editable: true, width: "220px" }
];

function money(value: number) {
  return `NT$ ${Number(value || 0).toLocaleString("zh-TW")}`;
}

function todayText() {
  const now = new Date();
  return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
}

function makeShippingNo() {
  return `SO-${String(Date.now()).slice(-9)}`;
}

function statusClass(status: OrderStatus) {
  if (status === "已出貨") return "bg-emerald-50 text-emerald-700";
  if (status === "已產生出貨單") return "bg-brand-50 text-brand-700";
  if (status === "已扣庫存") return "bg-amber-50 text-amber-700";
  return "bg-slate-50 text-slate-600";
}

export default function OrderShippingPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [shippings, setShippings] = useState<Shipping[]>([]);
  const [fields, setFields] = useState<FieldSetting[]>(defaultFields);
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "shippings" | "fields" | "create">("orders");
  const [keyword, setKeyword] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Order | null>(null);
  const [newFieldLabel, setNewFieldLabel] = useState("");

  const visibleFields = fields.filter((field) => field.visible);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => Object.values({ ...order, items: JSON.stringify(order.items) }).join(" ").includes(keyword));
  }, [orders, keyword]);

  const totalOrders = orders.length;
  const deductedCount = orders.filter((order) => order.stockDeducted).length;
  const shippingCount = shippings.length;
  const lowStockCount = products.filter((product) => product.stock <= product.safeStock).length;

  function startEdit(order: Order) {
    setDraft({ ...order, items: [...order.items] });
    setEditingId(order.id);
  }

  function cancelEdit() {
    setDraft(null);
    setEditingId(null);
  }

  function saveEdit() {
    if (!draft || !editingId) return;
    setOrders((prev) => prev.map((order) => order.id === editingId ? draft : order));
    cancelEdit();
  }

  function deleteOrder(id: string) {
    if (!confirm("確定要刪除這筆訂單嗎？")) return;
    setOrders((prev) => prev.filter((order) => order.id !== id));
  }

  function updateDraft<K extends keyof Order>(key: K, value: Order[K]) {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  }

  function addOrder() {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNo: `PO-${String(Date.now()).slice(-9)}`,
      orderDate: todayText(),
      customerName: "",
      customerId: "",
      phone: "",
      email: "",
      address: "",
      shippingMethod: "宅配",
      status: "未處理",
      totalAmount: 0,
      stockDeducted: false,
      shippingNo: "",
      shippingDate: "",
      items: [],
      note: ""
    };

    setOrders([newOrder, ...orders]);
    setDraft(newOrder);
    setEditingId(newOrder.id);
    setActiveTab("orders");
  }

  function deductStock(order: Order) {
    if (order.stockDeducted) {
      alert("這張訂單已經扣過庫存，不能重複扣。");
      return;
    }

    const missing = order.items.filter((item) => {
      const product = products.find((p) => p.productNo === item.productNo || p.productName === item.productName);
      return !product || product.stock < item.quantity;
    });

    if (missing.length > 0) {
      alert(`庫存不足或找不到商品：${missing.map((item) => item.productName).join("、")}`);
      return;
    }

    setProducts((prev) =>
      prev.map((product) => {
        const matched = order.items.find((item) => item.productNo === product.productNo || item.productName === product.productName);
        if (!matched) return product;
        return { ...product, stock: product.stock - matched.quantity };
      })
    );

    setOrders((prev) =>
      prev.map((item) =>
        item.id === order.id
          ? { ...item, stockDeducted: true, status: "已扣庫存", note: item.note || "已完成一鍵扣庫存" }
          : item
      )
    );

    alert("扣庫存完成。");
  }

  function generateShipping(order: Order) {
    if (!order.stockDeducted) {
      alert("請先扣庫存，才能產生出貨單。");
      return;
    }

    const existed = shippings.find((shipping) => shipping.orderNo === order.orderNo);
    if (existed) {
      alert("這張訂單已經產生過出貨單。");
      return;
    }

    const shippingNo = makeShippingNo();
    const shippingDate = todayText();
    const itemSummary = order.items.map((item) => `${item.productName} x ${item.quantity}`).join("、");

    const shipping: Shipping = {
      shippingNo,
      orderNo: order.orderNo,
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      shippingMethod: order.shippingMethod,
      shippingDate,
      status: "待出貨",
      itemSummary,
      note: "由訂單一鍵產生"
    };

    setShippings([shipping, ...shippings]);

    setOrders((prev) =>
      prev.map((item) =>
        item.id === order.id
          ? { ...item, shippingNo, shippingDate, status: "已產生出貨單" }
          : item
      )
    );

    alert("已產生出貨單。");
  }

  function updateField(index: number, patch: Partial<FieldSetting>) {
    setFields((prev) => prev.map((field, i) => i === index ? { ...field, ...patch } : field));
  }

  function moveField(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    const next = [...fields];
    const current = next[index];
    next[index] = next[target];
    next[target] = current;
    setFields(next);
  }

  function addField() {
    if (!newFieldLabel.trim()) return;

    setFields([
      ...fields,
      {
        key: "note",
        label: newFieldLabel.trim(),
        type: "文字",
        visible: true,
        required: false,
        editable: true,
        width: "160px"
      }
    ]);

    setNewFieldLabel("");
  }

  function renderValue(order: Order, field: FieldSetting) {
    if (field.key === "itemSummary") {
      return order.items.length ? order.items.map((item) => `${item.productName} x ${item.quantity}`).join("、") : "-";
    }

    const value = order[field.key as keyof Order];

    if (field.key === "status") {
      return <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass(order.status)}`}>{order.status}</span>;
    }

    if (field.key === "stockDeducted") {
      return order.stockDeducted ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <span className="text-slate-400">未扣</span>;
    }

    if (field.key === "totalAmount") {
      return <span className="font-bold text-slate-800">{money(Number(order.totalAmount || 0))}</span>;
    }

    return <span>{String(value ?? "") || "-"}</span>;
  }

  return (
    <AppLayout title="訂單扣庫存與出貨">
      <PageHeader
        title="訂單扣庫存與出貨"
        description="從訂單一鍵扣庫存，並自動產生出貨單。此頁為進銷存安全新增版，不覆蓋原本進銷存頁面。"
        action={
          <button className="btn-primary" onClick={addOrder}>
            <Plus className="mr-2 h-4 w-4" />
            新增訂單
          </button>
        }
      />



      <div className="mb-5 grid gap-4 md:grid-cols-4">
        <Stat label="訂單總數" value={`${totalOrders} 筆`} icon={<ShoppingCart className="h-5 w-5" />} />
        <Stat label="已扣庫存" value={`${deductedCount} 筆`} icon={<PackageCheck className="h-5 w-5" />} />
        <Stat label="出貨單" value={`${shippingCount} 張`} icon={<Truck className="h-5 w-5" />} />
        <Stat label="低庫存提醒" value={`${lowStockCount} 項`} icon={<Warehouse className="h-5 w-5" />} />
      </div>

      <div className="card mb-5">
        <div className="flex flex-wrap gap-2">
          <TabButton active={activeTab === "orders"} onClick={() => setActiveTab("orders")}>訂單列表</TabButton>
          <TabButton active={activeTab === "products"} onClick={() => setActiveTab("products")}>商品庫存</TabButton>
          <TabButton active={activeTab === "shippings"} onClick={() => setActiveTab("shippings")}>出貨單列表</TabButton>
          <TabButton active={activeTab === "fields"} onClick={() => setActiveTab("fields")}>欄位設定</TabButton>
          <TabButton active={activeTab === "create"} onClick={() => setActiveTab("create")}>新增訂單</TabButton>
        </div>
      </div>

      {activeTab === "orders" && (
        <>
          <div className="card mb-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="搜尋訂單、客戶、電話、地址、商品..."
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </div>
              <span className="flex items-center rounded-full bg-brand-50 px-3 py-2 text-sm text-brand-700">
                <Filter className="mr-2 h-4 w-4" />
                {filteredOrders.length} 筆資料
              </span>
            </div>
          </div>

          <div className="card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">訂單列表</h2>
                <p className="mt-1 text-sm text-slate-500">操作欄固定在左側，扣庫存與產生出貨單都在這裡執行。</p>
              </div>
              <button className="btn-secondary" onClick={() => setActiveTab("fields")}>
                <Settings2 className="mr-2 h-4 w-4" />
                欄位設定
              </button>
            </div>

            <div className="overflow-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm" style={{ minWidth: `${visibleFields.length * 135 + 260}px` }}>
                <thead className="bg-slate-50">
                  <tr>
                    <th className="sticky left-0 z-20 border-b border-r border-slate-200 bg-slate-50 px-4 py-3 text-center" style={{ minWidth: "250px" }}>
                      操作
                    </th>
                    {visibleFields.map((field, index) => (
                      <th key={`${field.key}-${index}`} className="border-b border-slate-200 px-4 py-3 text-left" style={{ minWidth: field.width }}>
                        {field.label}
                        {field.required && <span className="ml-1 text-red-500">*</span>}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => {
                    const isEditing = editingId === order.id && draft;

                    if (isEditing && draft) {
                      return (
                        <tr key={order.id} className="bg-brand-50">
                          <td className="sticky left-0 z-10 border-b border-r border-slate-100 bg-brand-50 px-3 py-3">
                            <div className="flex flex-wrap justify-center gap-2">
                              <button className="rounded-xl bg-brand-600 px-3 py-2 text-white" onClick={saveEdit}>
                                <Save className="h-4 w-4" />
                              </button>
                              <button className="rounded-xl bg-slate-100 px-3 py-2 text-slate-600" onClick={cancelEdit}>
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          {visibleFields.map((field, index) => (
                            <td key={`${field.key}-${index}`} className="border-b border-slate-100 px-3 py-3" style={{ minWidth: field.width }}>
                              <EditableCell field={field} draft={draft} updateDraft={updateDraft} />
                            </td>
                          ))}
                        </tr>
                      );
                    }

                    return (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="sticky left-0 z-10 border-b border-r border-slate-100 bg-white px-3 py-3">
                          <div className="flex flex-wrap justify-center gap-2">
                            <button className="rounded-xl bg-brand-50 px-3 py-2 text-brand-700 hover:bg-brand-100" onClick={() => startEdit(order)} title="編輯">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="rounded-xl bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100" onClick={() => deleteOrder(order.id)} title="刪除">
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button className="rounded-xl bg-amber-50 px-3 py-2 text-amber-700 hover:bg-amber-100" onClick={() => deductStock(order)} title="扣庫存">
                              扣庫存
                            </button>
                            <button className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700 hover:bg-emerald-100" onClick={() => generateShipping(order)} title="產生出貨單">
                              出貨單
                            </button>
                          </div>
                        </td>
                        {visibleFields.map((field, index) => (
                          <td key={`${field.key}-${index}`} className="border-b border-slate-100 px-4 py-3" style={{ minWidth: field.width }}>
                            {renderValue(order, field)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "products" && (
        <div className="card">
          <h2 className="text-xl font-bold">商品庫存</h2>
          <p className="mt-1 text-sm text-slate-500">扣庫存後，商品數量會在這裡即時減少。</p>

          <div className="mt-5 overflow-auto rounded-2xl border border-slate-200">
            <table className="min-w-[780px] w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">商品編號</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">商品名稱</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">種類</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-right">單價</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-right">庫存量</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-right">安全庫存</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">狀態</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.productNo} className="hover:bg-slate-50">
                    <td className="border-b border-slate-100 px-4 py-3 text-brand-700">{product.productNo}</td>
                    <td className="border-b border-slate-100 px-4 py-3">{product.productName}</td>
                    <td className="border-b border-slate-100 px-4 py-3">{product.category}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-right">{money(product.price)}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-right text-xl font-bold">{product.stock}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-right">{product.safeStock}</td>
                    <td className="border-b border-slate-100 px-4 py-3">
                      {product.stock <= product.safeStock ? (
                        <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">低庫存</span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">正常</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "shippings" && (
        <div className="card">
          <h2 className="text-xl font-bold">出貨單列表</h2>
          <p className="mt-1 text-sm text-slate-500">從訂單產生出貨單後，會在這裡顯示。</p>

          <div className="mt-5 overflow-auto rounded-2xl border border-slate-200">
            <table className="min-w-[960px] w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">出貨單號</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">訂單編號</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">客戶姓名</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">電話</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">地址</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">寄送方式</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">出貨日期</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">商品明細</th>
                  <th className="border-b border-slate-200 px-4 py-3 text-left">狀態</th>
                </tr>
              </thead>
              <tbody>
                {shippings.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-400" colSpan={9}>
                      尚未產生出貨單，請先到訂單列表按「扣庫存」再按「出貨單」。
                    </td>
                  </tr>
                ) : (
                  shippings.map((shipping) => (
                    <tr key={shipping.shippingNo} className="hover:bg-slate-50">
                      <td className="border-b border-slate-100 px-4 py-3 text-brand-700">{shipping.shippingNo}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{shipping.orderNo}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{shipping.customerName}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{shipping.phone}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{shipping.address}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{shipping.shippingMethod}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{shipping.shippingDate}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{shipping.itemSummary}</td>
                      <td className="border-b border-slate-100 px-4 py-3">{shipping.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "fields" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="card">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">訂單欄位設定</h2>
                <p className="mt-1 text-sm text-slate-500">可調整欄位名稱、類型、顯示、必填、可編輯與排序。</p>
              </div>
              <button className="btn-secondary" onClick={() => setFields(defaultFields)}>恢復預設</button>
            </div>

            <div className="overflow-auto rounded-2xl border border-slate-200">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">排序</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">欄位名稱</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">欄位類型</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">顯示</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">必填</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">可編輯</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left">寬度</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={`${field.key}-${index}`} className="hover:bg-slate-50">
                      <td className="border-b border-slate-100 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-slate-300" />
                          <button className="rounded-lg bg-slate-100 px-2 py-1 text-xs" onClick={() => moveField(index, -1)}>上</button>
                          <button className="rounded-lg bg-slate-100 px-2 py-1 text-xs" onClick={() => moveField(index, 1)}>下</button>
                        </div>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <input className="input min-w-36" value={field.label} onChange={(event) => updateField(index, { label: event.target.value })} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <select className="input min-w-32" value={field.type} onChange={(event) => updateField(index, { type: event.target.value as FieldType })}>
                          <option>文字</option>
                          <option>下拉選單</option>
                          <option>日期</option>
                          <option>金額</option>
                          <option>數字</option>
                          <option>勾選</option>
                          <option>備註</option>
                        </select>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <button className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600" onClick={() => updateField(index, { visible: !field.visible })}>
                          {field.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <input type="checkbox" checked={field.required} onChange={(event) => updateField(index, { required: event.target.checked })} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <input type="checkbox" checked={field.editable} onChange={(event) => updateField(index, { editable: event.target.checked })} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3">
                        <input className="input min-w-24" value={field.width} onChange={(event) => updateField(index, { width: event.target.value })} />
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 text-center">
                        <button className="rounded-xl bg-red-50 px-3 py-2 text-red-600" onClick={() => setFields((prev) => prev.filter((_, i) => i !== index))}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card">
              <h2 className="text-xl font-bold">新增欄位</h2>
              <p className="mt-1 text-sm text-slate-500">例如：物流單號、配送司機、出貨備註、包裝狀態。</p>
              <div className="mt-4 space-y-3">
                <input className="input" placeholder="輸入欄位名稱" value={newFieldLabel} onChange={(event) => setNewFieldLabel(event.target.value)} />
                <button className="btn-primary w-full justify-center" onClick={addField}>
                  <Plus className="mr-2 h-4 w-4" />
                  新增欄位
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold">功能說明</h2>
              <div className="mt-4 space-y-3">
                <Info title="一鍵扣庫存" text="依訂單商品明細扣除商品庫存，避免重複扣庫存。" />
                <Info title="產生出貨單" text="扣庫存後才能產生出貨單，自動帶入客戶與商品明細。" />
                <Info title="安全新增版" text="此頁新增於 /inventory/order-shipping，不覆蓋原本進銷存。" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <div className="card">
          <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
            <ClipboardList className="mb-4 h-12 w-12 text-brand-600" />
            <h2 className="text-xl font-bold">新增訂單</h2>
            <p className="mt-2 text-sm text-slate-500">點下方按鈕會新增一筆空白訂單，並切回訂單列表讓你直接編輯。</p>
            <button className="btn-primary mt-5" onClick={addOrder}>
              <Plus className="mr-2 h-4 w-4" />
              新增一筆訂單
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function EditableCell({
  field,
  draft,
  updateDraft
}: {
  field: FieldSetting;
  draft: Order;
  updateDraft: <K extends keyof Order>(key: K, value: Order[K]) => void;
}) {
  if (!field.editable || field.key === "itemSummary") return <span className="text-slate-400">不可編輯</span>;

  if (field.key === "status") {
    return (
      <select className="input min-w-36" value={draft.status} onChange={(event) => updateDraft("status", event.target.value as OrderStatus)}>
        <option>未處理</option>
        <option>已扣庫存</option>
        <option>已產生出貨單</option>
        <option>已出貨</option>
      </select>
    );
  }

  if (field.key === "shippingMethod") {
    return (
      <select className="input min-w-32" value={draft.shippingMethod} onChange={(event) => updateDraft("shippingMethod", event.target.value)}>
        <option>宅配</option>
        <option>黑貓宅急便</option>
        <option>超商取貨</option>
        <option>自取</option>
        <option>貨運</option>
      </select>
    );
  }

  if (field.key === "stockDeducted") {
    return <input type="checkbox" checked={draft.stockDeducted} onChange={(event) => updateDraft("stockDeducted", event.target.checked)} />;
  }

  if (field.key === "totalAmount") {
    return <input className="input min-w-32 text-right" type="number" value={Number(draft.totalAmount || 0)} onChange={(event) => updateDraft("totalAmount", Number(event.target.value))} />;
  }

  return <input className="input min-w-36" value={String(draft[field.key as keyof Order] ?? "")} onChange={(event) => updateDraft(field.key as keyof Order, event.target.value as any)} />;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={`rounded-xl px-4 py-2 text-sm font-medium ${active ? "bg-brand-600 text-white" : "bg-slate-50 text-slate-600"}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="card">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        {icon}
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
