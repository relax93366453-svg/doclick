// src/pages/talent/Applications.jsx
// 「我的應徵紀錄」頁
// 資料來源：Talent API getApplications(sessionToken)
// 職缺名稱/公司/地點：嘗試從 JobPosts API 補齊（以 jobId 對照）
//
// Session 處理：
// - 任何 session 相關錯誤 → forceSessionExpired() → 清除全 localStorage → Navbar 立即切換

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApplications } from '../../api/talent';
import { fetchPublishedJobs } from '../../api/jobs';
import {
  isApplicantLoggedIn,
  getSessionToken,
  forceSessionExpired,
  isSessionError,
} from '../../helpers/authHelper';
import MemberNavbar from '../../components/MemberNavbar';

// ── Status badge ───────────────────────────────────────────────────────────────
const STATUS_MAP = {
  pending:      { label: '待處理',   cls: 'bg-amber-100 text-amber-700' },
  contacted:    { label: '已聯絡',   cls: 'bg-blue-100 text-blue-700' },
  interviewing: { label: '面試中',   cls: 'bg-purple-100 text-purple-700' },
  hired:        { label: '錄取',     cls: 'bg-green-100 text-green-700' },
  rejected:     { label: '未錄取',   cls: 'bg-red-100 text-red-600' },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status || '待處理', cls: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ── Date formatter ─────────────────────────────────────────────────────────────
function fmtDate(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;
  return d.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

// ═════════════════════════════════════════════════════════════════════════════
const Applications = () => {
  const navigate = useNavigate();
  const [apps, setApps]           = useState([]);
  const [jobMap, setJobMap]       = useState({});
  const [loading, setLoading]     = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [error, setError]         = useState('');

  // ── Auth guard (token missing at render time) ──
  useEffect(() => {
    if (!isApplicantLoggedIn()) {
      navigate('/login?next=/talent/applications', { replace: true });
    }
  }, [navigate]);

  // ── Fetch applications + job metadata ──
  useEffect(() => {
    const token = getSessionToken();
    if (!token) return;

    Promise.all([
      getApplications(token),
      fetchPublishedJobs().catch(() => []),
    ])
      .then(([appResult, jobList]) => {
        if (!appResult.success) {
          const msg = appResult.error || '';

          // ── Session invalidation: clear state + notify Navbar ──
          if (isSessionError(msg)) {
            forceSessionExpired(); // clears localStorage + dispatches event
            setSessionExpired(true);
            return;
          }

          setError(msg || '載入應徵紀錄失敗，請稍後再試。');
          return;
        }

        // Build jobId → job info map from public JobPosts API
        const map = {};
        jobList.forEach(j => {
          map[String(j.id)] = {
            title:    j.title    || '未知職缺',
            company:  j.company  || '—',
            location: j.location || '—',
          };
        });
        setJobMap(map);

        // Sort newest first
        const sorted = [...(appResult.applications || [])].sort(
          (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
        );
        setApps(sorted);
      })
      .catch(err => {
        console.error('Applications fetch error:', err.message);
        setError('載入時發生錯誤，請稍後再試。');
      })
      .finally(() => setLoading(false));
  }, []);

  // Helper: get job info – first try jobMap, then resumeSnapshot fallback
  const getJobInfo = (app) => {
    const fromMap = jobMap[String(app.jobId)];
    if (fromMap) return fromMap;
    return {
      title:    app.jobTitle    || `職缺 ID: ${app.jobId}`,
      company:  app.company     || '—',
      location: app.location    || '—',
    };
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-talent-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">載入應徵紀錄中…</p>
        </div>
      </div>
    );
  }

  // ── Session expired — full-page message with re-login button ──
  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-12 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-lock text-red-400 text-2xl" />
          </div>
          <h2 className="font-bold text-gray-800 text-lg mb-2">登入已過期</h2>
          <p className="text-gray-500 text-sm mb-6">請重新登入以查看您的應徵紀錄。</p>
          <Link
            to="/login?next=/talent/applications"
            className="inline-block w-full py-2.5 bg-talent-600 text-white rounded-xl text-sm font-medium hover:bg-talent-700 transition-colors text-center"
          >
            重新登入
          </Link>
          <Link to="/jobs" className="block mt-3 text-sm text-gray-400 hover:text-talent-600 transition-colors">
            返回找工作
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/talent" className="font-bold text-lg text-talent-600 flex-shrink-0">愜易居</Link>
            <span className="text-gray-300 hidden sm:block">|</span>
            <span className="text-sm text-gray-500 hidden sm:block">我的應徵紀錄</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/jobs" className="text-sm text-gray-500 hover:text-talent-600 hidden sm:block transition-colors">找工作</Link>
            <Link to="/talent/profile" className="text-sm text-gray-500 hover:text-talent-600 hidden sm:block transition-colors">我的履歷</Link>
            <MemberNavbar />
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">我的應徵紀錄</h1>
          <p className="text-sm text-gray-500 mt-1">共 {apps.length} 筆投遞紀錄</p>
        </div>

        {/* Generic error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* Empty state */}
        {!error && apps.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-16 text-center">
            <div className="w-16 h-16 bg-talent-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-paper-plane text-talent-400 text-2xl" />
            </div>
            <p className="text-gray-700 font-semibold text-base mb-2">目前還沒有應徵紀錄</p>
            <p className="text-gray-400 text-sm mb-6">投遞職缺後，每筆應徵紀錄將顯示在此。</p>
            <Link
              to="/jobs"
              className="inline-block px-6 py-2.5 bg-talent-600 text-white rounded-xl text-sm font-medium hover:bg-talent-700 transition-colors"
            >
              開始找工作 →
            </Link>
          </div>
        )}

        {/* Application cards */}
        {apps.length > 0 && (
          <div className="space-y-3">
            {apps.map(app => {
              const info = getJobInfo(app);
              return (
                <div
                  key={app.applicationId}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:shadow-md transition-shadow"
                >
                  {/* Job info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="font-semibold text-gray-800 text-sm truncate">{info.title}</h2>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-xs text-gray-500">
                      {info.company}
                      {info.location && info.location !== '—' ? ` · ${info.location}` : ''}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      <i className="fas fa-calendar-alt mr-1" />
                      應徵日期：{fmtDate(app.appliedAt)}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0">
                    <Link
                      to={`/jobs?openJob=${app.jobId}`}
                      className="inline-flex items-center gap-1.5 text-xs text-talent-600 border border-talent-300 px-3 py-1.5 rounded-lg hover:bg-talent-50 transition-colors font-medium"
                    >
                      <i className="fas fa-external-link-alt text-xs" />
                      查看職缺
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-8 text-center">
          <Link to="/jobs" className="text-sm text-talent-600 hover:underline">
            ← 返回找工作
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Applications;
