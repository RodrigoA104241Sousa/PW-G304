document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    lucide.createIcons();

    // Add example users if they don't exist
    addExampleUsers();

    // Load users from local storage
    const users = loadUsersFromStorage();

    // Current pagination state
    let currentPage = 1;
    let itemsPerPage = 16;
    let filteredUsers = [...users];

    // Filter toggle state
    let filters = {
        occurrences: null, // Can be "0-2", "3-5", "+5" or null
        nameEmailSearch: '', // Name/Email search term
        dateSearch: '', // Date search
    };

    // Initialize page
    renderUsers();
    setupEventListeners();
    updatePagination();

    // Add example users to local storage if they don't exist
    function addExampleUsers() {
        const storedUsers = localStorage.getItem('registeredUsers');
        let existingUsers = storedUsers ? JSON.parse(storedUsers) : [];
        
        // Check if example users are already added (to avoid duplicates)
        if (existingUsers.length < 7) {
            // Define 7 example users
            const exampleUsers = [
                {
                    id: 1,
                    name: 'Ana Silva',
                    email: 'ana.silva@exemplo.com',
                    userSince: '2025-04-15T08:30:00',
                    occurrences: 2
                },
                {
                    id: 2,
                    name: 'João Ferreira',
                    email: 'joao.ferreira@exemplo.com',
                    userSince: '2025-03-22T14:15:00',
                    occurrences: 4
                },
                {
                    id: 3,
                    name: 'Mariana Costa',
                    email: 'mariana.costa@exemplo.com',
                    userSince: '2025-04-10T09:45:00',
                    occurrences: 1
                },
                {
                    id: 4,
                    name: 'Pedro Santos',
                    email: 'pedro.santos@exemplo.com',
                    userSince: '2025-05-05T11:20:00',
                    occurrences: 7
                },
                {
                    id: 5,
                    name: 'Inês Oliveira',
                    email: 'ines.oliveira@exemplo.com',
                    userSince: '2025-04-30T16:00:00',
                    occurrences: 3
                },
                {
                    id: 6,
                    name: 'Miguel Rodrigues',
                    email: 'miguel.rodrigues@exemplo.com',
                    userSince: '2025-03-30T10:30:00',
                    occurrences: 6
                },
                {
                    id: 7,
                    name: 'Carolina Martins',
                    email: 'carolina.martins@exemplo.com',
                    userSince: '2025-04-12T13:45:00',
                    occurrences: 0
                }
            ];

            // Filter out example users already in the storage
            const existingEmails = existingUsers.map(user => user.email);
            const newExampleUsers = exampleUsers.filter(user => !existingEmails.includes(user.email));

            // Add new example users to existing users
            if (newExampleUsers.length > 0) {
                existingUsers = [...existingUsers, ...newExampleUsers];
                localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
                console.log(`Added ${newExampleUsers.length} example users to local storage`);
            }
        }
    }

    // Setup all event listeners
    function setupEventListeners() {
        document.getElementById('searchButton').addEventListener('click', filterUsers);

        const searchInputs = document.querySelectorAll('input');
        searchInputs.forEach(input => {
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    filterUsers();
                }
            });
        });

        // Pagination controls
        const paginationButtons = document.querySelectorAll('.pagination-buttons button');
        paginationButtons.forEach(button => {
            button.addEventListener('click', function () {
                if (this.textContent === '<') {
                    if (currentPage > 1) currentPage--;
                } else if (this.textContent === '>') {
                    if (currentPage < Math.ceil(filteredUsers.length / itemsPerPage)) currentPage++;
                } else {
                    currentPage = parseInt(this.textContent);
                }
                renderUsers();
                updatePagination();
            });
        });

        const itemsPerPageSelect = document.querySelector('.pagination-controls select');
        itemsPerPageSelect.addEventListener('change', function () {
            itemsPerPage = parseInt(this.value);
            currentPage = 1;
            renderUsers();
            updatePagination();
        });

        // Filter submenu items (occurrences)
        const submenuItems = document.querySelectorAll('.submenu-item');
        submenuItems.forEach(item => {
            item.addEventListener('click', function () {
                const status = this.getAttribute('data-status');
                if (filters.occurrences === status) {
                    filters.occurrences = null;
                    submenuItems.forEach(btn => btn.classList.remove('active'));
                } else {
                    filters.occurrences = status;
                    submenuItems.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                }
                currentPage = 1;
                filterUsers();
            });
        });

        // Menu item click (expand/collapse submenu)
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            if (item.querySelector('.menu-item-content')) {
                item.addEventListener('click', function () {
                    const chevron = this.querySelector('[data-lucide="chevron-down"]');
                    const submenu = this.nextElementSibling;

                    if (submenu && submenu.classList.contains('submenu')) {
                        submenu.style.display = submenu.style.display === 'none' ? 'flex' : 'none';
                        chevron.style.transform = submenu.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
                    }
                });
            }
        });

        // Clear filters button
        document.getElementById('clearFiltersBtn').addEventListener('click', clearFilters);
    }

    // Function to clear all filters
    function clearFilters() {
        // Reset filter state
        filters = {
            occurrences: null,
            nameEmailSearch: '',
            dateSearch: ''
        };

        // Clear input fields
        document.getElementById('searchInput').value = '';
        document.getElementById('dateInput').value = '';
        document.querySelectorAll('input')[2].value = '';

        // Remove active classes from filter buttons
        document.querySelectorAll('.submenu-item').forEach(btn => btn.classList.remove('active'));

        // Reset filtered users
        filteredUsers = [...users];

        // Reset to first page and re-render
        currentPage = 1;
        renderUsers();
        updatePagination();
    }

    // Filter users based on input fields
    function filterUsers() {
        // Get filter values
        filters.nameEmailSearch = document.getElementById('searchInput').value.toLowerCase();
        filters.dateSearch = document.getElementById('dateInput').value;
        const occurrencesSearch = document.querySelectorAll('input')[2].value.toLowerCase();

        // Filter users based on all filter conditions
        filteredUsers = users.filter(user => {
            const nameEmailMatch = filters.nameEmailSearch === '' ||
                user.name.toLowerCase().includes(filters.nameEmailSearch) ||
                user.email.toLowerCase().includes(filters.nameEmailSearch);

            const dateMatch = filters.dateSearch === '' ||
                new Date(user.userSince) >= new Date(filters.dateSearch);

            const occurrencesMatch = occurrencesSearch === '' ||
                user.occurrences.toString() === occurrencesSearch;

            let occurrencesRangeMatch = true;
            if (filters.occurrences) {
                if (filters.occurrences === "0-2") {
                    occurrencesRangeMatch = user.occurrences >= 0 && user.occurrences <= 2;
                } else if (filters.occurrences === "3-5") {
                    occurrencesRangeMatch = user.occurrences >= 3 && user.occurrences <= 5;
                } else if (filters.occurrences === "+5") {
                    occurrencesRangeMatch = user.occurrences > 5;
                }
            }

            return nameEmailMatch && dateMatch && occurrencesMatch && occurrencesRangeMatch;
        });

        currentPage = 1;
        renderUsers();
        updatePagination();
    }

    // Render filtered users in the table
    function renderUsers() {
        const tableBody = document.getElementById('expertsTableBody');
        tableBody.innerHTML = '';

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);

        for (let i = startIndex; i < endIndex; i++) {
            const user = filteredUsers[i];

            let badgeClass = '';
            if (user.occurrences <= 2) {
                badgeClass = 'occurrences-low';
            } else if (user.occurrences <= 5) {
                badgeClass = 'occurrences-medium';
            } else {
                badgeClass = 'occurrences-high';
            }

            const date = new Date(user.userSince);
            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="expert-info">
                        <div class="expert-name">${user.name}</div>
                        <div class="expert-email">${user.email}</div>
                    </div>
                </td>
                <td>${formattedDate}</td>
                <td>
                    <span class="status-badge ${badgeClass}">${user.occurrences}</span>
                </td>
            `;

            tableBody.appendChild(row);
        }

        lucide.createIcons();
    }

    // Update pagination controls
    function updatePagination() {
        const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
        const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length);
        const endItem = Math.min(currentPage * itemsPerPage, filteredUsers.length);

        document.querySelector('.pagination-info').textContent =
            `Mostrando ${startItem} - ${endItem} de ${filteredUsers.length} utilizadores registados`;

        const paginationButtons = document.querySelectorAll('.pagination-buttons button');
        for (let i = 1; i < paginationButtons.length - 1; i++) {
            const pageNum = currentPage - 2 + i;
            if (pageNum > 0 && pageNum <= totalPages) {
                paginationButtons[i].textContent = pageNum;
                paginationButtons[i].style.display = 'block';
                paginationButtons[i].classList.toggle('active', pageNum === currentPage);
            } else {
                paginationButtons[i].style.display = 'none';
            }
        }

        paginationButtons[0].disabled = currentPage === 1;
        paginationButtons[paginationButtons.length - 1].disabled = currentPage === totalPages;
    }

    // Load users from local storage
    function loadUsersFromStorage() {
        const storedUsers = localStorage.getItem('registeredUsers');
        let existingUsers = storedUsers ? JSON.parse(storedUsers) : [];

        const frontOfficeUser = localStorage.getItem('userfront');
        if (frontOfficeUser) {
            try {
                const userInfo = JSON.parse(frontOfficeUser);

                const userExists = existingUsers.some(user => user.email === userInfo.email);

                if (!userInfo.isAdmin && !userExists) {
                    const newUser = {
                        id: existingUsers.length + 1,
                        name: userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim(),
                        email: userInfo.email,
                        userSince: userInfo.userSince || new Date().toISOString(),
                        occurrences: userInfo.occurrences || 0
                    };

                    existingUsers.unshift(newUser);
                    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

                    console.log('Added new user from front office login:', newUser);
                }
            } catch (error) {
                console.error('Error processing front office user:', error);
            }
        }

        return existingUsers;
    }
});