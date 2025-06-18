// main.js
import initializeSlick from "./components/logo-section/secript.js";
import initializeSlickSlider2 from './components/slider2/slider2.js';
import initializeReviewSlider from './components/review/review.js';
import initializeViewToggle from './pages/collections/earring-collection/earring-collection.js';

// Detect GitHub Pages environment
const IS_GITHUB_PAGES = window.location.host.includes('github.io');
const REPO_NAME = 'beta-communes-vanilla-project-for-deployment';
const BASE_PATH = IS_GITHUB_PAGES ? `/${REPO_NAME}` : '';

// Normalize path for GitHub Pages (e.g., /REPO_NAME/pages/about.html)
function normalizePath(path) {
  let normalized = path.startsWith('/') ? path : `/${path}`;
  return IS_GITHUB_PAGES ? `${BASE_PATH}${normalized}` : normalized;
}

// Load HTML content
async function loadHTML(path) {
  const fullPath = normalizePath(path);

  try {
    const res = await fetch(fullPath);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return await res.text();
  } catch (err) {
    console.error(`Error loading ${fullPath}:`, err);
    throw err;
  }
}

// Inject components recursively
async function injectComponents(container) {
  const componentHolders = container.querySelectorAll('[data-component]');

  for (const holder of componentHolders) {
    const path = holder.getAttribute('data-component');
    try {
      const html = await loadHTML(path);
      const tempWrapper = document.createElement('div');
      tempWrapper.innerHTML = html;
      await injectComponents(tempWrapper);
      holder.replaceWith(...tempWrapper.childNodes);
    } catch (err) {
      console.error(`Error loading component ${path}:`, err);
      holder.outerHTML = `<div class="error">Failed to load component: ${path}</div>`;
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
        const imgSrc = item.querySelector('img').src;
        const currency = item.getAttribute('data-value');
        dropdownBtn.querySelector('img').src = imgSrc;
        dropdownBtn.querySelector('span').textContent = currency;
        dropdownMenu.classList.add('hidden');
      });
    });
  });
}

// Exact route mapping
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
  '/404.html': 'pages/404.html'
};

// Render page by exact route match only
async function renderPage(path = '/') {
  const app = document.getElementById('app');
  try {
    const routePath = routes[path] ? path : '/404.html';
    const pagePath = routes[routePath];
    const pageHTML = await loadHTML(pagePath);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = pageHTML;
    await injectComponents(tempDiv);

    app.innerHTML = tempDiv.innerHTML;

    // Init page-level JS
    initializeDropdowns();
    initializeSlick();
    initializeSlickSlider2();
    initializeReviewSlider();
    initializeViewToggle();

    // Set active nav
    document.querySelectorAll('[data-link]').forEach(link => {
      const linkPath = link.getAttribute('href');
      const isActive = linkPath === path;
      link.classList.toggle('active-golden', isActive);
      link.classList.toggle('hover-effect', !isActive);
    });
  } catch (err) {
    console.error('Render error:', err);
    app.innerHTML = `
      <div class="error p-4 bg-red-100 text-red-800">
        Error loading page: ${err.message}
        <button onclick="window.location.reload()" class="ml-4 px-3 py-1 bg-blue-500 text-white rounded">
          Reload
        </button>
      </div>
    `;
  }
}

// Handle SPA-like navigation
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

// App start
function init() {
  setupNavigation();

  // Support deep linking from GitHub Pages redirect
  const params = new URLSearchParams(window.location.search);
  const redirectPath = params.get('redirect');
  const initialPath = redirectPath || window.location.pathname;

  renderPage(initialPath);
}

init();
