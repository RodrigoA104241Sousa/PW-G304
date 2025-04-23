// Initialize occurrences data with a complete example
const defaultOccurrences = [
    {
        id: 1,
        userName: "João Silva",
        userEmail: "joao.silva@email.com",
        date: "2024-04-17",
        type: "Buraco na Estrada",
        status: "Em Espera",
        description: "Buraco grande na Rua Principal",
        location: "Rua da Universidade, Braga",
        images: ["icon.png", "buraco2.jpg"],
        priority: "Alta",
        reportTime: "14:30",
        coordinates: {
            latitude: 41.5518,
            longitude: -8.4229
        },
        contactPhone: "912345678",
        lastUpdate: "2024-04-17T14:30:00",
        comments: [
            {
                user: "admin",
                text: "Ocorrência registrada com sucesso",
                date: "2024-04-17T14:35:00"
            }
        ]
    },
    {
        id: 2,
        userName: "Carlos Mendes",
        userEmail: "carlos.mendes@email.com",
        date: "2024-04-17",
        type: "Passeio Danificado",
        status: "Aceite",
        description: "Buraco grande na Rua Principal",
        location: "Rua da Universidade, Braga",
        images: ["buraco1.jpg", "buraco2.jpg"],
        priority: "Alta",
        reportTime: "14:30",
        coordinates: {
            latitude: 41.5518,
            longitude: -8.4229
        },
        contactPhone: "912345678",
        lastUpdate: "2024-04-17T14:30:00",
        comments: [
            {
                user: "admin",
                text: "Ocorrência registrada com sucesso",
                date: "2024-04-17T14:35:00"
            }
        ]
    },
    {
        id: 3,
        userName: "Francisco Machado",
        userEmail: "francisco.ccc@email.com",
        date: "2024-04-17",
        type: "Falta de Sinalização",
        status: "Não Aceite",
        description: "Buraco grande na Rua Principal",
        location: "Rua da Universidade, Braga",
        images: ["buraco1.jpg", "buraco2.jpg"],
        priority: "Alta",
        reportTime: "14:30",
        coordinates: {
            latitude: 41.5518,
            longitude: -8.4229
        },
        contactPhone: "912345678",
        lastUpdate: "2024-04-17T14:30:00",
        comments: [
            {
                user: "admin",
                text: "Ocorrência registrada com sucesso",
                date: "2024-04-17T14:35:00"
            }
        ]
    },
    {
        id: 4,
        userName: "Rui Freitas",
        userEmail: "ruifreitas@email.com",
        date: "2024-04-17",
        type: "Iluminação Pública",
        status: "Aceite",
        description: "Buraco grande na Rua Principal",
        location: "Rua da Universidade, Braga",
        images: ["buraco1.jpg", "buraco2.jpg"],
        priority: "Alta",
        reportTime: "14:30",
        coordinates: {
            latitude: 41.5518,
            longitude: -8.4229
        },
        contactPhone: "912345678",
        lastUpdate: "2024-04-17T14:30:00",
        comments: [
            {
                user: "admin",
                text: "Ocorrência registrada com sucesso",
                date: "2024-04-17T14:35:00"
            }
        ]
    }
];

// Check if data exists in localStorage, if not, use default data
if (!localStorage.getItem('occurrencesData')) {
    localStorage.setItem('occurrencesData', JSON.stringify(defaultOccurrences));
}

// Initialize occurrences data with localStorage or default
let occurrencesData = JSON.parse(localStorage.getItem('occurrencesData')) || defaultOccurrences;

// Function to save occurrences data to localStorage
function saveOccurrencesData() {
    localStorage.setItem('occurrencesData', JSON.stringify(occurrencesData));
}

