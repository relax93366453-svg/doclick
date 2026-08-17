// src/pages/talent/AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { loginUser, registerUser } from '../../api/talent';
import { isApplicantLoggedIn, getCurrentApplicant, logoutApplicantAccount, getSessionToken } from '../../helpers/authHelper';

const SESSION_KEY      = 'doclick_session_token';
const SESSION_USER_KEY = 'doclick_session_user';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const initialMode = modeParam === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser({ identifier: formData.email || formData.phone, password: formData.password });
      if (!result.success) { alert(result.error || '登入失敗'); return; }
      localStorage.setItem(SESSION_KEY, result.sessionToken);
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify({ userId: result.userId, sessionToken: result.sessionToken }));
      const redirect = sessionStorage.getItem('doclick_redirect_after_login');
      if (redirect) {
        sessionStorage.removeItem('doclick_redirect_after_login');
        sessionStorage.removeItem('doclick_pending_job_id');
        navigate(redirect);
      } else {
        navigate('/talent');
      }
    } catch (err) {
      alert('網路異常，請稍後重試。');
    }
  };



  // Register via GAS registerUser – sends Email verification code automatically
  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { alert('密碼與確認密碼不符'); return; }
    try {
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      if (!result.success) { alert(result.error || '註冊失敗'); return; }
      alert('註冊成功！請檢查信筐中的驗證信以完成驗證。');
      setMode('login');
    } catch (err) {
      alert('網路異常，請稍後重試。');
    }
  };

  const isLoggedIn = isApplicantLoggedIn();
  const currentUser = getCurrentApplicant();

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
        <h2 className="text-2xl font-bold mb-4">已登入</h2>
        <p className="mb-2">歡迎，{currentUser.name || currentUser.email}</p>
        <div className="flex gap-4">
          <Link to="/talent/profile" className="px-4 py-2 bg-talent-600 text-white rounded">我的履歷</Link>
          <Link to="/jobs" className="px-4 py-2 bg-talent-600 text-white rounded">我的應徵紀錄</Link>
          <button onClick={() => { logoutApplicantAccount(); navigate('/talent'); }} className="px-4 py-2 bg-gray-300 rounded">登出</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center text-3xl font-bold text-talent-600 tracking-wider mb-2">愜易居</Link>
        <div className="flex justify-center mb-4">
          <button onClick={() => setMode('login')} className={`px-4 py-2 ${mode === 'login' ? 'border-b-2 border-talent-600' : ''}`}>登入</button>
          <button onClick={() => setMode('register')} className={`px-4 py-2 ${mode === 'register' ? 'border-b-2 border-talent-600' : ''}`}>註冊</button>
        </div>
        {mode === 'login' ? (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email 或手機號碼</label>
                <div className="mt-1">
                  <input id="email" name="email" type="text" required value={formData.email} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">密碼</label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-talent-600" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">記住我</label>
                </div>
                <div className="text-sm"><a href="#" className="font-medium text-talent-600 hover:text-talent-500">忘記密碼？</a></div>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talent-600 hover:bg-talent-700 focus:outline-none">
                  登入
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleRegister}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">中文姓名</label>
                <div className="mt-1">
                  <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">手機號碼</label>
                <div className="mt-1">
                  <input id="phone" name="phone" type="text" required value={formData.phone} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">密碼</label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">確認密碼</label>
                <div className="mt-1">
                  <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div className="flex items-center">
                <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-talent-600" />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  同意 <a href="#" className="text-talent-600 hover:underline">會員條款與個資使用</a>
                </label>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-talent-600 hover:bg-talent-700 focus:outline-none">
                  註冊會員
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
