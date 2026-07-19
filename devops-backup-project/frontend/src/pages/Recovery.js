import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Recovery = () => {
  const [logs, setLogs] = useState([]);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ backupId: '', recoveryType: 'full', notes: '' });
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [logsRes, backupsRes] = await Promise.all([
        axios.get('/api/recovery' , { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/backups', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setLogs(logsRes.data);
      setBackups(backupsRes.data.filter(b => b.status === 'success'));
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const initiateRecovery = async () => {
    if (!form.backupId) return toast.error('Please select a backup');
    try {
      await axios.post('http://localhost:5000/api/recovery', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Recovery initiated successfully!');
      setShowForm(false);
      setForm({ backupId: '', recoveryType: 'full', notes: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Recovery failed');
    }
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', background: '#0f172a',
    border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0',
    fontSize: '14px', boxSizing: 'border-box'
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#e2e8f0' }}>🔄 Disaster Recovery</h1>
          <p style={{ color: '#64748b' }}>Restore pipelines from backup snapshots</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 20px', background: '#dc2626', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
        }}>
          🔄 Initiate Recovery
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '24px' }}>
          <h3 style={{ color: '#e2e8f0', marginBottom: '16px' }}>Initiate Recovery</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Select Backup</label>
              <select style={inputStyle} value={form.backupId} onChange={e => setForm({ ...form, backupId: e.target.value })}>
                <option value="">-- Select a backup --</option>
                {backups.map(b => (
                  <option key={b._id} value={b._id}>{b.name} ({b.source})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Recovery Type</label>
              <select style={inputStyle} value={form.recoveryType} onChange={e => setForm({ ...form, recoveryType: e.target.value })}>
                <option value="full">Full Recovery</option>
                <option value="partial">Partial Recovery</option>
                <option value="dry-run">Dry Run (Test)</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Notes (optional)</label>
            <input style={inputStyle} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Reason for recovery..." />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={initiateRecovery} style={{ padding: '8px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Start Recovery
            </button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 20px', background: '#475569', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? <p style={{ color: '#94a3b8' }}>Loading...</p> : (
        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f172a' }}>
                {['Backup', 'Type', 'Status', 'Initiated By', 'Completed At', 'Notes'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No recovery logs yet.</td></tr>
              ) : logs.map(log => (
                <tr key={log._id} style={{ borderTop: '1px solid #334155' }}>
                  <td style={{ padding: '12px 16px', color: '#e2e8f0', fontSize: '14px' }}>{log.backupId?.name || 'N/A'}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '14px' }}>{log.recoveryType}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '4px', fontSize: '12px',
                      background: log.status === 'success' ? '#14532d' : '#7f1d1d',
                      color: log.status === 'success' ? '#22c55e' : '#ef4444'
                    }}>{log.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '14px' }}>{log.initiatedBy?.name || 'N/A'}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '14px' }}>{log.completedAt ? new Date(log.completedAt).toLocaleString() : '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '14px' }}>{log.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Recovery;