// ================================ DADOS ================================
let auditoriasData = JSON.parse(localStorage.getItem('auditoriasData')) || [];

// Gravar os dados da auditoria no localStorage
function saveAuditoriasData() {
    localStorage.setItem('auditoriasData', JSON.stringify(auditoriasData));
}

// =========================================================================
// =========================== VARIÁVEIS GLOBAIS ===========================
// =========================================================================
    // Exemplo de auditorias
    let auditoriasFiltradasPesquisa = null;
    // Paginação
    let currentPage = 1; // Página atual 
    let itemsPerPage = 16; // nº auditorias por página

    // Menu lateral
    let currentTipoFiltro = null; // Filtro de tipo de auditoria
    let currentEstadoFiltro = null; // Filtro de estado da auditoria
    let sortOrder = 'recente'; // filtro de ordenação

    // Pesquisa
    let filtroId = null; // id da auditoria
    let filtroData = null; // data de criação
    let filtroPerito = null; // nome do perito
    let filtroOcorrencia = null; // id da ocorrência

// =========================================================================
// ============================ FUNCIONALIDADES ============================
// =========================================================================

// ----------- BUSCAR NOME DO PERITO ASSOCIADO ----------- 
// (estático para já)
function getNomePeritoPorId(idPerito) {
    const experts = JSON.parse(localStorage.getItem('expertsData')) || [];
    const perito = experts.find(expert => expert.id === idPerito);
    return perito ? perito.name : "—";
}


// ----------------------  BOTÃO ADICIONAR ----------------------  
document.getElementById('addAuditoriaBtn').addEventListener('click', () => {
    window.location.href = 'criarauditoria.html';
});

// ----------------------  BOTÃO REMOVER ----------------------  
// QUADRADO (SELECIONAR TODAS AS AUDITORIAS)
function setupHeaderCheckbox() {
    const headerCheckbox = document.querySelector('.header-checkbox');
    headerCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.auditoria-checkbox');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
    });
}

// REMOVER AUDITORIA SELECIONADA
function setupRemoveButton() {
    // BOTÃO
    const removeButton = document.querySelector('.btn-danger');
    // quando clicar no botão
    removeButton.addEventListener('click', () => {
        // verifica as selecionadas
        const selected = document.querySelectorAll('.auditoria-checkbox:checked');
        if (selected.length === 0) {
            alert('Selecione pelo menos uma auditoria para remover.');
            return;
        }

        if (confirm('Tem certeza que deseja remover as auditorias selecionadas?')) {
            // Vê ids das auditorias selecionadas
            const ids = Array.from(selected).map(c => parseInt(c.getAttribute('data-id')));

            // remove as auditorias selecionadas
            auditoriasData = auditoriasData.filter(a => !ids.includes(a.id));
            saveAuditoriasData(); // atualiza o localStorage
            document.querySelector('.header-checkbox').checked = false; // desmarca os checkboxs
            // atualiza a tabela e a paginação
            atualizarTabelaAuditorias(); 
            updatePagination();
        }
    });
}

// ----------------------  BOTÃO 3 PONTOS ----------------------  

// =========================================================================
// ================================ FILTROS ================================
// =========================================================================

// ---------------------- MENU LATERAL ----------------------
// + RECENTE / ANTIGA
function ordenarPorData(criterio) {
    // desativar se estiver ativo
    sortOrder = (sortOrder === criterio) ? null : criterio;
    currentPage = 1;
    atualizarTabelaAuditorias();
    updatePagination();
}

// TIPO DE AUDITORIA
function filterByTipoAuditoria(tipo) {
    // desativar se estiver ativo
    currentTipoFiltro = (currentTipoFiltro === tipo) ? null : tipo;
    currentPage = 1;
    atualizarTabelaAuditorias();
    updatePagination();
}

// ESTADO DA AUDITORIA
function filterByEstado(estado) {
    // desativar se estiver ativo
    currentEstadoFiltro = (currentEstadoFiltro === estado) ? null : estado;
    currentPage = 1;
    atualizarTabelaAuditorias();
    updatePagination();
}

