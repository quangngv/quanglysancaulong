import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Shield, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-shape shape-1"></div>
        <div className="login-shape shape-2"></div>
        <div className="login-shape shape-3"></div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <Shield size={48} />
            </div>
            <h1>Admin Panel</h1>
            <p>Quản lý hệ thống sân cầu lông</p>
          </div>
          
          {error && (
            <div className="alert-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>
                <Mail size={18} />
                Email quản trị
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                autoComplete="username"
              />
            </div>
            
            <div className="input-group">
              <label>
                <Lock size={18} />
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Đang xác thực...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Đăng nhập
                </>
              )}
            </button>
          </form>
          
          <div className="login-info">
            <div className="info-icon">💡</div>
            <div>
              <strong>Tài khoản mặc định</strong>
              <div className="info-details">
                <div>📧 admin@example.com</div>
                <div>🔑 admin123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
