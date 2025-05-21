<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '../components/navbar.vue'
import Header from '../components/header.vue'
import { useAuditoriaStore } from '../stores/auditoria'

const route = useRoute()
const id = route.params.id
const auditoriaStore = useAuditoriaStore()

let map
let marker
let geocoder

const auditorias = JSON.parse(localStorage.getItem('auditorias') || '[]')
const ocorrencia = auditorias.find(a => String(a.id) === String(id))

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
}

function registarLocalizacaoAtual() {
  if (!navigator.geolocation) {
    alert('Geolocalização não é suportada pelo seu navegador.')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      const local = { lat: latitude, lng: longitude }

      // Atualizar mapa e marcador
      map.setCenter(local)
      if (!marker) {
        marker = new google.maps.Marker({
          map,
          position: local
        })
      } else {
        marker.setPosition(local)
      }

      // Obter morada a partir das coordenadas
      geocoder.geocode({ location: local }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const morada = results[0].formatted_address

          // Guardar na store
          auditoriaStore.setDados('pagina3', {
            ...auditoriaStore.pagina3,
            localizacao: {
              morada,
              latitude,
              longitude
            }
          })

          alert('Localização atual registada com sucesso!')
        } else {
          alert('Não foi possível obter a morada.')
        }
      })
    },
  )
}

onMounted(() => {
  if (typeof google !== 'undefined' && google.maps) {
    initMap()
  } else {
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
  <div class="bg-[#E0F1FE] min-h-screen flex flex-col">
    <Header title="Mapa" :backRoute="`/auditoriasInfo/${id}`" />
    <div class="flex-1 relative">
      <div id="map" class="w-full h-[500px]"></div>
      <div class="p-4 flex justify-center">
        <button @click="registarLocalizacaoAtual"
                class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Registar Localização Atual
        </button>
      </div>
    </div>
    <Navbar />
  </div>
</template>
