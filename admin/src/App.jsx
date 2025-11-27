import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Courts from './pages/Courts';
import Bookings from './pages/Bookings';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }
  
  return user ? <Navigate to="/" /> : children;
};

function AdminPanel() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
    }
  };

  return (
    <div className="admin-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        user={user}
      />
      <div className="main-content">
        <div className="top-bar">
          <div className="page-title">
            <h2>
              {activeTab === 'dashboard' && '📊 Tổng quan'}
              {activeTab === 'users' && '👥 Người dùng'}
              {activeTab === 'courts' && '🏸 Quản lý sân'}
              {activeTab === 'bookings' && '📅 Đặt sân'}
            </h2>
            <p>Hệ thống quản lý sân cầu lông</p>
          </div>
          <div className="user-info">
            <div className="user-avatar">
              {user?.FullName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{ fontWeight: 500 }}>{user?.FullName}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{user?.Role}</div>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'users' && <Users />}
        {activeTab === 'courts' && <Courts />}
        {activeTab === 'bookings' && <Bookings />}
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/" element={
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
