document.addEventListener("DOMContentLoaded", function(){
    inicializarHoverCards()
    inicializarVitrine()
    renderizarCardapio()
})

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

function inicializarVitrine(){
    const main = document.querySelector("main");
    if(!main)return
    if (main) {
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
                const card = clicado.parentElement
                const produtoId = Number(card.getAttribute("data-id"))
                const quantidade = Number(card.querySelector(".qtd-valor").textContent)

                //adicional açao de salvar pedido
                salvarPedido({ nome:nomePrato, preco: preco, qtd: quantidade     });
            }
        });
    }
}

function atualizarPrecoCard(prato) {
    // Pega o card completo (pai do elemento "prato")
    const card = prato.parentElement
    // Seleciona o elemento onde o preço é exibido
    const spanPreco = card.querySelector('.preco')
    // Pega o preço unitário armazenado no atributo data-preco
    const precoUnitario = parseFloat(
        spanPreco.getAttribute('data-preco')
    )
    // Pega a quantidade atual e converte para número
    const quantidade = Number(
        prato.querySelector('.qtd-valor').textContent
    )
    // Calcula o total (preço unitário * quantidade)
    const total = precoUnitario * quantidade
    // Atualiza o texto do preço no formato brasileiro (R$ 0,00)
    spanPreco.textContent =
        "R$" + total.toFixed(2).replace('.', ',')
    // Muda a cor do preço dependendo do valor total
    // Se for maior que 150 → dourado
    // Caso contrário → laranja
    spanPreco.style.color =
        total > 150 ? "#c0892b" : "#e67e22"
}

function salvarPedido(produtoId, quantidade, botao){
    const card = botao.parentElement
    const nome = card.querySelector('h3').textContent
    const preco = parseFloat(card.querySelector('.preco').getAttribute('data-preco'))
    const subtotal = preco * quantidade
    
    //leu
    const lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]")
    //salvou
    lista.push({
        produto_id: produtoId,
        quantidade,
        nome,
        preco,
        subtotal,
    })
    localStorage.setItem("techfood_pedidos", JSON.stringify(lista))

    // Feedback Visual
    const textoOriginal = clicado.textContent;
        clicado.textContent = "Adicionado 🥳";
        clicado.style.backgroundColor = "#27ae60";
        clicado.disabled = true; // Corrigido: .disabled

        setTimeout(() => {
            clicado.textContent = textoOriginal;
            clicado.style.backgroundColor = "";
            clicado.disabled = false;
        }, 1500);

        atualizarContadorPedidos()
}

function atualizarContadorPedidos(){
    //continua
}

async function renderizarCardapio(){
    const grid = document.querySelector('#grid-cardapio')

    if(!grid) return

    grid.innerHTML = '<p class="loading"> Carregando cardápio... </p> '

    try {
        const produto = await buscarProdutos()

        grid.innerHTML = ""

        produto.forEach(function(produto){
            const card = document.createElement('article')
            card.classList.add('card')
            card.setAttribute('data-id', produto.id)

            card.innerHTML = 
            `<h3>${produto.nome}</h3>` + 
            `<p class="desc>${produto.descricao}</p>` + 
            `<div class="quantidade-box">` +
                `<button class="btn-qtd btn-menos"> - </button>` + 
                `<span class="qtd-valor> 1 </span>` + 
                `<button class="btn-qtd btn-mais"> + </button>`+
            `</div>` + 
            `<span class="preco" data-preco='${produto.preco}'>` + 
                `R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}` + 
            `</span>` +  
            `<button class="btn-pedido"> Pedir Agora </button>`

            grid.appendChild(card)
        })
    } catch (erro) {
        grid.innerHTML = "<p class='loading erro'>Erro ao carregar o cardápio. Verifique se o servidor está rodando. </p>"
    }
}