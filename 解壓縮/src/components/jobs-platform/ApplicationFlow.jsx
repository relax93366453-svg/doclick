// src/components/jobs-platform/ApplicationFlow.jsx
// 當已登入會員點「立即應徵」時顯示此元件。
// 流程：
//   1. 載入雲端履歷（getResume）
//   2. 顯示履歷摘要 + 完成度提示
//   3. 確認投遞 → createApplication

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getResume, createApplication } from '../../api/talent';
import {
  getSessionToken,
  forceSessionExpired,
  isSessionError,
} from '../../helpers/authHelper';

// ── Completion checker（和 Profile.jsx 保持一致邏輯，無需 import） ──
function calcPct(resume) {
  if (!resume) return 0;
  const checks = [
    r => !!r.name?.trim(),
    r => !!r.title?.trim(),
    r => !!r.location?.trim(),
    r => !!r.phone?.trim(),
    r => !!r.email?.trim(),
    r => !!r.photo,
    r => (r.bio?.trim().length || 0) >= 30,
    r => (r.education?.length || 0) >= 1,
    r => (r.workExperience?.length || 0) >= 1,
    r => !!r.jobPreferences?.desiredTitle?.trim(),
    r => (r.jobPreferences?.desiredLocations?.length || 0) >= 1,
    r => !!r.jobPreferences?.salary,
    r => (r.skills?.length || 0) >= 2,
  ];
  // weights matching Profile.jsx: 10,5,5,5,5,5,10,10,15,10,5,5,10 = 100
  const weights = [10, 5, 5, 5, 5, 5, 10, 10, 15, 10, 5, 5, 10];
  const earned = checks.reduce((s, fn, i) => s + (fn(resume) ? weights[i] : 0), 0);
  return Math.min(100, earned);
}

