import React from 'react';

const InfoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 modal-overlay backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full relative z-10 overflow-hidden animate-slide-up flex flex-col md:flex-row">

                {/* Left Side: Visual/Brand */}
                <div className="md:w-1/3 bg-biz-900 text-white p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">愜易居價值主張</h3>
                        <div className="h-1 w-10 bg-biz-500 mb-6"></div>
                        <p className="text-biz-200 text-sm leading-relaxed">
                            我們致力於重新定義企業與人才的關係，透過數據與科技，創造雙贏的勞動力生態。
                        </p>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <i className="fas fa-quote-left text-biz-700 text-4xl mb-4 block"></i>
                        <p className="font-serif italic text-lg">讓您的企業專注於偉大，瑣碎交給我們。</p>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="md:w-2/3 p-8 md:p-10 relative bg-gray-50">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-500 transition-colors"
                    >
                        <i className="fas fa-times"></i>
                    </button>

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <i className="fas fa-hands-helping text-xl"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">1. 愜易居如何幫助中小企業主？</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    我們充當您的「第二個人資部」。從繁瑣的招募篩選、教育訓練到薪資結算、勞健保申報，愜易居一站式全包。讓您擺脫行政泥沼，專注於核心業務發展與營收成長。
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                <i className="fas fa-fingerprint text-xl"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">2. 我們如何與眾不同？</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    不同於傳統派遣的買斷或高抽成，我們採用創新的「訂閱制」與「點數經濟」。費用透明、調度靈活，且我們 100% 承擔法定雇主責任，讓您在享受彈性人力的同時，完全合規且零法律風險。
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <i className="fas fa-rocket text-xl"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">3. 為什麼企業主需要愜易居？</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    在缺工與少子化時代，擁有「彈性算力」是企業生存的關鍵。透過愜易居，您可以將固定的人事成本轉化為變動的算力成本，隨訂隨用，將經營風險降至最低，保持企業最高的靈活度。
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-right">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-biz-900 text-white rounded hover:bg-biz-800 transition-colors text-sm font-bold"
                        >
                            了解了，謝謝
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
