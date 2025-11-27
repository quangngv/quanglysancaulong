import React, { useEffect, useState } from 'react';
import { courtAPI } from '../services/api';
import { MapPin, DollarSign, CheckCircle } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await courtAPI.getAll();
      setCourts(response.data.data);
    } catch (error) {
      console.error('Error fetching courts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container">
      <div className="home-header">
        <h1>🏸 Chào mừng đến với Hệ thống Quản lý Sân Cầu Lông</h1>
        <p>Đặt sân nhanh chóng, tiện lợi và dễ dàng</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e3f2fd' }}>
            <CheckCircle size={32} color="#2196F3" />
          </div>
          <div className="stat-content">
            <h3>{courts.length}</h3>
            <p>Sân có sẵn</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e5f5' }}>
            <DollarSign size={32} color="#9c27b0" />
          </div>
          <div className="stat-content">
            <h3>Giá tốt</h3>
            <p>Phù hợp mọi túi tiền</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e8f5e9' }}>
            <MapPin size={32} color="#4caf50" />
          </div>
          <div className="stat-content">
            <h3>Nhiều địa điểm</h3>
            <p>Khắp khu vực</p>
          </div>
        </div>
      </div>

      <h2 className="section-title">Danh sách sân</h2>
      
      {courts.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666' }}>
            Chưa có sân nào được thêm vào hệ thống.
          </p>
        </div>
      ) : (
        <div className="grid grid-3">
          {courts.map((court) => (
            <div key={court.CourtID} className="court-card">
              <div className="court-header">
                <h3>{court.CourtName}</h3>
                <span className={`badge badge-${court.Status.toLowerCase()}`}>
                  {court.Status === 'Available' ? 'Có sẵn' : court.Status === 'Unavailable' ? 'Không có sẵn' : 'Bảo trì'}
                </span>
              </div>
              
              <div className="court-info">
                <p className="court-type">
                  <strong>Loại:</strong> {court.TypeName || 'Cầu lông'}
                </p>
                <p className="court-address">
                  <MapPin size={16} /> {court.Address || 'Chưa cập nhật địa chỉ'}
                </p>
                <p className="court-price">
                  <DollarSign size={16} /> 
                  <strong>{court.PricePerHour?.toLocaleString('vi-VN')} VNĐ</strong>/giờ
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
