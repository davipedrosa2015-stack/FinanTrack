
// Recupera as metas salvas no navegador
let metas = JSON.parse(
    localStorage.getItem("finantrack-metas")
) || [];
// Recupera as contas cadastradas no FinanTrack
let contas = JSON.parse(
    localStorage.getItem("finantrack-contas")
) || [];

// Obtém a data atual
function obterDataAtual() {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}
// Elementos da página
const formulario = document.getElementById("form-meta");
const listaMetas = document.getElementById("lista-metas");

// Formata valores em reais
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Salva as metas no navegador
function salvarMetas() {
    localStorage.setItem(
        "finantrack-metas",
        JSON.stringify(metas)
    );
}

// Atualiza os números do resumo
function atualizarResumo() {

    document.getElementById("total-metas").textContent =
        metas.length;

    let totalGuardado = 0;

    metas.forEach(function(meta) {

        meta.contribuicoes.forEach(function(contribuicao) {
            totalGuardado += contribuicao.valor;
        });

    });

    document.getElementById("total-guardado").textContent =
        formatarMoeda(totalGuardado);
}

// Mostra as metas na tela


function mostrarMetas() {

    listaMetas.innerHTML = "";

    if (metas.length === 0) {
        listaMetas.innerHTML =
            "<p>Nenhuma meta cadastrada ainda.</p>";

        atualizarResumo();
        return;
    }

    metas.forEach(function(meta, indice) {

        const totalGuardado = meta.contribuicoes.reduce(
            function(total, contribuicao) {
                return total + contribuicao.valor;
            },
            0
        );

        const percentual = Math.min(
            (totalGuardado / meta.valorObjetivo) * 100,
            100
        );

        const restante = Math.max(
            meta.valorObjetivo - totalGuardado,
            0
        );

        let opcoesContas = `
            <option value="">Selecione uma conta</option>
        `;

        contas.forEach(function(conta) {
            opcoesContas += `
                <option value="${conta.id}">
                    ${conta.nome}
                </option>
            `;
        });

        const card = document.createElement("div");

        card.className = "meta-card";

        card.innerHTML = `
            <div class="meta-card-header">
                <div>
                    <h2 class="meta-title">${meta.nome}</h2>
                    <p class="meta-description">
                        Acompanhe seu objetivo financeiro.
                    </p>
                </div>
            </div>

            <div class="meta-values">

                <div class="meta-metric">
                    <span class="meta-metric-label">Valor desejado</span>
                    <strong class="meta-metric-value">
                        ${formatarMoeda(meta.valorObjetivo)}
                    </strong>
                </div>

                <div class="meta-metric">
                    <span class="meta-metric-label">Total guardado</span>
                    <strong class="meta-metric-value meta-saved">
                        ${formatarMoeda(totalGuardado)}
                    </strong>
                </div>

                <div class="meta-metric">
                    <span class="meta-metric-label">Valor restante</span>
                    <strong class="meta-metric-value meta-remaining">
                        ${formatarMoeda(restante)}
                    </strong>
                </div>

            </div>

            <div class="meta-progress-info">
                <span>Progresso da meta</span>
                <strong>${percentual.toFixed(1)}%</strong>
            </div>

            <progress value="${percentual}" max="100"></progress>

            <h3 class="meta-section-title">
                Registrar dinheiro guardado
            </h3>

            <form class="form-contribuicao" data-meta-id="${meta.id}">

                
<div class="form-group">
    <label for="valor-contribuicao-${meta.id}">
        Valor guardado (R$)
    </label>

    <input
        type="number"
        id="valor-contribuicao-${meta.id}"
        name="valor"
        min="0.01"
        step="0.01"
        placeholder="Ex: 200"
        required
    >
</div>

<div class="form-group">
    <label for="conta-contribuicao-${meta.id}">
        Conta de origem
    </label>

    <select
        id="conta-contribuicao-${meta.id}"
        name="contaId"
        required
    >
        ${opcoesContas}
    </select>
</div>

<div class="form-group">
    <label for="data-contribuicao-${meta.id}">
        Data em que guardou
    </label>

    <input
        type="date"
        id="data-contribuicao-${meta.id}"
        name="data"
        value="${obterDataAtual()}"
        required
    >
</div>


                <button type="submit" class="btn-primary">
                    Registrar contribuição
                </button>

            </form>

            <div class="meta-actions">

                <button
                    type="button"
                    class="btn-secondary"
                    onclick="mostrarHistorico('${meta.id}')"
                >
                    Ver histórico
                </button>

                <button
                    type="button"
                    class="btn-primary"
                    onclick="excluirMeta(${indice})"
                >
                    Excluir meta
                </button>

            </div>
        `;

        listaMetas.appendChild(card);

    });

    atualizarResumo();
}



