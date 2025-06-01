// auditorias data com localStorage ou default
let auditoriasData = JSON.parse(localStorage.getItem('auditorias')) || [];

// Salvar Auditorias em localStorage
function saveAuditoriasData() {
    try {
        localStorage.setItem('auditorias', JSON.stringify(auditoriasData));
    } catch (error) {
        console.error('Erro ao salvar auditorias:', error);
    }
}

// =========================== VARIÁVEIS GLOBAIS ===========================
// =========================================================================
    // Exemplo de auditorias
    let auditoriasFiltradasPesquisa = null;
    // Paginação
    let currentPage = 1; // Página atual 
    let itemsPerPage = 5; // nº auditorias por página

    // Menu lateral
    let currentTipoFiltro = []; // Filtro de tipo de auditoria
    let currentEstadoFiltro = []; // Filtro de estado da auditoria
    let sortOrder = 'recente'; // filtro de ordenação

    // Pesquisa
    let filtroId = null; // id da auditoria
    let filtroNomeAuditoria = null; // nome da auditoria
    let filtroData = null; // data de criação
    let filtroPerito = null; // nome do perito


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
    window.location.href = '../CriarAuditorias/criarauditoria.html';
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
    const removeButton = document.querySelector('.btn-danger');
    removeButton.addEventListener('click', () => {
        const selected = document.querySelectorAll('.auditoria-checkbox:checked');
        if (selected.length === 0) {
            showCustomAlert('Selecione pelo menos uma auditoria para remover.');
            return;
        }
        // Mostrar modal de confirmação
        document.getElementById('confirmRemoveModal').classList.remove('hidden');

        // Ao clicar em "Remover"
        document.getElementById('confirmRemoveYes').onclick = function() {
            const ids = Array.from(selected).map(c => parseInt(c.getAttribute('data-id')));
            auditoriasData = auditoriasData.filter(a => !ids.includes(parseInt(a.id)));
            saveAuditoriasData();
            document.querySelector('.header-checkbox').checked = false;
            atualizarTabelaAuditorias();
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
// ================================ FILTROS ================================
// =========================================================================

// ---------------------- MENU LATERAL ----------------------
// + RECENTE / ANTIGA
function ordenarPorData(criterio) {
    if (sortOrder === criterio) return; 
    sortOrder = criterio;
    currentPage = 1;
    atualizarTabelaAuditorias();
    updatePagination();
}

// TIPO DE AUDITORIA
function filterByTipoAuditoria(tipo) {
    const i = currentTipoFiltro.indexOf(tipo);
    if (i >= 0) {
        currentTipoFiltro.splice(i, 1);
    } else {
        currentTipoFiltro.push(tipo);
    }
    currentPage = 1;
    atualizarTabelaAuditorias();
    updatePagination();
}

// ESTADO DA AUDITORIA
function filterByEstado(estado) {
    const i = currentEstadoFiltro.indexOf(estado);
    if (i >= 0) {
        currentEstadoFiltro.splice(i, 1);
    } else {
        currentEstadoFiltro.push(estado);
    }
    currentPage = 1;
    atualizarTabelaAuditorias();
    updatePagination();
}

// ---------------------- FILTRAR AUDITORIAS ----------------------
function filtrarAuditorias() {
    let filtradas = [...auditoriasData];
    // TIPO 
    if (currentTipoFiltro.length > 0) {
        filtradas = filtradas.filter(a => currentTipoFiltro.includes(a.tipoOcorrencia));
    }
    // NOME DA AUDITORIA
    if (filtroNomeAuditoria) {
        filtradas = filtradas.filter(a =>
            a.nome?.toLowerCase().includes(filtroNomeAuditoria)
        );
    }
    // ESTADO
    if (currentEstadoFiltro.length > 0) {
        filtradas  = filtradas .filter(a => currentEstadoFiltro.includes(a.estado));
    }
    // DATA
    if (filtroData) {
    filtradas  = filtradas .filter(a => a.dataCriacao === filtroData);
    }
    return filtradas;
}

// ---------------------- LIMPAR FILTROS ----------------------
function limparFiltros() {
    // Limpar inputs do topo
    document.getElementById('searchId').value = '';
    document.getElementById('searchNomeAuditoria').value = '';
    document.getElementById('searchData').value = '';
    document.getElementById('searchPerito').value = '';

    // Reset das variáveis globais
    auditoriasFiltradasPesquisa = null;
    filtroId = null;
    filtroNomeAuditoria = null;
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
    atualizarTabelaAuditorias();
    updatePagination();
}

// =========================================================================
// =========================== ATUALIZAR TABELA ============================
// =========================================================================

function atualizarTabelaAuditorias(lista = null) {
    const tbody = document.getElementById("auditoriasTableBody");
    tbody.innerHTML = "";

    let auditoriasFiltradas = (lista === null || lista === undefined) ? filtrarAuditorias() : lista;

    if (sortOrder) {
        auditoriasFiltradas.sort((a, b) => {
            const [diaA, mesA, anoA] = a.data.split('/');
            const [diaB, mesB, anoB] = b.data.split('/');
            const dataA = new Date(`${anoA}-${mesA}-${diaA}`);
            const dataB = new Date(`${anoB}-${mesB}-${diaB}`);
            return sortOrder === 'recente' ? dataB - dataA : dataA - dataB;
        });
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginaAuditorias = auditoriasFiltradas.slice(start, end);

    paginaAuditorias.forEach(auditoria => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <input type="checkbox" class="auditoria-checkbox" data-id="${auditoria.id}"> 
            </td>
            <td class="auditoria-id">${auditoria.id}</td>
            <td class="auditoria-nome">${auditoria.nome || "—"}</td>
            <td>
                <span class="${getUrgenciaBadgeClass(parseInt(auditoria.nivelUrgencia))}">${auditoria.nivelUrgencia || "—"}</span>
            </td>
            <td>${auditoria.tipoOcorrencia}</td>
            <td>${auditoria.data || "—"}</td>
            <td>
                <div>${auditoria.peritos?.[0]?.name || "—"}</div>
            </td>
            <td>
                <span class="${getEstadoBadgeClass(auditoria.estado)}">
                    ${auditoria.estado === 'Aceite' ? 'Não Iniciada' : (auditoria.estado || '—')}
                </span>
            </td>
            <td>
                <button class="btn-icon">
                    <i data-lucide="more-vertical"></i>
                </button>
            </td>
        `;
        // Botão 3 pontos
        row.querySelector('.btn-icon').addEventListener('click', () => {
            abrirDetalhesAuditoria(auditoria);
        });
        tbody.appendChild(row);
    });

    lucide.createIcons();
}

// =========================================================================
// ========================= BOTÃO MAIS DETALHES ===========================
// =========================================================================
function abrirDetalhesAuditoria(auditoria) {
    const modal = document.getElementById("detalhesModal");
    const content = document.getElementById("detalhesAuditoriaContent");

    const materiais = auditoria.materiais?.join(', ') || "—";
    const perito = auditoria.peritos?.length > 0 ? auditoria.peritos.map(p => p.name).join(', ') : "—";
    const duracao = auditoria.duracao || "—";
    const descricao = auditoria.descricao || "—";
    const tipo = auditoria.tipoOcorrencia || auditoria.tipo || "—";
    const dataCriacao = auditoria.dataCriacao ? new Date(auditoria.dataCriacao).toLocaleDateString() : "—";
    const urgencia = auditoria.nivelUrgencia || "—";
    const estado = auditoria.estado || "—";

    content.innerHTML = `
        <div class="detalhes-grid">
            <div><strong>ID:</strong> ${auditoria.id}</div>
            <div><strong>Nome:</strong> ${auditoria.nome || "—"}</div>
            <div><strong>Tipo de Auditoria:</strong> ${tipo}</div>
            <div><strong>Perito Associado:</strong> ${perito}</div>
            <div><strong>Materiais:</strong> ${materiais}</div>
            <div><strong>Morada:</strong> ${auditoria.morada || "—"}</div>
            <div><strong>Data de Criação:</strong> ${dataCriacao}</div>
            <div><strong>Duração Estimada:</strong> ${duracao}</div>
            <div><strong>Estado:</strong> ${estado}</div>
            <div><strong>Urgência:</strong> ${urgencia}</div>
            <div style="grid-column: span 2;"><strong>Descrição:</strong>
                <pre>${descricao}</pre>
            </div>
        </div>
        <button onclick="editarAuditoria(${auditoria.id})">Editar</button>
    `;

    modal.classList.remove("hidden");

    // Botão de fechar
    modal.querySelector('.close-btn').onclick = () => {
        modal.classList.add("hidden");
    };
}

function editarAuditoria(id) {
    const auditoria = auditoriasData.find(a => a.id == id);
    if (!auditoria) return;

    if (auditoria.estado === "Concluída") {
        abrirDetalhesAuditoria(auditoria); // Mostra apenas os detalhes
        return;
    }

    const content = document.getElementById("detalhesAuditoriaContent");
    const [meses, dias, horas] = extrairDuracao(auditoria.duracao);

    // ========================== HTML DO FORMULÁRIO ==========================
    content.innerHTML = `
        <form id="formEditarAuditoria" class="detalhes-grid">
            <div>
                <label><strong>Nome:</strong></label>
                <input type="text" name="nome" value="${auditoria.nome || ''}" />
            </div>
            <div>
                <label><strong>Morada:</strong></label>
                <input type="text" name="morada" value="${auditoria.morada || ''}" />
            </div>

            <div>
                <label><strong>Materiais:</strong></label>
                <div class="materiais-wrapper">
                    <input type="text" id="materialsSearchInput" class="materiais-input" readonly placeholder="Selecionar materiais">
                    <span id="materialsDropdownIcon" class="materiais-seta">▾</span>
                </div>
                <div id="selectedMaterials" class="selected-materiais-tags"></div>
                <div id="materialsList" class="materiais-lista" style="display: none;">
                    <div class="materiais-controles">
                        <button type="button" id="selecionarTodosMateriais">Selecionar todos</button>
                        <button type="button" id="removerTodosMateriais">Nenhum</button>
                    </div>
                    <div class="checkbox-grid">
                        ${[
                            "Lanterna", "Câmera fotográfica", "Fita sinalizadora e cones",
                            "Fita métrica", "Luvas de proteção", "Capacete de segurança",
                            "Caneleiras", "Bloco de notas", "Colete reflexor","Tablet"
                        ].map(mat => `
                            <label>
                                <span>${mat}</span>
                                <input type="checkbox" name="materials" value="${mat}" ${auditoria.materiais?.includes(mat) ? 'checked' : ''}>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div>
                <label><strong>Perito:</strong></label>
                <div class="materiais-wrapper" id="peritoDropdownWrapper">
                    <input type="text" id="peritoSelecionadoInput" class="materiais-input" readonly placeholder="Selecionar perito">
                    <span id="peritoDropdownIcon" class="materiais-seta">▾</span>
                </div>
                <div id="peritoDropdownList" class="materiais-lista" style="display: none;">
                    <!-- preenchido por JS -->
                </div>
            </div>

            <div>
                <label><strong>Tipo de Auditoria:</strong></label>
                <input type="text" value="${auditoria.tipoOcorrencia}" disabled style="background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 8px; padding: 8px 12px; width: 100%;" />
            </div>
            

            <div>
                <label><strong>Estado:</strong></label>
                <select name="estado">
                    <option value="Não Iniciada" ${auditoria.estado === 'Não Iniciada' ? 'selected' : ''}>Não Iniciada</option>
                    <option value="Em Progresso" ${auditoria.estado === 'Em Progresso' ? 'selected' : ''}>Em Progresso</option>
                    <option value="Concluída" ${auditoria.estado === 'Concluída' ? 'selected' : ''}>Concluída</option>
                </select>
            </div>
 
            <div>
                <label><strong>Duração Estimada:</strong></label>
                <div style="background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 8px; padding: 8px 12px; display: flex; gap: 10px; align-items: center;">
                    <input type="number" name="meses" value="${meses}" min="0" style="width: 65px;" /> <span>meses</span>
                    <input type="number" name="dias" value="${dias}" min="0" max="31" style="width: 65px;" /> <span>dias</span>
                    <input type="number" name="horas" value="${horas}" min="0" max="24" style="width: 65px;" /> <span>horas</span>
                </div>
            </div>
            <div style="flex: 1;">
                <label><strong>Urgência:</strong></label>
                <div style="display: flex; gap: 15px; margin-top: 5px;">
                    ${[1, 2, 3, 4, 5].map(n => `
                        <label style="display: flex; align-items: center; gap: 4px;">
                            <input type="radio" name="urgencia" value="${n}" ${parseInt(auditoria.nivelUrgencia) === n ? 'checked' : ''}/> ${n}
                        </label>
                    `).join('')}
                </div>
            </div>
            <div style="grid-column: span 2;">
                <label><strong>Descrição:</strong></label>
                <textarea name="descricao" style="min-height: 40px; resize: none;" oninput="this.style.height='auto'; this.style.height=this.scrollHeight + 'px';">${auditoria.descricao || ''}</textarea>
            </div>
            <div style="grid-column: span 2; display: flex; justify-content: center; gap: 20px; margin-top: 0px;">
                <button type="submit" style="padding: 10px 30px; background-color: #03045e; color: white; border: none; border-radius: 40px;">Guardar</button>
                <button type="button" id="btnCancelar" style="padding: 10px 30px; background-color: white; color: #03045e; border: 2px solid #03045e; border-radius: 40px;">Cancelar</button>
            </div>
        </form>
    `;

    // ========================== JS DO FORMULÁRIO ==========================
    const form = document.getElementById("formEditarAuditoria");
    form.style.rowGap = '30px';

    // ---------- MATERIAIS DROPDOWN ----------
const materialsSearchInput = document.getElementById('materialsSearchInput');
const materialsList = document.getElementById('materialsList');
const materialsDropdownIcon = document.getElementById('materialsDropdownIcon');
const checkboxes = document.querySelectorAll('input[name="materials"]');

// Mostrar/ocultar dropdown
function toggleMaterialsList() {
    materialsList.style.display = materialsList.style.display === 'none' ? 'block' : 'none';
}
materialsDropdownIcon.addEventListener('click', toggleMaterialsList);
materialsSearchInput.addEventListener('click', toggleMaterialsList);

// Fechar dropdown se clicar fora
window.addEventListener('click', function(event) {
    if (!event.target.closest('.materiais-wrapper') && !event.target.closest('.materiais-lista')) {
        materialsList.style.display = 'none';
    }
});

// Atualizar seleção visual
function updateSelectedMaterials() {
    const selectedContainer = document.getElementById('selectedMaterials');
    selectedContainer.innerHTML = '';
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const tag = document.createElement('span');
            tag.className = 'selected-item';
            tag.innerHTML = checkbox.value + ' <span class="remove-material" data-value="' + checkbox.value + '">×</span>';
            selectedContainer.appendChild(tag);
        }
    });

    document.querySelectorAll('.remove-material').forEach(btn => {
        btn.addEventListener('click', function () {
            const value = this.getAttribute('data-value');
            document.querySelector(`input[name="materials"][value="${value}"]`).checked = false;
            updateSelectedMaterials();
        });
    });

    updateInputText();
}

function updateInputText() {
    const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
    materialsSearchInput.value = selected.length > 0 ? `${selected.length} item(s) selecionado(s)` : '';
}

// Ligar eventos aos checkboxes
checkboxes.forEach(cb => cb.addEventListener('change', updateSelectedMaterials));

// Botões Selecionar Todos / Nenhum
document.getElementById('selecionarTodosMateriais').addEventListener('click', function () {
    checkboxes.forEach(cb => cb.checked = true);
    updateSelectedMaterials();
});
document.getElementById('removerTodosMateriais').addEventListener('click', function () {
    checkboxes.forEach(cb => cb.checked = false);
    updateSelectedMaterials();
});

// Inicial
updateSelectedMaterials();

    // ------ PERITOS -------
    const peritoSelecionadoInput = document.getElementById('peritoSelecionadoInput');
    const peritoDropdownIcon = document.getElementById('peritoDropdownIcon');
    const peritoDropdownList = document.getElementById('peritoDropdownList');

    let peritoSelecionado = auditoria.peritos?.[0] || null;

    // Mostrar lista ao clicar
    function togglePeritoDropdown() {
        peritoDropdownList.style.display = peritoDropdownList.style.display === 'none' ? 'block' : 'none';
    }
    peritoSelecionadoInput.addEventListener('click', togglePeritoDropdown);
    peritoDropdownIcon.addEventListener('click', togglePeritoDropdown);

    // Fechar dropdown se clicar fora
    window.addEventListener('click', function(event) {
        if (!event.target.closest('#peritoDropdownWrapper') && !event.target.closest('#peritoDropdownList')) {
            peritoDropdownList.style.display = 'none';
        }
    });

    // Carregar peritos filtrados
    function carregarPeritosDisponiveis() {
        const tipo = auditoria.tipoOcorrencia;
        const experts = JSON.parse(localStorage.getItem('expertsData')) || [];
        const disponiveis = experts.filter(p => p.status === "Disponível" && p.specialty === tipo);

        peritoDropdownList.innerHTML = `
            <div class="dropdown-item-perito" data-id="" data-nome="—" style="padding: 8px 12px; cursor: pointer;">
                <span style="margin-left: 40px;">—</span>
            </div>
        ` + disponiveis.map(p => `
            <div class="dropdown-item-perito" 
                data-id="${p.id}" 
                data-nome="${p.name}" 
                data-email="${p.email}" 
                data-foto="${p.profilePhoto || 'default-user.png'}" 
                data-specialty="${p.specialty}"
                style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; cursor: pointer;">
                <img src="${p.profilePhoto || 'default-user.png'}" alt="${p.name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                <span>${p.name}</span>
            </div>
        `).join('');

        // Adicionar eventos a cada item
        document.querySelectorAll('.dropdown-item-perito').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // <- impede quebra de submissão
                e.stopPropagation(); // <- impede conflitos de clique com form
                peritoSelecionado = {
                    id: item.dataset.id,
                    name: item.dataset.nome,
                    email: item.dataset.email,
                    photo: item.dataset.foto,
                    specialty: item.dataset.specialty
                };
                peritoSelecionadoInput.value = peritoSelecionado.name;
                peritoDropdownList.style.display = 'none';
            });
        });

        // Se já tiver perito, mostrar no input
        if (peritoSelecionado) {
            peritoSelecionadoInput.value = peritoSelecionado.name;
        }
    }
    // Inicializar dropdown
    carregarPeritosDisponiveis();


    // ---------- CANCELAR ----------
    document.getElementById('btnCancelar').addEventListener('click', (e) => {
        e.preventDefault();
        abrirDetalhesAuditoria(auditoria);
    });

    // ---------- GUARDAR ----------
    form.onsubmit = function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        auditoria.nome = formData.get("nome");
        auditoria.morada = formData.get("morada");
        auditoria.materiais = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
        // Estado anterior do perito (antes de editar)
        const peritoAnterior = auditoria.peritos?.[0];
        const peritoAtual = peritoSelecionado?.id ? peritoSelecionado : null;

        // Associar perito à auditoria
        auditoria.peritos = peritoAtual ? [peritoAtual] : [];

        // Guardar o estado anterior
        const estadoAnterior = auditoria.estado;

        // Estado selecionado pelo utilizador
        const estadoSelecionado = formData.get("estado");

        if (estadoSelecionado === "Não Iniciada" && peritoAtual) {
            auditoria.estado = "Em Progresso";
        } else {
            auditoria.estado = estadoSelecionado;
        }

        // Se mudou para "Concluída" agora → guardar data de conclusão
        if (estadoAnterior !== "Concluída" && auditoria.estado === "Concluída") {
            const hoje = new Date();
            auditoria.dataConclusao = hoje.toISOString().split("T")[0]; // Ex: "2025-05-30"
        }

        // Se mudou de "Concluída" para outro estado → apagar data de conclusão
        if (estadoAnterior === "Concluída" && auditoria.estado !== "Concluída") {
            auditoria.dataConclusao = null;
        }

        // Atualizar estado dos peritos
        const experts = JSON.parse(localStorage.getItem('expertsData')) || [];

        // Se o perito anterior foi removido ou substituído → marcar como Disponível
        if (peritoAnterior?.id && (!peritoAtual || peritoAnterior.id !== peritoAtual.id)) {
            const idxAntigo = experts.findIndex(p => p.id == peritoAnterior.id);
            if (idxAntigo !== -1) experts[idxAntigo].status = "Disponível";
        }

        // Se foi atribuído novo perito e a auditoria não está concluída → marcar como Em Auditoria
        if (peritoAtual?.id) {
            const idxNovo = experts.findIndex(p => p.id == peritoAtual.id);
            if (idxNovo !== -1) {
                experts[idxNovo].status = (auditoria.estado === "Concluída") ? "Disponível" : "Em Auditoria";
            }
        }

        localStorage.setItem('expertsData', JSON.stringify(experts));


        auditoria.nivelUrgencia = formData.get("urgencia");
        auditoria.descricao = formData.get("descricao");

        const meses = parseInt(formData.get("meses")) || 0;
        const dias = parseInt(formData.get("dias")) || 0;
        const horas = parseInt(formData.get("horas")) || 0;
        auditoria.duracao = formatarDuracao(meses, dias, horas);

        saveAuditoriasData();
        atualizarTabelaAuditorias();
        updatePagination();
        abrirDetalhesAuditoria(auditoria);
    };
}


