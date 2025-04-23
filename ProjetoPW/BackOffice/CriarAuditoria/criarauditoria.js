        // Exibir/ocultar a lista de materiais ao clicar no ícone
        const materialsSearchInput = document.getElementById('materialsSearchInput');
        const materialsList = document.getElementById('materialsList');
        const materialsDropdownIcon = document.getElementById('materialsDropdownIcon');

        // Toggle da lista de materiais
        function toggleMaterialsList() {
            materialsList.style.display = materialsList.style.display === 'none' ? 'block' : 'none';
        }

        // Adicionar eventos para abrir/fechar a lista
        materialsDropdownIcon.addEventListener('click', toggleMaterialsList);
        materialsSearchInput.addEventListener('click', toggleMaterialsList);

        // Fechar a lista se clicar fora dela
        window.addEventListener('click', function(event) {
            if (!event.target.matches('#materialsSearchInput') && 
                !event.target.matches('#materialsDropdownIcon') && 
                !event.target.closest('.materials-list')) {
                materialsList.style.display = 'none';
            }
        });

        // Função para filtrar materiais na busca
        materialsSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const items = document.querySelectorAll('.materials-list label');
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        // Atualizar exibição de materiais selecionados
        const checkboxes = document.querySelectorAll('input[name="materials"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectedMaterials);
        });

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
            
            // Adicionar listeners para remover itens
            document.querySelectorAll('.remove-material').forEach(btn => {
                btn.addEventListener('click', function() {
                    const value = this.getAttribute('data-value');
                    document.querySelector('input[value="' + value + '"]').checked = false;
                    updateSelectedMaterials();
                });
            });

        // Atualizar o texto no input para refletir as seleções
        updateInputText();
        }

        // Atualizar o texto do input com base nos itens selecionados
        function updateInputText() {
            const selected = Array.from(checkboxes)
                                .filter(cb => cb.checked)
                                .map(cb => cb.value);
            
            materialsSearchInput.value = selected.length > 0 ? 
                                        `${selected.length} item(ns) selecionado(s)` : 
                                        '';
        }

// Elementos para o modal de peritos
const openPeritosModalBtn = document.getElementById('openPeritosModal');
const peritosModal = document.getElementById('peritosModal');
const closePeritosModal = document.getElementById('closePeritosModal');
const peritosSearchInput = document.getElementById('peritosSearchInput');
const peritosListContainer = document.getElementById('peritosListContainer');
const applyPeritosSelection = document.getElementById('applyPeritosSelection');
const selectedPeritosContainer = document.getElementById('selectedPeritos');

// Array para armazenar os peritos selecionados
let selectedPeritosArray = [];

// Abrir o modal de peritos
openPeritosModalBtn.addEventListener('click', function() {
    loadPeritos();
    peritosModal.style.display = 'flex';
});

// Fechar o modal de peritos
closePeritosModal.addEventListener('click', function() {
    peritosModal.style.display = 'none';
});

// Fechar o modal ao clicar fora dele
window.addEventListener('click', function(event) {
    if (event.target === peritosModal) {
        peritosModal.style.display = 'none';
    }
});

