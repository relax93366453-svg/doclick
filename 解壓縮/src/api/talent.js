// src/api/talent.js
// Wrapper for Google Apps Script Talent Member endpoints.
// Base URL is set via VITE_TALENT_API_URL in .env
// All action names must match exactly the cases in Code.gs doPost() dispatcher.
// GET is NOT supported by Code.gs – all requests use POST.

const BASE_URL = import.meta.env.VITE_TALENT_API_URL || '';

if (!BASE_URL) {
  console.warn('[talent.js] VITE_TALENT_API_URL is not set. Member API calls will fail.');
}

// Timeout for every GAS request (milliseconds).
// GAS cold-start can be slow; 15 s gives it room while preventing infinite loading.
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * Returns true when the error originated from a real network / connectivity
 * failure (fetch() threw), as opposed to an API-level { success: false } response.
 * API_TIMEOUT also returns true here so existing callers don't need to change.
 */
export const isNetworkError = (err) => !!(err && err.isNetworkError);

/**
 * Returns true specifically when the request timed out (no response within 15 s).
 * Use this to show "登入連線逾時，請稍後再試" instead of the generic network message.
 */
export const isTimeoutError = (err) => !!(err && err.code === 'API_TIMEOUT');

/**
 * Internal POST helper – Google Apps Script compatible.
 *
 * WHY text/plain instead of application/json:
 *   GAS Web Apps redirect (302) to script.googleusercontent.com.
 *   With Content-Type: application/json the browser sends an OPTIONS preflight
 *   which GAS does NOT handle, causing fetch() to throw TypeError("Failed to fetch").
 *   Using text/plain makes it a CORS "simple request" – no preflight is sent.
 *   GAS still receives the JSON body via e.postData.contents exactly as before.
 *
 * TIMEOUT:
 *   An AbortController cancels the request after REQUEST_TIMEOUT_MS.
 *   The resulting error has err.code = 'API_TIMEOUT' and err.isNetworkError = true.
 *
 * @param {string} action  – must match a case in Code.gs doPost switch
 * @param {object} payload – serialised as JSON in the request body
 */
const post = async (action, payload = {}) => {
  if (!BASE_URL) {
    const err = new Error('Talent API URL not configured');
    err.isNetworkError = true;
    err.code = 'NO_URL';
    throw err;
  }

  // action goes in the URL query-string so GAS reads it from e.parameter.action
  const url = `${BASE_URL}?action=${encodeURIComponent(action)}`;

  // AbortController for timeout
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let resp;
  try {
    resp = await fetch(url, {
      method: 'POST',
      // text/plain avoids CORS preflight; GAS reads the body via e.postData.contents
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal,
    });
  } catch (fetchErr) {
    if (fetchErr.name === 'AbortError') {
      const err = new Error(`Talent API [${action}] timed out after ${REQUEST_TIMEOUT_MS / 1000}s`);
      err.isNetworkError = true;
      err.code = 'API_TIMEOUT';
      throw err;
    }
    // fetch() itself threw – true network / connectivity / CORS error
    console.error(`[talent.js] fetch threw for action "${action}":`, fetchErr.message);
    const err = new Error(`Network error calling Talent API [${action}]: ${fetchErr.message}`);
    err.isNetworkError = true;
    throw err;
  } finally {
    clearTimeout(timer);
  }

  if (!resp.ok) {
    // HTTP non-2xx: surface as a plain Error (not NetworkError) so UI can show details
    const text = await resp.text().catch(() => '');
    console.error(`[talent.js] HTTP ${resp.status} for action "${action}":`, text);
    throw new Error(`Talent API [${action}] HTTP ${resp.status}: ${text}`);
  }
  const data = await resp.json();
  return data;
};

// ---- Auth ----

/** 發送 Email 驗證碼（需先 registerUser） */
export const sendVerificationCode = (email) =>
  post('sendVerificationCode', { email });

/** 驗證 Email 驗證碼 */
export const verifyEmail = ({ email, code }) =>
  post('verifyEmail', { email, code });

/** 註冊新會員（name, phone, email, password, consent=true） */
export const registerUser = ({ name, phone, email, password }) =>
  post('registerUser', { name, phone, email, password, consent: true });

/** 登入（identifier=email or phone, password）→ returns { success, sessionToken, userId } */
export const loginUser = ({ identifier, password }) =>
  post('loginUser', { email: identifier, password });

/** 登出（需 sessionToken） */
export const logoutUser = (sessionToken) =>
  post('logoutUser', { sessionToken });

// ---- Session / Member ----

/** 取得會員資料與履歷（需 sessionToken） */
export const getMemberInfo = (sessionToken) =>
  post('getMemberInfo', { sessionToken });

// ---- Resume ----

/** 取得履歷（需 sessionToken） */
export const getResume = (sessionToken) =>
  post('getResume', { sessionToken });

/** 新增或更新履歷（需 sessionToken, resumeJson 為 JSON 字串） */
export const updateResume = (sessionToken, resumeData) =>
  post('updateResume', { sessionToken, resumeJson: JSON.stringify(resumeData) });

// ---- Applications ----

/** 建立投遞紀錄（需 sessionToken, jobId；儲存履歷不等於投遞） */
export const createApplication = (sessionToken, jobId) =>
  post('createApplication', { sessionToken, jobId });

/** 取得應徵紀錄（需 sessionToken） */
export const getApplications = (sessionToken) =>
  post('getApplications', { sessionToken });

// ---- Member Account Assistance (OTP-gated) ----

/**
 * 帳號協助第 1 步：申請 OTP。
 * 無論 Email 是否存在，API 都回傳相同 success response（防止帳號枚舉）。
 * 前端應顯示：「若此 Email 可使用，驗證碼將寄送至您的信箱。」
 */
export const requestAccountHelpOtp = (email) =>
  post('requestAccountHelpOtp', { email });

/**
 * 帳號協助第 2 步：驗證 OTP。
 * 驗證成功後取得短效 verificationToken（10 分鐘、綁定 email、單次使用）。
 * 回傳 { success: true, verificationToken: '...' }
 * ⚠️ verificationToken 必須存在 React state，絕不可寫入 localStorage。
 */
export const verifyAccountHelpOtp = ({ email, code }) =>
  post('verifyAccountHelpOtp', { email, code });

/**
 * 帳號協助第 3 步：查詢帳號狀態。
 * 必須提供 verifyAccountHelpOtp 取得的 verificationToken，否則 API 回傳 Unauthorized。
 * token 為單次使用，過期（10 分鐘）或已用過均無效。
 * 回傳 { success: true, status: 'verified' | 'unverified' | 'not_found' }
 * 絕不回傳 passwordHash / passwordSalt / sessionToken。
 * @param {{ email: string, verificationToken: string }} param
 */
export const checkAccountStatus = ({ email, verificationToken }) =>
  post('checkAccountStatus', { email, verificationToken });

/**
 * 忘記密碼第一步：寄送一次性重設驗證碼至 email。
 * 回傳 { success: true, message: '...' } 或 { success: false, error: '...' }
 * email 不存在時也回傳相同 success（防止枚舉）。
 */
export const requestPasswordReset = (email) =>
  post('requestPasswordReset', { email });

/**
 * 忘記密碼第二步：驗證 OTP 並更新密碼。
 * 成功後所有舊 session 全部失效。
 * @param {{ email: string, code: string, newPassword: string }} param
 */
export const resetPassword = ({ email, code, newPassword }) =>
  post('resetPassword', { email, code, newPassword });
