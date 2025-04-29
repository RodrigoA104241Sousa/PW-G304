// Ler o ID da query string
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

// Ir buscar do localStorage
const ocorrencias = JSON.parse(localStorage.getItem("ocorrencias")) || [];
const ocorrencia = ocorrencias.find(o => o.id === id);
console.log(ocorrencia);

if (ocorrencia) {
  // Preencher os campos
  document.getElementById("tipo-ocorrencia").textContent = ocorrencia.tipo;
  document.getElementById("morada").textContent = ocorrencia.morada + ", ";
  document.getElementById("codigo-postal").textContent = ocorrencia.codigoPostal;
  document.getElementById("email").textContent = ocorrencia.email;
  document.getElementById("descricao").textContent = ocorrencia.descricao;
  document.getElementById("estado").textContent = ocorrencia.estado;

  // Preencher imagens
  const galeria = document.getElementById("galeria-imagens");
  ocorrencia.imagens.forEach((imgBase64, index) => {
    const div = document.createElement("div");
    div.className = "imagem-item";
    div.innerHTML = `
      <img src="${imgBase64}" alt="Imagem ${index + 1}">
      <p>Imagem ${index + 1}</p>
    `;
    galeria.appendChild(div);
  });

  // Inicializar o mapa
  window.initMap = function () {
    // Converte strings em números
    const lat = parseFloat(ocorrencia.latitude);
    const lng = parseFloat(ocorrencia.longitude);
    if (isNaN(lat) || isNaN(lng)) {
      console.error("Latitude ou longitude inválidas");
      return;
    }

    const pos = { lat, lng };
    const map = new google.maps.Map(document.getElementById("map"), {
      center: pos,
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
    });

    new google.maps.Marker({
      position: pos,
      map: map,
    });
  };
} else {
  // Se não encontrar a ocorrência
  alert("Ocorrência não encontrada.");
  window.location.href = "index.html"; // ou outro caminho
}

// Handle approve/reject buttons
    document.querySelector('.button-green').addEventListener('click', () => {
        // Store the current occurrence ID for use in criarauditoria.html
        localStorage.setItem('occurrenceForAudit', occurrenceId);
        // Redirect to criarauditoria.html
        window.location.href = '../../Auditoria/criarauditoria.html';
    });

    // Function to update status tag
function updateStatusTag(status) {
    const statusTag = document.querySelector('.tag-green');
    statusTag.textContent = status;
    
    // Remove existing status classes
    statusTag.classList.remove('status-aceite', 'status-espera', 'status-rejeitado');
    
    // Add appropriate class based on status
    switch(status) {
        case 'Aceite':
            statusTag.classList.add('status-aceite');
            break;
        case 'Em Espera':
            statusTag.classList.add('status-espera');
            break;
        case 'Não Aceite':
            statusTag.classList.add('status-rejeitado');
            break;
    }
}

// Atualizar o status inicial
const statusTag = document.querySelector('.tag-green');
if (statusTag) {
    statusTag.textContent = occurrence.estado || 'Em Espera';
    updateStatusTag(occurrence.estado || 'Em Espera');
}

// Atualizar o botão vermelho
document.querySelector('.button-red').addEventListener('click', () => {
    const occurrences = JSON.parse(localStorage.getItem('ocorrencias')) || [];
    const index = occurrences.findIndex(o => o.id === parseInt(occurrenceId));
    
    if (index !== -1) {
        occurrences[index].estado = 'Não Aceite';
        localStorage.setItem('ocorrencias', JSON.stringify(occurrences));
        
        // Atualizar a tag com a nova cor
        updateStatusTag('Não Aceite');
        
        setTimeout(() => {
            history.back();
        }, 500);
    }
});