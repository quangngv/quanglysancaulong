import React, { useEffect, useState } from 'react';
import { courtAPI } from '../../services/api';
import { Edit, Trash2, Plus, X } from 'lucide-react';

const CourtManagement = () => {
  const [courts, setCourts] = useState([]);
  const [courtTypes, setCourtTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [formData, setFormData] = useState({
    CourtName: '',
    TypeID: '',
    Address: '',
    PricePerHour: '',
    Status: 'Available'
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

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <div className="actions-bar">
        <h2 style={{ margin: 0 }}>Quản lý sân</h2>
        <button onClick={handleAdd} className="btn btn-primary">
          <Plus size={18} /> Thêm sân mới
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
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
                      onClick={() => handleEdit(court)}
                      className="btn btn-warning btn-sm"
                      style={{ padding: '5px 10px' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(court.CourtID)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '5px 10px' }}
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

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCourt ? 'Chỉnh sửa sân' : 'Thêm sân mới'}</h2>
            </div>
            <form onSubmit={handleSubmit}>
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
              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn">
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
    </div>
  );
};

export default CourtManagement;
