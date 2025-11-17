import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Library.css';

export default function Library() {
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/images/cat.png');
  const [searchQuery, setSearchQuery] = useState('');
  const [statistics, setStatistics] = useState({
    songs: 0,
    albums: 18,
    playlists: 0,
    artists: 34
  });
  const [recentPlaylists, setRecentPlaylists] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);

  // Default playlists for display
  const defaultPlaylists = [
    {
      id: 1,
      name: 'Chill Vibes',
      cover: '/images/chill.jpg',
      songCount: 23,
      duration: '1h 32m'
    },
    {
      id: 2,
      name: 'Workout Mix',
      cover: '/images/workout.jpg',
      songCount: 45,
      duration: '2h 48m'
    },
    {
      id: 3,
      name: 'Road Trip Hits',
      cover: '/images/roadtrip.jpg',
      songCount: 67,
      duration: '4h 12m'
    },
    {
      id: 4,
      name: 'Study Focus',
      cover: '/images/study.jpg',
      songCount: 31,
      duration: '2h 15m'
    }
  ];

  // Default liked songs for display
  const defaultLikedSongs = [
    {
      id: 1,
      title: 'Softly',
      artist: 'Karan Aujla',
      artwork: '/images/softly.jpg',
      likedAt: Date.now() - 2 * 24 * 60 * 60 * 1000
    },
    {
      id: 2,
      title: 'tension',
      artist: 'Diljit Dosanjh',
      artwork: '/images/tension.jpg',
      likedAt: Date.now() - 3 * 24 * 60 * 60 * 1000
    },
    {
      id: 3,
      title: 'water',
      artist: 'Diljit Dosanjh',
      artwork: '/images/water.jpg',
      likedAt: Date.now() - 7 * 24 * 60 * 60 * 1000
    },
    {
      id: 4,
      title: 'Perfect',
      artist: 'Ed Sheeran',
      artwork: '/images/perfect.jpg',
      likedAt: Date.now() - 7 * 24 * 60 * 60 * 1000
    }
  ];

  // Recently played albums
  const recentAlbums = [
    {
      id: 1,
      title: 'P-POP Culture',
      artist: 'Karan Aujla',
      year: '2025',
      artwork: '/images/popculture.jpg'
    },
    {
      id: 2,
      title: 'Remembering lata Mangeshkar',
      artist: 'Lata Mangeshkar',
      artwork: '/images/lata.jpg'
    },
    {
      id: 3,
      title: 'Param Sundari',
      artist: 'Ed Sheeran',
      year: '2017',
      artwork: '/images/paramsundri.jpg'
    },
    {
      id: 4,
      title: 'Rockstar',
      artist: 'A.R. Rahman',
      year: '2011',
      artwork: '/images/rockstar.jpg'
    }
  ];

  // Downloaded music
  const downloads = [
    {
      id: 1,
      title: 'Timeless (Full Album)',
      artist: 'Hustinder',
      info: '12 songs',
      size: '156 MB',
      artwork: '/images/timeless.jpg'
    },
    {
      id: 2,
      title: 'Chill Vibes (Playlist)',
      artist: 'Your Playlist',
      info: '23 songs',
      size: '89 MB',
      artwork: '/images/chill.jpg'
    },
    {
      id: 3,
      title: 'A for Arjan2 (Full Album)',
      artist: 'Arjan Dhillon',
      info: '15 songs',
      size: '203 MB',
      artwork: '/images/Aforarjan2.jpg'
    }
  ];

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('catifyy_theme') || 'light';
    const isLight = savedTheme === 'light';
    setIsDarkTheme(!isLight);
    
    if (isLight) {
      document.documentElement.style.setProperty('--bg', '#eaf1ff');
      document.documentElement.style.setProperty('--surface', '#f6f8ff');
      document.documentElement.style.setProperty('--text', '#2d3348');
      document.documentElement.style.setProperty('--shadow-dark', '#ccd6ec');
      document.documentElement.style.setProperty('--shadow-light', '#ffffff');
      setLogoSrc('/images/cat.png');
    } else {
      document.documentElement.style.setProperty('--bg', '#1a1d2e');
      document.documentElement.style.setProperty('--surface', '#22263a');
      document.documentElement.style.setProperty('--text', '#e8eaf0');
      document.documentElement.style.setProperty('--shadow-dark', '#0f1118');
      document.documentElement.style.setProperty('--shadow-light', '#2a2f48');
      setLogoSrc('/images/cat.png');
    }
  }, []);

  // Load library data
  useEffect(() => {
    loadLibraryStatistics();
    loadRecentPlaylists();
    loadLikedSongsPreview();
  }, []);

  const loadLibraryStatistics = () => {
    const storedLikedSongs = JSON.parse(localStorage.getItem('catifyy_liked_songs') || '[]');
    const userPlaylists = JSON.parse(localStorage.getItem('catifyy_playlists') || '[]');

    setStatistics({
      songs: storedLikedSongs.length,
      albums: 18,
      playlists: userPlaylists.length,
      artists: 34
    });
  };

  const loadRecentPlaylists = () => {
    const userPlaylists = JSON.parse(localStorage.getItem('catifyy_playlists') || '[]');
    
    if (userPlaylists.length === 0) {
      setRecentPlaylists(defaultPlaylists);
    } else {
      const formatted = userPlaylists.slice(0, 4).map((playlist, index) => ({
        id: index,
        name: playlist.name,
        cover: playlist.cover || '/images/default-playlist.jpg',
        songCount: playlist.songs ? playlist.songs.length : 0,
        duration: calculatePlaylistDuration(playlist.songs || [])
      }));
      setRecentPlaylists(formatted);
    }
  };

  const loadLikedSongsPreview = () => {
    const storedLikedSongs = JSON.parse(localStorage.getItem('catifyy_liked_songs') || '[]');
    
    if (storedLikedSongs.length === 0) {
      setLikedSongs(defaultLikedSongs);
    } else {
      setLikedSongs(storedLikedSongs.slice(0, 4));
    }
  };

  const calculatePlaylistDuration = (songs) => {
    if (!songs || songs.length === 0) return '';
    
    const totalMinutes = songs.length * 3;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    
    if (months > 0) return months === 1 ? '1 month ago' : `${months} months ago`;
    if (weeks > 0) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    if (days > 0) return days === 1 ? '1 day ago' : `${days} days ago`;
    if (hours > 0) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    if (minutes > 0) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    return 'Just now';
  };

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    if (newTheme) {
      document.documentElement.style.setProperty('--bg', '#1a1d2e');
      document.documentElement.style.setProperty('--surface', '#22263a');
      document.documentElement.style.setProperty('--text', '#e8eaf0');
      document.documentElement.style.setProperty('--shadow-dark', '#0f1118');
      document.documentElement.style.setProperty('--shadow-light', '#2a2f48');
      localStorage.setItem('catifyy_theme', 'dark');
      setLogoSrc('/images/cat.png');
    } else {
      document.documentElement.style.setProperty('--bg', '#eaf1ff');
      document.documentElement.style.setProperty('--surface', '#f6f8ff');
      document.documentElement.style.setProperty('--text', '#2d3348');
      document.documentElement.style.setProperty('--shadow-dark', '#ccd6ec');
      document.documentElement.style.setProperty('--shadow-light', '#ffffff');
      localStorage.setItem('catifyy_theme', 'light');
      setLogoSrc('/images/cat.png');
    }
  };

  return (
    <div className="library-page">
      {/* Navigation */}
      <header className="nav">
        <div className="container nav-inner">
          <div className="brand">
            <img id="logo-img" src={logoSrc} height="100" width="120" alt="Catifyy Logo" />
          </div>

          <div className="search-wrap">
            <form className="search" onSubmit={(e) => e.preventDefault()}>
              <i className="fa-solid fa-circle fa-xs" style={{ color: '#000000' }}></i>
              <input
                id="q"
                name="q"
                placeholder="Search songs, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <div className="filters">
              <div className="filter-group">
                <label className="chip" data-active="false">
                  <Link to="/songs">Songs</Link>
                </label>
                
                <label className="chip" data-active="false">
                  <Link to="/albums">Albums</Link>
                </label>
              
                <label className="chip" data-active="true">
                  Library
                </label>

                <label className="chip" data-active="false">
                  <Link to="/playlist">Playlist</Link>
                </label>
                
                <label className="chip" data-active="false">
                  <Link to="/liked">Liked</Link>
                </label>
              </div>
            </div>
          </div>

          <nav className="nav-links">
            <Link to="/" title="Home">
              <i className="fa-solid fa-house-user"></i>
            </Link>
            <Link to="/create" title="Create Playlist">
              <i className="fa-solid fa-plus"></i>
            </Link>
            <button onClick={toggleTheme} className="nav-toggle" title="Toggle theme" aria-label="Toggle theme">
              <i className={`fa-solid ${isDarkTheme ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <Link to="/login" title="Login">
              <i className="fa-solid fa-user"></i>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container stack-32">
        {/* Library Hero Section */}
        <section className="library-hero">
          <h1>Your Music Library</h1>
          <p>All your favorite songs, albums, playlists, and artists in one place. Discover your music journey and create new memories.</p>
          
          {/* Library Statistics */}
          <div className="library-stats">
            <div className="stat-card">
              <div className="stat-number">{statistics.songs}</div>
              <div className="stat-label">{statistics.songs === 1 ? 'Song' : 'Songs'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{statistics.albums}</div>
              <div className="stat-label">Albums</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{statistics.playlists}</div>
              <div className="stat-label">{statistics.playlists === 1 ? 'Playlist' : 'Playlists'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{statistics.artists}</div>
              <div className="stat-label">Artists</div>
            </div>
          </div>
        </section>

        {/* Recently Created Playlists */}
        <section className="library-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fa-solid fa-list" style={{ color: 'var(--primary)' }}></i>
              Recently Created Playlists
            </h2>
            <a href="#" className="view-all-btn" onClick={() => alert('Playlist page coming soon!')}>View All</a>
          </div>
          
          <div className="playlist-grid">
            {recentPlaylists.map((playlist) => (
              <div key={playlist.id} className="playlist-card" onClick={() => alert('Playlist page coming soon!')}>
                <div className="playlist-artwork">
                  <img src={playlist.cover} alt={playlist.name} />
                  <button className="playlist-play-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <div className="playlist-info">
                  <h3>{playlist.name}</h3>
                  <div className="playlist-meta">{playlist.songCount} songs{playlist.duration ? ' • ' + playlist.duration : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Liked Songs */}
        <section className="library-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fa-solid fa-heart" style={{ color: 'var(--accent)' }}></i>
              Liked Songs
            </h2>
            <Link to="/liked" className="view-all-btn">
              View All {statistics.songs} Songs
            </Link>
          </div>
          
          <div className="activity-list">
            {likedSongs.map((song) => (
              <div key={song.id} className="activity-item" onClick={() => navigate('/liked')}>
                <div className="activity-artwork">
                  <img src={song.artwork || song.image || '/images/default-song.jpg'} alt={song.title} />
                </div>
                <div className="activity-info">
                  <div className="activity-title">{song.title}</div>
                  <div className="activity-subtitle">{song.artist || 'Unknown Artist'}</div>
                </div>
                <div className="activity-time">{formatTimeAgo(song.likedAt)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Played Albums */}
        <section className="library-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fa-solid fa-clock" style={{ color: 'var(--primary)' }}></i>
              Recently Played Albums
            </h2>
            <a href="#" className="view-all-btn" onClick={() => alert('View all coming soon!')}>View All</a>
          </div>
          
          <div className="playlist-grid">
            {recentAlbums.map((album) => (
              <div key={album.id} className="playlist-card" onClick={() => alert('Album details coming soon!')}>
                <div className="playlist-artwork">
                  <img src={album.artwork} alt={album.title} />
                  <button className="playlist-play-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <div className="playlist-info">
                  <h3>{album.title}</h3>
                  <div className="playlist-meta">{album.artist}{album.year ? ' • ' + album.year : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Downloaded Music */}
        <section className="library-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fa-solid fa-download" style={{ color: 'var(--primary)' }}></i>
              Downloaded Music
            </h2>
            <a href="#" className="view-all-btn" onClick={() => alert('Manage downloads coming soon!')}>Manage Downloads</a>
          </div>
          
          <div className="activity-list">
            {downloads.map((download) => (
              <div key={download.id} className="activity-item" onClick={() => alert('Download details coming soon!')}>
                <div className="activity-artwork">
                  <img src={download.artwork} alt={download.title} />
                </div>
                <div className="activity-info">
                  <div className="activity-title">{download.title}</div>
                  <div className="activity-subtitle">{download.artist} • {download.info}</div>
                </div>
                <div className="activity-time">{download.size}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="container footer-grid">
          <div className="footer-links">
            <a href="#">About</a>
            <a href="#">Help</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>
          <div className="social" aria-label="Social media">
            <a href="#" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M4 4h3l5 7l5-7h3l-7.5 10L20 20h-3l-5-7l-5 7H4l7.5-10z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 2.2A2.8 2.8 0 1 0 14.8 12A2.8 2.8 0 0 0 12 9.2M18 6.5a1 1 0 1 1-1 1a1 1 0 0 1 1-1" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M10 15V9l5 3m8-6.5v9A3.5 3.5 0 0 1 19.5 18h-15A3.5 3.5 0 0 1 1 14.5v-9A3.5 3.5 0 0 1 4.5 2h15A3.5 3.5 0 0 1 23 5.5" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
