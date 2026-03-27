import '../styles/global.css';
import '../styles/nav.css';
import '../styles/hero.css';
import '../styles/social-proof.css';
import '../styles/onboarding.css';
import '../styles/card-showcase.css';
import '../styles/features.css';
import '../styles/cashback.css';
import '../styles/security.css';
import '../styles/testimonials.css';
import '../styles/cta.css';
import '../styles/footer.css';

import { initNav } from './nav.js';
import { initScrollAnimations } from './scroll-animations.js';
import { initCard3D } from './card3d.js';
import { initCounters } from './counter.js';

// Init synchronous modules
initNav();
initScrollAnimations();
initCard3D();
initCounters();

// Lazy-load the globe only when hero is in view
const heroSection = document.querySelector('#hero');
if (heroSection) {
  const globeObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        const canvas = document.querySelector('#globe-canvas');
        if (canvas) {
          import('./globe.js').then(({ initGlobe }) => {
            initGlobe(canvas);
          });
        }
        globeObserver.disconnect();
      }
    },
    { threshold: 0.05 }
  );

  globeObserver.observe(heroSection);
}

// Currency ticker animation (feature card 4)
const currencySymbols = ['$ USD', '€ EUR', '£ GBP', '¥ JPY', 'R$ BRL', '₹ INR'];
const currencyEl = document.querySelector('.feat-currency__symbol');
if (currencyEl) {
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % currencySymbols.length;
    currencyEl.style.opacity = '0';
    currencyEl.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      currencyEl.textContent = currencySymbols[idx];
      currencyEl.style.opacity = '1';
      currencyEl.style.transform = 'translateY(0)';
    }, 200);
  }, 2000);

  currencyEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
}
