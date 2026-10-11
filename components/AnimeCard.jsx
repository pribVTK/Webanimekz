import { useRouter } from 'next/router';

function slugFromHref(href) {
  if (!href) return '';
  try {
    const url = new URL(href);
    const parts = url.pathname.replace(/\/$/, '').split('/');
    return parts[parts.length - 1];
  } catch {
    return href.replace(/\/$/, '').split('/').pop();
  }
}

export default function AnimeCard({ anime, isEpisode }) {
  const router = useRouter();
  const slug = slugFromHref(anime.href);

  function handleClick() {
    if (!slug) return;
    if (isEpisode) {
      router.push(`/episode/${slug}`);
    } else {
      router.push(`/anime/${slug}`);
    }
  }

  return (
    <div className="anime-card" onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={anime.title}>
      <div className="anime-card-thumb">
        {anime.thumb ? (
          <img
            src={anime.thumb}
            alt={anime.title}
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling?.removeAttribute('hidden'); }}
          />
        ) : null}
        <div className="card-placeholder" style={{ display: anime.thumb ? 'none' : 'flex' }}>
          🎬
        </div>
        {anime.rating && (
          <span className="card-rating">★ {anime.rating}</span>
        )}
        {anime.ep && <span className="card-ep">{anime.ep}</span>}
        {anime.type && <span className="card-type">{anime.type}</span>}
      </div>
      <div className="anime-card-info">
        <p className="anime-card-title">{anime.title}</p>
        {anime.status && <p className="anime-card-meta">{anime.status}</p>}
      </div>
    </div>
  );
}
