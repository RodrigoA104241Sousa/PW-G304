function getExpertsData() {
    return JSON.parse(localStorage.getItem('expertsData')) || [];
}

// Salvar Peritos em localStorage
function saveExpertsData(data) {
    try {
        localStorage.setItem('expertsData', JSON.stringify(data));
    } catch (error) {
        console.error('Erro ao salvar peritos:', error);
    }
}

// =========================== VARIÁVEIS GLOBAIS ===========================
// =========================================================================
    // Exemplo de peritos
    let peritosFiltradosPesquisa = null;
    // Paginação
    let currentPage = 1; // Página atual 
    let itemsPerPage = 5; // nº peritos por página

    // Menu lateral
    let currentTipoFiltro = []; // Filtro de especialidade
    let currentEstadoFiltro = []; // Filtro de estado do perito
    let sortOrder = 'recente'; // filtro de ordenação

    // Pesquisa
    let filtroPerito = null; // nome do perito
    let filtroData = null; // data de criação
    


// =========================================================================
// ============================ FUNCIONALIDADES ============================
// =========================================================================   

// ----------------------  BOTÃO ADICIONAR ----------------------  
document.getElementById('addExpertBtn').addEventListener('click', () => {
    window.location.href = './RegistarPeritos/registaperito.html';
});

// ----------------------  BOTÃO REMOVER ----------------------  
// QUADRADO (SELECIONAR TODAS AS AUDITORIAS)
function setupHeaderCheckbox() {
    const headerCheckbox = document.querySelector('.header-checkbox');
    headerCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.expert-checkbox');
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
        const selected = document.querySelectorAll('.expert-checkbox:checked');
        if (selected.length === 0) {
            alert('Selecione pelo menos um perito para remover.');
            return;
        }

        if (confirm('Tem certeza que deseja remover os peritos selecionados?')) {
            // Vê ids das auditorias selecionadas
            const selectedIds = Array.from(selected).map(checkbox => 
                parseInt(checkbox.getAttribute('data-id'))
            );
            // remove as auditorias selecionadas
            const updated = getExpertsData().filter(expert => !selectedIds.includes(expert.id));
            saveExpertsData(updated); // atualiza o localStorage
            document.querySelector('.header-checkbox').checked = false; // desmarca os checkboxs
            // atualiza a tabela e a paginação
            atualizarTabelaPeritos(); 
            updatePagination();
        }
    });
}

// =========================================================================
// =============================== 3 PONTOS ================================
// =========================================================================
function abrirDetalhesPerito(perito) {
    const modal = document.getElementById('detalhesModal');
    const content = document.getElementById('detalhesPeritoContent');

    // Buscar todas as auditorias associadas a este perito
    const auditorias = getAuditorias().filter(a =>
        a.peritos?.some(p => p.id == perito.id)
    );

    // Gerar HTML com a lista de auditorias
    const auditoriasHTML = auditorias.length > 0
        ? `<ul>${auditorias.map(a => `<li>${a.nome} (${a.data || a.dataCriacao?.split("T")[0]})</li>`).join('')}</ul>`
        : `<p class="no-auditorias">Nenhuma auditoria associada.</p>`;

    // Conteúdo HTML com 2 colunas
    content.innerHTML = `
        <div class="detalhes-grid">
            <div><strong>Nome:</strong> ${perito.name}</div>
            <div><strong>Email:</strong> ${perito.email}</div>
            <div><strong>Código Postal:</strong> ${perito.postalCode || '—'}</div>
            <div><strong>Morada:</strong> ${perito.address || '—'}</div>
            <div><strong>Telefone:</strong> ${perito.phone || '—'}</div>
            <div><strong>Data de Nascimento:</strong> ${perito.birthDate || '—'}</div>
            <div><strong>Estado:</strong> ${perito.status}</div>
            <div><strong>Auditorias Associadas:</strong> ${auditorias.length}</div>
        </div>

        ${auditoriasHTML}

        <button onclick="editarPerito(${perito.id})">Editar</button>
    `;

    modal.classList.remove('hidden');
}

// Botão para fechar o modal
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('detalhesModal').classList.add('hidden');
});

// Função auxiliar para buscar auditorias do localStorage
function getAuditorias() {
    return JSON.parse(localStorage.getItem('auditorias')) || [];
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
    atualizarTabelaPeritos();
    updatePagination();
}

// TIPO DE AUDITORIA
function filterByEspecialidade(tipo) {
    const i = currentTipoFiltro.indexOf(tipo);
    if (i >= 0) {
        currentTipoFiltro.splice(i, 1);
    } else {
        currentTipoFiltro.push(tipo);
    }
    currentPage = 1;
    atualizarTabelaPeritos();
    updatePagination();
}

// ESTADO DO PERITO
function filterByEstado(estado) {
    const i = currentEstadoFiltro.indexOf(estado);
    if (i >= 0) {
        currentEstadoFiltro.splice(i, 1);
    } else {
        currentEstadoFiltro.push(estado);
    }
    currentPage = 1;
    atualizarTabelaPeritos();
    updatePagination();
}

// ---------------------- FILTRAR PERITOS ----------------------
function filtrarPeritos() {
    let filtradas = [...getExpertsData()];
    // TIPO 
    if (currentTipoFiltro.length > 0) {
        filtradas  = filtradas .filter(a => currentTipoFiltro.includes(a.specialty));
    }
    // ESTADO
    if (currentEstadoFiltro.length > 0) {
        filtradas  = filtradas .filter(a => currentEstadoFiltro.includes(a.status));
    }
    // DATA
    if (filtroData) {
    filtradas = filtradas.filter(a => {
        const [d, m, y] = a.startDate.split('/');
        return new Date(`${y}-${m}-${d}`) >= new Date(filtroData);
    });
    }
    return filtradas;
}

