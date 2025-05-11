document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    lucide.createIcons();

    // Load users only from front office
    const users = loadUsersFromStorage();

    // Current pagination state
    let currentPage = 1;
    let itemsPerPage = 16;
    let filteredUsers = [...users];

    // Filter toggle state
    let filters = {
        occurrences: null // Can be "0-2", "3-5", "+5" or null
    };

    // Initialize page
    renderUsers();
    setupEventListeners();
    updatePagination();

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
    }

    function filterUsers() {
        const nameEmailSearch = document.getElementById('searchInput').value.toLowerCase();
        const dateSearch = document.getElementById('dateInput').value;
        const occurrencesSearch = document.querySelectorAll('input')[2].value.toLowerCase();

        filteredUsers = users.filter(user => {
            const nameEmailMatch = nameEmailSearch === '' ||
                user.name.toLowerCase().includes(nameEmailSearch) ||
                user.email.toLowerCase().includes(nameEmailSearch);

            const dateMatch = dateSearch === '' ||
                new Date(user.userSince) >= new Date(dateSearch);

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