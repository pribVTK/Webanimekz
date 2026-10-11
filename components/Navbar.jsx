import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Navbar() {
  const [q, setQ] = useState('');
  const router = useRouter();
  const inputRef = useRef(null);

  function handleSearch(e) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/genres', label: 'Genres' },
    { href: '/top-rated', label: 'Top Rated' },
    { href: '/anime-list', label: 'Anime List' },
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            Anime<span>ku</span>
          </Link>

          <div className="navbar-nav">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link ${router.pathname === l.href ? 'active' : ''}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <form className="navbar-search" onSubmit={handleSearch}>
            <span className="search-icon">⌕</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search anime..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search anime"
            />
          </form>
        </div>
      </div>
    </nav>
  );
}
