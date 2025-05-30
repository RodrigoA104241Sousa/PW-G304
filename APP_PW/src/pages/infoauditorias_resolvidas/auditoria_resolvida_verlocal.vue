<script setup>
import Navbar from '../../components/navbar.vue';
import Header from '../../components/header.vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuditoriaStore } from '../../stores/auditoria.js';
import { onMounted } from 'vue'

const auditoria = useAuditoriaStore()
auditoria.carregarAuditoriasResolvidas()

const router = useRouter()
const route = useRoute()
const id = route.params.id
const auditoria_resolvida = auditoria.getAuditoriaById(id)

// Google Maps
let map
let marker
let geocoder

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
  if (auditoria_resolvida?.pagina3?.localizacao.morada) {
    geocoder.geocode({ address: auditoria_resolvida?.pagina3?.localizacao.morada }, (results, status) => {
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
  <div class="bg-[#E0F1FE] h-screen">
    <Header :backRoute="`/verauditoriaresolvida/${id}`" />
    <div id="map" class="w-full h-[500px]"></div>
    <Navbar />
  </div>
</template>