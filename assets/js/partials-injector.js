// Simple injector: inserts gallery/about/contact partials into the page
(function(){
  const parts = [
    { sel: '#gallery-placeholder', url: 'assets/partials/gallery.html' },
    { sel: '#about-placeholder', url: 'assets/partials/about.html' },
    { sel: '#contact-placeholder', url: 'assets/partials/contact.html' }
  ];

  function fetchText(url) {
    return fetch(url, { cache: 'no-store' }).then(r => {
      if (!r.ok) throw new Error('Failed to fetch ' + url);
      return r.text();
    });
  }

  async function inject() {
    for (const p of parts) {
      const el = document.querySelector(p.sel);
      if (!el) continue;
      try {
        const html = await fetchText(p.url);
        el.insertAdjacentHTML('afterend', html);
        el.remove();
      } catch (err) {
        console.error('Failed to inject', p.url, err);
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
