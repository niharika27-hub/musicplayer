import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [usingAudio, setUsingAudio] = useState(false);
  const [albumCover, setAlbumCover] = useState('./images/jabwemet2.jpg');
  const [trackTitle, setTrackTitle] = useState('Tum se hi');
  const [trackArtist, setTrackArtist] = useState('Pritam');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [logoSrc, setLogoSrc] = useState('./images/logolight.png');
  
  const audioRef = useRef(null);
  const simulatedTimerRef = useRef(null);
  const simCurrentTimeRef = useRef(0);
  const simDurationRef = useRef(0);

  const tracks = [
    { title: 'Die with a Smile', artist: 'Lady Gaga', cover: './images/diewithasmile.jpg', src: 'audio/diewithasmile.mp3', type: 'card' },
    { title: 'Gul', artist: 'Anuv Jain', cover: './images/gul.jpg', src: 'audio/gul.mp3', type: 'card' },
    { title: 'Alag Asman', artist: 'Anuv Jain', cover: './images/alagasman.jpg', src: 'audio/alagasman.mp3', type: 'card' },
    { title: 'For a Reason', artist: 'Karan Aujla', cover: './images/forareason.png', src: 'audio/forareason.mp3', type: 'card' },
    { title: 'P-POP CULTURE', artist: 'Karan Aujla', cover: './images/forareason.png', src: 'audio/forareason.mp3', type: 'album' },
    { title: 'JO Tum Mere Ho', artist: 'Anuv Jain', cover: './images/jotum.jpg', src: 'audio/jotum.mp3', type: 'album' },
    { title: 'Mismatched', artist: 'Anurag Saikia', cover: './images/mis.jpg', src: 'audio/mismatched.mp3', type: 'album' },
    { title: 'Yeh Jawaani hai Deewani', artist: 'Pritam', cover: './images/yjhd.jpg', src: 'audio/yjhd.mp3', type: 'album' },
    { title: 'Gul', artist: 'Anuv jain', cover: './images/gul.jpg', type: 'row' },
    { title: 'Perfect', artist: 'Ed Sheeran', cover: './images/perfect.jpg', type: 'row' }
  ];

  const formatTime = (seconds) => {
    seconds = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const stopSimulated = () => {
    if (simulatedTimerRef.current) {
      clearInterval(simulatedTimerRef.current);
      simulatedTimerRef.current = null;
    }
  };

  const startSimulated = (resetTime = false) => {
    setUsingAudio(false);
    stopSimulated();
    
    if (resetTime || !simDurationRef.current) {
      simDurationRef.current = 180 + (currentTrack % 5) * 30;
      simCurrentTimeRef.current = 0;
    }
    
    setIsPlaying(true);
    simulatedTimerRef.current = setInterval(() => {
      simCurrentTimeRef.current += 1;
      setCurrentTime(simCurrentTimeRef.current);
      
      if (simCurrentTimeRef.current >= simDurationRef.current) {
        nextTrack();
      }
    }, 1000);
  };

  const pauseSimulated = () => {
    stopSimulated();
    setIsPlaying(false);
  };

  const tryLoadAudioCandidates = async (candidates) => {
    const audio = audioRef.current;
    if (!audio) return null;

    for (const candidate of candidates) {
      try {
        audio.src = candidate;
        const ok = await new Promise((resolve) => {
          let done = false;
          
          const cleanup = () => {
            audio.removeEventListener('loadedmetadata', onLoad);
            audio.removeEventListener('error', onError);
          };
          
          const onLoad = () => {
            if (done) return;
            done = true;
            cleanup();
            resolve(true);
          };
          
          const onError = () => {
            if (done) return;
            done = true;
            cleanup();
            resolve(false);
          };
          
          audio.addEventListener('loadedmetadata', onLoad);
          audio.addEventListener('error', onError);
          
          try {
            audio.load();
          } catch (e) {
            onError();
          }
          
          setTimeout(() => {
            if (done) return;
            done = true;
            cleanup();
            resolve(false);
          }, 1500);
        });
        
        if (ok) return candidate;
      } catch (e) {
        // Continue to next candidate
      }
    }
    return null;
  };

  const loadTrack = async (index, autoPlay = false) => {
    if (index < 0) index = tracks.length - 1;
    const newIndex = index % tracks.length;
    setCurrentTrack(newIndex);
    
    const track = tracks[newIndex];
    setAlbumCover(track.cover || './images/jabwemet2.jpg');
    setTrackTitle(track.title || 'Unknown');
    setTrackArtist(track.artist || '');

    const candidates = [];
    
    // Try API search first (if available)
    if (typeof window.MusicAPI !== 'undefined') {
      try {
        const api = new window.MusicAPI();
        const result = await api.searchSong(track.title, track.artist);
        
        if (result && result.preview_url) {
          candidates.push(result.preview_url);
          
          if (result.album_cover) {
            setAlbumCover(result.album_cover);
          }
        }
      } catch (e) {
        console.log('API search failed:', e.message);
      }
    }
    
    // Add local file candidates
    if (track.src) candidates.push(track.src);
    
    if (track.cover) {
      const cover = track.cover.split('?')[0].split('#')[0];
      const match = cover.match(/(^.*\/)?([^\/]+?)\.(jpg|jpeg|png|webp|avif)$/i);
      if (match) {
        const dir = match[1] || '';
        const name = match[2];
        candidates.push(`${dir}${name}.mp3`);
        candidates.push(`${dir}${name}.m4a`);
        candidates.push(`${dir}${name}.wav`);
        candidates.push(`audio/${name}.mp3`);
        candidates.push(`songs/${name}.mp3`);
      }
    }

    const audio = audioRef.current;
    if (!audio) return;

    const found = await tryLoadAudioCandidates(candidates);
    
    if (found) {
      setUsingAudio(true);
      audio.src = found;
      
      if (autoPlay) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (e) {
          console.log('Autoplay blocked');
        }
      }
    } else {
      setUsingAudio(false);
      try {
        audio.pause();
      } catch (e) {}
      startSimulated(true);
    }
  };

  const play = async () => {
    if (usingAudio && audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (e) {
        console.log('Play failed');
      }
    } else {
      startSimulated(false);
    }
  };

  const pause = () => {
    if (usingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      pauseSimulated();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const nextTrack = () => {
    loadTrack((currentTrack + 1) % tracks.length, true);
  };

  const prevTrack = () => {
    loadTrack((currentTrack - 1 + tracks.length) % tracks.length, true);
  };

  const handleSeek = (e) => {
    const value = Number(e.target.value);
    if (usingAudio && audioRef.current && isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
      setCurrentTime(audioRef.current.currentTime);
    } else {
      simCurrentTimeRef.current = Math.round((value / 100) * (simDurationRef.current || 1));
      setCurrentTime(simCurrentTimeRef.current);
    }
  };

  const handleCardClick = (index) => {
    loadTrack(index, true);
  };

  const handleRowPlayClick = (index, e) => {
    e.stopPropagation();
    if (index === currentTrack) {
      togglePlay();
    } else {
      loadTrack(index, true);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchValue = e.target.q.value;
    if (searchValue) {
      alert(`Searching for: ${searchValue}`);
      // In a real app, you would navigate to search results or filter tracks
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    const root = document.documentElement;
    
    if (!isDarkTheme) {
      // Dark theme
      root.style.setProperty('--bg', '#1a1d2e');
      root.style.setProperty('--surface', '#22283a');
      root.style.setProperty('--text', '#e4e8f0');
      root.style.setProperty('--shadow-dark', '#0f1219');
      root.style.setProperty('--shadow-light', '#2d3548');
      setLogoSrc('./images/logodark.png'); // Change to dark logo
    } else {
      // Light theme (default)
      root.style.setProperty('--bg', '#eaf1ff');
      root.style.setProperty('--surface', '#f6f8ff');
      root.style.setProperty('--text', '#2d3348');
      root.style.setProperty('--shadow-dark', '#ccd6ec');
      root.style.setProperty('--shadow-light', '#ffffff');
      setLogoSrc('./images/logolight.png'); // Change to light logo
    }
  };

  const handleNavClick = (page, e) => {
    e.preventDefault();
    alert(`Navigation to ${page} - In a full app, this would route to the ${page} page`);
    // In a real app with React Router, you would use: navigate(`/${page}`)
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      if (usingAudio) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => nextTrack();
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [usingAudio, currentTrack]);

  useEffect(() => {
    // Initialize first track
    loadTrack(0, false);

    // Keyboard space toggle
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && 
          document.activeElement.tagName.toLowerCase() !== 'input' && 
          document.activeElement.tagName.toLowerCase() !== 'textarea') {
        e.preventDefault();
        togglePlay();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      stopSimulated();
    };
  }, []);

  useEffect(() => {
    if (!usingAudio) {
      setDuration(simDurationRef.current);
    }
  }, [usingAudio]);

  const progress = duration ? Math.round((currentTime / duration) * 100) : 0;

  return (
    <>
      <audio ref={audioRef} preload="metadata" />

      {/* Navigation Bar */}
      <header className="nav">
        <div className="container nav-inner">
          {/* Logo */}
          <div className="brand">
            <img id="logo-img" src={logoSrc} height="100" width="120" alt="Catifyy Logo" />
          </div>

          {/* Search */}
          <div className="search-wrap">
            <form className="search" method="post" onSubmit={handleSearchSubmit}>
              <i className="fa-solid fa-circle fa-xs" style={{color: '#000000'}}></i>
              <input id="q" name="q" placeholder="Search songs, artists, albums..." />
            </form>

            {/* Buttons on nav bar */}
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
                
                <label className="chip" data-active="false">
                  <Link to="/liked">Liked</Link>
                </label>
              </div>
            </div>
          </div>

          <nav className="nav-links">
            <Link to="/" title="Home"><i className="fa-solid fa-house-user"></i></Link>
            <Link to="/create" title="Create Playlist"><i className="fa-solid fa-plus"></i></Link>

            {/* Theme toggle button */}
            <button 
              id="theme-toggle" 
              className="nav-toggle" 
              title="Toggle theme" 
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              <i id="theme-icon" className={`fa-solid ${isDarkTheme ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            <Link to="/login" title="Login"><i className="fa-solid fa-user"></i></Link>
          </nav>
        </div>
      </header>

      <main className="container stack-32">
        <section className="hero">
          <div className="player neu">
            <div className="player-main">
              <div className="album">
                <img src={albumCover} alt="Album art" />
              </div>
              <div className="title">{trackTitle}</div>
              <div className="subtitle">{trackArtist}</div>

              <div className="controls">
                <button className="icon-btn" onClick={prevTrack}>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M6 6h2v12H6zM20 6v12L9 12z"/>
                  </svg>
                </button>
                <button className="play" onClick={togglePlay}>
                  {isPlaying ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M6 6h2v12H6zM16 6h2v12h-2z"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
                <button className="icon-btn" onClick={nextTrack}>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M16 6h2v12h-2zM4 6v12l11-6z"/>
                  </svg>
                </button>
              </div>

              <div className="progress-wrap">
                <div className="time">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={progress} 
                  onChange={handleSeek}
                />
              </div>
            </div>
          </div>

          <aside className="stack-24">
            <div className="section neu" style={{padding: '20px'}}>
              <h2>Playing Now</h2>
              <div className="list">
                <div 
                  className={`row ${currentTrack === 8 && isPlaying ? 'playing' : ''}`}
                  style={{cursor: 'pointer'}}
                  onClick={() => handleCardClick(8)}
                >
                  <div className="thumb"><img src="./images/gul.jpg" alt="Artwork thumbnail"/></div>
                  <div className="meta">
                    <div>Gul</div>
                    <small>Anuv jain</small>
                  </div>
                  <button 
                    className="icon-btn" 
                    aria-label="Play"
                    onClick={(e) => handleRowPlayClick(8, e)}
                  >
                    {currentTrack === 8 && isPlaying ? (
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M6 6h2v12H6zM16 6h2v12h-2z"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
                <div 
                  className={`row ${currentTrack === 9 && isPlaying ? 'playing' : ''}`}
                  style={{cursor: 'pointer'}}
                  onClick={() => handleCardClick(9)}
                >
                  <div className="thumb"><img src="./images/perfect.jpg" alt="Artwork thumbnail"/></div>
                  <div className="meta">
                    <div>Perfect</div>
                    <small>Ed Sheeran</small>
                  </div>
                  <button 
                    className="icon-btn" 
                    aria-label="Play"
                    onClick={(e) => handleRowPlayClick(9, e)}
                  >
                    {currentTrack === 9 && isPlaying ? (
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M6 6h2v12H6zM16 6h2v12h-2z"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="section cta">
              <h2>Create your perfect playlist</h2>
              <p className="muted">Collect favorites, reorder tracks, and share with friends.</p>
              <a className="btn btn-primary" href="./create.html">+ Create Playlist</a>
            </div>
          </aside>
        </section>

        <section className="section">
          <h2>Trending Songs</h2>
          <div className="scroll-row">
            {tracks.slice(0, 4).map((track, index) => (
              <article 
                key={index}
                className={`card ${currentTrack === index && isPlaying ? 'playing' : ''}`}
                style={{cursor: 'pointer'}}
                onClick={() => handleCardClick(index)}
              >
                <div className="cover">
                  <img src={track.cover} alt="Trending song cover" />
                </div>
                <div style={{marginTop: '10px'}}>
                  <strong>{track.title}</strong><br/>
                  <span className="muted">{track.artist}</span>
                </div>
                <div className="play-overlay" onClick={(e) => { e.stopPropagation(); handleCardClick(index); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#fff" d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Top Artists</h2>
          <div className="grid">
            <article className="artist">
              <div className="avatar"><img src="./images/karanaujla4.jpg" alt="Artist portrait"/></div>
              <strong>Karan Aujla</strong>
            </article>
            <article className="artist">
              <div className="avatar"><img src="./images/arjit.jpg" alt="Artist portrait"/></div>
              <strong>Arjit Singh</strong>
            </article>
            <article className="artist">
              <div className="avatar"><img src="./images/lata.jpg" alt="Artist portrait"/></div>
              <strong>lata mangeshkar</strong>
            </article>
            <article className="artist">
              <div className="avatar"><img src="./images/asha.jpg" alt="Artist portrait"/></div>
              <strong>Asha Bhosle</strong>
            </article>
          </div>
        </section>

        <section className="section">
          <h2>Albums Collection</h2>
          <div className="grid">
            {tracks.slice(4, 8).map((track, index) => {
              const actualIndex = index + 4;
              return (
                <article 
                  key={actualIndex}
                  className={`album-card ${currentTrack === actualIndex && isPlaying ? 'playing' : ''}`}
                  style={{cursor: 'pointer'}}
                  onClick={() => handleCardClick(actualIndex)}
                >
                  <div className="cover">
                    <img src={track.cover} alt="Album cover"/>
                  </div>
                  <div style={{marginTop: '8px'}}>
                    <strong>{track.title}</strong><br/>
                    <span className="muted">{track.artist}</span>
                  </div>
                  <div style={{marginTop: '10px'}}>
                    <a 
                      href="#" 
                      className="btn" 
                      aria-label="Play album"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCardClick(actualIndex); }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M8 5v14l11-7z"/>
                      </svg>
                      Play
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section">
          <h2>Your Library</h2>
          <div className="list">
            <div className="row">
              <div className="thumb"><img src="./images/lotus.jpg" alt="Saved album cover"/></div>
              <div className="meta">
                <div>Recently Played Mix</div>
                <small>22 songs • Updated today</small>
              </div>
              <a className="btn" href="#" aria-label="Open playlist">Open</a>
            </div>
            <div className="row">
              <div className="thumb"><img src="./images/find.jpg" alt="Saved album cover"/></div>
              <div className="meta">
                <div>Saved Albums</div>
                <small>12 albums</small>
              </div>
              <a className="btn" href="#" aria-label="View albums">View</a>
            </div>
          </div>
        </section>
      </main>

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
                <path fill="currentColor" d="M4 4h3l5 7l5-7h3l-7.5 10L20 20h-3l-5-7l-5 7H4l7.5-10z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 2.2A2.8 2.8 0 1 0 14.8 12A2.8 2.8 0 0 0 12 9.2M18 6.5a1 1 0 1 1-1 1a1 1 0 0 1 1-1"/>
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M10 15V9l5 3m8-6.5v9A3.5 3.5 0 0 1 19.5 18h-15A3.5 3.5 0 0 1 1 14.5v-9A3.5 3.5 0 0 1 4.5 2h15A3.5 3.5 0 0 1 23 5.5"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
