const express = require('express');
const path = require('path');
const app = express();

// Redirecionar '/' para '/front'
app.get('/', (req, res) => {
  res.redirect('/FrontOffice/Auditorias/index.html');
});



// Servir FrontOffice (HTML/CSS/JS puro)
app.use('/FrontOffice', express.static(path.join(__dirname, 'FrontOffice')));

// Servir BackOffice (se tiveres)
app.use('/BackOffice', express.static(path.join(__dirname, 'BackOffice')));

// Servir App Vue (build)
app.use('/app', express.static(path.join(__dirname, 'APP_PW', 'dist')));

// Fallback para Vue Router (SPA)
app.get('/app/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'APP_PW', 'dist', 'index.html'));
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr em: http://localhost:${PORT}`);
});
