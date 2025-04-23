<script setup>
import Navbar from '../components/navbar.vue';
import Header from '../components/header.vue';
import Card from '../components/card.vue';
import { ref, computed } from 'vue'
import { useAuditoriaStore } from '../stores/auditoria.js'

// Aceder ao store
const auditoria = useAuditoriaStore()

// Obter todas as auditorias guardadas
const todasAuditorias = ref(auditoria.getTodasAuditorias())
console.log("todasAuditorias:", todasAuditorias.value)

// Paginação
const paginaAtual = ref(1)
const auditoriasPorPagina = 5

const totalPaginas = computed(() => {
  return Math.ceil(todasAuditorias.value.length / auditoriasPorPagina)
})

// Auditorias visíveis na página atual
const auditoriasVisiveis = computed(() => {
  const inicio = (paginaAtual.value - 1) * auditoriasPorPagina
  const fim = inicio + auditoriasPorPagina
  return todasAuditorias.value.slice(inicio, fim)
})

function proximaPagina() {
  if (paginaAtual.value < totalPaginas.value) {
    paginaAtual.value++
  }
}

function paginaAnterior() {
  if (paginaAtual.value > 1) {
    paginaAtual.value--
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#E0F1FE]">
    <Header title="Auditorias" backRoute="/home" />
    <Navbar />

    <div class="w-full p-6 mt-4 space-y-5">
      <Card
        v-for="auditoria in auditoriasVisiveis"
        :key="auditoria.id"
        :nomeAuditoria="auditoria.tipo_problema || 'Auditoria Sem Título'"
        textoBotao="Gerir Auditoria"
        :id="auditoria.id"
        :tipo="'resolvida'"
      />
    </div>

    <!-- Paginação -->
    <div class="flex justify-between items-center p-6">
      <button
        @click="paginaAnterior"
        :disabled="paginaAtual === 1"
        class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Anterior
      </button>
      <span>Página {{ paginaAtual }} de {{ totalPaginas }}</span>
      <button
        @click="proximaPagina"
        :disabled="paginaAtual === totalPaginas"
        class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Próxima
      </button>
    </div>
  </div>
</template>
