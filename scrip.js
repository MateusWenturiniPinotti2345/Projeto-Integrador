let subtotal = 0;
let usuarioLogado = false;
let precoAtual = 0;
let lancheAtual = "";
let descricaoAtual = "";

// Atualiza subtotal
function atualizarSubtotal() {
  document.getElementById('subtotal').textContent = `Subtotal: R$ ${subtotal.toFixed(2)}`;
}

// Adiciona ao carrinho
function adicionarCarrinho(preco) {
  subtotal += preco;
  atualizarSubtotal();
}

// Abre modal do produto
function abrirDetalhes(nome, descricao, preco) {
  lancheAtual = nome;
  descricaoAtual = descricao;
  precoAtual = preco;

  document.getElementById('modalTitulo').textContent = nome;
  document.getElementById('modalDescricao').textContent = descricao;
  document.getElementById('modalPreco').textContent = `R$ ${preco.toFixed(2)}`;

  const btnAdicionar = document.getElementById('btnAdicionar');
  btnAdicionar.onclick = () => verificarLogin();
  new bootstrap.Modal(document.getElementById('detalhesModal')).show();
}

// Verifica login antes de adicionar
function verificarLogin() {
  bootstrap.Modal.getInstance(document.getElementById('detalhesModal')).hide();
  if (!usuarioLogado) {
    new bootstrap.Modal(document.getElementById('loginModal')).show();
  } else {
    new bootstrap.Modal(document.getElementById('enderecoModal')).show();
  }
}

// Simula login
function fazerLogin() {
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;
  if (usuario && senha) {
    usuarioLogado = true;
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    new bootstrap.Modal(document.getElementById('enderecoModal')).show();
  } else {
    alert('Preencha usuário e senha.');
  }
}

// Confirma endereço e salva pedido
function confirmarEndereco() {
  const endereco = document.getElementById('listaEnderecos').value;
  bootstrap.Modal.getInstance(document.getElementById('enderecoModal')).hide();

  const novoPedido = {
    numero: gerarNumeroPedido(),
    data: new Date().toLocaleString('pt-BR'),
    status: "Em preparo",
    itens: [{ nome: lancheAtual, qtd: 1, valor: precoAtual }],
    total: precoAtual,
    endereco: endereco
  };

  salvarPedido(novoPedido);
  adicionarCarrinho(precoAtual);
  alert('Lanche adicionado e pedido criado com sucesso!');
}

// Cria número de pedido sequencial
function gerarNumeroPedido() {
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  return pedidos.length ? pedidos[pedidos.length - 1].numero + 1 : 100;
}

// Salva pedido no localStorage
function salvarPedido(pedido) {
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  pedidos.push(pedido);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Frete fixo
function calcularFrete() {
  const cep = document.getElementById('cep').value;
  if (!cep) {
    alert('Digite um CEP válido.');
    return;
  }
  const frete = 10;
  subtotal += frete;
  atualizarSubtotal();
  alert(`Frete calculado: R$ ${frete.toFixed(2)}`);
}

// Cupom
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

// Filtro de categorias
function filtrar(categoria) {
  const produtos = document.querySelectorAll('.produto');
  produtos.forEach(prod => {
    prod.style.display = (categoria === 'all' || prod.dataset.categoria === categoria) ? 'block' : 'none';
  });
}

// Abre pop-up do carrinho (corrigido)
function abrirCarrinho() {
  if (subtotal === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }
  alert(`Total do carrinho: R$ ${subtotal.toFixed(2)}\nFinalize seu pedido na aba "Pedidos".`);
}
// 🔍 FILTRO DE PESQUISA PELO NOME DO PRODUTO
document.addEventListener('DOMContentLoaded', () => {
  const campoBusca = document.querySelector('header input[type="text"]');
  if (!campoBusca) return;

  campoBusca.addEventListener('input', () => {
    const termo = campoBusca.value.toLowerCase();
    const produtos = document.querySelectorAll('.produto');

    produtos.forEach(prod => {
      const nome = prod.querySelector('h5')?.textContent.toLowerCase() || '';
      if (nome.includes(termo) || termo === '') {
        prod.style.display = 'block';
      } else {
        prod.style.display = 'none';
      }
    });
  });
});
