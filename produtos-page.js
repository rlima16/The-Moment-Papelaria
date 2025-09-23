// Este script agora é um módulo para consistência
let cart = [];

// Use o DOMContentLoaded para garantir carregamento após o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromSession();
    displayAllProducts();
});

// Carrega o carrinho da sessão
function loadCartFromSession() {
    const cartData = sessionStorage.getItem('shoppingCart');
    if (cartData) {
        try {
            cart = JSON.parse(cartData);
        } catch (e) {
            cart = [];
        }
    }
    updateCartCount();
}

// Atualiza contador do carrinho
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// Mostra todos os produtos
function displayAllProducts() {
    const productsList = document.getElementById('all-products-list');
    if (!productsList || typeof products === "undefined") return;
    productsList.innerHTML = '';

    products.forEach(product => {
        const priceFormatted = Number(product.price).toFixed(2).replace('.', ',');
        const card = document.createElement('div');
        card.className = 'card';

        // Imagem
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.title;
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openLightbox(product.image));

        // Título
        const h3 = document.createElement('h3');
        h3.textContent = product.title;

        // Preço
        const p = document.createElement('p');
        p.textContent = `R$ ${priceFormatted}`;

        // Botão
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = 'Adicionar ao Carrinho';
        btn.addEventListener('click', () => addToCart(product.id));

        // Monta o card
        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(p);
        card.appendChild(btn);

        productsList.appendChild(card);
    });
}

// Função global para adicionar ao carrinho
window.addToCart = function(productId) {
    if (typeof products === "undefined") return;
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        saveCartToSession();
        updateCartCount();
        alert(`"${product.title}" foi adicionado ao carrinho!`);
    }
};

// Salva carrinho na sessão
function saveCartToSession() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// 👇 FUNÇÕES DO LIGHTBOX (expostas globalmente) 👇
window.openLightbox = function(imageUrl) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
        lightboxImg.src = imageUrl;
        lightbox.classList.remove('hidden');
    }
};

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.add('hidden');
        // Limpa o src para evitar flicker/stale image
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightboxImg) lightboxImg.src = '';
    }
};
