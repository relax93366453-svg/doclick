import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    loginUser,
    sendVerificationCode,
    verifyEmail,
    getMemberInfo,
    isNetworkError,
    isTimeoutError,
} from '../../api/talent';
import { cacheMemberInfo, SESSION_CHANGE_EVENT } from '../../helpers/authHelper';

// Session token key (shared with all pages that need auth)
const SESSION_KEY = 'doclick_session_token';
const SESSION_USER_KEY = 'doclick_session_user';

/**
 * Maps GAS error strings to user-friendly Traditional-Chinese messages.
 * Returns an object: { message, showResendVerification }
 */
function classifyLoginError(err, apiError) {
    if (isTimeoutError(err)) {
        return {
            message: '登入連線逾時，請稍後再試。',
            showResendVerification: false,
        };
    }
    if (isNetworkError(err)) {
        return {
            message: '目前無法連線會員系統，請稍後再試。',
            showResendVerification: false,
        };
    }
    if (apiError) {
        const e = apiError.toLowerCase();
        if (e.includes('not found') || e.includes('invalid credentials')) {
            return { message: 'Email 或密碼不正確。', showResendVerification: false };
        }
        if (e.includes('not verified') || e.includes('email not verified')) {
            return {
                message: '此帳號尚未完成 Email 驗證。',
                showResendVerification: true,
            };
        }
        if (e.includes('session expired') || e.includes('invalid session')) {
            return { message: '登入已逾期，請重新登入。', showResendVerification: false };
        }
        return { message: `登入失敗：${apiError}`, showResendVerification: false };
    }
    return { message: '登入失敗，請確認 Email 與密碼後重試。', showResendVerification: false };
}

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const nextJob  = searchParams.get('nextJob');
    const nextPath = searchParams.get('next'); // e.g. /talent/applications

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showResendVerification, setShowResendVerification] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Resend / inline verify states
    const [resendStatus, setResendStatus] = useState(''); // '' | 'sending' | 'sent' | 'error'
    const [resendMsg, setResendMsg] = useState('');
    // Inline Email verification (shown after sendVerificationCode succeeds)
    const [showInlineVerify, setShowInlineVerify] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');
    const [verifyStatus, setVerifyStatus] = useState(''); // '' | 'verifying' | 'success' | error string

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setShowResendVerification(false);
        setResendStatus('');
        setResendMsg('');
        setShowInlineVerify(false);
        setVerifyCode('');
        setVerifyStatus('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setShowResendVerification(false);
        setResendStatus('');
        setResendMsg('');
        setShowInlineVerify(false);
        setVerifyCode('');
        setVerifyStatus('');

        let caughtErr = null;
        let apiError = null;
        try {
            const result = await loginUser({
                identifier: formData.email,
                password: formData.password,
            });
            if (!result.success) {
                apiError = result.error || '';
            } else {
                // Persist session token and userId for subsequent API calls
                localStorage.setItem(SESSION_KEY, result.sessionToken);
                localStorage.setItem(SESSION_USER_KEY, JSON.stringify({
                    userId: result.userId,
                    sessionToken: result.sessionToken,
                }));
                // Notify MemberNavbar instances immediately
                window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
                // Fetch member info in background to populate Navbar name/email
                getMemberInfo(result.sessionToken)
                    .then(info => {
                        if (info.success && info.profile) {
                            cacheMemberInfo({
                                userId: info.profile.userId,
                                name:   info.profile.name || '',
                                email:  info.profile.email || '',
                                phone:  info.profile.phone || '',
                                verified: info.profile.verified,
                            });
                            // Second dispatch so navbar shows real name
                            window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
                        }
                    })
                    .catch(() => { /* non-critical – Navbar falls back to sessionMeta */ });
                // Navigate: next > nextJob > /jobs
                if (nextPath) {
                    navigate(nextPath);
                } else if (nextJob) {
                    navigate(`/jobs?openJob=${nextJob}`);
                } else {
                    navigate('/jobs');
                }
                return;
            }
        } catch (err) {
            caughtErr = err;
            console.error('Login error:', err.message);
        } finally {
            setLoading(false);
        }

        const { message, showResendVerification: showResend } = classifyLoginError(caughtErr, apiError);
        setError(message);
        setShowResendVerification(showResend);
    };

    // ── Resend Email verification code ─────────────────────────────────────
    const handleResendVerification = async () => {
        if (!formData.email) return;
        setResendStatus('sending');
        setResendMsg('');
        setShowInlineVerify(false);
        setVerifyCode('');
        setVerifyStatus('');
        try {
            const result = await sendVerificationCode(formData.email.trim().toLowerCase());
            if (result.success) {
                setResendStatus('sent');
                setResendMsg('驗證碼已寄出，請查收信件。');
                setShowInlineVerify(true);
            } else {
                const msg = (result.error || '').toLowerCase();
                if (msg.includes('wait') || msg.includes('60')) {
                    setResendStatus('error');
                    setResendMsg('請稍候 60 秒後再重新申請。');
                } else if (msg.includes('daily') || msg.includes('limit')) {
                    setResendStatus('error');
                    setResendMsg('今日驗證碼寄送次數已達上限，請明天再試。');
                } else if (msg.includes('already verified')) {
                    setResendStatus('error');
                    setResendMsg('此 Email 已完成驗證，請直接登入。');
                } else {
                    setResendStatus('error');
                    setResendMsg(result.error || '驗證碼寄送失敗，請稍後再試。');
                }
            }
        } catch (err) {
            setResendStatus('error');
            if (isTimeoutError(err)) {
                setResendMsg('連線逾時，請稍後再試。');
            } else if (isNetworkError(err)) {
                setResendMsg('目前無法連線會員系統，請稍後再試。');
            } else {
                setResendMsg('寄送失敗，請稍後再試。');
            }
        }
    };

    // ── Inline Email verification ───────────────────────────────────────────
    const handleVerifyEmail = async () => {
        const code = verifyCode.trim();
        if (!/^\d{6}$/.test(code)) {
            setVerifyStatus('請輸入 6 位數驗證碼');
            return;
        }
        setVerifyStatus('verifying');
        try {
            const result = await verifyEmail({
                email: formData.email.trim().toLowerCase(),
                code,
            });
            if (result.success) {
                setVerifyStatus('success');
                setError('');
                setShowResendVerification(false);
            } else {
                const msg = (result.error || '').toLowerCase();
                if (msg.includes('already verified')) {
                    setVerifyStatus('success');
                    setError('');
                    setShowResendVerification(false);
                } else if (msg.includes('expired')) {
                    setVerifyStatus('驗證碼已過期，請重新寄送。');
                } else if (msg.includes('invalid')) {
                    setVerifyStatus('驗證碼不正確，請確認後再試。');
                } else {
                    setVerifyStatus(result.error || '驗證失敗，請稍後再試。');
                }
            }
        } catch (err) {
            if (isTimeoutError(err)) {
                setVerifyStatus('連線逾時，請稍後再試。');
            } else if (isNetworkError(err)) {
                setVerifyStatus('目前無法連線，請稍後再試。');
            } else {
                setVerifyStatus('驗證失敗，請稍後再試。');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center text-3xl font-bold text-talent-600 tracking-wider mb-2">
                    愜易居
                </Link>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    登入您的帳戶
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    還沒有帳號嗎？{' '}
                    <Link
                        to={nextJob ? `/register?nextJob=${nextJob}` : '/register'}
                        className="font-medium text-talent-600 hover:text-talent-500"
                    >
                        立即免費註冊
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {/* ── Error / Resend area ── */}
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
                            <p>{error}</p>

                            {showResendVerification && (
                                <div className="mt-3 space-y-3">
                                    {/* Resend button / status */}
                                    {resendStatus === '' && (
                                        <button
                                            type="button"
                                            onClick={handleResendVerification}
                                            className="text-talent-600 underline hover:text-talent-500 text-sm font-medium"
                                        >
                                            重新寄送驗證碼
                                        </button>
                                    )}
                                    {resendStatus === 'sending' && (
                                        <span className="text-gray-500 text-sm">寄送中…</span>
                                    )}
                                    {resendStatus === 'sent' && (
                                        <p className="text-green-700 text-sm">{resendMsg}</p>
                                    )}
                                    {resendStatus === 'error' && (
                                        <div className="space-y-1">
                                            <p className="text-red-600 text-sm">{resendMsg}</p>
                                            <button
                                                type="button"
                                                onClick={handleResendVerification}
                                                className="text-talent-600 underline hover:text-talent-500 text-xs"
                                            >
                                                再試一次
                                            </button>
                                        </div>
                                    )}

                                    {/* ── Inline verification code input ── */}
                                    {showInlineVerify && verifyStatus !== 'success' && (
                                        <div className="mt-3 border-t border-red-200 pt-3 space-y-2">
                                            <p className="text-sm text-gray-700 font-medium">輸入 6 位數驗證碼完成驗證：</p>
                                            <div className="flex gap-2">
                                                <input
                                                    id="login-verify-code"
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={6}
                                                    value={verifyCode}
                                                    onChange={(ev) => {
                                                        setVerifyCode(ev.target.value.replace(/\D/g, '').slice(0, 6));
                                                        setVerifyStatus('');
                                                    }}
                                                    placeholder="000000"
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-talent-500 focus:border-talent-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyEmail}
                                                    disabled={verifyStatus === 'verifying'}
                                                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-talent-600 hover:bg-talent-700 disabled:opacity-60"
                                                >
                                                    {verifyStatus === 'verifying' ? '驗證中…' : '確認'}
                                                </button>
                                            </div>
                                            {verifyStatus && verifyStatus !== 'verifying' && verifyStatus !== 'success' && (
                                                <p className="text-sm text-red-600">{verifyStatus}</p>
                                            )}
                                            <button
                                                type="button"
                                                onClick={handleResendVerification}
                                                className="text-xs text-talent-600 underline hover:text-talent-500"
                                            >
                                                沒收到？重新寄送
                                            </button>
                                        </div>
                                    )}

                                    {/* ── Verification success ── */}
                                    {verifyStatus === 'success' && (
                                        <div className="mt-3 border-t border-green-200 pt-3 bg-green-50 px-3 py-2 rounded">
                                            <p className="text-green-700 text-sm font-medium">✓ Email 驗證完成，請重新登入。</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email 信箱
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-talent-500 focus:border-talent-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    密碼
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-talent-600 hover:text-talent-500 font-medium"
                                    id="forgot-password-link"
                                >
                                    忘記密碼？
                                </Link>
                            </div>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-talent-500 focus:border-talent-500 sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-3 text-xs text-gray-500 hover:text-talent-600"
                                >
                                    {showPassword ? '隱藏' : '顯示'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                id="login-submit-btn"
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talent-600 hover:bg-talent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-talent-500 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? '登入中…' : '登入'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 space-y-2 text-center text-sm">
                        <div className="text-gray-500">
                            還沒有帳號？{' '}
                            <Link
                                to={nextJob ? `/register?nextJob=${nextJob}` : '/register'}
                                className="font-medium text-talent-600 hover:text-talent-500"
                            >
                                免費註冊
                            </Link>
                        </div>
                        <div className="text-gray-400">
                            <Link
                                to="/account-help"
                                id="account-help-link"
                                className="font-medium text-gray-500 hover:text-talent-600"
                            >
                                不確定是否註冊過？帳號協助
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
