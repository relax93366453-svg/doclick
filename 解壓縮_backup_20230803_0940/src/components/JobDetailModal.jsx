import React from 'react';

const JobDetailModal = ({ job, onClose, onApply }) => {
    if (!job) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Background backdrop */}
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">

                    {/* Header */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
                        <div className="sm:flex sm:items-start justify-between">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl leading-6 font-bold text-gray-900" id="modal-title">
                                            {job.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded font-bold ${job.type === '短期' ? 'bg-blue-50 text-blue-600' :
                                            job.type === '長期' ? 'bg-green-50 text-green-600' :
                                                'bg-purple-50 text-purple-600'
                                        }`}>
                                        {job.type}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                type="button"
                                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <span className="sr-only">Close</span>
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded">
                                <div className="text-xs text-gray-500 mb-1">薪資待遇</div>
                                <div className="font-bold text-talent-600 text-lg">${job.rate} <span className="text-xs text-gray-400">/ hr</span></div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <div className="text-xs text-gray-500 mb-1">工作地點</div>
                                <div className="font-bold text-gray-800 text-sm truncate">{job.location}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <div className="text-xs text-gray-500 mb-1">上工日期</div>
                                <div className="font-bold text-gray-800 text-sm">{job.date}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <div className="text-xs text-gray-500 mb-1">排班需求</div>
                                <div className="font-bold text-gray-800 text-sm">每週至少 12hr</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2 border-l-4 border-talent-500 pl-2">工作內容</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    <li>負責現場活動引導與秩序維護。</li>
                                    <li>協助物資搬運與場地佈置 (需搬重物)。</li>
                                    <li>即時回應顧客詢問，提供優質服務體驗。</li>
                                    <li>主管交辦事項。</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-2 border-l-4 border-talent-500 pl-2">需求條件</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    <li>不限經驗，具備服務熱忱者佳。</li>
                                    <li>守時觀念強，不無故缺席。</li>
                                    <li>需具備基礎英文溝通能力 (加分)。</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-2 border-l-4 border-talent-500 pl-2">福利制度</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {job.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-talent-50 text-talent-700 text-xs rounded">
                                            {tag}
                                        </span>
                                    ))}
                                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">勞健保</span>
                                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">加班費</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-talent-600 text-base font-medium text-white hover:bg-talent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-talent-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => onApply(job)}
                        >
                            立即應徵
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            取消
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetailModal;
