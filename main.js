import initializeSlick from "./components/logo-section/secript.js";
import initializeSlickSlider2 from './components/slider2/slider2.js';
import initializeReviewSlider from './components/review/review.js';
import initializeViewToggle from './pages/collections/earring-collection/earring-collection.js';

// BASE for Vercel or Local (adjust this if your project is in a subfolder like /repo-name/)
const BASE_PATH = '/';

// Routes config
const routes = {
  '/': 'pages/home.html',
  '/about': 'pages/about.html',
  '/collections/bracelet': 'pages/collections/bracelet.html',
  '/collections/bridal-jewellery': 'pages/collections/bridal-jewellery.html',
  '/collections/earring': 'pages/collections/earring-collection/earring.html',
  '/collections/mens-jewellery': 'pages/collections/mens-jewellery.html',
  '/collections/engagement-ring': 'pages/collections/engagement-ring.html',
  '/account/register': 'pages/auth/register.html',
  '/account/signin': 'pages/auth/signin.html',
};

// Load HTML via fetch
async function loadHTML(path) {
  const url = BASE_PATH + path;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${path} (status ${res.status})`);
    return await res.text();
  } catch (err) {
    console.error('Error in loadHTML:', err);
    throw err;
  }
}

// Inject nested components recursively
async function injectComponents(container) {
  const components = container.querySelectorAll('[data-component]');
  for (const holder of components) {
    const componentPath = holder.getAttribute('data-component');
    try {
      const html = await loadHTML(componentPath);
      const tempWrapper = document.createElement('div');
      tempWrapper.innerHTML = html;

      // Recursive inject
      await injectComponents(tempWrapper);
      holder.replaceWith(...tempWrapper.childNodes);
    } catch (err) {
      holder.outerHTML = `<div class="error">Failed to load component: ${componentPath}</div>`;
    }
  }
}

// Dropdown logic
function initializeDropdowns() {
  document.querySelectorAll('.relative.inline-block.text-left').forEach(dropdown => {
    const dropdownBtn = dropdown.querySelector('#dropdownButton');
    const dropdownMenu = dropdown.querySelector('#dropdownMenu');
    if (!dropdownBtn || !dropdownMenu) return;

    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('hidden');
    });

    dropdownMenu.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img')?.src;
        const currency = item.getAttribute('data-value');
        if (imgSrc) dropdownBtn.querySelector('img').src = imgSrc;
        if (currency) dropdownBtn.querySelector('span').textContent = currency;
        dropdownMenu.classList.add('hidden');
      });
    });
  });
}

// Render page by path
async function renderPage(path = '/') {
  const app = document.getElementById('app');
  const pagePath = routes[path] || 'pages/404.html';

  try {
    const html = await loadHTML(pagePath);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    await injectComponents(tempDiv);
    app.innerHTML = tempDiv.innerHTML;

    initializeDropdowns();
    initializeSlick();
    initializeSlickSlider2();
    initializeReviewSlider();
    initializeViewToggle();

    // Highlight active nav
    document.querySelectorAll('[data-link]').forEach(link => {
      const isActive = link.getAttribute('href') === path;
      link.classList.toggle('active-golden', isActive);
      link.classList.toggle('hover-effect', !isActive);
    });

  } catch (err) {
    app.innerHTML = `<div class="error text-red-600 p-4">Error loading page: ${err.message}</div>`;
  }
}

// Setup click routing
function setupNavigation() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (link) {
      e.preventDefault();
      const path = link.getAttribute('href');
      window.history.pushState({}, '', path);
      renderPage(path);
    }
  });

  window.addEventListener('popstate', () => {
    renderPage(window.location.pathname);
  });
}

// Init app
function init() {
  setupNavigation();

  // Clean URL for local dev
  let currentPath = window.location.pathname;
  if (!routes[currentPath]) currentPath = '/';

  renderPage(currentPath);
}

document.addEventListener('DOMContentLoaded', init);
