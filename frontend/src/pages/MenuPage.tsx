import { useEffect, useState } from 'react';
import api from '../api/axios';

interface Branch { id: number; name: string; address: string; }
interface MenuItem { id: number; name: string; description?: string; price: number; category: string; }

export default function MenuPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/public/branches').then(r => setBranches(r.data));
  }, []);

  async function loadMenu(branchId: number) {
    setSelectedId(branchId);
    setLoading(true);
    const r = await api.get(`/menu/${branchId}`);
    setMenu(r.data);
    setLoading(false);
  }

  const categories = [...new Set(menu.map(m => m.category))];

  return (
    <div className="page">
      <h1>Our Menu</h1>
      <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>
        Select a branch to view its menu
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {branches.map(b => (
          <button
            key={b.id}
            className={`btn ${selectedId === b.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => loadMenu(b.id)}
          >
            {b.name}
          </button>
        ))}
      </div>

      {loading && <p>Loading menu...</p>}

      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: '2rem' }}>
          <h3>{cat}</h3>
          <div className="card-grid">
            {menu.filter(m => m.category === cat).map(item => (
              <div className="card" key={item.id}>
                <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
                {item.description && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {item.description}
                  </p>
                )}
                <span className="price-tag">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedId && menu.length === 0 && !loading && (
        <p style={{ color: 'var(--text-muted)' }}>No menu items for this branch yet.</p>
      )}
    </div>
  );
}
