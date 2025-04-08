<script setup>
import Header from '../components/header.vue';
import { useRouter } from 'vue-router' // <- tens de importar isto!

const router = useRouter()

function goAuditoriaResolvida() {
    router.push('/auditoriasInfo')
    }
</script>

<template>
    <div class="h-screen bg-[#E0F1FE]">
      <Header title="Documentação" backRoute="/auditoriasInfo" />
      <div class="flex flex-col items-center px-10">
        <p class="text-[#695F5F] text-xl font-semibold mb-5">Descrição</p>
        <textarea 
          class="w-full h-36 bg-[#03045E]/5 border-2 border-[#03045E] rounded-xl px-4 py-2 placeholder:font-semibold text-left align-top resize-none"
          placeholder="Descreva aqui a sua ocorrência..."
        ></textarea>
      </div>
      <div class="p-6 mt-6 flex flex-col items-center">
        <button class="bg-[#1865B8]/80 text-white w-full h-12 rounded-lg">Upload de imagens</button>
      </div>
    </div>
  </template>
  