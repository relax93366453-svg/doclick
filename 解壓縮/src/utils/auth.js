// src/utils/auth.js
// Simple auth helper that stores only the sessionToken in localStorage
// and validates it via the GAS getSession endpoint.

import { getSession, logout as apiLogout } from '../api/talent';

const SESSION_KEY = 'doclick_session_token';

export const setSessionToken = (token) => {
  localStorage.setItem(SESSION_KEY, token);
};

export const getSessionToken = () => {
  return localStorage.getItem(SESSION_KEY);
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const isLoggedIn = async () => {
  const token = getSessionToken();
  if (!token) return false;
  try {
    const res = await getSession(token);
    return res && res.valid && res.userId;
  } catch (e) {
    console.error('Session validation failed', e);
    return false;
  }
};

export const getCurrentUserId = async () => {
  const token = getSessionToken();
  if (!token) return null;
  try {
    const res = await getSession(token);
    return res && res.valid ? res.userId : null;
  } catch (e) {
    console.error('Get current user failed', e);
    return null;
  }
};

export const logout = async () => {
  const token = getSessionToken();
  if (token) {
    try {
      await apiLogout(token);
    } catch (e) {
      console.warn('Logout API error', e);
    }
  }
  clearSession();
};
