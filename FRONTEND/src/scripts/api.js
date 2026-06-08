const BASE_URL = 'http://localhost:3000'

// 1. Buscar produtos 
async function buscarProdutos() {
    const response = await fetch(`${BASE_URL}/produtos`) //Realizar a CONEXÃO (espera até receber a resposta!)
    const dados = await response.json() //Armazenar os DADOS (espera até receber os dados!)

    if(!response.ok) throw new Error(dados.erro || `Erro ${response.status}`)

    return dados.dados //Armazena os dados de produtos e salva-os, pois os produtos são fixos.
}

//2. Criar pedido 
async function criarPedido(cliente, itens){
    //Solicita comunicação e executa o método POST (publica o cliente e os itens do pedido).
    const response = await fetch(`${BASE_URL}/pedidos`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cliente, itens}) //É JSON mas do tipo texto.
    })
    const dados = await response.json()

    if(!response.ok) throw new Error(dados.erro || `Erro: ${response.status}`)

    return dados //Pedidos são temporários, não precisamos deixar os pedidos salvos.
}

//3. Buscar pedidos - Foco para a cozinha ter acesso aos pedidos
async function buscarPedidos() {
    const response = await fetch(`${BASE_URL}/pedidos`)
    const dados = await response.json()

    if(!response.ok) throw new Error(dados.erro || `Erro: ${response.status}`)

    return dados
}

async function cadastrarProduto(formData) {
    const URL_API = `${BASE_URL}/produtos`; 

    const resposta = await fetch(URL_API, {
        method: "POST",
        body: formData
    });

    if (!resposta.ok) {
        const dadosErro = await resposta.json().catch(() => ({}));
        throw new Error(dadosErro.mensagem || `Erro no servidor: Código ${resposta.status}`);
    }

    return await resposta.json();
}

//4. Deletar os pedidos - Utilizado pela cozinha.
async function deletarPedido(id) {
    const response = await fetch(`${BASE_URL}/pedidos/${id}`, {
        method: 'DELETE'
    })
    const dados = await response.json()

    if(!response.ok) throw new Error(dados.erro || `Erro: ${response.status}`)

    return dados
}

//5. Atualizar status do pedido
async function atualizarStatusPedido(id, novoStatus) {
    const response = await fetch(`${BASE_URL}/pedidos/${id}/status`, { 
        method: 'PATCH',
        headers: {'Content-Type': application.json},
        body: JSON.stringify({status: novoStatus}),
    })
    const dados = await response.json()
    
    if(!response.ok) throw new Error(dados.erro || `Erro: ${response.status}`)

    return dados 
}