// ---------------------- LIMPAR FILTROS ----------------------
function limparFiltros() {
    // Limpar inputs do topo
    document.getElementById('searchPerito').value = '';
    document.getElementById('searchData').value = '';



    // Reset das variáveis globais
    peritosFiltradosPesquisa = null;
    filtroData = null;
    filtroPerito = null;
    currentTipoFiltro = [];
    currentEstadoFiltro = [];
    sortOrder = 'recente'; 

    // Remover botões ativos do menu lateral
    document.querySelectorAll('[data-tipo], [data-estado], [data-sort]').forEach(btn => {
        btn.classList.remove('active');
    });

    // Repor página inicial e atualizar
    currentPage = 1;
    atualizarTabelaPeritos();
    updatePagination();
}

// =========================================================================
// =========================== ATUALIZAR TABELA ============================
// =========================================================================

function atualizarTabelaPeritos(lista = null) {
    const tbody = document.getElementById("expertsTableBody");
    tbody.innerHTML = "";

    let peritosFiltrados = lista || filtrarPeritos();

    if (sortOrder) {
        peritosFiltrados.sort((a, b) => {
            const [dA, mA, yA] = a.startDate.split('/');
            const [dB, mB, yB] = b.startDate.split('/');
            const dataA = new Date(`${yA}-${mA}-${dA}`);
            const dataB = new Date(`${yB}-${mB}-${dB}`);
            return sortOrder === 'recente' ? dataB - dataA : dataA - dataB;
        });
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginaPeritos = peritosFiltrados.slice(start, end);

    paginaPeritos.forEach(expert => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" class="expert-checkbox" data-id="${expert.id}"></td>
            <td>
                <div class="expert-info">
                    <div class="expert-name">${expert.name}</div>
                    <div class="expert-email">${expert.email}</div>
                </div>
            </td>
            <td>${expert.startDate}</td>
            <td>${expert.specialty}</td>
            <td><span class="status-badge ${getEstadoBadgeClass(expert.status)}">${expert.status}</span></td>
            <td>
                <button class="btn-icon">
                    <i data-lucide="more-vertical"></i>
                </button>
            </td>
        `;
        // Botão 3 pontos
        row.querySelector('.btn-icon').addEventListener('click', () => {
            abrirDetalhesPerito(expert);
        });
        tbody.appendChild(row);
    });

    lucide.createIcons();
}
// ---------------------- ESTILO ESTADO ----------------------
function getEstadoBadgeClass(estado) {
    switch (estado) {
        case 'Disponível':
            return 'status-badge status-available';
        case 'Não Disponível':
            return 'status-badge status-unavailable';
        case 'Em Auditoria':
            return 'status-badge status-audit';
        default:
            return 'status-badge';
    }
}

// =========================================================================
// =============================== PAGINAÇÃO ===============================
// =========================================================================

function updatePagination(lista = null) {
    const totalItems = (lista || filtrarPeritos()).length; // total de peritos 
    const totalPages = Math.ceil(totalItems / itemsPerPage); // total de páginas necessárias

    const start = (currentPage - 1) * itemsPerPage + 1; // primeiro item da página
    const end = Math.min(currentPage * itemsPerPage, totalItems); // último item da página
    
    // Atualiza a informação de paginação
    document.querySelector('.pagination-info').textContent =
        `Mostrando ${start} - ${end} de ${totalItems} peritos registrados`;

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
    atualizarTabelaPeritos(); 
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
    atualizarTabelaPeritos(peritosFiltradosPesquisa);
    updatePagination(peritosFiltradosPesquisa);

    // Atualizar itemsPerPage com base no dropdown
    const itemsPerPageSelect = document.getElementById("itemsPerPageSelect");
    if (itemsPerPageSelect) {
        itemsPerPageSelect.value = itemsPerPage;

        itemsPerPageSelect.addEventListener("change", () => {
            itemsPerPage = parseInt(itemsPerPageSelect.value);
            currentPage = 1;
            atualizarTabelaPeritos();
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
     
    // Especialidade
    document.querySelectorAll('[data-tipo]').forEach(btn => {
        btn.addEventListener('click', () => {
            const tipo = btn.getAttribute('data-tipo');
            filterByEspecialidade(tipo);

            // Alternar visualmente a classe .active
            btn.classList.toggle('active');
        });
    });

    // Estado da auditoria
    document.querySelectorAll('[data-estado]').forEach(btn => {
        btn.addEventListener('click', () => {
            const estado = btn.querySelector('span:last-child').textContent.trim();
            filterByEstado(estado);

            // Alternar visualmente a classe .active
            btn.classList.toggle('active');
        });
    });
    // -------------------- FILTROS DE PESQUISA --------------------
    document.getElementById('searchButton').addEventListener('click', () => {
        // Nome Perito
        const perito = document.getElementById('searchPerito').value.trim().toLowerCase();
        // Data
        const data = document.getElementById('searchData').value;
        

        let filtradas = [...getExpertsData()];

        if (perito) filtradas = filtradas.filter(a =>
            a.name.toLowerCase().includes(perito) ||
            a.email.toLowerCase().includes(perito)
        );
        if (data) {
            filtradas = filtradas.filter(a => {
                const [d, m, y] = a.startDate.split('/');
                return new Date(`${y}-${m}-${d}`) >= new Date(data);
            });
        }

        peritosFiltradosPesquisa = filtradas;
        currentPage = 1;
        atualizarTabelaPeritos(peritosFiltradosPesquisa);
        updatePagination(peritosFiltradosPesquisa);
    });

    // Ativar pesquisa ao carregar Enter nos inputs
    ['searchPerito', 'searchData'].forEach(id => {
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