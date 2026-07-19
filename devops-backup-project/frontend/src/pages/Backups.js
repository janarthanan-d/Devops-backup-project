import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Backups = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', source: 'pipeline', storageType: 'local', retentionDays: 30 });
  const token = localStorage.getItem('token');

  const fetchBackups = async () => {
    try {
      const res = await axios.get('/api/backups', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBackups(res.data);
    } catch (err) {
      toast.error('Failed to fetch backups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBackups(); }, []);

  const createBackup = async () => {
    try {
      await axios.post('/api/backups', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Backup created successfully!');
      setShowForm(false);
      setForm({ name: '', source: 'pipeline', storageType: 'local', retentionDays: 30 });
      fetchBackups();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create backup');
    }
  };

  const deleteBackup = async (id) => {
    if (!window.confirm('Delete this backup?')) return;
    try {
      await axios.delete(`/api/backups/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Backup deleted!');
      fetchBackups();
    } catch (err) {
      toast.error('Failed to delete backup');
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
          <h1 style={{ color: '#e2e8f0' }}>💾 Backups</h1>
          <p style={{ color: '#64748b' }}>Manage your pipeline backups</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 20px', background: '#0284c7', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
        }}>
          + New Backup
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '24px' }}>
          <h3 style={{ color: '#e2e8f0', marginBottom: '16px' }}>Create New Backup</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Backup Name</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="My Pipeline Backup" />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Source</label>
              <select style={inputStyle} value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                <option value="pipeline">Pipeline</option>
                <option value="logs">Logs</option>
                <option value="artifacts">Artifacts</option>
                <option value="configs">Configs</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Storage Type</label>
              <select style={inputStyle} value={form.storageType} onChange={e => setForm({ ...form, storageType: e.target.value })}>
                <option value="local">Local</option>
                <option value="s3">AWS S3</option>
                <option value="gcs">Google Cloud</option>
                <option value="azure">Azure</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Retention Days</label>
              <input style={inputStyle} type="number" value={form.retentionDays} onChange={e => setForm({ ...form, retentionDays: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={createBackup} style={{ padding: '8px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Create Backup
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
                {['Name', 'Source', 'Type', 'Status', 'Size (KB)', 'Storage', 'Created', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px', textAlign: 'left', fontWeight: '600' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {backups.length === 0 ? (
                <tr><td colSpan="8" style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No backups yet. Create your first backup!</td></tr>
              ) : backups.map(b => (
                <tr key={b._id} style={{ borderTop: '1px solid #334155' }}>
                  <td style={{ padding: '12px 16px', color: '#e2e8f0', fontSize: '14px' }}>{b.name}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '14px' }}>{b.source}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '14px' }}>{b.type}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '4px', fontSize: '12px',
                      background: b.status === 'success' ? '#14532d' : b.status === 'failed' ? '#7f1d1d' : '#1e3a5f',
                      color: b.status === 'success' ? '#22c55e' : b.status === 'failed' ? '#ef4444' : '#38bdf8'
                    }}>{b.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '14px' }}>{b.size}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '14px' }}>{b.storageType}</td>
                  <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '14px' }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => deleteBackup(b._id)} style={{
                      padding: '4px 12px', background: '#dc2626', color: 'white',
                      border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                    }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Backups;