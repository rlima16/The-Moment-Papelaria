// VARIÁVEIS GLOBAIS
let cart = []; // Inicia o carrinho

// FUNÇÕES DE INICIALIZAÇÃO DA PÁGINA
window.onload = function() {
    loadCartFromSession();
    displayAllProducts();
};

function loadCartFromSession() {
    const cartData = sessionStorage.getItem('shoppingCart');
    if (cartData) {
        cart = JSON.parse(cartData);
    }
    updateCartCount(); // <-- ADICIONADO: Atualiza a contagem assim que o carrinho é carregado
}

// FUNÇÃO NOVA PARA ATUALIZAR O CONTADOR
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// FUNÇÕES PRINCIPAIS DA PÁGINA
function displayAllProducts() {
    const productsList = document.getElementById('all-products-list');
    if (!productsList) return; // Segurança caso o elemento não exista
    productsList.innerHTML = '';

    // A variável 'products' vem do arquivo 'products-data.js'
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

function addToCart(productId) {
    // A variável 'products' vem do arquivo 'products-data.js'
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        saveCartToSession();
        updateCartCount(); // <-- ADICIONADO: Atualiza a contagem ao adicionar um item
        alert(`"${product.title}" foi adicionado ao carrinho!`);
    }
}

function saveCartToSession() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// FUNÇÕES DO LIGHTBOX
function openLightbox(imageUrl) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imageUrl;
    lightbox.classList.remove('hidden');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
}