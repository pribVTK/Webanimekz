import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://samehadaku.email';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Referer': BASE_URL,
};

async function fetchPage(url) {
  const res = await axios.get(url, { headers, timeout: 15000 });
  return cheerio.load(res.data);
}

// ── Home page: latest episodes + featured ────────────────────────────────────
export async function getHomePage() {
  const $ = await fetchPage(BASE_URL);

  const latestEpisodes = [];
  $('.list-episode-item li, .post-lst li').each((_, el) => {
    const a = $(el).find('a').first();
    const img = $(el).find('img');
    const title = $(el).find('.title, h2, h3').first().text().trim() || a.attr('title') || '';
    const href = a.attr('href') || '';
    const thumb = img.attr('data-src') || img.attr('src') || '';
    const ep = $(el).find('.episode, .ep').text().trim();
    if (title && href) {
      latestEpisodes.push({ title, href, thumb, ep });
    }
  });

  // Ongoing / popular sidebar
  const popular = [];
  $('.sidebar .widget, aside .widget').each((_, widget) => {
    const heading = $(widget).find('h3, .widget-title').text().toLowerCase();
    if (heading.includes('popular') || heading.includes('ongoing')) {
      $(widget).find('li').each((_, li) => {
        const a = $(li).find('a').first();
        const img = $(li).find('img');
        popular.push({
          title: a.text().trim() || a.attr('title') || '',
          href: a.attr('href') || '',
          thumb: img.attr('data-src') || img.attr('src') || '',
        });
      });
    }
  });

  return { latestEpisodes: latestEpisodes.slice(0, 24), popular: popular.slice(0, 10) };
}

// ── Anime list (browsing) ─────────────────────────────────────────────────────
export async function getAnimeList(page = 1) {
  const url = page === 1 ? `${BASE_URL}/anime-list/` : `${BASE_URL}/anime-list/page/${page}/`;
  const $ = await fetchPage(url);

  const items = [];
  $('.soralist ul li, .listupd .bs').each((_, el) => {
    const a = $(el).find('a').first();
    const img = $(el).find('img');
    const rating = $(el).find('.rating, .numscore').text().trim();
    const status = $(el).find('.status').text().trim();
    const type = $(el).find('.type').text().trim();
    const title = $(el).find('.tt, h2').first().text().trim() || a.attr('title') || a.text().trim();
    const href = a.attr('href') || '';
    const thumb = img.attr('data-src') || img.attr('src') || '';
    if (title && href) {
      items.push({ title, href, thumb, rating, status, type });
    }
  });

  const totalPagesEl = $('.pagination .page-numbers').last().prev().text().trim();
  const totalPages = parseInt(totalPagesEl) || 1;

  return { items, totalPages };
}

// ── Search ────────────────────────────────────────────────────────────────────
export async function searchAnime(query) {
  const url = `${BASE_URL}/?s=${encodeURIComponent(query)}`;
  const $ = await fetchPage(url);

  const results = [];
  $('.listupd .bs, .result-item, article.bs').each((_, el) => {
    const a = $(el).find('a').first();
    const img = $(el).find('img');
    const rating = $(el).find('.rating, .numscore').text().trim();
    const status = $(el).find('.status').text().trim();
    const type = $(el).find('.type').text().trim();
    const title =
      $(el).find('.tt, h2, h3').first().text().trim() || a.attr('title') || a.text().trim();
    const href = a.attr('href') || '';
    const thumb = img.attr('data-src') || img.attr('src') || '';
    if (title && href) {
      results.push({ title, href, thumb, rating, status, type });
    }
  });

  return results;
}

// ── Genre list ────────────────────────────────────────────────────────────────
export async function getGenres() {
  const $ = await fetchPage(BASE_URL);
  const genres = [];
  $('.genre-nav a, .genre a, .taxoblock a').each((_, el) => {
    const name = $(el).text().trim();
    const href = $(el).attr('href') || '';
    if (name && href) genres.push({ name, href });
  });
  return genres;
}

// ── Anime by genre ────────────────────────────────────────────────────────────
export async function getAnimeByGenre(slug, page = 1) {
  const url =
    page === 1
      ? `${BASE_URL}/genre/${slug}/`
      : `${BASE_URL}/genre/${slug}/page/${page}/`;
  const $ = await fetchPage(url);

  const genreName = $('h1.page-title, .cat-description h1').first().text().trim() || slug;
  const items = [];

  $('.listupd .bs, article.bs').each((_, el) => {
    const a = $(el).find('a').first();
    const img = $(el).find('img');
    const rating = $(el).find('.rating, .numscore').text().trim();
    const status = $(el).find('.status').text().trim();
    const type = $(el).find('.type').text().trim();
    const title =
      $(el).find('.tt, h2').first().text().trim() || a.attr('title') || a.text().trim();
    const href = a.attr('href') || '';
    const thumb = img.attr('data-src') || img.attr('src') || '';
    if (title && href) {
      items.push({ title, href, thumb, rating, status, type });
    }
  });

  const totalPagesEl = $('.pagination .page-numbers').last().prev().text().trim();
  const totalPages = parseInt(totalPagesEl) || 1;

  return { genreName, items, totalPages };
}

