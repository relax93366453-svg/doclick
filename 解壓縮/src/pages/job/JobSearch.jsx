import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_JOBS } from '../../constants/jobs';
import JobDetailModal from '../../components/JobDetailModal';
import SearchBar from '../../components/jobs-platform/SearchBar';
import SectionTitle from '../../components/jobs-platform/SectionTitle';
import WorkEntryCard from '../../components/jobs-platform/WorkEntryCard';
import {
  urgentJobs,
  shortTermJobs,
  tasks,
  popularCategories,
} from '../../components/jobs-platform/mockData';
import { Link } from 'react-router-dom';

// ------------------------------------------------------------------
// Data for static sections (news, banners, keywords, quick entries, etc.)
// ------------------------------------------------------------------
const newsTabs = [
  {
    id: 'dispatch',
    label: '派遣快訊',
    title: '最新派遣職缺與資訊',
    description: '最新派遣職缺、急徵班次、合作企業消息與報名提醒',
    items: [
      '本週新增桃園地區派遣職缺',
      '急徵短期班次即將開放',
      '合作企業派遣需求說明',
    ],
  },
  {
    id: 'newcomer',
    label: '新人報到',
    title: '新人報到流程與指南',
    description: '報到流程、履歷填寫、面試準備與上班注意事項',
    items: [],
  },
  {
    id: 'schedule',
    label: '排班資訊',
    title: '排班與班次資訊',
    description: '今日可報班、本週班次、短期支援與臨時缺額',
    items: [],
  },
  {
    id: 'career',
    label: '職涯成長',
    title: '職涯成長與福利',
    description: '累積工時、薪級制度、福利補助與正職轉換機會',
    items: [],
  },
];

const activityBanners = [
  {
    title: '本週急徵派遣人才',
    description: '桃園、台北、新北多項職缺開放報名',
    buttonText: '查看派遣職缺',
    link: '/jobs',
    image: '/images/jobs/resume-banner.jpg',
  },
  {
    title: '企業快速找人才',
    description: '派遣、臨時班次與專案支援一次媒合',
    buttonText: '我要找人才',
    link: '/business',
    image: '/images/jobs/business-banner.jpg',
  },
];

const hotKeywords = [
  '無經驗可',
  '立即上班',
  '彈性排班',
  '短期派遣',
  '長期派遣',
  '日班',
  '夜班',
  '週領',
  '桃園職缺',
];

const quickEntries = [
  {
    id: 'dispatch',
    title: '找派遣工作',
    icon: 'fas fa-briefcase',
    description: '依地區與職類快速媒合',
  },
  {
    id: 'today',
    title: '今日可報班',
    icon: 'fas fa-calendar-day',
    description: '查看今天與近期可上班班次',
  },
  {
    id: 'stable',
    title: '長期穩定派遣',
    icon: 'fas fa-clock',
    description: '尋找固定班別與穩定工時',
  },
  {
    id: 'business',
    title: '企業找人才',
    icon: 'fas fa-building',
    description: '快速媒合合適派遣人員',
    link: '/business',
  },
];

const recommendTabs = [
  { id: 'dispatch', label: '派遣推薦' },
  { id: 'today', label: '今日可報班' },
  { id: 'urgent', label: '急徵職缺' },
  { id: 'stable', label: '長期穩定' },
  { id: 'noexp', label: '無經驗可' },
  { id: 'weekly', label: '週領職缺' },
  { id: 'fulltime', label: '正職機會' },
  { id: 'task', label: '任務接案' },
];

// SmallCard component – used in featured area
const SmallCard = ({ job }) => (
  <div className="border rounded-lg p-3 bg-white shadow-sm flex flex-col justify-between h-full">
    <div>
      <h4 className="font-bold text-sm mb-1">{job.title}</h4>
      <p className="text-xs text-gray-500">{job.location}</p>
      <span className="text-talent-600 font-medium text-sm">${job.rate}/hr</span>
    </div>
    <div className="mt-1">
      <span className="text-xs bg-talent-100 text-talent-600 px-2 py-0.5 rounded">{job.type}</span>
    </div>
  </div>
);

