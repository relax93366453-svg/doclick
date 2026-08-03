import React from 'react';

const LandingScreen = ({ onSelect }) => {
    return (
        <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden">
            {/* B Side */}
            <div
                className="relative w-full md:w-1/2 h-1/2 md:h-full bg-biz-900 text-white flex flex-col justify-center items-center p-10 cursor-pointer transition-all duration-500 ease-in-out md:hover:w-[55%] group"
                onClick={() => onSelect('business')}
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="z-10 text-center">
                    <div className="inline-block px-3 py-1 border border-biz-500 text-biz-400 text-xs tracking-widest mb-4 rounded-full uppercase">For Enterprise</div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 group-hover:scale-105 transition-transform">我是企業</h2>
                    <p className="text-gray-300 mb-8 max-w-sm mx-auto">尋找穩定、合規、可訂閱的勞動力算力？<br />這裏是您的第二個人資部。</p>
                    <button className="px-8 py-3 bg-biz-600 hover:bg-biz-500 rounded-lg font-bold transition-colors shadow-lg shadow-biz-900/50">
                        進入企業解決方案 <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>

            {/* C Side */}
            <div
                className="relative w-full md:w-1/2 h-1/2 md:h-full bg-talent-50 text-gray-800 flex flex-col justify-center items-center p-10 cursor-pointer transition-all duration-500 ease-in-out md:hover:w-[55%] group border-t md:border-t-0 md:border-l border-gray-200"
                onClick={() => onSelect('talent')}
            >
                {/* Talent Side Badge */}
                <div className="absolute top-6 left-6 z-50 pointer-events-none text-left">
                    <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-lg shadow-md flex items-baseline">
                        <span className="font-bold text-gray-900 text-3xl tracking-wider">愜易居</span>
                        <span className="text-gray-600 text-lg ml-3 font-medium">- 靈活就業平臺 x 人才養育培訓</span>
                    </div>
                </div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="z-10 text-center">
                    <div className="inline-block px-3 py-1 bg-talent-100 text-talent-800 text-xs tracking-widest mb-4 rounded-full uppercase">For Talent</div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-talent-900 group-hover:scale-105 transition-transform">我是人才</h2>
                    <p className="text-gray-600 mb-8 max-w-sm mx-auto">不只是打工，而是經營職涯。<br />解鎖地圖，累積你的未來資產。</p>
                    <button className="px-8 py-3 bg-talent-600 hover:bg-talent-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-talent-500/30">
                        啟動職涯地圖 <i className="fas fa-map-marker-alt ml-2"></i>
                    </button>
                </div>
            </div>

            {/* Logo Overlay */}
            <div className="absolute top-6 left-6 z-50 pointer-events-none">
                <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-lg shadow-md flex items-baseline">
                    <span className="font-bold text-gray-900 text-3xl tracking-wider">愜易居</span>
                    <span className="text-gray-600 text-lg ml-3 font-medium">- 營運模組規劃 x 靈活就業平臺</span>
                </div>
            </div>
        </div>
    );
};

export default LandingScreen;
