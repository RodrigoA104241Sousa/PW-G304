<script setup>
import Header from '../components/header.vue'
import Navbar from '../components/navbar.vue'
import { useRoute, useRouter } from 'vue-router'
import { useOcorrenciasStore } from '../stores/ocorrencia.js'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

const store = useOcorrenciasStore()
store.carregarOcorrencias()

const id = route.params.id
const ocorrencia = store.getOcorrenciaById(id)

const showModal = ref(false)

const corUrgencia = (n) => {
  switch (n) {
    case 1:
    case 2:
      return 'bg-green-500 text-white border-green-500'
    case 3:
      return 'bg-yellow-400 text-white border-yellow-400'
    case 4:
      return 'bg-orange-500 text-white border-orange-500'
    case 5:
      return 'bg-red-600 text-white border-red-600'
    default:
      return ''
  }
}

function goAuditoriaInfo(id) {
  router.push(`/auditoriasInfo/${id}`)
}

// Google Maps
let map
let marker
let geocoder

onMounted(() => {
  initMap()
})  

function initMap() {
  const braga = { lat: 41.5454, lng: -8.4265 }
  geocoder = new google.maps.Geocoder()

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: braga,
    mapTypeId: 'roadmap',
    streetViewControl: true,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    scaleControl: true,
    fullscreenControl: true
  })

  // Se a morada existir, centrar no local e colocar marcador
  if (ocorrencia?.morada) {
    geocoder.geocode({ address: ocorrencia.morada }, (results, status) => {
      if (status === 'OK' && results[0]?.geometry?.location) {
        map.setCenter(results[0].geometry.location)
        marker = new google.maps.Marker({
          map,
          position: results[0].geometry.location
        })
      }
    })
  }

  window.initMap = initMap
}

onMounted(() => {
  if (typeof google !== 'undefined' && google.maps) {
    initMap()
  } else {
    // Espera até o script estar totalmente carregado
    const checkInterval = setInterval(() => {
      if (typeof google !== 'undefined' && google.maps) {
        clearInterval(checkInterval)
        initMap()
      }
    }, 200)
  }
})
</script>

<template>
  <div class="h-screen bg-[#E0F1FE] overflow-auto pb-24">
    <Header :title="ocorrencia.tipo_de_problema" backRoute="/auditorias" />
    <Navbar />
    <div class="p-4 space-y-8">
      
      <p class="text-2xl text-[#695C5C] font-bold">Denunciante</p>
      <div class="flex space-x-4 px-2">
        <img src="/icons/emailicon.png" class="h-6 w-6" />
        <p class="text-lg">{{ ocorrencia.nome }}</p>
      </div>

      <p class="text-2xl text-[#695C5C] font-bold ">Descrição</p>
      <div class="flex space-x-4 px-2 w-full">
        <img src="/icons/descricao.png" class="h-6 w-6" />
        <p class="text-lg w-full max-w-[80%] break-words">{{ ocorrencia.descricao }}</p>
      </div>

      <p class="text-2xl text-[#695C5C] font-bold">Localização</p>
      <div class="flex space-x-4 px-2 items-center">
        <img src="/icons/verlocalizacao.png" />
        <p class="text-lg">{{ ocorrencia.morada }}</p>
      </div>

      <!-- Mapa -->
      <div id="map" class="w-full h-64 mt-4 rounded shadow" style="min-height: 300px;"></div>

      <!-- Materiais -->
      <div>
        <div class="w-full px-2 flex justify-center">
          <button @click="showModal = true" class="bg-[#03045E] text-white px-4 py-2 rounded-lg hover:bg-[#002e7a]">
            Materiais Necessários
          </button>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-[#E0F1FE] bg-opacity-40 flex justify-center items-center z-50">
          <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 class="text-xl font-bold mb-4 text-[#0f0f4c]">Materiais Selecionados</h2>
            <ul class="list-disc list-inside text-[#333] mb-4" v-if="ocorrencia.materiais.length">
              <li v-for="(material, index) in ocorrencia.materiais" :key="index">
                {{ material }}
              </li>
            </ul>
            <p v-else class="text-[#333]">Nenhum material associado.</p>
            <div class="flex justify-end">
              <button @click="showModal = false" class="bg-[#0f0f4c] text-white px-4 py-2 rounded hover:bg-[#03045E]">
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full flex flex-col items-center">
        <p class="text-2xl text-[#695C5C] font-bold">Nível de Urgência</p>
        <div class="flex space-x-4 px-2 mt-2">
          <div
            v-for="n in 5"
            :key="n"
            :class="[
              'w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-semibold',
              parseInt(ocorrencia.nivelUrgencia) === n
                ? corUrgencia(n)
                : 'text-[#0f0f4c] border-[#0f0f4c]'
            ]"
          >
            {{ n }}
          </div>
        </div>
      </div>

      <!-- Botão de ação -->
      <div class="w-full flex justify-center">
        <button class="bg-[#03045E] w-2/3 h-10 rounded-lg text-white" @click="goAuditoriaInfo(id)">
          Começar Auditoria
        </button>
      </div>
    </div>
  </div>
</template>
