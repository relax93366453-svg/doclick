import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    requestAccountHelpOtp,
    verifyAccountHelpOtp,
    checkAccountStatus,
    sendVerificationCode,
    isNetworkError,
    isTimeoutError,
} from '../../api/talent';


/**
 * AccountHelp – 帳號協助頁（安全 OTP 驗證版）
 *
 * 完整流程：
 *  Step 1 (email)   → 使用者輸入 Email
 *                     呼叫 requestAccountHelpOtp
 *                     前端一律顯示：「若此 Email 可使用，驗證碼將寄送至您的信箱。」
 *                     （無論 email 是否存在，後端回應完全一致，防止帳號枚舉）
 *
 *  Step 2 (otp)     → 使用者輸入 6 位數 OTP
 *                     呼叫 verifyAccountHelpOtp
 *                     成功 → 取得短效 verificationToken（React state 暫存，不寫 localStorage）
 *                     接著立即呼叫 checkAccountStatus(email, verificationToken)
 *
 *  Step 3 (result)  → 依帳號狀態顯示對應操作：
 *                     verified   → 前往登入 / 忘記密碼
 *                     unverified → 重新寄驗證碼 / 前往登入
 *                     not_found  → 免費註冊
 */

const STEP_EMAIL  = 'email';
const STEP_OTP    = 'otp';
const STEP_RESULT = 'result';

