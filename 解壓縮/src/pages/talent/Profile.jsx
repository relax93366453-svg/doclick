// src/pages/talent/Profile.jsx
// ── 愜易居「我的履歷」會員履歷中心 ──
// 資料永久儲存至 GAS TalentResumes（updateResume / getResume）。
// 絕不依賴 localStorage 作為唯一資料來源。

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getResume,
  updateResume,
} from '../../api/talent';
import {
  getSessionToken,
  isApplicantLoggedIn,
  getCurrentApplicant,
  forceSessionExpired,
  isSessionError,
} from '../../helpers/authHelper';
import MemberNavbar from '../../components/MemberNavbar';

// ─── Constants ────────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'basic',       label: '個人資料', icon: 'fas fa-user-circle' },
  { id: 'education',   label: '學歷',     icon: 'fas fa-graduation-cap' },
  { id: 'work',        label: '工作經歷', icon: 'fas fa-briefcase' },
  { id: 'preferences', label: '求職條件', icon: 'fas fa-search' },
  { id: 'languages',   label: '語文能力', icon: 'fas fa-language' },
  { id: 'skills',      label: '專長',     icon: 'fas fa-star' },
  { id: 'certs',       label: '資格認證', icon: 'fas fa-certificate' },
  { id: 'bio',         label: '自傳',     icon: 'fas fa-file-alt' },
  { id: 'settings',    label: '媒合設定', icon: 'fas fa-sliders-h' },
];

const DEGREE_OPTIONS = ['高中職', '專科', '學士', '碩士', '博士', '其他'];
const WORK_TYPE_OPTIONS = ['全職', '兼職', '派遣', '實習', '短期班'];
const SHIFT_OPTIONS = ['日班', '夜班', '大夜班', '輪班', '假日班', '彈性'];
const SALARY_TYPE_OPTIONS = ['月薪', '時薪', '年薪', '面議'];
const LANG_OPTIONS = ['中文（國語）', '台語', '英文', '日文', '韓文', '泰文', '越南文', '印尼文', '其他'];
const LANG_LEVEL_OPTIONS = ['基礎', '中等', '良好', '流利', '母語'];
const TAIWAN_CITIES = [
  '台北市','新北市','基隆市','桃園市','新竹市','新竹縣','苗栗縣',
  '台中市','彰化縣','南投縣','雲林縣','嘉義市','嘉義縣','台南市',
  '高雄市','屏東縣','宜蘭縣','花蓮縣','台東縣','澎湖縣','金門縣','連江縣',
];

// ─── Default data structure ───────────────────────────────────────────────────
const DEFAULT_RESUME = {
  photo: '',
  name: '',
  title: '',
  location: '',
  phone: '',
  email: '',
  bio: '',
  education: [],
  workExperience: [],
  jobPreferences: {
    desiredTitle: '',
    desiredLocations: [],
    workType: '',
    salary: '',
    salaryType: '月薪',
    availableDate: '',
    shifts: [],
  },
  languages: [],
  skills: [],
  certifications: [],
  consentTalentPool: false,
  updatedAt: '',
};

// ─── Data safety helpers ──────────────────────────────────────────────────────
// GAS / 舊版履歷資料可能把原本應是字串的欄位存成 number / array / object。
// React 畫面不能直接對這些值呼叫 .trim()，否則會整頁崩潰。
function toText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (Array.isArray(value)) {
    return value
      .map(v => toText(v, ''))
      .filter(v => v.trim())
      .join('、');
  }

  if (typeof value === 'object') {
    const preferredKeys = [
      'name', 'title', 'label', 'value', 'text',
      'language', 'school', 'company', 'skill', 'issuer'
    ];
    for (const key of preferredKeys) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const t = toText(value[key], '');
        if (t.trim()) return t;
      }
    }
    return fallback;
  }

  return fallback;
}

const hasText = value => toText(value, '').trim().length > 0;

function parseStructured(value) {
  if (typeof value !== 'string') return value;
  const s = value.trim();
  if (!s) return value;

  if (
    (s.startsWith('[') && s.endsWith(']')) ||
    (s.startsWith('{') && s.endsWith('}'))
  ) {
    try {
      return JSON.parse(s);
    } catch {
      return value;
    }
  }
  return value;
}

function toArray(value, { splitText = false } = {}) {
  const parsed = parseStructured(value);

  if (Array.isArray(parsed)) return parsed;
  if (parsed === null || parsed === undefined || parsed === '') return [];

  if (splitText && typeof parsed === 'string') {
    return parsed
      .split(/\r?\n|、|，|,/)
      .map(v => v.trim())
      .filter(Boolean);
  }

  return [parsed];
}

function toObject(value) {
  const parsed = parseStructured(value);
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? parsed
    : {};
}

function toBool(value) {
  if (value === true || value === false) return value;
  const s = String(value ?? '').trim().toLowerCase();
  return ['true', '1', 'yes', 'y', '是', '同意'].includes(s);
}

// ─── Completion calculation ────────────────────────────────────────────────────
// Total weight = 100. 80+ is "ready to apply".
const COMPLETION_CHECKS = [
  { id: 'name',      weight: 10, label: '填寫姓名',             section: 'basic',       check: r => hasText(r?.name) },
  { id: 'title',     weight: 5,  label: '填寫目前 / 最近職稱',  section: 'basic',       check: r => hasText(r?.title) },
  { id: 'location',  weight: 5,  label: '填寫所在縣市',         section: 'basic',       check: r => hasText(r?.location) },
  { id: 'phone',     weight: 5,  label: '填寫手機號碼',         section: 'basic',       check: r => hasText(r?.phone) },
  { id: 'email',     weight: 5,  label: '填寫 Email',           section: 'basic',       check: r => hasText(r?.email) },
  { id: 'photo',     weight: 5,  label: '上傳大頭照',           section: 'basic',       check: r => hasText(r?.photo) },
  { id: 'bio',       weight: 10, label: '完善自傳（30 字以上）', section: 'bio',        check: r => toText(r?.bio).trim().length >= 30 },
  { id: 'education', weight: 10, label: '新增至少 1 筆學歷',    section: 'education',   check: r => Array.isArray(r?.education) && r.education.length >= 1 },
  { id: 'work',      weight: 15, label: '新增至少 1 筆工作經歷', section: 'work',       check: r => Array.isArray(r?.workExperience) && r.workExperience.length >= 1 },
  { id: 'dTitle',    weight: 10, label: '填寫希望職稱',         section: 'preferences', check: r => hasText(r?.jobPreferences?.desiredTitle) },
  { id: 'dLoc',      weight: 5,  label: '選擇希望工作地點',     section: 'preferences', check: r => Array.isArray(r?.jobPreferences?.desiredLocations) && r.jobPreferences.desiredLocations.length >= 1 },
  { id: 'salary',    weight: 5,  label: '填寫希望待遇',         section: 'preferences', check: r => hasText(r?.jobPreferences?.salary) },
  { id: 'skills',    weight: 10, label: '新增至少 2 項專長',    section: 'skills',      check: r => Array.isArray(r?.skills) && r.skills.length >= 2 },
];