// Carregar peritos disponíveis
function loadPeritos() {
    peritosListContainer.innerHTML = '';
    
    // Obter peritos do localStorage
    const experts = JSON.parse(localStorage.getItem('expertsData')) || [];
    
    // Filtrar apenas peritos disponíveis
    const availableExperts = experts.filter(expert => expert.status === "Disponível");
    
    if (availableExperts.length === 0) {
        // Se não houver peritos disponíveis, mostrar mensagem
        peritosListContainer.innerHTML = '<div class="no-peritos-message">Não há peritos disponíveis no momento.</div>';
    } else {
        // Adicionar cada perito disponível à lista
        availableExperts.forEach(expert => {
            const perito = document.createElement('div');
            perito.className = 'perito-card';
            perito.setAttribute('data-id', expert.id);
            
            // Verificar se o perito já está selecionado
            if (selectedPeritosArray.some(p => p.id === expert.id)) {
                perito.classList.add('selected');
            }
            
            // Usar a foto do localStorage ou uma imagem padrão
            const photoSrc = expert.profilePhoto || 'default-user.png';
            
            perito.innerHTML = `
                <img src="${photoSrc}" alt="${expert.name}" class="perito-photo">
                <div class="perito-info">
                    <div class="perito-name">${expert.name}</div>
                    <div class="perito-specialty">${expert.specialty}</div>
                    <div class="perito-email">${expert.email || 'Email não disponível'}</div>
                </div>
                <input type="checkbox" class="perito-checkbox" ${selectedPeritosArray.some(p => p.id === expert.id) ? 'checked' : ''}>
            `;
            
            // Evento de clique no card inteiro para selecionar/deselecionar
            perito.addEventListener('click', function() {
                const checkbox = this.querySelector('.perito-checkbox');
                checkbox.checked = !checkbox.checked;
                this.classList.toggle('selected');
                
                // Simular evento de mudança no checkbox
                const changeEvent = new Event('change');
                checkbox.dispatchEvent(changeEvent);
            });
            
            // Evento para o checkbox (para prevenir propagação do evento de clique)
            const checkbox = perito.querySelector('.perito-checkbox');
            checkbox.addEventListener('click', function(e) {
                e.stopPropagation();
            });
            
            // Evento de mudança no checkbox
            checkbox.addEventListener('change', function() {
                const perito = this.closest('.perito-card');
                perito.classList.toggle('selected', this.checked);
            });
            
            peritosListContainer.appendChild(perito);
        });
    }
}

