import React, { useState } from 'react';
import InfoModal from './InfoModal';
import PriceListModal from './PriceListModal';
import ServiceSpecsModal from './ServiceSpecsModal';
import ContactModal from './ContactModal';
import ConsultationModal from './ConsultationModal';
import CostComparisonModal from './CostComparisonModal';
import SaveTroubleModal from './SaveTroubleModal';
import SaveRiskModal from './SaveRiskModal';
import { PRICING_PLANS } from '../constants/data';

const BusinessPage = ({ onBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPriceListModalOpen, setIsPriceListModalOpen] = useState(false);
    const [isServiceSpecsModalOpen, setIsServiceSpecsModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
    const [isCostComparisonModalOpen, setIsCostComparisonModalOpen] = useState(false);
    const [isSaveTroubleModalOpen, setIsSaveTroubleModalOpen] = useState(false);
    const [isSaveRiskModalOpen, setIsSaveRiskModalOpen] = useState(false);

    return (
        <div className="bg-white min-h-screen font-sans relative">
            <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <PriceListModal isOpen={isPriceListModalOpen} onClose={() => setIsPriceListModalOpen(false)} />
            <ServiceSpecsModal isOpen={isServiceSpecsModalOpen} onClose={() => setIsServiceSpecsModalOpen(false)} />
            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
            <ConsultationModal isOpen={isConsultationModalOpen} onClose={() => setIsConsultationModalOpen(false)} />
            <CostComparisonModal isOpen={isCostComparisonModalOpen} onClose={() => setIsCostComparisonModalOpen(false)} />
            <SaveTroubleModal isOpen={isSaveTroubleModalOpen} onClose={() => setIsSaveTroubleModalOpen(false)} />
            <SaveRiskModal isOpen={isSaveRiskModalOpen} onClose={() => setIsSaveRiskModalOpen(false)} />

            {/* Biz Nav */}
            <nav className="sticky top-0 z-50 bg-biz-900 text-white shadow-md">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center cursor-pointer" onClick={onBack}>
                        <div className="font-bold text-xl tracking-wider mr-2">愜易居</div>
                        <div className="text-xs bg-biz-700 px-2 py-1 rounded">Enterprise</div>
                    </div>
                    <div className="hidden md:flex space-x-8 text-sm">
                        <a href="#painpoints" className="hover:text-biz-300">為什麼選擇我們</a>
                        <a href="#solutions" className="hover:text-biz-300">核心服務</a>
                        <a href="#pricing" className="hover:text-biz-300">開始訂製我的模組</a>
                    </div>
                    <button
                        onClick={() => setIsConsultationModalOpen(true)}
                        className="bg-white text-biz-900 px-4 py-2 rounded text-sm font-bold hover:bg-gray-100 transition-colors"
                    >
                        預約諮詢
                    </button>
                </div>
            </nav>

            {/* Biz Hero - Updated Background */}
            <header className="bg-biz-900 text-white py-24 relative overflow-hidden flex items-center min-h-[600px]">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600"
                        alt="Happy employees working together"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-biz-900 via-biz-900/90 to-transparent"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-2xl animate-fade-in">
                        <div className="text-biz-400 font-bold mb-3 tracking-widest uppercase flex items-center">
                            <span className="w-8 h-[2px] bg-biz-400 mr-2"></span>
                            Workforce OS
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            您買的不是人力，<br />是「管理好的產能」。
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                            台灣中小企業的第二個人資部。<br />
                            零風險・全彈性・訂閱制。讓您專注核心業務，繁瑣的勞務交給愜易居。
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setIsPriceListModalOpen(true)}
                                className="bg-biz-500 hover:bg-biz-400 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-biz-500/30 transition-all transform hover:-translate-y-1">
                                索取 2026 報價單
                            </button>
                            <button
                                onClick={() => window.location.href = '#painpoints'}
                                className="border border-gray-500 hover:border-white text-gray-300 hover:text-white px-8 py-3 rounded-lg transition-all"
                            >
                                了解運作模式
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Pain Points Comparison */}
            <section id="painpoints" className="py-20 bg-biz-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-gray-900 leading-tight">傳統招聘模式 vs. 愜易居隨插即用模組化</h2>
                        <p className="text-gray-600 mt-6 text-xl">用真實的協作，取代履歷的片面之詞</p>
                    </div>

                    <div className="flex flex-col gap-12 max-w-6xl mx-auto mb-12">
                        {/* Traditional Recruiting Flow */}
                        <div className="bg-orange-50/50 p-8 rounded-2xl border border-orange-100">
                            <h3 className="text-2xl font-bold text-center mb-8">傳統招募</h3>
                            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                                {/* Steps */}
                                <div className="flex items-center">
                                    <div className="bg-white border-2 border-gray-600 text-gray-800 font-bold py-4 px-8 rounded-lg shadow-sm w-32 text-center text-lg">
                                        [履歷]
                                    </div>
                                    <i className="fas fa-arrow-right text-gray-400 text-xl mx-4"></i>
                                </div>
                                <div className="flex items-center">
                                    <div className="bg-white border-2 border-gray-600 text-gray-800 font-bold py-4 px-8 rounded-lg shadow-sm w-32 text-center text-lg">
                                        [面試]
                                    </div>
                                    <i className="fas fa-arrow-right text-gray-400 text-xl mx-4"></i>
                                </div>
                                <div className="flex items-center">
                                    <div className="bg-white border-2 border-gray-600 text-gray-800 font-bold py-4 px-8 rounded-lg shadow-sm w-32 text-center text-lg">
                                        [聘用]
                                    </div>
                                    <i className="fas fa-arrow-right text-gray-400 text-xl mx-4"></i>
                                </div>
                                <div>
                                    <div className="bg-white border-2 border-gray-600 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-sm w-32 text-center flex flex-col items-center justify-center">
                                        <div className="text-lg mb-1">[祈禱]</div>
                                        <i className="fas fa-praying-hands text-gray-600 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-gray-700 font-medium text-lg">
                                結果：高風險。你只認識「面試模式」下的他，聘用後才發現能力、文化完全不符。
                            </p>
                        </div>

                        {/* Qie Yi Ju Flow */}
                        <div className="bg-green-50/50 p-8 rounded-2xl border border-green-100">
                            <h3 className="text-2xl font-bold text-center mb-8">愜易居『先試後聘』</h3>
                            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                                {/* Steps */}
                                <div className="flex items-center">
                                    <div className="bg-[#0e7490] text-white font-bold py-6 px-4 rounded-lg shadow-md w-40 text-center text-xl">
                                        [派遣]
                                    </div>
                                    <i className="fas fa-arrow-right text-[#0e7490] text-xl mx-2 md:mx-4"></i>
                                </div>
                                <div className="flex items-center">
                                    <div className="bg-[#0891b2] text-white font-bold py-4 px-4 rounded-lg shadow-md w-40 text-center flex flex-col items-center justify-center h-24">
                                        <div className="text-lg leading-tight mb-1">[530+ 小時<br />真實任務]</div>
                                    </div>
                                    <i className="fas fa-arrow-right text-[#0891b2] text-xl mx-2 md:mx-4"></i>
                                </div>
                                <div className="flex items-center">
                                    <div className="relative bg-[#5eead4] text-[#134e4a] font-bold py-3 px-2 rounded-lg shadow-md w-44 text-center flex flex-col items-center justify-center h-24 border-2 border-[#14b8a6]">
                                        <i className="fas fa-check text-yellow-500 text-2xl absolute -top-5 left-1/2 transform -translate-x-1/2 shadow-sm bg-white rounded-full p-1"></i>
                                        <div className="text-lg leading-tight mb-1 mt-2">[文化與能力驗證]</div>
                                        <i className="fas fa-check text-white text-sm"></i>
                                    </div>
                                    <i className="fas fa-arrow-right text-[#14b8a6] text-xl mx-2 md:mx-4"></i>
                                </div>
                                <div>
                                    <div className="bg-[#2dd4bf] text-white font-bold py-3 px-6 rounded-lg shadow-md w-32 text-center flex flex-col items-center justify-center h-24">
                                        <div className="text-xl mb-1">[轉正]</div>
                                        <i className="fas fa-trophy text-yellow-100 text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center text-gray-800 font-bold text-lg">
                                結果：零風險。你聘用的是一位已被團隊驗證、無縫接軌的即戰力。
                            </p>
                        </div>
                    </div>

                    {/* Modal Trigger Button */}
                    <div className="text-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center text-biz-600 font-bold hover:text-biz-800 transition-colors border-b-2 border-biz-200 hover:border-biz-600 pb-1"
                        >
                            <i className="fas fa-info-circle mr-2"></i>
                            深入了解愜易居的獨特價值
                        </button>
                    </div>
                </div>
            </section>

            {/* Solutions */}
            {/* Concept Transformation - Hub & Spoke */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-snug">
                                愜易居：將「固定人事成本」<br />轉化為「彈性營運產能」
                            </h2>
                            <p className="text-xl text-gray-500">
                                忘掉聘請「一個人」，開始思考獲取「能力的時數」。
                            </p>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                            {/* Left Text */}
                            <div className="lg:w-1/2 space-y-8">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <i className="fas fa-check-circle text-biz-500 text-2xl"></i>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">隨需應變 (On-Demand)</h3>
                                        <p className="text-gray-600">只在需要時，為需要的技能付費。將固定開銷轉為變動成本。</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <i className="fas fa-check-circle text-biz-500 text-2xl"></i>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">風險外包 (Risk Outsourced)</h3>
                                        <p className="text-gray-600">我們處理勞健保、勞退與所有勞資問題。您完全避免勞資糾紛與高額罰款的風險。</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <i className="fas fa-check-circle text-biz-500 text-2xl"></i>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">職能多元 (Diverse Skills)</h3>
                                        <p className="text-gray-600">一筆預算，解鎖整個團隊的能力。</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Visual - Abstract Diagram */}
                            <div className="lg:w-1/2 flex items-center justify-center relative">
                                <div className="relative z-10 w-48 h-48 bg-white rounded-full shadow-[0_0_40px_rgba(14,165,233,0.15)] flex flex-col items-center justify-center border-4 border-biz-100">
                                    <div className="text-3xl font-bold text-biz-600 tracking-widest text-center leading-tight">愜<br />易居</div>
                                </div>
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-6">
                                    {/* Connecting Lines would be complex in pure CSS, using simple cards for now */}
                                </div>
                                <div className="flex flex-col gap-6 ml-8">
                                    <div className="bg-white border border-gray-100 shadow-md p-4 rounded-xl flex items-center w-48 transform translate-x-4">
                                        <div className="text-gray-400 text-2xl mr-4"><i className="fas fa-folder-open"></i></div>
                                        <span className="font-bold text-gray-700">行政</span>
                                    </div>
                                    <div className="bg-white border border-gray-100 shadow-md p-4 rounded-xl flex items-center w-48">
                                        <div className="text-gray-400 text-2xl mr-4"><i className="fas fa-palette"></i></div>
                                        <span className="font-bold text-gray-700">設計</span>
                                    </div>
                                    <div className="bg-white border border-gray-100 shadow-md p-4 rounded-xl flex items-center w-48 transform translate-x-4">
                                        <div className="text-gray-400 text-2xl mr-4"><i className="fas fa-box"></i></div>
                                        <span className="font-bold text-gray-700">物流</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Teams - What team do you need today? */}
            <section id="solutions" className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-gray-900">今天，你需要什麼樣的團隊？</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Admin */}
                        <div className="flex flex-col h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-teal-600 mb-6 text-6xl"><i className="fas fa-folder"></i></div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">行政與財務</h3>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Admin & Finance</h4>
                            <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                                會計助理、行政總務、客服、資料建檔...
                            </p>
                            <p className="text-teal-600 text-sm italic font-medium mt-auto bg-teal-50 p-4 rounded-lg">
                                “別讓固定的薪資成本吃掉您的創業跑道。您只需為『執行』付費。”
                            </p>
                        </div>
                        {/* E-commerce */}
                        <div className="flex flex-col h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-teal-600 mb-6 text-6xl"><i className="fas fa-box-open"></i></div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">電商與物流</h3>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">E-commerce & Logistics</h4>
                            <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                                理貨包裝、倉儲管理、堆高機操作員...
                            </p>
                            <p className="text-teal-600 text-sm italic font-medium mt-auto bg-teal-50 p-4 rounded-lg">
                                “雙11爆單是開心的事，別讓『出貨太慢』變成負評的開始。”
                            </p>
                        </div>
                        {/* Design */}
                        <div className="flex flex-col h-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-teal-600 mb-6 text-6xl"><i className="fas fa-palette"></i></div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">設計與行銷</h3>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Design & Marketing</h4>
                            <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                                平面美編、社群小編、短影音製作...
                            </p>
                            <p className="text-teal-600 text-sm italic font-medium mt-auto bg-teal-50 p-4 rounded-lg">
                                “流量很貴，別讓糟糕的圖片浪費廣告費。我們的美編懂『賣貨邏輯』。”
                            </p>
                        </div>
                        {/* More Button */}
                        <div className="flex flex-col h-full items-center justify-center p-8">
                            <button
                                onClick={() => setIsServiceSpecsModalOpen(true)}
                                className="group w-full h-full min-h-[300px] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:border-biz-500 hover:bg-biz-50 transition-all duration-300 p-8 text-center"
                            >
                                <div className="w-20 h-20 bg-gray-100 group-hover:bg-white rounded-full flex items-center justify-center mb-6 transition-colors shadow-sm">
                                    <i className="fas fa-plus text-3xl text-gray-400 group-hover:text-biz-600"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-700 group-hover:text-biz-800 mb-2">更多專業職能</h3>
                                <p className="text-gray-500 text-sm mb-6 group-hover:text-gray-600">(And more...)</p>
                                <span className="text-biz-600 font-bold border-b border-biz-600 pb-1 group-hover:text-biz-800 group-hover:border-biz-800">
                                    依照您的需求客製化人力模組
                                </span>
                                <div className="mt-6 bg-biz-600 text-white py-2 px-6 rounded-lg text-sm font-bold shadow-md transform group-hover:-translate-y-1 transition-transform">
                                    瞭解更多愜易居的職能規範
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20 bg-biz-900 text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold">愜易居營運模組對企業的三大核心價值</h2>
                        <p className="text-biz-300 mt-4 text-xl">省錢、省事、省風險</p>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
                        {/* Non-Member */}
                        {/* How We Save You Money Link - Image Version */}
                        {/* How We Save You Money Card */}
                        <button
                            onClick={() => setIsCostComparisonModalOpen(true)}
                            className="bg-sky-50 p-8 rounded-xl border border-sky-100 flex-1 hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer flex flex-col items-center justify-center group text-left w-full md:w-auto relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sky-200 to-transparent -mr-10 -mt-10 rounded-full opacity-50"></div>

                            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-sky-200 transition-colors">
                                <i className="fas fa-hand-holding-usd text-3xl text-sky-600"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">愜易居如何幫企業戶省錢</h3>
                            <p className="text-lg text-gray-500 text-center leading-relaxed font-medium">
                                把固定人事成本，<br />變成可控的營運資源。
                            </p>
                            <div className="mt-8 text-sky-600 font-bold flex items-center bg-white px-6 py-2 rounded-full border border-sky-200 group-hover:border-sky-400 transition-colors shadow-sm">
                                <i className="fas fa-chart-pie mr-2"></i> 查看成本效益分析
                            </div>
                        </button>

                        {/* How We Save You Trouble Card - Standard */}
                        <button
                            onClick={() => setIsSaveTroubleModalOpen(true)}
                            className="bg-white p-8 rounded-xl border border-gray-100 flex-1 hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer flex flex-col items-center justify-center group text-left w-full md:w-auto relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-100 to-transparent -mr-10 -mt-10 rounded-full opacity-50"></div>
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-100 transition-colors">
                                <i className="fas fa-cogs text-3xl text-green-600"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">愜易居營運模組如何幫您省事</h3>
                            <p className="text-lg text-gray-500 text-center leading-relaxed font-medium">
                                把傳統用人營運，<br />變成可控的模組化事務。
                            </p>
                            <div className="mt-8 text-green-600 font-bold flex items-center bg-green-50 px-6 py-2 rounded-full border border-green-200 group-hover:border-green-400 transition-colors">
                                <i className="fas fa-tasks mr-2"></i> 查看營運效益分析
                            </div>
                        </button>

                        {/* How We Save You Risk Card - PRO */}
                        <button
                            onClick={() => setIsSaveRiskModalOpen(true)}
                            className="bg-rose-50 p-8 rounded-xl border border-rose-100 flex-1 hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer flex flex-col items-center justify-center group text-left w-full md:w-auto relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-200 to-transparent -mr-10 -mt-10 rounded-full opacity-50"></div>
                            {/* Recommended Badge */}
                            <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>

                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-rose-200 transition-colors">
                                <i className="fas fa-shield-alt text-3xl text-rose-600"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">愜易居營運模組如何幫您省風險</h3>
                            <p className="text-lg text-gray-500 text-center leading-relaxed font-medium">
                                風險之所以可怕，<br />是因為『您從未知道它』。
                            </p>
                            <div className="mt-8 text-rose-600 font-bold flex items-center bg-white px-6 py-2 rounded-full border border-rose-200 group-hover:border-rose-400 transition-colors shadow-sm">
                                <i className="fas fa-search-plus mr-2"></i> 查看風險控制分析
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* Trust Footnote */}
            <div className="bg-gray-50 py-8 border-t border-gray-200">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
                        <button
                            onClick={() => setIsContactModalOpen(true)}
                            className="font-bold text-gray-700 hover:text-biz-600 transition-colors border-b-2 border-transparent hover:border-biz-600"
                        >
                            聯繫愜易居
                        </button>
                        <span className="hidden md:inline text-gray-300">|</span>
                        <span>點籽響有限公司</span>
                        <span className="hidden md:inline text-gray-300">|</span>
                        <span>統一編號 93366453</span>
                        <span className="hidden md:inline text-gray-300">|</span>
                        <span>登記地址：新北市林口區仁愛路二段502號12樓</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <span><i className="fas fa-shield-alt mr-1"></i> 100% 合規申報</span>
                            <span><i className="fas fa-file-invoice-dollar mr-1"></i> 實開統一發票</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessPage;
