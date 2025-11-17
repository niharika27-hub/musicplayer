import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Liked.css';

export default function Liked() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/images/cat.png');
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(true);

  const audioRef = useRef(null);
  const originalOrderRef = useRef([]);
  const playedIndicesRef = useRef([]);

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

    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }
  }, []);

  // Load liked songs
  useEffect(() => {
    loadLikedSongs();
    window.addEventListener('focus', loadLikedSongs);
    return () => window.removeEventListener('focus', loadLikedSongs);
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration && isFinite(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100;
        setProgress(percent);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => nextSong();
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [currentIndex, songs]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        nextSong();
      } else if (e.code === 'ArrowLeft') {
        prevSong();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, songs, isPlaying]);

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

  const getLikedSongs = () => {
    const liked = localStorage.getItem('catifyy_liked_songs');
    return liked ? JSON.parse(liked) : [];
  };

  const saveLikedSongs = (likedArray) => {
    localStorage.setItem('catifyy_liked_songs', JSON.stringify(likedArray));
  };

  const loadLikedSongs = () => {
    const likedSongs = getLikedSongs();
    likedSongs.sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt));
    setSongs(likedSongs);
    originalOrderRef.current = [...likedSongs];
  };

  const formatTime = (seconds) => {
    seconds = Math.floor(seconds);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' + secs : secs);
  };

  const loadSong = async (index, autoPlay = false) => {
    if (index < 0 || index >= songs.length) return;
    
    setCurrentIndex(index);
    const song = songs[index];
    setPlayerVisible(true);
    document.body.classList.add('player-active');

    const audio = audioRef.current;
    
    // Try to load audio (simplified - just use src)
    if (song.src) {
      audio.src = song.src;
    } else {
      audio.src = `/audio/${song.title}.mp3`;
    }

    if (autoPlay) {
      try {
        await audio.play();
      } catch (e) {
        console.log('Autoplay blocked');
      }
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (currentIndex < 0 && songs.length > 0) {
      loadSong(0, true);
      return;
    }
    
    if (audio.paused) {
      audio.play().catch(e => console.log('Play error:', e));
    } else {
      audio.pause();
    }
  };

  const nextSong = () => {
    if (songs.length === 0) return;
    const nextIndex = (currentIndex + 1) % songs.length;
    loadSong(nextIndex, true);
  };

  const prevSong = () => {
    if (songs.length === 0) return;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(prevIndex, true);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (audio.duration && isFinite(audio.duration)) {
      audio.currentTime = (e.target.value / 100) * audio.duration;
    }
  };

  const removeSong = (index) => {
    const song = songs[index];
    if (window.confirm(`Remove "${song.title}" from liked songs?`)) {
      let liked = getLikedSongs();
      liked = liked.filter(s => !(s.title === song.title && s.artist === song.artist));
      saveLikedSongs(liked);
      loadLikedSongs();
      
      if (currentIndex === index) {
        if (songs.length > 1) {
          const newIndex = index >= songs.length - 1 ? 0 : index;
          loadSong(newIndex, isPlaying);
        } else {
          audioRef.current.pause();
          setPlayerVisible(false);
          document.body.classList.remove('player-active');
        }
      }
    }
  };

  const currentSong = songs[currentIndex] || { title: 'Select a song', artist: '—', artwork: '/images/cat.png' };

  return (
    <div className="liked-page">
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
                <label className="chip" data-active="false">
                  <Link to="/playlist">Playlist</Link>
                </label>
                <label className="chip" data-active="true">
                  Liked
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
        <section className="liked-hero">
          <h1>
            <i className="fa-solid fa-heart" style={{ color: 'var(--accent)' }}></i>
            Liked Songs
          </h1>
          <p>All your favorite tracks in one place. {songs.length} songs you've loved and saved for easy access.</p>
          
          <div className="liked-controls">
            <button className="play-all-btn" onClick={() => songs.length > 0 && loadSong(0, true)}>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8 5v14l11-7z" />
              </svg>
              Play All
            </button>
            <button className="shuffle-btn" onClick={() => songs.length > 0 && loadSong(0, true)}>
              <i className="fa-solid fa-shuffle"></i>
              Shuffle
            </button>
          </div>
        </section>

        {/* Song List */}
        <section className="song-list">
          <div className="liked-filters">
            <div className="filter-group">
              <input type="radio" name="liked-filter" id="all-liked" defaultChecked />
              <label className="chip" htmlFor="all-liked">All Songs</label>
              
              <input type="radio" name="liked-filter" id="recent-liked" />
              <label className="chip" htmlFor="recent-liked">Recently Liked</label>
              
              <input type="radio" name="liked-filter" id="most-played" />
              <label className="chip" htmlFor="most-played">Most Played</label>
            </div>
          </div>
          
          {songs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <i className="fa-solid fa-heart-crack" style={{ fontSize: '64px', color: 'var(--accent)', opacity: 0.3, marginBottom: '20px' }}></i>
              <h2 style={{ margin: '0 0 10px' }}>No Liked Songs Yet</h2>
              <p style={{ opacity: 0.7, margin: '0 0 20px' }}>Start liking songs to see them here!</p>
              <Link to="/songs" className="btn btn-primary">Browse Songs</Link>
            </div>
          ) : (
            songs.map((song, index) => (
              <div
                key={index}
                className={`song-item ${currentIndex === index ? 'playing' : ''}`}
                onClick={() => currentIndex === index ? togglePlayPause() : loadSong(index, true)}
              >
                <div className="song-artwork">
                  <img src={song.artwork || '/images/cat.png'} alt={song.title} />
                  <button className="song-play-btn" onClick={(e) => { e.stopPropagation(); currentIndex === index ? togglePlayPause() : loadSong(index, true); }}>
                    {currentIndex === index && isPlaying ? (
                      <svg width="10" height="10" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M6 6h2v12H6zM16 6h2v12h-2z" />
                      </svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="song-info">
                  <div className="song-title">{song.title}</div>
                  <div className="song-artist">{song.artist}</div>
                </div>
                <div className="song-album">{song.album || '—'}</div>
                <div className="song-duration">—</div>
                <div className="song-actions">
                  <button className="action-btn liked" onClick={(e) => { e.stopPropagation(); removeSong(index); }}>
                    <i className="fa-solid fa-heart"></i>
                  </button>
                  <button className="action-btn" onClick={(e) => e.stopPropagation()}>
                    <i className="fa-solid fa-ellipsis"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Bottom Player */}
      {playerVisible && (
        <div className="bottom-player">
          <div className="bottom-player-inner">
            <div className="bottom-player-info">
              <div className="bottom-player-artwork">
                <img src={currentSong.artwork} alt="Current song" />
              </div>
              <div className="bottom-player-text">
                <div className="bottom-player-title">{currentSong.title}</div>
                <div className="bottom-player-artist">{currentSong.artist}</div>
              </div>
            </div>

            <div className="bottom-player-controls">
              <button className="player-control-btn" title="Shuffle">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M10.59 9.17L5.41 4L4 5.41l5.17 5.17l1.42-1.41M14.5 4l2.04 2.04L4 18.59L5.41 20l12.55-12.55L20 9.5V4h-5.5M14.83 13.41l-1.41 1.41l3.13 3.13L14.5 20H20v-5.5l-2.04 2.04l-3.13-3.13z" />
                </svg>
              </button>
              <button className="player-control-btn" onClick={prevSong}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 6h2v12H6zM20 6v12L9 12z" />
                </svg>
              </button>
              <button className="player-control-btn player-control-play" onClick={togglePlayPause}>
                {isPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M6 6h2v12H6zM16 6h2v12h-2z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button className="player-control-btn" onClick={nextSong}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M16 6h2v12h-2zM4 6v12l11-6z" />
                </svg>
              </button>
            </div>

            <div className="bottom-player-progress">
              <span className="progress-time">{formatTime(currentTime)}</span>
              <input
                type="range"
                className="progress-slider"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
              />
              <span className="progress-time">{formatTime(duration)}</span>
              
              <div className="player-actions">
                <button className="player-action-btn liked" title="Liked">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#ff4757" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
                <button className="player-action-btn" title="Remove from liked" onClick={() => currentIndex >= 0 && removeSong(currentIndex)}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z" />
                  </svg>
                </button>
              </div>
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