// Filtrar peritos ao digitar na busca
peritosSearchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const peritoCards = document.querySelectorAll('.perito-card');
    
    peritoCards.forEach(card => {
        const name = card.querySelector('.perito-name').textContent.toLowerCase();
        const specialty = card.querySelector('.perito-specialty').textContent.toLowerCase();
        const email = card.querySelector('.perito-email').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || specialty.includes(searchTerm) || email.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

// Aplicar a seleção de peritos
applyPeritosSelection.addEventListener('click', function() {
    // Limpar seleções anteriores
    selectedPeritosArray = [];
    
    // Obter todos os peritos selecionados
    const selectedCards = document.querySelectorAll('.perito-card.selected');
    selectedCards.forEach(card => {
        const id = card.getAttribute('data-id');
        const name = card.querySelector('.perito-name').textContent;
        const specialty = card.querySelector('.perito-specialty').textContent;
        const photoSrc = card.querySelector('.perito-photo').src;
        
        selectedPeritosArray.push({
            id: id,
            name: name,
            specialty: specialty,
            photo: photoSrc
        });
    });
    
    // Atualizar a exibição dos peritos selecionados
    updateSelectedPeritosDisplay();
    
    // Fechar o modal
    peritosModal.style.display = 'none';
});

// Atualizar a exibição dos peritos selecionados
function updateSelectedPeritosDisplay() {
    selectedPeritosContainer.innerHTML = '';
    
    if (selectedPeritosArray.length === 0) {
        // Opcional: adicionar uma mensagem quando não há peritos selecionados
        selectedPeritosContainer.innerHTML = '<div class="no-peritos-selected">Nenhum perito selecionado</div>';
        return;
    }
    
    selectedPeritosArray.forEach(perito => {
        const tag = document.createElement('div');
        tag.className = 'perito-tag';
        tag.innerHTML = `
            <img src="${perito.photo}" alt="${perito.name}" class="perito-tag-photo">
            <span class="perito-tag-name">${perito.name}</span>
            <span class="remove-perito" data-id="${perito.id}">×</span>
        `;
        
        selectedPeritosContainer.appendChild(tag);
    });
    
    // Adicionar eventos para remover peritos
    document.querySelectorAll('.remove-perito').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            selectedPeritosArray = selectedPeritosArray.filter(p => p.id !== id);
            updateSelectedPeritosDisplay();
        });
    });
}


        // Elementos do time picker
        const durationInput = document.getElementById('durationInput');
        const timePickerIcon = document.getElementById('timePickerIcon');
        const timePicker = document.getElementById('timePicker');
        const timePickerClose = document.getElementById('timePickerClose');
        const timePickerApply = document.getElementById('timePickerApply');

        // Elementos para horas, minutos e segundos
        const hoursValue = document.getElementById('hoursValue');
        const minutesValue = document.getElementById('minutesValue');
        const secondsValue = document.getElementById('secondsValue');
        const hoursUp = document.getElementById('hoursUp');
        const hoursDown = document.getElementById('hoursDown');
        const minutesUp = document.getElementById('minutesUp');
        const minutesDown = document.getElementById('minutesDown');
        const secondsUp = document.getElementById('secondsUp');
        const secondsDown = document.getElementById('secondsDown');

        // Valores iniciais
        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        // Função para formatar números com dois dígitos
        function formatTwoDigits(num) {
            return num.toString().padStart(2, '0');
        }

        // Função para atualizar os valores mostrados
        function updateTimeDisplay() {
            hoursValue.textContent = formatTwoDigits(hours);
            minutesValue.textContent = formatTwoDigits(minutes);
            secondsValue.textContent = formatTwoDigits(seconds);
        }

        // Função para aplicar valores ao input
        function applyTime() {
            durationInput.value = `${formatTwoDigits(hours)}:${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}`;
            timePicker.style.display = 'none';
        }

        // Incremento e decremento para horas
        hoursUp.addEventListener('click', function() {
            hours = (hours + 1) % 24;
            updateTimeDisplay();
        });

        hoursDown.addEventListener('click', function() {
            hours = (hours - 1 + 24) % 24;
            updateTimeDisplay();
        });

        // Incremento e decremento para minutos
        minutesUp.addEventListener('click', function() {
            minutes = (minutes + 1) % 60;
            updateTimeDisplay();
        });

        minutesDown.addEventListener('click', function() {
            minutes = (minutes - 1 + 60) % 60;
            updateTimeDisplay();
        });

        // Incremento e decremento para segundos
        secondsUp.addEventListener('click', function() {
            seconds = (seconds + 1) % 60;
            updateTimeDisplay();
        });

        secondsDown.addEventListener('click', function() {
            seconds = (seconds - 1 + 60) % 60;
            updateTimeDisplay();
        });

        // Mostrar o time picker ao clicar no input 
        durationInput.addEventListener('click', showTimePicker);
        timePickerIcon.addEventListener('click', showTimePicker);

        function showTimePicker() {
            // Posicionamento do time picker abaixo do input
            const inputRect = durationInput.getBoundingClientRect();
            timePicker.style.top = inputRect.bottom + 5 + 'px';
            timePicker.style.left = inputRect.left + 'px';
            timePicker.style.display = 'block';
            
            // Extrair valores do input se já tiver algum valor
            if (durationInput.value) {
                const timeValues = durationInput.value.split(':');
                if (timeValues.length === 3) {
                    hours = parseInt(timeValues[0]) || 0;
                    minutes = parseInt(timeValues[1]) || 0;
                    seconds = parseInt(timeValues[2]) || 0;
                    updateTimeDisplay();
                }
            }
        }

        // Aplicar o tempo quando clicar no botão "Aplicar"
        timePickerApply.addEventListener('click', function(e) {
            e.preventDefault(); // Evitar submissão do formulário
            applyTime();
        });

        // Fechar o time picker quando clicar no X
        timePickerClose.addEventListener('click', function() {
            timePicker.style.display = 'none';
        });

        // Fechar o time picker quando clicar fora dele
        window.addEventListener('click', function(event) {
            if (!event.target.closest('#timePicker') && 
                !event.target.matches('#durationInput') && 
                !event.target.matches('#timePickerIcon')) {
                timePicker.style.display = 'none';
            }
        });

        // Elementos do calendário
        const dateInput = document.getElementById('dateInput');
        const calendarIcon = document.getElementById('calendarIcon');
        const calendar = document.getElementById('calendar');
        const calendarClose = document.getElementById('calendarClose');
        const calendarApply = document.getElementById('calendarApply');
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        const prevYear = document.getElementById('prevYear');
        const nextYear = document.getElementById('nextYear');
        const monthYearLabel = document.getElementById('monthYearLabel');
        const calendarDays = document.getElementById('calendarDays');
        const todayBtn = document.getElementById('todayBtn');
        const yearInput = document.getElementById('yearInput');

        // Data atual e selecionada
        let currentDate = new Date();
        let selectedDate = null;

        // Nomes dos meses em português
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 
            'Maio', 'Junho', 'Julho', 'Agosto', 
            'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        // Função para formatar data no formato DD/MM/YYYY
        function formatDate(date) {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        // Função para atualizar o label do mês e ano
        function updateMonthYearLabel() {
            monthYearLabel.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
            yearInput.value = currentDate.getFullYear();
        }

        // Função para gerar os dias do calendário
        function generateCalendarDays() {
            calendarDays.innerHTML = '';
            
            // Determinar o primeiro dia do mês
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            
            // Determinar o dia da semana do primeiro dia (0 = Domingo, 1 = Segunda, etc.)
            const firstDayWeekday = firstDayOfMonth.getDay();
            
            // Adicionar dias do mês anterior para preencher a primeira semana
            const lastDayPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            for (let i = firstDayWeekday - 1; i >= 0; i--) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day other-month';
                dayElement.textContent = lastDayPrevMonth.getDate() - i;
                calendarDays.appendChild(dayElement);
            }
            
            // Adicionar dias do mês atual
            const today = new Date();
            for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = day;
                
                // Marcar o dia atual
                if (
                    currentDate.getFullYear() === today.getFullYear() &&
                    currentDate.getMonth() === today.getMonth() &&
                    day === today.getDate()
                ) {
                    dayElement.classList.add('today');
                }
                
                // Marcar o dia selecionado
                if (
                    selectedDate &&
                    currentDate.getFullYear() === selectedDate.getFullYear() &&
                    currentDate.getMonth() === selectedDate.getMonth() &&
                    day === selectedDate.getDate()
                ) {
                    dayElement.classList.add('selected');
                }
                
                // Adicionar evento de clique para selecionar o dia
                dayElement.addEventListener('click', function() {
                    // Remover a classe 'selected' de qualquer dia previamente selecionado
                    document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
                    
                    // Adicionar a classe 'selected' ao dia clicado
                    this.classList.add('selected');
                    
                    // Atualizar a data selecionada
                    selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                });
                
                calendarDays.appendChild(dayElement);
            }
            
            // Adicionar dias do próximo mês para completar a grade
            const totalDaysShown = calendarDays.children.length;
            const daysToAdd = 42 - totalDaysShown; // 6 semanas * 7 dias = 42 células no total
            
            for (let i = 1; i <= daysToAdd; i++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day other-month';
                dayElement.textContent = i;
                calendarDays.appendChild(dayElement);
            }
        }

        // Atualizar todo o calendário
        function updateCalendar() {
            updateMonthYearLabel();
            generateCalendarDays();
        }

        // Mostrar o calendário
        function showCalendar() {
            const inputRect = dateInput.getBoundingClientRect();
            calendar.style.top = (inputRect.bottom + 5) + 'px';
            calendar.style.left = inputRect.left + 'px';
            calendar.style.display = 'block';
            
            // Se já houver uma data no input, usá-la como data selecionada
            if (dateInput.value) {
                const parts = dateInput.value.split('/');
                if (parts.length === 3) {
                    const day = parseInt(parts[0]);
                    const month = parseInt(parts[1]) - 1; // Mês é zero-indexed
                    const year = parseInt(parts[2]);
                    
                    // Verificar se a data é válida
                    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                        selectedDate = new Date(year, month, day);
                        currentDate = new Date(year, month, 1); // Primeiro dia do mês selecionado
                    }
                }
            }
            
            updateCalendar();
        }

        // Iniciar o calendário ao clicar no input ou no ícone
        dateInput.addEventListener('click', showCalendar);
        calendarIcon.addEventListener('click', showCalendar);

        // Fechar o calendário ao clicar no X
        calendarClose.addEventListener('click', function() {
            calendar.style.display = 'none';
        });

        // Aplicar a data selecionada ao input
        calendarApply.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir submissão do formulário
            
            if (selectedDate) {
                dateInput.value = formatDate(selectedDate);
                calendar.style.display = 'none';
            } else {
                alert('Por favor, selecione uma data no calendário.');
            }
        });

        // Navegar para o mês anterior
        prevMonth.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendar();
        });

        // Navegar para o próximo mês
        nextMonth.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendar();
        });

        // Navegar para o ano anterior
        prevYear.addEventListener('click', function() {
            currentDate.setFullYear(currentDate.getFullYear() - 1);
            updateCalendar();
        });

        // Navegar para o próximo ano
        nextYear.addEventListener('click', function() {
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            updateCalendar();
        });

        // Ir para o dia atual
        todayBtn.addEventListener('click', function() {
            currentDate = new Date();
            selectedDate = new Date();
            updateCalendar();
        });

        // Atualizar o ano quando o input de ano mudar
        yearInput.addEventListener('change', function() {
            const year = parseInt(this.value);
            if (!isNaN(year) && year >= 2000 && year <= 2100) {
                currentDate.setFullYear(year);
                updateCalendar();
            } else {
                alert('Por favor, insira um ano válido entre 2000 e 2100.');
                this.value = currentDate.getFullYear();
            }
        });

        // Fechar o calendário quando clicar fora dele
        window.addEventListener('click', function(event) {
            if (!event.target.closest('#calendar') && 
                !event.target.matches('#dateInput') && 
                !event.target.matches('#calendarIcon')) {
                calendar.style.display = 'none';
            }
        });

        // Inicializar o calendário
        updateCalendar();

