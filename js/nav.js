(function () {
  const NAV_ITEMS = [
    { id: 'player', href: 'index.html', icon: 'play_circle', label: 'PLAYER' },
    { id: 'library', href: 'shelf.html', icon: 'mobile_share_stack', label: 'LIBRARY' },
    { id: 'equalizer', href: 'discover.html', icon: 'equalizer', label: 'EQUALIZER' },
    { id: 'collection', href: 'settings.html', icon: 'album', label: 'COLLECTION' }
  ];

  const currentPage = (() => {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path === '' ? 'index.html' : path;
  })();

  const nav = document.createElement('nav');
  nav.className = 'app-bottom-nav';
  nav.setAttribute('aria-label', 'Main navigation');

  const inner = document.createElement('div');
  inner.className = 'app-bottom-nav__inner';

  NAV_ITEMS.forEach((item) => {
    const isActive = currentPage === item.href;
    const link = document.createElement('a');
    link.href = item.href;
    link.className = 'app-nav-link' + (isActive ? ' app-nav-link--active' : '');
    link.setAttribute('aria-current', isActive ? 'page' : 'false');

    link.innerHTML =
      '<span class="material-symbols-outlined" aria-hidden="true">' + item.icon + '</span>' +
      '<span class="app-nav-link__label">' + item.label + '</span>';

    inner.appendChild(link);
  });

  nav.appendChild(inner);

  const placeholder = document.getElementById('app-bottom-nav');
  if (placeholder) {
    placeholder.replaceWith(nav);
  } else {
    document.body.appendChild(nav);
  }
})();
