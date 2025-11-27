import React, { useEffect, useState } from 'react';
import { courtAPI, bookingAPI, userAPI } from '../services/api';
import { Edit, Trash2, Plus, Calendar, Clock } from 'lucide-react';

const Courts = () => {
  const [courts, setCourts] = useState([]);
  const [courtTypes, setCourtTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    CourtName: '',
    TypeID: '',
    Address: '',
    PricePerHour: '',
    Status: 'Available'
  });
  const [bookingData, setBookingData] = useState({
    UserID: '',
    Date: '',
    TimeSlots: []
  });

  useEffect(() => {
    fetchCourts();
    fetchCourtTypes();
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

  const fetchCourtTypes = async () => {
    try {
      const response = await courtAPI.getTypes();
      setCourtTypes(response.data.data);
    } catch (error) {
      console.error('Error fetching court types:', error);
    }
  };

  const handleAdd = () => {
    setEditingCourt(null);
    setFormData({
      CourtName: '',
      TypeID: courtTypes[0]?.TypeID || '',
      Address: '',
      PricePerHour: '',
      Status: 'Available'
    });
    setShowModal(true);
  };

  const handleEdit = (court) => {
    setEditingCourt(court);
    setFormData({
      CourtName: court.CourtName,
      TypeID: court.TypeID,
      Address: court.Address || '',
      PricePerHour: court.PricePerHour,
      Status: court.Status
    });
    setShowModal(true);
  };

  const handleDelete = async (courtId) => {
    if (!window.confirm('Bạn có chắc muốn xóa sân này?')) return;

    try {
      await courtAPI.delete(courtId);
      alert('Xóa sân thành công!');
      fetchCourts();
    } catch (error) {
      alert('Không thể xóa sân: ' + (error.response?.data?.error || 'Lỗi'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourt) {
        await courtAPI.update(editingCourt.CourtID, formData);
        alert('Cập nhật sân thành công!');
      } else {
        await courtAPI.create(formData);
        alert('Thêm sân thành công!');
      }
      setShowModal(false);
      fetchCourts();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.error || 'Không thể lưu'));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourt(null);
  };

  const handleBooking = async (court) => {
    setSelectedCourt(court);
    setBookingData({
      UserID: '',
      Date: new Date().toISOString().split('T')[0],
      TimeSlots: []
    });
    
    // Fetch users
    try {
      const response = await userAPI.getAll();
      setUsers(response.data.data.filter(u => u.Role === 'Customer'));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    
    setShowBookingModal(true);
  };

  const fetchAvailableSlots = async () => {
    if (!selectedCourt || !bookingData.Date) return;
    
    try {
      const response = await courtAPI.getAvailableSlots(selectedCourt.CourtID, bookingData.Date);
      setAvailableSlots(response.data.data || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
    if (showBookingModal && bookingData.Date) {
      fetchAvailableSlots();
    }
  }, [bookingData.Date, showBookingModal]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (bookingData.TimeSlots.length === 0) {
      alert('Vui lòng chọn ít nhất 1 khung giờ!');
      return;
    }

    try {
      await bookingAPI.create({
        CourtID: selectedCourt.CourtID,
        UserID: bookingData.UserID,
        Date: bookingData.Date,
        TimeSlots: bookingData.TimeSlots
      });
      
      alert('Đặt sân thành công!');
      setShowBookingModal(false);
      setSelectedCourt(null);
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.error || 'Không thể đặt sân'));
    }
  };

  const toggleTimeSlot = (slotId) => {
    setBookingData(prev => ({
      ...prev,
      TimeSlots: prev.TimeSlots.includes(slotId)
        ? prev.TimeSlots.filter(id => id !== slotId)
        : [...prev.TimeSlots, slotId]
    }));
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: 0, fontSize: '28px', color: '#333' }}>🏸 Quản lý sân</h2>
        <button onClick={handleAdd} className="btn btn-primary">
          <Plus size={18} /> Thêm sân mới
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên sân</th>
                <th>Loại</th>
                <th>Địa chỉ</th>
                <th>Giá/giờ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {courts.map(court => (
                <tr key={court.CourtID}>
                  <td>{court.CourtID}</td>
                  <td>{court.CourtName}</td>
                  <td>{court.TypeName}</td>
                  <td>{court.Address || 'N/A'}</td>
                  <td>{court.PricePerHour?.toLocaleString('vi-VN')} VNĐ</td>
                  <td>
                    <span className={`badge badge-${court.Status.toLowerCase()}`}>
                      {court.Status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button 
                        onClick={() => handleBooking(court)}
                        className="btn btn-success btn-sm"
                        title="Đặt sân"
                      >
                        <Calendar size={14} />
                      </button>
                      <button 
                        onClick={() => handleEdit(court)}
                        className="btn btn-warning btn-sm"
                        title="Chỉnh sửa"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(court.CourtID)}
                        className="btn btn-danger btn-sm"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCourt ? 'Chỉnh sửa sân' : 'Thêm sân mới'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên sân</label>
                  <input
                    type="text"
                    value={formData.CourtName}
                    onChange={e => setFormData({...formData, CourtName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Loại sân</label>
                  <select
                    value={formData.TypeID}
                    onChange={e => setFormData({...formData, TypeID: e.target.value})}
                    required
                  >
                    {courtTypes.map(type => (
                      <option key={type.TypeID} value={type.TypeID}>
                        {type.TypeName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <textarea
                    value={formData.Address}
                    onChange={e => setFormData({...formData, Address: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Giá/giờ (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.PricePerHour}
                    onChange={e => setFormData({...formData, PricePerHour: e.target.value})}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select
                    value={formData.Status}
                    onChange={e => setFormData({...formData, Status: e.target.value})}
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCourt ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBookingModal && selectedCourt && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>📅 Đặt sân: {selectedCourt.CourtName}</h3>
              <button className="modal-close" onClick={() => setShowBookingModal(false)}>✕</button>
            </div>
            <form onSubmit={handleBookingSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Khách hàng</label>
                  <select
                    value={bookingData.UserID}
                    onChange={e => setBookingData({...bookingData, UserID: e.target.value})}
                    required
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    {users.map(user => (
                      <option key={user.UserID} value={user.UserID}>
                        {user.FullName} ({user.Email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Ngày đặt</label>
                  <input
                    type="date"
                    value={bookingData.Date}
                    onChange={e => setBookingData({...bookingData, Date: e.target.value, TimeSlots: []})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {bookingData.Date && (
                  <div className="form-group">
                    <label>
                      <Clock size={18} /> Khung giờ ({availableSlots.length} khung trống)
                    </label>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                      gap: '10px',
                      marginTop: '10px'
                    }}>
                      {availableSlots.length > 0 ? (
                        availableSlots.map(slot => (
                          <div
                            key={slot.SlotID}
                            onClick={() => toggleTimeSlot(slot.SlotID)}
                            style={{
                              padding: '12px 10px',
                              border: `2px solid ${bookingData.TimeSlots.includes(slot.SlotID) ? '#10b981' : '#e2e8f0'}`,
                              borderRadius: '10px',
                              cursor: 'pointer',
                              textAlign: 'center',
                              background: bookingData.TimeSlots.includes(slot.SlotID) 
                                ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' 
                                : 'white',
                              transition: 'all 0.2s',
                              fontWeight: bookingData.TimeSlots.includes(slot.SlotID) ? '600' : '500',
                              fontSize: '14px',
                              color: bookingData.TimeSlots.includes(slot.SlotID) ? '#065f46' : '#64748b'
                            }}
                          >
                            {slot.StartTime} - {slot.EndTime}
                          </div>
                        ))
                      ) : (
                        <div style={{ 
                          gridColumn: '1 / -1', 
                          padding: '30px', 
                          textAlign: 'center',
                          color: '#94a3b8',
                          background: '#f8fafc',
                          borderRadius: '10px'
                        }}>
                          Không có khung giờ trống
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {bookingData.TimeSlots.length > 0 && (
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '16px', 
                    background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                    borderRadius: '12px',
                    border: '1px solid #bae6fd'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px', color: '#0c4a6e' }}>
                      📋 Tóm tắt đặt sân
                    </div>
                    <div style={{ fontSize: '14px', color: '#0369a1' }}>
                      <div>🏸 Sân: <strong>{selectedCourt.CourtName}</strong></div>
                      <div>📅 Ngày: <strong>{new Date(bookingData.Date).toLocaleDateString('vi-VN')}</strong></div>
                      <div>⏰ Số khung giờ: <strong>{bookingData.TimeSlots.length}</strong></div>
                      <div>💰 Tổng tiền: <strong>{(selectedCourt.PricePerHour * bookingData.TimeSlots.length).toLocaleString('vi-VN')} VNĐ</strong></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setShowBookingModal(false)} 
                  className="btn btn-secondary"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={bookingData.TimeSlots.length === 0}
                >
                  <Calendar size={18} />
                  Xác nhận đặt sân
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courts;
