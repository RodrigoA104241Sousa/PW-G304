const container = document.getElementById('lista-ocorrencias');
const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
const ocorrenciasPorPagina = 6;
let paginaAtual = 1;

function mostrarOcorrencias(pagina) {
  container.innerHTML = '';
  const inicio = (pagina - 1) * ocorrenciasPorPagina;
  const fim = inicio + ocorrenciasPorPagina;

  let user = localStorage.getItem('userfront');
  if (user) {
    user = JSON.parse(user);
  }
  
  // Filtrar apenas as ocorrências do usuário atual
  const minhasOcorrencias = ocorrencias.filter(ocorrencia => ocorrencia.userid === user.id);
  console.log(minhasOcorrencias);
  const paginaOcorrencias = minhasOcorrencias.slice(inicio, fim);

  

  // Remover a condição if que estava aqui e mostrar as ocorrências filtradas
  paginaOcorrencias.forEach((ocorrencia) => {
    const tipoParaImagem = {
      "Buraco na estrada": "../Tipo de Ocorr/passeio2.png",
      "Passeio danificado": "../Tipo de Ocorr/passei.png",
      "Falta de sinalização": "../Tipo de Ocorr/passeio1.png",
      "Iluminação pública": "../Tipo de Ocorr/lampada.png"
    };

    const imgSrc = ocorrencia.imagens && ocorrencia.imagens.length > 0
      ? ocorrencia.imagens[0]
      : (tipoParaImagem[ocorrencia.tipo] || 'placeholder.png');

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${imgSrc}" alt="Ocorrência ${ocorrencia.id}">
      <div class="info">
        <h2>${ocorrencia.tipo}</h2>
        <button class="ler-mais">Ler Mais</button>
      </div>
    `;

    const botao = card.querySelector(".ler-mais");
    botao.addEventListener("click", () => {
      verOcorrencia(ocorrencia.id);
    });

    container.appendChild(card);
  });

  // Preencher espaço com cards vazios
  const restantes = ocorrenciasPorPagina - paginaOcorrencias.length;
  for (let i = 0; i < restantes; i++) {
    const vazio = document.createElement('div');
    vazio.className = 'card vazio';
    container.appendChild(vazio);
  }
}

function verOcorrencia(id) {
  window.location.href = `../Minhas Ocorr 2/index.html?id=${id}`; // ajusta se estiver noutra pasta
}

function construirPaginacao() {
  const totalPaginas = Math.ceil(ocorrencias.length / ocorrenciasPorPagina);
  const footer = document.querySelector('.paginacao');
  footer.innerHTML = '';

  const btnAnterior = document.createElement('button');
  btnAnterior.innerText = '←';
  btnAnterior.disabled = paginaAtual === 1;
  btnAnterior.onclick = () => {
    paginaAtual--;
    mostrarOcorrencias(paginaAtual);
    construirPaginacao();
  };
  footer.appendChild(btnAnterior);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    if (i === paginaAtual) btn.classList.add('active');
    btn.onclick = () => {
      paginaAtual = i;
      mostrarOcorrencias(paginaAtual);
      construirPaginacao();
    };
    footer.appendChild(btn);
  }

  const btnProximo = document.createElement('button');
  btnProximo.innerText = '→';
  btnProximo.disabled = paginaAtual === totalPaginas;
  btnProximo.onclick = () => {
    paginaAtual++;
    mostrarOcorrencias(paginaAtual);
    construirPaginacao();
  };
  footer.appendChild(btnProximo);
}

mostrarOcorrencias(paginaAtual);
construirPaginacao();
