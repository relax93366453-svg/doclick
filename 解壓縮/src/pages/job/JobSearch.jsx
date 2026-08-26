// src/pages/job/JobSearch.jsx
// 「找工作」頁 — 重新設計版
// ・桌機：頂部快速篩選 chips + 左側固定篩選面板 + 右側職缺列表
// ・手機：快速篩選橫向滑動 + 「篩選」按鈕展開 drawer
// ・不修改 API、登入、應徵流程、JobPosts 資料來源

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import JobDetailModal from '../../components/JobDetailModal';
import ApplicationFlow from '../../components/jobs-platform/ApplicationFlow';
import SearchBar from '../../components/jobs-platform/SearchBar';
import { fetchPublishedJobs } from '../../api/jobs';
import { isApplicantLoggedIn } from '../../helpers/authHelper';
import MemberNavbar from '../../components/MemberNavbar';

// ── 靜態資料 ──────────────────────────────────────────────────────────────────

// 頂部快速篩選 chips
const QUICK_CHIPS = [
  { id: 'all',      label: '全部職缺',   icon: 'fas fa-th' },
  { id: 'dispatch', label: '派遣職缺',   icon: 'fas fa-briefcase' },
  { id: 'today',    label: '今日可報班', icon: 'fas fa-calendar-day' },
  { id: 'urgent',   label: '急徵職缺',   icon: 'fas fa-bolt' },
  { id: 'stable',   label: '長期穩定',   icon: 'fas fa-clock' },
  { id: 'noexp',    label: '無經驗可',   icon: 'fas fa-star' },
  { id: 'fulltime', label: '正職機會',   icon: 'fas fa-id-badge' },
];

// 左側篩選：工作性質
const JOB_NATURE_OPTIONS = ['正職', '派遣', '短期', '長期', '排班'];

// 左側篩選：工作地區
const REGION_OPTIONS = ['台北市', '新北市', '桃園市'];

// 左側篩選：薪資
const SALARY_OPTIONS = [
  { id: 'all',   label: '不限',          min: 0 },
  { id: '200',   label: '200/hr 以上',   min: 200 },
  { id: '220',   label: '220/hr 以上',   min: 220 },
  { id: '250',   label: '250/hr 以上',   min: 250 },
];

// 熱門工作分類（移到列表下方）
const HOT_CATEGORIES = [
  { id: 'admin',    label: '行政助理',   icon: 'fas fa-file-alt' },
  { id: 'retail',   label: '門市人員',   icon: 'fas fa-store' },
  { id: 'cs',       label: '客服',       icon: 'fas fa-headset' },
  { id: 'operator', label: '作業員',     icon: 'fas fa-cogs' },
  { id: 'logistics',label: '倉儲物流',   icon: 'fas fa-boxes' },
  { id: 'event',    label: '活動支援',   icon: 'fas fa-hands-helping' },
];

const JOBS_PER_PAGE = 10;

// ── 薪資數值 helper ────────────────────────────────────────────────────────────
function getJobMinSalary(job) {
  if (job?.salaryMin !== undefined && job?.salaryMin !== null && job?.salaryMin !== '') {
    const value = Number(job.salaryMin);
    return Number.isFinite(value) ? value : 0;
  }

  // 相容舊資料：rate 可能是 "210～250"、"210-250" 或單一數字。
  const match = String(job?.rate ?? '').match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

// ── 排序函式 ─────────────────────────────────────────────────────────────────
function sortJobs(jobs, sortBy) {
  const copy = [...jobs];
  if (sortBy === 'salary_desc') {
    copy.sort((a, b) => getJobMinSalary(b) - getJobMinSalary(a));
  } else {
    // 最新上架：依 id 降序（id 越大越新，或依 createdAt）
    copy.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
  }
  return copy;
}

// ── 職缺卡片 ─────────────────────────────────────────────────────────────────
const JobCard = ({ job, onClick, onApply }) => {
  const tags = [];
  if (job.type)     tags.push(job.type);
  if (job.shift)    tags.push(job.shift);
  if (job.location) tags.push(job.location);

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-talent-300 transition-all cursor-pointer p-5 flex flex-col sm:flex-row sm:items-center gap-4"
      onClick={onClick}
    >
      {/* Left: info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-800 text-base leading-snug truncate">{job.title}</h3>
        <p className="text-sm text-gray-500 mt-0.5 truncate">
          {[job.company, job.location].filter(Boolean).join(' · ')}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map((t, i) => (
            <span key={i} className="text-xs bg-talent-50 text-talent-700 border border-talent-100 px-2 py-0.5 rounded-full">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Right: salary + action */}
      <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
        {(job.rate || job.salaryMin) && (
          <span className="text-talent-600 font-bold text-base whitespace-nowrap">
            NT${job.rate || job.salaryMin}
            {job.salaryType === '時薪' || !job.salaryType ? '/hr' : ''}
          </span>
        )}
        <button
          className="text-xs font-medium border border-talent-500 text-talent-600 px-3 py-1.5 rounded-lg hover:bg-talent-50 transition-colors whitespace-nowrap"
          onClick={e => { e.stopPropagation(); onApply(job); }}
        >
          立即應徵
        </button>
      </div>
    </div>
  );
};

