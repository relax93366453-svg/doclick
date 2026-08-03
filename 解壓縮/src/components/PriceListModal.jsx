import React from 'react';

const PriceListModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-6 text-center" id="modal-title">
                                    2026年報價單
                                </h3>
                                <div className="mt-4 overflow-x-auto">
                                    <table className="min-w-full border-collapse border border-gray-300 text-sm text-center">
                                        <thead>
                                            <tr className="bg-blue-100 text-gray-800 font-bold">
                                                <th className="border border-gray-300 p-3">項目</th>
                                                <th className="border border-gray-300 p-3">購買總點數<br /><span className="text-xs font-normal">(1 小時 = 1 點)</span></th>
                                                <th className="border border-gray-300 p-3">點數包價格 (含稅)</th>
                                                <th className="border border-gray-300 p-3">每點均價</th>
                                                <th className="border border-gray-300 p-3">愜易居標準會員</th>
                                                <th className="border border-gray-300 p-3">愜易居PRO企業會員</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Membership Fees - Green Background */}
                                            <tr className="bg-green-100 font-bold">
                                                <td className="border border-gray-300 p-3">半年會員費</td>
                                                <td className="border border-gray-300 p-3"></td>
                                                <td className="border border-gray-300 p-3"></td>
                                                <td className="border border-gray-300 p-3"></td>
                                                <td className="border border-gray-300 p-3">25000</td>
                                                <td className="border border-gray-300 p-3">38000</td>
                                            </tr>
                                            <tr className="bg-green-100 font-bold">
                                                <td className="border border-gray-300 p-3">每年會員費</td>
                                                <td className="border border-gray-300 p-3"></td>
                                                <td className="border border-gray-300 p-3"></td>
                                                <td className="border border-gray-300 p-3"></td>
                                                <td className="border border-gray-300 p-3">45000</td>
                                                <td className="border border-gray-300 p-3">70000</td>
                                            </tr>

                                            {/* Plans - Pink First Column */}
                                            <tr>
                                                <td className="border border-gray-300 p-3 bg-red-100 font-bold">無購買時數 (零工派遣)</td>
                                                <td className="border border-gray-300 p-3"></td>
                                                <td className="border border-gray-300 p-3"></td>
                                                <td className="border border-gray-300 p-3 font-bold">400</td>
                                                <td className="border border-gray-300 p-3"></td>
                                                <td className="border border-gray-300 p-3"></td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 p-3 bg-red-100 font-bold">時數方案1</td>
                                                <td className="border border-gray-300 p-3 font-bold">50</td>
                                                <td className="border border-gray-300 p-3 font-bold">$17,000</td>
                                                <td className="border border-gray-300 p-3 font-bold">340</td>
                                                <td className="border border-gray-300 p-3 font-bold">320</td>
                                                <td className="border border-gray-300 p-3"></td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 p-3 bg-red-100 font-bold">時數方案2</td>
                                                <td className="border border-gray-300 p-3 font-bold">90</td>
                                                <td className="border border-gray-300 p-3 font-bold">$30,600</td>
                                                <td className="border border-gray-300 p-3 font-bold">340</td>
                                                <td className="border border-gray-300 p-3 font-bold">320</td>
                                                <td className="border border-gray-300 p-3"></td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 p-3 bg-red-100 font-bold">時數方案3</td>
                                                <td className="border border-gray-300 p-3 font-bold">120</td>
                                                <td className="border border-gray-300 p-3 font-bold">$40,800</td>
                                                <td className="border border-gray-300 p-3 font-bold">340</td>
                                                <td className="border border-gray-300 p-3 font-bold">320</td>
                                                <td className="border border-gray-300 p-3"></td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 p-3 bg-red-100 font-bold">時數方案4</td>
                                                <td className="border border-gray-300 p-3 font-bold">250</td>
                                                <td className="border border-gray-300 p-3 font-bold">$85,000</td>
                                                <td className="border border-gray-300 p-3 font-bold">340</td>
                                                <td className="border border-gray-300 p-3 font-bold">320</td>
                                                <td className="border border-gray-300 p-3 font-bold">310</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 p-3 bg-red-100 font-bold">時數方案5</td>
                                                <td className="border border-gray-300 p-3 font-bold">370</td>
                                                <td className="border border-gray-300 p-3 font-bold">$122,100</td>
                                                <td className="border border-gray-300 p-3 font-bold">330</td>
                                                <td className="border border-gray-300 p-3 font-bold">320</td>
                                                <td className="border border-gray-300 p-3 font-bold">310</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 p-3 bg-red-100 font-bold">時數方案6</td>
                                                <td className="border border-gray-300 p-3 font-bold">550</td>
                                                <td className="border border-gray-300 p-3 font-bold">$181,500</td>
                                                <td className="border border-gray-300 p-3 font-bold">330</td>
                                                <td className="border border-gray-300 p-3 font-bold">320</td>
                                                <td className="border border-gray-300 p-3 font-bold">310</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 p-3 bg-red-100 font-bold">時數方案7</td>
                                                <td className="border border-gray-300 p-3 font-bold">750</td>
                                                <td className="border border-gray-300 p-3 font-bold">$247,500</td>
                                                <td className="border border-gray-300 p-3 font-bold">330</td>
                                                <td className="border border-gray-300 p-3 font-bold">320</td>
                                                <td className="border border-gray-300 p-3 font-bold">310</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 p-3 bg-red-100 font-bold">時數方案8</td>
                                                <td className="border border-gray-300 p-3 font-bold">1000</td>
                                                <td className="border border-gray-300 p-3 font-bold">$330,000</td>
                                                <td className="border border-gray-300 p-3 font-bold">330</td>
                                                <td className="border border-gray-300 p-3 font-bold">320</td>
                                                <td className="border border-gray-300 p-3 font-bold">310</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 p-3 bg-red-100 font-bold">客製化方案</td>
                                                <td className="border border-gray-300 p-3 font-bold">專案制</td>
                                                <td className="border border-gray-300 p-3 font-bold">專案報價</td>
                                                <td className="border border-gray-300 p-3 font-bold">專案報價</td>
                                                <td className="border border-gray-300 p-3 font-bold">專案報價</td>
                                                <td className="border border-gray-300 p-3 font-bold">專案報價</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-biz-600 text-base font-medium text-white hover:bg-biz-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-biz-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            關閉
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceListModal;
