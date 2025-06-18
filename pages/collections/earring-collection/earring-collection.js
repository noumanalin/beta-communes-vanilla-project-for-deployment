import { earring_Array } from './data_Array.js';

export default function initializeViewToggle() {
    let displayedAs = 'grid';
    let currentProducts = [...earring_Array];

    const gridLabel = document.getElementById('grid-label');
    const listLabel = document.getElementById('list-label');
    const gridRadio = document.getElementById('grid-view');
    const listRadio = document.getElementById('list-view');
    const productContainer = document.querySelector('.product-container');
    const sortSelect = document.getElementById('sort');

    if (!gridLabel || !listLabel || !productContainer || !sortSelect) return;

    // Render products based on current view
    function renderProducts() {
        productContainer.innerHTML = '';

        if (displayedAs === 'grid') {
            renderGridView();
        } else {
            renderListView();
        }
    }

    // Grid View Template
    function renderGridView() {
        productContainer.className = 'product-container grid place-items-center gap-2 md:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10 p-3';
        
        currentProducts.forEach(product => {
            const productCard = `
                <a href="#" class="icon-cart">
                    <div class="relative overflow-hidden cart-s-img-div-with-icons">
                        <img src="${product.image_url}" alt="${product.name}" class="w-fit transition ease-in-out" />
                        <div class="icons absolute top-10 w-full justify-center gap-9 z-10 hidden">
                            <i class="fa fa-clone bg-white hover:bg-black hover:text-white p-2 transition-all duration-300 ease-in-out" aria-hidden="true"></i>
                            <i class="fa fa-heart bg-white hover:bg-black hover:text-white p-2 transition-all duration-300 ease-in-out" aria-hidden="true"></i>
                            <i class="fa fa-search bg-white hover:bg-black hover:text-white p-2 transition-all duration-300 ease-in-out" aria-hidden="true"></i>
                        </div>
                        <div class="absolute btn-div bottom-5 w-full justify-center hidden">
                            <button class="cart-btn capitalize bg-white text-black px-4 py-2 hover:bg-black hover:text-white transition-all duration-300">add to cart</button>
                        </div>
                        ${product.sale ? '<span class="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs">SALE</span>' : ''}
                    </div>
                    <div class="text-center mt-3 font-[500]">
                        <p class="text-[20px] font-ancizar tracking-tighter hover:text-golden">${product.name}</p>
                        <span>$${product.price.toFixed(2)}</span>
                    </div>
                </a>
            `;
            productContainer.innerHTML += productCard;
        });

        // Add hover effects
        document.querySelectorAll('.icon-cart').forEach(cart => {
            cart.addEventListener('mouseenter', () => {
                cart.querySelector('.icons').classList.remove('hidden');
                cart.querySelector('.btn-div').classList.remove('hidden');
            });
            cart.addEventListener('mouseleave', () => {
                cart.querySelector('.icons').classList.add('hidden');
                cart.querySelector('.btn-div').classList.add('hidden');
            });
        });
    }

    // List View Template
    function renderListView() {
        productContainer.className = 'product-container grid grid-cols-1 gap-6 mt-10 p-3';
        
        currentProducts.forEach(product => {
            const productItem = `
                <div class="flex items-center gap-6 border-b pb-6">
                    <div class="relative w-1/4">
                        <img src="${product.image_url}" alt="${product.name}" class="w-full" />
                        ${product.sale ? '<span class="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs">SALE</span>' : ''}
                    </div>
                    <div class="w-3/4">
                        <h3 class="text-xl font-bold hover:text-golden cursor-pointer">${product.name}</h3>
                        <p class="text-lg my-2">$${product.price.toFixed(2)}</p>
                        <p class="text-gray-600 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <div class="flex gap-4">
                            <button class="bg-black text-white px-4 py-2 hover:bg-golden transition-all">Add to Cart</button>
                            <button class="border border-black px-4 py-2 hover:bg-black hover:text-white transition-all">View Details</button>
                        </div>
                    </div>
                </div>
            `;
            productContainer.innerHTML += productItem;
        });
    }

    // Sort products
    function sortProducts(sortValue) {
        switch(sortValue) {
            case 'best_selling':
                currentProducts.sort((a, b) => b.best_selling - a.best_selling);
                break;
            case 'az':
                currentProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'za':
                currentProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'low':
                currentProducts.sort((a, b) => a.price - b.price);
                break;
            case 'high':
                currentProducts.sort((a, b) => b.price - a.price);
                break;
            case 'old':
                currentProducts.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'new':
                currentProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            default: // Featured
                currentProducts.sort((a, b) => b.featured - a.featured);
        }
        renderProducts();
    }

    // Event listeners
    gridLabel.addEventListener('click', () => {
        displayedAs = 'grid';
        gridRadio.checked = true;
        updateView();
    });

    listLabel.addEventListener('click', () => {
        displayedAs = 'list';
        listRadio.checked = true;
        updateView();
    });

    sortSelect.addEventListener('change', (e) => {
        const sortValue = e.target.value;
        sortProducts(sortValue);
    });

    function updateView() {
        if (displayedAs === 'grid') {
            gridLabel.classList.add('selected');
            listLabel.classList.remove('selected');
        } else {
            gridLabel.classList.remove('selected');
            listLabel.classList.add('selected');
        }
        renderProducts();
    }

    renderProducts();
    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
        updateView();
        sortProducts('featured');
    });
    
}