// ── 篩選面板（左側 / Drawer 共用） ───────────────────────────────────────────
const FilterPanel = ({ nature, setNature, regions, setRegions, salaryMin, setSalaryMin, onClear }) => {
  const toggleRegion = r =>
    setRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  return (
    <div className="space-y-6">
      {/* 清除 */}
      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-700 text-sm">篩選條件</span>
        <button onClick={onClear} className="text-xs text-talent-500 hover:underline">清除全部</button>
      </div>

      {/* 工作性質 */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">工作性質</p>
        <div className="space-y-1.5">
          {JOB_NATURE_OPTIONS.map(n => (
            <label key={n} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="nature"
                checked={nature === n}
                onChange={() => setNature(n)}
                className="accent-orange-500"
              />
              <span className="text-sm text-gray-600">{n}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="nature"
              checked={nature === ''}
              onChange={() => setNature('')}
              className="accent-orange-500"
            />
            <span className="text-sm text-gray-600">不限</span>
          </label>
        </div>
      </div>

      {/* 工作地區 */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">工作地區</p>
        <div className="space-y-1.5">
          {REGION_OPTIONS.map(r => (
            <label key={r} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={regions.includes(r)}
                onChange={() => toggleRegion(r)}
                className="accent-orange-500"
              />
              <span className="text-sm text-gray-600">{r}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 薪資 */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">薪資</p>
        <div className="space-y-1.5">
          {SALARY_OPTIONS.map(opt => (
            <label key={opt.id} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="salary"
                checked={salaryMin === opt.min}
                onChange={() => setSalaryMin(opt.min)}
                className="accent-orange-500"
              />
              <span className="text-sm text-gray-600">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
const JobSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ── API state ──
  const [apiJobs, setApiJobs] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);

  // ── Filter state ──
  const [activeChip, setActiveChip]     = useState('all');
  const [nature, setNature]             = useState('');
  const [regions, setRegions]           = useState([]);
  const [salaryMin, setSalaryMin]       = useState(0);
  const [keyword, setKeyword]           = useState('');
  const [sortBy, setSortBy]             = useState('latest');
  const [page, setPage]                 = useState(1);

  // ── Modal/Apply state ──
  const [selectedJob, setSelectedJob]   = useState(null);
  const [applyJob, setApplyJob]         = useState(null);

  // ── Mobile drawer ──
  const [drawerOpen, setDrawerOpen]     = useState(false);

  const jobListRef = useRef(null);

  // ── Fetch jobs ──
  useEffect(() => {
    fetchPublishedJobs()
      .then(jobs => {
        // 保留所有已上架 / published / active 職缺（不依賴職稱判斷類型）
        const published = jobs.filter(j => {
          const s = (j.status || '').toLowerCase().trim();
          return (
            s === 'published' ||
            s === '已上架' ||
            s === 'active' ||
            s === '上架中'
          );
        });
        setApiJobs(published);
      })
      .catch(() => setApiError(true))
      .finally(() => setApiLoading(false));
  }, []);

  // ── Auto-open from ?openJob= ──
  useEffect(() => {
    const openJobId = searchParams.get('openJob');
    if (openJobId && apiJobs.length > 0) {
      const job = apiJobs.find(j => String(j.id) === String(openJobId));
      if (job) {
        setSelectedJob(job);
        if (isApplicantLoggedIn()) setApplyJob(job);
      }
    }
  }, [apiJobs, searchParams]);

  // ── Apply handler ──
  const handleApply = job => {
    if (!isApplicantLoggedIn()) {
      navigate(`/login?nextJob=${job.id}`);
    } else {
      setApplyJob(job);
    }
  };

  // ── Search bar handler ──
  const handleSearch = ({ keyword: kw = '' }) => {
    setKeyword(kw);
    setPage(1);
    jobListRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Chip click ──
  // chip は activeChip だけを変える。左側の nature 篩選とは独立。
  // 切り替え時は nature をリセットして二重フィルタにならないようにする。
  const handleChip = chipId => {
    setActiveChip(chipId);
    setNature('');   // 左側性質篩選をリセット
    setPage(1);
  };

  // ── Clear filters ──
  const clearFilters = () => {
    setNature('');
    setRegions([]);
    setSalaryMin(0);
    setKeyword('');
    setActiveChip('all');
    setPage(1);
  };

  // ── Compute filtered jobs ──
  // 所有篩選一律依 API 欄位（job.type, job.location, job.rate, job.tags）判斷
  // 不用 job.title 猜類型
  const filteredJobs = apiJobs.filter(job => {
    const safeTitle    = typeof job.title    === 'string' ? job.title    : '';
    const safeLocation =
      typeof job.location === 'string' && job.location.trim()
        ? job.location
        : [job.city, job.district].filter(Boolean).join('');
    const safeType     = typeof job.type     === 'string' ? job.type.trim() : '';
    // tags 欄位：支援陣列或逗號分隔字串
    const tagArr = Array.isArray(job.tags)
      ? job.tags.map(t => String(t))
      : typeof job.tags === 'string'
        ? job.tags.split(/[,、]/).map(t => t.trim())
        : [];
    const hasTag = t => tagArr.some(tag => tag.includes(t));

    // ── Chip 篩選（依 API 欄位，不猜職缺名稱）──
    switch (activeChip) {
      case 'dispatch':
        if (!safeType.includes('派遣')) return false;
        break;
      case 'today':
        // 今日可報班：tag 含「今日」或「報班」，或 type 為短期
        if (!hasTag('今日') && !hasTag('報班') && !safeType.includes('短期')) return false;
        break;
      case 'urgent':
        // 急徵：tag 含「急徵」
        if (!hasTag('急徵')) return false;
        break;
      case 'stable':
        if (!safeType.includes('長期')) return false;
        break;
      case 'noexp':
        // 無經驗可：tag 含「無經驗」（優先），其次才用 title 判斷
        if (!hasTag('無經驗') && !safeTitle.includes('無經驗')) return false;
        break;
      case 'fulltime':
        if (!safeType.includes('正職')) return false;
        break;
      default:
        break; // 'all'：不過濾
    }

    // ── 左側面板篩選（依 API 欄位）──
    if (nature && !safeType.includes(nature)) return false;
    if (regions.length > 0 && !regions.some(r => safeLocation.includes(r))) return false;
    if (salaryMin > 0 && getJobMinSalary(job) < salaryMin) return false;
    if (keyword.trim() && !safeTitle.includes(keyword.trim())) return false;

    return true;
  });

  const sorted = sortJobs(filteredJobs, sortBy);
  const totalPages = Math.ceil(sorted.length / JOBS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  // ── Active filter count (for badge) ──
  const activeFilterCount = (nature ? 1 : 0) + regions.length + (salaryMin > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Modals */}
      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} onApply={handleApply} />
      {applyJob && <ApplicationFlow job={applyJob} onClose={() => setApplyJob(null)} />}

      {/* Mobile filter drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-50 transition-transform duration-300 md:hidden p-6 overflow-y-auto ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-gray-800">篩選職缺</span>
          <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-gray-700">
            <i className="fas fa-times text-lg" />
          </button>
        </div>
        <FilterPanel
          nature={nature} setNature={v => { setNature(v); setPage(1); }}
          regions={regions} setRegions={v => { setRegions(v); setPage(1); }}
          salaryMin={salaryMin} setSalaryMin={v => { setSalaryMin(v); setPage(1); }}
          onClear={clearFilters}
        />
        <button
          onClick={() => setDrawerOpen(false)}
          className="mt-6 w-full bg-talent-600 text-white py-2.5 rounded-xl font-medium hover:bg-talent-700 transition"
        >
          查看 {filteredJobs.length} 筆職缺
        </button>
      </aside>

      {/* ── Navbar ── */}
      <nav className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center cursor-pointer gap-2" onClick={() => navigate('/talent')}>
            <span className="font-bold text-xl text-talent-600 tracking-wider">愜易居</span>
            <span className="text-xs text-gray-400 border-l pl-2">找工作</span>
          </div>
          <MemberNavbar />
        </div>
      </nav>

      {/* ── Hero / SearchBar ── */}
      <section className="bg-gradient-to-b from-[#FFF7E6] to-[#FFF3DC] py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">找到適合你的工作</h1>
          <p className="text-gray-500 mb-6 text-sm">彈性排班 · 穩定派遣 · 短期班次 · 正職機會，一站完成媒合</p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* ── Quick chips ── */}
      <div className="bg-white border-b border-gray-100 sticky top-[57px] z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-2 overflow-x-auto scrollbar-hide whitespace-nowrap">
            {QUICK_CHIPS.map(chip => (
              <button
                key={chip.id}
                onClick={() => handleChip(chip.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition-colors ${
                  activeChip === chip.id
                    ? 'bg-talent-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-talent-50 hover:text-talent-600'
                }`}
              >
                <i className={`${chip.icon} text-xs`} />
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6" ref={jobListRef}>

        {/* ── Left sidebar (desktop) ── */}
        <aside className="hidden md:block w-[240px] flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-[110px]">
            <FilterPanel
              nature={nature} setNature={v => { setNature(v); setPage(1); }}
              regions={regions} setRegions={v => { setRegions(v); setPage(1); }}
              salaryMin={salaryMin} setSalaryMin={v => { setSalaryMin(v); setPage(1); }}
              onClear={clearFilters}
            />
          </div>
        </aside>

        {/* ── Right: job list ── */}
        <main className="flex-1 min-w-0">

          {/* List header */}
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Mobile filter button */}
              <button
                className="md:hidden flex items-center gap-1.5 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:border-talent-400 hover:text-talent-600 transition-colors"
                onClick={() => setDrawerOpen(true)}
              >
                <i className="fas fa-sliders-h" />
                篩選
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-talent-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <h2 className="font-bold text-gray-800 text-base">
                {activeChip === 'all' ? '全部職缺' : QUICK_CHIPS.find(c => c.id === activeChip)?.label}
                <span className="ml-1.5 text-gray-400 font-normal text-sm">({filteredJobs.length} 筆)</span>
              </h2>
            </div>
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg text-sm px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:border-talent-400"
            >
              <option value="latest">最新上架</option>
              <option value="salary_desc">薪資高到低</option>
            </select>
          </div>

          {/* API error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 mb-4">
              ⚠️ 目前無法讀取職缺資料，請稍後再試。
            </div>
          )}

          {/* Loading */}
          {apiLoading && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-talent-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Job cards */}
          {!apiLoading && (
            <>
              {paginated.length > 0 ? (
                <div className="space-y-3">
                  {paginated.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onClick={() => setSelectedJob(job)}
                      onApply={handleApply}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 px-6 py-16 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-search text-gray-300 text-2xl" />
                  </div>
                  <p className="text-gray-500 font-medium">目前沒有符合條件的工作</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm text-talent-600 hover:underline"
                  >
                    清除篩選條件
                  </button>
                </div>
              )}

              {/* Pagination — only when > 1 page */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100 transition-colors"
                  >
                    <i className="fas fa-chevron-left" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                        p === page
                          ? 'bg-talent-600 text-white'
                          : 'border hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100 transition-colors"
                  >
                    <i className="fas fa-chevron-right" />
                  </button>
                </div>
              )}

              {/* ── 熱門工作分類（列表下方）── */}
              <div className="mt-10">
                <h3 className="font-bold text-gray-700 text-base mb-4">熱門工作分類</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {HOT_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleSearch({ keyword: cat.label })}
                      className="flex flex-col items-center gap-1.5 bg-white border border-gray-100 rounded-xl py-4 px-2 hover:border-talent-300 hover:shadow-sm transition-all"
                    >
                      <div className="w-10 h-10 bg-talent-50 rounded-full flex items-center justify-center">
                        <i className={`${cat.icon} text-talent-600`} />
                      </div>
                      <span className="text-xs text-gray-600 font-medium text-center">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <Link
                  to="/business"
                  className="inline-block bg-talent-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-talent-700 transition text-sm"
                >
                  企業找人才 →
                </Link>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobSearch;
