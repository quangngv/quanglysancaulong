import React, { useEffect, useState } from 'react';
import { userAPI } from '../../services/api';
import { Edit, Trash2, Plus, X } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    Phone: '',
    Role: 'Customer'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      FullName: user.FullName,
      Email: user.Email,
      Phone: user.Phone || '',
      Role: user.Role
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;

    try {
      await userAPI.delete(userId);
      alert('Xóa người dùng thành công!');
      fetchUsers();
    } catch (error) {
      alert('Không thể xóa người dùng: ' + (error.response?.data?.error || 'Lỗi'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await userAPI.update(editingUser.UserID, formData);
        alert('Cập nhật người dùng thành công!');
      }
      setShowModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.error || 'Không thể lưu'));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ FullName: '', Email: '', Phone: '', Role: 'Customer' });
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      <div className="actions-bar">
        <h2 style={{ margin: 0 }}>Quản lý người dùng</h2>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.UserID}>
                <td>{user.UserID}</td>
                <td>{user.FullName}</td>
                <td>{user.Email}</td>
                <td>{user.Phone || 'N/A'}</td>
                <td>
                  <span className={`badge badge-${user.Role.toLowerCase()}`}>
                    {user.Role}
                  </span>
                </td>
                <td>{new Date(user.CreatedAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                      onClick={() => handleEdit(user)}
                      className="btn btn-warning btn-sm"
                      style={{ padding: '5px 10px' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.UserID)}
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
              <h2>Chỉnh sửa người dùng</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Họ tên</label>
                <input
                  type="text"
                  value={formData.FullName}
                  onChange={e => setFormData({...formData, FullName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.Email}
                  onChange={e => setFormData({...formData, Email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Điện thoại</label>
                <input
                  type="tel"
                  value={formData.Phone}
                  onChange={e => setFormData({...formData, Phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Vai trò</label>
                <select
                  value={formData.Role}
                  onChange={e => setFormData({...formData, Role: e.target.value})}
                >
                  <option value="Customer">Customer</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
