// theme.js
// Simple theme toggler that updates CSS variables on :root and persists selection in localStorage
(function(){
  const darkTheme = {
    '--bg': '#1a1d2e',
    '--surface': '#252941',
    '--text': '#e1e6f0',
    '--primary': '#7c96ff',
    '--accent': '#ff8db1',
    '--shadow-dark': 'rgba(0, 0, 0, 0.5)',
    '--shadow-light': 'rgba(124, 150, 255, 0.08)'
  };

  const lightTheme = {
    '--bg': '#eaf1ff',
    '--surface': '#f6f8ff',
    '--text': '#2d3348',
    '--primary': '#6e85ff',
    '--accent': '#ff8db1',
    '--shadow-dark': '#ccd6ec',
    '--shadow-light': '#ffffff'
  };

  const SONG_CATALOG_STORAGE_KEY = 'catifyy_song_catalog';
  const DIACRITICS_REGEX = /[\u0300-\u036f]/g;

  let cachedCatalog = null;
  let catalogPromise = null;
  let navSearchStylesInjected = false;

  function normalizeText(str){
    if(!str) return '';
    try{
      return str.toString().toLowerCase().normalize('NFD').replace(DIACRITICS_REGEX, '');
    }catch(e){
      return str.toString().toLowerCase();
    }
  }

  function escapeHtml(str){
    if(str == null) return '';
    return str.toString().replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[ch] || ch);
  }

  function ensureNavSearchStyles(){
    if(navSearchStylesInjected) return;
    navSearchStylesInjected = true;
    const style = document.createElement('style');
    style.id = 'catifyy-nav-search-styles';
    style.textContent = `
      .search-wrap{ position: relative; }
      .nav-search-panel{
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        width: min(540px, 100%);
        background: var(--surface);
        border-radius: 18px;
        box-shadow: 12px 12px 28px var(--shadow-dark), -12px -12px 28px var(--shadow-light);
        padding: 12px;
        display: none;
        z-index: 24;
        max-height: 360px;
        overflow-y: auto;
      }
      .nav-search-panel[data-visible="true"]{ display: block; }
      .nav-search-panel-header{ font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; opacity: 0.7; margin: 4px 6px 10px; }
      .nav-search-result{
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 12px;
        align-items: start;
        padding: 10px 12px;
        border-radius: 16px;
        text-decoration: none;
        color: var(--text);
        transition: transform 0.15s ease, background 0.15s ease;
        background: var(--surface);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--text) 8%, transparent);
      }
      .nav-search-result:hover,
      .nav-search-result:focus-visible{
        transform: translateY(-2px);
        background: color-mix(in srgb, var(--primary) 12%, var(--surface));
        outline: none;
      }
      .nav-search-result + .nav-search-result{ margin-top: 8px; }
      .nav-search-result-index{
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: linear-gradient(145deg, var(--primary), #7e97ff);
        color: #fff;
        display: grid;
        place-items: center;
        font-size: 0.85rem;
        font-weight: 600;
      }
      .nav-search-result-body{ display: grid; gap: 4px; }
      .nav-search-result-title{ font-weight: 600; color: var(--primary); }
      .nav-search-result-meta{ font-size: 0.85rem; color: color-mix(in srgb, var(--text) 62%, transparent); }
  .nav-search-empty{ font-size: 0.85rem; color: color-mix(in srgb, var(--text) 68%, transparent); padding: 10px 6px 4px; }
    `;
    document.head.appendChild(style);
  }

  function deserializeCatalog(raw){
    if(!raw) return [];
    const items = Array.isArray(raw.items) ? raw.items : Array.isArray(raw) ? raw : [];
    return items.map(item => ({
      id: item.id,
      title: item.title || 'Unknown',
      artist: item.artist || '',
      album: item.album || '',
      section: item.section || '',
      query: item.query || normalizeText(`${item.title || ''} ${item.artist || ''} ${item.album || ''} ${item.section || ''}`)
    }));
  }

  function loadCatalogFromStorage(){
    try{
      const raw = localStorage.getItem(SONG_CATALOG_STORAGE_KEY);
      if(!raw) return null;
      const parsed = JSON.parse(raw);
      return deserializeCatalog(parsed);
    }catch(e){
      console.warn('Failed to load song catalog', e);
      return null;
    }
  }

  function saveCatalogToStorage(items){
    try{
      if(!Array.isArray(items) || !items.length) return;
      localStorage.setItem(SONG_CATALOG_STORAGE_KEY, JSON.stringify({
        updated: Date.now(),
        items
      }));
    }catch(e){
      console.warn('Failed to save song catalog', e);
    }
  }

  function extractCatalogFromDocument(doc){
    const nodes = doc ? Array.from(doc.querySelectorAll('.song-item')) : [];
    return nodes.map((node, idx) => {
      const title = node.querySelector('.song-title')?.textContent?.trim() || 'Unknown';
      const artist = node.querySelector('.song-artist')?.textContent?.trim() || '';
      const album = node.querySelector('.song-album')?.textContent?.trim() || '';
      const section = (() => {
        const sectionEl = node.closest('section');
        const heading = sectionEl ? sectionEl.querySelector('h2') : null;
        return heading ? heading.textContent.trim() : '';
      })();
      const id = node.id || `song-${idx + 1}`;
      return {
        id,
        title,
        artist,
        album,
        section,
        query: normalizeText(`${title} ${artist} ${album} ${section}`)
      };
    });
  }

  async function fetchCatalogFallback(){
    try{
      const response = await fetch('songs.html', { cache: 'no-store' });
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const catalog = extractCatalogFromDocument(doc);
      saveCatalogToStorage(catalog);
      return catalog;
    }catch(e){
      console.warn('Unable to fetch song catalog', e);
      return [];
    }
  }

  async function getSongCatalog(){
    if(window.songSearch && typeof window.songSearch.exportCatalog === 'function'){
      const ownCatalog = deserializeCatalog({ items: window.songSearch.exportCatalog() });
      cachedCatalog = ownCatalog;
      saveCatalogToStorage(ownCatalog);
      return ownCatalog;
    }

    if(cachedCatalog) return cachedCatalog;

    const stored = loadCatalogFromStorage();
    if(stored && stored.length){
      cachedCatalog = stored;
      return stored;
    }

    if(!catalogPromise){
      catalogPromise = fetchCatalogFallback().then(catalog => {
        cachedCatalog = catalog;
        return catalog;
      });
    }

    return catalogPromise;
  }

  function createSuggestionMarkup(matches, query, isSongsPage){
    const safeQuery = encodeURIComponent(query);
    const html = ['<div class="nav-search-panel-header">Songs</div>'];
    matches.forEach((match, idx) => {
      const target = isSongsPage ? `#${match.id}` : `songs.html?q=${safeQuery}#${match.id}`;
      const metaParts = [];
      if(match.artist) metaParts.push(escapeHtml(match.artist));
      if(match.album) metaParts.push(`Album · ${escapeHtml(match.album)}`);
      if(match.section) metaParts.push(escapeHtml(match.section));
      html.push(`
        <a class="nav-search-result" href="${target}" role="option">
          <div class="nav-search-result-index">${idx + 1}</div>
          <div class="nav-search-result-body">
            <div class="nav-search-result-title">${escapeHtml(match.title)}</div>
            <div class="nav-search-result-meta">${metaParts.join(' • ') || 'Unknown Artist'}</div>
          </div>
        </a>
      `);
    });
    return html.join('');
  }

  function applyThemeMap(map){
    const root = document.documentElement;
    Object.keys(map).forEach(k => root.style.setProperty(k, map[k]));
  }

  function setTheme(name){
    if(name === 'light') applyThemeMap(lightTheme);
    else applyThemeMap(darkTheme);
    localStorage.setItem('theme', name);
    updateIcon(name);
    updateLogo(name);
  }

  function toggleTheme(){
    const current = localStorage.getItem('theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  function updateIcon(name){
    const icon = document.getElementById('theme-icon');
    if(!icon) return;
    if(name === 'light'){
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }

  function updateLogo(name){
    try{
      const logo = document.getElementById('logo-img');
      if(!logo) return;
      // Use image.png for dark theme, cat.png for light (paths relative to page)
      if(name === 'dark'){
        logo.src = './images/image.png';
        // Increase width in dark mode to prevent shrinking
        logo.style.width = '160px';
        logo.style.height = '110px';
      } else {
        logo.src = './images/cat.png';
        // Reset to original dimensions in light mode
        logo.style.width = '120px';
        logo.style.height = '100px';
      }
    }catch(e){ console.warn('updateLogo error', e); }
  }

  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);

    const btn = document.getElementById('theme-toggle');
    if(btn) btn.addEventListener('click', toggleTheme);

    const searchForm = document.querySelector('form.search');
    const searchInput = searchForm ? searchForm.querySelector('input[name="q"], input[type="search"], input') : null;

    if(searchForm && searchInput){
      ensureNavSearchStyles();

      const searchWrap = searchForm.closest('.search-wrap') || searchForm.parentElement;
      const isSongsPage = /songs\.html$/i.test(window.location.pathname) || window.location.pathname.toLowerCase().includes('songs.html');

      let suggestionPanel = null;
      let suggestionRequestId = 0;

      function ensureSuggestionPanel(){
        if(!suggestionPanel){
          suggestionPanel = document.createElement('div');
          suggestionPanel.className = 'nav-search-panel';
          suggestionPanel.setAttribute('role', 'listbox');
          (searchWrap || searchForm).appendChild(suggestionPanel);
        }
        return suggestionPanel;
      }

      function hideSuggestions(){
        if(!suggestionPanel) return;
        suggestionPanel.dataset.visible = 'false';
        suggestionPanel.innerHTML = '';
      }

      function renderSuggestions(query, matches){
        if(!matches || !matches.length){
          hideSuggestions();
          return;
        }
        const panel = ensureSuggestionPanel();
        panel.dataset.visible = 'true';
        panel.innerHTML = createSuggestionMarkup(matches, query, isSongsPage);
      }

      async function updateSuggestions(query){
        const trimmed = (query || '').trim();
        if(!trimmed){
          hideSuggestions();
          return;
        }

        const requestId = ++suggestionRequestId;
        const normalized = normalizeText(trimmed);

        if(isSongsPage && window.songSearch){
          const baseMatches = typeof window.songSearch.getMatches === 'function'
            ? window.songSearch.getMatches()
            : Array.isArray(window.songSearch.data) ? window.songSearch.data : [];

          const matches = baseMatches
            .filter(item => {
              const queryValue = item && item.searchIndex
                ? item.searchIndex
                : normalizeText(`${item?.title || ''} ${item?.artist || ''} ${item?.album || ''} ${item?.section || ''}`);
              return queryValue.includes(normalized);
            })
            .map(item => ({
              id: item.anchorId || item.id,
              title: item.title,
              artist: item.artist,
              album: item.album,
              section: item.section || '',
              query: item.searchIndex || normalizeText(`${item.title || ''} ${item.artist || ''} ${item.album || ''} ${item.section || ''}`)
            }))
            .slice(0, 6);

          if(requestId !== suggestionRequestId) return;

          if(matches.length){
            renderSuggestions(trimmed, matches);
          } else {
            hideSuggestions();
          }
          return;
        }

        let catalog = [];
        try{
          catalog = await getSongCatalog();
        }catch(err){
          console.warn('Catalog fetch failed', err);
          catalog = [];
        }

        if(requestId !== suggestionRequestId) return;

        const matches = (catalog || []).filter(item => item.query.includes(normalized)).slice(0, 6);
        if(matches.length){
          renderSuggestions(trimmed, matches);
        } else {
          const panel = ensureSuggestionPanel();
          panel.dataset.visible = 'true';
          const infoMessage = catalog && catalog.length
            ? `No matching tracks found for "${escapeHtml(trimmed)}".`
            : 'No matching tracks yet. Open the Songs page once to sync the catalog.';
          panel.innerHTML = `
            <div class="nav-search-panel-header">Songs</div>
            <div class="nav-search-empty">${infoMessage}</div>
          `;
        }
      }

      function performSearch(query, { submit = false } = {}){
        const trimmed = (query || '').trim();

        if(!trimmed){
          if(isSongsPage && window.songSearch){
            window.songSearch.clear();
            if(window.history && window.history.replaceState){
              const cleanUrl = window.location.pathname + window.location.hash;
              window.history.replaceState({}, '', cleanUrl);
            }
          }
          hideSuggestions();
          return;
        }

        if(isSongsPage){
          if(window.songSearch){
            const count = window.songSearch.filter(trimmed);
            if(window.history && window.history.replaceState){
              const newUrl = `${window.location.pathname}?q=${encodeURIComponent(trimmed)}${window.location.hash}`;
              window.history.replaceState({}, '', newUrl);
            }
            if(submit && typeof window.songSearch.playFirstMatch === 'function' && count > 0){
              window.songSearch.playFirstMatch(true);
            }
          }
        } else if(submit){
          const destination = `songs.html?q=${encodeURIComponent(trimmed)}`;
          window.location.href = destination;
        }
      }

      function triggerSuggestions(value){
        updateSuggestions(value).catch(err => console.warn('Suggestion update failed', err));
      }

      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        performSearch(searchInput.value, { submit: true });
        hideSuggestions();
      });

      const handleInput = () => {
        const value = searchInput.value;
        if(isSongsPage){
          performSearch(value);
        }
        triggerSuggestions(value);
      };

      searchInput.addEventListener('input', handleInput);

      searchInput.addEventListener('focus', () => {
        const value = searchInput.value.trim();
        if(value){
          triggerSuggestions(value);
        }
      });

      searchInput.addEventListener('search', () => {
        const value = searchInput.value;
        performSearch(value, { submit: isSongsPage ? false : true });
        triggerSuggestions(value);
      });

      searchInput.addEventListener('keydown', (event) => {
        if(event.key === 'Escape'){
          hideSuggestions();
          if(isSongsPage && window.songSearch){
            window.songSearch.clear();
          }
          searchInput.value = '';
        }
      });

      if(searchWrap){
        searchWrap.addEventListener('click', (event) => {
          const resultLink = event.target.closest('.nav-search-result');
          if(!resultLink) return;

          hideSuggestions();

          if(isSongsPage && window.songSearch){
            const href = resultLink.getAttribute('href') || '';
            if(href.startsWith('#')){
              const anchorId = href.slice(1);
              const played = typeof window.songSearch.playById === 'function'
                ? window.songSearch.playById(anchorId, true)
                : false;
              if(!played && typeof window.songSearch.playFirstMatch === 'function'){
                window.songSearch.playFirstMatch(true);
              }
            }
          }
        });
      }

      document.addEventListener('click', (event) => {
        if(!suggestionPanel) return;
        if(searchWrap && searchWrap.contains(event.target)) return;
        hideSuggestions();
      });

      searchInput.addEventListener('blur', () => {
        setTimeout(() => hideSuggestions(), 160);
      });

      const params = new URLSearchParams(window.location.search);
      const initialQuery = params.get('q');
      if(initialQuery){
        searchInput.value = initialQuery;
        if(isSongsPage && window.songSearch){
          window.songSearch.filter(initialQuery);
        }
        if(document.activeElement === searchInput){
          triggerSuggestions(initialQuery);
        }
      }
    }
  });
})();
