import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../services/api';
import { Calendar, Clock, MapPin, CreditCard, XCircle } from 'lucide-react';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Bạn có chắc muốn hủy đặt sân này?')) return;

    try {
      await bookingAPI.cancel(bookingId);
      alert('Hủy đặt sân thành công!');
      fetchBookings();
    } catch (error) {
      alert('Không thể hủy đặt sân: ' + (error.response?.data?.error || 'Lỗi không xác định'));
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pending': { class: 'badge-pending', text: 'Chờ xác nhận' },
      'Confirmed': { class: 'badge-confirmed', text: 'Đã xác nhận' },
      'Paid': { class: 'badge-paid', text: 'Đã thanh toán' },
      'Cancelled': { class: 'badge-cancelled', text: 'Đã hủy' }
    };
    const statusInfo = statusMap[status] || { class: '', text: status };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>📋 Lịch sử đặt sân</h1>
        <p>Quản lý các lần đặt sân của bạn</p>
      </div>

      {bookings.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            Bạn chưa có lịch đặt sân nào.
          </p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking.BookingID} className="booking-card">
              <div className="booking-card-header">
                <h3>{booking.CourtName}</h3>
                {getStatusBadge(booking.Status)}
              </div>

              <div className="booking-card-body">
                <div className="booking-info-item">
                  <Calendar size={18} />
                  <span>
                    {new Date(booking.BookingDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="booking-info-item">
                  <Clock size={18} />
                  <span>{booking.StartTime} - {booking.EndTime}</span>
                </div>

                <div className="booking-info-item">
                  <MapPin size={18} />
                  <span>{booking.Address || 'Chưa cập nhật'}</span>
                </div>

                <div className="booking-info-item">
                  <CreditCard size={18} />
                  <span>{booking.PaymentMethod || 'Tiền mặt'}</span>
                </div>

                <div className="booking-price">
                  <strong>Tổng tiền:</strong>
                  <span className="price">{booking.TotalPrice?.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>

              {booking.Status === 'Pending' && (
                <div className="booking-card-footer">
                  <button 
                    onClick={() => handleCancel(booking.BookingID)}
                    className="btn btn-danger btn-sm"
                  >
                    <XCircle size={16} /> Hủy đặt sân
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
