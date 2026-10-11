import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import AnimeCard from '../components/AnimeCard';

function SkeletonGrid({ count = 12 }) {
  return (
    <div className="loading-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton">
          <div className="skeleton-thumb" />
          <div className="skeleton-text" style={{ width: '80%' }} />
          <div className="skeleton-text" style={{ width: '50%' }} />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [home, setHome] = useState(null);
  const [topRated, setTopRated] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loadingHome, setLoadingHome] = useState(true);
  const [error, setError] = useState('');
  const [searchQ, setSearchQ] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/home').then((r) => r.json()),
      fetch('/api/top-rated').then((r) => r.json()),
      fetch('/api/genres').then((r) => r.json()),
    ])
      .then(([homeData, topData, genreData]) => {
        setHome(homeData);
        setTopRated(topData.items || []);
        setGenres(genreData.genres || []);
      })
      .catch(() => setError('Failed to load data. Please try again.'))
      .finally(() => setLoadingHome(false));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const q = searchQ.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <Layout title="Animeku — Nonton Anime Online">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <span className="hero-tag">Free · No Sign-up · HD Quality</span>
          <h1>Watch Anime,<br />Anytime Anywhere</h1>
          <p>Thousands of anime series and movies — updated daily from Samehadaku.</p>
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for an anime title..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              aria-label="Search anime"
            />
            <button type="submit" className="hero-search-btn">Search</button>
          </form>
        </div>
      </section>

      <div className="container">
        {error && <div className="error-box">{error}</div>}

        {/* Genre Tags */}
        {genres.length > 0 && (
          <section className="genre-section">
            <div className="section-header">
              <h2 className="section-title">Browse by <span>Genre</span></h2>
            </div>
            <div className="genre-tags">
              {genres.map((g) => (
                <button
                  key={g.href}
                  className="genre-tag"
                  onClick={() => {
                    const slug = g.href.replace(/\/$/, '').split('/').pop();
                    router.push(`/genre/${slug}`);
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Two-column layout */}
        <div className="home-layout">
          {/* Latest Episodes */}
          <div>
            <div className="section-header">
              <h2 className="section-title">Latest <span>Episodes</span></h2>
            </div>
            {loadingHome ? (
              <SkeletonGrid count={12} />
            ) : (
              <div className="anime-grid">
                {(home?.latestEpisodes || []).map((anime, i) => (
                  <AnimeCard key={i} anime={anime} isEpisode={true} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Top Rated */}
          <aside>
            <div className="section-header">
              <h2 className="section-title">★ <span>Top Rated</span></h2>
            </div>
            <div className="top-rated-list">
              {topRated.slice(0, 10).map((anime, i) => (
                <TopRatedItem key={i} anime={anime} rank={i + 1} />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

function TopRatedItem({ anime, rank }) {
  const router = useRouter();
  function slugFromHref(href) {
    try { return new URL(href).pathname.replace(/\/$/, '').split('/').pop(); }
    catch { return href.replace(/\/$/, '').split('/').pop(); }
  }
  return (
    <div
      className="top-rated-item"
      onClick={() => router.push(`/anime/${slugFromHref(anime.href)}`)}
    >
      <span className={`top-rank ${rank <= 3 ? 'top3' : ''}`}>{rank}</span>
      <div className="top-rated-thumb">
        {anime.thumb ? (
          <img src={anime.thumb} alt={anime.title} loading="lazy" />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎬</div>
        )}
      </div>
      <div className="top-rated-info">
        <p className="top-rated-title">{anime.title}</p>
        <div className="top-rated-meta">
          {anime.rating && <><span className="star">★</span>{anime.rating}</>}
          {anime.status && <span>· {anime.status}</span>}
        </div>
      </div>
    </div>
  );
}