// Função auxiliar para converter "31 dias, 2 horas" → [0, 31, 2]
function extrairDuracao(str) {
    if (!str) return [0, 0, 0];
    const m = /(\d+)\s+mes/.exec(str); const d = /(\d+)\s+dia/.exec(str); const h = /(\d+)\s+hora/.exec(str);
    return [m ? +m[1] : 0, d ? +d[1] : 0, h ? +h[1] : 0];
}

function formatarDuracao(meses, dias, horas) {
    const partes = [];
    if (meses > 0) partes.push(`${meses} ${meses === 1 ? 'mês' : 'meses'}`);
    if (dias > 0) partes.push(`${dias} ${dias === 1 ? 'dia' : 'dias'}`);
    if (horas > 0) partes.push(`${horas} ${horas === 1 ? 'hora' : 'horas'}`);
    return partes.length > 0 ? partes.join(', ') : '0 horas';
}


// ---------------------- ESTILO ESTADO ----------------------
function getEstadoBadgeClass(estado) {
    switch (estado) {
        case 'Concluída':
            return 'status-badge status-available';
        case 'Não Iniciada':
            return 'status-badge status-unavailable';
        case 'Em Progresso':
            return 'status-badge status-audit';
        default:
            return 'status-badge';
    }
}

// ---------------------- ESTILO URGÊNCIA ----------------------
function getUrgenciaBadgeClass(nivel) {
    switch (nivel) {
        case 5:
            return 'status-badge urgencia-5';
        case 4:
            return 'status-badge urgencia-4';
        case 3:
            return 'status-badge urgencia-3';
        case 2:
            return 'status-badge urgencia-2';
        case 1:
            return 'status-badge urgencia-1';
        default:
            return 'status-badge';
    }
}

