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

// REMOVER PERITO SELECIONADO
let peritosParaRemover = []; // variável global temporária

function setupRemoveButton() {
    const removeButton = document.querySelector('.btn-danger');
    removeButton.addEventListener('click', () => {
        const selected = document.querySelectorAll('.expert-checkbox:checked');
        if (selected.length === 0) {
            showCustomAlert('Selecione pelo menos um perito para remover.');
            return;
        }
        // Mostrar modal de confirmação
        document.getElementById('confirmRemoveModal').classList.remove('hidden');

        // Ao clicar em "Remover"
        document.getElementById('confirmRemoveYes').onclick = function() {
            const ids = Array.from(selected).map(c => parseInt(c.getAttribute('data-id')));
            const updated = getExpertsData().filter(expert => !ids.includes(expert.id));
            saveExpertsData(updated);
            document.querySelector('.header-checkbox').checked = false;
            atualizarTabelaPeritos();
            updatePagination();
            document.getElementById('confirmRemoveModal').classList.add('hidden');
        };

        // Ao clicar em "Cancelar"
        document.getElementById('confirmRemoveNo').onclick = function() {
            document.getElementById('confirmRemoveModal').classList.add('hidden');
        };
    });
}

// =========================================================================
// =============================== 3 PONTOS ================================
// =========================================================================

// ---------------------- DETALHES DO PERITO ----------------------
function abrirDetalhesPerito(perito) {
    const modal = document.getElementById('detalhesModal'); //seleciona o modal
    const content = document.getElementById('detalhesPeritoContent'); // onde inserir os dados

    // Filtra as auditorias associadas a este perito
    const auditorias = getAuditorias().filter(a =>
        a.peritos?.some(p => p.id == perito.id)
    );

    // Gerar HTML com a lista de auditorias (ou mensagem se não houver)
    const auditoriasHTML = auditorias.length > 0
        ? `<ul class="auditorias-lista">${auditorias.map(a => `
            <li>
                <span class="info-id">ID Auditoria: ${a.nome || a.id}</span>
                <span class="info-data">Data de Criação: ${a.data || a.dataCriacao?.split("T")[0]}</span>
                <span class="${getEstadoBadgeClass(a.estado)}">${a.estado || '—'}</span>
            </li>`).join('')}
            </ul>`
        : `<p class="no-auditorias">Nenhuma auditoria associada.</p>`;

    // Conteúdo HTML com 2 colunas
    content.innerHTML = `
        <div class="detalhes-grid">
            <div><strong>Nome:</strong> ${perito.name}</div>
            <div><strong>Email:</strong> ${perito.email}</div>
            <div><strong>Código Postal:</strong> ${perito.postalCode || '—'}</div>
            <div><strong>Morada:</strong> ${perito.address || '—'}</div>
            <div><strong>Telefone:</strong> ${perito.phone || '—'}</div>
            <div><strong>Data de Nascimento:</strong> ${formatarDataVisual(perito.birthDate) || '—'}</div>
            <div><strong>Estado:</strong> ${perito.status}</div>
            <div><strong>Auditorias Associadas:</strong> ${auditorias.length}</div>
        </div>

        ${auditoriasHTML}

        <button onclick="editarPerito(${perito.id})">Editar</button>
    `;

    modal.classList.remove('hidden'); // Mostra o modal
}

// Botão para fechar o modal
document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('detalhesModal').classList.add('hidden'); // Esconde o modal
});

// Função que vai buscar auditorias do localStorage
function getAuditorias() {
    return JSON.parse(localStorage.getItem('auditorias')) || [];
}

