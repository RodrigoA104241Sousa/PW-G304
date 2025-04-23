<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

    defineProps({
    nomeAuditoria: String,
    textoBotao: String,
    id: Number
    })

    function goAuditoriaInfo(id) {
        console.log("ID clicado:", id)
        router.push(`/auditoriasInfo/${id}`)
    }

    function verAuditoria(id){
        console.log("ID clicado:", id)
        router.push(`/verauditoria/${id}`)
    }
</script>

<template>
    <div class="flex justify-between items-center bg-[#1865B8]/80 px-4 py-3 rounded-xl w-full h-24">
      <!-- Título com quebra de linha permitida -->
      <p class="text-white text-lg font-semibold break-words w-2/3">
        {{ nomeAuditoria }}
      </p>
  
      <!-- Botão com largura e altura fixa + truncamento do texto -->
      <button 
        @click="verAuditoria(id)"
        class="bg-[#03045E] w-30 h-10 flex items-center justify-center rounded-xl overflow-hidden"
      >
        <p class="text-white text-sm font-semibold text-center truncate w-full px-2">
          {{ textoBotao }}
        </p>
      </button>
    </div>
  </template>
  
  