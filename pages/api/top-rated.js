import { getTopRated } from '../../lib/scraper';
import { withCache } from '../../lib/cache';

const cachedTop = withCache('topRated', getTopRated, 1800);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const items = await cachedTop();
    res.status(200).json({ items });
  } catch (err) {
    console.error('top-rated error:', err.message);
    res.status(500).json({ error: 'Failed to fetch top rated', detail: err.message });
  }
}
