import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="brand">
          <img id="logo-img" src="/images/cat.png" height="100" width="120" alt="Catifyy Logo" />
        </div>

        <div className="search-wrap">
          <form className="search" onSubmit={(e) => e.preventDefault()}>
            <i className="fa-solid fa-circle fa-xs" style={{ color: '#000000' }}></i>
            <input id="q" name="q" placeholder="Search songs, artists, albums..." />
          </form>
          <div className="filters">
            <div className="filter-group">
              <input type="radio" name="scope" id="f-songs" />
              <label className="chip" htmlFor="f-songs"><a href="/songs.html">Songs</a></label>

              <input type="radio" name="scope" id="f-albums" />
              <label className="chip" htmlFor="f-albums"><a href="/albums.html">Albums</a></label>

              <input type="radio" name="scope" id="f-library" />
              <label className="chip" htmlFor="f-library"><a href="/library.html">Library</a></label>

              <input type="radio" name="scope" id="f-playlists" />
              <label className="chip" htmlFor="f-playlists"><a href="/playlist.html">Playlist</a></label>

              <input type="radio" name="scope" id="f-liked" />
              <label className="chip" htmlFor="f-liked"><a href="/liked.html">Liked</a></label>
            </div>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/" title="Home" aria-current={isActive('/') ? 'page' : undefined}><i className="fa-solid fa-house-user"></i></Link>
          <a href="/create.html" title="Create Playlist"><i className="fa-solid fa-plus"></i></a>
          <button id="theme-toggle" className="nav-toggle" title="Toggle theme" aria-label="Toggle theme">
            <i id="theme-icon" className="fa-solid fa-moon"></i>
          </button>
          <Link to="/login" title="Login" aria-current={isActive('/login') ? 'page' : undefined}><i className="fa-solid fa-user"></i></Link>
        </nav>
      </div>
    </header>
  );
}
