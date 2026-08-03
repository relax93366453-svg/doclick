import React from 'react';

const ConsultationModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[70] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up relative overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">預約諮詢</h2>
                        <p className="text-gray-500 text-xs mt-1">掃描 QR Code 立即聯繫專人</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200">
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 bg-white flex flex-col items-center justify-center">
                    <div className="w-64 h-64 bg-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center mb-6">
                        <img
                            src="/images/consultation_qr.png"
                            alt="預約諮詢 QR Code"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <p className="text-center text-gray-600 font-medium">
                        請使用 Line 掃描上方行動條碼<br />
                        將由專人為您服務
                    </p>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-biz-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-biz-700 transition-colors shadow-md w-full"
                    >
                        關閉視窗
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConsultationModal;
