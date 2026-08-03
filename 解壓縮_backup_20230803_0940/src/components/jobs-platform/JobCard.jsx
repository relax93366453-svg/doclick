import React from 'react';

const JobCard = ({ job, onView }) => {
  return (
    <div className="p-4 border rounded shadow hover:shadow-md transition-shadow bg-white">
      <h3 className="font-semibold text-lg">{job.title}</h3>
      <p className="text-sm text-gray-600">{job.location} | {job.type}</p>
      <p className="text-orange-600 font-bold">{job.salary}</p>
      <button
        onClick={onView}
        className="mt-2 inline-block px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
      >
        查看職缺
      </button>
    </div>
  );
};

export default JobCard;
