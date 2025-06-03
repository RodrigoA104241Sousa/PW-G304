let occurrencesData = JSON.parse(localStorage.getItem('ocorrencias')) || [];

// Salvar ocorrência no localStorage
function saveOccurrence(newOccurrence) {
    const nextId = occurrencesData.length > 0
        ? Math.max(...occurrencesData.map(o => o.id)) + 1
        : 1;

    occurrencesData.push({
        id: nextId,
        ...newOccurrence
    });

    localStorage.setItem('ocorrencias', JSON.stringify(occurrencesData));
    atualizarTabelaOcorrencias();
    updatePagination();
}

// =========================================================================
// =========================== VARIÁVEIS GLOBAIS ===========================
// =========================================================================
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

// ----------------------  BOTÃO REMOVER ----------------------  
// QUADRADO (SELECIONAR TODAS AS OCORRÊNCIAS)
function setupHeaderCheckbox() {
    const headerCheckbox = document.querySelector('.header-checkbox');
    headerCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.occurrence-checkbox');
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
        const selected = document.querySelectorAll('.occurrence-checkbox:checked');
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
    let ocorrencias = [...occurrencesData];
    let filtradas = [...ocorrencias];
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
            const dataOcorr = parsePtDate(a.data).toDateString();
            return dataOcorr === filtro;
        });
    }
    // ORDENAR POR DATA (usando parsePtDate)
    filtradas.sort((a, b) => {
        const dataA = parsePtDate(a.data);
        const dataB = parsePtDate(b.data);
        return sortOrder === 'recente' ? dataB - dataA : dataA - dataB;
    });
    
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

function atualizarTabelaOcorrencias() {
    const tbody = document.getElementById("occurrencesTableBody");
    if (!tbody) {
        console.error("Table body not found!");
        return;
    }
    tbody.innerHTML = "";

    const ocorrencias = filtrarOcorrencias();

    // Cálculo do intervalo da página atual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, ocorrencias.length);
    const pageItems = ocorrencias.slice(startIndex, endIndex);

    // Preencher a tabela apenas com os itens desta página
    pageItems.forEach(occ => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" class="occurrence-checkbox" data-id="${occ.id}"></td>
            <td>${occ.id}</td>
            <td>
                <div class="user-info">
                    <div class="user-email">${occ.email || 'N/A'}</div>
                </div>
            </td>
            <td>${occ.data}</td>
            <td>${occ.tipo || 'N/A'}</td>
            <td><span class="status-badge ${getEstadoBadgeClass(occ.estado)}">${occ.estado}</span></td>
            <td>
                <button class="btn-icon details-btn" data-id="${occ.id}">
                    <i data-lucide="more-vertical"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);

        row.querySelector(".details-btn").addEventListener("click", () => {
            localStorage.setItem("selectedOccurrenceId", occ.id);
            window.location.href = "detalhesOcorrência/detalhesocorrencia.html";
        });
    });

    lucide.createIcons(); // Atualiza os ícones
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

