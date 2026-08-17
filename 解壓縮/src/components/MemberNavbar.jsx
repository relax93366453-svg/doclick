// src/components/MemberNavbar.jsx
// 全站共用登入狀態 Navbar 右側區塊。
// 已登入：🔔 姓名 ⌄  → 下拉：我的履歷 / 我的應徵紀錄 / 登出
// 未登入：登入 / 免費註冊
//
// 設計重點：
// 1. 監聽 SESSION_CHANGE_EVENT 即時切換已登入 / 未登入狀態
// 2. 登入時嘗試從 getMemberInfo() 取得姓名並快取至 doclick_member_cache
// 3. 顯示優先順序：cache.name > cache.email > sessionMeta.name > sessionMeta.email > '會員'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  isApplicantLoggedIn,
  getCurrentApplicant,
  logoutApplicantAccount,
  getSessionToken,
  cacheMemberInfo,
  SESSION_CHANGE_EVENT,
} from '../helpers/authHelper';
import { getMemberInfo } from '../api/talent';

const MemberNavbar = ({ className = '' }) => {
  const navigate = useNavigate();
  const [open, setOpen]         = useState(false);
  const [loggedIn, setLoggedIn] = useState(isApplicantLoggedIn);
  const [applicant, setApplicant] = useState(getCurrentApplicant);
  const ref = useRef(null);

  // ── Sync display name from cache / sessionMeta ──
  const refreshApplicant = useCallback(() => {
    setLoggedIn(isApplicantLoggedIn());
    setApplicant(getCurrentApplicant());
  }, []);

  // ── Listen for session changes (logout, forceExpired, etc.) ──
  useEffect(() => {
    window.addEventListener(SESSION_CHANGE_EVENT, refreshApplicant);
    // Also handle native storage events (other tabs)
    window.addEventListener('storage', refreshApplicant);
    return () => {
      window.removeEventListener(SESSION_CHANGE_EVENT, refreshApplicant);
      window.removeEventListener('storage', refreshApplicant);
    };
  }, [refreshApplicant]);

  // ── On mount: try to fetch & cache member name if not yet cached ──
  useEffect(() => {
    if (!isApplicantLoggedIn()) return;
    const token = getSessionToken();
    if (!token) return;
    // Only fetch if we don't have a name yet
    const current = getCurrentApplicant();
    if (current?.name) return; // already have a name
    getMemberInfo(token)
      .then(info => {
        if (info.success && info.profile) {
          cacheMemberInfo({
            userId:   info.profile.userId,
            name:     info.profile.name  || '',
            email:    info.profile.email || '',
            phone:    info.profile.phone || '',
            verified: info.profile.verified,
          });
          setApplicant(getCurrentApplicant());
        }
      })
      .catch(() => { /* non-critical */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Close dropdown on outside click / Esc ──
  useEffect(() => {
    const onOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const displayName = applicant?.name || applicant?.email || '';

  const handleLogout = () => {
    logoutApplicantAccount(); // clears localStorage + dispatches SESSION_CHANGE_EVENT
    setOpen(false);
    navigate('/login');
  };

  // ── Logged-out state ──
  if (!loggedIn) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Link
          to="/login"
          className="text-sm font-medium text-talent-600 border border-talent-600 px-4 py-1.5 rounded-lg hover:bg-talent-50 transition-colors"
        >
          登入
        </Link>
        <Link
          to="/register"
          className="text-sm font-medium text-white bg-talent-600 px-4 py-1.5 rounded-lg hover:bg-talent-700 transition-colors"
        >
          免費註冊
        </Link>
      </div>
    );
  }

  // ── Logged-in state ──
  return (
    <div className={`relative ${className}`} ref={ref}>
      {/* Trigger: 🔔 姓名 ⌄ */}
      <button
        type="button"
        id="member-navbar-trigger"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors font-medium select-none"
      >
        <span className="relative">
          <i className="fas fa-bell text-talent-500 text-base" />
        </span>
        {displayName && (
          <span className="hidden sm:inline max-w-[130px] truncate">{displayName}</span>
        )}
        <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden transition-all duration-150 origin-top-right ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Member info header */}
        <div className="px-4 py-3 border-b border-gray-100 bg-talent-50">
          <p className="text-xs text-gray-400 mb-0.5">已登入</p>
          <p className="text-sm font-semibold text-talent-700 truncate">
            {displayName || '會員'}
          </p>
        </div>

        <ul className="py-1">
          <li>
            <Link
              to="/talent/profile"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <i className="fas fa-file-alt text-gray-400 w-4 text-center" />
              我的履歷
            </Link>
          </li>
          <li>
            <Link
              to="/talent/applications"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <i className="fas fa-paper-plane text-gray-400 w-4 text-center" />
              我的應徵紀錄
            </Link>
          </li>
          <li className="border-t border-gray-100 mt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <i className="fas fa-sign-out-alt w-4 text-center" />
              登出
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MemberNavbar;