function calcCompletion(resume) {
  const total = COMPLETION_CHECKS.reduce((s, c) => s + c.weight, 0);
  const earned = COMPLETION_CHECKS.reduce((s, c) => c.check(resume) ? s + c.weight : s, 0);
  const pct = Math.min(100, Math.round((earned / total) * 100));
  const next = COMPLETION_CHECKS.find(c => !c.check(resume));
  return { pct, next };
}

// ─── Photo helpers ────────────────────────────────────────────────────────────
// 照片會保留一份 localStorage 作即時預覽，也會壓縮成小型 JPG 後隨履歷同步到 GAS。
// 這樣內部「官網完整履歷」在不同電腦也看得到照片，同時避開 TalentResumes 40KB 限制。
const PHOTO_LS_KEY = 'doclick_resume_photo';

function savePhotoToStorage(b64) {
  try { localStorage.setItem(PHOTO_LS_KEY, b64); } catch { /* quota */ }
}
function loadPhotoFromStorage() {
  try { return localStorage.getItem(PHOTO_LS_KEY) || ''; } catch { return ''; }
}

function resizeToBase64(file, maxPx = 240, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = ev.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function compressPhotoDataUrl(dataUrl, targetChars = 12000) {
  if (!dataUrl || !String(dataUrl).startsWith('data:image/')) {
    return Promise.resolve(dataUrl || '');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      // 從正常頭像品質一路降到極小備援。
      // 舊版 Talent API 若仍只有 5000 chars 限制，也有機會自動退回成功。
      const attempts = [
        { maxPx: 180, quality: 0.68 },
        { maxPx: 160, quality: 0.60 },
        { maxPx: 140, quality: 0.52 },
        { maxPx: 120, quality: 0.45 },
        { maxPx: 100, quality: 0.38 },
        { maxPx: 84,  quality: 0.32 },
        { maxPx: 72,  quality: 0.28 },
        { maxPx: 64,  quality: 0.24 },
        { maxPx: 56,  quality: 0.22 },
        { maxPx: 48,  quality: 0.20 },
      ];

      let best = '';

      for (const attempt of attempts) {
        const ratio = Math.min(
          attempt.maxPx / img.width,
          attempt.maxPx / img.height,
          1
        );

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * ratio));
        canvas.height = Math.max(1, Math.round(img.height * ratio));

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const candidate = canvas.toDataURL('image/jpeg', attempt.quality);
        best = candidate;

        if (candidate.length <= targetChars) {
          resolve(candidate);
          return;
        }
      }

      resolve(best);
    };

    img.onerror = reject;
    img.src = dataUrl;
  });
}

// ─── Resume save error → Chinese translation ──────────────────────────────────
function translateSaveError(errMsg) {
  if (!errMsg) return '請稍後再試';
  const e = errMsg.toLowerCase();
  if (e.includes('size limit') || e.includes('40000') || e.includes('exceeds')) {
    return '履歷內容過大，請縮短自傳或附件內容後再試。';
  }
  if (e.includes('not logged in') || e.includes('session expired') || e.includes('invalid session')) {
    return '登入已過期，請重新登入後再儲存。';
  }
  if (e.includes('invalid json')) {
    return '履歷格式錯誤，請重新填寫後儲存。';
  }
  if (e.includes('non-empty object') || e.includes('non\u2011empty object')) {
    return '履歷內容不能為空。';
  }
  return errMsg;
}

// ─── Unique ID helper ──────────────────────────────────────────────────────────
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

