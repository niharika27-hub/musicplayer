// React Navbar Component for Catifyy
(function() {
  const { useState, useEffect, createElement: h } = React;

  const Navbar = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
      const saved = localStorage.getItem('theme') || 'dark';
      setTheme(saved);
      applyTheme(saved);
    }, []);

    const applyTheme = (themeName) => {
      const root = document.documentElement;
      const themes = {
        dark: {
          '--bg': '#1a1d2e',
          '--surface': '#252941',
          '--text': '#e1e6f0',
          '--primary': '#7c96ff',
          '--accent': '#ff8db1',
          '--shadow-dark': 'rgba(0, 0, 0, 0.5)',
          '--shadow-light': 'rgba(124, 150, 255, 0.08)'
        },
        light: {
          '--bg': '#eaf1ff',
          '--surface': '#f6f8ff',
          '--text': '#2d3348',
          '--primary': '#6e85ff',
          '--accent': '#ff8db1',
          '--shadow-dark': '#ccd6ec',
          '--shadow-light': '#ffffff'
        }
      };
      
      const colors = themes[themeName];
      Object.keys(colors).forEach(key => {
        root.style.setProperty(key, colors[key]);
      });
    };

    const toggleTheme = () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    };

    const getLogoSrc = () => theme === 'dark' ? './images/image.png' : './images/cat.png';
    const getLogoStyle = () => theme === 'dark' 
      ? { width: '160px', height: '110px' }
      : { width: '120px', height: '100px' };

    return h('header', { className: 'nav' },
      h('div', { className: 'container nav-inner' },
        h('div', { className: 'brand' },
          h('img', { id: 'logo-img', src: getLogoSrc(), style: getLogoStyle(), alt: 'Catifyy Logo' })
        ),
        h('div', { className: 'search-wrap' },
          h('form', { className: 'search', method: 'post', onSubmit: (e) => e.preventDefault() },
            h('i', { className: 'fa-solid fa-circle fa-xs', style: { color: '#000000' } }),
            h('input', { id: 'q', name: 'q', placeholder: 'Search songs, artists, albums...' })
          ),
          h('div', { className: 'filters' },
            h('div', { className: 'filter-group' },
              h('input', { type: 'radio', name: 'scope', id: 'f-songs' }),
              h('label', { className: 'chip', htmlFor: 'f-songs' }, h('a', { href: 'songs.html' }, 'Songs')),
              h('input', { type: 'radio', name: 'scope', id: 'f-albums' }),
              h('label', { className: 'chip', htmlFor: 'f-albums' }, h('a', { href: 'albums.html' }, 'Albums')),
              h('input', { type: 'radio', name: 'scope', id: 'f-library' }),
              h('label', { className: 'chip', htmlFor: 'f-library' }, h('a', { href: 'library.html' }, 'Library')),
              h('input', { type: 'radio', name: 'scope', id: 'f-playlists' }),
              h('label', { className: 'chip', htmlFor: 'f-playlists' }, h('a', { href: 'playlist.html' }, 'Playlist')),
              h('input', { type: 'radio', name: 'scope', id: 'f-liked' }),
              h('label', { className: 'chip', htmlFor: 'f-liked' }, h('a', { href: 'liked.html' }, 'Liked'))
            )
          )
        ),
        h('nav', { className: 'nav-links' },
          h('a', { href: 'index.html', title: 'Home' }, h('i', { className: 'fa-solid fa-house-user' })),
          h('a', { href: 'create.html', title: 'Create Playlist' }, h('i', { className: 'fa-solid fa-plus' })),
          h('button', {
            id: 'theme-toggle',
            className: 'nav-toggle',
            title: 'Toggle theme',
            'aria-label': 'Toggle theme',
            onClick: toggleTheme
          }, h('i', { id: 'theme-icon', className: `fa-solid fa-${theme === 'dark' ? 'moon' : 'sun'}` })),
          h('a', { href: 'signup.html', title: 'Login' }, h('i', { className: 'fa-solid fa-user' }))
        )
      )
    );
  };

  // Mount navbar when DOM is ready
  function mountNavbar() {
    const container = document.getElementById('react-navbar-root');
    if (container && window.ReactDOM) {
      const root = ReactDOM.createRoot(container);
      root.render(h(React.StrictMode, null, h(Navbar)));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountNavbar);
  } else {
    mountNavbar();
  }
})();
