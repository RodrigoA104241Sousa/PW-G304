// Declarações de variáveis para armazenar a foto e os documentos
let selectedProfilePhoto = null;
let selectedFiles = [];

// Funções para controlar o dropdown de especialidades
function toggleDropdown() {
    var dropdown = document.getElementById("optionsDropdown");
    if (dropdown.style.display === "none" || dropdown.style.display === "") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
    }
}

// Fechar o dropdown se clicar fora dele
window.onclick = function(event) {
    var dropdown = document.getElementById("optionsDropdown");
    if (!event.target.matches('#dropdownIcon') && !event.target.matches('#especialidadeSearch')) {
        dropdown.style.display = "none";
    }
}

// Função para selecionar uma opção e fechar o dropdown
function selectOption(option) {
    document.getElementById("especialidadeSearch").value = option;
    document.getElementById("optionsDropdown").style.display = "none"; // Fecha o dropdown
}

// Função para mostrar toast notification
function showToast(message) {
    // Remover qualquer toast existente
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Criar novo toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    // Adicionar o toast ao corpo do documento
    document.body.appendChild(toast);
    
    // Remover o toast após 3 segundos
    setTimeout(() => {
        toast.remove();
        // Redirecionar após o toast desaparecer
        window.location.href = '../peritos.html';
    }, 3000);
}

// Script para validação e uploads
document.addEventListener("DOMContentLoaded", function() {
    const telefoneInput = document.getElementById('telefones');
    const emailInput = document.getElementById('email');
    const registerButton = document.querySelector('.register-btn');
    const codigoPostalInput = document.querySelector('input[placeholder="XXXX-XXX"]');
    const dataNascimentoInput = document.querySelector('input[placeholder="DD/MM/YYYY"]');
    const nomeInput = document.querySelector('input[placeholder="Insira nome completo"]');
    const moradaInput = document.querySelector('input[placeholder="Insira morada"]');
    const especialidadeInput = document.getElementById('especialidadeSearch');
    const uploadBtn = document.querySelector('.upload-btn');

    // Prevenir comportamento padrão do botão de upload para não submeter o formulário
    uploadBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Isso impede o comportamento padrão do botão
        document.getElementById('pdf-upload').click();
    });

    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    function validatePhone(phone) {
        const phonePattern = /^(91|92|93|96)\d{7}$/;
        return phonePattern.test(phone);
    }

    function validatePostalCode(postalCode) {
        const postalCodePattern = /^\d{4}-\d{3}$/;
        return postalCodePattern.test(postalCode);
    }

    function validateBirthDate(date) {
        const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        return datePattern.test(date);
    }

    function validateRequiredField(input, errorMessage) {
        if (input.value.trim() === "") {
            input.classList.add('error');
            let error = input.parentNode.querySelector('.error-message');
            if (!error) {
                error = document.createElement('span');
                error.classList.add('error-message');
                error.textContent = errorMessage;
                input.parentNode.appendChild(error);
            }
            error.style.display = 'block';
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    function clearError(input) {
        input.classList.remove('error');
        const errorMsg = input.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.style.display = 'none';
        }
    }

    registerButton.addEventListener('click', function(event) {
        event.preventDefault(); // Previne a submissão padrão do formulário
        
        const email = emailInput.value;
        const phone = telefoneInput.value;
        const postalCode = codigoPostalInput.value;
        const birthDate = dataNascimentoInput.value;

        let isValid = true;

        if (!validateRequiredField(nomeInput, "Campo obrigatório")) isValid = false;
        if (!validateRequiredField(moradaInput, "Campo obrigatório")) isValid = false;
        if (!validateRequiredField(especialidadeInput, "Campo obrigatório")) isValid = false;

        if (!validateEmail(email)) {
            isValid = false;
            emailInput.classList.add('error');
            let error = emailInput.parentNode.querySelector('.error-message');
            if (!error) {
                error = document.createElement('span');
                error.classList.add('error-message');
                error.textContent = "Email inválido. Por favor, insira um email válido.";
                emailInput.parentNode.appendChild(error);
            }
            error.style.display = 'block';
        } else {
            clearError(emailInput);
        }

        if (!validatePhone(phone)) {
            isValid = false;
            telefoneInput.classList.add('error');
            let error = telefoneInput.parentNode.querySelector('.error-message');
            if (!error) {
                error = document.createElement('span');
                error.classList.add('error-message');
                error.textContent = "Telefone inválido. O número deve começar com 91, 92, 93 ou 96.";
                telefoneInput.parentNode.appendChild(error);
            }
            error.style.display = 'block';
        } else {
            clearError(telefoneInput);
        }

        if (!validatePostalCode(postalCode)) {
            isValid = false;
            codigoPostalInput.classList.add('error');
            let error = codigoPostalInput.parentNode.querySelector('.error-message');
            if (!error) {
                error = document.createElement('span');
                error.classList.add('error-message');
                error.textContent = "Código postal inválido. O formato correto é XXXX-XXX.";
                codigoPostalInput.parentNode.appendChild(error);
            }
            error.style.display = 'block';
        } else {
            clearError(codigoPostalInput);
        }

        if (!validateBirthDate(birthDate)) {
            isValid = false;
            dataNascimentoInput.classList.add('error');
            let error = dataNascimentoInput.parentNode.querySelector('.error-message');
            if (!error) {
                error = document.createElement('span');
                error.classList.add('error-message');
                error.textContent = "Data de nascimento inválida. O formato correto é DD/MM/YYYY.";
                dataNascimentoInput.parentNode.appendChild(error);
            }
            error.style.display = 'block';
        } else {
            clearError(dataNascimentoInput);
        }

        if (isValid) {
            // Criar objeto com os dados do perito
            const newExpert = {
                id: Date.now(), // Use timestamp as unique ID
                name: nomeInput.value,
                email: emailInput.value,
                startDate: new Date().toLocaleDateString('pt-PT'),
                specialty: especialidadeInput.value,
                status: 'Disponível', // Default status for new expert
                phone: telefoneInput.value,
                birthDate: dataNascimentoInput.value,
                address: moradaInput.value,
                postalCode: codigoPostalInput.value,
                profilePhoto: selectedProfilePhoto, // Adiciona a foto de perfil
                documents: [] // Array para armazenar os documentos
            };
            
            // Adicionar documentos uploaded ao novo perito
            for (let i = 0; i < selectedFiles.length; i++) {
                newExpert.documents.push({
                    name: selectedFiles[i].name,
                    data: selectedFiles[i].data // Base64 string do arquivo
                });
            }

            // Get existing experts from localStorage or initialize empty array
            const experts = JSON.parse(localStorage.getItem('expertsData')) || [];

            // Add new expert to array
            experts.push(newExpert);

            // Save updated array back to localStorage
            localStorage.setItem('expertsData', JSON.stringify(experts));

            // Substituição do alert pelo toast
            showToast('Perito registado com sucesso!');
            // O redirecionamento agora está dentro da função showToast
        }
    });

    // Add this to your existing JavaScript
    document.querySelector('.back-button').addEventListener('click', () => {
        window.history.back();
    });
});

