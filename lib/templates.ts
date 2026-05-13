export type IndustryTemplate = {
  id: string;
  name: string;
  description: string;
  modules: {
    name: string;
    description: string;
    fields: string[];
    workflow?: string[];
    targetModule?: string;
  }[];
};

export const industryTemplates: IndustryTemplate[] = [
  {
    id: "ecommerce",
    name: "電商公司範本",
    description: "商品、訂單、客戶、物流、退貨、庫存與客服工單。",
    modules: [
      {
        name: "商品管理",
        description: "管理商品、SKU、售價、成本、庫存與商品圖片。",
        targetModule: "inventory",
        fields: ["商品名稱", "SKU", "商品分類", "售價", "成本", "庫存", "安全庫存", "商品圖片", "狀態"]
      },
      {
        name: "訂單管理",
        description: "管理訂單編號、客戶、金額、付款狀態與物流狀態。",
        targetModule: "inventory",
        fields: ["訂單編號", "客戶名稱", "訂單金額", "付款狀態", "物流狀態", "出貨日期", "備註"]
      },
      {
        name: "客服工單",
        description: "管理客戶問題、處理狀態、負責人與附件。",
        targetModule: "crm",
        fields: ["客戶名稱", "問題類型", "問題內容", "處理狀態", "負責人", "附件", "結案日期"]
      },
      {
        name: "退貨管理",
        description: "管理退貨原因、退貨商品、退款狀態與處理紀錄。",
        targetModule: "finance",
        fields: ["退貨單號", "客戶名稱", "商品名稱", "退貨原因", "退款金額", "退款狀態", "處理人員"]
      }
    ]
  },
  {
    id: "pet-store",
    name: "寵物店範本",
    description: "飼主、寵物、美容預約、住宿、疫苗、會員儲值與商品銷售。",
    modules: [
      {
        name: "寵物資料",
        description: "管理寵物名稱、品種、生日、飼主、疫苗紀錄與照片。",
        targetModule: "crm",
        fields: ["寵物名稱", "品種", "生日", "飼主姓名", "飼主電話", "疫苗紀錄", "照片", "備註"]
      },
      {
        name: "美容預約",
        description: "管理預約日期、寵物、服務項目、美容師與簽名確認。",
        targetModule: "projects",
        fields: ["預約日期", "寵物名稱", "服務項目", "美容師", "預約狀態", "服務照片", "飼主簽名"]
      },
      {
        name: "會員儲值",
        description: "管理會員、儲值金額、剩餘點數與交易紀錄。",
        targetModule: "finance",
        fields: ["會員姓名", "儲值金額", "剩餘點數", "付款方式", "交易日期", "備註"]
      }
    ]
  },
  {
    id: "beauty",
    name: "美容業範本",
    description: "顧客、療程、預約、產品銷售、會員儲值、回訪提醒與美容師績效。",
    modules: [
      {
        name: "顧客資料",
        description: "管理顧客姓名、電話、膚況、過敏史與照片附件。",
        targetModule: "crm",
        fields: ["姓名", "電話", "膚況", "過敏史", "主要需求", "顧客來源", "照片附件", "備註"]
      },
      {
        name: "療程紀錄",
        description: "管理療程日期、療程項目、美容師、前後照片與顧客簽名。",
        targetModule: "projects",
        fields: ["療程日期", "顧客姓名", "療程項目", "美容師", "前後照片", "顧客簽名", "下次建議"]
      },
      {
        name: "回訪提醒",
        description: "管理顧客、回訪日期、回訪狀態與備註。",
        targetModule: "crm",
        fields: ["顧客姓名", "回訪日期", "回訪狀態", "回訪內容", "負責人", "備註"]
      },
      {
        name: "產品銷售",
        description: "管理美容產品銷售、庫存扣減與業績統計。",
        targetModule: "inventory",
        fields: ["銷售日期", "顧客姓名", "產品名稱", "數量", "單價", "總金額", "銷售人員"]
      }
    ]
  },
  {
    id: "manufacturing",
    name: "製造業範本",
    description: "生產訂單、物料、工單、品檢、設備維修、出貨與成本分析。",
    modules: [
      {
        name: "生產訂單",
        description: "管理訂單編號、產品、數量、預計完工日與狀態。",
        targetModule: "production",
        fields: ["訂單編號", "客戶名稱", "產品名稱", "數量", "預計開工日", "預計完工日", "生產狀態"]
      },
      {
        name: "品檢紀錄",
        description: "管理批號、檢查項目、良品數、不良數與圖片附件。",
        targetModule: "production",
        fields: ["批號", "產品名稱", "檢查項目", "良品數", "不良數", "檢查人員", "圖片附件", "判定結果"]
      },
      {
        name: "設備維修",
        description: "管理設備、異常原因、維修人員與維修狀態。",
        targetModule: "equipment",
        fields: ["設備名稱", "設備編號", "異常原因", "維修人員", "維修狀態", "維修日期", "附件"]
      },
      {
        name: "物料申請",
        description: "管理物料需求、申請數量、核准狀態與領料紀錄。",
        targetModule: "inventory",
        fields: ["申請日期", "申請人", "物料名稱", "需求數量", "用途", "審核狀態", "領料狀態"]
      }
    ]
  },
  {
    id: "office",
    name: "行政辦公室範本",
    description: "公告、文件、採購、用印、會議室、人事請假、資產與費用報銷。",
    modules: [
      {
        name: "行政申請",
        description: "管理申請人、申請類型、金額、附件與審核狀態。",
        targetModule: "admin-office",
        fields: ["申請人", "申請類型", "申請內容", "金額", "附件", "審核狀態", "審核人"]
      },
      {
        name: "會議室預約",
        description: "管理會議室、日期、開始時間、結束時間與參與人。",
        targetModule: "admin-office",
        fields: ["會議室", "日期", "開始時間", "結束時間", "會議主題", "參與人", "備註"]
      },
      {
        name: "文件管理",
        description: "管理文件名稱、分類、權限與附件。",
        targetModule: "admin-office",
        fields: ["文件名稱", "文件分類", "上傳人", "檢視權限", "附件", "版本", "備註"]
      },
      {
        name: "費用報銷",
        description: "管理報銷人、費用類型、金額、憑證與財務審核。",
        targetModule: "finance",
        fields: ["報銷人", "費用類型", "金額", "付款方式", "憑證附件", "審核狀態", "財務備註"]
      }
    ]
  },
  {
    id: "field-service",
    name: "外勤服務範本",
    description: "GPS 打卡、客戶拜訪、簽名確認、服務照片、任務派工與費用報銷。",
    modules: [
      {
        name: "外勤回報",
        description: "管理人員、GPS 定位、客戶、照片上傳與手寫簽名。",
        targetModule: "projects",
        fields: ["人員", "GPS定位", "客戶名稱", "拜訪時間", "服務內容", "照片上傳", "手寫簽名"]
      },
      {
        name: "任務派工",
        description: "管理任務、負責人、期限、狀態與客戶滿意度。",
        targetModule: "projects",
        fields: ["任務名稱", "負責人", "客戶名稱", "期限", "任務狀態", "客戶滿意度", "備註"]
      },
      {
        name: "費用報銷",
        description: "管理外勤交通、餐費、材料費與憑證附件。",
        targetModule: "finance",
        fields: ["報銷人", "費用日期", "費用類型", "金額", "憑證附件", "審核狀態"]
      }
    ]
  }
];
