import React from 'react';

const WorkEntryCard = ({ title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <span className="text-lg font-medium text-gray-800">{title}</span>
    </button>
  );
};

export default WorkEntryCard;
