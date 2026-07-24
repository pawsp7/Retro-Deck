(function () {
  'use strict';

  // Register service worker for offline / installable PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }

  // Live clock in headers that show a time element
  const clockEl = document.querySelector('[data-app-clock]');
  if (clockEl) {
    const tick = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    tick();
    setInterval(tick, 1000);
  }

  // Prevent accidental double-tap zoom on iOS
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  // Add-to-home-screen install prompt
  let deferredPrompt = null;
  const DISMISS_KEY = 'mc-install-dismissed';

  const banner = document.createElement('div');
  banner.className = 'install-banner';
  banner.hidden = true;
  banner.innerHTML =
    '<div class="install-banner__text">' +
      '<div class="install-banner__title">Install App</div>' +
      '<div>Add Master Control to your home screen for the full mobile experience.</div>' +
    '</div>' +
    '<div class="install-banner__actions">' +
      '<button type="button" class="install-banner__btn install-banner__btn--ghost" data-install-dismiss>Dismiss</button>' +
      '<button type="button" class="install-banner__btn install-banner__btn--primary" data-install-accept>Install</button>' +
    '</div>';

  document.body.appendChild(banner);

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  function showBanner() {
    if (isStandalone || localStorage.getItem(DISMISS_KEY)) return;
    banner.hidden = false;
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showBanner();
  });

  // iOS has no beforeinstallprompt — show manual instructions after a short delay
  if (isIOS && !isStandalone && !localStorage.getItem(DISMISS_KEY)) {
    setTimeout(() => {
      banner.querySelector('.install-banner__title').textContent = 'Add to Home Screen';
      banner.querySelector('.install-banner__text div:last-child').textContent =
        'Tap the Share button, then "Add to Home Screen" to install.';
      showBanner();
    }, 3000);
  }

  banner.querySelector('[data-install-dismiss]').addEventListener('click', () => {
    banner.hidden = true;
    localStorage.setItem(DISMISS_KEY, '1');
  });

  banner.querySelector('[data-install-accept]').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      banner.hidden = true;
    } else if (isIOS) {
      banner.hidden = true;
    }
  });

  // Haptic-style feedback on supported devices
  document.querySelectorAll('button, .tape-spine, .app-nav-link').forEach((el) => {
    el.addEventListener('click', () => {
      if (navigator.vibrate) navigator.vibrate(8);
    });
  });
})();
