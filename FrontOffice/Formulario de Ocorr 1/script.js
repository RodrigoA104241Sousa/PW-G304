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

const form = document.querySelector('.formulario');
const uploadInput = document.getElementById('upload');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const ocorrencia = {
    tipo: document.getElementById('tipo-ocorrencia').value,
    email: document.getElementById('email').value,
    morada: document.getElementById('morada').value,
    codigoPostal: document.getElementById('codigo-postal').value,
    descricao: document.getElementById('descricao').value,
    imagens: Array.from(uploadInput.files).map(file => file.name) // apenas nomes
  };

  // Guardar no localStorage
  const ocorrenciasGuardadas = JSON.parse(localStorage.getItem('ocorrencias')) || [];
  ocorrenciasGuardadas.push(ocorrencia);
  localStorage.setItem('ocorrencias', JSON.stringify(ocorrenciasGuardadas));

  alert("Ocorrência registada com sucesso!");
  form.reset();
});