// ---------------------- FILTRAR AUDITORIAS ----------------------
function filtrarAuditorias() {
    let auditorias = JSON.parse(localStorage.getItem('auditoriasData')) || [];
    // TIPO 
    if (currentTipoFiltro) {
        auditorias = auditorias.filter(a => a.tipo === currentTipoFiltro);
    }
    // ESTADO
    if (currentEstadoFiltro) {
        auditorias = auditorias.filter(a => a.estado === currentEstadoFiltro);
    }
    // DATA
    if (filtroData) {
        const filtro = new Date(filtroData);
        if (!isNaN(filtro.getTime())) {
            auditorias = auditorias.filter(a => new Date(a.dataCriacao) >= filtro);
        }
    }
    return auditorias;
}

// ---------------------- LIMPAR FILTROS ----------------------
function limparFiltros() {
    // Limpar inputs do topo
    document.getElementById('searchId').value = '';
    document.getElementById('searchData').value = '';
    document.getElementById('searchPerito').value = '';
    document.getElementById('searchOcorrencia').value = '';

    // Reset das variáveis globais
    auditoriasFiltradasPesquisa = null;
    filtroId = null;
    filtroData = null;
    filtroPerito = null;
    filtroOcorrencia = null;
    currentTipoFiltro = null;
    currentEstadoFiltro = null;
    sortOrder = 'recente'; // ou null se quiseres sem ordenação

    // Remover botões ativos do menu lateral
    document.querySelectorAll('[data-tipo], [data-estado], [data-sort]').forEach(btn => {
        btn.classList.remove('active');
    });

    // Repor página inicial e atualizar
    currentPage = 1;
    atualizarTabelaAuditorias();
    updatePagination();
}

// =========================================================================
// =========================== ATUALIZAR TABELA ============================
// =========================================================================

