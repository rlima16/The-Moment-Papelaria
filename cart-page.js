let cart = [];

window.onload = function() {
    loadCartSummary();
};

function loadCartSummary() {
    const summaryContainer = document.getElementById('cart-page-summary');
    const checkoutContainer = document.getElementById('checkout-container');
    const emptyCartMessage = document.querySelector('.cart-page-empty');
    
    const cartData = sessionStorage.getItem('shoppingCart');

    if (cartData && JSON.parse(cartData).length > 0) {
        cart = JSON.parse(cartData);
        
        // ---- Constrói a tabela de resumo ----
        let tableHtml = '<table>';
        tableHtml += `
            <tr>
                <th>Produto</th>
                <th>Preço</th>
                <th>Ação</th> 
            </tr>
        `;
        cart.forEach((item, index) => {
            tableHtml += `
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
        tableHtml += `
            <tr class="total-row">
                <td colspan="2"><b>Total</b></td>
                <td><b>R$ ${total.toFixed(2).replace('.', ',')}</b></td>
            </tr>
        </table>`;
        summaryContainer.innerHTML = tableHtml;

        // ---- Mostra o container de checkout (formulário e botões) ----
        checkoutContainer.classList.remove('hidden');
        emptyCartMessage.classList.add('hidden');

    } else {
        // Mostra a mensagem de carrinho vazio
        summaryContainer.classList.add('hidden');
        checkoutContainer.classList.add('hidden');
        emptyCartMessage.classList.remove('hidden');
    }
}

window.removeFromCart = function(itemIndex) {
    cart.splice(itemIndex, 1);
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    loadCartSummary(); // Recarrega a página para mostrar a mudança
}

window.sendOrderByWhatsApp = function() {
    const form = document.getElementById('customer-form');
    if (!form.checkValidity()) {
        alert("Por favor, preencha todos os campos (Nome, E-mail, CPF).");
        return;
    }

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;
    const orderId = "TM-" + Date.now();
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    let orderDescription = cart.map(item => `- ${item.title} (R$ ${item.price.toFixed(2).replace('.',',')})\n  Imagem: ${item.image}`).join('\n\n');

    let message = `Olá! 👋 Gostaria de fazer o seguinte pedido:\n\n*Nº do Pedido:* ${orderId}\n\n*Cliente:* ${nome}\n*E-mail:* ${email}\n*CPF:* ${cpf}\n\n*Itens do Pedido:*\n${orderDescription}\n\n*Total:* R$ ${total.toFixed(2).replace('.', ',')}`;
    const yourWhatsappNumber = "5511934165911";

    const whatsappUrl = `https://wa.me/${yourWhatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    document.querySelector('.whatsapp-send-container').classList.add('hidden');
    document.getElementById('payment-options-container').classList.remove('hidden');
}

// -----------------------------------------------------------
// FUNÇÕES DE CHECKOUT E PAGAMENTO
// -----------------------------------------------------------

window.checkoutWithPix = function() {
    if (cart.length === 0) return;
    const orderId = "TM-" + Date.now();
    document.getElementById('order-id').textContent = orderId;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('pix-value').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    document.getElementById('pix-instructions').classList.remove('hidden');
}

window.copyPixKey = function() {
    const pixKeyInput = document.getElementById('pix-key');
    pixKeyInput.select();
    pixKeyInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Chave PIX copiada!");
}

window.backToStore = function() {
    document.getElementById('pix-instructions').classList.add('hidden');
}

window.checkout = function() {
    if (cart.length === 0) return;
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
        idInput.value = item.id || i;
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
