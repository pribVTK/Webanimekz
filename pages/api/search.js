import { searchAnime } from '../../lib/scraper';
import { withCache } from '../../lib/cache';

const cachedSearch = withCache('search', searchAnime, 120);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query param: q' });
  try {
    const results = await cachedSearch(q);
    res.status(200).json({ results });
  } catch (err) {
    console.error('search error:', err.message);
    res.status(500).json({ error: 'Search failed', detail: err.message });
  }
}