// ---------------------- EDITAR PERITO ----------------------
function editarPerito(peritoId) {
    const peritos = getExpertsData(); // obter peritos do localStorage	
    const perito = peritos.find(p => p.id === peritoId); // encontrar o perito com o ID a editar
    const content = document.getElementById('detalhesPeritoContent'); // inserir os dados

    // substituir o conteúdo do modal pela edição
    content.innerHTML = `
        <form id="formEditarPerito" class="detalhes-grid">
            <div><strong>Nome:</strong> <input type="text" name="name" value="${perito.name}" required></div>
            <div><strong>Email:</strong> <input type="email" name="email" value="${perito.email}" required></div>
            <div><strong>Código Postal:</strong> <input type="text" name="postalCode" value="${perito.postalCode || ''}"></div>
            <div><strong>Morada:</strong> <input type="text" name="address" value="${perito.address || ''}"></div>
            <div><strong>Telefone:</strong> <input type="text" name="phone" value="${perito.phone || ''}"></div>
            <div><strong>Data de Nascimento:</strong> <input type="date" name="birthDate" value="${formatarDataInput(perito.birthDate)}"></div>
            <div><strong>Especialidade:</strong>
                <select name="specialty">
                    <option ${perito.specialty === 'Buraco na Estrada' ? 'selected' : ''}>Buraco na Estrada</option>
                    <option ${perito.specialty === 'Passeio Danificado' ? 'selected' : ''}>Passeio Danificado</option>
                    <option ${perito.specialty === 'Falta de Sinalização' ? 'selected' : ''}>Falta de Sinalização</option>
                    <option ${perito.specialty === 'Iluminação Pública' ? 'selected' : ''}>Iluminação Pública</option>
                </select>
            </div>
            <div><strong>Estado:</strong>
                <select name="status">
                    <option ${perito.status === 'Disponível' ? 'selected' : ''}>Disponível</option>
                    <option ${perito.status === 'Não Disponível' ? 'selected' : ''}>Não Disponível</option>
                    <option ${perito.status === 'Em Auditoria' ? 'selected' : ''}>Em Auditoria</option>
                </select>
            </div>
        </form>

        <button id="guardarAlteracoesBtn">Guardar Alterações</button>
    `;

    // Botão Guardar alterações
    document.getElementById('guardarAlteracoesBtn').addEventListener('click', () => {
        const form = document.getElementById('formEditarPerito');
        const formData = new FormData(form);

        // Atualizar perito
        const updatedPerito = {
            ...perito,
            name: formData.get('name'),
            email: formData.get('email'),
            postalCode: formData.get('postalCode'),
            address: formData.get('address'),
            phone: formData.get('phone'),
            birthDate: formData.get('birthDate'),
            specialty: formData.get('specialty'),
            status: formData.get('status'),
        };
            // Atualizar perito na lista
            peritos[peritos.findIndex(p => p.id === peritoId)] = updatedPerito;
            saveExpertsData(peritos);

            atualizarTabelaPeritos();
            document.getElementById('detalhesModal').classList.add('hidden');
    });
}

    // Formatar data para input
    function formatarDataInput(data) {
        if (!data) return '';
        // Se já estiver no formato YYYY-MM-DD, retorna direto
        if (/^\d{4}-\d{2}-\d{2}$/.test(data)) return data;
        // Se estiver no formato DD/MM/YYYY → converte
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
            const [d, m, y] = data.split('/');
            return `${y}-${m}-${d}`;
        }
        return ''; // formato inválido
    }

    function formatarDataVisual(data) {
    if (!data) return '';
    // Se for YYYY-MM-DD → converter para DD/MM/YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        const [y, m, d] = data.split('-');
        return `${d}/${m}/${y}`;
    }
    // Se já estiver no formato DD/MM/YYYY → devolver como está
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) return data;
    return ''; // formato inválido
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

// TIPO DE PERITO
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

    document.querySelectorAll('.submenu-item[data-sort]').forEach(btn => {
        btn.addEventListener('click', () => {
            const criterio = btn.getAttribute('data-sort');
            ordenarPorData(criterio);
            document.querySelectorAll('.submenu-item[data-sort]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});

function showCustomAlert(message) {
    document.getElementById('customAlertMessage').textContent = message;
    document.getElementById('customAlertModal').classList.remove('hidden');
}
document.getElementById('customAlertOk').onclick = function() {
    document.getElementById('customAlertModal').classList.add('hidden');
};