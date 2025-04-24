const menuIcon = document.querySelector('.menu-icon');
const sidebar = document.getElementById('sidebar');

menuIcon.addEventListener('click', () => {
  console.log('Menu icon clicked'); // Adicionado para depuração
  sidebar.classList.toggle('open');
});