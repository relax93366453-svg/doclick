import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: '短期', // 短期, 長期, 專案
        location: '',
        rate: '',
        period: 'hour', // hour, month, case
        description: '',
        requirements: '',
        tags: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        console.log("Posting job:", formData);

        setTimeout(() => {
            setLoading(false);
            alert("職缺發布成功！");
            navigate('/business/dashboard');
        }, 1000);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">發布新職缺</h2>
                <p className="text-gray-500 text-sm mt-1">填寫下方資訊以開始招募人才</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">職缺名稱</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="例如：週末活動工讀生"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biz-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">工作類型</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biz-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="短期">短期兼職</option>
                                <option value="長期">長期兼職</option>
                                <option value="專案">專案外包</option>
                                <option value="正職">全職工作</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">薪資待遇</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    name="rate"
                                    required
                                    value={formData.rate}
                                    onChange={handleChange}
                                    placeholder="200"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biz-500 focus:border-transparent outline-none transition-all"
                                />
                                <select
                                    name="period"
                                    value={formData.period}
                                    onChange={handleChange}
                                    className="w-1/3 px-2 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                                >
                                    <option value="hour">/ 時</option>
                                    <option value="month">/ 月</option>
                                    <option value="case">/ 件</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">工作地點</label>
                            <input
                                type="text"
                                name="location"
                                required
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="例如：台北市信義區"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biz-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">工作內容描述</label>
                        <textarea
                            name="description"
                            required
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="請詳細說明工作職責..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biz-500 focus:border-transparent outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">需求條件</label>
                        <textarea
                            name="requirements"
                            rows="3"
                            value={formData.requirements}
                            onChange={handleChange}
                            placeholder="列出期望的技能或經驗..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biz-500 focus:border-transparent outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">標籤 (以逗號分隔)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="例如：現領, 無經驗可, 供餐"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-biz-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/business/dashboard')}
                            className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-2.5 bg-biz-600 text-white font-bold rounded-lg shadow-lg shadow-biz-500/30 transition-all transform active:scale-95 flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-biz-700'}`}
                        >
                            {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-paper-plane mr-2"></i>}
                            確認發布
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default PostJob;
