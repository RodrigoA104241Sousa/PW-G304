<script setup>
import Navbar from '../components/navbar.vue';
import Header from '../components/header.vue';
import Card from '../components/card.vue';
import { ref, computed } from 'vue'

const todasOcorrencias = ref(JSON.parse(localStorage.getItem('auditorias') || '[]'))
const user = JSON.parse(localStorage.getItem('user') || '{}')

// Filtrar só as auditorias do perito logado
const minhasOcorrencias = computed(() =>
  todasOcorrencias.value.filter(ocorrencia =>
    ocorrencia.peritos.some(perito => perito.email === user.email)
  )
)


// Paginação
const paginaAtual = ref(1)
const ocorrenciasPorPagina = 5

const totalPaginas = computed(() => {
  return Math.ceil(minhasOcorrencias.value.length / ocorrenciasPorPagina)
})

const ocorrenciasVisiveis = computed(() => {
  const inicio = (paginaAtual.value - 1) * ocorrenciasPorPagina
  const fim = inicio + ocorrenciasPorPagina
  return minhasOcorrencias.value.slice(inicio, fim)
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
        v-for="ocorrencia in ocorrenciasVisiveis"
        :key="ocorrencia.id"
        :nomeAuditoria="ocorrencia.nome"
        textoBotao="Gerir Pedido"
        :id="ocorrencia.id"
        :tipo="'auditoria'"
      />
    </div>

    <!-- Paginação -->
    <div class="flex justify-between items-center px-6">
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
