<script setup>
import { useRouter } from 'vue-router';
const props = defineProps({
  title: String,
  backRoute: {
    type: String,
    default: '/' // rota fallback
  }
});

const router = useRouter();
const goBack = () => router.push(props.backRoute);
</script>

<template>
  <div class="w-full flex items-center justify-between px-4 py-3">
    <!-- Botão de voltar -->
    <button @click="goBack" class="bg-[#03045E] p-2 rounded-lg shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Título -->
    <h1 class="text-[#03045E] text-2xl font-bold text-center flex-1">{{ title }}</h1>

    <!-- Ícone fixo à direita -->
    <img
      src="/icons/eyeseverywhereicon.png"
      alt="Logo"
      class="h-15 w-15 object-contain"
      />
  </div>
</template>
