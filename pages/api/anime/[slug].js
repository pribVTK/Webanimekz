import { getAnimeDetail } from '../../../lib/scraper';
import { withCache } from '../../../lib/cache';

const cachedDetail = withCache('animeDetail', getAnimeDetail, 1800);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { slug } = req.query;
  try {
    const data = await cachedDetail(slug);
    res.status(200).json(data);
  } catch (err) {
    console.error('anime detail error:', err.message);
    res.status(500).json({ error: 'Failed to fetch anime detail', detail: err.message });
  }
}
