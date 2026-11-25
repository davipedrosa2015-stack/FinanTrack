
// Recupera os elementos do carrossel
const carrossel = document.getElementById("feed-carousel");
const botaoAnterior = document.getElementById("feed-anterior");
const botaoProximo = document.getElementById("feed-proximo");
const indicador = document.getElementById("feed-indicador");

// Recupera todas as dicas
const dicas = document.querySelectorAll(".feed-slide");

// Controla qual dica está sendo exibida
let dicaAtual = 0;

// Mostra a dica selecionada
function mostrarDica() {

    dicas.forEach(function(dica, indice) {

        if (indice === dicaAtual) {
            dica.hidden = false;
            dica.classList.add("active");
        } else {
            dica.hidden = true;
            dica.classList.remove("active");
        }

    });

    // Atualiza o indicador
    indicador.textContent =
        `Dica ${dicaAtual + 1} de ${dicas.length}`;

}

// Mostra a dica anterior
botaoAnterior.addEventListener("click", function() {

    dicaAtual--;

    if (dicaAtual < 0) {
        dicaAtual = dicas.length - 1;
    }

    mostrarDica();

});

// Mostra a próxima dica
botaoProximo.addEventListener("click", function() {

    dicaAtual++;

    if (dicaAtual >= dicas.length) {
        dicaAtual = 0;
    }

    mostrarDica();

});

// Inicializa o carrossel
if (carrossel && dicas.length > 0) {
    mostrarDica();
}
