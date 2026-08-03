import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_STATS, RECENT_ACTIVITIES } from '../../constants/businessData';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">總覽儀表板</h2>
                    <p className="text-gray-500 text-sm mt-1">查看您的招聘成效與最新動態</p>
                </div>
                <button
                    onClick={() => navigate('/business/post-job')}
                    className="bg-biz-600 hover:bg-biz-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-biz-500/20 flex items-center transition-all"
                >
                    <i className="fas fa-plus mr-2"></i> 發布新職缺
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_STATS.map((stat, index) => (
                    <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                            <div className={`text-xs font-bold flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                <i className={`fas fa-arrow-${stat.trend} mr-1`}></i>
                                {stat.change} <span className="text-gray-400 font-normal ml-1">較上月</span>
                            </div>
                        </div>
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${index === 0 ? 'bg-blue-50 text-blue-600' :
                                index === 1 ? 'bg-purple-50 text-purple-600' :
                                    index === 2 ? 'bg-orange-50 text-orange-600' :
                                        'bg-green-50 text-green-600'
                            }`}>
                            <i className={stat.icon}></i>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                        <i className="fas fa-history text-biz-500 mr-2"></i> 近期動態
                    </h3>
                    <div className="space-y-4">
                        {RECENT_ACTIVITIES.map(activity => (
                            <div key={activity.id} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg transition-colors border-b last:border-0 border-gray-50">
                                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${activity.type === 'apply' ? 'bg-blue-500' :
                                        activity.type === 'system' ? 'bg-gray-400' :
                                            'bg-green-500'
                                    }`}></div>
                                <div className="flex-1">
                                    <p className="text-gray-800 text-sm font-medium">{activity.message}</p>
                                    <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                                </div>
                                <button className="text-gray-400 hover:text-biz-600 text-sm">
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 text-center text-sm text-biz-600 hover:text-biz-700 font-bold py-2">
                        查看所有通知
                    </button>
                </div>

                {/* Quick Tips / Call to Action */}
                <div className="bg-gradient-to-br from-biz-600 to-biz-800 rounded-xl shadow-lg p-6 text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 backdrop-blur-sm">
                        <i className="fas fa-crown"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-2">升級企業會員</h3>
                    <p className="text-biz-100 text-sm mb-6 leading-relaxed">
                        解鎖更多進階功能，包含無限職缺發布、AI 人才推薦與專屬顧問服務。
                    </p>
                    <button className="bg-white text-biz-700 w-full py-2.5 rounded-lg font-bold hover:bg-biz-50 transition-colors shadow-lg">
                        了解方案詳情
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
