
// Recupera as contas salvas no navegador
let contas = JSON.parse(
    localStorage.getItem("finantrack-contas")
) || [];

// Garante que todas as contas tenham um identificador único
let contasAtualizadas = false;

contas.forEach(function(conta) {

    if (!conta.id) {
        conta.id = crypto.randomUUID();
        contasAtualizadas = true;
    }

});

if (contasAtualizadas) {
    localStorage.setItem(
        "finantrack-contas",
        JSON.stringify(contas)
    );
}

// Elementos da página
const formulario = document.getElementById("form-conta");
const listaContas = document.getElementById("lista-contas");
const saldoTotal = document.getElementById("saldo-total");
const quantidadeContas = document.getElementById("quantidade-contas");

// Formata valores em reais
function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Atualiza o resumo e a lista de contas
function atualizarContas() {

    listaContas.innerHTML = "";

    let total = 0;

    contas.forEach(function(conta, indice) {

        total += conta.saldo;

        const item = document.createElement("div");
        item.classList.add("transaction-item");

        const informacoes = document.createElement("div");

        const nome = document.createElement("h3");
        nome.textContent = conta.nome;

        const tipo = document.createElement("p");
        tipo.textContent = conta.tipo;

        informacoes.appendChild(nome);
        informacoes.appendChild(tipo);

        const saldo = document.createElement("strong");
        saldo.textContent = formatarMoeda(conta.saldo);
        saldo.style.color = "#10B981";

        const excluir = document.createElement("button");
        excluir.textContent = "Excluir";
        excluir.classList.add("btn-excluir");

        excluir.addEventListener("click", function() {
            excluirConta(indice);
        });

        item.appendChild(informacoes);
        item.appendChild(saldo);
        item.appendChild(excluir);

        listaContas.appendChild(item);
    });

    if (contas.length === 0) {
        listaContas.textContent = "Nenhuma conta cadastrada.";
    }

    saldoTotal.textContent = formatarMoeda(total);
    quantidadeContas.textContent = contas.length;
}

// Cadastra uma nova conta
formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome-conta").value.trim();
    const tipo = document.getElementById("tipo-conta").value;
    const saldo = Number(document.getElementById("saldo-conta").value);

    const novaConta = {
    id: crypto.randomUUID(),
    nome: nome,
    tipo: tipo,
    saldo: saldo
};

    contas.push(novaConta);

    localStorage.setItem(
        "finantrack-contas",
        JSON.stringify(contas)
    );

    formulario.reset();

    atualizarContas();
});

// Exclui uma conta
// Exclui uma conta
function excluirConta(indice) {

    // Identifica a conta que será excluída
    const contaSelecionada = contas[indice];

    // Recupera as transações cadastradas
    const transacoesSalvas = JSON.parse(
        localStorage.getItem("finantrack-transacoes")
    ) || [];

    // Verifica se existem transações vinculadas à conta
    const possuiTransacoes = transacoesSalvas.some(function(transacao) {
        return transacao.contaId === contaSelecionada.id;
    });

    
// Recupera as metas cadastradas
const metasSalvas = JSON.parse(
    localStorage.getItem("finantrack-metas")
) || [];

// Verifica se existem contribuições vinculadas à conta
const possuiContribuicoes = metasSalvas.some(function(meta) {

    return meta.contribuicoes && meta.contribuicoes.some(
        function(contribuicao) {
            return contribuicao.contaId === contaSelecionada.id;
        }
    );

});

// Impede a exclusão se houver vínculos
if (possuiTransacoes || possuiContribuicoes) {

    alert(
        "Não é possível excluir esta conta porque existem transações ou contribuições de metas vinculadas a ela."
    );

    return;
}

    const confirmar = confirm(
        "Deseja realmente excluir esta conta?"
    );

    if (!confirmar) return;

    contas.splice(indice, 1);

    localStorage.setItem(
        "finantrack-contas",
        JSON.stringify(contas)
    );

    atualizarContas();
}

// Inicializa a página
atualizarContas();
