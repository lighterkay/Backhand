import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios';

interface User { id: number; name: string; email: string; role: string; isActive: boolean; branchId?: number; salary?: number; branch?: { name: string } }
interface Branch { id: number; name: string; address: string; isActive: boolean }
const ROLES = ['ADMIN','HQ_MANAGER','BRANCH_MANAGER','CHEF','CASHIER','CUSTOMER'];

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uPass, setUPass] = useState('');
  const [uRole, setURole] = useState('CASHIER');
  const [uBranch, setUBranch] = useState('');
  const [uSalary, setUSalary] = useState('');
  const [uMsg, setUMsg] = useState('');
  const [bName, setBName] = useState('');
  const [bAddress, setBAddress] = useState('');
  const [bMsg, setBMsg] = useState('');

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    const usersRes = await api.get('/admin/users');
    const branchesRes = await api.get('/admin/branches');
    setUsers(usersRes.data);
    setBranches(branchesRes.data);
  }

  async function createUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUMsg('');

    try {
      await api.post('/admin/users', {
        name: uName,
        email: uEmail,
        password: uPass,
        role: uRole,
        branchId: uBranch ? parseInt(uBranch) : undefined,
        salary: uSalary ? parseFloat(uSalary) : undefined,
      });
      setUMsg('User created successfully!');
      setUName(''); setUEmail(''); setUPass(''); setUBranch(''); setUSalary('');
      loadAll();
    } catch (err: any) {
      setUMsg(err.response?.data?.error ?? 'Failed.');
    }
  }

  async function addBranch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBMsg('');

    try {
      await api.post('/admin/branches', { name: bName, address: bAddress });
      setBMsg('Branch added!');
      setBName(''); setBAddress('');
      loadAll();
    } catch (err: any) {
      setBMsg(err.response?.data?.error ?? 'Failed.');
    }
  }

  async function changeRole(id: number, role: string) {
    const branchId = users.find(u => u.id === id)?.branchId;
    await api.patch(`/admin/users/${id}/role`, { role, branchId });
    loadAll();
  }

  async function toggleUser(id: number, isActive: boolean) {
    if (isActive) await api.patch(`/admin/users/${id}/disable`);
    else await api.patch(`/admin/users/${id}/enable`);
    loadAll();
  }

  async function deleteUser(id: number) {
    if (!confirm('Delete this user permanently?')) return;
    await api.delete(`/admin/users/${id}`);
    loadAll();
  }

  return (
    <div className="page admin-page">
      <section className="admin-hero">
        <div className="hero-copy">
          <span className="eyebrow">Admin Console</span>
          <h1>Welcome to the Admin Dashboard</h1>
          <p className="lead">Manage users, branches and operations from a spacious, clear dashboard layout.</p>
        </div>

        <div className="hero-cards">
          <div className="metric-card">
            <div className="metric-title">Total users</div>
            <div className="metric-value">{users.length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Branches</div>
            <div className="metric-value">{branches.length}</div>
          </div>
          <div className="metric-card">
            <div className="metric-title">Active users</div>
            <div className="metric-value">{users.filter(u => u.isActive).length}</div>
          </div>
        </div>
      </section>

      <div className="dashboard-grid" style={{ marginTop: '1.5rem' }}>
        <div className="dashboard-panel card">
          <div className="card-heading">
            <h2>Create User</h2>
            <p>Quickly add staff, HQ users, or customers with a single action.</p>
          </div>
          {uMsg && <div className={`alert ${uMsg.includes('success') ? 'alert-success' : 'alert-error'}`}>{uMsg}</div>}
          <form onSubmit={createUser}>
            <div className="form-group"><label>Name</label><input value={uName} onChange={e => setUName(e.target.value)} required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={uEmail} onChange={e => setUEmail(e.target.value)} required /></div>
            <div className="form-group"><label>Password</label><input type="password" value={uPass} onChange={e => setUPass(e.target.value)} required /></div>
            <div className="form-group">
              <label>Role</label>
              <select value={uRole} onChange={e => setURole(e.target.value)}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Branch (staff only)</label>
              <select value={uBranch} onChange={e => setUBranch(e.target.value)}>
                <option value="">- None (HQ / Admin / Customer) -</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Salary (optional)</label><input type="number" value={uSalary} onChange={e => setUSalary(e.target.value)} /></div>
            <button type="submit" className="btn btn-primary full-width">Create User</button>
          </form>
        </div>

        <div className="dashboard-panel card">
          <div className="card-heading">
            <h2>Add Branch</h2>
            <p>Track new locations and keep your branch list up to date.</p>
          </div>
          {bMsg && <div className={`alert ${bMsg.includes('added') ? 'alert-success' : 'alert-error'}`}>{bMsg}</div>}
          <form onSubmit={addBranch}>
            <div className="form-group"><label>Branch Name</label><input value={bName} onChange={e => setBName(e.target.value)} required /></div>
            <div className="form-group"><label>Address</label><input value={bAddress} onChange={e => setBAddress(e.target.value)} required /></div>
            <button type="submit" className="btn btn-primary full-width">Add Branch</button>
          </form>

          <h3 style={{ marginTop: '1.8rem' }}>Available locations</h3>
          <div className="branch-list">
            {branches.map(b => (
              <div key={b.id} className="branch-row">
                <span>{b.name}</span>
                <span>{b.address}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="table-section">
        <div className="section-title-row">
          <h2>All Users</h2>
          <p className="section-copy">Review role assignments, branch access, and account status at a glance.</p>
        </div>
        <div className="table-card">
          <table className="data-table admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Branch</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td className="secondary-text">{u.email}</td>
                  <td>
                    <select value={u.role} onChange={e => changeRole(u.id, e.target.value)} className="inline-select">
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>{u.branch?.name ?? '-'}</td>
                  <td><span className={`badge badge-${u.isActive ? 'confirmed' : 'cancelled'}`}>{u.isActive ? 'Active' : 'Disabled'}</span></td>
                  <td className="action-cell">
                    <button className="btn btn-ghost btn-sm" onClick={() => toggleUser(u.id, u.isActive)}>
                      {u.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
