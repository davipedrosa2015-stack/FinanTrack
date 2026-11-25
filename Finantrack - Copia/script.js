
// Recupera transações salvas no navegador
let transacoes = JSON.parse(
    localStorage.getItem("finantrack-transacoes")
) || [];
let graficoFinanceiro = null;
// Obtém a data atual
function obterDataAtual() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

// Preenche automaticamente o campo de data
document.getElementById("data-transacao").value = obterDataAtual();
// Carrega as contas cadastradas no sistema
const seletorConta = document.getElementById("conta-transacao");

const contasSalvas = JSON.parse(
    localStorage.getItem("finantrack-contas")
) || [];

contasSalvas.forEach(function(conta) {

    const opcao = document.createElement("option");

    opcao.value = conta.id;
    opcao.textContent = conta.nome;

    seletorConta.appendChild(opcao);

});
// Formata valores em reais
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
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

// Atualiza os valores do dashboard
function atualizarDashboard() {

    let receitas = 0;
    let despesas = 0;

    transacoes.forEach(function(transacao) {

        if (transacao.tipo === "receita") {
            receitas += transacao.valor;
        } else {
            despesas += transacao.valor;
        }

    });

    let saldo = receitas - despesas;
atualizarGrafico(receitas, despesas);
    document.getElementById("saldo").textContent =
        formatarMoeda(saldo);

    document.getElementById("receitas").textContent =
        formatarMoeda(receitas);

    document.getElementById("despesas").textContent =
        formatarMoeda(despesas);

}


// Mostra as transações na tela
function mostrarTransacoes() {

    const lista = document.getElementById("lista-transacoes");

    lista.innerHTML = "";

    if (transacoes.length === 0) {
        lista.innerHTML =
            '<p class="empty-message">Nenhuma transação cadastrada ainda.</p>';
        return;
    }

    transacoes.forEach(function(transacao, indice) {

        const item = document.createElement("div");

        item.className = "transaction";

        const sinal =
            transacao.tipo === "receita" ? "+" : "-";
        const contasSalvas = JSON.parse(
    localStorage.getItem("finantrack-contas")
) || [];

const contaUtilizada = contasSalvas.find(function(conta) {
    return conta.id === transacao.contaId;
});

const nomeConta = contaUtilizada
    ? contaUtilizada.nome
    : "Conta não informada";
        const classe =
            transacao.tipo === "receita" ? "positive" : "negative";

        item.innerHTML = `
    <div class="transaction-info">
        <strong>${transacao.descricao}</strong>
        <p>${transacao.tipo === "receita" ? "Receita" : "Despesa"}</p>
<small>${nomeConta}</small>
<small>${formatarData(transacao.data)}</small>
    </div>

    <span class="transaction-value ${classe}">
        ${sinal} ${formatarMoeda(transacao.valor)}
    </span>

    <button class="delete-btn" data-indice="${indice}">
        Excluir
    </button>
`;

        lista.appendChild(item);

    });

}


// Cadastra uma nova transação
document.getElementById("form-transacao")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const descricao =
            document.getElementById("descricao").value.trim();

        const valor =
            Number(document.getElementById("valor").value);

        const tipo =
            document.getElementById("tipo").value;
const data =
    document.getElementById("data-transacao").value;
    const categoria =
    document.getElementById("categoria").value;
    const contaId =
    document.getElementById("conta-transacao").value;
        if (!descricao || !Number.isFinite(valor) || valor <= 0 || !data || !contaId) {
    alert("Preencha os dados corretamente.");
    return;
}

        const novaTransacao = {
    descricao: descricao,
    valor: valor,
    tipo: tipo,
    data: data,
    categoria: categoria,
    contaId: contaId
};
// Atualiza o saldo da conta utilizada
const contasAtualizadas = JSON.parse(
    localStorage.getItem("finantrack-contas")
) || [];

const contaSelecionada = contasAtualizadas.find(function(conta) {
    return conta.id === contaId;
});

if (!contaSelecionada) {
    alert("A conta selecionada não foi encontrada.");
    return;
}

// Receita adiciona dinheiro; despesa desconta
if (tipo === "receita") {
    contaSelecionada.saldo =
        Number(contaSelecionada.saldo) + valor;
} else {
    contaSelecionada.saldo =
        Number(contaSelecionada.saldo) - valor;
}

// Salva os novos saldos
localStorage.setItem(
    "finantrack-contas",
    JSON.stringify(contasAtualizadas)
);
        transacoes.unshift(novaTransacao);

        salvarDados();

               this.reset();

        document.getElementById("data-transacao").value = obterDataAtual();

    });


// Exclui uma transação
document.getElementById("lista-transacoes")
    .addEventListener("click", function(event) {

        if (event.target.classList.contains("delete-btn")) {

            const indice = Number(event.target.dataset.indice);

// Recupera a transação que será excluída
const transacaoExcluida = transacoes[indice];

// Recupera as contas cadastradas
const contasAtualizadas = JSON.parse(
    localStorage.getItem("finantrack-contas")
) || [];

// Procura a conta utilizada na transação
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

    // Salva o saldo corrigido
    localStorage.setItem(
        "finantrack-contas",
        JSON.stringify(contasAtualizadas)
    );
}

// Exclui a transação
transacoes.splice(indice, 1);

salvarDados();

        }

    });


// Salva no navegador e atualiza a interface
function salvarDados() {

    localStorage.setItem(
        "finantrack-transacoes",
        JSON.stringify(transacoes)
    );

    atualizarDashboard();
    mostrarTransacoes();

}


// Inicializa o sistema
salvarDados();

// Cria e atualiza o gráfico financeiro
function atualizarGrafico(receitas, despesas) {

    const contexto = document
        .getElementById("graficoFinanceiro")
        .getContext("2d");

    // Se o gráfico já existir, atualizamos seus valores
    if (graficoFinanceiro) {

        graficoFinanceiro.data.datasets[0].data = [
            receitas,
            despesas
        ];

        graficoFinanceiro.update();

        return;
    }
// Identifica as cores conforme o tema escolhido
const temaClaro = localStorage.getItem("finantrack-tema") === "claro";

const corBordaGrafico = temaClaro ? "#FFFFFF" : "#111C2E";
const corLegendaGrafico = temaClaro ? "#334155" : "#CBD5E1";
    // Criação do gráfico
    graficoFinanceiro = new Chart(contexto, {

        type: "doughnut",

        data: {

            labels: ["Receitas", "Despesas"],

            datasets: [{

                data: [receitas, despesas],

                backgroundColor: temaClaro
                ? ["#047857", "#DC2626"]
                : ["#10B981", "#F87171"],

                borderColor: corBordaGrafico,

                borderWidth: 2,

                hoverOffset: 8

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "72%",

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        color: corLegendaGrafico,

                        padding: 25,

                        usePointStyle: true

                    }

                }

            }

        }

    });

}
// Atualiza o dashboard ao retornar à página
window.addEventListener("pageshow", function () {
    atualizarDashboard();
});