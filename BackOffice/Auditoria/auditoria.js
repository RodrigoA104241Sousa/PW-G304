// Inicialização dos dados de auditorias
let auditoriasData = JSON.parse(localStorage.getItem('auditoriasData')) || [
    {
        id: 1,
        nome: "a",
        email: "antoniocorreiabusiness@gmail.com",
        data: "2025-05-07", // formato compatível com Date()
        tipo: "Buraco na Estrada",
        estado: "Disponível"
    }
];

// Guardar no localStorage
function saveAuditoriasData() {
    localStorage.setItem('auditoriasData', JSON.stringify(auditoriasData));
}

// Estado dos filtros
let currentPage = 1;
let itemsPerPage = 16;
let auditoriaEstadoFiltro = null;
let auditoriaTipoFiltro = null;
let termoPesquisaNome = '';
let termoPesquisaTipo = '';
let termoPesquisaEstado = '';
let dataFiltroAuditoria = null;

// Atualizar paginação
function updatePagination() {
    const auditorias = filtrarAuditorias();
    const total = auditorias.length;
    const totalPages = Math.ceil(total / itemsPerPage);
    
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);
    document.querySelector('.pagination-info').textContent = 
        `Mostrando ${start} - ${end} de ${total} auditorias registadas`;

    const paginationButtons = document.querySelector('.pagination-buttons');
    paginationButtons.innerHTML = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">&lt;</button>
        ${getPaginationButtons(currentPage, totalPages)}
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">&gt;</button>
    `;

    document.querySelector('.pagination-controls select').value = itemsPerPage;
}

function getPaginationButtons(current, total) {
    let buttons = '';
    for (let i = 1; i <= total; i++) {
        buttons += `<button ${i === current ? 'class="active"' : `onclick="changePage(${i})"`}>${i}</button>`;
    }
    return buttons;
}

function changePage(page) {
    currentPage = page;
    atualizarTabelaAuditorias();
    updatePagination();
}

// Funções de filtro
function filtrarPorEstadoAuditoria(estado) {
    auditoriaEstadoFiltro = estado;
    currentPage = 1;
    atualizarTabelaAuditorias();
    updatePagination();
}

function filtrarPorTipoAuditoria(tipo) {
    auditoriaTipoFiltro = tipo;
    currentPage = 1;
    atualizarTabelaAuditorias();
    updatePagination();
}

function procurarAuditorias() {
    termoPesquisaNome = document.getElementById('searchNome').value.toLowerCase().trim();
    termoPesquisaTipo = document.getElementById('searchTipo').value.toLowerCase().trim();
    termoPesquisaEstado = document.getElementById('searchEstado').value.toLowerCase().trim();
    currentPage = 1;
    atualizarTabelaAuditorias();
    updatePagination();
}

function filtrarPorDataAuditoria(data) {
    dataFiltroAuditoria = data;
    currentPage = 1;
    atualizarTabelaAuditorias();
    updatePagination();
}

// Filtrar auditorias segundo critérios
function filtrarAuditorias() {
    let auditorias = JSON.parse(localStorage.getItem('auditoriasData')) || [];

    if (auditoriaEstadoFiltro) {
        auditorias = auditorias.filter(a => a.estado === auditoriaEstadoFiltro);
    }
    if (auditoriaTipoFiltro) {
        auditorias = auditorias.filter(a => a.tipo === auditoriaTipoFiltro);
    }
    if (termoPesquisaNome) {
        auditorias = auditorias.filter(a =>
            a.nome.toLowerCase().includes(termoPesquisaNome) ||
            a.email.toLowerCase().includes(termoPesquisaNome)
        );
    }
    if (termoPesquisaTipo) {
        auditorias = auditorias.filter(a =>
            a.tipo.toLowerCase().includes(termoPesquisaTipo)
        );
    }
    if (termoPesquisaEstado) {
        auditorias = auditorias.filter(a =>
            a.estado.toLowerCase().includes(termoPesquisaEstado)
        );
    }
    if (dataFiltroAuditoria) {
        const filtro = new Date(dataFiltroAuditoria);
        auditorias = auditorias.filter(a => new Date(a.data) >= filtro);
    }

    return auditorias;
}

// Atualizar tabela
function atualizarTabelaAuditorias() {
    const tbody = document.getElementById("expertsTableBody");
    let auditorias = filtrarAuditorias();
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageAuditorias = auditorias.slice(start, end);

    tbody.innerHTML = "";
    
    pageAuditorias.forEach(auditoria => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <input type="checkbox" class="auditoria-checkbox" data-id="${auditoria.id}">
                <div>${auditoria.nome}</div>
                <div class="expert-email">${auditoria.email}</div>
            </td>
            <td>${auditoria.data}</td>
            <td>${auditoria.tipo}</td>
            <td><span class="status-badge">${auditoria.estado}</span></td>
            <td>
                <button class="btn-icon">
                    <i data-lucide="more-vertical"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    lucide.createIcons();
}

// Remover auditorias selecionadas
function setupRemoveButton() {
    const removeButton = document.querySelector('.btn-danger');
    removeButton.addEventListener('click', () => {
        const selected = document.querySelectorAll('.auditoria-checkbox:checked');
        if (selected.length === 0) {
            alert('Selecione pelo menos uma auditoria para remover.');
            return;
        }

        if (confirm('Tem certeza que deseja remover as auditorias selecionadas?')) {
            const ids = Array.from(selected).map(c => parseInt(c.getAttribute('data-id')));
            auditoriasData = auditoriasData.filter(a => !ids.includes(a.id));
            saveAuditoriasData();
            document.querySelector('.header-checkbox')?.checked = false;
            atualizarTabelaAuditorias();
            updatePagination();
        }
    });
}

// Inicializar tudo ao carregar
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    atualizarTabelaAuditorias();
    setupRemoveButton();
    updatePagination();

    // Eventos de filtro por estado
    document.querySelectorAll('.submenu-item[data-status]').forEach(btn => {
        btn.addEventListener('click', () => {
            const estado = btn.getAttribute('data-status');
            filtrarPorEstadoAuditoria(estado);
        });
    });

    // Eventos de filtro por tipo
    document.querySelectorAll('.submenu-item').forEach(item => {
        const tipo = item.textContent.trim();
        if (['Buraco na Estrada', 'Passeio Danificado', 'Falta de Sinalização', 'Iluminação Pública'].includes(tipo)) {
            item.addEventListener('click', () => {
                filtrarPorTipoAuditoria(tipo);
            });
        }
    });

    document.getElementById('searchButton').addEventListener('click', procurarAuditorias);
    document.getElementById('dateInput').addEventListener('change', (e) => {
        filtrarPorDataAuditoria(e.target.value);
    });

    document.querySelector('.pagination-controls select').addEventListener('change', (e) => {
        itemsPerPage = parseInt(e.target.value);
        currentPage = 1;
        atualizarTabelaAuditorias();
        updatePagination();
    });

    // ✅ Corrigido: garantir que o botão existe no momento certo
    document.getElementById('addExpertBtn').addEventListener('click', () => {
        window.location.href = 'criarauditoria.html';
    });
});