// =========================================================================
// =============================== PAGINAÇÃO ===============================
// =========================================================================

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

    // Atualizar itemsPerPage com base no dropdown
    const itemsPerPageSelect = document.getElementById("itemsPerPageSelect");
    if (itemsPerPageSelect) {
        itemsPerPageSelect.value = itemsPerPage;

        itemsPerPageSelect.addEventListener("change", () => {
            itemsPerPage = parseInt(itemsPerPageSelect.value);
            currentPage = 1;
            atualizarTabelaAuditorias();
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
            filterByTipoAuditoria(tipo); // <-- CORRETO
            btn.classList.toggle('active');
        });
    });
    // Estado da auditoria
    document.querySelectorAll('[data-estado]').forEach(btn => {
        btn.addEventListener('click', () => {
            const estado = btn.getAttribute('data-estado');
            
            // Remove 'active' de todos os botões de estado
            document.querySelectorAll('[data-estado]').forEach(b => b.classList.remove('active'));
            // Adiciona 'active' só ao botão clicado
            btn.classList.add('active');
            
            // Atualiza o filtro para apenas este estado
            currentEstadoFiltro = [estado];
            currentPage = 1;
            atualizarTabelaAuditorias();
            updatePagination();
        });
    });
    // -------------------- FILTROS DE PESQUISA --------------------
    document.getElementById('searchButton').addEventListener('click', () => {
        // ID auditoria
        const id = document.getElementById('searchId').value.trim();
        // Nome da auditoria
        const filtroNomeAuditoria = document.getElementById('searchNomeAuditoria').value.trim().toLowerCase();
        // Data
        const data = document.getElementById('searchData').value;
        // Nome Perito
        const perito = document.getElementById('searchPerito').value.trim().toLowerCase();
        

        let filtradas = [...auditoriasData];

        if (id) filtradas = filtradas.filter(a => a.id.toString() === id);
        if (filtroNomeAuditoria) {
            filtradas = filtradas.filter(a =>
                a.nome?.toLowerCase().includes(filtroNomeAuditoria)
            );
        }
        if (data) filtradas = filtradas.filter(a => new Date(a.data) >= new Date(data));
        if (perito) filtradas = filtradas.filter(a => a.perito?.toLowerCase().includes(perito));
        
        if (
            id || filtroNomeAuditoria || data || perito
        ) {
            auditoriasFiltradasPesquisa = filtradas;
            atualizarTabelaAuditorias(auditoriasFiltradasPesquisa);
            updatePagination(auditoriasFiltradasPesquisa);
        } else {
            auditoriasFiltradasPesquisa = null;
            atualizarTabelaAuditorias();
            updatePagination();
        }
        currentPage = 1;

    });

    // Ativar pesquisa ao carregar Enter nos inputs
    ['searchId', 'searchNomeAuditoria', 'searchData', 'searchPerito'].forEach(id => {
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

// Mostrar modal customizado
function showCustomAlert(message) {
    const modal = document.getElementById('customAlertModal');
    const msg = document.getElementById('customAlertMessage');
    msg.textContent = message;
    modal.style.display = 'flex';
    document.getElementById('customAlertOk').onclick = () => {
        modal.style.display = 'none';
    };
}

