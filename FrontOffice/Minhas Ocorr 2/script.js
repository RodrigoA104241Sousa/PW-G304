// Ler o ID da query string
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

// Ir buscar do localStorage
const ocorrencias = JSON.parse(localStorage.getItem("ocorrencias")) || [];
const ocorrencia = ocorrencias.find(o => o.id === id);

if (ocorrencia) {
  // Preencher os campos
  document.getElementById("tipo-ocorrencia").textContent = ocorrencia.tipo;
  document.getElementById("morada").textContent = ocorrencia.morada + ", ";
  document.getElementById("codigo-postal").textContent = ocorrencia.codigoPostal;
  document.getElementById("email").textContent = ocorrencia.email;
  document.getElementById("descricao").textContent = ocorrencia.descricao;

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
} else {
  // Se não encontrar a ocorrência
  alert("Ocorrência não encontrada.");
  window.location.href = "index.html"; // ou outro caminho
}
