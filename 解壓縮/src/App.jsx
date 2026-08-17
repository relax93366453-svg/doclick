import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LandingScreen from './components/LandingScreen';
import BusinessPage from './components/BusinessPage';
import TalentPage from './components/TalentPage';
import Profile from './pages/talent/Profile';
import './App.css';
import AuthPage from './pages/talent/AuthPage';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AccountHelp from './pages/auth/AccountHelp';
import ForgotPassword from './pages/auth/ForgotPassword';
import JobSearch from './pages/job/JobSearch';
import Applications from './pages/talent/Applications';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/business/Dashboard';
import PostJob from './pages/business/PostJob';
import Applicants from './pages/business/Applicants';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="antialiased">
      <Routes>
        <Route path="/" element={<LandingScreen onSelect={(role) => navigate(`/${role}`)} />} />
        <Route path="/business" element={<BusinessPage onBack={() => navigate('/')} />} />
        <Route path="/talent" element={<TalentPage onBack={() => navigate('/')} />} />
        <Route path="/talent/profile" element={<Profile />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account-help" element={<AccountHelp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/talent/auth" element={<AuthPage />} />

        {/* Talent Routes */}
        <Route path="/jobs" element={<JobSearch />} />
        <Route path="/talent/applications" element={<Applications />} />

        {/* Business Routes */}
        <Route path="/business" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="profile" element={<div>企業設定 (開發中)</div>} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