function atualizarTabelaAuditorias(lista = null) {
    const tbody = document.getElementById("auditoriasTableBody"); // Seleciona o corpo da tabela
    tbody.innerHTML = ""; // Limpa o conteúdo da tabela

    // FILTROS
    let auditoriasFiltradas = lista || filtrarAuditorias();

    // ordenação por data
    if (sortOrder) {
        auditoriasFiltradas.sort((a, b) => {
            const dataA = new Date(a.dataCriacao);
            const dataB = new Date(b.dataCriacao);
            return sortOrder === 'recente' ? dataB - dataA : dataA - dataB;
        });
    }
    
    // Calcula dados a mostrar na pagina 
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    // extrai auditorias desta pagina (slice)
    const paginaAuditorias = auditoriasFiltradas.slice(start, end);

    // preencher linhas da tabela
    // Percorre auditorias da página atual
    paginaAuditorias.forEach(auditoria => {
        const row = document.createElement("tr"); // Cria nova linha
        //conteúdo da linha (checkbox, data, tipo, estado, perito, ocorrencia, 3pontos)
        row.innerHTML = `
            <td>
                <input type="checkbox" class="auditoria-checkbox" data-id="${auditoria.id}"> 
            </td>
            <td>${auditoria.id}</td>
            <td>${auditoria.tipo}</td>
            <td>${auditoria.dataCriacao}</td>
            <td>
                <div>${auditoria.perito || "—"}</div>
            </td>
            <td>
                <div>${auditoria.ocorrencia || "—"}</div>
            </td>
            <td>${auditoria.estado}</td>
            <td>
                <button class="btn-icon">
                    <i data-lucide="more-vertical"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row); //adiciona a linha
    });

    lucide.createIcons(); // ativa os 3 pontos 
}

// ---------------------- ATUALIZAR PAGINAÇÃO ----------------------
function updatePagination(lista = null) {
    const totalItems = (lista || filtrarAuditorias()).length; // total de auditorias 
    const totalPages = Math.ceil(totalItems / itemsPerPage); // total de páginas necessárias

    const start = (currentPage - 1) * itemsPerPage + 1; // primeiro item da página
    const end = Math.min(currentPage * itemsPerPage, totalItems); // último item da página
    
    // Atualiza a informação de paginação
    document.querySelector('.pagination-info').textContent =
        `Mostrando ${start} - ${end} de ${totalItems} auditorias registradas`;

    // botões de paginação
    const paginationButtons = document.querySelector('.pagination-buttons');
    // anterior, números das páginas e proximo 
    paginationButtons.innerHTML = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">&lt;</button>
        ${getPaginationButtons(currentPage, totalPages)}
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">&gt;</button>
    `;
}

// Criar botões numerados
function getPaginationButtons(current, total) {
    let buttons = '';
    // botão para cada pagina, pagina atual = active
    for (let i = 1; i <= total; i++) {
        buttons += `<button ${i === current ? 'class="active"' : ''} onclick="changePage(${i})">${i}</button>`;
    }
    return buttons;
}

// Mudar de página
function changePage(page) {
    currentPage = page; // atualiza a página atual
    atualizarTabelaAuditorias(); 
    updatePagination();
}

// =========================================================================
// =========================== DOMContentLoaded ============================
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons(); // Ativa os ícones
    // ---------- BOTÕES Adicionar / Remover ----------
    setupRemoveButton();
    setupHeaderCheckbox();
    // --------- ATUALIZAR TABELA / PAGINAÇÃO ---------
    atualizarTabelaAuditorias(auditoriasFiltradasPesquisa);
    updatePagination(auditoriasFiltradasPesquisa);
    // ======================== FILTROS ========================
    // -------------------- MENU LATERAL --------------------
    // Recente
    document.querySelector('[data-sort="recente"]').addEventListener('click', () => {
        ordenarPorData('recente');
        document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
        if (sortOrder === 'recente') {
            document.querySelector('[data-sort="recente"]').classList.add('active');
        }
    });
    // Antiga
    document.querySelector('[data-sort="antiga"]').addEventListener('click', () => {
        ordenarPorData('antiga');
        document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
        if (sortOrder === 'antiga') {
            document.querySelector('[data-sort="antiga"]').classList.add('active');
        }
    });
     
    // Tipo de auditoria
    document.querySelectorAll('[data-tipo]').forEach(btn => {
        btn.addEventListener('click', () => {
            const tipo = btn.getAttribute('data-tipo');
            filterByTipoAuditoria(tipo);

            // Remover todos os ativos primeiro
            document.querySelectorAll('[data-tipo]').forEach(b => b.classList.remove('active'));
            // Ativar apenas se estiver realmente aplicado
            if (currentTipoFiltro === tipo) btn.classList.add('active');
        });
    });

    // Estado da auditoria
    document.querySelectorAll('[data-estado]').forEach(btn => {
        btn.addEventListener('click', () => {
            const estado = btn.getAttribute('data-estado');
            filterByEstado(estado);

            document.querySelectorAll('[data-estado]').forEach(b => b.classList.remove('active'));
            if (currentEstadoFiltro === estado) btn.classList.add('active');
        });
    });

    // -------------------- FILTROS DE PESQUISA --------------------
    document.getElementById('searchButton').addEventListener('click', () => {
        // ID auditoria
        const id = document.getElementById('searchId').value.trim();
        // Data
        const data = document.getElementById('searchData').value;
        // Nome Perito
        const perito = document.getElementById('searchPerito').value.trim().toLowerCase();
        // ID Ocorrência
        const ocorrencia = document.getElementById('searchOcorrencia').value.trim();

        let filtradas = JSON.parse(localStorage.getItem('auditoriasData')) || [];

        if (id) filtradas = filtradas.filter(a => a.id.toString() === id);
        if (data) filtradas = filtradas.filter(a => new Date(a.dataCriacao) >= new Date(data));
        if (perito) filtradas = filtradas.filter(a => a.perito?.toLowerCase().includes(perito));
        if (ocorrencia) filtradas = filtradas.filter(a => a.ocorrencia?.toString() === ocorrencia);

        auditoriasFiltradasPesquisa = filtradas;
        currentPage = 1;
        atualizarTabelaAuditorias(auditoriasFiltradasPesquisa);
        updatePagination(auditoriasFiltradasPesquisa);
    });

    // Ativar pesquisa ao carregar Enter nos inputs
    ['searchId', 'searchData', 'searchPerito', 'searchOcorrencia'].forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('searchButton').click();
            }
        });
    });
    // Limpar filtros
    document.getElementById('clearFiltersBtn').addEventListener('click', limparFiltros);
    });