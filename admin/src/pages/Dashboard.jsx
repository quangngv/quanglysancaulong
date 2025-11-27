import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../services/api';
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await bookingAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: '25px', fontSize: '28px', color: '#333' }}>📊 Tổng quan hệ thống</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e3f2fd' }}>
            <Calendar size={32} color="#2196F3" />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalBookings || 0}</h3>
            <p>Tổng đặt sân</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e5f5' }}>
            <DollarSign size={32} color="#9c27b0" />
          </div>
          <div className="stat-content">
            <h3>{(stats?.totalRevenue || 0).toLocaleString('vi-VN')}</h3>
            <p>Doanh thu (VNĐ)</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff3e0' }}>
            <TrendingUp size={32} color="#ff9800" />
          </div>
          <div className="stat-content">
            <h3>{stats?.pendingBookings || 0}</h3>
            <p>Chờ xác nhận</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e8f5e9' }}>
            <Users size={32} color="#4caf50" />
          </div>
          <div className="stat-content">
            <h3>{stats?.paidBookings || 0}</h3>
            <p>Đã thanh toán</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>Chi tiết thống kê</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
            <span style={{ color: '#666' }}>Đơn đã xác nhận:</span>
            <strong style={{ fontSize: '18px', color: '#2196F3' }}>{stats?.confirmedBookings || 0}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
            <span style={{ color: '#666' }}>Đơn đã thanh toán:</span>
            <strong style={{ fontSize: '18px', color: '#4caf50' }}>{stats?.paidBookings || 0}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
            <span style={{ color: '#666' }}>Đơn chờ xử lý:</span>
            <strong style={{ fontSize: '18px', color: '#ff9800' }}>{stats?.pendingBookings || 0}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
