
// Recupera o tema salvo anteriormente
let temaAtual = localStorage.getItem("finantrack-tema");

// Define o modo escuro como padrão
if (temaAtual !== "claro" && temaAtual !== "escuro") {
    temaAtual = "escuro";
}

// Aplica o tema escolhido
function aplicarTema(tema) {

    temaAtual = tema;

    // Atualiza o tema da página
    document.documentElement.setAttribute("data-theme", tema);

    // Salva a preferência no navegador
    localStorage.setItem("finantrack-tema", tema);

    // Atualiza os cartões de seleção
    const botoesTema = document.querySelectorAll("[data-theme-choice]");

    botoesTema.forEach(function(botao) {

        const selecionado = botao.dataset.themeChoice === tema;

        botao.classList.toggle("active", selecionado);

        botao.setAttribute(
            "aria-pressed",
            String(selecionado)
        );

    });

}

// Localiza os cartões de tema
const botoesTema = document.querySelectorAll("[data-theme-choice]");

// Adiciona o funcionamento dos botões
botoesTema.forEach(function(botao) {

    botao.addEventListener("click", function() {

        const temaEscolhido = botao.dataset.themeChoice;

        aplicarTema(temaEscolhido);

    });

});

// Aplica o tema ao abrir qualquer página
aplicarTema(temaAtual);

// Formulário de contato
const formularioContato = document.getElementById("form-contato");

if (formularioContato) {

    formularioContato.addEventListener("submit", function(event) {

        event.preventDefault();

        const nome = document.getElementById("contato-nome").value.trim();

        const retorno = document.getElementById("retorno-contato");

        // Exibe uma confirmação na tela
        retorno.textContent =
            `Obrigado, ${nome}! Sua mensagem foi registrada nesta demonstração.`;

        retorno.style.color = "#10B981";
        retorno.style.marginTop = "15px";

        // Limpa os campos
        formularioContato.reset();

    });

}
