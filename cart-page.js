// Este script é executado assim que a página carrinho.html é carregada
window.onload = function() {
    loadCartSummary();
};

let cart = []; // Variável para armazenar o carrinho nesta página
const products = []; // Precisaremos dos produtos aqui também para o checkout

function loadCartSummary() {
    const cartSummaryContainer = document.getElementById('cart-page-summary');
    const emptyCartMessage = document.querySelector('.cart-page-empty');

    const cartData = sessionStorage.getItem('shoppingCart');

    if (cartData && JSON.parse(cartData).length > 0) {
        cart = JSON.parse(cartData);
        
        let itemsHtml = '<table>';
        itemsHtml += `
            <tr>
                <th>Produto</th>
                <th>Preço</th>
                <th>Ação</th> 
            </tr>
        `;
        
        cart.forEach((item, index) => {
            itemsHtml += `
                <tr>
                    <td>${item.title}</td>
                    <td>R$ ${item.price.toFixed(2).replace('.', ',')}</td>
                    <td>
                        <button class="remove-btn-page" onclick="removeFromCart(${index})">Remover</button>
                    </td>
                </tr>
            `;
        });
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        
        itemsHtml += `
            <tr class="total-row">
                <td colspan="2"><b>Total</b></td>
                <td><b>R$ ${total.toFixed(2).replace('.', ',')}</b></td>
            </tr>
        </table>
        `;

        // 👇 BOTÃO ADICIONADO AQUI 👇
        itemsHtml += `
            <div class="cart-page-actions">
                <a href="produtos.html" class="btn btn-secondary">Continuar Comprando</a>
            </div>
        `;

        itemsHtml += `
            <div class="payment-methods">
                <h3>Escolha como pagar:</h3>
                <button class="btn" onclick="checkoutWithPix()">Pagar com PIX</button>
                <button class="btn" onclick="checkout()">Pagar com PagBank</button>
            </div>
        `;
        
        cartSummaryContainer.innerHTML = itemsHtml;
        emptyCartMessage.classList.add('hidden');

    } else {
        cartSummaryContainer.classList.add('hidden');
        emptyCartMessage.classList.remove('hidden');
    }
}

function removeFromCart(itemIndex) {
    // Remove o item da lista (array)
    cart.splice(itemIndex, 1);

    // Salva o carrinho atualizado na memória do navegador
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));

    // Recarrega o resumo para mostrar a mudança
    loadCartSummary();
}


/// -----------------------------------------------------------
// LÓGICA DO CHECKOUT PIX (MANUAL) - ADAPTADA PARA A PÁGINA DO CARRINHO
// -----------------------------------------------------------
function checkoutWithPix() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }

    // Gera um ID de pedido e define o valor total na janela do PIX
    const orderId = "TM-" + Date.now();
    document.getElementById('order-id').textContent = orderId;

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('pix-value').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

    // Apenas mostra a janela de instruções do PIX
    document.getElementById('pix-instructions').classList.remove('hidden');
}

function copyPixKey() {
    const pixKeyInput = document.getElementById('pix-key');
    pixKeyInput.select();
    pixKeyInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Chave PIX copiada!");
}

function backToStore() {
    // Nesta página, o botão apenas esconde a janela do PIX
    document.getElementById('pix-instructions').classList.add('hidden');
}

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
        idInput.value = item.id || i; // Garante um ID
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