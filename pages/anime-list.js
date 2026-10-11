import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import AnimeCard from '../components/AnimeCard';

export default function AnimeListPage() {
  const router = useRouter();
  const page = parseInt(router.query.page) || 1;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/anime-list?page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  function goPage(p) {
    router.push(`/anime-list?page=${p}`);
  }

  return (
    <Layout title={`Anime List — Page ${page} — Animeku`}>
      <div className="container">
        <div className="page-section">
          <div className="section-header">
            <h1 className="section-title">All <span>Anime</span></h1>
            {data?.totalPages && (
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                Page {page} of {data.totalPages}
              </p>
            )}
          </div>

          {error && <div className="error-box">{error}</div>}

          {loading ? (
            <div className="loading-grid">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="skeleton">
                  <div className="skeleton-thumb" />
                  <div className="skeleton-text" style={{ width: '80%' }} />
                  <div className="skeleton-text" style={{ width: '50%' }} />
                </div>
              ))}
            </div>
          ) : (data?.items || []).length > 0 ? (
            <div className="anime-grid">
              {data.items.map((anime, i) => (
                <AnimeCard key={i} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <p>No anime found.</p>
            </div>
          )}

          {data?.totalPages > 1 && (
            <div className="pagination">
              {page > 1 && (
                <button className="page-btn" onClick={() => goPage(page - 1)}>‹ Prev</button>
              )}
              {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
                const p = i + Math.max(1, page - 2);
                if (p > data.totalPages) return null;
                return (
                  <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => goPage(p)}>
                    {p}
                  </button>
                );
              })}
              {page < data.totalPages && (
                <button className="page-btn" onClick={() => goPage(page + 1)}>Next ›</button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
