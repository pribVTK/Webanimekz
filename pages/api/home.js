import { getHomePage } from '../../lib/scraper';
import { withCache } from '../../lib/cache';

const cachedHome = withCache('home', getHomePage, 300);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const data = await cachedHome();
    res.status(200).json(data);
  } catch (err) {
    console.error('home error:', err.message);
    res.status(500).json({ error: 'Failed to fetch home data', detail: err.message });
  }
}
