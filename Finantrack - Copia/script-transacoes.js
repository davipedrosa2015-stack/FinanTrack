
// Recupera as transações salvas pelo Dashboard
let transacoes = JSON.parse(
    localStorage.getItem("finantrack-transacoes")
) || [];

// Elementos da página
const lista = document.getElementById("lista-transacoes-completa");
const pesquisa = document.getElementById("pesquisa-transacao");
const filtroTipo = document.getElementById("filtro-tipo");
const filtroData = document.getElementById("filtro-data");
const filtroConta = document.getElementById("filtro-conta");

// Recupera as contas cadastradas
const contasSalvas = JSON.parse(
    localStorage.getItem("finantrack-contas")
) || [];

// Adiciona as contas ao filtro
contasSalvas.forEach(function(conta) {

    const opcao = document.createElement("option");

    opcao.value = conta.id;
    opcao.textContent = conta.nome;

    filtroConta.appendChild(opcao);

});
// Formata valores em reais
function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}
// Formata a data para o padrão brasileiro
function formatarData(data) {

    if (!data) {
        return "Data não informada";
    }

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
// Exibe as transações na tela
function mostrarTransacoes() {

    lista.innerHTML = "";

    const termoPesquisa = pesquisa.value.toLowerCase();
    const tipoSelecionado = filtroTipo.value;
    const dataSelecionada = filtroData.value;
    const contaSelecionada = filtroConta.value;
    const transacoesFiltradas = transacoes
        .map((transacao, indice) => ({
            ...transacao,
            indiceOriginal: indice
        }))
        .filter(transacao => {

    const correspondePesquisa =
        transacao.descricao.toLowerCase().includes(termoPesquisa);

    const correspondeTipo =
        tipoSelecionado === "todos" ||
        transacao.tipo === tipoSelecionado;

    const correspondeData =
        !dataSelecionada ||
        transacao.data === dataSelecionada;
    const correspondeConta =
    contaSelecionada === "todos" ||
    transacao.contaId === contaSelecionada;

    return correspondePesquisa &&
       correspondeTipo &&
       correspondeData &&
       correspondeConta;
});

    if (transacoesFiltradas.length === 0) {
        lista.textContent = "Nenhuma transação encontrada.";
        return;
    }

    transacoesFiltradas.forEach(transacao => {

        const item = document.createElement("div");
        item.classList.add("transaction-item");

        const informacoes = document.createElement("div");

        const descricao = document.createElement("h3");
        descricao.textContent = transacao.descricao;

        const tipo = document.createElement("p");
tipo.textContent =
    transacao.tipo === "receita" ? "Receita" : "Despesa";
    const contasSalvas = JSON.parse(
    localStorage.getItem("finantrack-contas")
) || [];

const contaUtilizada = contasSalvas.find(function(conta) {
    return conta.id === transacao.contaId;
});

const banco = document.createElement("small");
banco.textContent = contaUtilizada
    ? contaUtilizada.nome
    : "Conta não informada";
    banco.style.marginRight = "8px";

const data = document.createElement("small");
data.textContent = formatarData(transacao.data);

informacoes.appendChild(descricao);
informacoes.appendChild(tipo);
informacoes.appendChild(banco);
informacoes.appendChild(data);

        const valor = document.createElement("strong");
        valor.textContent =
            (transacao.tipo === "receita" ? "+ " : "- ") +
            formatarMoeda(transacao.valor);

        valor.style.color =
            transacao.tipo === "receita" ? "#10B981" : "#F87171";

        const excluir = document.createElement("button");
        excluir.textContent = "Excluir";
        excluir.classList.add("btn-excluir");

        excluir.addEventListener("click", () => {
            excluirTransacao(transacao.indiceOriginal);
        });

        item.appendChild(informacoes);
        item.appendChild(valor);
        item.appendChild(excluir);

        lista.appendChild(item);
    });
}

// Exclui uma transação
function excluirTransacao(indice) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir esta transação?"
    );

    if (!confirmar) {
        return;
    }

    // Recupera a transação que será excluída
const transacaoExcluida = transacoes[indice];

// Recupera as contas cadastradas
const contasAtualizadas = JSON.parse(
    localStorage.getItem("finantrack-contas")
) || [];

// Procura a conta utilizada
const conta = contasAtualizadas.find(function(conta) {
    return conta.id === transacaoExcluida.contaId;
});

// Desfaz o efeito da transação no saldo
if (conta) {

    if (transacaoExcluida.tipo === "receita") {
        conta.saldo =
            Number(conta.saldo) - transacaoExcluida.valor;
    } else {
        conta.saldo =
            Number(conta.saldo) + transacaoExcluida.valor;
    }

    localStorage.setItem(
        "finantrack-contas",
        JSON.stringify(contasAtualizadas)
    );
}

// Exclui a transação
transacoes.splice(indice, 1);

localStorage.setItem(
    "finantrack-transacoes",
    JSON.stringify(transacoes)
);

mostrarTransacoes();
}

// Pesquisa e filtros
pesquisa.addEventListener("input", mostrarTransacoes);
filtroTipo.addEventListener("change", mostrarTransacoes);
filtroData.addEventListener("change", mostrarTransacoes);
// Atualiza a página se os dados forem alterados em outra aba
window.addEventListener("storage", (evento) => {

    if (evento.key === "finantrack-transacoes") {

        transacoes = JSON.parse(evento.newValue) || [];

        mostrarTransacoes();
    }
});

// Exibe os dados ao abrir a página
mostrarTransacoes();
filtroConta.addEventListener("change", mostrarTransacoes);