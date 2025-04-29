// Initialize users data from localStorage or use default data
let usersData = JSON.parse(localStorage.getItem('usersData')) || [
    // Example user data
    {
        id: 1,
        name: "João Silva",
        email: "joao.silva@email.com",
        startDate: "01/01/2023",
        type: "Normal",
        occurrences: 3
    }
    // Additional default users can be added here
];

// Function to save users data to localStorage
function saveUsersData() {
    localStorage.setItem('usersData', JSON.stringify(usersData));
}

// Function to get class for occurrence counts
function getOccurrencesClass(count) {
    if (count <= 2) {
        return "occurrences-low";
    } else if (count <= 5) {
        return "occurrences-medium";
    } else {
        return "occurrences-high";
    }
}

// Add pagination state
let currentPage = 1;
let itemsPerPage = 16;

// Add filter variables
let currentTypeFilter = null;
let currentOccurrenceRangeFilter = null;
let searchTerm = '';
let dateFilter = null;

// Function to update pagination
function updatePagination() {
    const users = JSON.parse(localStorage.getItem('usersData')) || [];
    const totalUsers = users.length;
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    
    // Update info text
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalUsers);
    document.querySelector('.pagination-info').textContent = 
        `Mostrando ${start} - ${end} de ${totalUsers} utilizadores registados`;

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
    const maxButtons = 5; // Show 5 buttons max
    
    if (total <= maxButtons) {
        // Show all buttons if total pages is less than maxButtons
        for (let i = 1; i <= total; i++) {
            if (i === current) {
                buttons += `<button class="active">${i}</button>`;
            } else {
                buttons += `<button onclick="changePage(${i})">${i}</button>`;
            }
        }
    } else {
        // Show limited buttons with current page in middle if possible
        let startPage = Math.max(1, current - Math.floor(maxButtons / 2));
        let endPage = Math.min(total, startPage + maxButtons - 1);
        
        // Adjust start page if we're near the end
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            if (i === current) {
                buttons += `<button class="active">${i}</button>`;
            } else {
                buttons += `<button onclick="changePage(${i})">${i}</button>`;
            }
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

// Function to filter by user type
function filterByUserType(type) {
    currentTypeFilter = type;
    currentPage = 1; // Reset to first page when filtering
    populateTable();
    updatePagination();
}

// Function to filter by occurrence range
function filterByOccurrenceRange(range) {
    currentOccurrenceRangeFilter = range;
    currentPage = 1; // Reset to first page when filtering
    populateTable();
    updatePagination();
}

// Function to search users
function searchUsers() {
    const searchInput = document.getElementById('searchInput');
    searchTerm = searchInput.value.toLowerCase().trim();
    currentPage = 1; // Reset para primeira página
    populateTable();
    updatePagination();
}

// Function to filter by date
function filterByDate(date) {
    dateFilter = date;
    currentPage = 1; // Reset para primeira página
    populateTable();
    updatePagination();
}

// Function to populate the users table
function populateTable() {
    const tbody = document.getElementById("expertsTableBody");
    let users = JSON.parse(localStorage.getItem('usersData')) || [];
    
    // Apply user type filter
    if (currentTypeFilter) {
        users = users.filter(user => user.type === currentTypeFilter);
    }
    
    // Apply occurrence range filter
    if (currentOccurrenceRangeFilter) {
        const [min, max] = currentOccurrenceRangeFilter === "+5" 
            ? [5, Infinity] 
            : currentOccurrenceRangeFilter.split('-').map(Number);
        
        users = users.filter(user => 
            user.occurrences >= min && 
            (max === Infinity || user.occurrences <= max)
        );
    }
    
    // Apply search filter
    if (searchTerm) {
        users = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply date filter
    if (dateFilter) {
        users = users.filter(user => {
            const userDate = new Date(user.startDate.split('/').reverse().join('-'));
            const filterDate = new Date(dateFilter);
            return userDate >= filterDate;
        });
    }
    
    // Calculate slice indexes for current page
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageUsers = users.slice(start, end);
    
    tbody.innerHTML = "";
    
    pageUsers.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <div class="expert-info">
                    <div class="expert-name">${user.name}</div>
                    <div class="expert-email">${user.email}</div>
                </div>
            </td>
            <td>${user.startDate}</td>
            <td><span class="status-badge ${user.type === "Normal" ? "status-available" : user.type === "Verificado" ? "status-audit" : "status-unavailable"}">${user.type}</span></td>
            <td><span class="status-badge ${getOccurrencesClass(user.occurrences)}">${user.occurrences}</span></td>
            <td>
                <button class="btn-icon">
                    <i data-lucide="more-vertical"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Refresh Lucide icons
    lucide.createIcons();
}

// Setup header checkbox functionality
function setupHeaderCheckbox() {
    const headerCheckbox = document.querySelector('.header-checkbox');
    if (headerCheckbox) {
        headerCheckbox.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.user-checkbox');
            checkboxes.forEach(checkbox => checkbox.checked = e.target.checked);
        });
    }
}

