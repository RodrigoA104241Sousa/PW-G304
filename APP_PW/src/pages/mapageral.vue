<script setup>
import navbar from '../components/navbar.vue';
import { useOcorrenciasStore } from '../stores/ocorrencia';
import { ref, onMounted } from 'vue' 
import { useRouter } from 'vue-router';

const ocorrencias = useOcorrenciasStore()
ocorrencias.carregarOcorrencias()
const ocorrencias_lista = ocorrencias.getTodasOcorrencias()

// Google Maps
let map
let geocoder

window.initMap = initMap

onMounted(() => {
  initMap()
})  

function initMap() {
  const braga = { lat: 41.5454, lng: -8.4265 }
  geocoder = new google.maps.Geocoder()

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
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

  const infoWindow = new google.maps.InfoWindow() // uma só janela reutilizada

  ocorrencias_lista.forEach(ocorrencia => {
    if (ocorrencia.morada) {
      geocoder.geocode({ address: ocorrencia.morada }, (results, status) => {
        if (status === 'OK' && results[0]?.geometry?.location) {
          const marker = new google.maps.Marker({
            map,
            position: results[0].geometry.location,
          })

          const content = `
            <div>
              <strong>Tipo:</strong> ${ocorrencia.tipo || '—'}<br/>
              <strong>Morada:</strong> ${ocorrencia.morada || '—'}<br/>
              <strong>Data:</strong> ${ocorrencia.data || '—'}<br/>
              <strong>Urgencia:</strong> ${ocorrencia.nivelUrgencia || '—'}<br/>
            </div>
          `

          marker.addListener('click', () => {
            infoWindow.setContent(content)
            infoWindow.open(map, marker)
          })
        }
      })
    }
  })
}

</script>

<template>
  <div class="h-screen w-screen flex flex-col">
    <div class="flex-1 relative">
      <div id="map" class="absolute inset-0 w-full h-full z-0"></div>
    </div>
    <navbar class="z-10" />
  </div>
</template>