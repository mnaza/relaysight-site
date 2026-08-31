import { brandMark, loadRuntime, localeSelect, t } from './theme.js';

const { brand, locale, dict } = await loadRuntime();
document.documentElement.lang = locale;

document.querySelector('#brand-slot').appendChild(brandMark(brand));
document.querySelector('#locale-slot').appendChild(localeSelect(brand, locale));
document.querySelector('#preview-mark').textContent = brand.name.slice(0, 1).toUpperCase();
document.querySelector('#footer-brand').textContent = `© 2026 ${brand.legalName || brand.name}`;

document.querySelectorAll('[data-i18n]').forEach(node => {
  node.textContent = t(dict, node.dataset.i18n, node.dataset.i18n, { freeCameras: brand.freeTier?.cameras ?? 3 });
});

document.querySelectorAll('[data-list]').forEach(node => {
  const value = t(dict, node.dataset.list, '', { freeCameras: brand.freeTier?.cameras ?? 3 });
  node.replaceChildren(...value.split('|').filter(Boolean).map(text => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
});

// The dashboard is a separate deployment, so these cannot stay relative. Every
// link to it is rewritten from one brand setting; `data-app` carries the
// fragment. Splitting the repositories broke all three of these silently, and
// a dead call-to-action on the page that exists to convert is the worst place
// for a link to rot.
const appUrl = brand.appUrl || '/app/';
document.querySelectorAll('[data-app]').forEach(node => {
  node.href = appUrl + node.dataset.app;
});
