import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AnimeCard from '../../components/AnimeCard';

export default function GenrePage() {
  const router = useRouter();
  const { slug, page: pageParam } = router.query;
  const page = parseInt(pageParam) || 1;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/genre/${slug}?page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug, page]);

  const title = data?.genreName || slug || 'Genre';

  function goPage(p) {
    router.push(`/genre/${slug}?page=${p}`);
  }

  return (
    <Layout title={`${title} Anime — Animeku`}>
      <div className="container">
        <div className="page-section">
          <div className="section-header">
            <h1 className="section-title"><span>{title}</span> Anime</h1>
            {data?.totalPages > 1 && (
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                Page {page} of {data.totalPages}
              </p>
            )}
          </div>

          {error && <div className="error-box">{error}</div>}

          {loading ? (
            <div className="loading-grid">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton">
                  <div className="skeleton-thumb" />
                  <div className="skeleton-text" style={{ width: '80%' }} />
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
              <p>No anime found in this genre.</p>
            </div>
          )}

          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="pagination">
              {page > 1 && (
                <button className="page-btn" onClick={() => goPage(page - 1)}>‹</button>
              )}
              {Array.from({ length: Math.min(data.totalPages, 7) }, (_, i) => {
                const p = i + 1;
                return (
                  <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => goPage(p)}>
                    {p}
                  </button>
                );
              })}
              {page < data.totalPages && (
                <button className="page-btn" onClick={() => goPage(page + 1)}>›</button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
