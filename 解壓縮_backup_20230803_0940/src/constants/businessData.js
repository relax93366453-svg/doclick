export const MOCK_STATS = [
    { label: "活躍職缺", value: "3", change: "+1", trend: "up", icon: "fas fa-briefcase" },
    { label: "總應徵人數", value: "28", change: "+5", trend: "up", icon: "fas fa-users" },
    { label: "待審閱", value: "12", change: "-2", trend: "down", icon: "fas fa-clock" },
    { label: "本月花費", value: "$45,200", change: "+8%", trend: "up", icon: "fas fa-wallet" },
];

export const MOCK_APPLICANTS = [
    { id: 1, name: "王小明", job: "週末活動工讀生", status: "待審閱", date: "2024/02/24", avatar: "W" },
    { id: 2, name: "陳怡君", job: "展場行政助理", status: "面試中", date: "2024/02/23", avatar: "C" },
    { id: 3, name: "林志豪", job: "週末活動工讀生", status: "已錄取", date: "2024/02/22", avatar: "L" },
    { id: 4, name: "張雅婷", job: "商品解說人員", status: "已婉拒", date: "2024/02/20", avatar: "Z" },
    { id: 5, name: "李大衛", job: "展場機動人員", status: "待審閱", date: "2024/02/24", avatar: "D" },
];

export const RECENT_ACTIVITIES = [
    { id: 1, type: "apply", message: "王小明 應徵了 週末活動工讀生", time: "2 小時前" },
    { id: 2, type: "system", message: "您的職缺「商品解說人員」將於 3 天後到期", time: "5 小時前" },
    { id: 3, type: "review", message: "陳怡君 的面試已安排", time: "1 天前" },
];
