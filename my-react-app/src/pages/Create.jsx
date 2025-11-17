import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Create.css';

export default function Create() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/images/cat.png');
  const [searchQuery, setSearchQuery] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [songSearchQuery, setSongSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [invitedFriends, setInvitedFriends] = useState([]);

  // Available songs for search
  const availableSongs = [
    { id: 1, title: 'Softly', artist: 'Karan Aujla', album: 'P-POP Culture', artwork: './images/softly.jpg' },
    { id: 2, title: 'Tension', artist: 'Diljit Dosanjh', album: 'Ghost', artwork: './images/tension.jpg' },
    { id: 3, title: 'Water', artist: 'Diljit Dosanjh', album: 'Ghost', artwork: './images/water.jpg' },
    { id: 4, title: 'Perfect', artist: 'Ed Sheeran', album: '÷ (Divide)', artwork: './images/perfect.jpg' },
    { id: 5, title: 'Timeless', artist: 'Hustinder', album: 'Timeless', artwork: './images/timeless.jpg' },
    { id: 6, title: 'Kun Faya Kun', artist: 'A.R. Rahman', album: 'Rockstar', artwork: './images/rockstar.jpg' },
    { id: 7, title: 'Param Sundari', artist: 'Shreya Ghoshal', album: 'Mimi', artwork: './images/paramsundri.jpg' },
    { id: 8, title: 'Lag Jaa Gale', artist: 'Lata Mangeshkar', album: 'Woh Kaun Thi', artwork: './images/lata.jpg' }
  ];

  // Friends list
  const friends = [
    { id: 1, name: 'Sarah Johnson', username: '@sarahj', avatar: 'SJ' },
    { id: 2, name: 'Mike Chen', username: '@mikechen', avatar: 'MC' },
    { id: 3, name: 'Emma Davis', username: '@emmad', avatar: 'ED' },
    { id: 4, name: 'Alex Rivera', username: '@alexr', avatar: 'AR' }
  ];

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isDark = savedTheme === 'dark';
    setIsDarkTheme(isDark);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    
    if (themeName === 'dark') {
      root.style.setProperty('--bg', '#1a1d2e');
      root.style.setProperty('--surface', '#252941');
      root.style.setProperty('--text', '#e1e6f0');
      root.style.setProperty('--primary', '#7c96ff');
      root.style.setProperty('--accent', '#ff8db1');
      root.style.setProperty('--shadow-dark', 'rgba(0, 0, 0, 0.5)');
      root.style.setProperty('--shadow-light', 'rgba(124, 150, 255, 0.08)');
      setLogoSrc('./images/image.png');
    } else {
      root.style.setProperty('--bg', '#eaf1ff');
      root.style.setProperty('--surface', '#f6f8ff');
      root.style.setProperty('--text', '#2d3348');
      root.style.setProperty('--primary', '#6e85ff');
      root.style.setProperty('--accent', '#ff8db1');
      root.style.setProperty('--shadow-dark', '#ccd6ec');
      root.style.setProperty('--shadow-light', '#ffffff');
      setLogoSrc('./images/cat.png');
    }
  };

  const toggleTheme = () => {
    const newTheme = isDarkTheme ? 'light' : 'dark';
    setIsDarkTheme(!isDarkTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Cover image handling
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setCoverPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Song search
  useEffect(() => {
    if (songSearchQuery.trim()) {
      const filtered = availableSongs.filter(song =>
        song.title.toLowerCase().includes(songSearchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(songSearchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [songSearchQuery]);

  // Add song to playlist
  const addSong = (song) => {
    if (!selectedSongs.find(s => s.id === song.id)) {
      setSelectedSongs([...selectedSongs, song]);
      setSongSearchQuery('');
      setSearchResults([]);
    }
  };

  // Remove song from playlist
  const removeSong = (songId) => {
    setSelectedSongs(selectedSongs.filter(s => s.id !== songId));
  };

  // Toggle friend invitation
  const toggleFriendInvite = (friendId) => {
    if (invitedFriends.includes(friendId)) {
      setInvitedFriends(invitedFriends.filter(id => id !== friendId));
    } else {
      setInvitedFriends([...invitedFriends, friendId]);
    }
  };

  // Create playlist
  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      alert('Please enter a playlist name!');
      return;
    }

    if (selectedSongs.length === 0) {
      alert('Please add at least one song to your playlist!');
      return;
    }

    const newPlaylist = {
      id: Date.now(),
      name: playlistName,
      description: playlistDescription,
      cover: coverPreview || './images/cat.png',
      songs: selectedSongs,
      createdAt: new Date().toISOString(),
      isCustom: true
    };

    // Save to localStorage
    const existingPlaylists = JSON.parse(localStorage.getItem('catifyy_playlists') || '[]');
    existingPlaylists.push(newPlaylist);
    localStorage.setItem('catifyy_playlists', JSON.stringify(existingPlaylists));

    alert(`Playlist "${playlistName}" created successfully!`);
    
    // Reset form
    setPlaylistName('');
    setPlaylistDescription('');
    setCoverImage(null);
    setCoverPreview(null);
    setSelectedSongs([]);
    setInvitedFriends([]);
  };

  // Cancel and reset
  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      setPlaylistName('');
      setPlaylistDescription('');
      setCoverImage(null);
      setCoverPreview(null);
      setSelectedSongs([]);
      setInvitedFriends([]);
    }
  };

  return (
    <div className="create-page">
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
        <section className="create-hero">
          <h1>
            <i className="fa-solid fa-plus-circle" style={{ color: 'var(--primary)' }}></i>
            Create Your Playlist
          </h1>
          <p>Build your perfect collection of songs. Add tracks, customize the cover, and share with friends!</p>
          
          <div className="create-options">
            <button className="create-btn create-btn-primary">
              <i className="fa-solid fa-music"></i>
              New Playlist
            </button>
            <button className="create-btn">
              <i className="fa-solid fa-robot"></i>
              AI-Generated Mix
            </button>
            <button className="create-btn create-btn-accent">
              <i className="fa-solid fa-microphone"></i>
              From Your Likes
            </button>
          </div>
        </section>

        {/* Basic Information */}
        <section className="form-section">
          <h2 className="section-title">
            <i className="fa-solid fa-circle-info"></i>
            Basic Information
          </h2>
          
          <div className="form-group">
            <label htmlFor="playlist-name" className="form-label">Playlist Name *</label>
            <input
              type="text"
              id="playlist-name"
              className="form-input"
              placeholder="e.g., My Awesome Mix"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="playlist-desc" className="form-label">Description (Optional)</label>
            <textarea
              id="playlist-desc"
              className="form-input form-textarea"
              placeholder="Tell us about your playlist..."
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Cover Photo (Optional)</label>
            <label htmlFor="cover-upload" className="cover-upload">
              <input
                type="file"
                id="cover-upload"
                accept="image/*"
                onChange={handleCoverChange}
              />
              {coverPreview ? (
                <div className="cover-preview">
                  <img src={coverPreview} alt="Cover preview" />
                </div>
              ) : (
                <div className="cover-preview">
                  <img src="./images/cat.png" alt="Default cover" />
                </div>
              )}
              <p style={{ margin: '0', opacity: 0.7 }}>
                <i className="fa-solid fa-cloud-upload-alt"></i> Click to upload cover image
              </p>
            </label>
          </div>
        </section>

        {/* Add Songs */}
        <section className="form-section">
          <h2 className="section-title">
            <i className="fa-solid fa-music"></i>
            Add Songs
          </h2>

          <div className="form-group">
            <label htmlFor="song-search" className="form-label">Search Songs</label>
            <input
              type="text"
              id="song-search"
              className="form-input"
              placeholder="Search by title or artist..."
              value={songSearchQuery}
              onChange={(e) => setSongSearchQuery(e.target.value)}
            />

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(song => (
                  <div key={song.id} className="search-item" onClick={() => addSong(song)}>
                    <img src={song.artwork} alt={song.title} />
                    <div className="search-item-info">
                      <h4>{song.title}</h4>
                      <p>{song.artist} • {song.album}</p>
                    </div>
                    <button className="add-btn" type="button">
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedSongs.length > 0 && (
            <div className="selected-items">
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                Selected Songs ({selectedSongs.length})
              </h3>
              {selectedSongs.map(song => (
                <div key={song.id} className="selected-item">
                  <img src={song.artwork} alt={song.title} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{song.title}</div>
                    <div style={{ fontSize: '14px', opacity: 0.7 }}>{song.artist}</div>
                  </div>
                  <button className="remove-btn" onClick={() => removeSong(song.id)} type="button">
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Invite Friends */}
        <section className="form-section">
          <h2 className="section-title">
            <i className="fa-solid fa-user-group"></i>
            Invite Friends (Optional)
          </h2>

          <div>
            {friends.map(friend => (
              <div key={friend.id} className="friend-item">
                <div className="friend-avatar">{friend.avatar}</div>
                <div className="friend-info">
                  <h4>{friend.name}</h4>
                  <p>{friend.username}</p>
                </div>
                <button
                  className={`invite-btn ${invitedFriends.includes(friend.id) ? 'invited' : ''}`}
                  onClick={() => toggleFriendInvite(friend.id)}
                  type="button"
                >
                  {invitedFriends.includes(friend.id) ? (
                    <>
                      <i className="fa-solid fa-check"></i> Invited
                    </>
                  ) : (
                    'Invite'
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn action-btn-primary" onClick={handleCreatePlaylist}>
            <i className="fa-solid fa-check"></i>
            Create Playlist
          </button>
          <button className="action-btn action-btn-secondary" onClick={handleCancel}>
            <i className="fa-solid fa-times"></i>
            Cancel
          </button>
        </div>
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
    </div>
  );
}
