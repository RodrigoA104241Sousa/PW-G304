// ocorrencias data com localStorage ou default
let occurrencesData = JSON.parse(localStorage.getItem('ocorrencias')) || [];

// Salvar Ocorrencias em localStorage
function saveOcorrenciasData(newOccurrence) {
    // Obter lista atualizada do localStorage
    let data = JSON.parse(localStorage.getItem('ocorrencias')) || [];

    // Gerar novo ID incremental com base no maior ID existente
    const novoId = data.length > 0
        ? Math.max(...data.map(o => o.id || 0)) + 1
        : 1;

    const novaOcorrencia = {
        id: novoId,
        ...newOccurrence
    };

    // Adicionar nova ocorrência à lista
    data.push(novaOcorrencia);
    occurrencesData = data;

    // Guardar no localStorage
    localStorage.setItem('ocorrencias', JSON.stringify(data));

    // Atualizar interface
    atualizarTabelaOcorrencias();
    updatePagination();
}

// =========================================================================
// =========================== VARIÁVEIS GLOBAIS ===========================
// =========================================================================
// Exemplo de ocorrencias
    let ocorrenciasFiltradasPesquisa = null;

// Paginação
let currentPage = 1; // Página atual 
let itemsPerPage = 5; // nº ocorrências por página

// Menu lateral
let currentTipoFiltro = []; // Filtro de tipo de ocorrencia
let currentEstadoFiltro = []; // Filtro de estado da ocorrencia
let sortOrder = 'recente'; // filtro de ordenação

// Pesquisa
let filtroId = null; // id da ocorrencia
let filtroEmailUsuario = null; // nome da ocorrencia
let filtroData = null; // data de criação
let filtroMorada = null; 


// =========================================================================
// ============================ FUNCIONALIDADES ============================
// =========================================================================

// ----------------------  BOTÃO ADICIONAR ----------------------  
document.getElementById('addOcorrenciaBtn').addEventListener('click', () => {
    window.location.href = '../../Frontoffice/Formulario de Ocorr 1/index.html';
});

// ----------------------  BOTÃO REMOVER ----------------------  
// QUADRADO (SELECIONAR TODAS AS OCORRÊNCIAS)
function setupHeaderCheckbox() {
    const headerCheckbox = document.querySelector('.header-checkbox');
    headerCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.ocorrencia-checkbox');
        checkboxes.forEach(cb => cb.checked = e.target.checked);
    });
}

// REMOVER OCORRÊNCIA SELECIONADA
function setupRemoveButton() {
    // BOTÃO
    const removeButton = document.querySelector('.btn-danger');
    // quando clicar no botão
    removeButton.addEventListener('click', () => {
        // verifica as selecionadas
        const selected = document.querySelectorAll('.ocorrencia-checkbox:checked');
        if (selected.length === 0) {
            alert('Selecione pelo menos uma ocorrência para remover.');
            return;
        }

        if (confirm('Tem certeza que deseja remover as ocorrências selecionadas?')) {
            // Vê ids das ocorrências selecionadas
            const ids = Array.from(selected).map(c => parseInt(c.getAttribute('data-id')));

            // remove as ocorrencias selecionadas
            occurrencesData = occurrencesData.filter(a => !ids.includes(parseInt(a.id)));
            localStorage.setItem('ocorrencias', JSON.stringify(occurrencesData));
            document.querySelector('.header-checkbox').checked = false; // desmarca os checkboxs
            // atualiza a tabela e a paginação
            atualizarTabelaOcorrencias(); 
            updatePagination();
        }
    });
}

// =========================================================================
// ================================ FILTROS ================================
// =========================================================================
// ---------------------- MENU LATERAL ----------------------
// + RECENTE / ANTIGA
function ordenarPorData(criterio) {
    if (sortOrder === criterio) return; 
    sortOrder = criterio;
    currentPage = 1;
    atualizarTabelaOcorrencias();
    updatePagination();
}

