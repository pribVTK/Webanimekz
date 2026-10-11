import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function AnimeDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/anime/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  function slugFromHref(href) {
    try { return new URL(href).pathname.replace(/\/$/, '').split('/').pop(); }
    catch { return href.replace(/\/$/, '').split('/').pop(); }
  }

  return (
    <Layout title={data ? `${data.title} — Animeku` : 'Loading... — Animeku'}>
      <div className="container">
        <div className="page-section">
          {/* Breadcrumb */}
          <div style={{ marginBottom: 24, fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="/" style={{ color: 'var(--text-muted)' }}>Home</a>
            <span>›</span>
            <a href="/anime-list" style={{ color: 'var(--text-muted)' }}>Anime</a>
            <span>›</span>
            <span style={{ color: 'var(--text-secondary)' }}>{data?.title || slug}</span>
          </div>

          {error && <div className="error-box">{error}</div>}

          {loading ? (
            <div className="detail-layout">
              <div className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 16 }} />
              <div>
                <div className="skeleton" style={{ height: 36, width: '70%', borderRadius: 8, marginBottom: 16 }} />
                <div className="skeleton" style={{ height: 14, width: '40%', borderRadius: 6, marginBottom: 12 }} />
                <div className="skeleton" style={{ height: 80, borderRadius: 8, marginBottom: 16 }} />
              </div>
            </div>
          ) : data ? (
            <>
              <div className="detail-layout">
                {/* Poster */}
                <div className="detail-poster">
                  {data.thumb ? (
                    <img src={data.thumb} alt={data.title} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48 }}>🎬</div>
                  )}
                </div>

                {/* Info */}
                <div className="detail-info">
                  <h1>{data.title}</h1>

                  {data.rating && (
                    <div className="detail-rating">★ {data.rating}</div>
                  )}

                  {data.genres?.length > 0 && (
                    <div className="detail-genres">
                      {data.genres.map((g, i) => {
                        const gs = slugFromHref(g.href);
                        return (
                          <a key={i} href={`/genre/${gs}`} className="detail-genre-tag">{g.name}</a>
                        );
                      })}
                    </div>
                  )}

                  {data.synopsis && (
                    <p className="detail-synopsis">{data.synopsis}</p>
                  )}

                  {/* Info table */}
                  {Object.keys(data.info || {}).length > 0 && (
                    <table className="detail-table">
                      <tbody>
                        {Object.entries(data.info).map(([k, v]) => (
                          <tr key={k}>
                            <td>{k}</td>
                            <td>{v}</td>
                          </tr>
                        ))}
                        {data.status && !data.info['Status'] && (
                          <tr>
                            <td>Status</td>
                            <td>{data.status}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Episode list */}
              {data.episodes?.length > 0 && (
                <div style={{ marginTop: 40 }}>
                  <div className="section-header">
                    <h2 className="section-title">Episodes <span>({data.episodes.length})</span></h2>
                  </div>
                  <div className="ep-grid">
                    {data.episodes.map((ep, i) => {
                      const eps = slugFromHref(ep.href);
                      return (
                        <a key={i} href={`/episode/${eps}`} className="ep-btn">
                          {ep.num || i + 1}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
