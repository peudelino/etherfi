/**
 * Navigation: scroll state, hamburger toggle, announcement bar close.
 */

export function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const overlay = document.querySelector('.nav__overlay');
  const announcementBar = document.querySelector('.announcement-bar');
  const closeBtn = document.querySelector('.announcement-bar__close');
  const scrollIndicator = document.querySelector('.hero__scroll-indicator');

  // Glass effect on scroll
  let lastY = 0;
  const handleScroll = () => {
    const y = window.scrollY;

    if (y > 20) {
      nav.classList.add('nav--scrolled');
      nav.classList.remove('nav--has-bar');
    } else {
      nav.classList.remove('nav--scrolled');
      if (announcementBar && announcementBar.style.height !== '0px') {
        nav.classList.add('nav--has-bar');
      }
    }

    // Hide scroll indicator after user scrolls
    if (scrollIndicator && y > 80) {
      scrollIndicator.classList.add('is-hidden');
    }

    lastY = y;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load

  // Announcement bar close
  if (closeBtn && announcementBar) {
    closeBtn.addEventListener('click', () => {
      announcementBar.style.transition = 'opacity 0.2s ease, height 0.3s ease, padding 0.3s ease';
      announcementBar.style.opacity = '0';
      announcementBar.style.overflow = 'hidden';
      setTimeout(() => {
        announcementBar.style.height = '0';
        announcementBar.style.padding = '0';
        nav.classList.remove('nav--has-bar');
      }, 200);
    });
  }

  // Mobile hamburger
  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-open');
      overlay.classList.toggle('is-open');
      document.body.style.overflow = overlay.classList.contains('is-open') ? 'hidden' : '';
    });

    // Close overlay on link click
    overlay.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-open');
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }
}
