// Initialize occurrences data with a complete example


// Initialize occurrences data with localStorage or default
let occurrencesData = JSON.parse(localStorage.getItem('ocorrencias')) || defaultOccurrences;

function getStatusClass(estado) {
    switch (estado) {
        case "Aceite":
            return "status-available";
        case "Não Aceite":
            return "status-unavailable";
        case "Em espera":
            return "status-audit";
        default:
            return "";
    }
}

// Add pagination state
let currentPage = 1;
let itemsPerPage = 16;

// Adicione esta variável no topo do arquivo junto com as outras variáveis globais
let currentSpecialtyFilter = null;

// Adicione estas variáveis globais
let searchTerm = '';

// Adicione estas variáveis globais
let dateFilter = null;

// Add at the top with other state variables
let currentTypeFilter = null;

// Add this variable at the top of the file
let currentSort = 'recente'; // 'recente' ou 'antiga'

// Function to update pagination
function updatePagination() {
    const occurrences = JSON.parse(localStorage.getItem('ocorrencias')) || [];
    const totalOccurrences = occurrences.length;
    const totalPages = Math.ceil(totalOccurrences / itemsPerPage);
    
    // Update info text
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalOccurrences);
    document.querySelector('.pagination-info').textContent = 
        `Mostrando ${start} - ${end} de ${totalOccurrences} ocorrências registradas`;

    // Update pagination buttons
    const paginationButtons = document.querySelector('.pagination-buttons');
    paginationButtons.innerHTML = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">&lt;</button>
        ${getPaginationButtons(currentPage, totalPages)}
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">&gt;</button>
    `;

    // Update items per page select
    const select = document.querySelector('.pagination-controls select');
    select.value = itemsPerPage;
}

// Function to generate pagination buttons
function getPaginationButtons(current, total) {
    let buttons = '';
    for (let i = 1; i <= total; i++) {
        if (i === current) {
            buttons += `<button class="active">${i}</button>`;
        } else {
            buttons += `<button onclick="changePage(${i})">${i}</button>`;
        }
    }
    return buttons;
}

// Function to change page
function changePage(page) {
    currentPage = page;
    updatePagination();
    populateTable();
}

let currentFilter = null;

function filterByStatus(status) {
    currentFilter = status;
    currentPage = 1; // Reset to first page when filtering
    populateTable();
    updatePagination();
}

// Adicione esta função nova
function filterBySpecialty(specialty) {
    currentSpecialtyFilter = specialty;
    currentPage = 1; // Reset para a primeira página ao filtrar
    populateTable();
    updatePagination();
}

// Adicione esta nova função
function searchExperts() {
    const searchInput = document.getElementById('searchInput');
    searchTerm = searchInput.value.toLowerCase().trim();
    currentPage = 1; // Reset para primeira página
    populateTable();
    updatePagination();
}

// Adicione esta nova função
function filterByDate(date) {
    dateFilter = date;
    currentPage = 1; // Reset para primeira página
    populateTable();
    updatePagination();
}

// Update the filter function
function filterByType(type) {
    currentTypeFilter = type;
    currentPage = 1;
    populateTable();
    updatePagination();
}

// Modifique a função populateTable existente
function populateTable() {
    const tbody = document.getElementById("occurrencesTableBody");
    if (!tbody) {
        console.error("Table body not found!");
        return;
    }

    let occurrences = JSON.parse(localStorage.getItem('ocorrencias')) || [];

    // Aplicar filtro por estado
    if (currentFilter) {
        occurrences = occurrences.filter(occ => occ.estado === currentFilter);
    }
    
    if (currentSpecialtyFilter) {
        occurrences = occurrences.filter(occ => occ.tipo === currentSpecialtyFilter);
    }

    // ORDENAR POR DATA
    occurrences.sort((a, b) => {
        const dateA = parsePtDate(a.data);
        const dateB = parsePtDate(b.data);
        if (currentSort === 'recente') {
            return dateB - dateA; // Mais recente primeiro
        } else {
            return dateA - dateB; // Mais antigo primeiro
        }
    });

    tbody.innerHTML = ""; // Limpar a tabela antes de preencher

    // Preencher a tabela com os dados filtrados
    occurrences.forEach(occ => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" class="occurrence-checkbox" data-id="${occ.id}"></td>
            <td>
                <div class="user-info">
                    <div class="user-email">${occ.email || 'N/A'}</div>
                </div>
            </td>
            <td>${(occ.data)}</td>
            <td>${occ.tipo || 'N/A'}</td>
            <td><span class="status-badge ${getStatusClass(occ.estado)}">${occ.estado}</span></td>
            <td>
                <button class="btn-icon details-btn" data-id="${occ.id}">
                    <i data-lucide="more-vertical"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);

        // Adicionar evento ao botão de detalhes
        const detailsBtn = row.querySelector('.details-btn');
        detailsBtn.addEventListener('click', () => {
            localStorage.setItem('selectedOccurrenceId', occ.id);
            window.location.href = '../Ocorrência/DetalhesOcorrência/detalhesocorrencia.html';
        });
    });

    // Atualizar ícones
    lucide.createIcons();
}

// Add header checkbox functionality
function setupHeaderCheckbox() {
    const headerCheckbox = document.querySelector('.header-checkbox');
    headerCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.occurrence-checkbox');
        checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
    });
}

// Filtro por Especialidade
document.querySelectorAll('.submenu-item[data-tipo]').forEach(item => {
  item.addEventListener('click', () => {
    // define o filtro
    currentSpecialtyFilter = item.getAttribute('data-tipo');
    currentPage = 1;

    // atualiza estado visual de ativo
    document.querySelectorAll('.submenu-item').forEach(i => 
      i.classList.remove('active')
    );
    item.classList.add('active');

    // reaplica filtros e paginação
    populateTable();
    updatePagination();
  });
});


// Add this function to save new occurrences
function saveOccurrence(newOccurrence) {
    occurrencesData.push({
        id: occurrencesData.length + 1,
        ...newOccurrence
    });
    localStorage.setItem('ocorrencias', JSON.stringify(occurrencesData));
    populateTable();
    updatePagination();
}

// Add event listener for items per page select
document.querySelector('.pagination-controls select').addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1; // Reset to first page
    updatePagination();
    populateTable();
});

// First, simplify the initialization
document.addEventListener("DOMContentLoaded", () => {
    // Initialize localStorage if empty
    if (!localStorage.getItem('ocorrencias')) {
        console.log('Initializing localStorage with default data');
        localStorage.setItem('ocorrencias', JSON.stringify(defaultOccurrences));
    }
    
    // Log the current state
    console.log('Current localStorage data:', localStorage.getItem('ocorrencias'));

    // Initialize the page
    lucide.createIcons();
    populateTable();
    setupHeaderCheckbox();
    updatePagination();
});

// Função para preencher os campos do formulário com base no ID da ocorrência
function preencherFormularioComOcorrencia(id) {
    // Obter as ocorrências do localStorage
    const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];

    // Encontrar a ocorrência com o ID correspondente
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

// Exemplo de uso: preencher o formulário com a ocorrência de ID armazenado no localStorage
document.addEventListener('DOMContentLoaded', () => {
    const selectedOccurrenceId = parseInt(localStorage.getItem('selectedOccurrenceId'), 10);
    if (selectedOccurrenceId) {
        preencherFormularioComOcorrencia(selectedOccurrenceId);
    }
});

// Remove duplicate event listeners and use this simplified version
document.addEventListener("DOMContentLoaded", () => {
    // Initialize localStorage if empty
    if (!localStorage.getItem('ocorrencias')) {
        console.log('Initializing localStorage with default data');
        localStorage.setItem('ocorrencias', JSON.stringify(defaultOccurrences));
    }
    
    // Log the current state
    console.log('Current localStorage data:', localStorage.getItem('ocorrencias'));

    // Initialize the page
    lucide.createIcons();
    populateTable();
    setupHeaderCheckbox();
    updatePagination();

    // Add click handlers for status filters
document.querySelectorAll('.submenu-item[data-estado]').forEach(item => {
    item.addEventListener('click', () => {
        const estado = item.getAttribute('data-estado');
        
        // Atualiza o estado ativo
        document.querySelectorAll('.submenu-item[data-estado]').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Aplica o filtro
        filterByStatus(estado);
    });
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

    // Adiciona evento de click no botão de busca
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', searchExperts);

    // Adiciona evento de pressionar Enter no campo de busca
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchExperts();
        }
    });

    // Adiciona evento de mudança no input de data
    const dateInput = document.getElementById('dateInput');
    dateInput.addEventListener('change', (e) => {
        filterByDate(e.target.value);
    });

    // Add click handlers for type filters
    document.querySelectorAll('.submenu-item[data-type]').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            
            // Update active state
            document.querySelectorAll('.submenu-item[data-type]').forEach(i => 
                i.classList.remove('active')
            );
            item.classList.add('active');
            
            // Apply filter
            filterByType(type);
        });
    });

    document.querySelectorAll('.submenu-item[data-sort]').forEach(btn => {
        btn.addEventListener('click', () => {
            currentSort = btn.getAttribute('data-sort');
            // Atualiza visualmente o botão ativo
            document.querySelectorAll('.submenu-item[data-sort]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Atualiza a tabela
            populateTable();
        });
    });
});

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

