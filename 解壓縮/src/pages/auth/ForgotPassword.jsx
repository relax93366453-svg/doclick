import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    requestPasswordReset,
    resetPassword,
    sendVerificationCode,
    verifyEmail,
    isNetworkError,
    isTimeoutError,
} from '../../api/talent';


const STEP_EMAIL = 'email';
const STEP_EMAIL_VERIFY = 'email_verify';
const STEP_RESET = 'reset';
const STEP_DONE = 'done';

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(STEP_EMAIL);
    const [email, setEmail] = useState('');
    const [emailVerifyCode, setEmailVerifyCode] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendStatus, setResendStatus] = useState('');

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const normalizedEmail = () => email.trim().toLowerCase();

    const requestResetOtp = async () => {
        const result = await requestPasswordReset(normalizedEmail());

        if (result.success) {
            setResetCode('');
            setResendStatus('');
            setInfo('重設密碼驗證碼已寄出，請查收信件。');
            setStep(STEP_RESET);
            return true;
        }

        return result;
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setError('');
        setInfo('');

        try {
            const result = await requestPasswordReset(normalizedEmail());

            if (result.success) {
                setStep(STEP_RESET);
                setInfo('重設密碼驗證碼已寄出，請查收信件。');
            } else {
                const msg = (result.error || '').toLowerCase();

                if (msg.includes('not verified')) {
                    const sendResult = await sendVerificationCode(normalizedEmail());

                    if (sendResult.success) {
                        setEmailVerifyCode('');
                        setStep(STEP_EMAIL_VERIFY);
                        setInfo('此帳號尚未完成 Email 驗證，已先寄送 Email 驗證碼。');
                    } else {
                        setError(sendResult.error || 'Email 驗證碼寄送失敗，請稍後再試。');
                    }
                } else if (msg.includes('too many') || msg.includes('daily')) {
                    setError('今日重設請求次數已達上限，請明天再試。');
                } else if (msg.includes('60 seconds') || msg.includes('wait')) {
                    setError('請稍候 60 秒後再重新申請。');
                } else {
                    setError(result.error || '申請失敗，請稍後再試。');
                }
            }
        } catch (err) {
            setError(
                isTimeoutError(err)
                    ? '連線逾時，請稍後再試。'
                    : isNetworkError(err)
                        ? '目前無法連線會員系統，請稍後再試。'
                        : '申請時發生錯誤，請稍後再試。'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();

        const code = emailVerifyCode.trim();
        if (!/^\d{6}$/.test(code)) {
            setError('Email 驗證碼為 6 位數字。');
            return;
        }

        setLoading(true);
        setError('');
        setInfo('');

        try {
            const result = await verifyEmail({
                email: normalizedEmail(),
                code,
            });

            if (!result.success) {
                setError(result.error || 'Email 驗證失敗，請確認驗證碼。');
                return;
            }

            setInfo('Email 驗證完成，正在寄送重設密碼驗證碼…');

            const resetResult = await requestPasswordReset(normalizedEmail());

            if (resetResult.success) {
                setResetCode('');
                setInfo('Email 驗證完成。重設密碼驗證碼已另外寄出，請查收最新信件。');
                setStep(STEP_RESET);
            } else {
                setError(resetResult.error || 'Email 已驗證，但重設密碼驗證碼寄送失敗，請稍後再試。');
            }
        } catch (err) {
            setError(
                isTimeoutError(err)
                    ? '連線逾時，請稍後再試。'
                    : isNetworkError(err)
                        ? '目前無法連線會員系統，請稍後再試。'
                        : 'Email 驗證失敗，請稍後再試。'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmailVerification = async () => {
        setResendStatus('sending');
        setError('');

        try {
            const result = await sendVerificationCode(normalizedEmail());
            if (result.success) {
                setResendStatus('sent');
            } else {
                setResendStatus(result.error || 'error');
            }
        } catch {
            setResendStatus('error');
        }
    };

    const handleResendReset = async () => {
        setResendStatus('sending');
        setError('');

        try {
            const result = await requestPasswordReset(normalizedEmail());

            if (result.success) {
                setResendStatus('sent');
                setInfo('重設密碼驗證碼已重新寄出。');
            } else {
                const msg = (result.error || '').toLowerCase();
                if (msg.includes('60') || msg.includes('wait')) {
                    setResendStatus('cooldown');
                } else {
                    setResendStatus(result.error || 'error');
                }
            }
        } catch {
            setResendStatus('error');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        const code = resetCode.trim();

        if (!/^\d{6}$/.test(code)) {
            setError('重設密碼驗證碼為 6 位數字，請確認後再試。');
            return;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword)) {
            setError('新密碼至少 8 碼，且需包含英文字母與數字。');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('兩次輸入的新密碼不一致。');
            return;
        }

        setLoading(true);
        setInfo('');

        try {
            const result = await resetPassword({
                email: normalizedEmail(),
                code,
                newPassword,
            });

            if (!result.success) {
                const msg = (result.error || '').toLowerCase();

                if (msg.includes('invalid reset code') || msg.includes('invalid code')) {
                    setError('驗證碼不正確，請確認後重試。');
                } else if (msg.includes('expired')) {
                    setError('驗證碼已過期，請重新申請。');
                } else if (msg.includes('no valid reset code')) {
                    setError('找不到有效的驗證碼，請重新申請。');
                } else if (msg.includes('password must be')) {
                    setError('新密碼至少 8 碼，且需包含英文字母與數字。');
                } else {
                    setError(result.error || '重設失敗，請稍後再試。');
                }
            } else {
                setStep(STEP_DONE);
            }
        } catch (err) {
            setError(
                isTimeoutError(err)
                    ? '連線逾時，請稍後再試。'
                    : isNetworkError(err)
                        ? '目前無法連線會員系統，請稍後再試。'
                        : '重設時發生錯誤，請稍後再試。'
            );
        } finally {
            setLoading(false);
        }
    };

    const StepHeader = () => {
        const labels = {
            [STEP_EMAIL]: '輸入註冊 Email',
            [STEP_EMAIL_VERIFY]: '先完成 Email 驗證',
            [STEP_RESET]: '設定新密碼',
            [STEP_DONE]: '完成',
        };

        return (
            <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-gray-400">目前步驟</p>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{labels[step]}</h3>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center text-3xl font-bold text-talent-600 tracking-wider mb-2">
                    愜易居
                </Link>
                <h2 className="text-center text-2xl font-extrabold text-gray-900">
                    忘記密碼
                </h2>
                <p className="mt-1 text-center text-sm text-gray-500">
                    系統會依帳號狀態引導完成 Email 驗證與密碼重設
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow sm:rounded-lg">
                    <StepHeader />

                    {info && (
                        <p className="mb-4 text-sm text-blue-700 bg-blue-50 border border-blue-200 px-3 py-2 rounded">
                            {info}
                        </p>
                    )}

                    {error && (
                        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                            {error}
                        </p>
                    )}

                    {step === STEP_EMAIL && (
                        <form onSubmit={handleRequestReset} className="space-y-5">
                            <p className="text-sm text-gray-600">
                                請輸入您的註冊 Email。如果帳號尚未完成 Email 驗證，系統會先引導您完成驗證。
                            </p>

                            <div>
                                <label htmlFor="fp-email" className="block text-sm font-medium text-gray-700">
                                    Email 信箱
                                </label>
                                <input
                                    id="fp-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                        setInfo('');
                                    }}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-talent-500 focus:border-talent-500 sm:text-sm"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-talent-600 hover:bg-talent-700 disabled:opacity-60"
                            >
                                {loading ? '處理中…' : '繼續'}
                            </button>

                            <div className="text-center text-sm">
                                <Link to="/login" className="text-talent-600 hover:text-talent-500">
                                    ← 返回登入
                                </Link>
                            </div>
                        </form>
                    )}

                    {step === STEP_EMAIL_VERIFY && (
                        <form onSubmit={handleVerifyEmail} className="space-y-5">
                            <p className="text-sm text-gray-600">
                                請先輸入寄到 <strong>{email}</strong> 的 Email 驗證碼。
                                驗證成功後，系統會再寄一封「重設密碼驗證碼」。
                            </p>

                            <div>
                                <label htmlFor="fp-email-verify-code" className="block text-sm font-medium text-gray-700">
                                    Email 驗證碼
                                </label>
                                <input
                                    id="fp-email-verify-code"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={emailVerifyCode}
                                    onChange={(e) => {
                                        setEmailVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                        setError('');
                                    }}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-talent-500 focus:border-talent-500"
                                    placeholder="000000"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-talent-600 hover:bg-talent-700 disabled:opacity-60"
                            >
                                {loading ? '驗證中…' : '完成 Email 驗證並繼續'}
                            </button>

                            <div className="text-center text-sm">
                                {resendStatus === 'sending' ? (
                                    <span className="text-gray-500">寄送中…</span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendEmailVerification}
                                        className="text-talent-600 underline"
                                    >
                                        沒收到 Email 驗證碼？重新寄送
                                    </button>
                                )}

                                {resendStatus === 'sent' && (
                                    <p className="mt-2 text-green-600">Email 驗證碼已重新寄出。</p>
                                )}
                                {resendStatus &&
                                    !['sending', 'sent'].includes(resendStatus) && (
                                        <p className="mt-2 text-red-500">
                                            {resendStatus === 'error'
                                                ? '寄送失敗，請稍後再試。'
                                                : resendStatus}
                                        </p>
                                    )}
                            </div>
                        </form>
                    )}

                    {step === STEP_RESET && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <p className="text-sm text-gray-600">
                                請輸入最新收到的「重設密碼驗證碼」，再設定新密碼。
                            </p>

                            <div>
                                <label htmlFor="fp-reset-code" className="block text-sm font-medium text-gray-700">
                                    重設密碼驗證碼
                                </label>
                                <input
                                    id="fp-reset-code"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={resetCode}
                                    onChange={(e) => {
                                        setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                        setError('');
                                    }}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-talent-500 focus:border-talent-500"
                                    placeholder="000000"
                                />
                            </div>

                            <div>
                                <label htmlFor="fp-newpw" className="block text-sm font-medium text-gray-700">
                                    新密碼（至少 8 碼，含英文與數字）
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="fp-newpw"
                                        type={showNewPassword ? 'text' : 'password'}
                                        required
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            setError('');
                                        }}
                                        className="block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-talent-500 focus:border-talent-500 sm:text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-3 text-xs text-gray-500 hover:text-talent-600"
                                    >
                                        {showNewPassword ? '隱藏' : '顯示'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="fp-confirmpw" className="block text-sm font-medium text-gray-700">
                                    確認新密碼
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="fp-confirmpw"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setError('');
                                        }}
                                        className="block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-talent-500 focus:border-talent-500 sm:text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-3 text-xs text-gray-500 hover:text-talent-600"
                                    >
                                        {showConfirmPassword ? '隱藏' : '顯示'}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-talent-600 hover:bg-talent-700 disabled:opacity-60"
                            >
                                {loading ? '更新中…' : '確認重設密碼'}
                            </button>

                            <div className="text-center text-sm">
                                {resendStatus === 'sending' ? (
                                    <span className="text-gray-500">寄送中…</span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendReset}
                                        className="text-talent-600 underline"
                                    >
                                        沒收到？重新寄送重設密碼驗證碼
                                    </button>
                                )}

                                {resendStatus === 'sent' && (
                                    <p className="mt-2 text-green-600">驗證碼已重新寄出。</p>
                                )}
                                {resendStatus === 'cooldown' && (
                                    <p className="mt-2 text-red-500">請稍候 60 秒後再重新寄送。</p>
                                )}
                                {resendStatus &&
                                    !['sending', 'sent', 'cooldown'].includes(resendStatus) && (
                                        <p className="mt-2 text-red-500">
                                            {resendStatus === 'error'
                                                ? '寄送失敗，請稍後再試。'
                                                : resendStatus}
                                        </p>
                                    )}
                            </div>
                        </form>
                    )}

                    {step === STEP_DONE && (
                        <div className="text-center space-y-4">
                            <div className="text-5xl">✓</div>
                            <h3 className="text-lg font-bold text-gray-900">密碼已成功重設</h3>
                            <p className="text-sm text-gray-600">
                                請使用剛剛設定的新密碼重新登入。
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-talent-600 hover:bg-talent-700"
                            >
                                前往登入
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
