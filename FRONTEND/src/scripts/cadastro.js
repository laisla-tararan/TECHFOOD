document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-cadastro");
    const mensagem = document.getElementById("mensagem");

    // Proteção extra: verifica se o formulário e a div de mensagem existem na página
    if (!form || !mensagem) {
        console.error("Elementos essenciais não foram encontrados no HTML.");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Captura dos valores dos inputs
        const nome = document.getElementById("input-nome").value.trim();
        const descricao = document.getElementById("input-desc").value.trim();
        const preco = document.getElementById("input-preco").value;
        const categoria = document.getElementById("input-categoria").value.trim();
        const imagem = document.getElementById("input-imagem").files[0];

        // Validação: Verifica se todos os campos obrigatórios (incluindo categoria) foram preenchidos
        if (!nome || !descricao || !preco || !categoria || !imagem) {
            mensagem.textContent = "Preencha todos os campos obrigatórios.";
            mensagem.style.color = "red";
            return;
        }

        try {
            const formData = new FormData();
            formData.append("nome", nome);
            formData.append("descricao", descricao);
            formData.append("preco", preco);
            formData.append("categoria", categoria);
            formData.append("imagem", imagem);

            // Executa a função de envio para a API/Backend
            await cadastrarProduto(formData);

            // Feedback visual de sucesso
            mensagem.textContent = "Produto cadastrado com sucesso!";
            mensagem.style.color = "green";

            // Limpa o formulário após o sucesso
            form.reset();

        } catch (erro) {
            // Tratamento seguro: se erro.message for undefined, exibe o erro completo ou frase padrão
            mensagem.textContent = erro.message || erro || "Erro desconhecido ao cadastrar o produto.";
            mensagem.style.color = "red";
        }
    });
});