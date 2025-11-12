import React from 'react';

export default function Home() {
  return (
    <main style={{ padding: '40px 20px' }}>
      <h1>Welcome to Catifyy</h1>
      <p>This is the React Home page. Your existing static pages still work at their original paths like /songs.html and /albums.html.</p>
      <ul>
        <li><a href="/index.html">Legacy Home (HTML)</a></li>
        <li><a href="/songs.html">Songs (HTML)</a></li>
        <li><a href="/albums.html">Albums (HTML)</a></li>
      </ul>
    </main>
  );
}
