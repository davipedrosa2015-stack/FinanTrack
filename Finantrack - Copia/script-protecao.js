
// Verifica se existe uma sessão ativa
const sessao = localStorage.getItem("finantrack-sessao");

// Impede o acesso sem login
if (sessao !== "ativa") {
    window.location.href = "login.html";
}

// Localiza o botão de sair
const botaoSair = document.getElementById("botao-sair");

// Encerra a sessão quando o usuário clicar
if (botaoSair) {

    botaoSair.addEventListener("click", function(event) {

        event.preventDefault();

        // Remove os dados da sessão
        localStorage.removeItem("finantrack-sessao");
        localStorage.removeItem("finantrack-usuario");

        // Retorna para a tela de login
        window.location.href = "login.html";

    });

}