// Adicionar validação ao envio do formulário
document.getElementById('auditForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    let firstInvalidField = null;
    
    // Obter todos os campos obrigatórios
    const requiredFields = {
        'nome': document.querySelector('.form-group:nth-child(1) input'),
        'duração': document.getElementById('durationInput'),
        'data': document.getElementById('dateInput'),
        'morada': document.querySelector('.form-group:nth-child(3) input'),
        'código postal': document.getElementById('postalCode')
    };
    
    // Verificar se os materiais foram selecionados
    const materialsSelected = Array.from(document.querySelectorAll('input[name="materials"]'))
        .some(checkbox => checkbox.checked);
    
    if (!materialsSelected) {
        document.querySelector('.materials-search').classList.add('invalid');
        document.querySelector('.materials-search').insertAdjacentHTML('afterend', 
            '<div class="error-message">Por favor, selecione pelo menos um material</div>');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = document.getElementById('materialsSearchInput');
    } else {
        document.querySelector('.materials-search').classList.remove('invalid');
        const errorMsg = document.querySelector('.materials-search + .error-message');
        if (errorMsg) errorMsg.remove();
    }
    
    // Verificar descrição
    const descricao = document.querySelector('textarea.description-area');
    if (!descricao.value.trim()) {
        descricao.classList.add('invalid');
        descricao.insertAdjacentHTML('afterend', 
            '<div class="error-message">Por favor, preencha a descrição</div>');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = descricao;
    } else {
        descricao.classList.remove('invalid');
        const errorMsg = descricao.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }

    
    // Verificar se pelo menos um perito foi selecionado
    if (selectedPeritosArray.length === 0) {
        document.querySelector('.peritos-button').classList.add('invalid');
        document.querySelector('.peritos-button').insertAdjacentHTML('afterend', 
            '<div class="error-message">Por favor, selecione pelo menos um perito</div>');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = document.getElementById('openPeritosModal');
    } else {
        document.querySelector('.peritos-button').classList.remove('invalid');
        const errorMsg = document.querySelector('.peritos-button + .error-message');
        if (errorMsg) errorMsg.remove();
    }
    
    // Validar cada campo obrigatório
    for (const [fieldName, field] of Object.entries(requiredFields)) {
        // Remover mensagens de erro anteriores
        const parentNode = field.parentElement.tagName === 'DIV' ? field.parentElement : field.parentElement;
        const existingError = parentNode.nextElementSibling;
        if (existingError && existingError.className === 'error-message') {
            existingError.remove();
        }
        
        // Verificar se o campo está vazio
        if (!field.value.trim()) {
            field.classList.add('invalid');
            field.parentElement.insertAdjacentHTML('afterend', 
                `<div class="error-message">Por favor, preencha o campo ${fieldName}</div>`);
            isValid = false;
            if (!firstInvalidField) firstInvalidField = field;
        } else {
            field.classList.remove('invalid');
        }
        
        // Validações específicas
        if (field.id === 'postalCode' && field.value.trim() && !/^\d{4}-\d{3}$/.test(field.value)) {
            field.classList.add('invalid');
            field.parentElement.insertAdjacentHTML('afterend', 
                '<div class="error-message">Código postal deve estar no formato XXXX-XXX</div>');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = field;
        }
        
        if (field.id === 'durationInput' && field.value.trim() && !/^\d{2}:\d{2}:\d{2}$/.test(field.value)) {
            field.classList.add('invalid');
            field.parentElement.insertAdjacentHTML('afterend', 
                '<div class="error-message">Duração deve estar no formato HH:MM:SS</div>');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = field;
        }
        
        if (field.id === 'dateInput' && field.value.trim() && !/^\d{2}\/\d{2}\/\d{4}$/.test(field.value)) {
            field.classList.add('invalid');
            field.parentElement.insertAdjacentHTML('afterend', 
                '<div class="error-message">Data deve estar no formato DD/MM/YYYY</div>');
            isValid = false;
            if (!firstInvalidField) firstInvalidField = field;
        }
    }
    
    // Se houver campos inválidos, rolar até o primeiro campo com erro
    if (!isValid && firstInvalidField) {
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    // Se tudo estiver válido, salvar no localStorage e mostrar mensagem de sucesso
    if (isValid) {
        saveAuditToLocalStorage();
        showSuccessToast('Auditoria criada com sucesso!');
        
        // Opcional: Limpar formulário após salvar
        setTimeout(() => {
            document.getElementById('auditForm').reset();
            // Limpar seleções
            checkboxes.forEach(checkbox => checkbox.checked = false);
            updateSelectedMaterials();
            selectedPeritosArray = [];
            updateSelectedPeritosDisplay();
        }, 2000);
    }
});

