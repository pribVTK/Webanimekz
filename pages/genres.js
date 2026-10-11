import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const GENRE_ICONS = {
  Action: '⚔️', Adventure: '🗺️', Comedy: '😂', Drama: '🎭', Fantasy: '🧙',
  Horror: '👻', Magic: '✨', Mecha: '🤖', Music: '🎵', Mystery: '🔍',
  Romance: '💕', 'Sci-Fi': '🚀', 'Slice of Life': '🌸', Sports: '⚽',
  Supernatural: '👁️', Thriller: '😱', Historical: '📜', School: '🏫',
  Military: '🪖', Psychological: '🧠', Ecchi: '🔞', Harem: '👥',
  Isekai: '🌀', Shounen: '💪', Shoujo: '🌺', Josei: '💼', Seinen: '🍺',
};

export default function GenresPage() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/genres')
      .then((r) => r.json())
      .then((d) => setGenres(d.genres || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="All Genres — Animeku">
      <div className="container">
        <div className="page-section">
          <div className="section-header">
            <h1 className="section-title">All <span>Genres</span></h1>
          </div>

          {loading ? (
            <div className="genre-tags">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ width: 90, height: 36, borderRadius: 20 }} />
              ))}
            </div>
          ) : genres.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {genres.map((g) => {
                const slug = g.href.replace(/\/$/, '').split('/').pop();
                const icon = GENRE_ICONS[g.name] || '🎞️';
                return (
                  <button
                    key={g.href}
                    onClick={() => router.push(`/genre/${slug}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '12px 16px',
                      borderRadius: 10,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    {g.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <p>No genres found.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
