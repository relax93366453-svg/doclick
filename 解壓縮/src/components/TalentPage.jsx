import React from 'react';
import { Link } from 'react-router-dom';
import MemberNavbar from '../components/MemberNavbar';

import { TALENT_LEVELS } from '../constants/data';

const TalentPage = ({ onBack }) => {
    return (
        <div className="bg-talent-50 min-h-screen font-sans">
            {/* Talent Nav */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center cursor-pointer" onClick={onBack}>
                        <div className="font-bold text-xl tracking-wider mr-2 text-talent-900">愜易居</div>
                        <div className="text-xs bg-talent-100 text-talent-800 px-2 py-1 rounded">靈活就業平臺 x 人才養育培訓</div>
                    </div>
                     <div className="hidden md:flex space-x-8 text-sm text-gray-600 items-center">
                         <Link to="/jobs" className="hover:text-talent-600 font-bold">找工作</Link>
                         <a href="#vision" className="hover:text-talent-600">願景</a>
                         <a href="#levels" className="hover:text-talent-600">分級制度</a>
                         <a href="#benefits" className="hover:text-talent-600">地圖卡福利</a>
                         <a href="#faq" className="hover:text-talent-600">常見問題</a>
                     </div>

                     {/* Right side – unified member navbar */}
                     <MemberNavbar />
                </div>
            </nav>

            {/* Talent Hero */}
            <header className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-talent-100 to-white z-0"></div>
                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-10 md:mb-0">
                        <span className="text-talent-600 font-bold tracking-widest uppercase text-sm bg-white px-3 py-1 rounded-full shadow-sm mb-6 inline-block">The Legend Map</span>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                            別讓工作綁住你，<br />
                            讓工作<span className="text-talent-600">配合你</span>。
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md">
                            全台首創「職涯地圖卡」制度。在這裡，我們不只發薪水，更投資你的未來。從行政到技術，從兼職到專業管家。
                        </p>
                        <div className="flex gap-4">
                            <Link to="/register" className="bg-talent-600 hover:bg-talent-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-talent-600/20 transition-all transform hover:-translate-y-1 inline-block text-center">
                                啟動職涯地圖
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative">
                        {/* Visual representation of a map/card */}
                        <div className="bg-white p-6 rounded-2xl shadow-2xl rotate-3 border-4 border-white max-w-sm mx-auto relative z-10">
                            <div className="bg-gradient-to-br from-talent-500 to-talent-600 h-40 rounded-xl mb-4 flex items-center justify-center text-white relative overflow-hidden">
                                <i className="fas fa-crown text-6xl opacity-20 absolute -bottom-4 -right-4"></i>
                                <div className="text-center">
                                    <div className="text-sm opacity-80 uppercase tracking-widest">Level 5</div>
                                    <div className="text-3xl font-bold">職人傳奇</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 bg-gray-100 rounded-full w-full overflow-hidden">
                                    <div className="h-full bg-talent-500 w-3/4"></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 font-medium">
                                    <span>XP: 1500 hrs</span>
                                    <span>Next: Partner</span>
                                </div>
                                <div className="pt-4 grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
                                    <div className="bg-gray-50 p-2 rounded"><i className="fas fa-home text-talent-500 mb-1 block"></i>購屋補貼</div>
                                    <div className="bg-gray-50 p-2 rounded"><i className="fas fa-graduation-cap text-talent-500 mb-1 block"></i>進修金</div>
                                    <div className="bg-gray-50 p-2 rounded"><i className="fas fa-baby text-talent-500 mb-1 block"></i>子女補助</div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute -bottom-8 left-20 w-20 h-20 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    </div>
                </div>
            </header>

            {/* Levels */}
            <section id="levels" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-10">愜易居是什麼環境</h2>
                        <div className="bg-talent-50/80 rounded-3xl p-8 md:p-14 shadow-sm border border-talent-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-talent-200 rounded-full opacity-20 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>

                            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-bold mb-8">
                                在愜易居，不只是接班賺錢，<br className="hidden md:block" />
                                而是把每一小時都變成你的<span className="text-talent-600">職涯資產</span>。
                            </p>
                            <p className="text-lg text-gray-600 leading-loose text-justify md:text-center">
                                你可以彈性排班，也可以選擇走向更穩定的工時與升遷路徑。愜易居不是把你丟到案場就不管，我們有制度、有主管、有照護，讓你在不同工作場域依然能被<span className="text-gray-800 font-bold border-b-2 border-talent-300">保護</span>、被<span className="text-gray-800 font-bold border-b-2 border-talent-300">培養</span>、被<span className="text-gray-800 font-bold border-b-2 border-talent-300">看見</span>。
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 mt-20">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
                            你會很適合愜易居，<br className="md:hidden" />如果你符合以下其中一項：
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8 mb-16">
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-4">
                                        <i className="fas fa-check text-green-600 text-sm"></i>
                                    </div>
                                    <p className="text-gray-700 text-lg">想要<span className="font-bold text-gray-900">彈性排班</span>，但仍希望有制度與照護，而不是隨便找零工</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-4">
                                        <i className="fas fa-check text-green-600 text-sm"></i>
                                    </div>
                                    <p className="text-gray-700 text-lg">想累積一套可被承認的<span className="font-bold text-gray-900">工作資歷與信用</span></p>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-4">
                                        <i className="fas fa-check text-green-600 text-sm"></i>
                                    </div>
                                    <p className="text-gray-700 text-lg">想要<span className="font-bold text-gray-900">更穩定的工時與收入區間</span>，不想每週都在賭有沒有班</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-4">
                                        <i className="fas fa-check text-green-600 text-sm"></i>
                                    </div>
                                    <p className="text-gray-700 text-lg">想把派遣當成<span className="font-bold text-gray-900">職涯跳板</span>，未來有機會轉正或晉升幹部</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-4">
                                        <i className="fas fa-check text-green-600 text-sm"></i>
                                    </div>
                                    <p className="text-gray-700 text-lg">重視尊重、溝通與<span className="font-bold text-gray-900">職場倫理</span>，希望在規則清楚的環境工作</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 border-l-4 border-red-400 p-6 md:p-8 rounded-r-xl">
                            <div className="flex items-start">
                                <i className="fas fa-exclamation-triangle text-red-400 text-2xl mr-4 mt-1"></i>
                                <div>
                                    <h3 className="text-xl font-bold text-red-800 mb-2">如果你只想 “有空就做、臨時取消也沒差”</h3>
                                    <p className="text-red-700 leading-relaxed">
                                        愜易居可能不適合你。我們重視<span className="font-bold">信用與專業</span>，因為這會決定你能不能接到好案場、拿到更穩定的派班與福利。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section id="benefits" className="py-20 bg-talent-900 text-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/3">
                            <h2 className="text-3xl font-bold mb-6">不只是打工<br />是你的生涯加速器</h2>
                            <p className="text-talent-200 mb-8 leading-relaxed">
                                我們知道你有夢想，可能想當設計師、想開咖啡廳、或正在準備國考。愜易居提供的不只是薪水，而是支持你追夢的資源。
                            </p>
                            <button className="text-white border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-talent-900 transition-colors">
                                查看完整福利手冊
                            </button>
                        </div>
                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                                <i className="fas fa-chart-line text-3xl text-talent-400 mb-4"></i>
                                <h3 className="font-bold text-lg mb-2">快速加薪機制</h3>
                                <p className="text-sm text-gray-300">每累積 175 小時工時，即啟動調薪評估。你的努力，系統都看得到。</p>
                            </div>
                            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                                <i className="fas fa-tools text-3xl text-talent-400 mb-4"></i>
                                <h3 className="font-bold text-lg mb-2">生產力工具買單</h3>
                                <p className="text-sm text-gray-300">達標者由公司補助 Adobe Creative Cloud、ChatGPT Plus 等專業工具訂閱費。</p>
                            </div>
                            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                                <i className="fas fa-home text-3xl text-talent-400 mb-4"></i>
                                <h3 className="font-bold text-lg mb-2">安家計畫</h3>
                                <p className="text-sm text-gray-300">傳奇等級享購屋補貼資格、子女學費補助與父母健檢津貼。</p>
                            </div>
                            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                                <i className="fas fa-shield-alt text-3xl text-talent-400 mb-4"></i>
                                <h3 className="font-bold text-lg mb-2">100% 法規保障</h3>
                                <p className="text-sm text-gray-300">我們最基本的堅持。勞保、健保、勞退6% 絕對足額提撥，不玩文字遊戲。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">常見問題</h2>
                        <p className="text-gray-500 mt-4">你可能會想知道的事</p>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Q1：我一定要每天上班嗎？</h3>
                            <p className="text-gray-600">不一定。你可以彈性排班；如果你希望收入更穩，我們也有更穩定的派班節奏與方案。</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Q2：薪資怎麼算？何時發薪？</h3>
                            <p className="text-gray-600">依工作時數與加成規則計算，固定發薪日（可在入職說明中清楚告知）。</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Q3：有勞健保嗎？</h3>
                            <p className="text-gray-600">有！依照勞基法給予基本該有的保障（入職時會說明適用條件與方式）。</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Q4：遇到案場不尊重或不合理要求怎麼辦？</h3>
                            <p className="text-gray-600">你有保母與直屬窗口可即時回報，公司會介入處理。</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Q5：我沒有經驗可以做嗎？</h3>
                            <p className="text-gray-600">可以。部分職能有新人訓練與上工支持。</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Q6：什麼是地圖卡等級？</h3>
                            <p className="text-gray-600">你在愜易居的工時會終身累積，達到門檻就升級並解鎖福利與機會。</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Q7：我能從派遣變成正職嗎？</h3>
                            <p className="text-gray-600">可以。我們提供清楚的累積與轉正路徑，讓你用表現爭取轉正，而不是只靠一次面試。</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Q8：會不會很不穩定、沒班上？</h3>
                            <p className="text-gray-600">我們會依你的參與程度與履約狀況提供不同派班優先權；越穩定的人越能拿到穩定的派班。</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Q9：我可以介紹朋友加入嗎？</h3>
                            <p className="text-gray-600">可以，並有對應的介紹獎勵與制度。</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Q10：我要怎麼開始？</h3>
                            <p className="text-gray-600">點擊「立即加入」，填寫資料後我們會聯繫你安排下一步。</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TalentPage;
