import { useEffect, useState } from 'react';
import api from '../api/axios';

interface OrderItem { menuItem: { name: string }; quantity: number }
interface Order { id: number; status: string; createdAt: string; items: OrderItem[] }
interface MenuItem { id: number; name: string; category: string; price: number }

export default function ChefDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    api.get('/chef/orders').then(r => setOrders(r.data));
    api.get('/chef/menu').then(r => setMenu(r.data));
  }, []);

  async function markDone(id: number) {
    await api.patch(`/chef/orders/${id}/done`);
    setOrders(prev => prev.filter(o => o.id !== id));
  }

  async function deleteMenuItem(id: number) {
    if (!confirm('Delete this menu item?')) return;
    await api.delete(`/chef/menu/${id}`);
    setMenu(prev => prev.filter(m => m.id !== id));
  }

  return (
    <div className="page">
      <h1>Chef Dashboard</h1>
      <p style={{ color: 'var(--text-muted)' }}>Branch-scoped orders for kitchen staff</p>

      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-value">{orders.length}</div>
          <div className="stat-label">Pending Orders</div>
        </div>
      </div>

      <h2 style={{ margin: '2rem 0 1rem' }}>Active Orders</h2>
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No active orders.</p>
      ) : (
        <div className="card-grid">
          {orders.map(o => (
            <div className="card" key={o.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Order #{o.id}</h3>
                <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
              </div>
              <ul style={{ margin: '0.75rem 0', paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
                {o.items.map((item, i) => (
                  <li key={i}>{item.menuItem.name} x {item.quantity}</li>
                ))}
              </ul>
              <button className="btn btn-primary btn-sm" onClick={() => markDone(o.id)}>
                Mark Done
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ margin: '2rem 0 1rem' }}>Branch Menu</h2>
      <table className="data-table">
        <thead><tr><th>Name</th><th>Category</th><th>Price</th><th></th></tr></thead>
        <tbody>
          {menu.map(m => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.category}</td>
              <td>${m.price.toFixed(2)}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => deleteMenuItem(m.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
