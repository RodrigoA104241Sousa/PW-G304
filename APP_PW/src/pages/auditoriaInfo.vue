<script setup>
import Navbar from '../components/navbar.vue';
import Header from '../components/header.vue';
import { useRouter, useRoute } from 'vue-router'
import { useOcorrenciasStore } from '../stores/ocorrencia.js';
import { useAuditoriaStore } from '../stores/auditoria.js';


const store = useOcorrenciasStore()
const auditoria = useAuditoriaStore()


store.carregarOcorrencias()
const router = useRouter()
const route = useRoute()
const id = route.params.id
console.log("ID:", id)
const ocorrencia = store.getOcorrenciaById(id)
const tipo_problema = ocorrencia.tipo_de_problema
console.log("Ocorrência:", ocorrencia)

function guardarTudo(id, tipo_problema) {

    auditoria.guardarAuditoriaCompleta(id, tipo_problema)
    alert('Auditoria guardada com sucesso!')
}

function goRegistarLocalizacao(id) {
    
    router.push(`/registarlocalizacao/${id}`)
}

function goMaisDetalhes(id) {
    
    router.push(`/maisdetalhes/${id}`)
}

function goDocumentar(id) {
    
    router.push(`/documentaracao/${id}`)
}

</script>

<template>
    <div class="bg-[#E0F1FE] h-screen">
        <Header :title="ocorrencia.tipo_de_problema" :backRoute="`/verauditoria/${id}`"></Header>
        <Navbar></Navbar>
        <div class="px-8 space-y-4">
            <p class="text-[#695C5C] font-semibold ml-3 mb-1">Data de Início</p>
            <div class="flex flex-col items-center border-2 border-[#03045E] rounded-xl">
                <input 
                    type="date"
                    class="bg-[#03045E]/5 w-full h-10 px-4 placeholder:font-semibold"
                    placeholder="Inicío: dd/mm/aaaa"
                    v-model="auditoria.pagina1.dataInicio">
                </input>
            </div>

            <p class="text-[#695C5C] font-semibold ml-3 mb-1">Data de Fim</p>
            <div class="flex flex-col items-center border-2 border-[#03045E] rounded-xl">
                <input 
                    type="date"
                    class="bg-[#03045E]/5 w-full h-10 px-4 placeholder:font-semibold"
                    placeholder="Fim: dd/mm/aaaa"
                    v-model="auditoria.pagina1.dataFim">
                </input>
            </div>

            <div class="flex flex-col items-center border-2 border-[#03045E] rounded-xl mt-8">
                <select
                    class="bg-[#03045E]/5 w-full h-10 pl-4 placeholder:font-semibold"
                    >
                    <option value="juridico" class="py-1">Jurídico</option>
                    <option value="saude" class="py-1">Saúde</option>
                    <option value="inspecao" class="py-1">Inspeção</option>
                    <option value="inspecao" class="py-1">Inspeção</option>
                    
                </select>
            </div>

            <textarea 
                class="w-full h-36 bg-[#03045E]/5 border-2 border-[#03045E] rounded-xl px-4 py-2 placeholder:font-semibold placeholder:text-center align-top resize-none"
                placeholder="Registo de Dados"
            ></textarea>

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

                <button class="bg-[#1865B8]/80 text-white w-65 h-15  rounded-xl"
                        @click="guardarTudo(id,tipo_problema)">
                    Guardar
                </button>
            </div>
                 
        </div> 
    </div>
</template>