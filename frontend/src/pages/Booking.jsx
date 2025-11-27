import React, { useEffect, useState } from 'react';
import { courtAPI, bookingAPI } from '../services/api';
import { Calendar, Clock } from 'lucide-react';
import './Booking.css';

const Booking = () => {
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await courtAPI.getAll();
      setCourts(response.data.data.filter(c => c.Status === 'Available'));
    } catch (error) {
      console.error('Error fetching courts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const bookingData = {
        CourtID: parseInt(selectedCourt),
        BookingDate: bookingDate,
        StartTime: startTime,
        EndTime: endTime,
        PaymentMethod: paymentMethod
      };

      await bookingAPI.create(bookingData);
      setMessage({ type: 'success', text: 'Đặt sân thành công!' });
      
      // Reset form
      setSelectedCourt('');
      setBookingDate('');
      setStartTime('');
      setEndTime('');
      
      setTimeout(() => {
        window.location.href = '/my-bookings';
      }, 1500);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Đặt sân thất bại!' 
      });
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const selectedCourtData = courts.find(c => c.CourtID === parseInt(selectedCourt));
  const calculatePrice = () => {
    if (!selectedCourtData || !startTime || !endTime) return 0;
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    return selectedCourtData.PricePerHour * hours;
  };

  return (
    <div className="container">
      <div className="booking-header">
        <h1>📅 Đặt sân</h1>
        <p>Chọn sân và thời gian bạn muốn đặt</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="booking-content">
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="card">
            <h3>Thông tin đặt sân</h3>
            
            <div className="form-group">
              <label>Chọn sân *</label>
              <select
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                required
              >
                <option value="">-- Chọn sân --</option>
                {courts.map(court => (
                  <option key={court.CourtID} value={court.CourtID}>
                    {court.CourtName} - {court.PricePerHour?.toLocaleString('vi-VN')} VNĐ/giờ
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Ngày đặt *</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Giờ bắt đầu *</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                >
                  <option value="">-- Chọn giờ --</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Giờ kết thúc *</label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                >
                  <option value="">-- Chọn giờ --</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Phương thức thanh toán *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="Cash">Tiền mặt</option>
                <option value="Transfer">Chuyển khoản</option>
                <option value="Card">Thẻ</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đặt sân ngay'}
            </button>
          </div>
        </form>

        <div className="booking-summary">
          <div className="card">
            <h3>Tóm tắt đặt sân</h3>
            
            {selectedCourtData ? (
              <div className="summary-content">
                <div className="summary-item">
                  <strong>Sân:</strong>
                  <span>{selectedCourtData.CourtName}</span>
                </div>
                <div className="summary-item">
                  <strong>Địa chỉ:</strong>
                  <span>{selectedCourtData.Address || 'N/A'}</span>
                </div>
                <div className="summary-item">
                  <strong>Ngày:</strong>
                  <span>{bookingDate || 'Chưa chọn'}</span>
                </div>
                <div className="summary-item">
                  <strong>Thời gian:</strong>
                  <span>
                    {startTime && endTime ? `${startTime} - ${endTime}` : 'Chưa chọn'}
                  </span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-item summary-total">
                  <strong>Tổng tiền:</strong>
                  <span className="price">{calculatePrice().toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#999' }}>
                Vui lòng chọn sân để xem thông tin
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
