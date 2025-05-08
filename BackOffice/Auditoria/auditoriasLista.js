// Dados
let auditoriasData = JSON.parse(localStorage.getItem('auditoriasData')) || [
    {
        id: 1,
        dataCriacao: "2025-05-08", // data da criação da auditoria
        tipo: "Buraco na Estrada", // tipo de auditoria
        estado: "Em Progresso",    // estado atual da auditoria
        perito: "João Silva",      // nome do perito associado (estático para já)
        ocorrencia: "1" // id da ocorrência (estático para já)
    },
    {
        id: 2,
        dataCriacao: "2025-05-07", // data da criação da auditoria
        tipo: "Passeio Danificado", // tipo de auditoria
        estado: "Concluída",    // estado atual da auditoria
        perito: "António Correia",      // nome do perito associado (estático para já)
        ocorrencia: "2" // id da ocorrência (estático para já)
    }
];

// Gravar os dados da auditoria no localStorage
function saveAuditoriasData() {
    localStorage.setItem('auditoriasData', JSON.stringify(auditoriasData));
}

// Variaveis globais
    let currentPage = 1; // Página atual 

    let itemsPerPage = 16; // nº auditorias por página

    let currentTipoFiltro = null; // Filtro de tipo de auditoria

    let currentEstadoFiltro = null; // Filtro de estado da auditoria

    let searchTerm = ''; // Termo de pesquisa

    let dataFiltro = null; // Filtro de data

    let sortOrder = 'recente'; // filtro de ordenação

// Buscar nome do perito associado (estático para já)
function getNomePeritoPorId(idPerito) {
    const experts = JSON.parse(localStorage.getItem('expertsData')) || [];
    const perito = experts.find(expert => expert.id === idPerito);
    return perito ? perito.name : "—";
}


// Botão "Adicionar" 
document.getElementById('addAuditoriaBtn').addEventListener('click', () => {
    window.location.href = 'criarauditoria.html';
});

// Remover
    // Selecionar todos
    function setupHeaderCheckbox() {
        const headerCheckbox = document.querySelector('.header-checkbox');
        headerCheckbox.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.auditoria-checkbox');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
        });
    }

    // Remover auditoria
    function setupRemoveButton() {
        // botão de remover
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

//FILTROS
//MENU LATERAL
    // Ordenação data (+ recente e + antiga)
    function ordenarPorData(criterio) {
        // desativar se estiver ativo
        sortOrder = (sortOrder === criterio) ? null : criterio;
        currentPage = 1;
        atualizarTabelaAuditorias();
        updatePagination();
    }

    // Tipo de auditoria
    function filterByTipoAuditoria(tipo) {
        // desativar se estiver ativo
        currentTipoFiltro = (currentTipoFiltro === tipo) ? null : tipo;
        currentPage = 1;
        atualizarTabelaAuditorias();
        updatePagination();
    }

    // Estado da auditoria
    function filterByEstado(estado) {
        // desativar se estiver ativo
        currentEstadoFiltro = (currentEstadoFiltro === estado) ? null : estado;
        currentPage = 1;
        atualizarTabelaAuditorias();
        updatePagination();
    }

    // FILTRAR AUDITORIAS   
    function filtrarAuditorias() {
        let auditorias = JSON.parse(localStorage.getItem('auditoriasData')) || [];
        if (currentTipoFiltro) {
            auditorias = auditorias.filter(a => a.tipo === currentTipoFiltro);
        }
        if (currentEstadoFiltro) {
            auditorias = auditorias.filter(a => a.estado === currentEstadoFiltro);
        }
        if (searchTerm) {
            const termo = searchTerm.toLowerCase();
            auditorias = auditorias.filter(a =>
                a.tipo.toLowerCase().includes(termo) ||
                a.estado.toLowerCase().includes(termo) ||
                a.perito?.toLowerCase().includes(termo) || 
                a.ocorrencia?.toString().includes(termo) || 
                a.id.toString().includes(termo)
            );
        }
        if (dataFiltro) {
            const filtro = new Date(dataFiltro);
            if (!isNaN(filtro.getTime())) {
                auditorias = auditorias.filter(a => new Date(a.dataCriacao) >= filtro);
            }
        }
        return auditorias;
    }


// ATUALIZAR TABELA
function atualizarTabelaAuditorias() {
    const tbody = document.getElementById("auditoriasTableBody"); // Seleciona o corpo da tabela
    tbody.innerHTML = ""; // Limpa o conteúdo da tabela

    // FILTROS
    let auditoriasFiltradas = filtrarAuditorias();

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

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons(); // Ativa os ícones
    // Botões
    setupRemoveButton();
    setupHeaderCheckbox();
    // Atualiza tabela e paginação logo no início
    atualizarTabelaAuditorias();
    updatePagination();

    // FILTROS
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
});