function normalizeResumeData(raw, localPhoto = '') {
  const source = toObject(raw);

  const prefsSource = toObject(
    source.jobPreferences ??
    source.preferences ??
    source.jobPreference
  );

  const education = toArray(
    source.education ??
    source.educations ??
    source.educationList
  )
    .map(item => {
      const e = toObject(item);
      return {
        id: toText(e.id).trim() || uid(),
        school: toText(e.school ?? e.name),
        major: toText(e.major ?? e.department),
        degree: toText(e.degree) || '學士',
        startYear: toText(e.startYear ?? e.startDate),
        endYear: toText(e.endYear ?? e.endDate),
        current: toBool(e.current),
      };
    })
    .filter(e => hasText(e.school) || hasText(e.major) || hasText(e.degree));

  const workExperience = toArray(
    source.workExperience ??
    source.workExperiences ??
    source.experiences
  )
    .map(item => {
      const e = toObject(item);
      return {
        id: toText(e.id).trim() || uid(),
        company: toText(e.company),
        title: toText(e.title ?? e.position),
        industry: toText(e.industry ?? e.department),
        startDate: toText(e.startDate),
        endDate: toText(e.endDate),
        current: toBool(e.current),
        description: toText(e.description ?? e.content),
      };
    })
    .filter(e => hasText(e.company) || hasText(e.title));

  const languages = toArray(source.languages ?? source.language)
    .map(item => {
      if (typeof item === 'string') {
        return {
          id: uid(),
          language: toText(item) || '英文',
          level: '中等',
        };
      }

      const e = toObject(item);
      return {
        id: toText(e.id).trim() || uid(),
        language: toText(e.language ?? e.name) || '英文',
        level: toText(e.level) || '中等',
      };
    })
    .filter(e => hasText(e.language));

  const skills = toArray(
    source.skills ??
    source.specialties ??
    source.specialty,
    { splitText: true }
  )
    .map(item => {
      if (typeof item === 'string' || typeof item === 'number') {
        return toText(item).trim();
      }
      const e = toObject(item);
      return toText(e.name ?? e.skill ?? e.label ?? e.value).trim();
    })
    .filter(Boolean);

  const certifications = toArray(
    source.certifications ??
    source.certificates ??
    source.certs
  )
    .map(item => {
      if (typeof item === 'string') {
        return {
          id: uid(),
          name: item,
          issuer: '',
          date: '',
        };
      }

      const e = toObject(item);
      return {
        id: toText(e.id).trim() || uid(),
        name: toText(e.name ?? e.title),
        issuer: toText(e.issuer ?? e.organization),
        date: toText(e.date ?? e.obtainDate),
      };
    })
    .filter(e => hasText(e.name));

  return {
    ...DEFAULT_RESUME,
    photo: toText(source.photo) || localPhoto || '',
    name: toText(source.name),
    title: toText(source.title ?? source.currentTitle ?? source.recentTitle),
    location: toText(source.location ?? source.city),
    phone: toText(source.phone ?? source.mobile ?? source.tel),
    email: toText(source.email),
    bio: toText(source.bio ?? source.autobiography),
    education,
    workExperience,
    jobPreferences: {
      ...DEFAULT_RESUME.jobPreferences,
      desiredTitle: toText(
        prefsSource.desiredTitle ??
        prefsSource.preferredTitle ??
        source.desiredTitle
      ),
      desiredLocations: toArray(
        prefsSource.desiredLocations ??
        prefsSource.preferredLocations ??
        source.desiredLocations,
        { splitText: true }
      )
        .map(v => toText(v).trim())
        .filter(Boolean),
      workType: toText(prefsSource.workType ?? prefsSource.type),
      salary: toText(prefsSource.salary ?? prefsSource.expectedSalary),
      salaryType: toText(prefsSource.salaryType) || '月薪',
      availableDate: toText(prefsSource.availableDate),
      shifts: toArray(
        prefsSource.shifts ??
        prefsSource.shift,
        { splitText: true }
      )
        .map(v => toText(v).trim())
        .filter(Boolean),
    },
    languages,
    skills,
    certifications,
    consentTalentPool: toBool(
      source.consentTalentPool ??
      source.consent ??
      source.talentPoolConsent
    ),
    updatedAt: toText(source.updatedAt),
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// ── Sub-components ────────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════

// Reusable section card wrapper
const SectionCard = ({ id, title, icon, sectionRef, children, action }) => (
  <div
    ref={sectionRef}
    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-32"
  >
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <h2 className="font-bold text-gray-800 flex items-center gap-2">
        <i className={`${icon} text-talent-500 text-sm`} />
        {title}
      </h2>
      {action}
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

// Input with label
const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-talent-400 focus:border-transparent placeholder-gray-300';
const btnPrimary = 'px-4 py-1.5 bg-talent-600 text-white text-sm rounded-lg hover:bg-talent-700 transition-colors';
const btnGhost = 'px-4 py-1.5 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors';
const btnDanger = 'text-xs text-red-400 hover:text-red-600 transition-colors';
const btnEdit = 'text-xs text-talent-600 hover:text-talent-800 transition-colors font-medium';

// ─── Personal Info / Basic ─────────────────────────────────────────────────────
const BasicSection = ({ resume, updateField, onPhotoUpload, sectionRef }) => {
  const photoInputRef = useRef(null);

  return (
    <SectionCard
      id="basic"
      title="個人資料"
      icon="fas fa-user-circle"
      sectionRef={sectionRef}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Photo */}
        <div className="flex flex-col items-center gap-2 sm:w-32 flex-shrink-0">
          <div
            className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => photoInputRef.current?.click()}
          >
            {resume.photo ? (
              <img src={resume.photo} alt="大頭照" className="w-full h-full object-cover" />
            ) : (
              <i className="fas fa-user text-gray-300 text-3xl" />
            )}
          </div>
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="text-xs text-talent-600 hover:underline"
          >
            {resume.photo ? '更換照片' : '上傳照片'}
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPhotoUpload}
          />
          <p className="text-xs text-gray-400 text-center">JPG/PNG，最大 5 MB</p>
        </div>

        {/* Fields */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="姓名" required>
            <input className={inputCls} value={resume.name} onChange={e => updateField('name', e.target.value)} placeholder="您的姓名" />
          </Field>
          <Field label="目前 / 最近職稱">
            <input className={inputCls} value={resume.title} onChange={e => updateField('title', e.target.value)} placeholder="例：行政助理、倉儲人員" />
          </Field>
          <Field label="手機號碼">
            <input className={inputCls} value={resume.phone} onChange={e => updateField('phone', e.target.value)} placeholder="09XXXXXXXX" />
          </Field>
          <Field label="Email">
            <input className={inputCls} value={resume.email} onChange={e => updateField('email', e.target.value)} placeholder="example@email.com" type="email" />
          </Field>
          <Field label="所在縣市">
            <select className={inputCls} value={resume.location} onChange={e => updateField('location', e.target.value)}>
              <option value="">請選擇</option>
              {TAIWAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
      </div>
    </SectionCard>
  );
};

// ─── Education ────────────────────────────────────────────────────────────────
const emptyEdu = () => ({ id: uid(), school: '', major: '', degree: '學士', startYear: '', endYear: '', current: false });

const EducationSection = ({ entries, onChange, sectionRef }) => {
  const [editing, setEditing] = useState(null); // id | 'new' | null
  const [draft, setDraft] = useState(null);

  const startNew = () => { const e = emptyEdu(); setDraft(e); setEditing('new'); };
  const startEdit = (e) => { setDraft({ ...e }); setEditing(e.id); };
  const cancelEdit = () => { setEditing(null); setDraft(null); };

  const saveEdit = () => {
    if (!hasText(draft?.school)) return;
    if (editing === 'new') {
      onChange([...entries, draft]);
    } else {
      onChange(entries.map(e => e.id === editing ? draft : e));
    }
    cancelEdit();
  };

  const remove = (id) => onChange(entries.filter(e => e.id !== id));
  const draftSet = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  return (
    <SectionCard id="education" title="學歷" icon="fas fa-graduation-cap" sectionRef={sectionRef}
      action={
        editing ? null :
        <button onClick={startNew} className={btnPrimary}>
          <i className="fas fa-plus mr-1" />新增
        </button>
      }
    >
      {entries.length === 0 && !editing && (
        <p className="text-sm text-gray-400 text-center py-4">尚未新增學歷，點「新增」開始填寫。</p>
      )}
      <div className="space-y-3">
        {entries.map(e => (
          editing === e.id ? (
            <EduForm key={e.id} draft={draft} draftSet={draftSet} onSave={saveEdit} onCancel={cancelEdit} />
          ) : (
            <div key={e.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{e.school}</p>
                <p className="text-xs text-gray-500 mt-0.5">{e.major} · {e.degree}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {e.startYear}{e.startYear && '年'} — {e.current ? '就讀中' : `${e.endYear}年`}
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button onClick={() => startEdit(e)} className={btnEdit}>編輯</button>
                <button onClick={() => remove(e.id)} className={btnDanger}>刪除</button>
              </div>
            </div>
          )
        ))}
        {editing === 'new' && (
          <EduForm draft={draft} draftSet={draftSet} onSave={saveEdit} onCancel={cancelEdit} />
        )}
      </div>
    </SectionCard>
  );
};

const EduForm = ({ draft, draftSet, onSave, onCancel }) => (
  <div className="p-4 border-2 border-talent-200 rounded-xl bg-talent-50 space-y-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field label="學校名稱" required>
        <input className={inputCls} value={draft.school} onChange={e => draftSet('school', e.target.value)} placeholder="例：國立臺灣大學" />
      </Field>
      <Field label="科系 / 主修">
        <input className={inputCls} value={draft.major} onChange={e => draftSet('major', e.target.value)} placeholder="例：資訊工程學系" />
      </Field>
      <Field label="學歷">
        <select className={inputCls} value={draft.degree} onChange={e => draftSet('degree', e.target.value)}>
          {DEGREE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </Field>
      <Field label="入學年">
        <input className={inputCls} value={draft.startYear} onChange={e => draftSet('startYear', e.target.value)} placeholder="YYYY" maxLength={4} />
      </Field>
      {!draft.current && (
        <Field label="畢業年">
          <input className={inputCls} value={draft.endYear} onChange={e => draftSet('endYear', e.target.value)} placeholder="YYYY" maxLength={4} />
        </Field>
      )}
      <div className="flex items-center gap-2 mt-1 sm:col-span-2">
        <input id={`edu-current-${draft.id}`} type="checkbox" checked={draft.current} onChange={e => draftSet('current', e.target.checked)} className="rounded text-talent-600" />
        <label htmlFor={`edu-current-${draft.id}`} className="text-sm text-gray-600">目前就讀中</label>
      </div>
    </div>
    <div className="flex gap-2 justify-end">
      <button onClick={onCancel} className={btnGhost}>取消</button>
      <button onClick={onSave} className={btnPrimary}>儲存</button>
    </div>
  </div>
);

// ─── Work Experience ───────────────────────────────────────────────────────────
const emptyWork = () => ({ id: uid(), company: '', title: '', industry: '', startDate: '', endDate: '', current: false, description: '' });

const WorkSection = ({ entries, onChange, sectionRef }) => {
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);

  const startNew = () => { const e = emptyWork(); setDraft(e); setEditing('new'); };
  const startEdit = (e) => { setDraft({ ...e }); setEditing(e.id); };
  const cancelEdit = () => { setEditing(null); setDraft(null); };

  const saveEdit = () => {
    if (!hasText(draft?.company) || !hasText(draft?.title)) return;
    if (editing === 'new') onChange([...entries, draft]);
    else onChange(entries.map(e => e.id === editing ? draft : e));
    cancelEdit();
  };

  const remove = (id) => onChange(entries.filter(e => e.id !== id));
  const draftSet = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  return (
    <SectionCard id="work" title="工作經歷" icon="fas fa-briefcase" sectionRef={sectionRef}
      action={
        editing ? null :
        <button onClick={startNew} className={btnPrimary}>
          <i className="fas fa-plus mr-1" />新增
        </button>
      }
    >
      {entries.length === 0 && !editing && (
        <p className="text-sm text-gray-400 text-center py-4">尚未新增工作經歷，點「新增」開始填寫。</p>
      )}
      <div className="space-y-3">
        {entries.map(e => (
          editing === e.id ? (
            <WorkForm key={e.id} draft={draft} draftSet={draftSet} onSave={saveEdit} onCancel={cancelEdit} />
          ) : (
            <div key={e.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex-1 min-w-0 pr-4">
                <p className="font-semibold text-gray-800 text-sm">{e.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{e.company}{e.industry ? ` · ${e.industry}` : ''}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {e.startDate} — {e.current ? '目前在職' : (e.endDate || '未填')}
                </p>
                {e.description && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2 whitespace-pre-line">{e.description}</p>
                )}
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button onClick={() => startEdit(e)} className={btnEdit}>編輯</button>
                <button onClick={() => remove(e.id)} className={btnDanger}>刪除</button>
              </div>
            </div>
          )
        ))}
        {editing === 'new' && (
          <WorkForm draft={draft} draftSet={draftSet} onSave={saveEdit} onCancel={cancelEdit} />
        )}
      </div>
    </SectionCard>
  );
};

const WorkForm = ({ draft, draftSet, onSave, onCancel }) => (
  <div className="p-4 border-2 border-talent-200 rounded-xl bg-talent-50 space-y-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field label="公司名稱" required>
        <input className={inputCls} value={draft.company} onChange={e => draftSet('company', e.target.value)} placeholder="例：愜易居股份有限公司" />
      </Field>
      <Field label="職稱" required>
        <input className={inputCls} value={draft.title} onChange={e => draftSet('title', e.target.value)} placeholder="例：行政助理" />
      </Field>
      <Field label="產業 / 部門">
        <input className={inputCls} value={draft.industry} onChange={e => draftSet('industry', e.target.value)} placeholder="例：人力派遣業" />
      </Field>
      <Field label="開始年月">
        <input className={inputCls} type="month" value={draft.startDate} onChange={e => draftSet('startDate', e.target.value)} />
      </Field>
      {!draft.current && (
        <Field label="結束年月">
          <input className={inputCls} type="month" value={draft.endDate} onChange={e => draftSet('endDate', e.target.value)} />
        </Field>
      )}
      <div className="flex items-center gap-2 mt-1 sm:col-span-2">
        <input id={`work-current-${draft.id}`} type="checkbox" checked={draft.current} onChange={e => draftSet('current', e.target.checked)} className="rounded text-talent-600" />
        <label htmlFor={`work-current-${draft.id}`} className="text-sm text-gray-600">目前在職</label>
      </div>
    </div>
    <Field label="工作內容">
      <textarea
        className={`${inputCls} resize-none`}
        rows={4}
        value={draft.description}
        onChange={e => draftSet('description', e.target.value)}
        placeholder="簡述主要工作職責、專案或成就（建議 50–200 字）"
      />
    </Field>
    <div className="flex gap-2 justify-end">
      <button onClick={onCancel} className={btnGhost}>取消</button>
      <button onClick={onSave} className={btnPrimary}>儲存</button>
    </div>
  </div>
);

// ─── Job Preferences ──────────────────────────────────────────────────────────
const PreferencesSection = ({ prefs, onChange, sectionRef }) => {
  const set = (k, v) => onChange({ ...prefs, [k]: v });

  const toggleCity = (city) => {
    const cur = prefs.desiredLocations || [];
    set('desiredLocations', cur.includes(city) ? cur.filter(c => c !== city) : [...cur, city]);
  };

  const toggleShift = (shift) => {
    const cur = prefs.shifts || [];
    set('shifts', cur.includes(shift) ? cur.filter(s => s !== shift) : [...cur, shift]);
  };

  return (
    <SectionCard id="preferences" title="求職條件" icon="fas fa-search" sectionRef={sectionRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="希望職稱" required>
          <input className={inputCls} value={prefs.desiredTitle} onChange={e => set('desiredTitle', e.target.value)} placeholder="例：行政助理、倉儲人員" />
        </Field>
        <Field label="工作性質">
          <select className={inputCls} value={prefs.workType} onChange={e => set('workType', e.target.value)}>
            <option value="">請選擇</option>
            {WORK_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="希望待遇">
            <div className="flex gap-2">
              <select className={`${inputCls} w-28 flex-shrink-0`} value={prefs.salaryType} onChange={e => set('salaryType', e.target.value)}>
                {SALARY_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input className={inputCls} value={prefs.salary} onChange={e => set('salary', e.target.value)} placeholder="例：30000（面議可留空）" />
            </div>
          </Field>
        </div>
        <Field label="可上班日期">
          <input className={inputCls} type="date" value={prefs.availableDate} onChange={e => set('availableDate', e.target.value)} />
        </Field>
      </div>

      {/* Desired locations */}
      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">希望工作地點（可複選）</p>
        <div className="flex flex-wrap gap-2">
          {TAIWAN_CITIES.map(city => (
            <button
              key={city}
              type="button"
              onClick={() => toggleCity(city)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                (prefs.desiredLocations || []).includes(city)
                  ? 'bg-talent-600 text-white border-talent-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-talent-300'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Shifts */}
      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">可配合班別（可複選）</p>
        <div className="flex flex-wrap gap-2">
          {SHIFT_OPTIONS.map(shift => (
            <button
              key={shift}
              type="button"
              onClick={() => toggleShift(shift)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                (prefs.shifts || []).includes(shift)
                  ? 'bg-talent-600 text-white border-talent-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-talent-300'
              }`}
            >
              {shift}
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  );
};

// ─── Languages ────────────────────────────────────────────────────────────────
const emptyLang = () => ({ id: uid(), language: '英文', level: '中等' });

const LanguagesSection = ({ entries, onChange, sectionRef }) => {
  const add = () => onChange([...entries, emptyLang()]);
  const remove = (id) => onChange(entries.filter(e => e.id !== id));
  const update = (id, k, v) => onChange(entries.map(e => e.id === id ? { ...e, [k]: v } : e));

  return (
    <SectionCard id="languages" title="語文能力" icon="fas fa-language" sectionRef={sectionRef}
      action={
        <button onClick={add} className={btnPrimary}>
          <i className="fas fa-plus mr-1" />新增
        </button>
      }
    >
      {entries.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">尚未新增語文能力。</p>
      )}
      <div className="space-y-3">
        {entries.map(e => (
          <div key={e.id} className="flex flex-col sm:flex-row sm:items-end gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            {/* Language column */}
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">語言</label>
              <select
                className={`${inputCls} w-full`}
                value={e.language}
                onChange={ev => update(e.id, 'language', ev.target.value)}
              >
                {LANG_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            {/* Level column */}
            <div className="sm:w-36 flex-shrink-0">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">程度</label>
              <select
                className={`${inputCls} w-full`}
                value={e.level}
                onChange={ev => update(e.id, 'level', ev.target.value)}
              >
                {LANG_LEVEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            {/* Summary badge (visible on desktop) */}
            <div className="hidden sm:flex items-center gap-1.5 pb-1 flex-shrink-0">
              <span className="text-xs bg-talent-50 text-talent-700 border border-talent-200 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">
                {e.language}
              </span>
              <span className="text-gray-300 text-sm">｜</span>
              <span className="text-xs text-gray-500 whitespace-nowrap">{e.level}</span>
            </div>
            {/* Mobile summary */}
            <div className="flex sm:hidden items-center gap-1.5">
              <span className="text-xs bg-talent-50 text-talent-700 border border-talent-200 px-2.5 py-1 rounded-full font-semibold">
                {e.language}
              </span>
              <span className="text-gray-300">｜</span>
              <span className="text-xs text-gray-500">{e.level}</span>
            </div>
            {/* Delete button */}
            <button
              onClick={() => remove(e.id)}
              className={`${btnDanger} flex-shrink-0 self-end sm:self-auto sm:mb-0`}
              title="刪除"
            >
              <i className="fas fa-trash" />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

// ─── Skills ───────────────────────────────────────────────────────────────────
const SkillsSection = ({ skills, onChange, sectionRef }) => {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const s = input.trim();
    if (!s || skills.includes(s)) { setInput(''); return; }
    onChange([...skills, s]);
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); }
  };

  return (
    <SectionCard id="skills" title="專長" icon="fas fa-star" sectionRef={sectionRef}>
      <div className="flex gap-2 mb-4">
        <input
          className={`${inputCls} flex-1`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="輸入專長後按 Enter 或逗號新增，例：溝通協調、Microsoft Office"
        />
        <button onClick={addSkill} className={btnPrimary}>新增</button>
      </div>
      {skills.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-2">尚未新增專長（至少 2 項可計入完成度）。</p>
      )}
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 bg-talent-50 text-talent-700 border border-talent-200 text-xs px-3 py-1 rounded-full">
            {s}
            <button onClick={() => onChange(skills.filter((_, j) => j !== i))} className="hover:text-red-500 transition-colors">×</button>
          </span>
        ))}
      </div>
    </SectionCard>
  );
};

// ─── Certifications ───────────────────────────────────────────────────────────
const emptyCert = () => ({ id: uid(), name: '', issuer: '', date: '' });

const CertsSection = ({ entries, onChange, sectionRef }) => {
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);

  const startNew = () => { setDraft(emptyCert()); setEditing('new'); };
  const startEdit = (e) => { setDraft({ ...e }); setEditing(e.id); };
  const cancelEdit = () => { setEditing(null); setDraft(null); };

  const saveEdit = () => {
    if (!hasText(draft?.name)) return;
    if (editing === 'new') onChange([...entries, draft]);
    else onChange(entries.map(e => e.id === editing ? draft : e));
    cancelEdit();
  };

  const remove = (id) => onChange(entries.filter(e => e.id !== id));
  const draftSet = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  return (
    <SectionCard id="certs" title="資格認證" icon="fas fa-certificate" sectionRef={sectionRef}
      action={
        editing ? null :
        <button onClick={startNew} className={btnPrimary}>
          <i className="fas fa-plus mr-1" />新增
        </button>
      }
    >
      {entries.length === 0 && !editing && (
        <p className="text-sm text-gray-400 text-center py-4">尚未新增資格認證。</p>
      )}
      <div className="space-y-3">
        {entries.map(e => (
          editing === e.id ? (
            <CertForm key={e.id} draft={draft} draftSet={draftSet} onSave={saveEdit} onCancel={cancelEdit} />
          ) : (
            <div key={e.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="font-semibold text-gray-800 text-sm">{e.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{e.issuer}{e.date ? ` · ${e.date}` : ''}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => startEdit(e)} className={btnEdit}>編輯</button>
                <button onClick={() => remove(e.id)} className={btnDanger}>刪除</button>
              </div>
            </div>
          )
        ))}
        {editing === 'new' && (
          <CertForm draft={draft} draftSet={draftSet} onSave={saveEdit} onCancel={cancelEdit} />
        )}
      </div>
    </SectionCard>
  );
};

const CertForm = ({ draft, draftSet, onSave, onCancel }) => (
  <div className="p-4 border-2 border-talent-200 rounded-xl bg-talent-50 space-y-3">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Field label="證照 / 認證名稱" required>
        <input className={inputCls} value={draft.name} onChange={e => draftSet('name', e.target.value)} placeholder="例：乙級廚師證照" />
      </Field>
      <Field label="發照單位">
        <input className={inputCls} value={draft.issuer} onChange={e => draftSet('issuer', e.target.value)} placeholder="例：勞動部" />
      </Field>
      <Field label="取得日期">
        <input className={inputCls} type="month" value={draft.date} onChange={e => draftSet('date', e.target.value)} />
      </Field>
    </div>
    <div className="flex gap-2 justify-end">
      <button onClick={onCancel} className={btnGhost}>取消</button>
      <button onClick={onSave} className={btnPrimary}>儲存</button>
    </div>
  </div>
);

// ─── Biography ────────────────────────────────────────────────────────────────
const BioSection = ({ bio, onChange, sectionRef }) => {
  const safeBio = toText(bio);
  const len = safeBio.trim().length;
  return (
    <SectionCard id="bio" title="自傳" icon="fas fa-file-alt" sectionRef={sectionRef}>
      <textarea
        className={`${inputCls} resize-none w-full`}
        rows={8}
        value={safeBio}
        onChange={e => onChange(e.target.value)}
        placeholder="介紹您的工作經歷、個人特質、職涯目標（建議至少 30 字，計入完成度）"
      />
      <p className={`text-xs mt-1 text-right ${len >= 30 ? 'text-green-600' : 'text-gray-400'}`}>
        {len} 字{len >= 30 ? ' ✓' : ` / 至少 30 字`}
      </p>
    </SectionCard>
  );
};

// ─── Settings / Talent Pool ───────────────────────────────────────────────────
const SettingsSection = ({ consent, onChange, sectionRef }) => (
  <SectionCard id="settings" title="媒合設定" icon="fas fa-sliders-h" sectionRef={sectionRef}>
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={consent}
        onChange={e => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded text-talent-600 border-gray-300 focus:ring-talent-500 cursor-pointer"
      />
      <div>
        <p className="text-sm font-semibold text-gray-800 group-hover:text-talent-700 transition-colors">
          我願意讓愜易居依履歷內容主動媒合適合職缺
        </p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          開啟後，愜易居團隊會依您的履歷主動推薦您參加合適職缺或聯繫您。您隨時可取消勾選。
          個人資料僅供媒合使用，不會對外公開揭露。
        </p>
      </div>
    </label>
  </SectionCard>
);

// ═════════════════════════════════════════════════════════════════════════════
// ── Main Profile Page ─────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════
const Profile = () => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(DEFAULT_RESUME);
  const [loadingResume, setLoadingResume] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [activeSection, setActiveSection] = useState('basic');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sectionRefs = useRef({});

  // ── Auth guard ──
  useEffect(() => {
    if (!isApplicantLoggedIn()) {
      navigate('/login?next=/talent/profile');
    }
  }, [navigate]);

  // ── Load resume from GAS ──
  // NOTE: Code.gs getResume returns { success, resumeJson } (not result.resume)
  useEffect(() => {
    const token = getSessionToken();
    if (!token) return;
    setLoadingResume(true);
    setLoadError('');
    getResume(token)
      .then(result => {
        // GAS returns resumeJson (string) – NOT resume
        const raw = result.resumeJson ?? result.resume ?? null;
        if (result.success && raw) {
          const loaded = typeof raw === 'string' ? JSON.parse(raw) : raw;
          const localPhoto = loadPhotoFromStorage();

          // 雲端若已有照片就優先使用；舊會員只有本機照片時仍可自動補回。
          const normalized = normalizeResumeData(loaded, localPhoto);

          if (normalized.photo) {
            savePhotoToStorage(normalized.photo);
          }

          setResume(normalized);
        } else {
          // Pre-fill from session user if no cloud resume yet
          const localPhoto = loadPhotoFromStorage();
          const user = getCurrentApplicant();
          if (user) {
            setResume(prev => ({
              ...prev,
              name:  hasText(prev.name)  ? prev.name  : toText(user.name),
              email: hasText(prev.email) ? prev.email : toText(user.email),
              phone: hasText(prev.phone) ? prev.phone : toText(user.phone),
              photo: prev.photo || localPhoto,
            }));
          } else {
            setResume(prev => ({ ...prev, photo: localPhoto }));
          }
        }
      })
      .catch(err => {
        console.warn('getResume failed:', err.message);
        setLoadError('載入履歷失敗，您的變更仍可在此填寫並儲存。');
        // Still restore local photo
        const localPhoto = loadPhotoFromStorage();
        setResume(prev => ({ ...prev, photo: localPhoto }));
      })
      .finally(() => setLoadingResume(false));
  }, []);

  // ── Save resume to GAS ──
  // 照片會先壓成小型 JPG 再一起寫入 resumeJson。
  // 這樣內部人才招募庫也能讀到照片，不再只存在目前這台瀏覽器。
  const handleSave = async () => {
    const token = getSessionToken();

    if (!token) {
      setSaveMsg('❌ 請先登入。');
      return;
    }

    setSaving(true);
    setSaveMsg('⏳ 正在同步履歷與照片…');

    try {
      const updatedAt = new Date().toISOString();

      const buildPayload = async (photoTarget) => {
        let photo = '';

        if (resume.photo) {
          photo = await compressPhotoDataUrl(resume.photo, photoTarget);
          savePhotoToStorage(photo);
        }

        return {
          ...resume,
          photo,
          updatedAt,
        };
      };

      // 第一次：正常品質。
      let toSave = await buildPayload(9000);
      let result = await updateResume(token, toSave);

      // 若後端仍是舊版 5000 chars 限制，自動把照片再壓小重試。
      if (
        !result?.success &&
        /size limit|exceeds|5000|40000/i.test(String(result?.error || '')) &&
        resume.photo
      ) {
        setSaveMsg('⏳ 後端容量較小，正在自動壓縮照片重試…');

        toSave = await buildPayload(1800);
        result = await updateResume(token, toSave);
      }

      // 再一次極小備援。
      if (
        !result?.success &&
        /size limit|exceeds|5000|40000/i.test(String(result?.error || '')) &&
        resume.photo
      ) {
        toSave = await buildPayload(900);
        result = await updateResume(token, toSave);
      }

      if (!result?.success) {
        if (isSessionError(result?.error)) {
          forceSessionExpired();
          setSaveMsg('❌ 登入已過期，請重新登入後再儲存。');
          return;
        }

        const errCn = translateSaveError(result?.error);
        setSaveMsg(`❌ 儲存失敗：${errCn}`);
        window.alert(`履歷沒有儲存成功：\n${errCn}`);
        return;
      }

      // 成功後立刻重新從 GAS 讀一次，確認不是只有前端以為成功。
      setSaveMsg('⏳ 已送出，正在確認雲端資料…');

      const verify = await getResume(token);
      let verifiedResume = null;

      if (verify?.success && verify?.resumeJson) {
        try {
          verifiedResume =
            typeof verify.resumeJson === 'string'
              ? JSON.parse(verify.resumeJson)
              : verify.resumeJson;
        } catch (_) {
          verifiedResume = null;
        }
      }

      const photoSaved =
        !resume.photo ||
        (
          verifiedResume &&
          typeof verifiedResume.photo === 'string' &&
          verifiedResume.photo.startsWith('data:image/')
        );

      if (!verifiedResume) {
        setSaveMsg('⚠️ 已送出，但無法立即確認雲端內容。請重新整理後再確認。');
        window.alert('履歷已送出，但目前無法立即讀回確認。');
        return;
      }

      if (resume.photo && !photoSaved) {
        setResume(prev => ({
          ...prev,
          updatedAt,
        }));
        setSaveMsg('⚠️ 履歷已儲存，但照片尚未寫入雲端。');
        window.alert(
          '履歷文字已儲存，但照片尚未同步到雲端。\n' +
          '這通常表示目前部署的 Talent API 容量限制仍是舊版。'
        );
        return;
      }

      const normalized = normalizeResumeData(
        verifiedResume,
        loadPhotoFromStorage()
      );

      setResume(normalized);

      if (normalized.photo) {
        savePhotoToStorage(normalized.photo);
      }

      setSaveMsg('✅ 履歷與照片已同步儲存！');

      // 明確提示，避免桌面版訊息太小看不到。
      window.alert('✅ 履歷與照片已同步儲存！');

      setTimeout(() => {
        setSaveMsg('');
      }, 5000);

    } catch (err) {
      const msg =
        err?.code === 'API_TIMEOUT'
          ? '連線逾時，請稍後再試。'
          : '網路異常，請稍後再試。';

      setSaveMsg(`❌ ${msg}`);
      window.alert(`履歷沒有儲存成功：\n${msg}`);

      console.error(
        'updateResume / verify error:',
        err?.message || err
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Helpers ──
  const updateField = useCallback((path, value) => {
    setResume(prev => {
      const next = { ...prev };
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('請選擇圖片檔案'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('圖片大小請勿超過 5MB'); return; }
    try {
      const preview = await resizeToBase64(file, 220, 0.75);
      const b64 = await compressPhotoDataUrl(preview, 12000);

      // 本機預覽 + 下次按「儲存履歷」時同步到雲端
      savePhotoToStorage(b64);
      updateField('photo', b64);
    } catch { alert('圖片處理失敗，請重試。'); }
    e.target.value = '';
  };

  // ── Derived ──
  const { pct, next: nextTip } = calcCompletion(resume);
  const progressColor = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400';
  const pctColor = pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-500';

  // Loading state
  if (loadingResume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-talent-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">載入履歷中…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {saveMsg && (
        <div
          className={`fixed top-20 right-4 z-[100] max-w-sm rounded-xl px-4 py-3 text-sm font-semibold shadow-xl border ${
            saveMsg.startsWith('✅')
              ? 'bg-green-50 text-green-700 border-green-200'
              : saveMsg.startsWith('❌')
                ? 'bg-red-50 text-red-700 border-red-200'
                : saveMsg.startsWith('⚠️')
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-white text-gray-700 border-gray-200'
          }`}
        >
          {saveMsg}
        </div>
      )}

      {/* ── Top Navbar ── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/talent" className="font-bold text-lg text-talent-600 flex-shrink-0">愜易居</Link>
            <span className="text-gray-300 hidden sm:block">|</span>
            <span className="text-sm text-gray-500 hidden sm:block">我的履歷</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {saveMsg && (
              <span className={`text-xs font-medium hidden sm:block ${saveMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                {saveMsg}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-talent-600 text-white text-sm rounded-lg hover:bg-talent-700 disabled:opacity-60 transition-colors"
            >
              {saving
                ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> 儲存中…</>
                : <><i className="fas fa-save" /> 儲存履歷</>}
            </button>
            <Link to="/jobs" className="text-sm text-gray-500 hover:text-talent-600 hidden sm:block transition-colors">找工作</Link>
            {/* Member navbar (handles dropdown + logout) */}
            <MemberNavbar />
          </div>
        </div>
      </nav>

      {/* ── Completion Banner ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Percentage */}
            <div className="text-center flex-shrink-0 sm:w-16">
              <p className={`text-2xl font-bold ${pctColor}`}>{pct}%</p>
              <p className="text-xs text-gray-400">完成度</p>
            </div>
            {/* Bar + tip */}
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-gray-500 font-medium">履歷完成度</span>
                {pct >= 80
                  ? <span className="text-green-600 font-semibold">✓ 建議可開始投遞職缺</span>
                  : <span className="text-yellow-600">建議達 80% 後再投遞</span>}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${progressColor}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {nextTip && (
                <p className="text-xs text-gray-400 mt-1.5">
                  💡 <span className="text-talent-600 font-medium">建議補充：</span>
                  <button
                    className="underline hover:text-talent-700 transition-colors"
                    onClick={() => scrollToSection(nextTip.section)}
                  >
                    {nextTip.label}
                  </button>
                  <span className="text-gray-400"> +{nextTip.weight}%</span>
                </p>
              )}
            </div>
            {/* Updated time */}
            {resume.updatedAt && (
              <p className="text-xs text-gray-400 flex-shrink-0">
                更新：{new Date(resume.updatedAt).toLocaleDateString('zh-TW')}
              </p>
            )}
          </div>
          {loadError && <p className="text-xs text-amber-600 mt-2">⚠️ {loadError}</p>}
          {saveMsg && (
            <p className={`text-xs mt-2 sm:hidden font-medium ${saveMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>{saveMsg}</p>
          )}
        </div>
      </div>

      {/* ── Mobile Section Nav ── */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-14 z-30">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full px-4 py-3 flex justify-between items-center text-sm"
        >
          <span className="font-medium text-gray-700 flex items-center gap-2">
            <i className={`${NAV_SECTIONS.find(s => s.id === activeSection)?.icon || 'fas fa-list'} text-talent-600 text-xs`} />
            {NAV_SECTIONS.find(s => s.id === activeSection)?.label || '選擇區塊'}
          </span>
          <i className={`fas fa-chevron-${sidebarOpen ? 'up' : 'down'} text-gray-400 text-xs`} />
        </button>
        {sidebarOpen && (
          <div className="border-t border-gray-100 pb-2">
            {NAV_SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`w-full text-left px-5 py-2.5 text-sm flex items-center gap-2.5 ${
                  activeSection === s.id ? 'text-talent-600 bg-talent-50 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className={`${s.icon} text-xs w-4 text-center`} />
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6 items-start">

        {/* ── Desktop sidebar ── */}
        <aside className="hidden lg:flex flex-col gap-3 w-48 flex-shrink-0 sticky top-24">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">履歷選單</p>
            </div>
            <nav className="py-1.5">
              {NAV_SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                    activeSection === s.id
                      ? 'text-talent-700 bg-talent-50 border-r-2 border-talent-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <i className={`${s.icon} text-xs w-4 text-center ${activeSection === s.id ? 'text-talent-600' : 'text-gray-400'}`} />
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
          {/* Mini save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2 bg-talent-600 text-white text-sm rounded-xl hover:bg-talent-700 disabled:opacity-60 transition-colors shadow-sm"
          >
            {saving ? '儲存中…' : '儲存履歷'}
          </button>
          <Link
            to="/jobs"
            className="block text-center text-xs text-talent-600 hover:underline py-1"
          >
            前往職缺搜尋 →
          </Link>
        </aside>

        {/* ── Sections ── */}
        <div className="flex-1 min-w-0 space-y-5">

          <BasicSection
            resume={resume}
            updateField={updateField}
            onPhotoUpload={handlePhotoUpload}
            sectionRef={el => { sectionRefs.current.basic = el; }}
          />

          <EducationSection
            entries={Array.isArray(resume.education) ? resume.education : []}
            onChange={arr => setResume(p => ({ ...p, education: arr }))}
            sectionRef={el => { sectionRefs.current.education = el; }}
          />

          <WorkSection
            entries={Array.isArray(resume.workExperience) ? resume.workExperience : []}
            onChange={arr => setResume(p => ({ ...p, workExperience: arr }))}
            sectionRef={el => { sectionRefs.current.work = el; }}
          />

          <PreferencesSection
            prefs={
              resume.jobPreferences &&
              typeof resume.jobPreferences === 'object' &&
              !Array.isArray(resume.jobPreferences)
                ? resume.jobPreferences
                : DEFAULT_RESUME.jobPreferences
            }
            onChange={prefs => setResume(p => ({ ...p, jobPreferences: prefs }))}
            sectionRef={el => { sectionRefs.current.preferences = el; }}
          />

          <LanguagesSection
            entries={Array.isArray(resume.languages) ? resume.languages : []}
            onChange={arr => setResume(p => ({ ...p, languages: arr }))}
            sectionRef={el => { sectionRefs.current.languages = el; }}
          />

          <SkillsSection
            skills={Array.isArray(resume.skills) ? resume.skills : []}
            onChange={arr => setResume(p => ({ ...p, skills: arr }))}
            sectionRef={el => { sectionRefs.current.skills = el; }}
          />

          <CertsSection
            entries={Array.isArray(resume.certifications) ? resume.certifications : []}
            onChange={arr => setResume(p => ({ ...p, certifications: arr }))}
            sectionRef={el => { sectionRefs.current.certs = el; }}
          />

          <BioSection
            bio={resume.bio}
            onChange={val => updateField('bio', val)}
            sectionRef={el => { sectionRefs.current.bio = el; }}
          />

          <SettingsSection
            consent={resume.consentTalentPool}
            onChange={val => updateField('consentTalentPool', val)}
            sectionRef={el => { sectionRefs.current.settings = el; }}
          />

          {/* Bottom bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm text-gray-500">
              {resume.updatedAt
                ? `最後儲存：${new Date(resume.updatedAt).toLocaleString('zh-TW')}`
                : '尚未儲存至雲端'}
              <span className={`ml-2 font-medium ${pctColor}`}>（履歷完成度 {pct}%）</span>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-talent-600 text-white rounded-lg text-sm font-medium hover:bg-talent-700 disabled:opacity-60 transition-colors"
            >
              {saving ? '儲存中…' : '儲存所有變更'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
