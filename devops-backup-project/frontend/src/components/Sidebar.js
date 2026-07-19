import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const links = [
    { to: '/', label: '📊 Dashboard' },
    { to: '/backups', label: '💾 Backups' },
    { to: '/recovery', label: '🔄 Recovery' },
  ];

  return (
    <div style={{
      width: '240px', minHeight: '100vh', background: '#1e293b',
      display: 'flex', flexDirection: 'column', padding: '20px 0',
      borderRight: '1px solid #334155'
    }}>
      <div style={{ padding: '0 20px 30px', borderBottom: '1px solid #334155' }}>
        <h2 style={{ color: '#38bdf8', fontSize: '16px' }}>🛡️ DevOps Backup</h2>
        <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Recovery System</p>
      </div>

      <nav style={{ flex: 1, padding: '20px 12px' }}>
        {links.map(link => (
          <NavLink key={link.to} to={link.to} end={link.to === '/'}
            style={({ isActive }) => ({
              display: 'block', padding: '10px 16px', borderRadius: '8px',
              marginBottom: '4px', textDecoration: 'none', fontSize: '14px',
              background: isActive ? '#0f172a' : 'transparent',
              color: isActive ? '#38bdf8' : '#94a3b8',
              borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
            })}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '20px' }}>
        <button onClick={logout} style={{
          width: '100%', padding: '10px', background: '#dc2626',
          color: 'white', border: 'none', borderRadius: '8px',
          cursor: 'pointer', fontSize: '14px'
        }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;