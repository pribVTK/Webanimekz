import { getGenres } from '../../lib/scraper';
import { withCache } from '../../lib/cache';

const cachedGenres = withCache('genres', getGenres, 3600);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const genres = await cachedGenres();
    res.status(200).json({ genres });
  } catch (err) {
    console.error('genres error:', err.message);
    res.status(500).json({ error: 'Failed to fetch genres', detail: err.message });
  }
}
