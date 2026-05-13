export const kpis = [
  { label: "本月銷售額", value: "NT$ 1,280,000", trend: "+18%" },
  { label: "應收帳款", value: "NT$ 356,000", trend: "-6%" },
  { label: "庫存警示", value: "18 項", trend: "需補貨" },
  { label: "待審核表單", value: "26 筆", trend: "今日 8 筆" }
];

export const salesTrend = [
  { month: "1月", sales: 680000, cost: 380000 },
  { month: "2月", sales: 820000, cost: 420000 },
  { month: "3月", sales: 760000, cost: 390000 },
  { month: "4月", sales: 980000, cost: 510000 },
  { month: "5月", sales: 1280000, cost: 690000 }
];

export const customerSources = [
  { name: "官網", value: 35 },
  { name: "業務開發", value: 28 },
  { name: "轉介紹", value: 22 },
  { name: "社群", value: 15 }
];

export const products = [
  { name: "精華液 A01", sku: "SKU-A01", stock: 128, safeStock: 30, status: "正常" },
  { name: "面膜 B02", sku: "SKU-B02", stock: 18, safeStock: 50, status: "低庫存" },
  { name: "包材 C03", sku: "SKU-C03", stock: 400, safeStock: 100, status: "正常" }
];

export const customers = [
  { name: "米朵電商", owner: "Alisha", stage: "報價中", nextFollowUp: "2026-05-18" },
  { name: "日日寵物店", owner: "業務 A", stage: "需求確認", nextFollowUp: "2026-05-20" },
  { name: "晨光製造", owner: "業務 B", stage: "成交", nextFollowUp: "2026-06-01" }
];

export const employees = [
  { name: "王小明", department: "業務部", role: "業務", status: "在職" },
  { name: "林小美", department: "人事部", role: "HR", status: "在職" },
  { name: "張建國", department: "外勤部", role: "外勤人員", status: "在職" }
];

export const financeRows = [
  { date: "2026-05-01", type: "收入", item: "系統月費", amount: 128000, status: "已收款" },
  { date: "2026-05-03", type: "支出", item: "廣告費", amount: 36000, status: "已付款" },
  { date: "2026-05-07", type: "收入", item: "導入服務", amount: 88000, status: "待收款" }
];
