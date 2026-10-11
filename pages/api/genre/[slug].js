import { getAnimeByGenre } from '../../../lib/scraper';
import { withCache } from '../../../lib/cache';

const cachedGenre = withCache('genre', getAnimeByGenre, 600);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { slug, page } = req.query;
  try {
    const data = await cachedGenre(slug, parseInt(page) || 1);
    res.status(200).json(data);
  } catch (err) {
    console.error('genre error:', err.message);
    res.status(500).json({ error: 'Failed to fetch genre', detail: err.message });
  }
}
