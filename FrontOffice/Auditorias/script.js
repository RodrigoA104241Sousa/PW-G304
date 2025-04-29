// Menu toggle
const menuIcon = document.querySelector('.menu-icon');
const sidebar = document.getElementById('sidebar');

menuIcon.addEventListener('click', () => {
  console.log('Menu icon clicked'); // Adicionado para depuração
  sidebar.classList.toggle('open');
});

document.addEventListener('DOMContentLoaded', () => {
  // Botão "Saber Mais" - Redirecionar para a seção "Sobre Nós"
  const saberMaisBtn = document.querySelector('.saber-mais');
  if (saberMaisBtn) {
    saberMaisBtn.addEventListener('click', () => {
      const sobreNosSection = document.getElementById('sobre-nos');
      if (sobreNosSection) {
        sobreNosSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Botão de Login no rodapé - Redirecionar para a página de login
  const footerLoginBtn = document.querySelector('.footer-login .login-btn');
  if (footerLoginBtn) {
    footerLoginBtn.addEventListener('click', () => {
      window.location.href = "../../BackOffice/Login/LoginEyesEverywhere.html";
    });
  }

  const islogged = localStorage.getItem('islogged') === 'true';
  const user = JSON.parse(localStorage.getItem('user'));
  const loginContainer = document.getElementById('loginContainer'); // Container do botão de login
  const logoutButton = document.getElementById('logoutButton'); // Botão de logout

  // Substituir o botão de login pela foto de perfil, se o usuário estiver logado
  if (islogged && user) {
    loginContainer.innerHTML = `
      <div class="user-profile">
        <img src="${user.picture}" alt="Foto de Perfil" class="profile-picture" />
        <span class="user-name">${user.name}</span>
      </div>
    `;
  }

  // Adicionar evento ao botão de logout
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      // Definir islogged como falso e remover o usuário do localStorage
      localStorage.setItem('islogged', 'false');
      localStorage.removeItem('user');

      // Substituir a foto de perfil pelo botão de login
      loginContainer.innerHTML = `
        <a href="../../BackOffice/Login/LoginEyesEverywhere.html">
          <button class="sign-in">Login</button>
        </a>
      `;
    });
  }

  // Lista de opções a bloquear
  const linksBloquear = [
    "Perfil",
    "Criar ocorrência",
    "Minhas Ocorrências",
    "Ver Ocorrências",
    "Notificações",
    "Auditorias"
  ];

  // Selecionar todos os itens da sidebar
  document.querySelectorAll('.sidebar-list li').forEach(item => {
    const label = item.querySelector('.label'); // Selecionar o texto do item
    if (label && linksBloquear.includes(label.textContent.trim())) {
      if (!islogged) {
        // Bloquear o item se não estiver logado
        item.style.pointerEvents = "none"; // Impede o clique
        item.style.opacity = "0.5";        // Visualmente desativado
      } else {
        // Restaurar o item se estiver logado
        item.style.pointerEvents = "auto";
        item.style.opacity = "1";
      }
    }
  });

  // Funcionalidade do Modal "Sobre Nós"
  const verMaisBtn = document.querySelector('.card-sobre button');
  const modal = document.getElementById('sobreNosModal');
  const closeBtn = document.querySelector('.close-btn');

  // Abrir o modal quando o botão "Ver Mais" for clicado
  if (verMaisBtn) {
    verMaisBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });
  }

  // Fechar o modal quando o botão de fechar for clicado
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  // Fechar o modal ao clicar fora dele
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Selecionando todos os cards da área de atuação
  const cards = document.querySelectorAll('.area-atuacao .card');
  
  // Adicionando event listeners para cada card
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      // Determinando qual modal abrir com base no índice do card
      let modalId;
      switch(index) {
        case 0:
          modalId = 'modalInfraestruturas';
          break;
        case 1:
          modalId = 'modalMonitorizacao';
          break;
        case 2:
          modalId = 'modalAuditorias';
          break;
      }
      
      // Abrindo o modal correspondente
      if (modalId) {
        document.getElementById(modalId).style.display = 'block';
      }
    });
  });
  
  // Adicionar funcionalidade de fechar para todos os botões de fechar nos modais
  document.querySelectorAll('.area-modal .close-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.modal').style.display = 'none';
    });
  });
  
  // Fechar modais ao clicar fora deles
  window.addEventListener('click', function(event) {
    document.querySelectorAll('.area-modal').forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
    // Botão Ver Mais do Sobre Nós
    const verMaisBtn = document.querySelector('.card-sobre button');
    const sobreNosModal = document.getElementById('sobreNosModal');
    
    if (verMaisBtn) {
        verMaisBtn.addEventListener('click', () => {
            sobreNosModal.style.display = 'block';
        });
    }

    // Botões das Áreas de Atuação
    const areaCards = document.querySelectorAll('.area-atuacao .card');
    areaCards.forEach((card, index) => {
        const verMaisBtn = card.querySelector('button');
        if (verMaisBtn) {
            verMaisBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const modalId = getModalId(index);
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.style.display = 'block';
                }
            });
        }
    });

    // Fechar modais
    const closeBtns = document.querySelectorAll('.close-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Fechar modal quando clicar fora
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});

function getModalId(index) {
    switch(index) {
        case 0: return 'modalInfraestruturas';
        case 1: return 'modalMonitorizacao';
        case 2: return 'modalAuditorias';
        default: return null;
    }
}