//upload e remoção de foto 
document.addEventListener("DOMContentLoaded", function() {
    const photoUploadContainer = document.querySelector('.photo-upload');
    
    // Inicia o upload de foto 
    initPhotoUpload();
    
    function initPhotoUpload() {
        // Garantir que exista o evento de clique para a área de upload
        photoUploadContainer.onclick = function(e) {
            // Ignorar clique quando o clique for no botão de remover
            if (e.target.classList.contains('remove-photo-btn')) {
                return;
            }
            
            // Se já tem imagem carregada, não fazer nada ao clicar no container
            // (exceto se clicar diretamente na imagem, que é tratado separadamente)
            const hasLoadedImage = photoUploadContainer.querySelector('.loaded-image');
            if (hasLoadedImage && e.target !== hasLoadedImage) {
                return;
            }
            
            // Abrir arquivos
            const fileInput = document.querySelector('#file-input');
            if (fileInput) {
                fileInput.click();
            }
        };
        
        // Garantir que o input de arquivo tenha o evento change
        const fileInput = document.querySelector('#file-input');
        if (fileInput) {
            // Remover evento antigo para evitar duplicação
            fileInput.onchange = null;
            
            // Adicionar novo evento
            fileInput.onchange = handleFileSelected;
        }
    }
    
    // Função para lidar com a seleção de arquivo de foto
    function handleFileSelected(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Armazenar a foto para uso posterior
                selectedProfilePhoto = e.target.result;
                
                // Limpar o conteúdo atual
                photoUploadContainer.innerHTML = '';
                
                // Criar e adicionar a imagem
                const image = document.createElement('img');
                image.src = e.target.result;
                image.classList.add('loaded-image');
                photoUploadContainer.appendChild(image);
                
                // Adicionar o botão de remover
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.classList.add('remove-photo-btn');
                removeBtn.textContent = '×';
                removeBtn.title = 'Remover foto';
                photoUploadContainer.appendChild(removeBtn);
                
                // Adicionar novamente o input file (oculto)
                const newInput = document.createElement('input');
                newInput.type = 'file';
                newInput.id = 'file-input';
                newInput.accept = 'image/*';
                newInput.style.display = 'none';
                photoUploadContainer.appendChild(newInput);
                
                // Garantir que o novo input file tenha o evento change
                newInput.onchange = handleFileSelected;
                
                // Adicionar evento para o botão de remoção
                removeBtn.onclick = function(evt) {
                    evt.stopPropagation(); // Impedir clique no container
                    resetPhotoUpload(); // Restaurar estado inicial
                    selectedProfilePhoto = null; // Limpar a foto armazenada
                };
                
                // Adicionar evento para a imagem (permitir trocar ao clicar na imagem)
                image.onclick = function(evt) {
                    evt.stopPropagation();
                    const currentInput = photoUploadContainer.querySelector('#file-input');
                    if (currentInput) {
                        currentInput.click();
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Função para resetar o upload de foto para o estado inicial
    function resetPhotoUpload() {
        // Restaurar o HTML original do elemento
        photoUploadContainer.innerHTML = `
            <img src="camera.png" alt="Ícone de camera">
            <div class="photo-text">Insira Aqui a Fotografia</div>
            <input type="file" id="file-input" accept="image/*" style="display: none;">
        `;
        
        // Reinicializar os eventos
        initPhotoUpload();
    }
});

// Script para upload de documentos
document.addEventListener("DOMContentLoaded", function() {
    const uploadBtn = document.querySelector('.upload-btn');
    const fileInput = document.getElementById('pdf-upload');
    const filesContainer = document.getElementById('files-container');
    
    // Clicar no botão de upload ativa o input file
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Quando arquivos são selecionados
    fileInput.addEventListener('change', function(event) {
        const newFiles = Array.from(event.target.files);
        
        // Valida se são PDFs
        for (const file of newFiles) {
            if (file.type !== "application/pdf") {
                alert("Por favor, selecione apenas arquivos PDF.");
                return;
            }
            
            // Converter o arquivo para Base64
            const reader = new FileReader();
            reader.onload = function(e) {
                // Adiciona o arquivo ao array se for válido, incluindo seu conteúdo Base64
                selectedFiles.push({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: e.target.result // Dados Base64
                });
                
                // Atualiza a exibição dos arquivos
                updateFilesDisplay();
            };
            reader.readAsDataURL(file);
        }
        
        // Limpa o input para permitir selecionar os mesmos arquivos novamente se necessário
        this.value = "";
    });
});

// Função para atualizar a exibição dos arquivos
function updateFilesDisplay() {
    const filesContainer = document.getElementById('files-container');
    // Limpa o container
    filesContainer.innerHTML = '';
    
    // Adiciona cada arquivo à lista
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileName = document.createElement('span');
        fileName.className = 'file-name';
        fileName.textContent = file.name;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '&times;'; // × símbolo
        removeBtn.setAttribute('data-index', index);
        removeBtn.addEventListener('click', function() {
            const fileIndex = parseInt(this.getAttribute('data-index'));
            removeFile(fileIndex);
        });
        
        fileItem.appendChild(fileName);
        fileItem.appendChild(removeBtn);
        filesContainer.appendChild(fileItem);
    });
}

// Função para remover um arquivo
function removeFile(index) {
    // Remove o arquivo do array
    selectedFiles.splice(index, 1);
    // Atualiza a exibição
    updateFilesDisplay();
}

document.addEventListener("DOMContentLoaded", function() {
    // Selecionar os elementos corretos
    const dateInput = document.querySelector('input[placeholder="DD/MM/YYYY"]');
    const calendarIcon = document.querySelector('img[alt="Ícone de data"]');
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

    // Verificar se os elementos principais existem
    if (!dateInput || !calendar) {
        console.error("Elementos essenciais do calendário não encontrados");
        return;
    }

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
                selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), parseInt(this.textContent));
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
    if (calendarIcon) {
        calendarIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showCalendar();
        });
    }

    // Fechar o calendário ao clicar no X
    if (calendarClose) {
        calendarClose.addEventListener('click', function() {
            calendar.style.display = 'none';
        });
    }

    // Aplicar a data selecionada ao input
    if (calendarApply) {
        calendarApply.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir submissão do formulário
            
            if (selectedDate) {
                dateInput.value = formatDate(selectedDate);
                calendar.style.display = 'none';
            } else {
                alert('Por favor, selecione uma data no calendário.');
            }
        });
    }

    // Navegar para o mês anterior
    if (prevMonth) {
        prevMonth.addEventListener('click', function(e) {
            e.preventDefault();
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendar();
        });
    }

    // Navegar para o próximo mês
    if (nextMonth) {
        nextMonth.addEventListener('click', function(e) {
            e.preventDefault();
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendar();
        });
    }

    // Navegar para o ano anterior
    if (prevYear) {
        prevYear.addEventListener('click', function(e) {
            e.preventDefault();
            currentDate.setFullYear(currentDate.getFullYear() - 1);
            updateCalendar();
        });
    }

    // Navegar para o próximo ano
    if (nextYear) {
        nextYear.addEventListener('click', function(e) {
            e.preventDefault();
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            updateCalendar();
        });
    }

    // Ir para o dia atual
    if (todayBtn) {
        todayBtn.addEventListener('click', function(e) {
            e.preventDefault();
            currentDate = new Date();
            selectedDate = new Date();
            updateCalendar();
        });
    }

    // Atualizar o ano quando o input de ano mudar
    if (yearInput) {
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
    }

    // Fechar o calendário quando clicar fora dele
    window.addEventListener('click', function(event) {
        if (calendar.style.display === 'block' && 
            !event.target.closest('#calendar') && 
            !event.target.matches('input[placeholder="DD/MM/YYYY"]') && 
            !event.target.matches('img[alt="Ícone de data"]')) {
            calendar.style.display = 'none';
        }
    });

    // Inicializar o calendário
    updateCalendar();
});
    

    

