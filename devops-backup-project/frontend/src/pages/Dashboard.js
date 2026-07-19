import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div style={{ color: '#94a3b8' }}>Loading dashboard...</div>;

  const pieData = [
    { name: 'Success', value: stats?.stats?.successBackups || 0 },
    { name: 'Failed', value: stats?.stats?.failedBackups || 0 },
  ];
  const COLORS = ['#22c55e', '#ef4444'];

  const statCards = [
    { label: 'Total Backups', value: stats?.stats?.totalBackups || 0, color: '#38bdf8' },
    { label: 'Successful', value: stats?.stats?.successBackups || 0, color: '#22c55e' },
    { label: 'Failed', value: stats?.stats?.failedBackups || 0, color: '#ef4444' },
    { label: 'Recoveries', value: stats?.stats?.totalRecoveries || 0, color: '#a78bfa' },
  ];

  return (
    <div>
      <h1 style={{ color: '#e2e8f0', marginBottom: '8px' }}>📊 Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '30px' }}>System overview and backup status</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '30px' }}>
        {statCards.map(card => (
          <div key={card.label} style={{
            background: '#1e293b', padding: '20px', borderRadius: '12px',
            border: '1px solid #334155', borderTop: `3px solid ${card.color}`
          }}>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>{card.label}</p>
            <p style={{ color: card.color, fontSize: '32px', fontWeight: 'bold' }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#e2e8f0', marginBottom: '16px' }}>Backup Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#e2e8f0', marginBottom: '16px' }}>Recent Backups</h3>
          {stats?.recentBackups?.length === 0 ? (
            <p style={{ color: '#64748b' }}>No backups yet</p>
          ) : (
            stats?.recentBackups?.map(b => (
              <div key={b._id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid #334155'
              }}>
                <span style={{ color: '#e2e8f0', fontSize: '14px' }}>{b.name}</span>
                <span style={{
                  padding: '2px 8px', borderRadius: '4px', fontSize: '12px',
                  background: b.status === 'success' ? '#14532d' : '#7f1d1d',
                  color: b.status === 'success' ? '#22c55e' : '#ef4444'
                }}>{b.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;