<script setup>
import Header from '../components/header.vue';
import Navbar from '../components/navbar.vue';
import Upload from '../components/upload.vue';
import { useRouter, useRoute} from 'vue-router' // <- tens de importar isto!

const router = useRouter()
const route = useRoute()
const id = route.params.id
console.log("ID:", id)


</script>

<template>
    <div class="h-screen bg-[#E0F1FE]">
      <Header title="Documentação" :backRoute="`/auditoriasInfo/${id}`"/>
      <Navbar/>
      <div class="flex flex-col items-center px-10">
        <p class="text-[#695F5F] text-xl font-semibold mb-5">Descrição</p>
        <textarea 
          class="w-full h-36 bg-[#03045E]/5 border-2 border-[#03045E] rounded-xl px-4 py-2 placeholder:font-semibold text-left align-top resize-none"
          placeholder="Descreva aqui a sua ocorrência..."
        ></textarea>
      </div>
      <div class="p-6 mt-6 w-full space-y-5">
        
        <button class="relative bg-[#1865B8]/80 text-white w-full h-12 flex items-center justify-center rounded-lg">
          Upload de imagens
          <img
            src="/icons/image.png"
            class="absolute right-4 h-7"
          />
         
        </button>
        <div class="flex space-x-10 mt-4">
          <div class="w-1/3 h-0.5 bg-[#03045E] mt-6"></div>
          <div class="w-10 h-10 bg-[#03045E] rounded-full mt-2"></div>
          <div class="w-1/3 h-0.5 bg-[#03045E] mt-6 items-end"></div>
        </div>

          <button class="relative bg-[#1865B8]/80 text-white w-full h-12 flex items-center justify-center rounded-lg">
          Upload de áudio
          <img
            src="/icons/audio.png"
            class="absolute right-4 h-7"
          />
          </button>

        <div class="flex space-x-10 mt-4">
          <div class="w-1/3 h-0.5 bg-[#03045E] mt-6"></div>
          <div class="w-10 h-10 bg-[#03045E] rounded-full mt-2"></div>
          <div class="w-1/3 h-0.5 bg-[#03045E] mt-6 items-end"></div>
        </div>

        <button class="relative bg-[#1865B8]/80 text-white w-full h-12 flex items-center justify-center rounded-lg">
          Upload de vídeo
          <img
            src="/icons/audio.png"
            class="absolute right-4 h-7"
          />
          </button>

        <div class="flex space-x-10 mt-4">
          <div class="w-1/3 h-0.5 bg-[#03045E] mt-6"></div>
          <div class="w-10 h-10 bg-[#03045E] rounded-full mt-2"></div>
          <div class="w-1/3 h-0.5 bg-[#03045E] mt-6 items-end"></div>
        </div>
      </div>

    </div>
  </template>
  