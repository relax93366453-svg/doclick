import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('talent'); // talent or business
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Register attempt:", { ...formData, role });
        // Redirect to appropriate dashboard
        navigate(role === 'talent' ? '/jobs' : '/business/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center text-3xl font-bold text-gray-900 tracking-wider mb-2">
                    愜易居
                </Link>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    建立您的帳戶
                </h2>
                <div className="mt-2 text-center text-sm text-gray-600">
                    <span className="mr-2">已經有帳號？</span>
                    <Link to="/login" className="font-medium text-talent-600 hover:text-talent-500">
                        直接登入
                    </Link>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* Role Selection */}
                    <div className="flex gap-4 mb-6">
                        <div
                            className={`flex-1 p-4 border rounded-lg cursor-pointer text-center transition-all ${role === 'talent' ? 'border-talent-500 bg-talent-50 text-talent-700' : 'border-gray-200 hover:border-gray-300'}`}
                            onClick={() => setRole('talent')}
                        >
                            <i className="fas fa-user mb-2 text-xl block"></i>
                            <div className="font-bold text-sm">我是求職者</div>
                        </div>
                        <div
                            className={`flex-1 p-4 border rounded-lg cursor-pointer text-center transition-all ${role === 'business' ? 'border-biz-500 bg-biz-50 text-biz-700' : 'border-gray-200 hover:border-gray-300'}`}
                            onClick={() => setRole('business')}
                        >
                            <i className="fas fa-building mb-2 text-xl block"></i>
                            <div className="font-bold text-sm">我是企業主</div>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                {role === 'talent' ? '真實姓名' : '公司名稱'}
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-talent-500 focus:border-talent-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email 信箱
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-talent-500 focus:border-talent-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                設定密碼
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-talent-500 focus:border-talent-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${role === 'talent' ? 'bg-talent-600 hover:bg-talent-700 focus:ring-talent-500' : 'bg-biz-600 hover:bg-biz-700 focus:ring-biz-500'}`}
                            >
                                註冊{role === 'talent' ? '會員' : '企業帳戶'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
