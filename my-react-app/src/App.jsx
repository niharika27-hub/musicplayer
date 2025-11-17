import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Songs from './pages/Songs.jsx';
import Albums from './pages/Albums.jsx';
import Library from './pages/Library.jsx';
import Playlist from './pages/Playlist.jsx';
import Liked from './pages/Liked.jsx';
import Create from './pages/Create.jsx';
import Login from './pages/Login.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/library" element={<Library />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/liked" element={<Liked />} />
        <Route path="/create" element={<Create />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
