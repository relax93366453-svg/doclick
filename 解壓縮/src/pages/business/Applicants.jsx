import React, { useState } from 'react';
import { MOCK_APPLICANTS } from '../../constants/businessData';

const Applicants = () => {
    const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
    const [filterStatus, setFilterStatus] = useState('all');

    const handleStatusChange = (id, newStatus) => {
        setApplicants(prev => prev.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
        ));
    };

    const filteredApplicants = filterStatus === 'all'
        ? applicants
        : applicants.filter(app => app.status === filterStatus);

    const getStatusColor = (status) => {
        switch (status) {
            case '待審閱': return 'bg-yellow-100 text-yellow-800';
            case '面試中': return 'bg-blue-100 text-blue-800';
            case '已錄取': return 'bg-green-100 text-green-800';
            case '已婉拒': return 'bg-gray-100 text-gray-500';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">應徵者管理</h2>
                    <p className="text-gray-500 text-sm mt-1">管理各職缺的應徵進度與狀態</p>
                </div>
                <div className="flex gap-2">
                    {['all', '待審閱', '面試中', '已錄取'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${filterStatus === status
                                    ? 'bg-biz-600 text-white font-bold shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {status === 'all' ? '全部' : status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">應徵者</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">應徵職缺</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">應徵日期</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">狀態</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">動作</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredApplicants.map((applicant) => (
                                <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-biz-100 flex items-center justify-center text-biz-700 font-bold border border-biz-200">
                                                    {applicant.avatar}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{applicant.name}</div>
                                                <div className="text-xs text-gray-500">view profile</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{applicant.job}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{applicant.date}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(applicant.status)}`}>
                                            {applicant.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {applicant.status === '待審閱' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(applicant.id, '面試中')}
                                                    className="text-biz-600 hover:text-biz-900 mr-3 font-bold"
                                                >
                                                    安排面試
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(applicant.id, '已婉拒')}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    婉拒
                                                </button>
                                            </>
                                        )}
                                        {applicant.status === '面試中' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(applicant.id, '已錄取')}
                                                    className="text-green-600 hover:text-green-900 mr-3 font-bold"
                                                >
                                                    錄取
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(applicant.id, '已婉拒')}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    不錄取
                                                </button>
                                            </>
                                        )}
                                        {(applicant.status === '已錄取' || applicant.status === '已婉拒') && (
                                            <span className="text-gray-400 cursor-not-allowed">已結案</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredApplicants.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        目前沒有符合條件的應徵者
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applicants;
