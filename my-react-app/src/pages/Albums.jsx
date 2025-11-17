import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Albums.css';

function Albums() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [logoSrc, setLogoSrc] = useState('./images/logolight.png');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentSongs, setCurrentSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [likedSongs, setLikedSongs] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);
  
  const audioRef = useRef(new Audio());

  // Album database
  const albumDatabase = {
    'P-POP Culture': {
      artist: 'Karan Aujla',
      cover: './images/popculture.jpg',
      songs: [
        { title: 'Softly', artist: 'Karan Aujla', artwork: './images/softly.jpg', src: 'audio/softly.mp3' },
        { title: 'For a Reason', artist: 'Karan Aujla', artwork: './images/forareason.png', src: 'audio/forareason.mp3' },
        { title: 'Tauba Tauba', artist: 'Karan Aujla', artwork: './images/popculture.jpg', src: 'audio/tauba.mp3' },
        { title: 'Winning Speech', artist: 'Karan Aujla', artwork: './images/popculture.jpg', src: 'audio/winning.mp3' }
      ]
    },
    'Yeh Jawaani Hai Deewani': {
      artist: 'Pritam',
      cover: './images/yjhd.jpg',
      songs: [
        { title: 'Badtameez Dil', artist: 'Benny Dayal', artwork: './images/yjhd.jpg', src: 'audio/badtameezdil.mp3' },
        { title: 'Kabira', artist: 'Tochi Raina', artwork: './images/yjhd.jpg', src: 'audio/kabira.mp3' },
        { title: 'Balam Pichkari', artist: 'Shalmali Kholgade', artwork: './images/yjhd.jpg', src: 'audio/balam.mp3' },
        { title: 'Ilahi', artist: 'Arijit Singh', artwork: './images/yjhd.jpg', src: 'audio/ilahi.mp3' }
      ]
    },
    'Die With A Smile': {
      artist: 'Lady Gaga & Bruno Mars',
      cover: './images/diewithasmile.jpg',
      songs: [
        { title: 'Die With a Smile', artist: 'Lady Gaga, Bruno Mars', artwork: './images/diewithasmile.jpg', src: 'audio/diewithasmile.mp3' }
      ]
    },
    'One from the crowd': {
      artist: 'DOX',
      cover: './images/one.jpg',
      songs: [
        { title: 'Superstar', artist: 'DOX', artwork: './images/one.jpg', src: 'audio/superstar.mp3' },
        { title: 'Saiyyan', artist: 'Kailash Kher', artwork: './images/saiyyan.jpg', src: 'audio/saiyyan.mp3' }
      ]
    },
    'Timeless': {
      artist: 'Hustinder',
      cover: './images/timeless.jpg',
      songs: [
        { title: 'Timeless', artist: 'Hustinder', artwork: './images/timeless.jpg', src: 'audio/timeless.mp3' },
        { title: 'By Any Means', artist: 'Sukha', artwork: './images/byanymeans.jpg', src: 'audio/byanymeans.mp3' }
      ]
    }
  };

  const albums = [
    // Popular Albums
    { name: 'P-POP Culture', artist: 'Karan Aujla', cover: './images/popculture.jpg', section: 'popular' },
    { name: 'One from the crowd', artist: 'DOX', cover: './images/one.jpg', section: 'popular' },
    { name: 'Yeh Jawaani Hai Deewani', artist: 'Pritam', cover: './images/yjhd.jpg', section: 'popular' },
    { name: 'Die With A Smile', artist: 'Lady Gaga & Bruno Mars', cover: './images/diewithasmile.jpg', section: 'popular' },
    
    // Punjabi Albums
    { name: 'P-POP Culture', artist: 'Karan Aujla', cover: './images/forareason.png', section: 'punjabi' },
    { name: 'A for Arjan2', artist: 'Arjan Dhillon', cover: './images/Aforarjan2.jpg', section: 'punjabi' },
    { name: 'Timeless', artist: 'Hustinder', cover: './images/timeless.jpg', section: 'punjabi' },
    { name: 'One from the crowd', artist: 'DOX', cover: './images/one.jpg', section: 'punjabi' },
    { name: 'By any means', artist: 'Sukha', cover: './images/byanymeans.jpg', section: 'punjabi' },
    
    // Hindi Albums
    { name: 'Yeh Jawaani Hai Deewani', artist: 'Pritam', cover: './images/yjhd.jpg', section: 'hindi' },
    { name: 'Jab We Met', artist: 'Pritam', cover: './images/jabwemet2.jpg', section: 'hindi' },
    { name: 'Mismatched', artist: 'Anurag Saikia', cover: './images/mis.jpg', section: 'hindi' },
    { name: 'Rockstar', artist: 'A.R. Rahman', cover: './images/rockstar.jpg', section: 'hindi' },
    { name: 'Chaava', artist: 'A.R. Rahman', cover: './images/chaava.jpg', section: 'hindi' },
    
    // English Albums
    { name: 'Die With A Smile', artist: 'Lady Gaga & Bruno Mars', cover: './images/diewithasmile.jpg', section: 'english' },
    { name: 'Play', artist: 'Ed Sheeran', cover: './images/play.png', section: 'english' },
    { name: 'Futique', artist: 'Biffy Clyro', cover: './images/Futique.jpg', section: 'english' },
    { name: 'Pulp', artist: 'More', cover: './images/pulp.jpg', section: 'english' },
    
    // You may also like
    { name: "90's Hits", artist: 'Kumar Sanu, Udit Narayan, Sonu Nigam', cover: './images/roop.jpg', section: 'recommended' },
    { name: 'Bollywood Hits', artist: 'Arijit Singh, Sonu Nigam, Shreya Ghoshal', cover: './images/palpaldilkepas.jpg', section: 'recommended' },
    { name: 'Remembering Lata Mangeshkar', artist: 'Lata Mangeshkar', cover: './images/lataalbum.jpg', section: 'recommended' },
    { name: 'Party', artist: 'Badshah, Neha Kakkar, Amar Arshi', cover: './images/paramsundri.jpg', section: 'recommended' },
    { name: 'Ruhnai ke geet', artist: 'Kailash Kher, Nusrat Fateh Ali Khan', cover: './images/lotus.jpg', section: 'recommended' }
  ];

  useEffect(() => {
    // Load liked songs
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

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex, currentSongs]);

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

  const handleAlbumClick = (albumName) => {
    const albumData = albumDatabase[albumName];
    
    if (albumData) {
      setCurrentAlbum(albumName);
      setCurrentSongs(albumData.songs);
      setCurrentSongIndex(0);
      setShowModal(true);
      playSong(0, albumData.songs);
    } else {
      alert(`Album "${albumName}" is not available yet. Try P-POP Culture, YJHD, or Timeless!`);
    }
  };

  const playSong = (index, songs = currentSongs) => {
    if (index < 0 || index >= songs.length) return;
    
    setCurrentSongIndex(index);
    const song = songs[index];
    const audio = audioRef.current;
    
    audio.src = song.src;
    audio.load();
    audio.play();
    setIsPlaying(true);
    setShowPlayer(true);
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

  const playNext = () => {
    if (currentSongIndex < currentSongs.length - 1) {
      playSong(currentSongIndex + 1);
    } else {
      playSong(0);
    }
  };

  const playPrev = () => {
    if (currentSongIndex > 0) {
      playSong(currentSongIndex - 1);
    } else {
      playSong(currentSongs.length - 1);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    audio.currentTime = e.target.value;
    setCurrentTime(audio.currentTime);
  };

  const handleLike = () => {
    if (!currentSongs.length) return;
    
    const song = currentSongs[currentSongIndex];
    let liked = [...likedSongs];
    const index = liked.findIndex(s => s.title === song.title && s.artist === song.artist);
    
    if (index >= 0) {
      liked.splice(index, 1);
    } else {
      liked.push(song);
    }
    
    setLikedSongs(liked);
    localStorage.setItem('catifyy_liked_songs', JSON.stringify(liked));
  };

  const handleStop = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setShowPlayer(false);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isLiked = (song) => {
    return likedSongs.some(s => s.title === song.title && s.artist === song.artist);
  };

  const popularAlbums = albums.filter(a => a.section === 'popular');
  const punjabiAlbums = albums.filter(a => a.section === 'punjabi');
  const hindiAlbums = albums.filter(a => a.section === 'hindi');
  const englishAlbums = albums.filter(a => a.section === 'english');
  const recommendedAlbums = albums.filter(a => a.section === 'recommended');

  return (
    <div className="albums-page">
      {/* Navigation */}
      <header className="nav">
        <div className="container nav-inner">
          <div className="brand">
            <img src={logoSrc} height="100" width="120" alt="Catifyy Logo" />
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
                <label className="chip" data-active="false">
                  <Link to="/songs">Songs</Link>
                </label>
                <label className="chip" data-active="true">Albums</label>
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
        {/* Popular Albums */}
        <section className="section">
          <h2>🔥 Popular Albums</h2>
          <div className="album-grid">
            {popularAlbums.map((album, index) => (
              <article 
                key={`popular-${index}`} 
                className={`album-card ${currentAlbum === album.name ? 'playing' : ''}`}
                onClick={() => handleAlbumClick(album.name)}
              >
                <div className="cover">
                  <img src={album.cover} alt={album.name} />
                  <div className="play-overlay">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#fff" d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <strong>{album.name}</strong>
                <div className="muted">{album.artist}</div>
              </article>
            ))}
          </div>
        </section>

        {/* Punjabi Albums */}
        <section className="section">
          <h2>🎵 Punjabi Albums</h2>
          <div className="album-grid">
            {punjabiAlbums.map((album, index) => (
              <article 
                key={`punjabi-${index}`} 
                className={`album-card ${currentAlbum === album.name ? 'playing' : ''}`}
                onClick={() => handleAlbumClick(album.name)}
              >
                <div className="cover">
                  <img src={album.cover} alt={album.name} />
                  <div className="play-overlay">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#fff" d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <strong>{album.name}</strong>
                <div className="muted">{album.artist}</div>
              </article>
            ))}
          </div>
        </section>

        {/* Hindi Albums */}
        <section className="section">
          <h2>🎼 Hindi Albums</h2>
          <div className="album-grid">
            {hindiAlbums.map((album, index) => (
              <article 
                key={`hindi-${index}`} 
                className={`album-card ${currentAlbum === album.name ? 'playing' : ''}`}
                onClick={() => handleAlbumClick(album.name)}
              >
                <div className="cover">
                  <img src={album.cover} alt={album.name} />
                  <div className="play-overlay">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#fff" d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <strong>{album.name}</strong>
                <div className="muted">{album.artist}</div>
              </article>
            ))}
          </div>
        </section>

        {/* English Albums */}
        <section className="section">
          <h2>🎸 English Albums</h2>
          <div className="album-grid">
            {englishAlbums.map((album, index) => (
              <article 
                key={`english-${index}`} 
                className={`album-card ${currentAlbum === album.name ? 'playing' : ''}`}
                onClick={() => handleAlbumClick(album.name)}
              >
                <div className="cover">
                  <img src={album.cover} alt={album.name} />
                  <div className="play-overlay">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#fff" d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <strong>{album.name}</strong>
                <div className="muted">{album.artist}</div>
              </article>
            ))}
          </div>
        </section>

        {/* Recommended */}
        <section className="section">
          <h2>You may also like...</h2>
          <div className="album-grid">
            {recommendedAlbums.map((album, index) => (
              <article 
                key={`recommended-${index}`} 
                className={`album-card ${currentAlbum === album.name ? 'playing' : ''}`}
                onClick={() => handleAlbumClick(album.name)}
              >
                <div className="cover">
                  <img src={album.cover} alt={album.name} />
                  <div className="play-overlay">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#fff" d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <strong>{album.name}</strong>
                <div className="muted">{album.artist}</div>
              </article>
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

      {/* Album Modal */}
      {showModal && (
        <div className="album-modal" onClick={() => setShowModal(false)}>
          <div className="album-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="album-modal-header">
              <h2>{currentAlbum}</h2>
              <button className="btn" onClick={() => setShowModal(false)} style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="album-songs-list">
              {currentSongs.map((song, index) => (
                <div 
                  key={index} 
                  className={`album-song-item ${index === currentSongIndex ? 'playing' : ''}`}
                  onClick={() => playSong(index)}
                >
                  <div className="album-song-number">{index + 1}</div>
                  <div className="album-song-info">
                    <p className="album-song-title">{song.title}</p>
                    <p className="album-song-artist">{song.artist}</p>
                  </div>
                  <button className="album-song-play-btn" onClick={(e) => { e.stopPropagation(); playSong(index); }}>
                    <i className="fa-solid fa-play"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Player */}
      {showPlayer && currentSongs.length > 0 && (
        <div className="bottom-player active">
          <div className="player-left">
            <img src={currentSongs[currentSongIndex]?.artwork} alt="Now Playing" className="player-artwork" />
            <div className="player-track-info">
              <div className="player-title">{currentSongs[currentSongIndex]?.title}</div>
              <div className="player-artist">{currentSongs[currentSongIndex]?.artist}</div>
            </div>
          </div>

          <div className="player-center">
            <div className="player-controls">
              <button className="control-btn" onClick={playPrev}>
                <i className="fa-solid fa-backward-step"></i>
              </button>
              <button className="control-btn control-btn-main" onClick={handlePlayPause}>
                {isPlaying ? (
                  <i className="fa-solid fa-pause"></i>
                ) : (
                  <i className="fa-solid fa-play"></i>
                )}
              </button>
              <button className="control-btn" onClick={playNext}>
                <i className="fa-solid fa-forward-step"></i>
              </button>
            </div>
            <div className="player-progress">
              <span className="time">{formatTime(currentTime)}</span>
              <input 
                type="range" 
                className="progress-slider" 
                min="0" 
                max={duration || 100} 
                value={currentTime}
                onChange={handleSeek}
              />
              <span className="time">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="player-right">
            <button className="player-action-btn" onClick={handleLike}>
              {isLiked(currentSongs[currentSongIndex]) ? (
                <i className="fa-solid fa-heart" style={{ color: 'var(--accent)' }}></i>
              ) : (
                <i className="fa-regular fa-heart"></i>
              )}
            </button>
            <button className="player-action-btn" onClick={handleStop}>
              <i className="fa-solid fa-stop"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Albums;
