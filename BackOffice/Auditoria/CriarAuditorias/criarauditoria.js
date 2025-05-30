// ------- GERAR ID -------
function gerarProximoIdAuditoria() {
    const auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];
    if (auditorias.length === 0) return "1";

    const ids = auditorias.map(a => parseInt(a.id)).filter(id => !isNaN(id));
    return (Math.max(...ids) + 1).toString();
}
function getAndIncrementNextAuditId() {
    let nextId = parseInt(localStorage.getItem('nextAuditId')) || 1;
    localStorage.setItem('nextAuditId', (nextId + 1).toString());
    return nextId.toString();
}

// ------- DOM -------
document.addEventListener('DOMContentLoaded', function() {
    // ID auditoria
    const idPreview = localStorage.getItem('nextAuditId') || "1";
    const idDisplay = document.getElementById('auditIdDisplay');
    if (idDisplay) {
        idDisplay.textContent = idPreview;
    }

    // Pegar o ID da ocorrência do localStorage
    const occurrenceId = localStorage.getItem('occurrenceForAudit');
    
    if (occurrenceId) {
        // Buscar ocorrências do localStorage
        const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
        
        // Encontrar a ocorrência específica
        const ocorrencia = ocorrencias.find(o => o.id === parseInt(occurrenceId));

        if (ocorrencia) {
            // Preencher o campo de morada corretamente
            const moradaInput = document.getElementById('inputMorada');
            if (moradaInput) moradaInput.value = ocorrencia.morada || '';

            // Preencher o código postal se existir
            const codigoPostalInput = document.getElementById('postalCode');
            if (codigoPostalInput) codigoPostalInput.value = ocorrencia.codigoPostal || '';

            // Opcional: tornar os campos readonly se você não quiser que sejam editados
            if (moradaInput) moradaInput.setAttribute('readonly', true);
            if (codigoPostalInput) codigoPostalInput.setAttribute('readonly', true);
        }
    }
});

// ------- TIPO AUDITORIA -------
const tipoInput = document.getElementById('tipoAuditoriaInput');
const tipoDropdownIcon = document.getElementById('tipoDropdownIcon');
const tipoList = document.getElementById('tipoAuditoriaList');

// Toggle da lista
function toggleTipoList() {
    tipoList.style.display = tipoList.style.display === 'none' ? 'block' : 'none';
}

tipoInput.addEventListener('click', toggleTipoList);
tipoDropdownIcon.addEventListener('click', toggleTipoList);

// Selecionar tipo
document.querySelectorAll('input[name="tipoAuditoria"]').forEach(radio => {
    radio.addEventListener('change', function() {
        tipoInput.value = this.value;
        tipoList.style.display = 'none';

         tipoInput.classList.remove('invalid');
        const erro = tipoInput.closest('.form-group')?.querySelector('.error-message');
        if (erro) erro.remove();
    });
});

// Fechar ao clicar fora
window.addEventListener('click', function(event) {
    if (!event.target.closest('.tipo-container')) {
        tipoList.style.display = 'none';
    }
});

