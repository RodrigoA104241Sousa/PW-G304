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
            // Create new expert object
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
                postalCode: codigoPostalInput.value
            };

            // Get existing experts from localStorage or initialize empty array
            const experts = JSON.parse(localStorage.getItem('expertsData')) || [];

            // Add new expert to array
            experts.push(newExpert);

            // Save updated array back to localStorage
            localStorage.setItem('expertsData', JSON.stringify(experts));

            alert('Perito registado com sucesso!');
            
            // Redirect back to peritos page
            window.location.href = 'peritos.html';
        }
    });

    // Add this to your existing JavaScript
    document.querySelector('.back-button').addEventListener('click', () => {
        window.history.back();
    });
});

// Script para upload de foto
document.addEventListener('DOMContentLoaded', function() {
    const photoUpload = document.querySelector('.photo-upload');
    const fileInput = document.querySelector('#file-input');

    console.log('photoUpload:', photoUpload); // Debug
    console.log('fileInput:', fileInput); // Debug

    if (photoUpload && fileInput) {
        photoUpload.addEventListener('click', function(event) {
            console.log('Photo upload clicked'); // Debug
            event.preventDefault();
            fileInput.click();
        });

        fileInput.addEventListener('change', function(event) {
            console.log('File selected'); // Debug
            const file = event.target.files[0];
            if (file) {
                console.log('File type:', file.type); // Debug
                // Verificar se é uma imagem
                if (!file.type.startsWith('image/')) {
                    alert('Por favor, selecione apenas arquivos de imagem.');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    console.log('File loaded'); // Debug
                    const image = document.createElement('img');
                    image.src = e.target.result;
                    image.classList.add('loaded-image');
                    
                    // Limpar conteúdo anterior e adicionar nova imagem
                    photoUpload.innerHTML = '';
                    photoUpload.appendChild(image);
                };
                reader.readAsDataURL(file);
            }
        });
    } else {
        console.error('Elements not found'); // Debug
    }
});

// Script para upload de documentos
document.getElementById('pdf-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.type !== "application/pdf") {
            alert("Por favor, selecione um arquivo PDF.");
            this.value = "";
        } else {
            document.getElementById('file-name').textContent = "Arquivo selecionado: " + file.name;
        }
    }
});