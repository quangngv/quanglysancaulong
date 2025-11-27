import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    FullName: '',
    Email: '',
    Password: '',
    Phone: '',
    Role: 'Customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🏸 Đăng ký</h1>
          <p>Tạo tài khoản mới</p>
        </div>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="FullName"
              value={formData.FullName}
              onChange={handleChange}
              required
              placeholder="Nhập họ và tên"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              placeholder="Nhập email"
            />
          </div>
          
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              required
              placeholder="Nhập mật khẩu"
            />
          </div>
          
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
