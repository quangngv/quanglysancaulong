import React from 'react';
import { LayoutDashboard, Users, Building2, Calendar, LogOut, Shield } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, onLogout, user }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Tổng quan', icon: LayoutDashboard },
    { id: 'users', name: 'Người dùng', icon: Users },
    { id: 'courts', name: 'Quản lý sân', icon: Building2 },
    { id: 'bookings', name: 'Đặt sân', icon: Calendar }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Shield size={32} />
        </div>
        <h1>Admin Panel</h1>
        <p>Quản lý sân cầu lông</p>
      </div>
      
      <div className="sidebar-menu">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              <span>{item.name}</span>
              {activeTab === item.id && <div className="menu-indicator"></div>}
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar-sm">
            {user?.FullName?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.FullName}</div>
            <div className="user-role-badge">{user?.Role}</div>
          </div>
        </div>
        
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
