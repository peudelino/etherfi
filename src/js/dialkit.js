import { createElement as h, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useDialKit, DialRoot } from 'dialkit';
import 'dialkit/styles.css';

function HeroControls() {
  const { copyTop, cardTop, navTop, subheadGap, ctasGap } = useDialKit('Hero', {
    copyTop: [-63, -200, 200, 1],
    cardTop: [-56, -200, 200, 1],
    navTop: [44, -50, 100, 1],
    subheadGap: [32, 0, 120, 1],
    ctasGap: [40, 0, 120, 1],
  });

  useEffect(() => {
    const el = document.querySelector('.hero__copy');
    if (el) el.style.transform = `translateY(${copyTop}px)`;
  }, [copyTop]);

  useEffect(() => {
    const el = document.querySelector('.hero__visual');
    if (el) el.style.transform = `translateY(${cardTop}px)`;
  }, [cardTop]);

  useEffect(() => {
    const el = document.querySelector('.nav');
    if (el) el.style.top = `${navTop}px`;
  }, [navTop]);

  useEffect(() => {
    const el = document.querySelector('.hero__subhead');
    if (el) el.style.marginBottom = `${subheadGap}px`;
  }, [subheadGap]);

  useEffect(() => {
    const el = document.querySelector('.hero__ctas');
    if (el) el.style.marginBottom = `${ctasGap}px`;
  }, [ctasGap]);

  return null;
}

const mount = document.getElementById('dialkit-root');
if (mount) {
  createRoot(mount).render(
    h('div', null,
      h(HeroControls),
      h(DialRoot, { position: 'bottom-left', defaultOpen: false }),
    )
  );
}