// ── UI helpers ────────────────────────────────────────────────────────────────
const Row = ({ label, value }) =>
  value ? (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-400 w-24 flex-shrink-0">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  ) : null;

// ═════════════════════════════════════════════════════════════════════════════
const ApplicationFlow = ({ job, onClose }) => {
  const [step, setStep] = useState('loading'); // loading | noResume | lowCompletion | confirm | submitting | done
  const [resume, setResume] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [submitResult, setSubmitResult] = useState(null);
  const [pct, setPct] = useState(0);

  // ── Load cloud resume on open ──
  useEffect(() => {
    const token = getSessionToken();
    if (!token) {
      setStep('noResume');
      return;
    }
    getResume(token)
      .then(result => {
        // GAS getResume returns { success, resumeJson } — not result.resume
        const raw = result.resumeJson ?? result.resume ?? null;
        if (!result.success) {
          if (isSessionError(result.error)) {
            forceSessionExpired();
          }
          setStep('noResume');
          return;
        }
        if (raw) {
          const loaded = typeof raw === 'string' ? JSON.parse(raw) : raw;
          const p = calcPct(loaded);
          setResume(loaded);
          setPct(p);
          setStep(p >= 80 ? 'confirm' : 'lowCompletion');
        } else {
          setStep('noResume');
        }
      })
      .catch(err => {
        console.warn('ApplicationFlow getResume failed:', err.message);
        setLoadError('無法載入履歷，請重試或前往編輯履歷後再投遞。');
        setStep('noResume');
      });
  }, []);

  // ── Submit application ──
  const handleConfirm = async () => {
    const token = getSessionToken();
    if (!token) { setSubmitResult({ success: false, error: '請先登入再投遞。' }); setStep('done'); return; }
    setStep('submitting');
    try {
      const result = await createApplication(token, job.id);
      if (!result.success && result.error) {
        // Translate known English error messages
        let errCn = result.error;
        const e = result.error.toLowerCase();
        if (e.includes('already exists') || e.includes('already applied')) {
          errCn = '您已應徵過此職缺，請勿重複投遞。';
        } else if (e.includes('resume not found') || e.includes('no resume')) {
          errCn = '找不到履歷，請先前往「我的履歷」建立履歷後再投遞。';
        } else if (e.includes('session') || e.includes('not logged')) {
          errCn = '登入已過期，請重新登入後再投遞。';
        }
        setSubmitResult({ success: false, error: errCn });
      } else {
        setSubmitResult(result);
      }
    } catch (err) {
      setSubmitResult({ success: false, error: '網路異常，請稍後重試。' });
      console.error('createApplication error:', err.message);
    }
    setStep('done');
  };

  // ── Progress bar color ──
  const barColor = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400';
  const pctColor = pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-500';

  // ── Resume summary ──
  const ResumePreview = () => {
    if (!resume) return null;
    const latestWork = resume.workExperience?.[0];
    const latestEdu  = resume.education?.[0];
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
        {resume.photo && (
          <img src={resume.photo} alt="大頭照" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow mb-2" />
        )}
        <Row label="姓名" value={resume.name} />
        <Row label="目前職稱" value={resume.title} />
        <Row label="所在地" value={resume.location} />
        <Row label="聯絡電話" value={resume.phone} />
        <Row label="Email" value={resume.email} />
        {latestWork && <Row label="最近工作" value={`${latestWork.title} @ ${latestWork.company}`} />}
        {latestEdu  && <Row label="最高學歷" value={`${latestEdu.school}${latestEdu.major ? ` ${latestEdu.major}` : ''} ${latestEdu.degree}`} />}
        {resume.jobPreferences?.desiredTitle && (
          <Row label="希望職稱" value={resume.jobPreferences.desiredTitle} />
        )}
        {(resume.skills?.length > 0) && (
          <div className="flex gap-1.5 flex-wrap mt-1">
            {resume.skills.slice(0, 5).map((s, i) => (
              <span key={i} className="text-xs bg-talent-100 text-talent-700 px-2 py-0.5 rounded-full">{s}</span>
            ))}
            {resume.skills.length > 5 && (
              <span className="text-xs text-gray-400">+{resume.skills.length - 5}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  // ── Render steps ──────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (step) {
      case 'loading':
        return (
          <div className="flex flex-col items-center py-10 gap-3">
            <div className="w-8 h-8 border-4 border-talent-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">載入履歷中…</p>
          </div>
        );

      case 'noResume':
        return (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
              <i className="fas fa-file-alt text-amber-400 text-2xl" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-base">尚未建立履歷</p>
              <p className="text-sm text-gray-500 mt-1">
                {loadError || '投遞前請先前往「我的履歷」完成基本資料，讓企業更快了解您。'}
              </p>
            </div>
            <Link
              to="/talent/profile"
              className="inline-block px-6 py-2.5 bg-talent-600 text-white rounded-xl text-sm font-medium hover:bg-talent-700 transition-colors"
              onClick={onClose}
            >
              立即建立履歷 →
            </Link>
            <p className="text-xs text-gray-400">完成履歷後回到此頁即可投遞</p>
          </div>
        );

      case 'lowCompletion':
        return (
          <div className="py-4 space-y-5">
            {/* Completion warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-info-circle text-amber-500" />
                <p className="text-sm font-semibold text-amber-700">履歷完成度 {pct}%，建議補齊後再投遞</p>
              </div>
              <div className="w-full bg-amber-100 rounded-full h-2 mb-2">
                <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-amber-600">
                履歷越完整，企業主越容易聯絡您。建議達 80% 後再投遞，但您仍可選擇現在投遞。
              </p>
            </div>

            <ResumePreview />

            {/* Job info */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1.5">即將應徵</p>
              <p className="font-bold text-gray-800">{job.title}</p>
              <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
            </div>

            <div className="flex gap-2">
              <Link
                to="/talent/profile"
                onClick={onClose}
                className="flex-1 py-2.5 border border-talent-600 text-talent-600 text-sm rounded-xl text-center hover:bg-talent-50 transition-colors font-medium"
              >
                先完善履歷
              </Link>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 bg-talent-600 text-white text-sm rounded-xl hover:bg-talent-700 transition-colors font-medium"
              >
                仍要投遞
              </button>
            </div>
          </div>
        );

      case 'confirm':
        return (
          <div className="py-4 space-y-4">
            {/* Completion badge */}
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <div className={`text-lg font-bold ${pctColor}`}>{pct}%</div>
              <div className="flex-1">
                <div className="w-full bg-green-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span className="text-xs text-green-600 font-medium">✓ 建議可投遞</span>
            </div>

            {/* Resume preview */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">您的履歷摘要</p>
              <ResumePreview />
            </div>

            {/* Job info */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1.5">即將應徵職缺</p>
              <p className="font-bold text-gray-800">{job.title}</p>
              <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
              {job.rate && <p className="text-sm text-talent-600 font-semibold mt-1">${job.rate}/hr</p>}
            </div>

            <p className="text-xs text-gray-400 text-center">
              確認送出後，您的履歷將提供給愜易居人員進行媒合。
              如需修改履歷，請先
              <Link to="/talent/profile" onClick={onClose} className="text-talent-600 underline mx-1">前往履歷頁</Link>
              再回來投遞。
            </p>

            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors">
                取消
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 bg-talent-600 text-white text-sm rounded-xl hover:bg-talent-700 transition-colors font-medium"
              >
                確認投遞
              </button>
            </div>
          </div>
        );

      case 'submitting':
        return (
          <div className="flex flex-col items-center py-10 gap-3">
            <div className="w-8 h-8 border-4 border-talent-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">投遞中…</p>
          </div>
        );

      case 'done':
        return (
          <div className="py-8 text-center space-y-4">
            {submitResult?.success ? (
              <>
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                  <i className="fas fa-check text-green-500 text-2xl" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-base">投遞成功！</p>
                  <p className="text-sm text-gray-500 mt-1">
                    已成功應徵 <strong>{job.title}</strong>，我們將在媒合完成後與您聯繫。
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                  <i className="fas fa-times text-red-400 text-2xl" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-base">投遞失敗</p>
                  <p className="text-sm text-gray-500 mt-1">{submitResult?.error || '發生未知錯誤，請稍後重試。'}</p>
                </div>
              </>
            )}
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-talent-600 text-white rounded-xl text-sm font-medium hover:bg-talent-700 transition-colors"
            >
              關閉
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-gray-800">
            {step === 'done' ? (submitResult?.success ? '✅ 投遞完成' : '❌ 投遞失敗') : '立即應徵'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <i className="fas fa-times" />
          </button>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ApplicationFlow;
