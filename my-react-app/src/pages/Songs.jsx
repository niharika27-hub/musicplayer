import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Songs.css';

function Songs() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [logoSrc, setLogoSrc] = useState('./images/logolight.png');
  const [activeCategory, setActiveCategory] = useState('All Languages');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedSongs, setLikedSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  
  const audioRef = useRef(new Audio());

  // All songs data
  const allSongs = [
    // Recently Played
    { id: 1, title: 'Lag Jaa Gale', artist: 'Lata Mangeshkar', album: 'Remembering Lata Mangeshkar', duration: '4:15', artwork: './images/lataalbum.jpg', src: 'audio/lagjagale.mp3', category: 'Hindi', section: 'recently' },
    { id: 2, title: 'Pardesiya', artist: 'Sachin-Jigar, Sonu Nigam, Krishnakali', album: 'Param Sundari', duration: '3:28', artwork: './images/paramsundri.jpg', src: 'audio/pardesiya.mp3', category: 'Hindi', section: 'recently' },
    { id: 3, title: 'Saiyyan', artist: 'Kailash Kher', album: 'Best of Kailash Kher', duration: '6:22', artwork: './images/saiyyan.jpg', src: 'audio/saiyyan.mp3', category: 'Hindi', section: 'recently' },
    
    // Popular Songs
    { id: 4, title: 'For a Reason', artist: 'Karan Aujla', album: 'P-POP Culture', duration: '3:24', artwork: './images/popculture.jpg', src: 'audio/forareason.mp3', category: 'Punjabi', section: 'popular' },
    { id: 5, title: 'Die With A Smile', artist: 'Lady Gaga & Bruno Mars', album: 'Die With A Smile', duration: '4:11', artwork: './images/diewithasmile.jpg', src: 'audio/diewithasmile.mp3', category: 'English', section: 'popular' },
    { id: 6, title: 'Badtameez Dil', artist: 'Benny Dayal', album: 'Yeh Jawaani Hai Deewani', duration: '4:32', artwork: './images/yjhd.jpg', src: 'audio/badtameezdil.mp3', category: 'Hindi', section: 'popular' },
    { id: 7, title: 'Superstar', artist: 'DOX', album: 'One from the crowd', duration: '3:18', artwork: './images/one.jpg', src: 'audio/superstar.mp3', category: 'English', section: 'popular' },
    { id: 8, title: 'Perfect', artist: 'Ed Sheeran', album: '÷ (Divide)', duration: '4:23', artwork: './images/perfect.jpg', src: 'audio/perfect.mp3', category: 'English', section: 'popular' },
    
    // Punjabi Songs
    { id: 9, title: 'Ishq Jeha Ho Gya', artist: 'Arjan Dhillon', album: 'A for Arjan2', duration: '3:45', artwork: './images/Aforarjan2.jpg', src: 'audio/ishqjehahogya.mp3', category: 'Punjabi', section: 'punjabi' },
    { id: 10, title: 'Timeless', artist: 'Hustinder', album: 'Timeless', duration: '4:02', artwork: './images/timeless.jpg', src: 'audio/timeless.mp3', category: 'Punjabi', section: 'punjabi' },
    { id: 11, title: 'By Any Means', artist: 'Sukha', album: 'By any means', duration: '3:56', artwork: './images/byanymeans.jpg', src: 'audio/byanymeans.mp3', category: 'Punjabi', section: 'punjabi' },
    
    // Hindi Songs
    { id: 12, title: 'Tum Se Hi', artist: 'Mohit Chauhan', album: 'Jab We Met', duration: '5:12', artwork: './images/jabwemet2.jpg', src: 'audio/tumsehi.mp3', category: 'Hindi', section: 'hindi' },
    { id: 13, title: 'Kun Faya Kun', artist: 'A.R. Rahman', album: 'Rockstar', duration: '7:08', artwork: './images/rockstar.jpg', src: 'audio/kunfayakun.mp3', category: 'Hindi', section: 'hindi' },
  ];

  useEffect(() => {
    setFilteredSongs(allSongs);
    
    // Load liked songs from localStorage
    const liked = localStorage.getItem('catifyy_liked_songs');
    if (liked) {
      setLikedSongs(JSON.parse(liked));
    }

    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      setLogoSrc('./images/logodark.png');
      document.documentElement.style.setProperty('--bg', '#1a1d2e');
      document.documentElement.style.setProperty('--surface', '#22283a');
      document.documentElement.style.setProperty('--text', '#e8eaf6');
      document.documentElement.style.setProperty('--shadow-dark', '#0d0f1a');
      document.documentElement.style.setProperty('--shadow-light', '#282e44');
    }
  }, []);

  // Filter songs by category and search
  useEffect(() => {
    let filtered = allSongs;
    
    // Filter by category
    if (activeCategory !== 'All Languages') {
      filtered = filtered.filter(song => song.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(song => 
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.album.toLowerCase().includes(query)
      );
    }
    
    setFilteredSongs(filtered);
  }, [activeCategory, searchQuery]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  const loadTrack = (song) => {
    const audio = audioRef.current;
    audio.src = song.src;
    audio.load();
    setCurrentTrack(song);
  };

  const togglePlay = (song) => {
    const audio = audioRef.current;

    if (currentTrack?.id === song.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      loadTrack(song);
      audio.play();
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (!currentTrack) return;
    const currentIndex = filteredSongs.findIndex(s => s.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    const nextSong = filteredSongs[nextIndex];
    loadTrack(nextSong);
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!currentTrack) return;
    const currentIndex = filteredSongs.findIndex(s => s.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    const prevSong = filteredSongs[prevIndex];
    loadTrack(prevSong);
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const value = e.target.value;
    audio.currentTime = (value / 100) * duration;
    setCurrentTime(audio.currentTime);
  };

  const handleLike = () => {
    if (!currentTrack) return;
    
    let updated = [...likedSongs];
    const index = updated.findIndex(s => s.id === currentTrack.id);
    
    if (index >= 0) {
      updated.splice(index, 1);
    } else {
      updated.push(currentTrack);
    }
    
    setLikedSongs(updated);
    localStorage.setItem('catifyy_liked_songs', JSON.stringify(updated));
  };

  const handleRemove = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);

    if (newTheme) {
      setLogoSrc('./images/logodark.png');
      document.documentElement.style.setProperty('--bg', '#1a1d2e');
      document.documentElement.style.setProperty('--surface', '#22283a');
      document.documentElement.style.setProperty('--text', '#e8eaf6');
      document.documentElement.style.setProperty('--shadow-dark', '#0d0f1a');
      document.documentElement.style.setProperty('--shadow-light', '#282e44');
      localStorage.setItem('theme', 'dark');
    } else {
      setLogoSrc('./images/logolight.png');
      document.documentElement.style.setProperty('--bg', '#eaf1ff');
      document.documentElement.style.setProperty('--surface', '#f6f8ff');
      document.documentElement.style.setProperty('--text', '#2d3348');
      document.documentElement.style.setProperty('--shadow-dark', '#ccd6ec');
      document.documentElement.style.setProperty('--shadow-light', '#ffffff');
      localStorage.setItem('theme', 'light');
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isLiked = (song) => {
    return likedSongs.some(s => s.id === song.id);
  };

  const categories = ['All Languages', 'Punjabi', 'Hindi', 'English', 'Haryanvi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati'];

  const recentlyPlayed = filteredSongs.filter(s => s.section === 'recently');
  const popularSongs = filteredSongs.filter(s => s.section === 'popular');
  const punjabiSongs = filteredSongs.filter(s => s.section === 'punjabi');
  const hindiSongs = filteredSongs.filter(s => s.section === 'hindi');

  return (
    <div className="songs-page">
      {/* Navigation */}
      <header className="nav">
        <div className="container nav-inner">
          <div className="brand">
            <img id="logo-img" src={logoSrc} height="100" width="120" alt="Catifyy Logo" />
          </div>

          <div className="search-wrap">
            <div className="search">
              <i className="fa-solid fa-circle fa-xs"></i>
              <input 
                type="text" 
                placeholder="Search songs, artists, albums..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filters">
              <div className="filter-group">
                <label className="chip" data-active="true">Songs</label>
                <label className="chip" data-active="false">
                  <Link to="/albums">Albums</Link>
                </label>
                <label className="chip" data-active="false">
                  <Link to="/library">Library</Link>
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
            <Link to="/" title="Home"><i className="fa-solid fa-house-user"></i></Link>
            <Link to="/create" title="Create Playlist">
              <i className="fa-solid fa-plus"></i>
            </Link>
            <button onClick={toggleTheme} className="nav-toggle" title="Toggle theme">
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
        <section className="songs-hero">
          <h1>Discover Songs</h1>
          <p>Explore millions of songs from different languages and genres. Find your next favorite track from our vast music library.</p>
          
          <div className="category-filters">
            {categories.map(category => (
              <div 
                key={category}
                className={`category-chip ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </div>
            ))}
          </div>
        </section>

        {/* Recently Played */}
        {recentlyPlayed.length > 0 && (
          <section className="section">
            <h2>Recently Played</h2>
            <div className="song-list">
              {recentlyPlayed.map((song, index) => (
                <div 
                  key={song.id} 
                  className={`song-item ${currentTrack?.id === song.id ? 'playing' : ''}`}
                  onClick={() => togglePlay(song)}
                >
                  <div className="song-number">{index + 1}</div>
                  <div className="song-artwork">
                    <img src={song.artwork} alt={song.title} />
                  </div>
                  <div className="song-info">
                    <div className="song-title">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                  </div>
                  <div className="song-album">{song.album}</div>
                  <div className="song-duration">{song.duration}</div>
                  <button className="song-play-btn" onClick={(e) => { e.stopPropagation(); togglePlay(song); }}>
                    {currentTrack?.id === song.id && isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M6 6h2v12H6zM16 6h2v12h-2z"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Songs */}
        {popularSongs.length > 0 && (
          <section className="section">
            <h2>Popular Songs</h2>
            <div className="song-list">
              {popularSongs.map((song, index) => (
                <div 
                  key={song.id} 
                  className={`song-item ${currentTrack?.id === song.id ? 'playing' : ''}`}
                  onClick={() => togglePlay(song)}
                >
                  <div className="song-number">{index + 1}</div>
                  <div className="song-artwork">
                    <img src={song.artwork} alt={song.title} />
                  </div>
                  <div className="song-info">
                    <div className="song-title">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                  </div>
                  <div className="song-album">{song.album}</div>
                  <div className="song-duration">{song.duration}</div>
                  <button className="song-play-btn" onClick={(e) => { e.stopPropagation(); togglePlay(song); }}>
                    {currentTrack?.id === song.id && isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M6 6h2v12H6zM16 6h2v12h-2z"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Punjabi Songs */}
        {punjabiSongs.length > 0 && (
          <section className="section">
            <h2>Punjabi Songs</h2>
            <div className="song-list">
              {punjabiSongs.map((song, index) => (
                <div 
                  key={song.id} 
                  className={`song-item ${currentTrack?.id === song.id ? 'playing' : ''}`}
                  onClick={() => togglePlay(song)}
                >
                  <div className="song-number">{index + 1}</div>
                  <div className="song-artwork">
                    <img src={song.artwork} alt={song.title} />
                  </div>
                  <div className="song-info">
                    <div className="song-title">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                  </div>
                  <div className="song-album">{song.album}</div>
                  <div className="song-duration">{song.duration}</div>
                  <button className="song-play-btn" onClick={(e) => { e.stopPropagation(); togglePlay(song); }}>
                    {currentTrack?.id === song.id && isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M6 6h2v12H6zM16 6h2v12h-2z"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hindi Songs */}
        {hindiSongs.length > 0 && (
          <section className="section">
            <h2>Hindi Songs</h2>
            <div className="song-list">
              {hindiSongs.map((song, index) => (
                <div 
                  key={song.id} 
                  className={`song-item ${currentTrack?.id === song.id ? 'playing' : ''}`}
                  onClick={() => togglePlay(song)}
                >
                  <div className="song-number">{index + 1}</div>
                  <div className="song-artwork">
                    <img src={song.artwork} alt={song.title} />
                  </div>
                  <div className="song-info">
                    <div className="song-title">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                  </div>
                  <div className="song-album">{song.album}</div>
                  <div className="song-duration">{song.duration}</div>
                  <button className="song-play-btn" onClick={(e) => { e.stopPropagation(); togglePlay(song); }}>
                    {currentTrack?.id === song.id && isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M6 6h2v12H6zM16 6h2v12h-2z"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {filteredSongs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
            No songs found matching your criteria.
          </div>
        )}
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
          <div className="social">
            <a href="#" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h3l5 7l5-7h3l-7.5 10L20 20h-3l-5-7l-5 7H4l7.5-10z"/></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 2.2A2.8 2.8 0 1 0 14.8 12A2.8 2.8 0 0 0 12 9.2M18 6.5a1 1 0 1 1-1 1a1 1 0 0 1 1-1"/></svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M10 15V9l5 3m8-6.5v9A3.5 3.5 0 0 1 19.5 18h-15A3.5 3.5 0 0 1 1 14.5v-9A3.5 3.5 0 0 1 4.5 2h15A3.5 3.5 0 0 1 23 5.5"/></svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Bottom Player */}
      {currentTrack && (
        <div className="bottom-player">
          <div className="bottom-player-inner">
            <div className="bottom-player-info">
              <div className="bottom-player-artwork">
                <img src={currentTrack.artwork} alt={currentTrack.title} />
              </div>
              <div className="bottom-player-text">
                <div className="bottom-player-title">{currentTrack.title}</div>
                <div className="bottom-player-artist">{currentTrack.artist}</div>
              </div>
            </div>

            <div className="bottom-player-controls">
              <button className="player-control-btn" onClick={handlePrev}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6 6h2v12H6zM20 6v12L9 12z"/>
                </svg>
              </button>
              <button className="player-control-btn player-control-play" onClick={handlePlayPause}>
                {isPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M6 6h2v12H6zM16 6h2v12h-2z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              <button className="player-control-btn" onClick={handleNext}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M16 6h2v12h-2zM4 6v12l11-6z"/>
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
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
              />
              <span className="progress-time">{formatTime(duration)}</span>
              
              <div className="player-actions">
                <button className={`player-action-btn ${isLiked(currentTrack) ? 'liked' : ''}`} onClick={handleLike}>
                  {isLiked(currentTrack) ? (
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#ff4757" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    </svg>
                  )}
                </button>
                <button className="player-action-btn" onClick={handleRemove}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Songs;