// TIPO DE OCORRÊNCIA
function filterByTipoOcorrencia(tipo) {
    const i = currentTipoFiltro.indexOf(tipo);
    if (i >= 0) {
        currentTipoFiltro.splice(i, 1);
    } else {
        currentTipoFiltro.push(tipo);
    }
    currentPage = 1;
    atualizarTabelaOcorrencias();
    updatePagination();
}

// ESTADO DA OCORRÊNCIA
function filterByEstado(estado) {
    const i = currentEstadoFiltro.indexOf(estado);
    if (i >= 0) {
        currentEstadoFiltro.splice(i, 1);
    } else {
        currentEstadoFiltro.push(estado);
    }
    currentPage = 1;
    atualizarTabelaOcorrencias();
    updatePagination();
}

// ---------------------- FILTRAR OCORRÊNCIAS ----------------------
function filtrarOcorrencias() {
    let filtradas = [...occurrencesData];
    // ID
    if (filtroId) {
        filtradas = filtradas.filter(a => a.id.toString() === filtroId);
    }
    // TIPO 
    if (currentTipoFiltro.length > 0) {
        filtradas  = filtradas .filter(a => currentTipoFiltro.includes(a.tipo));
    }
    // EMAIL DO USUÁRIO
    if (filtroEmailUsuario) {
        filtradas = filtradas.filter(a =>   
            a.email?.toLowerCase().includes(filtroEmailUsuario)
        );
    }
    // ESTADO
    if (currentEstadoFiltro.length > 0) {
        filtradas  = filtradas .filter(a => currentEstadoFiltro.includes(a.estado));
    }
    // DATA
    if (filtroData) {
        const filtro = new Date(filtroData).toDateString();
        filtradas = filtradas.filter(a => {
            const dataOcorr = new Date(a.data.replace(/(\d{2})\/(\d{2})\/(\d{4}), (.+)/, '$2/$1/$3 $4')).toDateString();
            return dataOcorr === filtro;
        });
    }
    return filtradas; 
}


// ---------------------- LIMPAR FILTROS ----------------------
function limparFiltros() {
    // Limpar inputs do topo
    document.getElementById('searchId').value = '';
    document.getElementById('searchEmailUsuario').value = '';
    document.getElementById('searchData').value = '';

    // Reset das variáveis globais
    ocorrenciasFiltradasPesquisa = null;
    filtroId = null;
    filtroEmailUsuario = null;
    filtroData = null;
    currentTipoFiltro = [];
    currentEstadoFiltro = [];
    sortOrder = 'recente'; 

    // Remover botões ativos do menu lateral
    document.querySelectorAll('[data-tipo], [data-estado], [data-sort]').forEach(btn => {
        btn.classList.remove('active');
    });

    // Repor página inicial e atualizar
    currentPage = 1;
    atualizarTabelaOcorrencias();
    updatePagination();
}

// =========================================================================
// =========================== ATUALIZAR TABELA ============================
// =========================================================================

function atualizarTabelaOcorrencias(lista = null) {
    const tbody = document.getElementById("occurrencesTableBody");
    tbody.innerHTML = "";

    let ocorrenciasFiltradas = lista || filtrarOcorrencias();

    if (sortOrder) {
        ocorrenciasFiltradas.sort((a, b) => {
            const dataA = new Date(a.data.replace(/(\d{2})\/(\d{2})\/(\d{4}), (.+)/, '$2/$1/$3 $4'));
            const dataB = new Date(b.data.replace(/(\d{2})\/(\d{2})\/(\d{4}), (.+)/, '$2/$1/$3 $4'));
            return sortOrder === 'recente' ? dataB - dataA : dataA - dataB;
        });
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginaOcorrencias = ocorrenciasFiltradas.slice(start, end);

    paginaOcorrencias.forEach(ocorrencia => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" class="ocorrencia-checkbox" data-id="${ocorrencia.id}"></td>
            <td>${ocorrencia.id}</td>
            <td>
                <div class="user-info">
                    <div class="user-email">${ocorrencia.email || 'N/A'}</div>
                </div>
            </td>
            <td>${ocorrencia.tipo}</td>
            <td>${ocorrencia.data || "—"}</td>
             <td><span class="status-badge ${getEstadoBadgeClass(ocorrencia.estado)}">${ocorrencia.estado}</span></td>
            <td>
                <button class="btn-icon details-btn" data-id="${ocorrencia.id}">
                    <i data-lucide="more-vertical"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);

        const detailsBtn = row.querySelector('.details-btn');
        detailsBtn.addEventListener('click', () => {
            localStorage.setItem('selectedOccurrenceId', ocorrencia.id);
            window.location.href = '../Ocorrência/DetalhesOcorrência/detalhesocorrencia.html';
        });
    });

    lucide.createIcons();
}