const JobSearch = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all');
  const [selectedRegions, setSelectedRegions] = useState([]); // array of city/district strings
  const [keyword, setKeyword] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [filterOpen, setFilterOpen] = useState(true);
  const [activeInfoTab, setActiveInfoTab] = useState(newsTabs[0].id);
  const [activeRecommendTab, setActiveRecommendTab] = useState('dispatch');

  const jobListRef = useRef(null);

  const filteredJobs = MOCK_JOBS.filter(job => {
    const safeTitle = typeof job.title === 'string' ? job.title : '';
    const safeLocation = typeof job.location === 'string' ? job.location : '';
    const safeType = typeof job.type === 'string' ? job.type : '';
    let ok = true;
    if (filterType !== 'all') {
      ok = ok && safeType === filterType;
    }
    if (keyword.trim()) {
      ok = ok && safeTitle.includes(keyword.trim());
    }
    if (Array.isArray(selectedRegions) && selectedRegions.length > 0) {
      const matchesRegion = selectedRegions.some(reg => safeLocation.includes(reg));
      ok = ok && matchesRegion;
    }
    return ok;
  });

  const handleApply = job => {
    alert(`已成功應徵職缺：${job.title}`);
    setSelectedJob(null);
  };

  const handleSearch = ({ keyword: kw = '', locations = [], type: tp = '' }) => {
    setKeyword(kw);
    if (tp) {
      const typeMap = {
        fulltime: '短期',
        dispatch: '長期',
        temp: '臨時班',
        task: '任務',
      };
      setFilterType(typeMap[tp] || 'all');
    }
    const safeLocations = Array.isArray(locations) ? locations : [];
    setSelectedRegions(safeLocations);
    jobListRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderJobCards = jobs => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {jobs.map(job => (
        <WorkEntryCard key={job.id} title={job.title} onClick={() => setSelectedJob(job)} />
      ))}
    </div>
  );

  const getRecommendJobs = () => {
    switch (activeRecommendTab) {
      case 'dispatch':
        return urgentJobs;
      case 'today':
        return shortTermJobs;
      case 'urgent':
        return urgentJobs;
      case 'stable':
        return MOCK_JOBS.filter(job => job.type === '長期');
      case 'noexp':
        return MOCK_JOBS.filter(job => job.title && job.title.includes('無經驗')).slice(0, 8);
      case 'weekly':
        return MOCK_JOBS.filter(job => job.rate && job.rate >= 400).slice(0, 8);
      case 'fulltime':
        return MOCK_JOBS.filter(job => job.type === '短期').slice(0, 8);
      case 'task':
        return tasks;
      default:
        return filteredJobs.slice(0, 8);
    }
  };

  const activeNews = newsTabs.find(tab => tab.id === activeInfoTab);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`\n        .fixed.inset-0.bg-black.bg-opacity-50 { z-index: 9999 !important; }\n        .bg-white.rounded-lg.w-11\\/12, .bg-white.rounded-lg.w-3\\/4, .bg-white.rounded-lg.max-w-2xl { z-index: 10000 !important; }\n        .activityBannerContainer { z-index: 0 !important; }\n      `}</style>

      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} onApply={handleApply} />

      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/talent')}>
            <span className="font-bold text-xl text-talent-600 tracking-wider">愜易居</span>
            <span className="text-xs text-gray-400 ml-2 border-l pl-2">Job Seeker</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-talent-600 relative">
              <i className="fas fa-bell" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-talent-100 rounded-full flex items-center justify-center text-talent-700 font-bold border border-talent-200">
              A
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-[#FFF7E6] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">找到適合你的派遣工作</h1>
          <p className="text-lg text-gray-600 mb-6">彈性排班、穩定派遣、短期班次與正職機會，一站完成媒合。</p>
          <SearchBar onSearch={handleSearch} />
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {hotKeywords.map((kw, idx) => (
              <button
                key={idx}
                className="text-sm text-talent-600 bg-white border border-talent-200 rounded-full px-3 py-1 hover:bg-talent-100"
                onClick={() => handleSearch({ keyword: kw })}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex border-b mb-4">
            {newsTabs.map(tab => (
              <button
                key={tab.id}
                className={`mr-4 pb-2 ${activeInfoTab === tab.id ? 'border-b-2 border-talent-600 text-talent-600' : 'text-gray-600'}`}
                onClick={() => setActiveInfoTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{activeNews.title}</h2>
          <p className="text-gray-600 mb-4">{activeNews.description}</p>
          {activeNews.items && activeNews.items.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {activeNews.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-5 italic">尚未有相關訊息。</p>
          )}
        </div>
        <div className="space-y-6">
          {activityBanners.map((banner, idx) => (
            <Link
              key={idx}
              to={banner.link}
              className="block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <div className="relative h-48 flex items-center bg-gradient-to-r from-talent-500 to-talent-600">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <div className="relative z-10 p-4 text-white">
                  <h3 className="text-lg font-bold">{banner.title}</h3>
                  <p className="text-sm mb-2">{banner.description}</p>
                  <button className="mt-2 bg-white text-talent-600 px-4 py-1 rounded">
                    {banner.buttonText}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickEntries.map(entry => (
            <div
              key={entry.id}
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                if (entry.id === 'dispatch') setFilterType('長期');
                else if (entry.id === 'today') setFilterType('短期');
                else if (entry.id === 'stable') setFilterType('長期');
                else if (entry.id === 'business') navigate('/business');
              }}
            >
              <i className={`${entry.icon} text-3xl text-talent-600 mb-2`} />
              <h3 className="font-bold text-lg mb-1">{entry.title}</h3>
              <p className="text-sm text-gray-500">{entry.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">適合你的好工作</h2>
          <div className="flex flex-wrap gap-2">
            {recommendTabs.map(tab => (
              <button
                key={tab.id}
                className={`px-3 py-1 rounded-full text-sm ${activeRecommendTab === tab.id ? 'bg-talent-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActiveRecommendTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {renderJobCards(getRecommendJobs())}
      </section>

      <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-[260px] shrink-0 hidden md:block">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">篩選條件</h3>
              <button className="text-xs text-gray-500" onClick={() => { setFilterType('all'); setSelectedRegions([]); setKeyword(''); }}>
                清除
              </button>
            </div>
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">工作類型</h4>
              <div className="space-y-2">
                {['短期', '長期', '專案', '排班'].map(type => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jobType"
                      checked={filterType === type}
                      onChange={() => setFilterType(type)}
                      className="text-talent-600"
                    />
                    <span className="text-sm text-gray-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">地區</h4>
              <div className="space-y-2">
                {['新北市', '台北市', '桃園市'].map(reg => (
                  <label key={reg} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="region"
                      checked={selectedRegions.includes(reg)}
                      onChange={() => setSelectedRegions([reg])}
                      className="text-talent-600"
                    />
                    <span className="text-sm text-gray-600">{reg}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="md:hidden mb-4">
          <button
            className="w-full text-left px-4 py-2 border rounded"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            {filterOpen ? '收合篩選' : '展開篩選'}
          </button>
          {filterOpen && (
            <div className="bg-white p-4 rounded-lg shadow-md mt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">篩選條件</h3>
                <button className="text-xs text-gray-500" onClick={() => { setFilterType('all'); setSelectedRegions([]); setKeyword(''); }}>
                  清除
                </button>
              </div>
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">工作類型</h4>
                <div className="space-y-2">
                  {['短期', '長期', '專案', '排班'].map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="jobTypeMobile"
                        checked={filterType === type}
                        onChange={() => setFilterType(type)}
                        className="text-talent-600"
                      />
                      <span className="text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">地區</h4>
                <div className="space-y-2">
                  {['新北市', '台北市', '桃園市'].map(reg => (
                    <label key={reg} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="regionMobile"
                        checked={selectedRegions.includes(reg)}
                        onChange={() => setSelectedRegions([reg])}
                        className="text-talent-600"
                      />
                      <span className="text-sm text-gray-600">{reg}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <main className="flex-grow" ref={jobListRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col gap-2">
              {urgentJobs.slice(0, 2).map(job => (
                <SmallCard key={job.id} job={job} />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {shortTermJobs.slice(0, 2).map(job => (
                <SmallCard key={job.id} job={job} />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {tasks.slice(0, 2).map(job => (
                <SmallCard key={job.id} job={job} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">最新職缺 ({filteredJobs.length})</h2>
            <select className="border rounded p-1 text-sm">
              <option>最新上架</option>
              <option>薪資高到低</option>
            </select>
          </div>

          <div className="grid gap-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div
                  key={job.id}
                  className="bg-white p-6 rounded-lg shadow-sm border hover:border-talent-300 transition-all cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <p className="text-sm text-gray-500">
                        {job.company} • {job.location}
                      </p>
                    </div>
                    <span className="text-talent-600 font-bold">${job.rate}/hr</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">目前沒有符合條件的工作</p>
            )}
          </div>

          <div className="mt-8 flex justify-center gap-2">
            <button className="px-4 py-2 border rounded">1</button>
            <button className="px-4 py-2 border rounded">2</button>
            <button className="px-4 py-2 border rounded">3</button>
          </div>

          <SectionTitle title="熱門工作分類" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {popularCategories.map(cat => (
              <WorkEntryCard key={cat.id} title={cat.title} onClick={() => {}} />
            ))}
          </div>

          <div className="text-center my-8">
            <Link
              to="/business"
              className="inline-block bg-talent-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-talent-700 transition"
            >
              企業找人才
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobSearch;
