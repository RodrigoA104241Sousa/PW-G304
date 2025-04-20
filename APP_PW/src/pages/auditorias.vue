<script setup>
import Navbar from '../components/navbar.vue';
import Header from '../components/header.vue';
import Card from '../components/card.vue';
import { ref, computed } from 'vue'


const ocorrencias = [
  {
    id: 1,
    tipo_de_problema: 'Buraco na estrada',
    denunciante: 'Pedro',
    localizacao: 'Rua Central',
    descricao: 'Existe um buraco grande na estrada que pode causar acidentes.'
  },
  {
    id: 2,
    tipo_de_problema: 'Semáforo avariado',
    denunciante: 'Joana',
    localizacao: 'Av. das Flores',
    descricao: 'O semáforo está apagado e causa confusão no trânsito.'
  },
  {
    id: 3,
    tipo_de_problema: 'Caixote do lixo partido',
    denunciante: 'Rui',
    localizacao: 'Rua do Lixo',
    descricao: 'O caixote está partido e o lixo está a espalhar-se na rua.'
  },
  {
    id: 4,
    tipo_de_problema: 'Tampa de esgoto solta',
    denunciante: 'Ana',
    localizacao: 'Rua dos Gatos',
    descricao: 'A tampa está fora do lugar e representa perigo para peões.'
  },
  {
    id: 5,
    tipo_de_problema: 'Luz pública apagada',
    denunciante: 'Carlos',
    localizacao: 'Travessa Escura',
    descricao: 'A rua está completamente às escuras à noite.'
  },
  {
    id: 6,
    tipo_de_problema: 'Luz pública apagada',
    denunciante: 'Marta',
    localizacao: 'Travessa Escura',
    descricao: 'A luz não funciona há vários dias.'
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
        :nomeAuditoria="ocorrencia.tipo_de_problema"
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
