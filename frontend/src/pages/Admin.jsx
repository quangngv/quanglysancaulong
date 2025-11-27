import React, { useState } from 'react';
import { Users, Building2, Calendar, DollarSign } from 'lucide-react';
import UserManagement from '../components/admin/UserManagement';
import CourtManagement from '../components/admin/CourtManagement';
import BookingManagement from '../components/admin/BookingManagement';
import Statistics from '../components/admin/Statistics';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('stats');

  const tabs = [
    { id: 'stats', name: 'Thống kê', icon: DollarSign },
    { id: 'users', name: 'Người dùng', icon: Users },
    { id: 'courts', name: 'Quản lý sân', icon: Building2 },
    { id: 'bookings', name: 'Đặt sân', icon: Calendar }
  ];

  return (
    <div className="container">
      <div className="admin-header">
        <h1>⚙️ Quản trị hệ thống</h1>
        <p>Quản lý người dùng, sân và đặt sân</p>
      </div>

      <div className="admin-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={20} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      <div className="admin-content">
        {activeTab === 'stats' && <Statistics />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'courts' && <CourtManagement />}
        {activeTab === 'bookings' && <BookingManagement />}
      </div>
    </div>
  );
};

export default Admin;
