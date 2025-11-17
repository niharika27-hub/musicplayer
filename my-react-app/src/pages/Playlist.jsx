import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Playlist.css';

export default function Playlist() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/images/cat.png');
  const [searchQuery, setSearchQuery] = useState('');
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Default playlists for display
  const defaultPlaylists = [
    { id: 'default-1', name: 'Chill Vibes', cover: '/images/chill.jpg', songCount: 23, meta: '1h 32m' },
    { id: 'default-2', name: 'Workout Mix', cover: '/images/workout.jpg', songCount: 45, meta: '2h 48m' },
    { id: 'default-3', name: 'Road Trip Hits', cover: '/images/roadtrip.jpg', songCount: 67, meta: '4h 12m' },
    { id: 'default-4', name: 'Study Focus', cover: '/images/study.jpg', songCount: 31, meta: '2h 15m' }
  ];

  const sharedPlaylists = [
    { id: 'shared-1', name: 'Party Mix 2025', cover: '/images/yjhd.jpg', songCount: 38, meta: 'Shared with 5 friends' },
    { id: 'shared-2', name: 'Romantic Melodies', cover: '/images/paramsundri.jpg', songCount: 24, meta: 'Shared with 2 friends' },
    { id: 'shared-3', name: 'Travel Vibes', cover: '/images/roadtrip.jpg', songCount: 41, meta: 'Shared with 8 friends' }
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

  // Load user playlists
  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = () => {
    const playlists = localStorage.getItem('catifyy_playlists');
    if (playlists) {
      setUserPlaylists(JSON.parse(playlists));
    }
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

  const deletePlaylist = (id) => {
    const playlist = userPlaylists.find(p => p.id === id);
    if (!playlist) return;
    
    if (window.confirm(`Delete playlist "${playlist.name}"? This cannot be undone.`)) {
      const updated = userPlaylists.filter(p => p.id !== id);
      localStorage.setItem('catifyy_playlists', JSON.stringify(updated));
      setUserPlaylists(updated);
      console.log('🗑️ Deleted playlist:', playlist.name);
    }
  };

  const openPlaylistModal = (playlistId) => {
    const playlist = userPlaylists.find(p => p.id === playlistId);
    if (!playlist) {
      console.error('❌ Playlist not found:', playlistId);
      return;
    }
    setCurrentPlaylist(playlist);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentPlaylist(null);
    document.body.style.overflow = '';
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setCurrentSongIndex(-1);
    setIsPlaying(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const playSong = (index) => {
    if (!currentPlaylist || index < 0 || index >= currentPlaylist.songs.length) return;
    
    const song = currentPlaylist.songs[index];
    console.log('🎵 Playing:', song.title);

    if (currentAudio) {
      currentAudio.pause();
    }

    // Try to play the song (simplified version)
    const audio = new Audio(song.src || `/audio/${song.title}.mp3`);
    audio.addEventListener('ended', () => {
      if (index < currentPlaylist.songs.length - 1) {
        playSong(index + 1);
      }
    });
    
    audio.play().catch(err => console.error('Play error:', err));
    setCurrentAudio(audio);
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }
  };

  const resumeAudio = () => {
    if (currentAudio) {
      currentAudio.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setCurrentSongIndex(-1);
      setIsPlaying(false);
    }
  };

  return (
    <div className="playlist-page">
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
                <label className="chip" data-active="false">
                  <Link to="/library">Library</Link>
                </label>
                <label className="chip" data-active="true">
                  Playlist
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

      <main className="container stack-32">
        {/* Hero Section */}
        <section className="playlist-hero">
          <h1>Your Playlists</h1>
          <p>Create, organize, and share your favorite music collections. Build the perfect soundtrack for every moment and mood.</p>
          
          <div className="create-options">
            <Link to="/create" className="create-btn create-btn-primary" style={{ textDecoration: 'none' }}>
              <i className="fa-solid fa-plus"></i>
              <span>Create Your Own Playlist</span>
            </Link>
            <button className="create-btn" onClick={() => alert('Auto-generate coming soon!')}>
              <i className="fa-solid fa-magic-wand-sparkles"></i>
              <span>Auto-Generate Playlist</span>
            </button>
          </div>
        </section>

        {/* My Playlists */}
        <section className="library-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fa-solid fa-list-music" style={{ color: 'var(--primary)' }}></i>
              My Playlists
            </h2>
            <a href="#" className="view-all-btn">View All {userPlaylists.length + defaultPlaylists.length}</a>
          </div>
          
          <div className="playlist-grid">
            {/* User created playlists */}
            {userPlaylists.map((playlist) => (
              <div key={playlist.id} className="playlist-card" onClick={() => openPlaylistModal(playlist.id)}>
                <div className="playlist-artwork">
                  <img src={playlist.cover} alt={playlist.name} />
                  <button className="playlist-play-btn" onClick={(e) => e.stopPropagation()}>
                    <svg width="12" height="12" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <button className="playlist-share-btn" title="Share with friends" onClick={(e) => e.stopPropagation()}>
                    <svg width="14" height="14" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                    </svg>
                  </button>
                  <button 
                    className="playlist-delete-btn" 
                    title="Delete playlist"
                    onClick={(e) => { e.stopPropagation(); deletePlaylist(playlist.id); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" />
                    </svg>
                  </button>
                </div>
                <div className="playlist-info">
                  <h3>{playlist.name}</h3>
                  <div className="playlist-meta">
                    <span>{playlist.songs?.length || 0} songs • {playlist.description}</span>
                  </div>
                  <div className="playlist-date">
                    <small>Created {formatDate(playlist.createdAt)}</small>
                  </div>
                </div>
              </div>
            ))}

            {/* Default playlists */}
            {defaultPlaylists.map((playlist) => (
              <div key={playlist.id} className="playlist-card" onClick={() => alert('This is a demo playlist')}>
                <div className="playlist-artwork">
                  <img src={playlist.cover} alt={playlist.name} />
                  <button className="playlist-play-btn" onClick={(e) => e.stopPropagation()}>
                    <svg width="12" height="12" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <button className="playlist-share-btn" title="Share with friends" onClick={(e) => e.stopPropagation()}>
                    <svg width="14" height="14" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                    </svg>
                  </button>
                </div>
                <div className="playlist-info">
                  <h3>{playlist.name}</h3>
                  <div className="playlist-meta">
                    <span>{playlist.songCount} songs • {playlist.meta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recently Shared */}
        <section className="library-section">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fa-solid fa-share-nodes" style={{ color: 'var(--accent)' }}></i>
              Recently Shared
            </h2>
            <a href="#" className="view-all-btn">View All</a>
          </div>
          
          <div className="playlist-grid">
            {sharedPlaylists.map((playlist) => (
              <div key={playlist.id} className="playlist-card" onClick={() => alert('Shared playlist demo')}>
                <div className="playlist-artwork">
                  <img src={playlist.cover} alt={playlist.name} />
                  <button className="playlist-play-btn" onClick={(e) => e.stopPropagation()}>
                    <svg width="12" height="12" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <button className="playlist-share-btn" title="Share with friends" onClick={(e) => e.stopPropagation()}>
                    <svg width="14" height="14" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                    </svg>
                  </button>
                </div>
                <div className="playlist-info">
                  <h3>{playlist.name}</h3>
                  <div className="playlist-meta">
                    <span>{playlist.songCount} songs • {playlist.meta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal */}
      {showModal && currentPlaylist && (
        <div className="playlist-modal active" onClick={(e) => e.target.className.includes('playlist-modal') && closeModal()}>
          <div className="playlist-modal-content">
            <div className="playlist-modal-header">
              <button className="modal-close-btn" onClick={closeModal}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="playlist-modal-cover">
                <img src={currentPlaylist.cover} alt={currentPlaylist.name} />
              </div>
              <div className="playlist-modal-info">
                <h2>{currentPlaylist.name}</h2>
                <p>{currentPlaylist.description || 'No description'}</p>
                <div className="playlist-modal-meta">
                  <span>{currentPlaylist.songs?.length || 0} songs</span>
                </div>
                <div className="playlist-modal-controls">
                  {isPlaying ? (
                    <button className="modal-control-btn" onClick={pauseAudio} title="Pause">
                      <i className="fa-solid fa-pause"></i>
                    </button>
                  ) : (
                    <button className="modal-control-btn" onClick={resumeAudio} title="Play">
                      <i className="fa-solid fa-play"></i>
                    </button>
                  )}
                  <button className="modal-control-btn modal-stop-btn" onClick={stopAudio} title="Stop">
                    <i className="fa-solid fa-stop"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="playlist-modal-songs">
              {currentPlaylist.songs?.map((song, index) => (
                <div 
                  key={index} 
                  className={`modal-song-item ${currentSongIndex === index ? 'playing' : ''}`}
                  onClick={() => playSong(index)}
                >
                  <div className="modal-song-number">{index + 1}</div>
                  <div className="modal-song-info">
                    <div className="modal-song-title">{song.title}</div>
                    <div className="modal-song-artist">{song.artist || 'Unknown Artist'}</div>
                  </div>
                  <button className="modal-song-play-btn">
                    <i className="fa-solid fa-play"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M4 4h3l5 7l5-7h3l-7.5 10L20 20h-3l-5-7l-5 7H4l7.5-10z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 2.2A2.8 2.8 0 1 0 14.8 12A2.8 2.8 0 0 0 12 9.2M18 6.5a1 1 0 1 1-1 1a1 1 0 0 1 1-1" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M10 15V9l5 3m8-6.5v9A3.5 3.5 0 0 1 19.5 18h-15A3.5 3.5 0 0 1 1 14.5v-9A3.5 3.5 0 0 1 4.5 2h15A3.5 3.5 0 0 1 23 5.5" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
