# Animeku — Anime Streaming Website

A full-featured anime streaming website built with **Next.js 14**, scraping live data from [Samehadaku](https://samehadaku.email).

## Features

- 🏠 **Home** — Latest episodes + Top Rated sidebar
- 🔍 **Search** — Real-time search from Samehadaku
- 🏷️ **Genres** — Browse by genre with icons
- ⭐ **Top Rated** — Highest-rated anime with rank badges
- 📋 **Anime List** — Full paginated list
- 📺 **Anime Detail** — Synopsis, info table, episode grid
- 🎬 **Episode Watch** — Embedded player, mirror selector, prev/next nav
- ⚡ **Caching** — Server-side in-memory cache (10 min TTL) to reduce scraping load
- 📱 **Responsive** — Works on mobile, tablet, desktop

## Tech Stack

- Next.js 14 (Pages Router)
- Cheerio — HTML scraping
- Axios — HTTP requests
- node-cache — Server-side caching
- Google Fonts (Inter + Space Grotesk)

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

---

## Deploy to Vercel

### Method A — Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. In your project folder, run:
vercel

# 3. Follow the prompts:
#    - Log in or create a Vercel account
#    - Link to a new project
#    - Framework: Next.js (auto-detected)
#    - Root directory: ./ (leave as default)
#    - Build Command: next build (auto-detected)
#    - Output: .next (auto-detected)

# 4. For production deploy:
vercel --prod
```

### Method B — GitHub + Vercel Dashboard

1. **Push your code to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit — Animeku"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/animeku.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) → Sign In / Sign Up
   - Click **"Add New Project"**
   - Click **"Import Git Repository"** → Select your `animeku` repo
   - Framework will be auto-detected as **Next.js**
   - Leave all settings as default
   - Click **"Deploy"**

3. **Done!** Vercel gives you a live URL like `https://animeku-xyz.vercel.app`

4. **Auto-deploy**: Every future `git push` to `main` automatically redeploys.

---

## Project Structure

```
animeku/
├── components/
│   ├── AnimeCard.jsx      # Reusable anime thumbnail card
│   ├── Layout.jsx         # Page layout wrapper + <head>
│   └── Navbar.jsx         # Sticky navbar with search
├── lib/
│   ├── cache.js           # In-memory cache helper
│   └── scraper.js         # All Samehadaku scraping logic
├── pages/
│   ├── api/
│   │   ├── home.js        # GET /api/home
│   │   ├── search.js      # GET /api/search?q=
│   │   ├── genres.js      # GET /api/genres
│   │   ├── top-rated.js   # GET /api/top-rated
│   │   ├── anime-list.js  # GET /api/anime-list?page=
│   │   ├── anime/[slug].js    # GET /api/anime/:slug
│   │   ├── genre/[slug].js    # GET /api/genre/:slug?page=
│   │   └── episode/[slug].js  # GET /api/episode/:slug
│   ├── anime/[slug].js    # Anime detail page
│   ├── episode/[slug].js  # Episode watch page
│   ├── genre/[slug].js    # Genre anime list page
│   ├── anime-list.js      # Full anime list page
│   ├── genres.js          # All genres page
│   ├── search.js          # Search results page
│   ├── top-rated.js       # Top-rated page
│   ├── _app.js
│   └── _document.js
├── styles/
│   └── globals.css        # Full design system CSS
├── next.config.js
├── vercel.json
└── package.json
```

---

## Notes

- **Cache TTL**: Home = 5 min, Episodes = 10 min, Top Rated = 30 min, Genres = 1 hour
- **Samehadaku domain**: If samehadaku.email changes domain, update `BASE_URL` in `lib/scraper.js`
- **Images**: Next.js image domains are whitelisted in `next.config.js` — add more if needed
- **node-cache** is in-memory and resets on serverless cold start; this is expected behavior on Vercel
- **Vercel Serverless**: API routes have a 30-second timeout (`vercel.json`) to accommodate scraping
