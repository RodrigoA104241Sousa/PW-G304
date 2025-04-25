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

// Função para converter ficheiro em Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Ao submeter o formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Converter imagens para Base64
  const imagensBase64 = await Promise.all(
    Array.from(uploadInput.files).map(file => fileToBase64(file))
  );

  // Ir buscar ocorrências já guardadas
  const ocorrenciasGuardadas = JSON.parse(localStorage.getItem('ocorrencias')) || [];

  // Calcular o novo ID de forma segura
  let novoId = 1;
  if (ocorrenciasGuardadas.length > 0 && ocorrenciasGuardadas[ocorrenciasGuardadas.length - 1].id != null) {
    novoId = ocorrenciasGuardadas[ocorrenciasGuardadas.length - 1].id + 1;
  }

  // Criar objeto ocorrência com ID
  const ocorrencia = {
    id: novoId,
    tipo: document.getElementById('tipo-ocorrencia').value,
    email: document.getElementById('email').value,
    morada: document.getElementById('morada').value,
    codigoPostal: document.getElementById('codigo-postal').value,
    descricao: document.getElementById('descricao').value,
    imagens: imagensBase64,
    estado: "Em espera"
  };

  // Adicionar e guardar no localStorage
  ocorrenciasGuardadas.push(ocorrencia);
  localStorage.setItem('ocorrencias', JSON.stringify(ocorrenciasGuardadas));

  alert("Ocorrência registada com sucesso!");
  form.reset();
});
