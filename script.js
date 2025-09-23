// Lista de imagens do carrossel
const carouselImages = [
    'https://down-bs-br.img.susercontent.com/br-11134210-7r98o-mbkd16ucq6bce5.webp',
    'https://down-bs-br.img.susercontent.com/br-11134210-7r98o-mbkd16ucaq5e1a.webp',
    'https://down-bs-br.img.susercontent.com/br-11134210-7r98o-mbkd16ucaq2g28.webp',
    // Adicione quantos links de imagem você quiser aqui
];

console.log("DEBUG: script.js - Arquivo foi lido pelo navegador.");

document.addEventListener('DOMContentLoaded', function () {
    console.log("DEBUG: DOMContentLoaded - O DOM foi carregado.");
    loadCartFromSession();
    displayProducts();
    updateCartDisplay();
    console.log("DEBUG: DOMContentLoaded - Funções de inicialização foram chamadas.");
});

// -----------------------------------------------------------
// LÓGICA DO CARRINHO
// -----------------------------------------------------------
let cart = [];

function loadCartFromSession() {
    console.log("DEBUG: loadCartFromSession - procurando carrinho na memória...");
    const cartData = sessionStorage.getItem('shoppingCart');
    console.log("DEBUG: loadCartFromSession - Dados encontrados na memória:", cartData);

    if (cartData && cartData !== '[]') {
        try {
            cart = JSON.parse(cartData);
            if (!Array.isArray(cart)) cart = [];
            console.log("DEBUG: loadCartFromSession - Carrinho foi populado com itens:", cart);
        } catch (e) {
            cart = [];
            console.log("DEBUG: loadCartFromSession - Erro ao fazer parse do carrinho:", e);
        }
    } else {
        cart = [];
        console.log("DEBUG: loadCartFromSession - Nenhum item encontrado na memória.");
    }
}

window.addToCart = function(productId) {
    if (typeof products === "undefined") return;
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartDisplay();
        const cartElement = document.getElementById('cart');
        if(cartElement) cartElement.classList.remove('hidden'); 
        sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
}

window.removeFromCart = function(itemIndex) {
    cart.splice(itemIndex, 1); 
    updateCartDisplay();
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
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

window.toggleCart = function() {
    const cartElement = document.getElementById('cart');
    if(cartElement) cartElement.classList.toggle('hidden');
}

// -----------------------------------------------------------
// EXIBIÇÃO DOS PRODUTOS
// -----------------------------------------------------------
function displayProducts() {
    const carouselWrapper = document.getElementById('carousel-wrapper');
    if (!carouselWrapper) return;

    // Limpa o wrapper antes de adicionar slides
    carouselWrapper.innerHTML = '';

    // Adiciona cada imagem da nossa lista ao carrossel
    carouselImages.forEach(imageUrl => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        const img = document.createElement('img');
        img.src = imageUrl;
        slide.appendChild(img);
        carouselWrapper.appendChild(slide);
    });

    // Inicializa o Swiper com as opções desejadas
    if (typeof Swiper !== "undefined") {
        new Swiper(".mySwiper", {
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    } else {
        console.warn("Swiper não foi carregado.");
    }
}

// -----------------------------------------------------------
// CHECKOUTS
// -----------------------------------------------------------
window.checkout = function() {
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
    if (cart.length === 0) { alert("Seu carrinho está vazio."); return; }
    const orderId = "TM-" + Date.now();
    const orderIdEl = document.getElementById('order-id');
    const pixValueEl = document.getElementById('pix-value');
    if(orderIdEl) orderIdEl.textContent = orderId;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if(pixValueEl) pixValueEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');
    const destaques = document.getElementById('destaques');
    const contato = document.getElementById('contato');
    const pixInstructions = document.getElementById('pix-instructions');
    const cartEl = document.getElementById('cart');
    if(header) header.classList.add('hidden');
    if(hero) hero.classList.add('hidden');
    if(destaques) destaques.classList.add('hidden');
    if(contato) contato.classList.add('hidden');
    if(pixInstructions) pixInstructions.classList.remove('hidden');
    if(cartEl) cartEl.classList.add('hidden');
}

window.copyPixKey = function() {
    const pixKeyInput = document.getElementById('pix-key');
    pixKeyInput.select();
    pixKeyInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Chave PIX copiada!");
}

window.backToStore = function() {
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');
    const destaques = document.getElementById('destaques');
    const contato = document.getElementById('contato');
    const pixInstructions = document.getElementById('pix-instructions');
    if(header) header.classList.remove('hidden');
    if(hero) hero.classList.remove('hidden');
    if(destaques) destaques.classList.remove('hidden');
    if(contato) contato.classList.remove('hidden');
    if(pixInstructions) pixInstructions.classList.add('hidden');
}

// -----------------------------------------------------------
// LÓGICA DO LIGHTBOX
// -----------------------------------------------------------
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
    if(lightbox) lightbox.classList.add('hidden');
}
