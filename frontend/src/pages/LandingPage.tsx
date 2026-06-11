import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="page">
      <section className="overview-banner" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="overview-copy">
          <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>Welcome to STEAKZ LIGHTER</h1>
          <p style={{ fontSize: '1.2em', marginBottom: '60px', color: '#666' }}>
            Experience the finest dining with our exceptional steakhouse collection
          </p>
        </div>
        <div className="overview-actions" style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '12px 40px', fontSize: '1.1em' }}>
            Login
          </Link>
          <Link to="/register" className="btn btn-ghost" style={{ padding: '12px 40px', fontSize: '1.1em' }}>
            Register
          </Link>
        </div>
      </section>
    </div>
}

            ))}
          </div>
          {selectedBranch && (
            <div className="branch-note">
              <strong>📍 {selectedBranch.name}</strong> — {selectedBranch.address}
            </div>
          )}
        </div>
      </section>

      {/* Menu Display */}
      {loading && (
        <div className="loading-state">
          <p>Loading menu...</p>
        </div>
      )}

      {!loading && menu.length > 0 && (
        <div className="menu-section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Menu</p>
              <h3>Discover the latest dishes</h3>
            </div>
            <p className="section-info">Tip: the menu updates by branch, so select your location to see what’s fresh.</p>
          </div>
          {categories.map(cat => (
            <section key={cat} className="menu-category">
              <div className="category-title">
                <h4>{cat}</h4>
              </div>
              <div className="card-grid">
                {menu.filter(m => m.category === cat).map(item => (
                  <div className="card menu-card" key={item.id}>
                    <div>
                      <h3>{item.name}</h3>
                      {item.description && (
                        <p className="item-description">{item.description}</p>
                      )}
                    </div>
                    <span className="price-tag">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {selectedId && menu.length === 0 && !loading && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
          No menu items for this branch yet.
        </p>
      )}

      {/* Call to Action */}
      {selectedId && (
        <div style={{ 
          marginTop: '3rem', 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/register" className="btn btn-primary">
            Book a Table
          </Link>
        </div>
      )}
    </div>
  );
}
