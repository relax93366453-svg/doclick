// src/helpers/authHelper.js
// Auth bridge: reads/writes the GAS session stored in localStorage by Login.jsx.
// This replaces the old sessionStorage-based demo auth.
// All helper functions maintain the same public API so existing navbar code (TalentPage, JobSearch)
// continues to work without modification.

const SESSION_KEY      = 'doclick_session_token';   // raw session token from GAS loginUser
const SESSION_USER_KEY = 'doclick_session_user';    // { userId, sessionToken, name?, email? }
const MEMBER_CACHE_KEY = 'doclick_member_cache';    // { userId, name, email, phone, verified }

// Custom event name – dispatched whenever session state changes so all
// mounted MemberNavbar instances can re-render synchronously.
export const SESSION_CHANGE_EVENT = 'doclick:sessionChange';

// ---------- Internal helpers ----------

function readUserCache() {
  try {
    const raw = localStorage.getItem(MEMBER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function readSessionMeta() {
  try {
    const raw = localStorage.getItem(SESSION_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ---------- Public API (same names as before) ----------

/**
 * Returns true if a valid session token exists in localStorage.
 * Does NOT validate the token against GAS (synchronous check only).
 */
export function isApplicantLoggedIn() {
  return !!localStorage.getItem(SESSION_KEY);
}

/**
 * Returns a user object suitable for displaying in the navbar.
 * Reads from memberCache (populated after getMemberInfo) or falls back to sessionMeta.
 */
export function getCurrentApplicant() {
  const cache = readUserCache();
  if (cache) return cache;
  const meta  = readSessionMeta();
  if (meta) return meta;
  return null;
}

/**
 * Clears all session and member data from localStorage.
 * Also dispatches SESSION_CHANGE_EVENT so all Navbar instances re-render immediately.
 */
export function logoutApplicantAccount() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_USER_KEY);
  localStorage.removeItem(MEMBER_CACHE_KEY);
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

/**
 * Called when a Talent API response indicates the session is no longer valid
 * (e.g. "Session expired", "Invalid session token", "Not logged in").
 * Clears all auth storage and emits SESSION_CHANGE_EVENT so every mounted
 * MemberNavbar immediately switches to the logged-out state.
 */
export function forceSessionExpired() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_USER_KEY);
  localStorage.removeItem(MEMBER_CACHE_KEY);
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

/**
 * Returns the raw session token (for passing to GAS API calls).
 */
export function getSessionToken() {
  return localStorage.getItem(SESSION_KEY) || null;
}

/**
 * Persists member info into the cache so navbar can display name/email
 * without an extra round-trip. Called after getMemberInfo resolves.
 * @param {{ userId, name, email, phone, verified }} memberInfo
 */
export function cacheMemberInfo(memberInfo) {
  try {
    localStorage.setItem(MEMBER_CACHE_KEY, JSON.stringify(memberInfo));
  } catch { /* quota exceeded – ignore */ }
}

// ---------- Session error classifier ----------

/**
 * Returns true when an API error string indicates the session token
 * is expired or invalid on the server side.
 * @param {string} errMsg - the `error` field from a GAS API response
 */
export function isSessionError(errMsg) {
  if (!errMsg) return false;
  const e = errMsg.toLowerCase();
  return (
    e.includes('session expired') ||
    e.includes('invalid session') ||
    e.includes('not logged in') ||
    e.includes('session not found') ||
    e.includes('unauthorized')
  );
}
