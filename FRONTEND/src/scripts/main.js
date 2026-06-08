document.addEventListener("DOMContentLoaded", function(){
    renderizarCardapio();
    inicializarVitrini();
});

async function renderizarCardapio() {
    const grid = document.querySelector("#grid-cardapio");
    if(!grid) return;

    grid.innerHTML = `<p class='loading'>Carregando Cardápio...</p>`;

    try {
        const produtos = await buscarProdutos();
        grid.innerHTML = "";

        // Corrigido: parâmetro no singular 'produto'
        produtos.forEach(function(produto){ 
            const card = document.createElement("article");
            card.classList.add("card");
            card.setAttribute("data-id", produto.id);
            
            // Corrigido: Removidos os sinais de '+' e corrigido as aspas de class='desc'
            card.innerHTML = `
                <h3>${produto.nome}</h3>
                <p class='desc'>${produto.descricao}</p>
                <div class='quantidade-box'>
                    <button class='btn-menos'>-</button>
                    <span class='qtd-valor'>1</span>
                    <button class='btn-mais'>+</button>
                </div>
                <span class='preco' data-preco='${produto.preco}'>
                    R$ ${parseFloat(produto.preco).toFixed(2).replace(".",",")}
                </span>
                <button class='btn-pedido'>Pedir Agora</button>
            `;

            grid.appendChild(card);
        });

        // O efeito de hover precisa ser ativado DEPOIS que os cards são colocados na tela
        inicializarHoverCards();

    } catch (erro) {
        console.error(erro);
        grid.innerHTML = `<p class='loading erro'>Erro ao carregar o cardápio. Verifique se o servidor está rodando.</p>`;
    }
}

function inicializarHoverCards(){
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-5px)";
            card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0)";
            card.style.boxShadow = "none";
        });
    });
}

function inicializarVitrini(){
    const main = document.querySelector("main");
    if(!main) return;

    main.addEventListener("click", (event) => {
        const clicado = event.target;

        // Botão Menos
        if (clicado.classList.contains("btn-menos")) {
            const prato = clicado.parentElement;
            const spanQtd = prato.querySelector('.qtd-valor');
            const valorAtual = Number(spanQtd.textContent);
            spanQtd.textContent = Math.max(1, valorAtual - 1);
            atualizarPrecoCard(prato);
            return;
        }

        // Botão Mais
        if (clicado.classList.contains("btn-mais")) {
            const prato = clicado.parentElement;
            const spanQtd = prato.querySelector('.qtd-valor');
            spanQtd.textContent = Number(spanQtd.textContent) + 1;
            atualizarPrecoCard(prato);
            return;
        }

        // Botão Pedir Agora
        if (clicado.classList.contains("btn-pedido")) {
            event.preventDefault();
            const card = clicado.parentElement;
            const produtoId = Number(card.getAttribute("data-id"));
            const quantidade = Number(card.querySelector(".qtd-valor").textContent);

            // Corrigido: Passando os argumentos de forma direta e limpa
            salvarPedido(produtoId, quantidade, clicado);
        }
    });
}

function atualizarPrecoCard(prato) {
    const card = prato.parentElement;
    const spanPreco = card.querySelector('.preco');
    const precoUnitario = parseFloat(spanPreco.getAttribute('data-preco'));
    const quantidade = Number(prato.querySelector('.qtd-valor').textContent);

    const total = precoUnitario * quantidade;

    spanPreco.textContent = "R$ " + total.toFixed(2).replace('.', ',');
    spanPreco.style.color = total > 150 ? "#c0892b" : "#e67e22";
}

// Corrigido: Recebendo os parâmetros na ordem correta
function salvarPedido(produtoId, quantidade, botao){
    const card = botao.parentElement;
    const nome = card.querySelector("h3").textContent;
    const preco = parseFloat(card.querySelector(".preco").getAttribute("data-preco"));
    const subtotal = preco * quantidade; 
    
    const lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
    lista.push({
        produto_id: produtoId,
        quantidade,
        nome,
        preco,
        subtotal
    });
    localStorage.setItem("techfood_pedidos", JSON.stringify(lista));

    // Corrigido: Substituído 'clicado' por 'botao'
    const textoOriginal = botao.textContent;
    botao.textContent = "Adicionado 🥳";
    botao.style.backgroundColor = "#27ae60";
    botao.disabled = true; 

    atualizarContadorPedidos();

    setTimeout(() => {
        botao.textContent = textoOriginal;
        botao.style.backgroundColor = "";
        botao.disabled = false;
    }, 1500);
}

function atualizarContadorPedidos(){
    // Seu código do contador aqui...
}