// main.js
import initializeSlick from "./components/logo-section/secript.js";
import initializeSlickSlider2 from './components/slider2/slider2.js';
import initializeReviewSlider from './components/review/review.js';
import initializeViewToggle from './pages/collections/earring-collection/earring-collection.js'
// myAlert("guten tag!")


// Base URL for all requests
const BASE_URL = `${window.location.origin}/beta-communes-vanilla-project-for-deployment`;


// Load a single HTML file as string
async function loadHTML(path) {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(`${BASE_URL}${normalizedPath}`);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.text();
}


// modify injectComponents to render component inside component
async function injectComponents(container) {
  const componentHolders = container.querySelectorAll('[data-component]');

  for (const holder of componentHolders) {
    const path = holder.getAttribute('data-component');
    try {
      const html = await loadHTML(path);
      const tempWrapper = document.createElement('div');
      tempWrapper.innerHTML = html;

      // Recursively inject nested components
      await injectComponents(tempWrapper);

      holder.replaceWith(...tempWrapper.childNodes);
    } catch (err) {
      console.error(`Error loading component ${path}:`, err);
      holder.outerHTML = `<div class="error">Failed to load component: ${path}</div>`;
    }
  }
}


// For drop dwon
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


// Route configuration
const routes = {
  '/': '/pages/home.html',
  '/about': '/pages/about.html',
  '/collections/bracelet': '/pages/collections/bracelet.html',
  '/collections/bridal-jewellery': '/pages/collections/bridal-jewellery.html',
  '/collections/earring': '/pages/collections/earring-collection/earring.html',
  '/collections/mens-jewellery': '/pages/collections/mens-jewellery.html',
  '/collections/engagement-ring': '/pages/collections/engagement-ring.html',
  '/account/register': '/pages/auth/register.html',
  '/account/signin': '/pages/auth/signin.html',

  // Add other routes here
};

// Load and render page
async function renderPage(path = '/') {
  const app = document.getElementById('app');
  try {
    const pagePath = routes[path] || '/pages/404.html';
    const pageHTML = await loadHTML(pagePath);
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = pageHTML;

    await injectComponents(tempDiv);
    app.innerHTML = tempDiv.innerHTML;
    
    await injectComponents(tempDiv);
    app.innerHTML = tempDiv.innerHTML;

    // Initialize dropdowns
    initializeDropdowns();

    // 🆕 Initialize slick (after logos are in the DOM)
    initializeSlick();
    initializeSlickSlider2();
    initializeReviewSlider();
    initializeViewToggle();


    // Update active link in navbar
    document.querySelectorAll('[data-link]').forEach(link => {
      const isActive = link.getAttribute('href') === path;
      link.classList.toggle('active-golden', isActive);
      link.classList.toggle('hover-effect', !isActive); // Remove hover-effect if active
    });
  } catch (err) {
    app.innerHTML = `<div class="error">Error: ${err.message}</div>`;
  }
}

// Handle navigation
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

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    renderPage(window.location.pathname);
  });
}

// Initialize the app
function init() {
  setupNavigation();
  renderPage(window.location.pathname);
}

// Start the application
init();




