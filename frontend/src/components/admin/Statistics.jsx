import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../../services/api';
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

const Statistics = () => {
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
      <h2 style={{ marginBottom: '20px', fontSize: '24px' }}>Thống kê tổng quan</h2>
      
      <div className="stats-container">
        <div className="stat-box">
          <div className="stat-box-icon" style={{ background: '#e3f2fd' }}>
            <Calendar color="#2196F3" />
          </div>
          <div className="stat-box-content">
            <h3>{stats?.totalBookings || 0}</h3>
            <p>Tổng đặt sân</p>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-icon" style={{ background: '#f3e5f5' }}>
            <DollarSign color="#9c27b0" />
          </div>
          <div className="stat-box-content">
            <h3>{(stats?.totalRevenue || 0).toLocaleString('vi-VN')}</h3>
            <p>Doanh thu (VNĐ)</p>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-icon" style={{ background: '#fff3e0' }}>
            <TrendingUp color="#ff9800" />
          </div>
          <div className="stat-box-content">
            <h3>{stats?.pendingBookings || 0}</h3>
            <p>Chờ xác nhận</p>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-icon" style={{ background: '#e8f5e9' }}>
            <Users color="#4caf50" />
          </div>
          <div className="stat-box-content">
            <h3>{stats?.paidBookings || 0}</h3>
            <p>Đã thanh toán</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '15px' }}>Chi tiết</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '5px' }}>
            <span>Đơn đã xác nhận:</span>
            <strong>{stats?.confirmedBookings || 0}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '5px' }}>
            <span>Đơn đã thanh toán:</span>
            <strong>{stats?.paidBookings || 0}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '5px' }}>
            <span>Đơn chờ xử lý:</span>
            <strong>{stats?.pendingBookings || 0}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
