import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Home, Calendar, FileText } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🏸 Quản Lý Sân Cầu Lông
        </Link>
        
        {user && (
          <div className="navbar-menu">
            <Link to="/" className="nav-link">
              <Home size={18} /> Trang chủ
            </Link>
            
            <Link to="/bookings" className="nav-link">
              <Calendar size={18} /> Đặt sân
            </Link>
            
            <Link to="/my-bookings" className="nav-link">
              <FileText size={18} /> Lịch sử
            </Link>
            
            <div className="nav-user">
              <User size={18} />
              <span>{user.FullName}</span>
            </div>
            
            <button onClick={handleLogout} className="btn btn-danger btn-sm">
              <LogOut size={16} /> Đăng xuất
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