const AccountHelp = () => {
    const [searchParams] = useSearchParams();
    const nextJob = searchParams.get('nextJob');

    // ── state ──────────────────────────────────────────────────────────────
    const [step, setStep]   = useState(STEP_EMAIL);
    const [email, setEmail] = useState('');
    const [code, setCode]   = useState('');

    // verificationToken lives ONLY in React state – never touches localStorage
    const [verificationToken, setVerificationToken] = useState('');

    const [accountStatus, setAccountStatus] = useState(null); // 'verified'|'unverified'|'not_found'
    const [loading, setLoading]             = useState(false);
    const [error, setError]                 = useState('');

    // Resend-OTP state (Step 2)
    const [resendOtpStatus, setResendOtpStatus] = useState(''); // ''|'sending'|'sent'|'cooldown'|'error'
    const [resendOtpMsg, setResendOtpMsg]       = useState('');

    // Resend email-verification state (Step 3 – unverified branch)
    const [resendVerifStatus, setResendVerifStatus] = useState(''); // ''|'sending'|'sent'|'error'
    const [resendVerifMsg, setResendVerifMsg]       = useState('');

    // ── helpers ────────────────────────────────────────────────────────────
    const loginTo    = nextJob ? `/login?nextJob=${nextJob}` : '/login';
    const registerTo = nextJob ? `/register?nextJob=${nextJob}` : '/register';

    const handleStartOver = () => {
        setStep(STEP_EMAIL);
        setEmail('');
        setCode('');
        setVerificationToken('');
        setAccountStatus(null);
        setError('');
        setResendOtpStatus('');
        setResendVerifStatus('');
    };

    // ── Step 1: request OTP ────────────────────────────────────────────────
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setLoading(true);
        setError('');
        try {
            // API always returns success=true with same message (no enumeration)
            const result = await requestAccountHelpOtp(email.trim().toLowerCase());
            if (!result.success) {
                // Only generic format errors reach here
                setError(result.error || '請求失敗，請確認 Email 格式後再試。');
            } else {
                setStep(STEP_OTP);
            }
        } catch (err) {
            if (isTimeoutError(err)) {
                setError('連線逾時，請稍後再試。');
            } else if (isNetworkError(err)) {
                setError('目前無法連線會員系統，請稍後再試。');
            } else {
                setError('請求時發生錯誤，請稍後再試。');
            }
        } finally {
            setLoading(false);
        }
    };

    // ── Resend OTP (Step 2) ────────────────────────────────────────────────
    const handleResendOtp = async () => {
        setResendOtpStatus('sending');
        setResendOtpMsg('');
        try {
            const result = await requestAccountHelpOtp(email.trim().toLowerCase());
            // API always returns success=true – treat as sent
            if (result.success) {
                setResendOtpStatus('sent');
                setResendOtpMsg('驗證碼已重新寄出（若信箱可使用），請查收信件。');
            } else {
                setResendOtpStatus('error');
                setResendOtpMsg(result.error || '寄送失敗，請稍後再試。');
            }
        } catch {
            setResendOtpStatus('error');
            setResendOtpMsg('寄送失敗，請確認網路連線。');
        }
    };

    // ── Step 2: verify OTP → get verificationToken → check status ─────────
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (code.trim().length !== 6 || !/^\d{6}$/.test(code.trim())) {
            setError('驗證碼為 6 位數字，請確認後再試。');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // 2a. Verify OTP and obtain verificationToken
            const verifyResult = await verifyAccountHelpOtp({
                email: email.trim().toLowerCase(),
                code: code.trim(),
            });
            if (!verifyResult.success) {
                const msg = (verifyResult.error || '').toLowerCase();
                if (msg.includes('expired')) {
                    setError('驗證碼已過期（10 分鐘），請重新申請。');
                } else if (msg.includes('invalid')) {
                    setError('驗證碼不正確，請確認後重試。');
                } else if (msg.includes('no pending')) {
                    setError('找不到待驗證的驗證碼，請重新申請。');
                } else {
                    setError(verifyResult.error || '驗證失敗，請稍後再試。');
                }
                return;
            }

            const token = verifyResult.verificationToken;
            // Keep token in component state only – never write to localStorage
            setVerificationToken(token);

            // 2b. Immediately use the token to check account status
            const statusResult = await checkAccountStatus({
                email: email.trim().toLowerCase(),
                verificationToken: token,
            });
            if (!statusResult.success) {
                const msg = (statusResult.error || '').toLowerCase();
                if (msg.includes('unauthorized') || msg.includes('expired') || msg.includes('invalid')) {
                    setError('驗證憑證無效或已過期，請重新開始帳號協助流程。');
                } else {
                    setError(statusResult.error || '查詢帳號狀態失敗，請稍後再試。');
                }
                return;
            }

            setAccountStatus(statusResult.status);
            setStep(STEP_RESULT);
        } catch (err) {
            if (isTimeoutError(err)) {
                setError('連線逾時，請稍後再試。');
            } else if (isNetworkError(err)) {
                setError('目前無法連線會員系統，請稍後再試。');
            } else {
                setError('驗證時發生錯誤，請稍後再試。');
            }
        } finally {
            setLoading(false);
        }
    };

    // ── Resend email-verification (Step 3 – unverified branch) ────────────
    const handleResendEmailVerification = async () => {
        setResendVerifStatus('sending');
        setResendVerifMsg('');
        try {
            const result = await sendVerificationCode(email.trim().toLowerCase());
            if (result.success) {
                setResendVerifStatus('sent');
                setResendVerifMsg('驗證信已寄出，請查收信件（含垃圾信件匣）。');
            } else {
                const msg = (result.error || '').toLowerCase();
                if (msg.includes('wait') || msg.includes('60')) {
                    setResendVerifStatus('error');
                    setResendVerifMsg('請稍候 60 秒後再重新寄送。');
                } else {
                    setResendVerifStatus('error');
                    setResendVerifMsg(result.error || '寄送失敗，請稍後再試。');
                }
            }
        } catch {
            setResendVerifStatus('error');
            setResendVerifMsg('寄送失敗，請確認網路連線後再試。');
        }
    };

    // ── Progress indicator ─────────────────────────────────────────────────
    const ProgressBar = () => {
        const steps = [
            { key: STEP_EMAIL,  label: '輸入信箱' },
            { key: STEP_OTP,    label: '輸入驗證碼' },
            { key: STEP_RESULT, label: '查看結果' },
        ];
        const currentIdx = steps.findIndex(s => s.key === step);
        return (
            <div className="flex items-center justify-center gap-2 mb-6">
                {steps.map(({ key, label }, idx) => {
                    const itemIdx = steps.findIndex(s => s.key === key);
                    const done   = itemIdx < currentIdx;
                    const active = itemIdx === currentIdx;
                    return (
                        <React.Fragment key={key}>
                            {idx > 0 && (
                                <div className={`flex-1 h-0.5 ${done ? 'bg-talent-500' : 'bg-gray-200'}`} />
                            )}
                            <div className="flex flex-col items-center gap-1">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                                    ${active ? 'bg-talent-600 text-white ring-2 ring-talent-200' :
                                      done   ? 'bg-talent-500 text-white' :
                                               'bg-gray-200 text-gray-400'}`}>
                                    {done ? '✓' : idx + 1}
                                </div>
                                <span className={`text-xs hidden sm:block ${active ? 'text-talent-700 font-semibold' : 'text-gray-400'}`}>
                                    {label}
                                </span>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center text-3xl font-bold text-talent-600 tracking-wider mb-2">
                    愜易居
                </Link>
                <h2 className="text-center text-2xl font-extrabold text-gray-900">帳號協助</h2>
                <p className="mt-2 text-center text-sm text-gray-500">
                    透過 Email 驗證確認您的帳號狀態
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow sm:rounded-lg">
                    <ProgressBar />

                    {/* ── Step 1: Email ── */}
                    {step === STEP_EMAIL && (
                        <form onSubmit={handleRequestOtp} className="space-y-4">
                            <p className="text-sm text-gray-600">
                                請輸入您的 Email，系統將寄送一次性驗證碼確認信箱持有。
                            </p>
                            <div>
                                <label htmlFor="help-email" className="block text-sm font-medium text-gray-700">
                                    Email 信箱
                                </label>
                                <input
                                    id="help-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-talent-500 focus:border-talent-500 sm:text-sm"
                                    placeholder="your@email.com"
                                />
                            </div>
                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                                    {error}
                                </p>
                            )}
                            <button
                                id="account-help-request-otp-btn"
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talent-600 hover:bg-talent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-talent-500 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? '處理中…' : '寄送驗證碼'}
                            </button>
                            <div className="text-center text-sm text-gray-500">
                                <Link to={loginTo} className="font-medium text-talent-600 hover:text-talent-500">
                                    ← 返回登入
                                </Link>
                            </div>
                        </form>
                    )}

                    {/* ── Step 2: OTP input ── */}
                    {step === STEP_OTP && (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
                                若 <strong>{email}</strong> 可使用，驗證碼將寄送至您的信箱。
                                <br /><span className="text-xs">（有效時間 10 分鐘，請同時查看垃圾信件匣）</span>
                            </div>
                            <div>
                                <label htmlFor="help-otp" className="block text-sm font-medium text-gray-700">
                                    6 位數驗證碼
                                </label>
                                <input
                                    id="help-otp"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    required
                                    value={code}
                                    onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-center text-lg tracking-widest focus:outline-none focus:ring-talent-500 focus:border-talent-500"
                                    placeholder="000000"
                                />
                            </div>
                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                                    {error}
                                </p>
                            )}
                            <button
                                id="account-help-verify-otp-btn"
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talent-600 hover:bg-talent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-talent-500 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? '驗證中…' : '確認驗證碼'}
                            </button>

                            {/* Resend OTP row */}
                            <div className="text-center text-sm space-y-1">
                                {resendOtpStatus === '' && (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        className="text-talent-600 hover:text-talent-500 underline"
                                    >
                                        沒有收到？重新寄送
                                    </button>
                                )}
                                {resendOtpStatus === 'sending' && (
                                    <span className="text-gray-500">寄送中…</span>
                                )}
                                {resendOtpStatus === 'sent' && (
                                    <span className="text-green-600">{resendOtpMsg}</span>
                                )}
                                {(resendOtpStatus === 'error' || resendOtpStatus === 'cooldown') && (
                                    <span className="text-red-500">{resendOtpMsg}</span>
                                )}
                            </div>

                            <div className="text-center text-sm text-gray-500">
                                <button
                                    type="button"
                                    onClick={handleStartOver}
                                    className="text-gray-400 hover:text-gray-600 underline"
                                >
                                    ← 重新輸入 Email
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ── Step 3: Result ── */}
                    {step === STEP_RESULT && (
                        <div className="text-center space-y-4">

                            {/* verified */}
                            {accountStatus === 'verified' && (
                                <>
                                    <div className="text-4xl">✅</div>
                                    <h3 className="text-lg font-bold text-gray-900">此 Email 已有帳號</h3>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold text-gray-800">{email}</span><br />
                                        已完成 Email 驗證，可以直接登入。
                                    </p>
                                    <div className="flex flex-col gap-2 mt-4">
                                        <Link
                                            to={loginTo}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talent-600 hover:bg-talent-700"
                                        >
                                            前往登入
                                        </Link>
                                        <Link
                                            to="/forgot-password"
                                            className="w-full flex justify-center py-2 px-4 border border-talent-400 rounded-md text-sm font-medium text-talent-600 hover:bg-talent-50"
                                        >
                                            忘記密碼？重設密碼
                                        </Link>
                                    </div>
                                </>
                            )}

                            {/* unverified */}
                            {accountStatus === 'unverified' && (
                                <>
                                    <div className="text-4xl">📧</div>
                                    <h3 className="text-lg font-bold text-gray-900">帳號尚未完成 Email 驗證</h3>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold text-gray-800">{email}</span><br />
                                        此帳號已完成基本註冊，但 Email 驗證尚未完成。<br />
                                        完成驗證後即可正常登入。
                                    </p>
                                    <div className="space-y-2 mt-4">
                                        {resendVerifStatus === '' && (
                                            <button
                                                id="account-help-resend-verif-btn"
                                                type="button"
                                                onClick={handleResendEmailVerification}
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talent-600 hover:bg-talent-700"
                                            >
                                                重新寄送驗證碼
                                            </button>
                                        )}
                                        {resendVerifStatus === 'sending' && (
                                            <p className="text-sm text-gray-500">寄送中…</p>
                                        )}
                                        {resendVerifStatus === 'sent' && (
                                            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
                                                {resendVerifMsg}
                                            </div>
                                        )}
                                        {resendVerifStatus === 'error' && (
                                            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                                                {resendVerifMsg}
                                            </p>
                                        )}
                                        <Link
                                            to={loginTo}
                                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
                                        >
                                            已有驗證碼，前往登入
                                        </Link>
                                    </div>
                                </>
                            )}

                            {/* not_found */}
                            {accountStatus === 'not_found' && (
                                <>
                                    <div className="text-4xl">🔍</div>
                                    <h3 className="text-lg font-bold text-gray-900">尚未建立會員帳號</h3>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold text-gray-800">{email}</span><br />
                                        尚未建立愜易居會員帳號，可以立即免費申請。
                                    </p>
                                    <div className="flex flex-col gap-2 mt-4">
                                        <Link
                                            to={registerTo}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talent-600 hover:bg-talent-700"
                                        >
                                            立即免費註冊
                                        </Link>
                                        <Link
                                            to={loginTo}
                                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
                                        >
                                            返回登入
                                        </Link>
                                    </div>
                                </>
                            )}

                            <button
                                type="button"
                                onClick={handleStartOver}
                                className="mt-4 text-xs text-gray-400 hover:text-gray-600 underline"
                            >
                                查詢其他 Email
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountHelp;
