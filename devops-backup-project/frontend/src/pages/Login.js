import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0f172a',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#1e293b', padding: '40px', borderRadius: '16px',
        width: '100%', maxWidth: '400px', border: '1px solid #334155'
      }}>
        <h1 style={{ color: '#38bdf8', marginBottom: '8px', textAlign: 'center' }}>🛡️ DevOps Backup</h1>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '30px' }}>Sign in to your account</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '14px' }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="admin@test.com"
              style={{
                width: '100%', padding: '10px 14px', background: '#0f172a',
                border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '6px', fontSize: '14px' }}>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 14px', background: '#0f172a',
                border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', background: '#0284c7',
            color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;