// Função para salvar a auditoria no localStorage
function saveAuditToLocalStorage() {
    // Obter valores do formulário
    const nome = document.querySelector('.form-group:nth-child(1) input').value;
    const descricao = document.querySelector('textarea.description-area').value;
    const duracao = document.getElementById('durationInput').value;
    const data = document.getElementById('dateInput').value;
    const morada = document.querySelector('.form-group:nth-child(3) input').value;
    const codigoPostal = document.getElementById('postalCode').value;
    
    // Obter materiais selecionados
    const materiaisSelecionados = Array.from(document.querySelectorAll('input[name="materials"]:checked'))
        .map(checkbox => checkbox.value);
    
    // Criar objeto da auditoria
    const auditoria = {
        id: Date.now().toString(), // ID único baseado no timestamp
        nome: nome,
        descricao: descricao,
        duracao: duracao,
        data: data,
        morada: morada,
        codigoPostal: codigoPostal,
        materiais: materiaisSelecionados,
        peritos: selectedPeritosArray,
        dataCriacao: new Date().toISOString()
    };
    
    // Obter auditorias existentes do localStorage ou criar array vazio
    const auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];
    
    // Adicionar nova auditoria
    auditorias.push(auditoria);
    
    // Salvar no localStorage
    localStorage.setItem('auditorias', JSON.stringify(auditorias));
}

// Função para mostrar o toast de sucesso
function showSuccessToast(message) {
    // Criar elemento do toast
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">✓</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    // Adicionar ao body
    document.body.appendChild(toast);
    
    // Aplicar animação de entrada
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remover toast após alguns segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}
