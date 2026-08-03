import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear auth state if any (future implementation)
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex text-gray-800">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-biz-900 text-white transition-transform duration-300 transform md:translate-x-0 -translate-x-full z-30">
                <div className="flex items-center justify-center h-16 border-b border-biz-700">
                    <span className="text-2xl font-bold tracking-wider">愜易居 <span className="text-xs font-normal text-biz-400">Biz</span></span>
                </div>
                <nav className="p-4 space-y-2">
                    <NavLink
                        to="/business/dashboard"
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded transition-colors ${isActive ? 'bg-biz-700 text-white' : 'text-biz-200 hover:bg-biz-800 hover:text-white'}`}
                    >
                        <i className="fas fa-th-large w-6"></i>
                        <span>總覽儀表板</span>
                    </NavLink>
                    <NavLink
                        to="/business/post-job"
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded transition-colors ${isActive ? 'bg-biz-700 text-white' : 'text-biz-200 hover:bg-biz-800 hover:text-white'}`}
                    >
                        <i className="fas fa-plus-circle w-6"></i>
                        <span>發布職缺</span>
                    </NavLink>
                    <NavLink
                        to="/business/applicants"
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded transition-colors ${isActive ? 'bg-biz-700 text-white' : 'text-biz-200 hover:bg-biz-800 hover:text-white'}`}
                    >
                        <i className="fas fa-users w-6"></i>
                        <span>應徵者管理</span>
                    </NavLink>
                    <NavLink
                        to="/business/profile"
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded transition-colors ${isActive ? 'bg-biz-700 text-white' : 'text-biz-200 hover:bg-biz-800 hover:text-white'}`}
                    >
                        <i className="fas fa-cog w-6"></i>
                        <span>企業設定</span>
                    </NavLink>
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-biz-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 text-biz-200 hover:text-white w-full transition-colors"
                    >
                        <i className="fas fa-sign-out-alt w-6"></i>
                        <span>登出</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-20">
                    <div className="text-gray-500 text-sm">
                        歡迎回來，<span className="font-bold text-gray-800">天際行銷股份有限公司</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-400 hover:text-biz-600 relative">
                            <i className="fas fa-bell text-lg"></i>
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-biz-100 flex items-center justify-center text-biz-700 font-bold">
                                T
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
