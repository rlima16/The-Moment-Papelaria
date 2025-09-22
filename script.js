console.log("DEBUG: script.js - Arquivo foi lido pelo navegador.");

window.onload = function() {
    console.log("DEBUG: window.onload - A página inteira (incluindo imagens) terminou de carregar.");
    loadCartFromSession();
    displayProducts();
    updateCartDisplay();
    console.log("DEBUG: window.onload - Funções de inicialização foram chamadas.");
};

// -----------------------------------------------------------
// LÓGICA DO CARRINHO
// -----------------------------------------------------------
let cart = [];

function loadCartFromSession() {
    console.log("DEBUG: loadCartFromSession - procurando carrinho na memória...");
    const cartData = sessionStorage.getItem('shoppingCart');
    
    // Este log é o mais importante de todos!
    console.log("DEBUG: loadCartFromSession - Dados encontrados na memória:", cartData);

    if (cartData && cartData !== '[]') {
        cart = JSON.parse(cartData);
        console.log("DEBUG: loadCartFromSession - Carrinho foi populado com itens:", cart);
    } else {
        console.log("DEBUG: loadCartFromSession - Nenhum item encontrado na memória.");
    }
}

window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartDisplay();
        document.getElementById('cart').classList.remove('hidden'); 
    }
}

window.removeFromCart = function(itemIndex) {
    cart.splice(itemIndex, 1); 
    updateCartDisplay();
}

function updateCartDisplay() {
    console.log("DEBUG: updateCartDisplay - Função chamada. O carrinho atual tem " + cart.length + " itens.");
    
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    
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
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if(cartTotalElement) {
        cartTotalElement.textContent = total.toFixed(2).replace('.', ',');
    }
    if(cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
    console.log("DEBUG: updateCartDisplay - Salvando " + cart.length + " itens na memória.");
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// ... O RESTO DAS FUNÇÕES CONTINUAM IGUAIS (toggleCart, displayProducts, checkouts, lightbox, etc) ...
// (Não precisa colar o resto aqui, apenas substitua o arquivo inteiro como pedi)

window.toggleCart = function() {
    const cartElement = document.getElementById('cart');
    cartElement.classList.toggle('hidden');
}

// -----------------------------------------------------------
// EXIBIÇÃO DOS PRODUTOS
// -----------------------------------------------------------
function displayProducts() {
    // ... (o conteúdo desta função continua o mesmo de antes)
    const productsList = document.getElementById('produtos-list');
    if (!productsList) return;
    productsList.innerHTML = ''; 
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
window.checkout = function() {
    // ... (o conteúdo desta função continua o mesmo de antes)
    if (cart.length === 0) { alert("Seu carrinho está vazio."); return; }
    let form = document.createElement("form");
    form.method = "POST";
    form.action = "https://pagseguro.uol.com.br/v2/checkout/payment.html";
    form.target = "_blank";
    let emailInput = document.createElement("input");
    emailInput.type = "hidden";
    emailInput.name = "receiverEmail";
    emailInput.value = "shop.themomentofficial@gmail.com";
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

window.checkoutWithPix = function() {
    // ... (o conteúdo desta função continua o mesmo de antes)
    if (cart.length === 0) { alert("Seu carrinho está vazio."); return; }
    const orderId = "TM-" + Date.now();
    document.getElementById('order-id').textContent = orderId;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('pix-value').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    document.querySelector('header').classList.add('hidden');
    document.querySelector('.hero').classList.add('hidden');
    document.getElementById('destaques').classList.add('hidden');
    document.getElementById('contato').classList.add('hidden');
    document.getElementById('pix-instructions').classList.remove('hidden');
    document.getElementById('cart').classList.add('hidden');
}

window.copyPixKey = function() {
    const pixKeyInput = document.getElementById('pix-key');
    pixKeyInput.select();
    pixKeyInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Chave PIX copiada!");
}

window.backToStore = function() {
    document.querySelector('header').classList.remove('hidden');
    document.querySelector('.hero').classList.remove('hidden');
    document.getElementById('destaques').classList.remove('hidden');
    document.getElementById('contato').classList.remove('hidden');
    document.getElementById('pix-instructions').classList.add('hidden');
}

// -----------------------------------------------------------
// LÓGICA DO LIGHTBOX
// -----------------------------------------------------------
window.openLightbox = function(imageUrl) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imageUrl;
    lightbox.classList.remove('hidden');
}

window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
}