function updatePagination() {
    const occurrences = filtrarOcorrencias();
    const totalOccurrences = occurrences.length; // total de ocorrencias filtradas 
    const totalPages = Math.ceil(totalOccurrences / itemsPerPage); // total de páginas necessárias

    const start = (currentPage - 1) * itemsPerPage + 1; // primeiro item da página
    const end = Math.min(currentPage * itemsPerPage, totalOccurrences); // último item da página
    
    // Atualiza a informação de paginação
     document.querySelector('.pagination-info').textContent = 
        `Mostrando ${start} - ${end} de ${totalOccurrences} ocorrências registradas`;

    // botões de paginação
    const paginationButtons = document.querySelector('.pagination-buttons');
    // anterior, números das páginas e proximo 
    paginationButtons.innerHTML = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">&lt;</button>
        ${getPaginationButtons(currentPage, totalPages)}
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">&gt;</button>
    `;
     // Update items per page select
    const select = document.querySelector('.pagination-controls select');
    select.value = itemsPerPage;
}

// Criar botões numerados
function getPaginationButtons(current, total) {
    let buttons = '';
    // botão para cada pagina, pagina atual = active
     for (let i = 1; i <= total; i++) {
        if (i === current) {
            buttons += `<button class="active">${i}</button>`;
        } else {
            buttons += `<button onclick="changePage(${i})">${i}</button>`;
        }
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
// ========================= PREENCHER FORMULÁRIO ==========================
// =========================================================================
function preencherFormularioComOcorrencia(id) {
    const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
    const ocorrencia = ocorrencias.find(occ => occ.id === id);

    if (!ocorrencia) {
        console.error(`Ocorrência com ID ${id} não encontrada.`);
        return;
    }

    // Preencher os campos do formulário
    document.getElementById('codigo-postal').value = ocorrencia.codigoPostal || '';
    document.getElementById('descricao').value = ocorrencia.descricao || '';
    document.getElementById('email').value = ocorrencia.email || '';
    document.getElementById('morada').value = ocorrencia.morada || '';
    document.getElementById('tipo-ocorrencia').value = ocorrencia.tipo || '';

   // Exibir imagens, se existirem
    const imagensContainer = document.getElementById('imagens-container');
    imagensContainer.innerHTML = ''; // Limpar imagens existentes
    if (ocorrencia.imagens && ocorrencia.imagens.length > 0) {
        ocorrencia.imagens.forEach(imagemBase64 => {
            const img = document.createElement('img');
            img.src = imagemBase64;
            img.alt = 'Imagem da ocorrência';
            img.style.width = '100px';
            img.style.marginRight = '10px';
            imagensContainer.appendChild(img);
        });
    }
}

// Função auxiliar para converter "19/05/2025, 17:52:07" em objeto Date
function parsePtDate(dateStr) {
    // Divide em data e hora
    const [datePart, timePart] = dateStr.split(',');
    if (!datePart) return new Date(0); // fallback para datas inválidas
    const [day, month, year] = datePart.trim().split('/');
    const time = timePart ? timePart.trim() : '00:00:00';
    // Cria string ISO: "2025-05-19T17:52:07"
    return new Date(`${year}-${month}-${day}T${time}`);
}

// =========================================================================
// =========================== DOMContentLoaded ============================
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log('Current localStorage data:', localStorage.getItem('ocorrencias'));

    lucide.createIcons(); // Ativa os ícones
   // ---------- BOTÃO Remover ----------
    setupRemoveButton();
    setupHeaderCheckbox();

    const selectedOccurrenceId = parseInt(localStorage.getItem('selectedOccurrenceId'), 10);
    if (selectedOccurrenceId) {
        try {
            // Só tenta preencher se o campo essencial existir
            if (document.getElementById('codigo-postal')) {
                preencherFormularioComOcorrencia(selectedOccurrenceId);
            }
        } catch (e) {
            console.warn("Erro ao preencher formulário:", e);
        }
    }
    // --------- ATUALIZAR TABELA / PAGINAÇÃO ---------
    atualizarTabelaOcorrencias();
    updatePagination();
    
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
        document.querySelector('[data-sort="recente"]').classList.add('active');
    });

    // Antiga
    document.querySelector('[data-sort="antiga"]').addEventListener('click', () => {
        ordenarPorData('antiga');
        document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-sort="antiga"]').classList.add('active');
    });
     
    // Tipo de Ocorrencia
   document.querySelectorAll('.submenu-item[data-tipo]').forEach(btn => {
        btn.addEventListener('click', () => {
            const tipo = btn.getAttribute('data-tipo');
            filterByTipoOcorrencia(tipo);

            // Atualiza visualmente a classe active com base na presença no filtro
            if (currentTipoFiltro.includes(tipo)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    });

    // Estado da Ocorrencia
   document.querySelectorAll('.submenu-item[data-estado]').forEach(btn => {
        btn.addEventListener('click', () => {
            const estado = btn.getAttribute('data-estado');
            filterByEstado(estado);

            if (currentEstadoFiltro.includes(estado)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    });
    // -------------------- FILTROS DE PESQUISA --------------------
    document.getElementById('searchButton').addEventListener('click', () => {
        filtroId = document.getElementById('searchId').value.trim();
        filtroEmailUsuario = document.getElementById('searchEmailUsuario').value.trim().toLowerCase();
        filtroData = document.getElementById('searchData').value;

        ocorrenciasFiltradasPesquisa = filtrarOcorrencias();
        currentPage = 1;
        atualizarTabelaOcorrencias();
        updatePagination();
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
