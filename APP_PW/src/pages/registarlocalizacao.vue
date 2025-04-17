<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import Navbar from '../components/navbar.vue'
import Header from '../components/header.vue'
import axios from 'axios'
import '/leaflet-fix.js'

// Token do MapTiler (podes pôr num .env com import.meta.env.VITE_MAPTILER_TOKEN)
const MAPTILER_TOKEN = 'K5f6nm9wH1vXIXaoKcl5'

const router = useRouter()
const center = ref({ lat: 41.445833, lng: -8.301111 })
localStorage.setItem('localizacao', JSON.stringify(center.value))
const query = ref('')
const suggestions = ref([])
const showSuggestions = ref(false)

const searchSuggestions = async () => {
  if (query.value.length < 3) {
    suggestions.value = []
    return
  }

  try {
    const response = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(query.value)}.json`,
      {
        params: {
          key: MAPTILER_TOKEN,
          limit: 5,
          language: 'pt'
        }
      }
    )

    suggestions.value = response.data.features
    showSuggestions.value = true
  } catch (error) {
    console.error('Erro ao procurar localidade:', error)
  }
}

const selectSuggestion = (place) => {
  const [lng, lat] = place.geometry.coordinates
  center.value = { lat, lng }
  query.value = place.place_name
  suggestions.value = []
  showSuggestions.value = false
}
</script>

<template>
  <div class="bg-[#E0F1FE] min-h-screen flex flex-col">
    <Header title="Mapa" backRoute="/auditoriasInfo" />

    <div class="flex flex-col items-center px-4 py-4 gap-4">
      <!-- Mapa com tiles do MapTiler -->
      <div class="w-full max-w-md h-[350px] rounded-xl overflow-hidden shadow">
        <LMap :zoom="13" :center="center" style="height: 100%; width: 100%">
          <LTileLayer
            :url="`https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=${MAPTILER_TOKEN}`"
            attribution='&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors'
          />
          <LMarker :lat-lng="center" />
        </LMap>
      </div>

      <!-- Input com autocomplete -->
      <div class="w-full max-w-md relative">
        <input
          v-model="query"
          @input="searchSuggestions"
          type="text"
          placeholder="Pesquise aqui"
          class="w-full p-3 rounded-xl border border-blue-500 text-center text-gray-700 placeholder-gray-500 shadow"
        />

        <!-- Sugestões -->
        <ul
          v-if="showSuggestions && suggestions.length"
          class="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow z-50 max-h-60 overflow-y-auto"
        >
          <li
            v-for="(place, index) in suggestions"
            :key="index"
            @click="selectSuggestion(place)"
            class="p-2 cursor-pointer hover:bg-blue-100 text-sm text-left"
          >
            {{ place.place_name }}
          </li>
        </ul>
      </div>
    </div>

    <Navbar />
  </div>
</template>
