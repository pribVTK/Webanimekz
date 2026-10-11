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

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [inputQ, setInputQ] = useState('');

  useEffect(() => {
    if (!q) return;
    setInputQ(q);
    setLoading(true);
    setError('');
    setSearched(false);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results || []);
        setSearched(true);
      })
      .catch(() => setError('Search failed. Please try again.'))
      .finally(() => setLoading(false));
  }, [q]);

  function handleSearch(e) {
    e.preventDefault();
    const query = inputQ.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <Layout title={q ? `Search: ${q} — Animeku` : 'Search — Animeku'}>
      <div className="container">
        <div className="page-section">
          <div className="search-header">
            <h1>Search Results</h1>
            {q && !loading && (
              <p>
                {results.length > 0
                  ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${q}"`
                  : searched
                  ? `No results found for "${q}"`
                  : ''}
              </p>
            )}
          </div>

          {/* Inline search bar */}
          <form className="hero-search" onSubmit={handleSearch} style={{ marginBottom: 32, maxWidth: 480 }}>
            <input
              type="text"
              placeholder="Search anime..."
              value={inputQ}
              onChange={(e) => setInputQ(e.target.value)}
              aria-label="Search anime"
            />
            <button type="submit" className="hero-search-btn">Search</button>
          </form>

          {error && <div className="error-box">{error}</div>}

          {loading ? (
            <SkeletonGrid count={12} />
          ) : results.length > 0 ? (
            <div className="anime-grid">
              {results.map((anime, i) => (
                <AnimeCard key={i} anime={anime} />
              ))}
            </div>
          ) : searched ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p>No anime found. Try a different keyword.</p>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
