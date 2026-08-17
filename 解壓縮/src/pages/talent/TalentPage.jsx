import React from 'react';
import { Link } from 'react-router-dom';
import { loadApplicantProfile } from '../../helpers/applicantProfile';

// Profile card component showing applicant status
const ProfileCard = () => {
  const profile = loadApplicantProfile();
  return (
    <div className="bg-white border rounded p-4 shadow">
      <h2 className="text-xl font-bold mb-2">我的履歷</h2>
      {profile ? (
        <div className="flex justify-between items-center">
          <span>{profile.name || '未命名'}</span>
          <Link to="/talent/profile" className="text-blue-600 hover:underline">查看／編輯履歷</Link>
        </div>
      ) : (
        <span>尚未建立</span>
      )}
    </div>
  );
};

// Simple info card used for illustration steps
const InfoCard = ({ title, description }) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const TalentPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-[1100px] bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">找到適合你的工作</h1>
        <p className="text-gray-600 mb-6 text-center">先完成個人履歷，應徵職缺時就能快速帶入資料。</p>
        <div className="flex justify-center gap-4 mb-8">
          <Link
            to="/talent/profile"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            建立我的履歷
          </Link>
          <Link
            to="/jobs"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition"
          >
            瀏覽工作機會
          </Link>
        </div>
        {/* Applicant profile status card */}
        <ProfileCard />
        {/* Explanation cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <InfoCard title="建立履歷" description="快速建立個人履歷，讓求職更順利。" />
          <InfoCard title="搜尋工作" description="依照條件搜尋合適職缺。" />
          <InfoCard title="快速應徵" description="一鍵帶入資料即完成應徵。" />
        </div>
        {/* Footer note */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          目前履歷儲存在此裝置，正式雲端帳號與跨裝置同步功能設定中。
        </footer>
      </div>
    </div>
  );
};

export default TalentPage;
