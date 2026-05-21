document.addEventListener("DOMContentLoaded", function () {
  renderizarPedidos();
  configurarLimparPedidos()
});

function renderizarPedidos() {
  const lista = document.querySelector("#lista-pedidos");
  const spanTotal = document.querySelector("#valor-total");
  const spanResumo = document.querySelector("#valor-total-resumo");
  const spanContador = document.querySelector("#contador-itens");

  // Se não encontrar a lista, interrompe a função
  if (!lista) return;

  const pedidos = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");

  if (pedidos.length === 0) {
    lista.innerHTML =
      "<li class='pedido-vazio'> Nenhum pedido ainda. Acesse o" +
      "<a href='index.html'> Cardápio </a> Para adicionar! 😋 </li>";

    if (spanTotal) spanTotal.textContent = "R$0,00";
    if (spanResumo) spanResumo.textContent = "R$0,00";
    if (spanContador) spanContador.textContent = "0 itens";
    return
  }

  lista.innerHTML = "";
  let total = 0;

  pedidos.forEach(function (pedido, indice) {
    const li = document.createElement("li");
    li.classList.add("item-pedido");

    const textoSpan = document.createElement("span");
    textoSpan.innerHTML =
      "<strong>" +
      pedido.nome +
      "</strong>" +
      "-" +
      pedido.qtd +
      "X" +
      "R$ " +
      pedido.preco.toFixed(2).replace(".", ",") +
      " = <span class='subtotal-item'> R$ " +
      pedido.subtotal.toFixed(2).replace(".", ",") +
      "</span>";

    // Cria um botão para remover o item do resumo
    const btnRemover = document.createElement("button");

    // Define o texto do botão como "X"
    btnRemover.textContent = "✕";

    // Adiciona uma classe ao botão para estilização
    btnRemover.classList.add("btn-remover");

    //Ação de remover
    // Quando o botão de remover é clicado
    btnRemover.addEventListener("click", () => {
      const lista = JSON.parse(
        localStorage.getItem("techfood_pedidos") || "[]",
      );

      lista.splice(indice, 1);

      localStorage.setItem("techfood_pedidos" , JSON.stringify(lista));
      renderizarPedidos();
    });

    // Adiciona o texto dentro do item da lista
    li.appendChild(textoSpan);

    // Adiciona o botão de remover dentro do item
    li.appendChild(btnRemover);

    // Adiciona o item completo na lista de resumo
    lista.appendChild(li);
    total += pedido.subtotal;
  });

  const totalFmt = "R$" + total.toFixed(2).replace(".", ",");
  if (spanTotal) spanTotal.textContent = totalFmt;
  if (spanResumo) spanResumo.textContent = totalFmt;

  const totalItens = pedidos.reduce(function (acc, p) {
    return acc + p.qtd;
  }, 0);

  if (spanContador) {
    spanContador.textContent =
      totalItens + (totalItens === 1 ? "item" : "itens");
  }
}

function configurarLimparPedidos() {
  const btn = document.querySelector("#btn-limpar-pedidos");

  if (!btn) return;

  btn.addEventListener("click", function () {
    localStorage.removeItem("techfood_pedidos");
    renderizarPedidos();
  });
}
