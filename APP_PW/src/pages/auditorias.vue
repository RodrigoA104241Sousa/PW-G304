<script setup>
import Navbar from '../components/navbar.vue';
import Header from '../components/header.vue';
import Card from '../components/card.vue';
import { ref, computed } from 'vue'


const ocorrencias = [
  {
    id: 1,
    descricao: 'Buraco na estrada',
    data: '2025-04-19',
    local: 'Rua Central',
    estado: 'Pendente'
  },
  {
    id: 2,
    descricao: 'Semáforo avariado',
    data: '2025-04-18',
    local: 'Av. das Flores',
    estado: 'Resolvido'
  },
  {
    id: 3,
    descricao: 'Caixote do lixo partido',
    data: '2025-04-17',
    local: 'Rua do Lixo',
    estado: 'Em análise'
  },
  {
    id: 4,
    descricao: 'Tampa de esgoto solta',
    data: '2025-04-16',
    local: 'Rua dos Gatos',
    estado: 'Pendente'
  },
  {
    id: 5,
    descricao: 'Luz pública apagada',
    data: '2025-04-15',
    local: 'Travessa Escura',
    estado: 'Resolvido'
  },
  {
    id: 6,
    descricao: 'Luz pública apagada',
    data: '2025-04-15',
    local: 'Travessa Escura',
    estado: 'Resolvido'
  }
]

// 2. Guardar no localStorage
localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias))

const todasOcorrencias = ref(JSON.parse(localStorage.getItem('ocorrencias') || '[]'))

// 2. Lógica de paginação
const paginaAtual = ref(1)
const ocorrenciasPorPagina = 5

const totalPaginas = computed(() => {
  return Math.ceil(todasOcorrencias.value.length / ocorrenciasPorPagina)
})

const ocorrenciasVisiveis = computed(() => {
  const inicio = (paginaAtual.value - 1) * ocorrenciasPorPagina
  const fim = inicio + ocorrenciasPorPagina
  return todasOcorrencias.value.slice(inicio, fim)
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
        :nomeAuditoria="ocorrencia.descricao"
        textoBotao="Gerir Pedido"
        :id="ocorrencia.id"
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
