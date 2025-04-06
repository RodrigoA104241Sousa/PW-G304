<script setup>
import Navbar from '../components/navbar.vue';

let user = localStorage.getItem("user");
if (user) {
  user = JSON.parse(user);
} else {
  user = null;
}
</script>

<template>
  <div class="h-screen relative bg-[url('/imagens/PaginaInicial.jpg')] bg-cover bg-center bg-no-repeat p-10">
    <!-- Overlay escuro por cima do fundo -->
    <div class="absolute inset-0 bg-black opacity-20 z-0"></div>

    <div class="relative z-10 flex flex-col items-center justify-center">
      <Navbar />

      <p class="text-4xl mt-35 font-bold font-alike">
        <span class="text-white">Eyes</span>
        <span class="text-[#03045E]">EveryWhere</span>
      </p>

      <!-- Ícone escurecido -->
      <img class="mt-10 w-20 h-20 brightness-75" src="/icons/eyeseverywhereicon.png" />

      <p class="text-[#30335B] text-5xl font-pop font-semibold mt-8">Bem Vindo </p>
    </div>
  </div>
</template>
