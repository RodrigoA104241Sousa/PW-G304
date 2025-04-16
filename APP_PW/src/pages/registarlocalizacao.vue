<script setup>
import Navbar from '../components/navbar.vue'
import Header from '../components/header.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import '/leaflet-fix.js'


const router = useRouter()
const center = ref({ lat: 51.093048, lng: 6.842120 })


</script>

<template>
  <div class="bg-[#E0F1FE] min-h-screen flex flex-col">
    <Header title="Registar Localização" backRoute="/auditoriasInfo" />

    <div class="flex-grow flex justify-center items-start px-4 py-6">
        <div class="w-full max-w-4xl h-[500px]">

        <LMap :zoom="13" :center="center" style="height: 100%; width: 100%">
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LMarker :lat-lng="center" />
      </LMap>
        
      </div>
    </div>


    <Navbar />
  </div>
</template>
