/**
 * Mouse-tracking 3D tilt effect for the hero card.
 * Updates CSS custom properties --rx and --ry to drive the transform.
 */

export function initCard3D() {
  const cardWrapper = document.querySelector('.hero__card-wrapper');
  const card = document.querySelector('.hero__card');

  if (!card || !cardWrapper) return;

  let targetRX = 0;
  let targetRY = 0;
  let currentRX = 0;
  let currentRY = 0;
  let rafId = null;
  let isHovering = false;

  const lerp = (a, b, t) => a + (b - a) * t;

  const animate = () => {
    currentRX = lerp(currentRX, targetRX, 0.08);
    currentRY = lerp(currentRY, targetRY, 0.08);

    card.style.setProperty('--rx', `${currentRX}deg`);
    card.style.setProperty('--ry', `${currentRY}deg`);

    if (Math.abs(currentRX - targetRX) > 0.01 || Math.abs(currentRY - targetRY) > 0.01) {
      rafId = requestAnimationFrame(animate);
    } else {
      rafId = null;
    }
  };

  cardWrapper.addEventListener('mouseenter', () => {
    isHovering = true;
    card.style.animationPlayState = 'paused';
  });

  cardWrapper.addEventListener('mouseleave', () => {
    isHovering = false;
    targetRX = 0;
    targetRY = 0;
    card.style.animationPlayState = 'running';

    if (!rafId) {
      rafId = requestAnimationFrame(animate);
    }
  });

  cardWrapper.addEventListener('mousemove', (e) => {
    if (!isHovering) return;

    const rect = cardWrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const maxTilt = 15;
    targetRY = (mouseX / (rect.width / 2)) * maxTilt;
    targetRX = -(mouseY / (rect.height / 2)) * maxTilt;

    if (!rafId) {
      rafId = requestAnimationFrame(animate);
    }
  });

  // Touch support for mobile
  cardWrapper.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const rect = cardWrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const touchX = touch.clientX - centerX;
    const touchY = touch.clientY - centerY;

    const maxTilt = 8;
    targetRY = (touchX / (rect.width / 2)) * maxTilt;
    targetRX = -(touchY / (rect.height / 2)) * maxTilt;

    if (!rafId) {
      rafId = requestAnimationFrame(animate);
    }
  }, { passive: true });

  cardWrapper.addEventListener('touchend', () => {
    targetRX = 0;
    targetRY = 0;
    if (!rafId) {
      rafId = requestAnimationFrame(animate);
    }
  });
}