// Setup event listeners for user type filters
function setupUserTypeFilters() {
    const typeSubmenuItems = document.querySelectorAll('.submenu:nth-of-type(1) .submenu-item');
    typeSubmenuItems.forEach(item => {
        item.addEventListener('click', () => {
            const type = item.textContent.trim();
            
            // Clear active status from all type items
            typeSubmenuItems.forEach(i => i.classList.remove('active'));
            
            // Set active status on clicked item
            item.classList.add('active');
            
            filterByUserType(type);
        });
    });
}

// Setup event listeners for occurrence range filters
function setupOccurrenceRangeFilters() {
    const rangeSubmenuItems = document.querySelectorAll('.submenu:nth-of-type(2) .submenu-item');
    rangeSubmenuItems.forEach(item => {
        item.addEventListener('click', () => {
            const range = item.getAttribute('data-status');
            
            // Clear active status from all range items
            rangeSubmenuItems.forEach(i => i.classList.remove('active'));
            
            // Set active status on clicked item
            item.classList.add('active');
            
            filterByOccurrenceRange(range);
        });
    });
}

// Function to get users from login data
function getUsersFromLogin() {
    // This would be a more complex function in a real app that retrieves login data
    // For this example, we'll check for user data stored by the login process
    const loggedUsers = JSON.parse(localStorage.getItem('loggedUsers')) || [];
    return loggedUsers;
}

// Function to populate users data from login information
function initializeUsersData() {
    // Get users who have logged in
    const loggedUsers = getUsersFromLogin();
    
    // Check if we already have user data
    let storedUsers = JSON.parse(localStorage.getItem('usersData')) || [];
    
    // If we have no users yet, create sample data
    if (storedUsers.length === 0) {
        // Sample data for demonstration
        storedUsers = [
            {
                id: 1,
                name: "João Silva",
                email: "joao.silva@email.com",
                startDate: "01/01/2023",
                type: "Normal",
                occurrences: 1
            },
            {
                id: 2,
                name: "Maria Santos",
                email: "maria.santos@email.com",
                startDate: "15/03/2023",
                type: "Verificado",
                occurrences: 7
            },
            {
                id: 3,
                name: "António Costa",
                email: "antonio.costa@email.com",
                startDate: "05/06/2023",
                type: "Anónimo",
                occurrences: 0
            },
            {
                id: 4,
                name: "Sofia Martins",
                email: "sofia.martins@email.com",
                startDate: "22/07/2023",
                type: "Normal",
                occurrences: 5
            },
            {
                id: 5,
                name: "Manuel Oliveira",
                email: "manuel.oliveira@email.com",
                startDate: "10/09/2023",
                type: "Verificado",
                occurrences: 4
            }
        ];
    }
    
    // Add logged users to our data if they don't exist already
    loggedUsers.forEach(loggedUser => {
        const existingUser = storedUsers.find(u => u.email === loggedUser.email);
        if (!existingUser && loggedUser.email) {
            storedUsers.push({
                id: storedUsers.length > 0 ? Math.max(...storedUsers.map(u => u.id)) + 1 : 1,
                name: loggedUser.name || loggedUser.email.split('@')[0],
                email: loggedUser.email,
                startDate: new Date().toLocaleDateString('pt-PT'),
                type: "Normal",
                occurrences: 0
            });
        }
    });
    
    // Store the updated list
    localStorage.setItem('usersData', JSON.stringify(storedUsers));
}

// Function to get login data from Google OAuth2
function processLoginData() {
    // Check if we're returning from Google authentication
    const hash = window.location.hash.substr(1);
    if (hash.includes('access_token')) {
        const params = {};
        hash.split('&').forEach(function(pair) {
            const parts = pair.split('=');
            if (parts.length === 2) {
                params[parts[0]] = decodeURIComponent(parts[1]);
            }
        });
        
        if (params.access_token) {
            // We have a token, fetch user info
            fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    'Authorization': `Bearer ${params.access_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.email) {
                    // Add this user to logged users
                    const loggedUsers = JSON.parse(localStorage.getItem('loggedUsers')) || [];
                    if (!loggedUsers.find(u => u.email === data.email)) {
                        loggedUsers.push({
                            name: data.name,
                            email: data.email,
                            picture: data.picture,
                            loginDate: new Date().toISOString()
                        });
                        localStorage.setItem('loggedUsers', JSON.stringify(loggedUsers));
                    }
                    
                    // Update our users data
                    initializeUsersData();
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
    }
}

// Initialize everything when page loads
document.addEventListener("DOMContentLoaded", () => {
    // Process login data (if any)
    processLoginData();
    
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize users data
    initializeUsersData();
    
    // Setup UI components
    setupHeaderCheckbox();
    setupUserTypeFilters();
    setupOccurrenceRangeFilters();
    
    // Populate table and pagination
    populateTable();
    updatePagination();
    
    // Setup search functionality
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', searchUsers);
    }
    
    // Setup search input enter key
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchUsers();
            }
        });
    }
    
    // Setup date filter
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            filterByDate(e.target.value);
        });
    }
    
    // Setup items per page select
    const itemsPerPageSelect = document.querySelector('.pagination-controls select');
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            currentPage = 1; // Reset to first page
            updatePagination();
            populateTable();
        });
    }
});