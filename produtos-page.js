// Este script agora é um módulo para consistência
let cart = [];

window.onload = function() {
    loadCartFromSession();
    displayAllProducts();
};

function loadCartFromSession() {
    const cartData = sessionStorage.getItem('shoppingCart');
    if (cartData) {
        cart = JSON.parse(cartData);
    }
    updateCartCount();
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

function displayAllProducts() {
    const productsList = document.getElementById('all-products-list');
    if (!productsList) return;
    productsList.innerHTML = '';

    products.forEach(product => {
        const priceFormatted = product.price.toFixed(2).replace('.', ',');
        const card = `
            <div class="card">
                <img src="${product.image}" alt="${product.title}" onclick="openLightbox('${product.image}')">
                <h3>${product.title}</h3>
                <p>R$ ${priceFormatted}</p>
                <button class="btn" onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
            </div>
        `;
        productsList.innerHTML += card;
    });
}

window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        saveCartToSession();
        updateCartCount();
        alert(`"${product.title}" foi adicionado ao carrinho!`);
    }
}

function saveCartToSession() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// 👇 FUNÇÕES DO LIGHTBOX CORRIGIDAS (adicionadas ao 'window') 👇
window.openLightbox = function(imageUrl) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if(lightbox && lightboxImg) {
        lightboxImg.src = imageUrl;
        lightbox.classList.remove('hidden');
    }
}

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if(lightbox) {
        lightbox.classList.add('hidden');
    }
}
