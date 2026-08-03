import React from 'react';

const ContactModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[70] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">聯繫愜易居</h2>
                        <p className="text-gray-500 text-sm mt-1">我們期待與您的合作</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-10 bg-gray-100 flex flex-col items-center gap-8">
                    {/* Card 1: Info */}
                    <div className="w-full max-w-2xl shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-[1.01] duration-300">
                        <img
                            src="/images/contact_card_info.png"
                            alt="愜易居服務資訊"
                            className="w-full h-auto object-contain bg-white"
                        />
                    </div>

                    {/* Card 2: QR Codes */}
                    <div className="w-full max-w-2xl shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-[1.01] duration-300">
                        <img
                            src="/images/contact_card_qr.png"
                            alt="愜易居 QR Code"
                            className="w-full h-auto object-contain bg-white"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white flex justify-center sticky bottom-0 z-10">
                    <button
                        onClick={onClose}
                        className="bg-gray-800 text-white px-8 py-2 rounded-lg font-bold hover:bg-gray-900 transition-colors shadow-lg"
                    >
                        關閉
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
