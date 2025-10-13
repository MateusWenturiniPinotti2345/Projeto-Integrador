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

// Abre modal de detalhes do lanche
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

// Verifica login
function verificarLogin() {
  const modalDetalhes = bootstrap.Modal.getInstance(document.getElementById('detalhesModal'));
  modalDetalhes.hide();

  if (!usuarioLogado) {
    new bootstrap.Modal(document.getElementById('loginModal')).show();
  } else {
    new bootstrap.Modal(document.getElementById('enderecoModal')).show();
  }
}

// Login simples
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

// Gera número de pedido sequencial
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

// Cupom de desconto
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

// Filtro de produtos
function filtrar(categoria) {
  const produtos = document.querySelectorAll('.produto');
  produtos.forEach(prod => {
    prod.style.display = (categoria === 'all' || prod.dataset.categoria === categoria) ? 'block' : 'none';
  });
}