// Cadastra uma nova meta
formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome-meta").value.trim();

    const valorObjetivo = Number(
        document.getElementById("valor-meta").value
    );

    const novaMeta = {
        id: crypto.randomUUID(),
        nome: nome,
        valorObjetivo: valorObjetivo,
        contribuicoes: []
    };

    metas.push(novaMeta);

    salvarMetas();

    mostrarMetas();

    formulario.reset();

});

function mostrarHistorico(metaId) {

    const meta = metas.find(function(item) {
        return item.id === metaId;
    });

    if (!meta) return;

    const totalGuardado = meta.contribuicoes.reduce(
        function(total, contribuicao) {
            return total + contribuicao.valor;
        },
        0
    );

    let historico = "";

    if (meta.contribuicoes.length === 0) {

        historico = `
            <p class="meta-description">
                Nenhuma contribuição registrada para esta meta.
            </p>
        `;

    } else {

        meta.contribuicoes.forEach(function(contribuicao) {

            const conta = contas.find(function(item) {
                return item.id === contribuicao.contaId;
            });

            const nomeConta = conta
                ? conta.nome
                : "Conta não encontrada";

            const dataFormatada = new Date(
                contribuicao.data + "T00:00:00"
            ).toLocaleDateString("pt-BR");

            historico += `
                <div class="meta-history-item">

                    <div>
                        <strong>${nomeConta}</strong>
                        <p>${dataFormatada}</p>
                    </div>

                    <strong class="meta-saved">
                        + ${formatarMoeda(contribuicao.valor)}
                    </strong>

                </div>
            `;

        });

    }

    listaMetas.innerHTML = `

        <div class="meta-card">

            <div class="meta-history-header">

                <div>
                    <h2 class="meta-title">Histórico de contribuições</h2>
                    <p class="meta-description">
                        Meta: ${meta.nome}
                    </p>
                </div>

                <button
                    type="button"
                    class="btn-secondary"
                    onclick="mostrarMetas()"
                >
                    Voltar para metas
                </button>

            </div>

            <div class="meta-history-summary">
                <span>Total acumulado nesta meta</span>
                <strong class="meta-saved">
                    ${formatarMoeda(totalGuardado)}
                </strong>
            </div>

            <div class="meta-history-list">
                ${historico}
            </div>

        </div>

    `;

}

// Exclui uma meta
function excluirMeta(indice) {

    const confirmar = confirm(
        "Deseja realmente excluir esta meta?"
    );

    if (!confirmar) return;

    metas.splice(indice, 1);

    salvarMetas();

    mostrarMetas();
}

// Mostra as metas ao abrir a página

// Registra uma contribuição para uma meta
listaMetas.addEventListener("submit", function(event) {

    // Verifica se o formulário enviado é de contribuição
    if (!event.target.classList.contains("form-contribuicao")) {
        return;
    }

    event.preventDefault();

    const formularioContribuicao = event.target;

    // Recupera os dados preenchidos
    const metaId = formularioContribuicao.dataset.metaId;
    const valor = Number(formularioContribuicao.elements["valor"].value);
    const contaId = formularioContribuicao.elements["contaId"].value;
    const data = formularioContribuicao.elements["data"].value;

    // Localiza a meta escolhida
    const meta = metas.find(function(item) {
        return item.id === metaId;
    });

    if (!meta || valor <= 0 || !contaId || !data) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    // Cria a contribuição
    const novaContribuicao = {
        id: crypto.randomUUID(),
        valor: valor,
        contaId: contaId,
        data: data
    };

    // Adiciona a contribuição à meta
    meta.contribuicoes.push(novaContribuicao);

    // Salva e atualiza a página
    salvarMetas();
    mostrarMetas();

    alert("Contribuição registrada com sucesso!");

});

mostrarMetas();
