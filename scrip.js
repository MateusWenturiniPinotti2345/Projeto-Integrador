//telapedidos

let subtotal = 0;

function adicionarCarrinho(preco) {
    subtotal += preco;
    atualizarSubtotal();
}

function atualizarSubtotal() {
    document.getElementById('subtotal').textContent = `Subtotal: R$ ${subtotal.toFixed(2)}`;
}

function calcularFrete() {
    const cep = document.getElementById('cep').value;
    if (!cep) {
        alert('Digite um CEP válido.');
        return;
    }
    const frete = 10; // Valor fixo simulado
    subtotal += frete;
    atualizarSubtotal();
    alert(`Frete calculado: R$ ${frete.toFixed(2)}`);
}

function aplicarCupom() {
    const cupom = document.getElementById('cupom').value;
    if (cupom === "KOHLL10") {
        const desconto = subtotal * 0.1;
        subtotal -= desconto;
        atualizarSubtotal();
        alert(`Cupom aplicado! Você ganhou R$ ${desconto.toFixed(2)} de desconto.`);
    } else {
        alert('Cupom inválido.');
    }
}

function filtrar(categoria) {
    const produtos = document.querySelectorAll('.produto');
    produtos.forEach(prod => {
        if(categoria === 'all' || prod.dataset.categoria === categoria) {
            prod.parentElement.style.display = 'block';
        } else {
            prod.parentElement.style.display = 'none';
        }
    });
}
