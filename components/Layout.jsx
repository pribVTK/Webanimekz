import Navbar from './Navbar';
import Head from 'next/head';

export default function Layout({ children, title = 'Animeku — Nonton Anime Online' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Stream anime online for free — latest episodes, top-rated series, all genres." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <main>{children}</main>
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Animeku · Data sourced from <a href="https://samehadaku.email" target="_blank" rel="noopener noreferrer">Samehadaku</a></p>
        </div>
      </footer>
    </>
  );
}