// ── Anime detail page ─────────────────────────────────────────────────────────
export async function getAnimeDetail(slug) {
  const url = `${BASE_URL}/anime/${slug}/`;
  const $ = await fetchPage(url);

  const title =
    $('h1.entry-title, .infox h1, .animedesc h1').first().text().trim();
  const thumb =
    $('.thumb img, .infoanime img, .poster img').first().attr('data-src') ||
    $('.thumb img, .infoanime img, .poster img').first().attr('src') ||
    '';
  const synopsis = $('.desc, .entry-content > p').first().text().trim();
  const rating = $('.rating strong, .rateit-count, .num').first().text().trim();
  const status = $('.spe span:contains("Status") + span, .infox .spe span')
    .filter((_, el) => $(el).prev().text().includes('Status'))
    .text()
    .trim();

  const genres = [];
  $('.genxed a, .genre-info a, [itemprop="genre"] a').each((_, el) => {
    genres.push({ name: $(el).text().trim(), href: $(el).attr('href') || '' });
  });

  const info = {};
  $('.spe span, .infox .spe span').each((_, el) => {
    const label = $(el).find('b').text().replace(':', '').trim();
    const value = $(el).clone().children('b').remove().end().text().trim();
    if (label && value) info[label] = value;
  });

  const episodes = [];
  $('#episodelist ul li, .eplister ul li').each((_, el) => {
    const a = $(el).find('a').first();
    const num = $(el).find('.epl-num').text().trim();
    const epTitle = $(el).find('.epl-title').text().trim();
    const date = $(el).find('.epl-date').text().trim();
    const href = a.attr('href') || '';
    if (href) {
      episodes.push({ num, title: epTitle || `Episode ${num}`, date, href });
    }
  });

  return { title, thumb, synopsis, rating, status, genres, info, episodes };
}

// ── Episode stream page ───────────────────────────────────────────────────────
export async function getEpisodeStream(slug) {
  const $ = await fetchPage(`${BASE_URL}/${slug}/`);

  const title = $('h1.entry-title, .entry-title').first().text().trim();

  // Collect all available video sources
  const sources = [];
  $('select.mirror option, .mirror option').each((_, el) => {
    const label = $(el).text().trim();
    const value = $(el).val() || '';
    if (value) sources.push({ label, value });
  });

  // Collect direct iframes
  const iframes = [];
  $('iframe').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || '';
    if (src && !src.includes('ads') && !src.includes('doubleclick')) {
      iframes.push(src);
    }
  });

  // Prev / Next navigation
  const prevEp = $('.naveps .bpr a').attr('href') || '';
  const nextEp = $('.naveps .bne a').attr('href') || '';

  // Episode list for sidebar
  const episodeList = [];
  $('#episodelist ul li a, .eplister ul li a').each((_, el) => {
    episodeList.push({
      label: $(el).text().trim(),
      href: $(el).attr('href') || '',
    });
  });

  // Anime slug to link back to detail
  const animeLink =
    $('.breadcrumb a').eq(1).attr('href') ||
    $('.episodelink a').first().attr('href') ||
    '';

  return { title, sources, iframes, prevEp, nextEp, episodeList, animeLink };
}

// ── Top-rated ─────────────────────────────────────────────────────────────────
export async function getTopRated() {
  const url = `${BASE_URL}/anime-list/?order=rating`;
  const $ = await fetchPage(url);

  const items = [];
  $('.listupd .bs, .soralist ul li').each((_, el) => {
    const a = $(el).find('a').first();
    const img = $(el).find('img');
    const rating = $(el).find('.rating, .numscore').text().trim();
    const status = $(el).find('.status').text().trim();
    const type = $(el).find('.type').text().trim();
    const title =
      $(el).find('.tt, h2').first().text().trim() || a.attr('title') || a.text().trim();
    const href = a.attr('href') || '';
    const thumb = img.attr('data-src') || img.attr('src') || '';
    if (title && href) {
      items.push({ title, href, thumb, rating, status, type });
    }
  });

  return items.slice(0, 20);
}
