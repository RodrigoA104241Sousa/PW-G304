// Preencher automaticamente o tipo vindo da página anterior
const params = new URLSearchParams(window.location.search);
const tipo = params.get("tipo");

if (tipo) {
  const select = document.getElementById("tipo-ocorrencia");
  for (const option of select.options) {
    if (option.value.toLowerCase() === tipo.toLowerCase()) {
      option.selected = true;
      break;
    }
  }
}

let user = localStorage.getItem('userfront');
if (user) {
  user = JSON.parse(user);
}

console.log(user);

const form = document.querySelector('.formulario');
const uploadInput = document.getElementById('upload');

// Função para converter ficheiro em Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Função para obter latitude e longitude com base na morada
async function getCoordinatesFromAddress(address) {
  const geocoder = new google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          latitude: location.lat(),
          longitude: location.lng()
        });
      } else {
        reject("Não foi possível obter as coordenadas para a morada fornecida.");
      }
    });
  });
}

const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const popupClose = document.getElementById('popup-close');

// Função para exibir o popup
function showPopup(message, isSuccess = true) {
  popupMessage.textContent = message;
  popupMessage.style.color = isSuccess ? '#155724' : '#721c24'; // Verde para sucesso, vermelho para erro
  popup.style.display = 'flex'; // Exibe o popup
}

// Fechar o popup ao clicar no botão
popupClose.addEventListener('click', () => {
  popup.style.display = 'none';
});

// Ao submeter o formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Verificar se todos os campos obrigatórios estão preenchidos
  if (
    !document.getElementById('tipo-ocorrencia').value ||
    !document.getElementById('email').value ||
    !document.getElementById('morada').value ||
    !document.getElementById('codigo-postal').value ||
    !document.getElementById('descricao').value
  ) {
    showPopup("Por favor, preencha todos os campos obrigatórios.", false);
    return;
  }

  // Obter a morada do formulário
  const morada = document.getElementById('morada').value;
  const geocoder = new google.maps.Geocoder();

  // Validação do distrito de Braga
  geocoder.geocode({ address: morada }, async function(results, status) {
    if (status === 'OK' && results.length > 0) {
      const addressComponents = results[0].address_components;
      let distrito = '';
      addressComponents.forEach(component => {
        if (component.types.includes('administrative_area_level_2')) {
          distrito = component.long_name;
        }
      });

      if (distrito.toLowerCase() !== 'braga') {
        showPopup('A ocorrência deve estar localizada no distrito de Braga.', false);
        return;
      }

      // Só aqui continua o registo!
      const imagensBase64 = await Promise.all(
        Array.from(uploadInput.files).map(file => fileToBase64(file))
      );

      if (!user || !user.id) {
        showPopup("Utilizador não autenticado. Por favor, faça login novamente.", false);
        return;
      }

      try {
        const { latitude, longitude } = await getCoordinatesFromAddress(morada);

        const ocorrenciasGuardadas = JSON.parse(localStorage.getItem('ocorrencias')) || [];

        let novoId = 1;
        if (ocorrenciasGuardadas.length > 0 && ocorrenciasGuardadas[ocorrenciasGuardadas.length - 1].id != null) {
          novoId = ocorrenciasGuardadas[ocorrenciasGuardadas.length - 1].id + 1;
        }

        const ocorrencia = {
          id: novoId,
          tipo: document.getElementById('tipo-ocorrencia').value,
          email: document.getElementById('email').value,
          morada: morada,
          codigoPostal: document.getElementById('codigo-postal').value,
          descricao: document.getElementById('descricao').value,
          imagens: imagensBase64,
          estado: "Em espera",
          data: new Date().toLocaleString('pt-PT'),
          userid: user.id,
          latitude: latitude,
          longitude: longitude
        };

        ocorrenciasGuardadas.push(ocorrencia);
        localStorage.setItem('ocorrencias', JSON.stringify(ocorrenciasGuardadas));

        showPopup("Ocorrência registada com sucesso!");

        setTimeout(() => {
          window.location.href = "../Auditorias/index.html";
        }, 2000);

        form.reset();
      } catch (error) {
        console.error(error);
        showPopup("Erro ao registar a ocorrência. Por favor, tente novamente.", false);
      }
    } else {
      showPopup('Morada inválida ou não encontrada.', false);
    }
  });
});