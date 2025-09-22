// Aguarda o carregamento completo da página para executar o script
window.onload = function() {
    loadCartFromSession(); // Carrega o carrinho da memória
    displayProducts();     // Mostra os produtos em destaque
    updateCartDisplay();   // Atualiza a exibição do carrinho (contador e itens)
};

// -----------------------------------------------------------
// LÓGICA DO CARRINHO
// -----------------------------------------------------------
let cart = [];

// Carrega o carrinho salvo na memória do navegador
function loadCartFromSession() {
    const cartData = sessionStorage.getItem('shoppingCart');
    if (cartData) {
        cart = JSON.parse(cartData);
    }
}

// Adiciona um produto ao carrinho
function addToCart(productId) {
    // A variável 'products' vem do arquivo 'products-data.js'
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartDisplay();
        document.getElementById('cart').classList.remove('hidden'); 
    }
}

// Remove um produto do carrinho
function removeFromCart(itemIndex) {
    cart.splice(itemIndex, 1); 
    updateCartDisplay();
}

// Atualiza a exibição do carrinho (contador, lista de itens) e salva na memória
function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    
    // Limpa a lista de itens no carrinho flutuante
    if (cartItemsElement) {
        cartItemsElement.innerHTML = ''; 
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.title} - R$ ${item.price.toFixed(2).replace('.',',')}
                <span class="remove-item" onclick="removeFromCart(${index})">remover</span>
            `;
            cartItemsElement.appendChild(li);
        });
    }

    // Calcula e mostra o total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if(cartTotalElement) {
        cartTotalElement.textContent = total.toFixed(2).replace('.', ',');
    }
    
    // Atualiza o contador no cabeçalho
    if(cartCountElement) {
        cartCountElement.textContent = cart.length;
    }

    // Salva o estado atual do carrinho na memória do navegador
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Mostra ou esconde o carrinho flutuante
function toggleCart() {
    const cartElement = document.getElementById('cart');
    cartElement.classList.toggle('hidden');
}


// -----------------------------------------------------------
// EXIBIÇÃO DOS PRODUTOS EM DESTAQUE
// -----------------------------------------------------------
function displayProducts() {
    const productsList = document.getElementById('produtos-list');
    productsList.innerHTML = ''; 

    // Filtra para pegar apenas os produtos com "featured: true"
    const featuredProducts = products.filter(product => product.featured === true);

    featuredProducts.forEach(product => {
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


// -----------------------------------------------------------
// CHECKOUTS
// -----------------------------------------------------------

// Checkout com PagBank
function checkout() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }

    let form = document.createElement("form");
    form.method = "POST";
    form.action = "https://pagseguro.uol.com.br/v2/checkout/payment.html";
    form.target = "_blank";

    let emailInput = document.createElement("input");
    emailInput.type = "hidden";
    emailInput.name = "receiverEmail";
    emailInput.value = "SEU_EMAIL_PAGBANK@EMAIL.COM";
    form.appendChild(emailInput);
    
    let currencyInput = document.createElement("input");
    currencyInput.type = "hidden";
    currencyInput.name = "currency";
    currencyInput.value = "BRL";
    form.appendChild(currencyInput);

    let charsetInput = document.createElement("input");
    charsetInput.type = "hidden";
    charsetInput.name = "charset";
    charsetInput.value = "UTF-8";
    form.appendChild(charsetInput);

    cart.forEach((item, index) => {
        let i = index + 1;
        let idInput = document.createElement("input");
        idInput.type = "hidden";
        idInput.name = `itemId${i}`;
        idInput.value = item.id;
        form.appendChild(idInput);
        let descInput = document.createElement("input");
        descInput.type = "hidden";
        descInput.name = `itemDescription${i}`;
        descInput.value = item.title;
        form.appendChild(descInput);
        let amountInput = document.createElement("input");
        amountInput.type = "hidden";
        amountInput.name = `itemAmount${i}`;
        amountInput.value = item.price.toFixed(2);
        form.appendChild(amountInput);
        let quantityInput = document.createElement("input");
        quantityInput.type = "hidden";
        quantityInput.name = `itemQuantity${i}`;
        quantityInput.value = 1;
        form.appendChild(quantityInput);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

// Checkout com PIX (Manual)
function checkoutWithPix() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }
    
    const orderId = "TM-" + Date.now();
    document.getElementById('order-id').textContent = orderId;

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('pix-value').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Esconde as seções da página inicial
    document.querySelector('header').classList.add('hidden');
    document.querySelector('.hero').classList.add('hidden');
    document.getElementById('destaques').classList.add('hidden'); // <-- CORRIGIDO AQUI
    document.getElementById('contato').classList.add('hidden');
    
    // Mostra a janela de instruções do PIX
    document.getElementById('pix-instructions').classList.remove('hidden');
    
    // Garante que o carrinho lateral seja fechado
    document.getElementById('cart').classList.add('hidden');
}

function copyPixKey() {
    const pixKeyInput = document.getElementById('pix-key');
    pixKeyInput.select();
    pixKeyInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Chave PIX copiada!");
}

function backToStore() {
    // Mostra as seções da página inicial novamente
    document.querySelector('header').classList.remove('hidden');
    document.querySelector('.hero').classList.remove('hidden');
    document.getElementById('destaques').classList.remove('hidden'); // <-- LINHA CORRIGIDA
    document.getElementById('contato').classList.remove('hidden');

    // Esconde a janela de instruções do PIX
    document.getElementById('pix-instructions').classList.add('hidden');
}

// -----------------------------------------------------------
// LÓGICA DO LIGHTBOX DE IMAGEM
// -----------------------------------------------------------
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
