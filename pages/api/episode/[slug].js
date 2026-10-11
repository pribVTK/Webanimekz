import { getEpisodeStream } from '../../../lib/scraper';
import { withCache } from '../../../lib/cache';

const cachedEp = withCache('episode', getEpisodeStream, 600);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { slug } = req.query;
  try {
    const data = await cachedEp(slug);
    res.status(200).json(data);
  } catch (err) {
    console.error('episode error:', err.message);
    res.status(500).json({ error: 'Failed to fetch episode', detail: err.message });
  }
}
