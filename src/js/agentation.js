async function mountAgentation() {
  const [{ createElement }, { createRoot }, { Agentation }] = await Promise.all([
    import('react'),
    import('react-dom/client'),
    import('agentation'),
  ]);

  const mount = document.getElementById('agentation-root');
  if (mount) {
    createRoot(mount).render(createElement(Agentation));
  }
}

mountAgentation();

