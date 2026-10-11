import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AnimeCard from '../components/AnimeCard';

export default function TopRatedPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/top-rated')
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setError('Failed to load top-rated anime.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Top Rated Anime — Animeku">
      <div className="container">
        <div className="page-section">
          <div className="section-header">
            <h1 className="section-title">★ Top <span>Rated</span> Anime</h1>
          </div>

          {error && <div className="error-box">{error}</div>}

          {loading ? (
            <div className="loading-grid">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="skeleton">
                  <div className="skeleton-thumb" />
                  <div className="skeleton-text" style={{ width: '80%' }} />
                  <div className="skeleton-text" style={{ width: '50%' }} />
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="anime-grid">
              {items.map((anime, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: -8, left: -8,
                    zIndex: 2,
                    background: i < 3 ? 'var(--accent)' : 'var(--surface-3)',
                    color: i < 3 ? '#fff' : 'var(--text-muted)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 13,
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--bg)',
                  }}>
                    {i + 1}
                  </div>
                  <AnimeCard anime={anime} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏆</div>
              <p>No top-rated anime found.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
