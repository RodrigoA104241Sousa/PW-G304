<script setup>
import Navbar from '../../components/navbar.vue';
import Header from '../../components/header.vue';
import { useRouter, useRoute } from 'vue-router'
import { useAuditoriaStore } from '../../stores/auditoria.js';

const auditoria = useAuditoriaStore()

auditoria.carregarAuditoriasResolvidas()
const router = useRouter()
const route = useRoute()
const id = route.params.id
console.log("ID:", id)
const auditoria_resolvida = auditoria.getAuditoriaById(id)
console.log("Auditoria:", auditoria_resolvida)



function goRegistarLocalizacao(id) {
    
    router.push(`/registarlocalizacao/${id}`)
}

function goMaisDetalhes(id) {
    
    router.push(`/auditoriaresolvidamaisdetalhes/${id}`)
}

function goDocumentar(id) {
    
    router.push(`/documentaracao/${id}`)
}

</script>

<template>
    <div class="bg-[#E0F1FE] h-screen">
        <Header  :backRoute="`/verauditoria/${id}`"></Header>
        <Navbar></Navbar>
        <div class="px-8 space-y-4">
            <p class="text-[#695C5C] font-semibold ml-3 mb-1">Data de Início</p>
            <div class="border-2 border-[#03045E] rounded-xl">
                <div class="flex items-center bg-[#03045E]/5 w-full h-10 px-4">
                    {{ auditoria_resolvida.pagina1.dataInicio }}
                </div>
            </div>

            <p class="text-[#695C5C] font-semibold ml-3 mb-1">Data de Fim</p>
            <div class="border-2 border-[#03045E] rounded-xl">
                <div class="flex items-center bg-[#03045E]/5 w-full h-10 px-4">
                    {{ auditoria_resolvida.pagina1.dataFim }}
                </div>
            </div>

            <p class="text-[#695C5C] font-semibold ml-3 mb-1">Especialidade</p>
            <div class="border-2 border-[#03045E] rounded-xl">
                <div class="flex items-center bg-[#03045E]/5 w-full h-10 px-4">
                    {{ auditoria_resolvida.pagina1.especialidade}}
                </div>
            </div>

            <div class="w-full h-36 bg-[#03045E]/5 border-2 border-[#03045E] rounded-xl px-4 py-2 placeholder:font-semibold placeholder:text-center align-top resize-none">
                {{ auditoria_resolvida.pagina1.descricao }}
            </div>

            <div class="flex space-x-1 ">
                <img
                    src="/icons/info.png"
                    alt="ocorrencia"
                    >
                </img>
                <p class="font-semibold underline cursor-pointer"
                    @click="goMaisDetalhes(id)"
                >Mais detalhes</p>
            </div>

            <div class="flex flex-col items-center font-semibold space-y-5">
                <button class="bg-[#1865B8]/80 text-white w-65 h-15  rounded-xl"
                    @click="goRegistarLocalizacao(id)">
                    Registar Localização
                </button>

                <button class="bg-[#1865B8]/80 text-white w-65 h-15  rounded-xl"
                    @click="goDocumentar(id)">
                    Documentação da ação
                </button>

            </div>
                 
        </div> 
    </div>
</template>