// ------- MATERIAIS -------
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
    
    // ------- PERITOS -------
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
        
        // Filtrar peritos disponíveis e da mesma especialidade do tipo de auditoria
        const tipoAuditoriaSelecionado = document.getElementById('tipoAuditoriaInput').value;
        const availableExperts = experts.filter(expert =>
            expert.status === "Disponível" &&
            expert.specialty === tipoAuditoriaSelecionado
        );
            
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
            const email = card.querySelector('.perito-email').textContent // <-- Adiciona o email aqui
            
            selectedPeritosArray.push({
                id: id,
                name: name,
                specialty: specialty,
                photo: photoSrc,
                email: email
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

        // ------- TIME PICKER -------
        // Elementos do time picker
        const durationInput = document.getElementById('durationInput');
        const timePickerIcon = document.getElementById('timePickerIcon');
        const timePicker = document.getElementById('timePicker');
        const timePickerClose = document.getElementById('timePickerClose');
        const timePickerApply = document.getElementById('timePickerApply');

        // Elementos para horas, minutos e segundos
        const mesesValue = document.getElementById('mesesValue');
        const diasValue = document.getElementById('diasValue');
        const horasValue = document.getElementById('horasValue');
        const mesesUp = document.getElementById('mesesUp');
        const mesesDown = document.getElementById('mesesDown');
        const diasUp = document.getElementById('diasUp');
        const diasDown = document.getElementById('diasDown');
        const horasUp = document.getElementById('horasUp');
        const horasDown = document.getElementById('horasDown');

        // Valores iniciais
        let meses = 0;
        let dias = 0;
        let horas = 0;

        // Função para formatar números com dois dígitos
        function formatTwoDigits(num) {
            return num.toString().padStart(2, '0');
        }

        // Função para atualizar os valores mostrados
        function updateTimeDisplay() {
            mesesValue.textContent = formatTwoDigits(meses);
            diasValue.textContent = formatTwoDigits(dias);
            horasValue.textContent = formatTwoDigits(horas);
        }

        // Função para aplicar valores ao input
        function applyTime() {
            durationInput.value = formatarDuracao(meses, dias, horas);
            timePicker.style.display = 'none';
        }
        
        //Formatar duração
        function formatarDuracao(meses, dias, horas) {
            const partes = [];

            if (meses > 0) partes.push(`${meses} ${meses === 1 ? 'mês' : 'meses'}`);
            if (dias > 0) partes.push(`${dias} ${dias === 1 ? 'dia' : 'dias'}`);
            if (horas > 0) partes.push(`${horas} ${horas === 1 ? 'hora' : 'horas'}`);

            return partes.length > 0 ? partes.join(', ') : '0 horas';
        }

        // Incremento e decremento para horas
        mesesUp.addEventListener('click', function() {
            meses = (meses + 1) % 13;
            updateTimeDisplay();
        });

        mesesDown.addEventListener('click', function() {
            meses = (meses - 1 + 13) % 13;
            updateTimeDisplay();
        });

        // Incremento e decremento para minutos
        diasUp.addEventListener('click', function() {
            dias = (dias + 1) % 32;
            updateTimeDisplay();
        });

        diasDown.addEventListener('click', function() {
            dias = (dias - 1 + 32) % 32;
            updateTimeDisplay();
        });

        // Incremento e decremento para segundos
        horasUp.addEventListener('click', function() {
            horas = (horas + 1) % 25;
            updateTimeDisplay();
        });

        horasDown.addEventListener('click', function() {
            horas = (horas - 1 + 25) % 25;
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
                    meses = parseInt(timeValues[0]) || 0;
                    dias = parseInt(timeValues[1]) || 0;
                    horas = parseInt(timeValues[2]) || 0;
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

    // ------- CALENDARIO -------
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
            e.preventDefault();
            
            if (selectedDate) {
                dateInput.value = formatDate(selectedDate);
                calendar.style.display = 'none';
                dateInput.classList.remove('invalid');
                const erro = dateInput.closest('.form-group')?.querySelector('.error-message');
                if (erro) erro.remove();
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

// ------- VALIDAÇÃO DO FORMULÁRIO -------
// Adicionar validação ao envio do formulário
document.getElementById('auditForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede envio automático
  
    // Lista de campos obrigatórios: mapeamos {nome-lógico: elemento}
    const required = {
      'Data':       document.getElementById('dateInput'),
      'Morada': document.querySelector('input[placeholder="Insira morada"]'),
    };
  
    let firstError = null;
    let valid = true;
  
    // Limpar mensagens anteriores
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    Object.values(required).forEach(field => field.classList.remove('invalid'));
  
    // Verificar cada campo
    for (const [label, field] of Object.entries(required)) {
      if (!field.value.trim()) {
        valid = false;
        field.classList.add('invalid');
  
        const msg = document.createElement('div');
        msg.className = 'error-message';
        msg.textContent = `Por favor, preencha o campo ${label}.`;
        field.closest('.form-group').appendChild(msg);
  
        if (!firstError) firstError = field;
      }
    }
  
    // Verificar materiais selecionados
    document.getElementById('materialsSearchInput')?.classList.remove('invalid');
    const materiaisSelecionados = 
      Array.from(document.querySelectorAll('input[name="materials"]:checked')).length;
    if (materiaisSelecionados === 0) {
      valid = false;
      const cont = document.getElementById('materialsSearchInput');
      cont.classList.add('invalid');
      const msg = document.createElement('div');
      msg.className = 'error-message';
      msg.textContent = 'Selecione pelo menos um material.';
      cont.parentNode.insertAdjacentElement('afterend', msg);
  
      if (!firstError) firstError = cont;
    }

    // Verificar Tipo de Auditoria
    document.getElementById('tipoAuditoriaInput')?.classList.remove('invalid');
    const tipoAuditoriaInput = document.getElementById('tipoAuditoriaInput');
    if (!tipoAuditoriaInput.value) {
        valid = false;
        tipoAuditoriaInput.classList.add('invalid');
        const msg = document.createElement('div');
        msg.className = 'error-message';
        msg.textContent = 'Por favor, selecione o tipo de auditoria.';
        tipoAuditoriaInput.parentNode.insertAdjacentElement('afterend', msg);
        if (!firstError) firstError = tipoAuditoriaInput;
    }

    // Verificar Nível de Urgência
    document.querySelector('.urgency-rating')?.classList.remove('invalid');
    const urgenciaSelecionada = document.querySelector('input[name="urgency"]:checked');
    if (!urgenciaSelecionada) {
        valid = false;
        const container = document.querySelector('.urgency-rating');
        const msg = document.createElement('div');
        msg.className = 'error-message';
        msg.textContent = 'Por favor, selecione o nível de urgência.';
        container.insertAdjacentElement('beforeend', msg);
        if (!firstError) firstError = container;
    }
    // ------- REMOVER INVALIDAÇAO DO FORMULÁRIO -------
    
    // Remove o 'invalid' e a mensagem de erro ao preencher campos de texto
    document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => {
        if (el.value.trim() !== '') {
        el.classList.remove('invalid');
        const erro = el.closest('.form-group')?.querySelector('.error-message');
        if (erro) erro.remove();
        }
    });
    });

    // Remove o 'invalid' ao selecionar tipo de auditoria
    document.getElementById('tipoAuditoriaInput')?.addEventListener('click', () => {
    const input = document.getElementById('tipoAuditoriaInput');
    if (input.value.trim() !== '') {
        input.classList.remove('invalid');
        const erro = input.closest('.form-group')?.querySelector('.error-message');
        if (erro) erro.remove();
    }
    });

    // Remove o 'invalid' ao marcar um material
    document.querySelectorAll('input[name="materials"]').forEach(cb => {
    cb.addEventListener('change', () => {
        const materiaisInput = document.getElementById('materialsSearchInput');
        if (document.querySelectorAll('input[name="materials"]:checked').length > 0) {
        materiaisInput.classList.remove('invalid');
        const erro = materiaisInput.closest('.materials-search')?.querySelector('.error-message');
        if (erro) erro.remove();
        }
    });
    });

    // Remove erro ao marcar urgência
    document.querySelectorAll('input[name="urgency"]').forEach(rb => {
    rb.addEventListener('change', () => {
        const erro = document.querySelector('.urgency-rating .error-message');
        if (erro) erro.remove();
    });
    });
    
    // Se algo inválido, foca e aborta
    if (!valid) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  
    // — Tudo ok! Chama a tua função de “save” ou simplesmente:
    saveAuditToLocalStorage();
    showSuccessToast('Auditoria criada com sucesso!');
  
    // (se quiseres dar um delay antes de reset/redirect, como já tinhas)
  });

// ------- FIM: CRIAÇÃO DA AUDITORIA -------
// Função para salvar a auditoria no localStorage
function saveAuditToLocalStorage() {
    // Obter valores do formulário
    const nome = document.querySelector('.form-group:nth-child(1) input').value;
    const descricao = document.querySelector('textarea.description-area').value;
    const duracao = document.getElementById('durationInput').value;
    const data = document.getElementById('dateInput').value;
    const morada = document.getElementById('inputMorada').value;
    const nivelUrgencia = document.querySelector('input[name="urgency"]:checked')?.value || '';

    // Obter materiais selecionados
    const materiaisSelecionados = Array.from(document.querySelectorAll('input[name="materials"]:checked')).map(
        checkbox => checkbox.value
    );

        // Obter o tipo da ocorrência correspondente
    let tipoOcorrencia = document.getElementById('tipoAuditoriaInput')?.value || '';
    const ocorrenciaID = parseInt(localStorage.getItem('occurrenceForAudit'), 10);
    if (ocorrenciaID) {
        const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
        const ocorrencia = ocorrencias.find(o => o.id === ocorrenciaID);
        if (ocorrencia && ocorrencia.tipo) {
            tipoOcorrencia = ocorrencia.tipo;
        }
    }

    // Criar objeto da auditoria
    const auditoria = {
        id:  getAndIncrementNextAuditId(), 
        nome: nome,
        descricao: descricao,
        duracao: duracao,
        data: data,
        morada: morada,
        nivelUrgencia: nivelUrgencia,
        materiais: materiaisSelecionados,
        peritos: selectedPeritosArray,
        dataCriacao: new Date().toISOString(),
        tipoOcorrencia: tipoOcorrencia,
        estado: selectedPeritosArray.length > 0 ? "Em Progresso" : "Não Iniciada"
    };

    // Obter auditorias existentes do localStorage ou criar array vazio
    const auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];

    // Adicionar nova auditoria
    auditorias.push(auditoria);

    // Salvar auditoria no localStorage
    localStorage.setItem('auditorias', JSON.stringify(auditorias));


    // Atualizar o status da ocorrência para "Aceite"
    const occurrenceId = parseInt(localStorage.getItem('occurrenceForAudit'), 10);
    if (occurrenceId) {
        const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
        console.log("ocorrencia",ocorrencias); // Debug: Verificar o conteúdo de ocorrencias
        const ocorrenciaIndex = ocorrencias.findIndex(o => o.id === occurrenceId);
        console.log("ocorrenciaIndex",ocorrenciaIndex); // Debug: Verificar o índice da ocorrência encontrada

        if (ocorrenciaIndex !== -1) {
            ocorrencias[ocorrenciaIndex].estado = 'Aceite';
            ocorrencias[ocorrenciaIndex].auditId = auditoria.id;
            ocorrencias[ocorrenciaIndex].lastUpdated = new Date().toISOString();

            localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));
            localStorage.removeItem('occurrenceForAudit');
        }
    }
}

// Atualizar a função showSuccessToast para mostrar mensagem mais específica
function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">✓</div>
            <div class="toast-message">
                ${message}<br>
                <small>Ocorrência atualizada para "Aceite"</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remover toast e redirecionar após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
            // Redirecionar para ocorrencia.html
            
            window.location.href = '../ListaAuditorias/ListaAuditorias.html'; 
        }, 300);
    }, 3000);
}
