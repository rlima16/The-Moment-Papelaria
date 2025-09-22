// Aguarda o carregamento completo da página para executar o script
window.onload = function() {
    displayProducts();
    updateCartDisplay();
};

// -----------------------------------------------------------
// 1. LISTA DE PRODUTOS
// -----------------------------------------------------------
const products = [
    {
        id: 1,
        image: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lx78228g7beed9.webp',
        title: 'Topo de Bolo Magali Frutas',
        price: 10.00
    },
    {
        id: 2,
        image: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lxv4pqn3ddxb6e.webp',
        title: 'Topo de Bolo Sonic',
        price: 15.00
    },
    {
        id: 3,
        image: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-mdelcsilyh154c.webp',
        title: 'Topo de Bolo O Poderoso Chefinho',
        price: 10.90
    },
    {
        id: 4,
        image: 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lxv4wyr8kgomab.webp',
        title: 'Topo de Bolo Turma da Monica Baloes',
        price: 10.00
    }
];

// -----------------------------------------------------------
// 2. LÓGICA DO CARRINHO
// -----------------------------------------------------------
let cart = [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartDisplay();
        document.getElementById('cart').classList.remove('hidden'); 
    }
}

function removeFromCart(itemIndex) {
    cart.splice(itemIndex, 1); 
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    cartItemsElement.innerHTML = ''; 

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.title} - R$ ${item.price.toFixed(2).replace('.',',')}
            <span class="remove-item" onclick="removeFromCart(${index})">remover</span>
        `;
        cartItemsElement.appendChild(li);
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalElement.textContent = total.toFixed(2).replace('.', ',');
    cartCountElement.textContent = cart.length;
}

function toggleCart() {
    const cartElement = document.getElementById('cart');
    cartElement.classList.toggle('hidden');
}


// -----------------------------------------------------------
// 3. EXIBIÇÃO DOS PRODUTOS
// -----------------------------------------------------------
function displayProducts() {
    const productsList = document.getElementById('produtos-list');
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


// -----------------------------------------------------------
// 4. CHECKOUT COM PAGBANK
// -----------------------------------------------------------
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
    emailInput.value = "tatianesilvasantos@live.com";
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


// -----------------------------------------------------------
// 5. LÓGICA DO CHECKOUT PIX (MANUAL)
// -----------------------------------------------------------
function checkoutWithPix() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }
    
    const orderId = "TM-" + Date.now();
    document.getElementById('order-id').textContent = orderId;
    
    document.querySelector('header').classList.add('hidden');
    document.querySelector('.hero').classList.add('hidden');
    document.getElementById('produtos').classList.add('hidden');
    document.getElementById('contato').classList.add('hidden');
    document.getElementById('pix-instructions').classList.remove('hidden');
    
    toggleCart();
}

function copyPixKey() {
    const pixKeyInput = document.getElementById('pix-key');
    pixKeyInput.select();
    pixKeyInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Chave PIX copiada!");
}

function backToStore() {
    document.querySelector('header').classList.remove('hidden');
    document.querySelector('.hero').classList.remove('hidden');
    document.getElementById('produtos').classList.remove('hidden');
    document.getElementById('contato').classList.remove('hidden');
    document.getElementById('pix-instructions').classList.add('hidden');
}

// -----------------------------------------------------------
// 6. LÓGICA DO LIGHTBOX DE IMAGEM
// -----------------------------------------------------------

function openLightbox(imageUrl) {
  // Pega os elementos do lightbox no HTML
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  // Define a imagem a ser mostrada
  lightboxImg.src = imageUrl;
  
  // Mostra o lightbox
  lightbox.classList.remove('hidden');
}

function closeLightbox() {
  // Esconde o lightbox
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('hidden');
}
