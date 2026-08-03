import React, { useState } from 'react';

const SERVICE_SPECS = [
    {
        id: 'accounting',
        title: '會計作業',
        icon: 'fa-calculator',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        items: [
            { title: '憑證處理', desc: '收集、分類與黏貼日常發票、收據與報銷單據。' },
            { title: '基礎內帳', desc: '將每日收支登錄至Excel或客戶指定的雲端會計系統。' },
            { title: '開立發票', desc: '協助開立二聯/三聯式發票、收據，並進行作廢或折讓單處理。' },
            { title: '應收付帳款管理', desc: '製作對帳單，提醒客戶廠商付款日期或客戶收款日期。' },
            { title: '零用金管理', desc: '管理小額零用金（建議額度NT$10,000以下），並製作零用金撥補表。(若客戶有要求，不主動請求執行此項目)' },
            { title: '薪資計算', desc: '計算員工薪資、勞健保級距與二代健保補充保費。(若客戶有要求，不主動請求執行此項目)' },
            { title: '銀行往來任務 (不持有印鑑)', desc: '協助至銀行進行臨櫃存款、匯款單填寫、需確實與業主核對。' },
            { title: '財務報表編製 (技術型會計)', desc: '產出資產負債表、損益表、現金流量表、財務規劃等。' },
            { title: '稅務申報 (技術型會計)', desc: '協助計算營業稅 (401/403報表)、各類所得扣繳申報資料整理（需配合客戶端簽約的會計師事務所）。' },
            { title: '成本分析 (技術型會計)', desc: '針對新創產品進行簡易的成本結構分析與毛利計算。' },
            { title: '請款流制度建立 (技術型會計)', desc: '協助新創公司建立請款流程、核決權限表等基礎內控規章。' },
        ]
    },
    {
        id: 'admin',
        title: '行政作業',
        icon: 'fa-folder-open',
        color: 'text-orange-500',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        items: [
            { title: '信件收發', desc: '快遞與包裹的簽收、登記、分發，以及寄件聯繫。' },
            { title: '資料建檔', desc: '將紙本合約、名片、客戶資料掃描並歸檔至雲端。' },
            { title: '會議記錄', desc: '參與內部會議，協助製作簡易會議記錄與待辦事項追蹤。' },
            { title: '表單製作', desc: '協助製作或調整基礎 Word/Excel 表單（如：請假單、簽到表等）。' },
            { title: '排程管理', desc: '協助安排會議室預約、確認與會者時間（但不負責老闆私人行程）。' },
            { title: '環境維護', desc: '負責「辦公環境」的整潔維持（如：會議室桌椅歸位、公共區域整理、垃圾分類），但不包含專業清潔打掃。' },
            { title: '辦公室用品採購與盤點', desc: '定期盤點文具、衛生紙、茶水間耗材，並製作請購單。' },
            { title: '設備報修', desc: '印表機、網路、冷氣等設備故障時的廠商聯繫窗口。' },
            { title: '出勤協作', desc: '協助匯出打卡紀錄，製作初步的出勤統計表供會計算薪。' },
        ]
    },
    {
        id: 'cs',
        title: '客服總機',
        icon: 'fa-headset',
        color: 'text-yellow-500',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        items: [
            { title: '來電過濾', desc: '辨識並過濾推銷、詐騙或無效來電，僅將重要合作夥伴或緊急事項轉接給核心團隊。' },
            { title: '標準應答', desc: '依照客戶制定的回答基礎問題（如：營業時間、公司地址、發票抬頭、基本產品規格）。' },
            { title: '留言管理', desc: '若核心團隊忙碌，負責精準記錄來電者資訊（姓名、單位、事由、回電時間）並透過通訊軟體回報。' },
            { title: '訊息回覆', desc: '管理官方 Line@、FB Messenger 或 Email 的「一般收件匣」。回覆常見問題，如出貨進度查詢、退換貨流程說明。' },
            { title: '客戶初級安撫', desc: '遇到憤怒客戶時，執行「聆聽、道歉、記錄」的標準程序，並將案件整理摘要回報給內部主管，不負責最終解決方案。' },
            { title: '訪客迎賓', desc: '針對有實體辦公室的新創，負責門禁管理、訪客換證、茶水招待及會議室指引。' },
            { title: '快遞與外送分流處理', desc: '統一收發信件包裹，避免快遞員直接闖入辦公區打擾團隊工作。' },
        ]
    },
    {
        id: 'sales_assistant',
        title: '業務助理',
        icon: 'fa-file-invoice-dollar',
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        items: [
            { title: '報價單製作', desc: '依據業務提供的產品項目與價格，套用公司標準格式製作報價單。' },
            { title: '訂單建檔', desc: '將客戶確認的訂單輸入至 ERP 系統或 Excel 訂單管理表。' },
            { title: '合約用印流程', desc: '檢查合約欄位是否填寫完整，並協助跑內部用印流程（但不負責審閱法律條款）。' },
            { title: '出貨單據協助', desc: '製作出貨單、發票開立申請單。' },
            { title: '名片建檔', desc: '將業務帶回的名片或參展收集的資料，輸入至指定系統。' },
            { title: '銷售報表整理', desc: '每週協助彙整業務的業績數字，製作基礎的銷售報告（僅做統計，不負責分析）。' },
            { title: '庫存查詢', desc: '協助業務向倉儲部門查詢現貨狀況。' },
            { title: '出貨追蹤', desc: '追蹤貨物是否已發出，並將物流單號回報給業務或客戶。' },
            { title: '樣品寄送', desc: '負責樣品打包、安排快遞寄送給客戶。' },
        ]
    },
    {
        id: 'packing',
        title: '理貨包裝貼標',
        icon: 'fa-box',
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        items: [
            { title: '商品貼標', desc: '依據指示，將條碼、中文標籤、促銷貼紙準確黏貼於商品指定位置。' },
            { title: '組合包裝', desc: '將多樣商品組合成禮盒或促銷組，包含折紙盒、放入填充物、封箱。' },
            { title: '商品上架', desc: '將驗收完成的商品，依照貨架編號歸位擺放整齊。' },
            { title: '訂單撿貨', desc: '依據撿貨單，從貨架上拿取正確數量與規格的商品。' },
            { title: '包裝封箱', desc: '檢查商品外觀無損後，進行防撞包裝（氣泡紙/緩衝材）與封箱作業。' },
            { title: '面單黏貼', desc: '準確黏貼物流單，確保「單貨一致」。' },
            { title: '交寄作業', desc: '協助將包裹搬運至指定集貨區，供物流司機收件。' },
            { title: '盤點協作', desc: '配合正職人員進行「盲盤」或「數量清點」，協助填寫盤點表。' },
            { title: '庫房整理', desc: '整理紙箱、清除包材廢料，維持走道暢通與作業區整潔。' },
        ]
    },
    {
        id: 'forklift',
        title: '倉儲堆高機 (技術型)',
        icon: 'fa-truck-loading',
        color: 'text-slate-600',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        items: [
            { title: '裝卸貨作業', desc: '配合貨櫃或貨車抵達時間，將棧板貨物安全卸下或裝載上車。' },
            { title: '高價存取', desc: '重型料架的倉庫，精準地將貨物存取至指定儲位。' },
            { title: '作業前檢查', desc: '上工前執行標準點檢（檢查煞車、牙叉插銷、電池水/油位、輪胎胎紋）。' },
            { title: '充電與能源管理', desc: '負責電動堆高機的充電作業，或柴油/瓦斯堆高機的燃料補充提醒（不負責採購燃料）。' },
            { title: '異常回報', desc: '若發現機具異音、漏油或操作不順，立即停止作業並通報客戶主管。' },
        ]
    },
    {
        id: 'design',
        title: '美術設計編輯 (技術型)',
        icon: 'fa-paint-brush',
        color: 'text-pink-600',
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        items: [
            { title: '社群圖文編輯', desc: '製作 FB/IG 貼文配圖、限時動態版型、Line@ 推播圖（需由客戶提供文案與尺寸規範）。' },
            { title: '廣告素材製作', desc: '製作 Google Display Network (GDN) 廣告圖、活動 Banner。' },
            { title: '美術修圖', desc: '產品去背、修圖、製作電商商品詳情頁 (Landing Page) 的長條圖切版。' },
            { title: '廣告宣傳品', desc: '名片、DM 傳單、海報、排版設計等。' },
            { title: '包裝輔助', desc: '協助將 Logo 放置於刀模圖上，製作貼紙或簡易包裝盒設計（需由客戶提供廠商刀模）。' },
            { title: '識別延伸', desc: '依據客戶現有的企業識別規範，將 Logo 應用於簡報母片、信封信紙、員工證等週邊。' },
            { title: '素材管理', desc: '協助整理客戶的圖庫、照片素材，建立標準化的命名與歸檔邏輯。' },
        ]
    },
    {
        id: 'web_design',
        title: '銷售網站美編 (技術型)',
        icon: 'fa-laptop-code',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        items: [
            { title: '套圖素材製作修改', desc: '協助客戶既有套圖修改及排版 (此項非技術性人員價格)' },
            { title: '商品詳情頁面管理製作', desc: '製作各大通路（蝦皮/Momo/PChome）專用的商品介紹圖，包含規格表、細節近拍修圖、競品比較圖。(此項非技術性人員價格)' },
            { title: '修圖', desc: '運用 AI 工具或Adobe系列工具批次處理去背、擴圖、調整模特兒表情。(此項非技術性人員價格)' },
            { title: '動態圖製作', desc: '製作展示產品功能的簡易動態圖（如：防潑水測試、衣服彈性展示），提升頁面停留時間。' },
            { title: '網站活動換檔', desc: '配合雙11、母親節等檔期，更換官網首頁的主視覺 (Key Visual)、彈跳視窗 (Pop-up) 與分類Bar圖示。' },
            { title: '多通路尺寸延展', desc: '將同一套主視覺，快速調整為不同尺寸（如：FB 廣告圖 1080x1080、限動 1080x1920、Line 貼文、官網 Banner 1920x600）。' },
            { title: '後台上下架協作', desc: '協助在開店平台後台（如 SHOPLINE/Cyberbiz）上傳圖片、更新 Alt 文字（SEO優化），但不涉及價格設定。' },
            { title: 'AI或軟體生成素材', desc: '熟練使用AI工具或 Adobe系列工具生成情境背景圖（如：將產品合成在北歐風客廳），降低攝影棚租借成本。' },
        ]
    },
    {
        id: 'kol_video',
        title: 'KOL短影音行銷 (技術型人員)',
        icon: 'fa-video',
        color: 'text-rose-500',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        items: [
            { title: '選題策劃', desc: '蒐集當下 TikTok/Reels/Shorts 的熱門音樂與挑戰，提出適合品牌的拍攝主題。' },
            { title: '分鏡腳本', desc: '撰寫簡易拍攝大綱，包含場景、運鏡方式、口播文案。' },
            { title: '手機攝影', desc: '使用手機進行影片拍攝。包含運鏡、補光（使用簡易環形燈）。' },
            { title: '引導演出', desc: '若由老闆或員工出鏡，派遣人員負責擔任「導演」，引導表情與動作；若需派遣人員出鏡（需另簽肖像授權），則擔任「演員」。' },
            { title: '剪輯', desc: '使用 CapCut (剪映) 或其它軟件進行快速剪輯。包含：上字幕、卡點剪接、添加音效與貼圖。' },
            { title: '平台發佈', desc: '協助上傳影片至各大平台如IG/FB/Threads，設定封面圖、撰寫標題，回覆初期留言。' },
        ]
    },
    {
        id: 'photo_tech',
        title: '外派商業拍攝 (技術型人員)',
        icon: 'fa-camera',
        color: 'text-cyan-600',
        bg: 'bg-cyan-50',
        border: 'border-cyan-200',
        items: [
            { title: '標準白底商品照', desc: '在客戶搭建好的簡易攝影棚或燈箱中，進行標準化拍攝（去背用）。產出量大，強調清晰、色準，不含複雜佈景。' },
            { title: '活動紀錄', desc: '拍攝公司內部活動、講座、會議側拍。交付「已過濾（刪除閉眼/模糊）」的 JPG 大檔，僅做全域基本調光（Lightroom 批次處理）。' },
            { title: '簡易人像及商品', desc: '拍攝員工證件照、服飾新品的「平拍」或「簡單穿搭」（非形象大片）。' },
            { title: '基礎修圖', desc: '裁切、調亮、白平衡校正、基礎磨皮。不包含精修、合成或特效。' },
        ]
    },
    {
        id: 'photo_pro',
        title: '專案技術商業拍攝 (專業合作廠商)',
        icon: 'fa-camera-retro',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        items: [
            { title: '主視覺設計', desc: '包含燈光設計、場景搭建、美術陳列。' },
            { title: '高階精修', desc: '液化瘦身、光影重塑、材質合成、無中生有（如：把瓶子上的字換掉）。' },
            { title: '創意策劃', desc: '攝影師參與前期的視覺發想，提供專業的燈光與構圖建議。' },
            { title: '溝通', desc: '前期開會討論風格，中期拍攝，後期校稿。' },
            { title: '專業設備', desc: '全套專業設備（高畫素相機、多盞棚燈、控光配件、背景架）。' },
        ]
    },
    {
        id: 'engineering',
        title: '工程製圖 (技術型人員)',
        icon: 'fa-drafting-compass',
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        items: [
            { title: '2D圖面繪製', desc: '使用 AutoCAD 依據手稿或草圖，繪製平面圖、立面圖、剖面圖。' },
            { title: '圖面修改', desc: '依據工程師標註的修正圖或會議記錄，進行尺寸修改、圖層調整與線型修正。' },
            { title: '施工圖繪製', desc: '將設計師圖面拆解為可交由工班執行施工的詳細尺寸及大樣圖，標註公差與表面處理符號（需由工程師提供規範）。' },
            { title: '基礎建模', desc: '使用 SketchUp (室內) 或 SolidWorks (機構) 建立基礎外觀模型，供客戶確認體積與檢查。' },
            { title: '估算製作', desc: '協助從圖面中提取材料清單，統計材料及零件數量。' },
        ]
    },
];

const ServiceSpecsModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('accounting');

    if (!isOpen) return null;

    const activeData = SERVICE_SPECS.find(s => s.id === activeTab);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">愜易居職能規範</h2>
                        <p className="text-gray-500 text-sm mt-1">標準化作業流程，確保服務品質一致性</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <i className="fas fa-times text-2xl"></i>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-full overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4 overflow-y-auto">
                        <div className="space-y-2">
                            {SERVICE_SPECS.map((spec) => (
                                <button
                                    key={spec.id}
                                    onClick={() => setActiveTab(spec.id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center ${activeTab === spec.id
                                        ? 'bg-white shadow-md text-biz-600 font-bold ring-1 ring-biz-100'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${activeTab === spec.id ? 'bg-biz-100' : 'bg-gray-200'}`}>
                                        <i className={`fas ${spec.icon} text-sm ${activeTab === spec.id ? 'text-biz-600' : 'text-gray-500'}`}></i>
                                    </div>
                                    {spec.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white relative">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                            <i className={`fas ${activeData.icon} text-9xl transform translate-x-10 -translate-y-10`}></i>
                        </div>

                        <div className="relative z-10 animate-fade-in">
                            <div className="flex items-center mb-8">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mr-4 ${activeData.bg} ${activeData.color}`}>
                                    <i className={`fas ${activeData.icon}`}></i>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800">{activeData.title}</h3>
                            </div>

                            <div className="grid gap-6">
                                {activeData.items.map((item, index) => (
                                    <div key={index} className="flex items-start group hover:bg-gray-50 p-4 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className={`w-2 h-8 rounded-full ${activeData.bg.replace('bg-', 'bg-opacity-50 ')} bg-current ${activeData.color} mr-4`}></div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
                                            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200"
                    >
                        關閉
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceSpecsModal;
