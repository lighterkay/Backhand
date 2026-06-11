import { useEffect, useState } from 'react';
import api from '../api/axios';

interface BranchSales { branchId: number; branchName: string; totalSales: number; orderCount: number }
interface Staff { id: number; name: string; role: string; salary?: number; branch?: { name: string } }

export default function HQDashboard() {
  const [sales, setSales] = useState<BranchSales[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    api.get('/hq/sales').then(r => setSales(r.data));
    api.get('/hq/staff').then(r => setStaff(r.data));
  }, []);

  const totalRevenue = sales.reduce((sum, b) => sum + b.totalSales, 0);

  return (
    <div className="page">
      <h1>HQ Overview</h1>
      <p style={{ color: 'var(--text-muted)' }}>All branches - consolidated view</p>

      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-value">${totalRevenue.toFixed(0)}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{sales.reduce((sum, b) => sum + b.orderCount, 0)}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{staff.length}</div>
          <div className="stat-label">Total Staff</div>
        </div>
      </div>

      <h2 style={{ margin: '2rem 0 1rem' }}>Sales by Branch</h2>
      <table className="data-table">
        <thead><tr><th>Branch</th><th>Orders</th><th>Revenue</th></tr></thead>
        <tbody>
          {sales.map(b => (
            <tr key={b.branchId}>
              <td>{b.branchName}</td>
              <td>{b.orderCount}</td>
              <td>${b.totalSales.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ margin: '2rem 0 1rem' }}>Staff & Salaries - All Branches</h2>
      <table className="data-table">
        <thead><tr><th>Name</th><th>Role</th><th>Branch</th><th>Salary</th></tr></thead>
        <tbody>
          {staff.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.role}</td>
              <td>{s.branch?.name ?? 'HQ'}</td>
              <td>{s.salary ? `$${s.salary}` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
