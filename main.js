// main.js
import initializeSlick from "/beta-communes-vanilla-project-for-deployment/components/logo-section/secript.js";
import initializeSlickSlider2 from '/beta-communes-vanilla-project-for-deployment/components/slider2/slider2.js';
import initializeReviewSlider from '/beta-communes-vanilla-project-for-deployment/components/review/review.js';
import initializeViewToggle from '/beta-communes-vanilla-project-for-deployment/pages/collections/earring-collection/earring-collection.js';

// Environment configuration
const REPO_NAME = 'beta-communes-vanilla-project-for-deployment';
const IS_GITHUB_PAGES = window.location.host.includes('github.io');
const BASE_PATH = IS_GITHUB_PAGES ? `/${REPO_NAME}` : '';

// Enhanced path resolver with multiple fallback options
function resolvePath(path) {
  // Remove leading/trailing slashes
  path = path.replace(/^\/|\/$/g, '');
  
  // For GitHub Pages
  if (IS_GITHUB_PAGES) {
    return `/${REPO_NAME}/${path}`;
  }
  
  // For local development
  return `/${path}`;
}

// Robust HTML loader with multiple fallback attempts
async function loadHTML(path) {
  const pathsToTry = [
    resolvePath(path), // Primary path with base
    `/${path}`, // Root-relative path
    path, // Direct path
    `./${path}` // Relative path
  ];

  for (const tryPath of pathsToTry) {
    try {
      const res = await fetch(tryPath);
      if (res.ok) return await res.text();
    } catch (err) {
      console.warn(`Failed to load ${tryPath}, trying next option...`);
    }
  }
  throw new Error(`Failed to load ${path} after multiple attempts`);
}

// Component injection
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

// Dropdown initialization
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

// Route configuration with base path
const routes = {
  '/': `${BASE_PATH}/pages/home.html`,
  '/about': `${BASE_PATH}/pages/about.html`,
  '/collections/bracelet': `${BASE_PATH}/pages/collections/bracelet.html`,
  '/collections/bridal-jewellery': `${BASE_PATH}/pages/collections/bridal-jewellery.html`,
  '/collections/earring': `${BASE_PATH}/pages/collections/earring-collection/earring.html`,
  '/collections/mens-jewellery': `${BASE_PATH}/pages/collections/mens-jewellery.html`,
  '/collections/engagement-ring': `${BASE_PATH}/pages/collections/engagement-ring.html`,
  '/account/register': `${BASE_PATH}/pages/auth/register.html`,
  '/account/signin': `${BASE_PATH}/pages/auth/signin.html`,
  '/404.html': `${BASE_PATH}/pages/404.html`
};

// Error page template
function showErrorPage(error) {
  return `
    <div class="error p-4 bg-red-100 text-red-800">
      <h2 class="text-xl font-bold">Page Load Error</h2>
      <p>${error.message}</p>
      <div class="mt-4">
        <button onclick="window.location.href='${BASE_PATH || '/'}'" 
          class="px-4 py-2 bg-blue-500 text-white rounded mr-2">
          Go Home
        </button>
        <button onclick="window.location.reload()" 
          class="px-4 py-2 bg-gray-500 text-white rounded">
          Reload
        </button>
      </div>
    </div>
  `;
}

// Render page with exact route matching
async function renderPage(path = '/') {
  const app = document.getElementById('app');
  try {
    // Use exact match only
    const pagePath = routes[path] || routes['/404.html'];
    const pageHTML = await loadHTML(pagePath);
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = pageHTML;
    await injectComponents(tempDiv);
    app.innerHTML = tempDiv.innerHTML;

    // Initialize components
    initializeDropdowns();
    initializeSlick();
    initializeSlickSlider2();
    initializeReviewSlider();
    initializeViewToggle();

    // Update active navigation
    document.querySelectorAll('[data-link]').forEach(link => {
      const linkPath = link.getAttribute('href');
      const isActive = linkPath === path;
      link.classList.toggle('active-golden', isActive);
      link.classList.toggle('hover-effect', !isActive);
    });
  } catch (err) {
    console.error('Render error:', err);
    app.innerHTML = showErrorPage(err);
  }
}

// SPA navigation setup
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

// Initialize the application
function init() {
  setupNavigation();
  
  // Handle GitHub Pages redirect case
  if (window.location.pathname === '/' && IS_GITHUB_PAGES) {
    window.history.replaceState({}, '', `${BASE_PATH}/`);
  }
  
  renderPage(window.location.pathname);
}

// Start the app
init();