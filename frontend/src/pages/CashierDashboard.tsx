import { useEffect, useState } from 'react';
import api from '../api/axios';

interface MenuItem { id: number; name: string; price: number; category: string }
interface OrderItem { menuItem: { name: string }; quantity: number; unitPrice: number }
interface Order { id: number; total: number; status: string; createdAt: string; items: OrderItem[] }

export default function CashierDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selected, setSelected] = useState<{ id: number; qty: number }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/cashier/orders').then(r => setOrders(r.data));
    api.get('/chef/menu').then(r => setMenu(r.data)).catch(() => {});
  }, []);

  function toggleItem(id: number) {
    setSelected(prev => {
      const exists = prev.find(s => s.id === id);
      return exists ? prev.filter(s => s.id !== id) : [...prev, { id, qty: 1 }];
    });
  }

  function setQty(id: number, qty: number) {
    setSelected(prev => prev.map(s => s.id === id ? { ...s, qty } : s));
  }

  async function submitOrder() {
    setError('');

    if (selected.length === 0) {
      setError('Add at least one item.');
      return;
    }

    try {
      await api.post('/cashier/orders', {
        items: selected.map(s => ({ menuItemId: s.id, quantity: s.qty })),
      });
      const r = await api.get('/cashier/orders');
      setOrders(r.data);
      setSelected([]);
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Failed to create order.');
    }
  }

  async function markDelivered(id: number) {
    await api.patch(`/cashier/orders/${id}/deliver`);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'DELIVERED' } : o));
  }

  return (
    <div className="page">
      <h1>Cashier Dashboard</h1>

      <div className="split-grid" style={{ marginTop: '1.5rem' }}>
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>New Order</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {menu.map(m => {
              const sel = selected.find(s => s.id === m.id);
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <input type="checkbox" checked={!!sel} onChange={() => toggleItem(m.id)} style={{ width: 'auto' }} />
                  <span style={{ flex: 1 }}>{m.name}</span>
                  <span className="price-tag">${m.price}</span>
                  {sel && (
                    <input
                      type="number"
                      min="1"
                      value={sel.qty}
                      onChange={e => setQty(m.id, Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ width: 60 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={submitOrder}>
            Place Order
          </button>
        </div>

        <div>
          <h2 style={{ marginBottom: '1rem' }}>Recent Orders</h2>
          {orders.slice(0, 10).map(o => (
            <div className="card" key={o.id} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>Order #{o.id}</span>
                <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
              </div>
              <p className="price-tag" style={{ marginTop: '0.3rem' }}>${o.total.toFixed(2)}</p>
              {o.status === 'DONE' && (
                <button className="btn btn-outline btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => markDelivered(o.id)}>
                  Mark Delivered
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
