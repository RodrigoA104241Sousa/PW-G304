document.getElementById("googleLoginBtn").addEventListener("click", function(event) {
  event.preventDefault();
  
  // Parâmetros para autenticação OAuth2
  const clientId = "638875266220-lc2qlih7bdm9igt63ti78vsjfb12qiub.apps.googleusercontent.com";
  const redirectUri = "http://localhost:3000/BackOffice/Login/LoginEyesEverywhere.html";
 // URL fixa
  const scope = "email profile openid";
  const responseType = "token";
  const prompt = "consent"; // Adiciona prompt para sempre pedir consentimento
  
  // Construa a URL de autenticação
  const authUrl = `https://accounts.google.com/o/oauth2/auth?`+
    `client_id=${encodeURIComponent(clientId)}&`+
    `redirect_uri=${encodeURIComponent(redirectUri)}&`+
    `scope=${encodeURIComponent(scope)}&`+
    `response_type=${responseType}&`+
    `prompt=${prompt}`;
  
  // Redirecione para a página de login do Google
  window.location.href = authUrl;
});

// Função para extrair parâmetros da URL após redirecionamento
function getHashParams() {
  const hash = window.location.hash.substr(1);
  const params = {};
  hash.split('&').forEach(function(pair) {
    const parts = pair.split('=');
    if (parts.length === 2) {
      params[parts[0]] = decodeURIComponent(parts[1]);
    }
  });
  return params;
}

// Função para verificar se é um admin
function isAdmin(email) {
  const adminEmails = [
    'fmachado999888@gmail.com',
    'rodrigoamsousa1922@gmail.com',
    'antoniocorreiabusiness@gmail.com',
    'marianapa89.56@gmail.com'
  ];
  return adminEmails.includes(email);
}

// Função para obter informações do usuário
async function getUserInfo(accessToken) {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao obter informações do usuário:', error);
    return null;
  }
}

// Verifique se estamos retornando de uma autenticação
window.addEventListener('load', async function() {
  const params = getHashParams();
  if (params.access_token) {
    console.log("Token de acesso:", params.access_token);
    
    // Obter informações do usuário
    const userInfo = await getUserInfo(params.access_token);
    
    if (userInfo) {
      if (isAdmin(userInfo.email)) {
        // Redirecionar para página de admin
        window.location.href = '../Peritos/peritos.html';
      } else {
        // Redirecionar para página de usuário normal
        localStorage.setItem('userfront', JSON.stringify(userInfo));
        islogged = true;
        localStorage.setItem('islogged', islogged);
        window.location.href = '../../FrontOffice/Auditorias/index.html';
       
      }
    }
  }
});