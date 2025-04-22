<script setup>
import Header from '../components/header.vue';
import Navbar from '../components/navbar.vue';
import {useRoute, useRouter} from 'vue-router';
import { useOcorrenciasStore } from '../stores/ocorrencia.js';

const route = useRoute()
const router = useRouter()

const store = useOcorrenciasStore()
store.carregarOcorrencias()
const id = route.params.id
console.log("id:", id)
const ocorrencia = store.getOcorrenciaById(id);
console.log("ocorrencia:", ocorrencia)

function goAuditoriaInfo(id) {
        console.log("ID clicado:", id)
        router.push(`/auditoriasInfo/${id}`)
    }


</script>

<template>
    <div class="h-screen bg-[#E0F1FE]">
        <Header :title="ocorrencia.tipo_de_problema" backRoute="/auditorias"></Header>
        <Navbar></Navbar>
        <div class="p-4 space-y-6">
            <p class="text-2xl text-[#695C5C] font-bold">Localização</p>
            <div class="flex space-x-4 px-2">
                <img src="/icons/verlocalizacao.png"></img>
                <p class="text-lg">{{ ocorrencia.localizacao }} {{ ocorrencia.codigoPostal }}</p>
            </div>

            <p class="text-2xl text-[#695C5C] font-bold">Denunciante</p>
            <div class="flex space-x-4 px-2">
                <img src="/icons/emailicon.png" class="h-6 w-6"></img>
                <p class="text-lg">{{ ocorrencia.denunciante }}</p>
            </div>

            <p class="text-2xl text-[#695C5C] font-bold">Descrição</p>
            <div class="flex space-x-4 px-2">
                <img src="/icons/descricao.png" class="h-6 w-6"></img>
                <p class="text-lg">{{ ocorrencia.descricao }}</p>
            </div>
            <div class="w-full flex justify-center">
                <button class="bg-[#03045E] w-2/3 h-10 rounded-lg text-white"
                @click="goAuditoriaInfo(id)"
                >
                Começar Auditoria</button>
            </div>
            
        </div>
    </div>
</template>