export const PRICING_PLANS = [
    {
        name: "標準會員 (Standard)",
        monthlyFee: "NT$ 4,800",
        hourlyRate: "300 點/hr",
        target: "穩定用量 > 70hr",
        features: [
            "標準人力派遣 (1.0點)",
            "專屬帳戶經理",
            "產能數據報表",
            "48小時調度保證"
        ],
        isPopular: false
    },
    {
        name: "PRO 企業會員",
        monthlyFee: "NT$ 8,000",
        hourlyRate: "290 點/hr",
        target: "企業級客戶 / 需技術人才",
        features: [
            "優先派遣權 (24小時)",
            "技術人才優惠費率 (1.1倍)",
            "設計雲 / 財務管家訂閱權",
            "跨區調度支援",
            "API 串接支援"
        ],
        isPopular: true
    }
];

export const TALENT_LEVELS = [
    {
        level: "Tier 1 (A類)",
        title: "備用池 / 救火隊",
        req: "月工時 35~70 小時",
        pay: "NT$ 200 / hr",
        benefits: ["基礎勞健保", "彈性排班"]
    },
    {
        level: "Tier 2 (B類)",
        title: "核心戰力",
        req: "月工時 > 70 小時",
        pay: "NT$ 210~250 / hr",
        benefits: ["職涯地圖解鎖", "進修獎學金 $3,000", "家庭數位基金", "購屋補貼資格"]
    }
];
