import React, { useEffect, useState } from 'react';
import { bookingAPI, paymentAPI } from '../../services/api';
import { CheckCircle, XCircle, DollarSign } from 'lucide-react';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getAll();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await bookingAPI.updateStatus(bookingId, status);
      alert('Cập nhật trạng thái thành công!');
      fetchBookings();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.error || 'Không thể cập nhật'));
    }
  };

  const handleConfirmPayment = async (bookingId) => {
    if (!window.confirm('Xác nhận thanh toán cho đơn đặt này?')) return;

    try {
      await paymentAPI.confirm(bookingId);
      alert('Xác nhận thanh toán thành công!');
      fetchBookings();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.error || 'Không thể xác nhận thanh toán'));
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

  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.Status === filter);

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <div className="actions-bar">
        <h2 style={{ margin: 0 }}>Quản lý đặt sân</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`btn ${filter === 'All' ? 'btn-primary' : ''}`}
            onClick={() => setFilter('All')}
          >
            Tất cả
          </button>
          <button 
            className={`btn ${filter === 'Pending' ? 'btn-warning' : ''}`}
            onClick={() => setFilter('Pending')}
          >
            Chờ xác nhận
          </button>
          <button 
            className={`btn ${filter === 'Confirmed' ? 'btn-primary' : ''}`}
            onClick={() => setFilter('Confirmed')}
          >
            Đã xác nhận
          </button>
          <button 
            className={`btn ${filter === 'Paid' ? 'btn-success' : ''}`}
            onClick={() => setFilter('Paid')}
          >
            Đã thanh toán
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Người đặt</th>
              <th>Sân</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking.BookingID}>
                <td>{booking.BookingID}</td>
                <td>
                  <div>
                    <div>{booking.FullName}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{booking.Email}</div>
                  </div>
                </td>
                <td>{booking.CourtName}</td>
                <td>{new Date(booking.BookingDate).toLocaleDateString('vi-VN')}</td>
                <td>{booking.StartTime} - {booking.EndTime}</td>
                <td>{booking.TotalPrice?.toLocaleString('vi-VN')} VNĐ</td>
                <td>{getStatusBadge(booking.Status)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {booking.Status === 'Pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(booking.BookingID, 'Confirmed')}
                        className="btn btn-success btn-sm"
                        style={{ padding: '5px 10px' }}
                        title="Xác nhận"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    {booking.Status === 'Confirmed' && (
                      <button 
                        onClick={() => handleConfirmPayment(booking.BookingID)}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '5px 10px' }}
                        title="Xác nhận thanh toán"
                      >
                        <DollarSign size={14} />
                      </button>
                    )}
                    {(booking.Status === 'Pending' || booking.Status === 'Confirmed') && (
                      <button 
                        onClick={() => handleUpdateStatus(booking.BookingID, 'Cancelled')}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '5px 10px' }}
                        title="Hủy"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;