// ---------------------- ESTILO ESTADO ----------------------
function getEstadoBadgeClass(estado) {
    switch (estado) {
        case 'Aceite':
            return 'status-badge status-available';
        case 'Não Aceite':
            return 'status-badge status-unavailable';
        case 'Em espera':
            return 'status-badge status-audit';
        default:
            return 'status-badge';
    }
}


// =========================================================================
// =============================== PAGINAÇÃO ===============================
// =========================================================================

function updatePagination(lista = null) {
    const totalItems = (lista || filtrarOcorrencias()).length; // total de ocorrencias filtradas 
    const totalPages = Math.ceil(totalItems / itemsPerPage); // total de páginas necessárias

    const start = (currentPage - 1) * itemsPerPage + 1; // primeiro item da página
    const end = Math.min(currentPage * itemsPerPage, totalItems); // último item da página
    
    // Atualiza a informação de paginação
    document.querySelector('.pagination-info').textContent =
        `Mostrando ${start} - ${end} de ${totalItems} ocorrências registradas`;

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
    atualizarTabelaOcorrencias(); 
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
    atualizarTabelaOcorrencias(ocorrenciasFiltradasPesquisa);
    updatePagination(ocorrenciasFiltradasPesquisa);

    // Atualizar itemsPerPage com base no dropdown
    const itemsPerPageSelect = document.getElementById("itemsPerPageSelect");
    if (itemsPerPageSelect) {
        itemsPerPageSelect.value = itemsPerPage;

        itemsPerPageSelect.addEventListener("change", () => {
            itemsPerPage = parseInt(itemsPerPageSelect.value);
            currentPage = 1;
            atualizarTabelaOcorrencias();
            updatePagination();
        });
    }
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
     
    // Tipo de Ocorrencia
    document.querySelectorAll('.submenu-item[data-tipo]').forEach(btn => {
        btn.addEventListener('click', () => {
            const tipo = btn.getAttribute('data-tipo');
            filterByTipoOcorrencia(tipo);
            // Alternar visualmente a classe .active
            btn.classList.toggle('active');
        });
    });

    // Estado da Ocorrencia
    document.querySelectorAll('.submenu-item[data-estado]').forEach(btn => {
        btn.addEventListener('click', () => {
            const estado = btn.getAttribute('data-estado');
            filterByEstado(estado);
            // Alternar visualmente a classe .active
            btn.classList.toggle('active');
        });
    });
    // -------------------- FILTROS DE PESQUISA --------------------
    document.getElementById('searchButton').addEventListener('click', () => {
        filtroId = document.getElementById('searchId').value.trim();
        filtroEmailUsuario = document.getElementById('searchEmailUsuario').value.trim().toLowerCase();
        filtroData = document.getElementById('searchData').value;

        ocorrenciasFiltradasPesquisa = filtrarOcorrencias();
        currentPage = 1;
        atualizarTabelaOcorrencias(ocorrenciasFiltradasPesquisa);
        updatePagination(ocorrenciasFiltradasPesquisa);
    });

    // Ativar pesquisa ao carregar Enter nos inputs
    ['searchId', 'searchEmailUsuario', 'searchData'].forEach(id => {
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


