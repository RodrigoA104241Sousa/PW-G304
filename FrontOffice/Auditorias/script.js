const menuIcon = document.querySelector('.menu-icon');
const sidebar = document.getElementById('sidebar');

menuIcon.addEventListener('click', () => {
  console.log('Menu icon clicked'); // Adicionado para depuração
  sidebar.classList.toggle('open');
});

document.addEventListener('DOMContentLoaded', () => {
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
        <a href="../../backofficefrancisco/LoginEyesEverywhere.html">
          <button class="sign-in">Login</button>
        </a>
      `;
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const islogged = localStorage.getItem('islogged') === 'true';

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
});