import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function EpisodePage() {
  const router = useRouter();
  const { slug } = router.query;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIframe, setActiveIframe] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setData(null);
    fetch(`/api/episode/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
        setActiveIframe(0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  function slugFromHref(href) {
    try { return new URL(href).pathname.replace(/\/$/, '').split('/').pop(); }
    catch { return href.replace(/\/$/, '').split('/').pop(); }
  }

  const currentIframe = data?.iframes?.[activeIframe] || '';

  return (
    <Layout title={data ? `${data.title} — Animeku` : 'Watch — Animeku'}>
      <div className="container" style={{ paddingTop: 24 }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a href="/" style={{ color: 'var(--text-muted)' }}>Home</a>
          <span>›</span>
          {data?.animeLink && (
            <>
              <a href={`/anime/${slugFromHref(data.animeLink)}`} style={{ color: 'var(--text-muted)' }}>Anime</a>
              <span>›</span>
            </>
          )}
          <span style={{ color: 'var(--text-secondary)' }}>{data?.title || slug}</span>
        </div>

        {error && <div className="error-box" style={{ marginBottom: 16 }}>{error}</div>}

        {loading ? (
          <div>
            <div className="skeleton" style={{ aspectRatio: '16/9', borderRadius: 16, marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 40, borderRadius: 8 }} />
          </div>
        ) : data ? (
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 16, fontWeight: 700 }}>
              {data.title}
            </h1>

            <div className="episode-layout">
              {/* Player */}
              <div>
                {/* Mirror selector */}
                {data.iframes?.length > 1 && (
                  <div className="mirror-selector" style={{ marginBottom: 12 }}>
                    {data.iframes.map((src, i) => (
                      <button
                        key={i}
                        className={`mirror-btn ${i === activeIframe ? 'active' : ''}`}
                        onClick={() => setActiveIframe(i)}
                      >
                        Mirror {i + 1}
                      </button>
                    ))}
                  </div>
                )}

                {/* Video player */}
                <div className="video-container">
                  {currentIframe ? (
                    <iframe
                      src={currentIframe}
                      allowFullScreen
                      allow="autoplay; encrypted-media"
                      referrerPolicy="no-referrer"
                      title={data.title}
                    />
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      color: 'var(--text-muted)',
                      gap: 12,
                    }}>
                      <span style={{ fontSize: 48 }}>📺</span>
                      <p style={{ fontSize: 15 }}>No stream source found</p>
                      <p style={{ fontSize: 13, textAlign: 'center', maxWidth: 320 }}>
                        Try visiting{' '}
                        <a href="https://samehadaku.email" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                          samehadaku.email
                        </a>{' '}
                        directly.
                      </p>
                    </div>
                  )}
                </div>

                {/* Prev/Next */}
                <div className="ep-nav" style={{ marginTop: 16 }}>
                  {data.prevEp ? (
                    <a href={`/episode/${slugFromHref(data.prevEp)}`} className="ep-nav-btn">
                      ← Previous
                    </a>
                  ) : (
                    <span className="ep-nav-btn" style={{ opacity: 0.3, pointerEvents: 'none', textAlign: 'center' }}>
                      ← Previous
                    </span>
                  )}
                  {data.nextEp ? (
                    <a href={`/episode/${slugFromHref(data.nextEp)}`} className="ep-nav-btn">
                      Next →
                    </a>
                  ) : (
                    <span className="ep-nav-btn" style={{ opacity: 0.3, pointerEvents: 'none', textAlign: 'center' }}>
                      Next →
                    </span>
                  )}
                </div>
              </div>

              {/* Episode sidebar */}
              {data.episodeList?.length > 0 && (
                <aside className="ep-list-sidebar">
                  <h3>Episodes</h3>
                  {data.episodeList.map((ep, i) => {
                    const eps = slugFromHref(ep.href);
                    const isCurrent = eps === slug;
                    return (
                      <a
                        key={i}
                        href={`/episode/${eps}`}
                        className={`ep-list-item ${isCurrent ? 'current' : ''}`}
                      >
                        {ep.label || `Episode ${i + 1}`}
                      </a>
                    );
                  })}
                </aside>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