function getStatusClass(status) {
    switch (status) {
        case "Aceite":
            return "status-available";
        case "Não Aceite":
            return "status-unavailable";
        case "Em Espera":
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

// Function to update pagination
function updatePagination() {
    const occurrences = JSON.parse(localStorage.getItem('occurrencesData')) || [];
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
    
    // Get fresh data from localStorage
    let occurrences = JSON.parse(localStorage.getItem('occurrencesData')) || [];
    console.log('Number of occurrences:', occurrences.length);
    
    tbody.innerHTML = ""; // Clear the table
    
    // Apply filters if they exist
    if (currentFilter) {
        occurrences = occurrences.filter(occ => occ.status === currentFilter);
    }
    if (currentSpecialtyFilter) {
        occurrences = occurrences.filter(occ => occ.type === currentSpecialtyFilter);
    }
    
    // Aplica o filtro de busca
    if (searchTerm) {
        occurrences = occurrences.filter(occ => 
            occ.userName.toLowerCase().includes(searchTerm) ||
            occ.userEmail.toLowerCase().includes(searchTerm)
        );
    }
    
    // Aplica o filtro de data
    if (dateFilter) {
        occurrences = occurrences.filter(occ => {
            const occDate = new Date(occ.date);
            const filterDate = new Date(dateFilter);
            return occDate >= filterDate;
        });
    }
    
    // Apply type filter
    if (currentTypeFilter) {
        occurrences = occurrences.filter(occ => occ.type === currentTypeFilter);
    }
    
    // Calculate slice indexes for current page
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageOccurrences = occurrences.slice(start, end);
    
    // Create table rows
    pageOccurrences.forEach(occ => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" class="occurrence-checkbox" data-id="${occ.id}"></td>
            <td>
                <div class="user-info">
                    <div class="user-name">${occ.userName}</div>
                    <div class="user-email">${occ.userEmail}</div>
                </div>
            </td>
            <td>${new Date(occ.date).toLocaleDateString('pt-PT')}</td>
            <td>${occ.type}</td>
            <td><span class="status-badge ${getStatusClass(occ.status)}">${occ.status}</span></td>
            <td>
                <button class="btn-icon details-btn" data-id="${occ.id}">
                    <i data-lucide="more-vertical"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
        
        // Add click handler for the details button
        const detailsBtn = row.querySelector('.details-btn');
        detailsBtn.addEventListener('click', () => {
            // Store the selected occurrence ID in localStorage
            localStorage.setItem('selectedOccurrenceId', occ.id);
            // Navigate to details page
            window.location.href = 'detalhesocorrencia.html';
        });
    });

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

// Add this function to save new occurrences
function saveOccurrence(newOccurrence) {
    occurrencesData.push({
        id: occurrencesData.length + 1,
        ...newOccurrence
    });
    localStorage.setItem('occurrencesData', JSON.stringify(occurrencesData));
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
    if (!localStorage.getItem('occurrencesData')) {
        console.log('Initializing localStorage with default data');
        localStorage.setItem('occurrencesData', JSON.stringify(defaultOccurrences));
    }
    
    // Log the current state
    console.log('Current localStorage data:', localStorage.getItem('occurrencesData'));

    // Initialize the page
    lucide.createIcons();
    populateTable();
    setupHeaderCheckbox();
    updatePagination();
});

// Remove duplicate event listeners and use this simplified version
document.addEventListener("DOMContentLoaded", () => {
    // Initialize localStorage if empty
    if (!localStorage.getItem('occurrencesData')) {
        console.log('Initializing localStorage with default data');
        localStorage.setItem('occurrencesData', JSON.stringify(defaultOccurrences));
    }
    
    // Log the current state
    console.log('Current localStorage data:', localStorage.getItem('occurrencesData'));

    // Initialize the page
    lucide.createIcons();
    populateTable();
    setupHeaderCheckbox();
    updatePagination();

    // Add click handlers for status filters
    document.querySelectorAll('.submenu-item[data-status]').forEach(item => {
        item.addEventListener('click', () => {
            const status = item.getAttribute('data-status');
            
            // Update active state
            document.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Apply filter
            filterByStatus(status);
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
});