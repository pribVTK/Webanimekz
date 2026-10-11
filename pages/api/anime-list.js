import { getAnimeList } from '../../lib/scraper';
import { withCache } from '../../lib/cache';

const cachedList = withCache('animeList', getAnimeList, 900);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const page = parseInt(req.query.page) || 1;
  try {
    const data = await cachedList(page);
    res.status(200).json(data);
  } catch (err) {
    console.error('anime-list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch anime list', detail: err.message });
  }
}
