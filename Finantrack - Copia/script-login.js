
// Localiza o formulário de login
const formularioLogin = document.getElementById("form-login");

// Localiza o espaço de mensagens
const mensagemLogin = document.getElementById("mensagem-login");

// Verifica o envio do formulário
formularioLogin.addEventListener("submit", function(event) {

    event.preventDefault();

    // Recupera os dados digitados
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;

    // Credenciais demonstrativas
    const usuarioCorreto = "admin";
    const senhaCorreta = "123456";

    // Verifica se os dados estão corretos
    if (
        usuario === usuarioCorreto &&
        senha === senhaCorreta
    ) {

        // Registra a sessão no navegador
        localStorage.setItem("finantrack-sessao", "ativa");

        localStorage.setItem("finantrack-usuario", usuario);

        // Entra no Dashboard
        window.location.href = "index.html";

    } else {

        // Exibe mensagem de erro
        mensagemLogin.textContent =
            "Usuário ou senha incorretos. Tente novamente.";

        mensagemLogin.style.color = "#F87171";

    }

});
