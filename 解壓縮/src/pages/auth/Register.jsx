import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    registerUser,
    sendVerificationCode,
    verifyEmail,
    isNetworkError,
    isTimeoutError,
} from '../../api/talent';


function classifyRegisterError(err, apiError) {
    if (isTimeoutError(err)) {
        return { message: '註冊連線逾時，請稍後再試。', hint: null };
    }
    if (isNetworkError(err)) {
        return { message: '目前無法連線會員系統，請稍後再試。', hint: null };
    }
    if (apiError) {
        const e = apiError.toLowerCase();
        if (e.includes('email already exists')) {
            return {
                message: '此 Email 已有會員資料。',
                hint: 'email_exists',
            };
        }
        if (e.includes('phone already exists')) {
            return {
                message: '此手機號碼已被使用，請確認或使用其他號碼。',
                hint: 'phone_exists',
            };
        }
        return { message: `註冊失敗：${apiError}`, hint: null };
    }
    return { message: '註冊失敗，請確認資料後重試。', hint: null };
}

const Register = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const nextJob = searchParams.get('nextJob');

    const [role, setRole] = useState('talent');
    const [step, setStep] = useState('form'); // form | verify | done
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [errorHint, setErrorHint] = useState(null);
    const [loading, setLoading] = useState(false);

    const [registeredEmail, setRegisteredEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verifyStatus, setVerifyStatus] = useState('');
    const [resendStatus, setResendStatus] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const normalizedEmail = () => formData.email.trim().toLowerCase();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setErrorHint(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) { setError('請填寫姓名'); return; }
        if (!/^09\d{8}$/.test(formData.phone)) { setError('手機格式錯誤（需 09 開頭共 10 碼）'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Email 格式錯誤'); return; }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
            setError('密碼至少 8 碼，且需包含英文字母與數字');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('兩次輸入的密碼不一致');
            return;
        }

        if (role === 'business') {
            navigate('/business/dashboard');
            return;
        }

        setLoading(true);
        setError('');
        setErrorHint(null);

        let caughtErr = null;
        let apiError = null;

        try {
            const result = await registerUser({
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: normalizedEmail(),
                password: formData.password,
            });

            if (!result.success) {
                apiError = result.error || '';
            } else {
                setRegisteredEmail(normalizedEmail());
                setVerificationCode('');
                setVerifyStatus('');
                setResendStatus('sent');
                setStep('verify');
                return;
            }
        } catch (err) {
            caughtErr = err;
            console.error('Register error:', err);
        } finally {
            setLoading(false);
        }

        const { message, hint } = classifyRegisterError(caughtErr, apiError);
        setError(message);
        setErrorHint(hint);
    };

    const handleStartExistingVerification = async () => {
        const email = normalizedEmail();
        if (!email) {
            setError('請先輸入 Email。');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const result = await sendVerificationCode(email);
            if (result.success) {
                setRegisteredEmail(email);
                setVerificationCode('');
                setVerifyStatus('');
                setResendStatus('sent');
                setStep('verify');
            } else {
                setError(result.error || '驗證碼寄送失敗，請稍後再試。');
            }
        } catch (err) {
            setError(isTimeoutError(err)
                ? '連線逾時，請稍後再試。'
                : isNetworkError(err)
                    ? '目前無法連線會員系統，請稍後再試。'
                    : '驗證碼寄送失敗，請稍後再試。');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async () => {
        const code = verificationCode.trim();

        if (!/^\d{6}$/.test(code)) {
            setVerifyStatus('請輸入 6 位數驗證碼');
            return;
        }

        setVerifyStatus('verifying');

        try {
            const result = await verifyEmail({
                email: registeredEmail,
                code,
            });

            if (result.success) {
                setVerifyStatus('success');
                setStep('done');
            } else {
                const msg = result.error || '';
                if (msg.toLowerCase().includes('already verified')) {
                    setStep('done');
                } else {
                    setVerifyStatus(msg || '驗證失敗，請確認驗證碼');
                }
            }
        } catch (err) {
            setVerifyStatus(
                isNetworkError(err)
                    ? '目前無法連線會員系統，請稍後再試。'
                    : '驗證失敗，請稍後再試。'
            );
        }
    };

    const handleResendVerification = async () => {
        if (!registeredEmail) return;

        setResendStatus('sending');
        setVerifyStatus('');

        try {
            const result = await sendVerificationCode(registeredEmail);
            if (result.success) {
                setResendStatus('sent');
            } else {
                setResendStatus(result.error || 'error');
            }
        } catch {
            setResendStatus('error');
        }
    };

    if (step === 'verify') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Link to="/" className="flex justify-center text-3xl font-bold text-talent-600 tracking-wider mb-4">
                        愜易居
                    </Link>

                    <div className="bg-white py-8 px-6 shadow sm:rounded-lg">
                        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                            驗證您的 Email
                        </h2>

                        <p className="text-sm text-gray-600 text-center mb-5">
                            6 位數驗證碼已寄至
                            <br />
                            <strong className="text-gray-800">{registeredEmail}</strong>
                        </p>

                        <label htmlFor="register-verification-code" className="block text-sm font-medium text-gray-700">
                            Email 驗證碼
                        </label>
                        <input
                            id="register-verification-code"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={verificationCode}
                            onChange={(e) => {
                                setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                setVerifyStatus('');
                            }}
                            placeholder="000000"
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-center text-xl tracking-widest focus:outline-none focus:ring-talent-500 focus:border-talent-500"
                        />

                        {verifyStatus &&
                            verifyStatus !== 'verifying' &&
                            verifyStatus !== 'success' && (
                                <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                                    {verifyStatus}
                                </p>
                            )}

                        <button
                            type="button"
                            onClick={handleVerifyEmail}
                            disabled={verifyStatus === 'verifying'}
                            className="mt-4 w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-talent-600 hover:bg-talent-700 disabled:opacity-60"
                        >
                            {verifyStatus === 'verifying' ? '驗證中…' : '完成 Email 驗證'}
                        </button>

                        <div className="mt-4 text-center text-sm">
                            {resendStatus === 'sending' ? (
                                <span className="text-gray-500">寄送中…</span>
                            ) : resendStatus === 'sent' ? (
                                <div className="space-y-2">
                                    <p className="text-green-600">驗證碼已寄出，請查收信件。</p>
                                    <button
                                        type="button"
                                        onClick={handleResendVerification}
                                        className="text-talent-600 underline hover:text-talent-500"
                                    >
                                        沒收到？重新寄送
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {resendStatus && resendStatus !== 'error' && (
                                        <p className="text-red-500">{resendStatus}</p>
                                    )}
                                    {resendStatus === 'error' && (
                                        <p className="text-red-500">寄送失敗，請稍後再試。</p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleResendVerification}
                                        className="text-talent-600 underline hover:text-talent-500"
                                    >
                                        重新寄送驗證碼
                                    </button>
                                </div>
                            )}
                        </div>

                        <p className="mt-5 text-center text-xs text-gray-400">
                            驗證完成前不需要先登入。
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'done') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-6 shadow sm:rounded-lg text-center">
                        <div className="text-5xl mb-3">✓</div>
                        <h2 className="text-xl font-bold text-gray-900">Email 驗證完成</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            您的會員 Email 已完成驗證。
                        </p>

                        <Link
                            to={nextJob ? `/login?nextJob=${nextJob}` : '/login'}
                            className="mt-5 w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-talent-600 hover:bg-talent-700"
                        >
                            前往登入
                        </Link>

                        <Link
                            to="/forgot-password"
                            className="mt-3 inline-block text-sm text-gray-500 hover:text-talent-600"
                        >
                            如果密碼仍無法登入，重新設定密碼
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center text-3xl font-bold text-gray-900 tracking-wider mb-2">
                    愜易居
                </Link>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    建立您的帳戶
                </h2>
                <div className="mt-2 text-center text-sm text-gray-600">
                    <span className="mr-2">已經有帳號？</span>
                    <Link
                        to={nextJob ? `/login?nextJob=${nextJob}` : '/login'}
                        className="font-medium text-talent-600 hover:text-talent-500"
                    >
                        直接登入
                    </Link>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="flex gap-4 mb-6">
                        <div
                            className={`flex-1 p-4 border rounded-lg cursor-pointer text-center transition-all ${role === 'talent' ? 'border-talent-500 bg-talent-50 text-talent-700' : 'border-gray-200 hover:border-gray-300'}`}
                            onClick={() => setRole('talent')}
                        >
                            <i className="fas fa-user mb-2 text-xl block"></i>
                            <div className="font-bold text-sm">我是求職者</div>
                        </div>
                        <div
                            className={`flex-1 p-4 border rounded-lg cursor-pointer text-center transition-all ${role === 'business' ? 'border-biz-500 bg-biz-50 text-biz-700' : 'border-gray-200 hover:border-gray-300'}`}
                            onClick={() => setRole('business')}
                        >
                            <i className="fas fa-building mb-2 text-xl block"></i>
                            <div className="font-bold text-sm">我是企業主</div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
                            <p className="font-medium">{error}</p>

                            {errorHint === 'email_exists' && (
                                <div className="mt-3 space-y-2">
                                    <button
                                        type="button"
                                        onClick={handleStartExistingVerification}
                                        disabled={loading}
                                        className="w-full px-3 py-2 bg-talent-600 text-white rounded text-sm font-medium hover:bg-talent-700 disabled:opacity-60"
                                    >
                                        {loading ? '寄送中…' : '驗證這個 Email'}
                                    </button>

                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            to={nextJob ? `/login?nextJob=${nextJob}` : '/login'}
                                            className="inline-block px-3 py-1 border border-gray-300 text-gray-600 rounded text-xs font-medium hover:bg-gray-50"
                                        >
                                            前往登入
                                        </Link>
                                        <Link
                                            to="/forgot-password"
                                            className="inline-block px-3 py-1 border border-gray-300 text-gray-600 rounded text-xs font-medium hover:bg-gray-50"
                                        >
                                            忘記密碼
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {errorHint === 'phone_exists' && (
                                <p className="mt-1 text-xs text-red-600">
                                    請確認號碼是否輸入正確，或使用其他手機號碼。
                                </p>
                            )}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                {role === 'talent' ? '真實姓名' : '公司名稱'}
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-talent-500 focus:border-talent-500"
                            />
                        </div>

                        {role === 'talent' && (
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    手機號碼（09 開頭，共 10 碼）
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    placeholder="0912345678"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-talent-500 focus:border-talent-500"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email 信箱
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-talent-500 focus:border-talent-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                設定密碼（至少 8 碼，含英文與數字）
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-talent-500 focus:border-talent-500"
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
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                確認密碼
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 pr-16 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-talent-500 focus:border-talent-500"
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
                            id="register-submit-btn"
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-60 disabled:cursor-not-allowed ${role === 'talent' ? 'bg-talent-600 hover:bg-talent-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                        >
                            {loading ? '處理中…' : `註冊${role === 'talent' ? '會員' : '企業帳戶'}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
