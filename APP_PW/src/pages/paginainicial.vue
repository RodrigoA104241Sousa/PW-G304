<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const clientId = '638875266220-lc2qlih7bdm9igt63ti78vsjfb12qiub.apps.googleusercontent.com';

let tokenClient;

async function getUserInfo(token) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await res.json();
  console.log('User info:', data);
  
  localStorage.setItem('user', JSON.stringify(data));
  
}

onMounted(() => {
  console.log('Componente montado');
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'email profile openid',
    callback: async (tokenResponse) => {
      console.log('Token recebido:', tokenResponse);
      await getUserInfo(tokenResponse.access_token);
      router.push('/home'); // <-- MOVE para aqui
      console.log('Redirecionando para home...');
    }
  });
});


function loginWithGoogle() {
  console.log('Iniciando login com Google...');
  if (tokenClient) {
    tokenClient.requestAccessToken(); // NÃO faças router.push aqui!
  } else {
    console.error('Token client não inicializado!');
  }
}

</script>

<template>
  <div class="h-screen relative bg-[url('/imagens/PaginaInicial.jpg')] bg-cover bg-center bg-no-repeat p-10">
    <div class="absolute inset-0 bg-black opacity-20 z-0"></div>

    <div class="relative z-10 flex flex-col items-center justify-center">
      <p class="text-4xl mt-35 font-bold font-alike">
        <span class="text-white">Eyes</span>
        <span class="text-[#03045E]">EveryWhere</span>
      </p>

      <img class="mt-10 w-20 h-20 brightness-75" src="/icons/eyeseverywhereicon.png" />

      <p class="text-[#90E0EF] mt-10">Visão em todos os cantos de Portugal</p>
      <p class="text-white text-xs whitespace-nowrap mt-2">
        Junte-se a nós e contribua para um país mais seguro e eficiente!
      </p>

      <!-- Botão personalizado -->
      <button
        @click="loginWithGoogle"
        class="mt-30 flex items-center space-x-8 bg-[#03045E] text-white w-full h-13 px-5  rounded-lg"
      >
        <img src="/icons/googleicon.png" alt="Google" class="w-8 h-8" />
        <span class="font-semibold">Continuar com o Google</span>
        
      </button>

    </div>
  </div>
</template>
