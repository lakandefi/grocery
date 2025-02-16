document.addEventListener('DOMContentLoaded', function() {
    // Daily date update
    const currentDate = new Date().toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('current-date').textContent = currentDate;
    document.getElementById('footer-date').textContent = currentDate;

    // Fetch and display all products initially
    fetchProducts();

    // Category button to filter
    const categoryButtons = document.querySelectorAll('.category-btn');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get selected products based on selected category
            const category = this.dataset.category;
            filterProducts(category);
        });
    });

    // Search functionality
    // Working
    const searchInput = document.querySelector('#search-input');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        filterProductsBySearch(searchTerm);
    });
});

let allProducts = [];

// Function to fetch all products
async function fetchProducts() {
    try {
        const response = await fetch('https://grocery-zyic.onrender.com/products');

        if (!response.ok) {
            throw new Error('Error fetching products');
        }

        const products = await response.json()
        console.log(products);

        allProducts = products;
        displayProducts(allProducts);
    } catch (error) {
        console.error(`Error fetching products: ${error}`);
        document.getElementById('error-container').style.display = 'block';
        document.querySelector('.loading').style.display = 'none';
    }
}

// Function to display products
async function displayProducts(products) {
    const container = document.getElementById('items-container');
    const errorMessage = document.getElementById('error-container');

    // Remove loading & error message
    container.innerHTML = '';
    errorMessage.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<div class="loading">No products found.</div>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.dataset.category = product.category || 'other';

        let imagePath = `https://grocery-zyic.onrender.com${product.image}`;

        // HTML code for each product
        card.innerHTML = `
            <div class="item-image">
                <img src=${imagePath} alt="${product.name}">
            </div>
            <div class="item-details">
                <div class="item-name">${product.name}</div>
                <div class="item-price">₱${product.price}</div>  
            </div>    
            `;
        
        container.appendChild(card);
    })
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(allProducts);
        return;
    }

    const filtered = allProducts.filter(product => 
        product.category && product.category.toLowerCase() === category.toLowerCase()
    );
    displayProducts(filtered);
}

// Filter products by search
function filterProductsBySearch(searchTerm) {
    if (!searchTerm) {
        displayProducts(allProducts);
        return;
    }

    const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filtered);
}
