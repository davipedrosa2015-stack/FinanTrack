
let transacoes = JSON.parse(
    localStorage.getItem("finantrack-transacoes")
) || [];

let graficoEvolucao = null;
let graficoCategorias = null;

const filtroPeriodo = document.getElementById("filtro-periodo");
// Identifica as cores de acordo com o tema escolhido
function obterCoresGrafico() {

    const tema = localStorage.getItem("finantrack-tema") || "escuro";

    if (tema === "claro") {
        return {
            texto: "#334155",
            textoSecundario: "#475569",
            grade: "#CBD5E1",
            borda: "#FFFFFF"
        };
    }

    return {
        texto: "#CBD5E1",
        textoSecundario: "#94A3B8",
        grade: "#26364D",
        borda: "#111C2E"
    };
}
function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}
// Converte a data sem alterar o dia por causa do fuso horário
function converterDataLocal(data) {

    const partes = data.split("-");

    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    return new Date(ano, mes - 1, dia);

}
// Filtra as transações pelo período selecionado
function obterTransacoesFiltradas() {

    const periodo = filtroPeriodo.value;

    if (periodo === "todos") {
        return transacoes;
    }

    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - Number(periodo));
    dataLimite.setHours(0, 0, 0, 0);
    return transacoes.filter(transacao => {
        const dataTransacao = converterDataLocal(transacao.data);

        return !isNaN(dataTransacao.getTime()) &&
            dataTransacao >= dataLimite;
    });
}

// Atualiza os indicadores financeiros
function atualizarIndicadores(dados) {

    let receitas = 0;
    let despesas = 0;

    dados.forEach(transacao => {
        if (transacao.tipo === "receita") {
            receitas += Number(transacao.valor);
        } else {
            despesas += Number(transacao.valor);
        }
    });

    const saldo = receitas - despesas;

    document.getElementById("relatorio-receitas").textContent =
        formatarMoeda(receitas);

    document.getElementById("relatorio-despesas").textContent =
        formatarMoeda(despesas);

    document.getElementById("relatorio-saldo").textContent =
        formatarMoeda(saldo);

    document.getElementById("resumo-geral").textContent =
        receitas > 0
            ? `Você gastou ${(despesas / receitas * 100).toFixed(1)}% do que recebeu neste período.`
            : "Cadastre receitas para visualizar seu resumo financeiro.";

    return { receitas, despesas };
}

// Cria o gráfico de evolução
function atualizarGraficoEvolucao(dados) {
    const cores = obterCoresGrafico();
    const agrupamento = {};

    dados.forEach(transacao => {

        const data = converterDataLocal(transacao.data);

        if (isNaN(data.getTime())) return;

        const chave = data.toLocaleDateString("pt-BR");

        if (!agrupamento[chave]) {
            agrupamento[chave] = {
                receitas: 0,
                despesas: 0,
                data: new Date(data.getFullYear(), data.getMonth(), data.getDate())
            };
        }

        if (transacao.tipo === "receita") {
            agrupamento[chave].receitas += Number(transacao.valor);
        } else {
            agrupamento[chave].despesas += Number(transacao.valor);
        }
    });

    const dias = Object.values(agrupamento)
        .sort((a, b) => a.data - b.data);

    if (graficoEvolucao) {
        graficoEvolucao.destroy();
    }

    graficoEvolucao = new Chart(
        document.getElementById("graficoEvolucao"),
        {
            type: "line",
            data: {
                labels: dias.map(dia =>
                    dia.data.toLocaleDateString("pt-BR")
                ),
                datasets: [
                    {
                        label: "Receitas",
                        data: dias.map(dia => dia.receitas),
                        borderColor: "#10B981",
                        backgroundColor: "#10B981",
                        tension: 0.3
                    },
                    {
                        label: "Despesas",
                        data: dias.map(dia => dia.despesas),
                        borderColor: "#F87171",
                        backgroundColor: "#F87171",
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
    labels: { color: cores.texto }
}
                },
                scales: {
                    x: {
    ticks: { color: cores.textoSecundario },
    grid: { color: cores.grade }
},
y: {
    beginAtZero: true,
    ticks: { color: cores.textoSecundario },
    grid: { color: cores.grade }
}
                }
            }
        }
    );
}

// Cria o gráfico de categorias
function atualizarGraficoCategorias(dados) {
    const cores = obterCoresGrafico();
    const categorias = {};

    dados.forEach(transacao => {

        if (transacao.tipo !== "despesa") return;

        const categoria = transacao.categoria || "Sem categoria";

        categorias[categoria] =
            (categorias[categoria] || 0) + Number(transacao.valor);
    });

    if (graficoCategorias) {
        graficoCategorias.destroy();
    }

    graficoCategorias = new Chart(
        document.getElementById("graficoCategorias"),
        {
            type: "doughnut",
            data: {
                labels: Object.keys(categorias),
                datasets: [{
                    data: Object.values(categorias),
                    backgroundColor: [
                        "#10B981",
                        "#3B82F6",
                        "#A78BFA",
                        "#F59E0B",
                        "#F87171",
                        "#06B6D4"
                    ],
                    borderColor: cores.borda,
                    borderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
    position: "bottom",
    labels: { color: cores.texto }
}
                }
            }
        }
    );
}

// Atualiza todos os relatórios
function atualizarRelatorios() {

    transacoes = JSON.parse(
        localStorage.getItem("finantrack-transacoes")
    ) || [];

    const dados = obterTransacoesFiltradas();

    atualizarIndicadores(dados);
    atualizarGraficoEvolucao(dados);
    atualizarGraficoCategorias(dados);
}

filtroPeriodo.addEventListener("change", atualizarRelatorios);

atualizarRelatorios();
