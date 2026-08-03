import React from 'react';

const JobDetailModal = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
        <p className="text-gray-600 mb-1">位置: {job.location}</p>
        <p className="text-gray-600 mb-1">類型: {job.type}</p>
        <p className="text-orange-600 font-semibold mb-3">薪資: {job.salary}</p>
        <p className="text-gray-700">{job.description}</p>
      </div>
    </div>
  );
};

export default JobDetailModal;
