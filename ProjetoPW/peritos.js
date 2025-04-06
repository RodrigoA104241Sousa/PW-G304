// Replace or update the expertsData initialization
let expertsData = JSON.parse(localStorage.getItem('expertsData')) || [
    {
        id: 1,
        name: "João Silva",
        email: "joao.silva@email.com",
        startDate: "01/01/2023",
        specialty: "Buraco na Estrada",
        status: "Disponível"
    }
    // ...other default experts if needed
];

// Function to save experts data to localStorage
function saveExpertsData() {
    localStorage.setItem('expertsData', JSON.stringify(expertsData));
}

function getStatusClass(status) {
    switch (status) {
        case "Disponível":
            return "status-available";
        case "Não Disponível":
            return "status-unavailable";
        case "Em Auditoria":
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

// Function to update pagination
function updatePagination() {
    const experts = JSON.parse(localStorage.getItem('expertsData')) || [];
    const totalExperts = experts.length;
    const totalPages = Math.ceil(totalExperts / itemsPerPage);
    
    // Update info text
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalExperts);
    document.querySelector('.pagination-info').textContent = 
        `Mostrando ${start} - ${end} de ${totalExperts} peritos registrados`;

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

// Modifique a função populateTable existente
function populateTable() {
    const tbody = document.getElementById("expertsTableBody");
    let experts = JSON.parse(localStorage.getItem('expertsData')) || [];
    
    // Aplica os filtros
    if (currentFilter) {
        experts = experts.filter(expert => expert.status === currentFilter);
    }
    if (currentSpecialtyFilter) {
        experts = experts.filter(expert => expert.specialty === currentSpecialtyFilter);
    }
    
    // Aplica o filtro de busca
    if (searchTerm) {
        experts = experts.filter(expert => 
            expert.name.toLowerCase().includes(searchTerm) ||
            expert.email.toLowerCase().includes(searchTerm)
        );
    }
    
    // Aplica o filtro de data
    if (dateFilter) {
        experts = experts.filter(expert => {
            const expertDate = new Date(expert.startDate);
            const filterDate = new Date(dateFilter);
            return expertDate >= filterDate;
        });
    }
    
    // Calculate slice indexes for current page
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageExperts = experts.slice(start, end);
    
    tbody.innerHTML = "";
    
    pageExperts.forEach(expert => {
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
            <td><span class="status-badge ${getStatusClass(expert.status)}">${expert.status}</span></td>
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

// Add header checkbox functionality
function setupHeaderCheckbox() {
    const headerCheckbox = document.querySelector('.header-checkbox');
    headerCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.expert-checkbox');
        checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
    });
}

// Update setupRemoveButton function
function setupRemoveButton() {
    const removeButton = document.querySelector('.btn-danger');
    removeButton.addEventListener('click', () => {
        const selectedCheckboxes = document.querySelectorAll('.expert-checkbox:checked');
        
        if (selectedCheckboxes.length === 0) {
            alert('Selecione pelo menos um perito para remover');
            return;
        }

        if (confirm('Tem certeza que deseja remover os peritos selecionados?')) {
            const selectedIds = Array.from(selectedCheckboxes).map(checkbox => 
                parseInt(checkbox.getAttribute('data-id'))
            );

            // Remove selected experts from the data
            expertsData = expertsData.filter(expert => !selectedIds.includes(expert.id));
            
            // Save updated data to localStorage
            saveExpertsData();
            
            // Clear header checkbox
            document.querySelector('.header-checkbox').checked = false;
            
            // Refresh the table
            populateTable();
        }
    });
}

// Add this to your existing JavaScript
document.getElementById('addExpertBtn').addEventListener('click', () => {
    window.location.href = 'registaperito.html';
});

// Add event listener for items per page select
document.querySelector('.pagination-controls select').addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1; // Reset to first page
    updatePagination();
    populateTable();
});

// Initialize everything when page loads
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    populateTable();
    setupHeaderCheckbox();
    setupRemoveButton();
    updatePagination();

    // Add click handlers for status filters
    document.querySelectorAll('.submenu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const status = e.target.closest('.submenu-item').querySelector('span:last-child').textContent;
            filterByStatus(status);
            
            // Update active state
            document.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Add click handlers for status filter buttons
    document.querySelectorAll('.submenu-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const status = button.getAttribute('data-status');
            filterByStatus(status);
            
            // Update active state
            document.querySelectorAll('.submenu-item').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Adicione os event listeners para os itens de especialidade
    document.querySelectorAll('.submenu-item').forEach(item => {
        const specialtyText = item.textContent.trim();
        if (['Buraco na Estrada', 'Passeio Danificado', 'Falta de Sinalização', 'Iluminação Pública'].includes(specialtyText)) {
            item.addEventListener('click', (e) => {
                filterBySpecialty(specialtyText);
                
                // Atualiza o estado ativo
                document.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        }
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
});