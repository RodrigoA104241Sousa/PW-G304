<script setup>
import Navbar from '../components/navbar.vue';
import Header from '../components/header.vue';
import { useRouter } from 'vue-router' // <- tens de importar isto!

const router = useRouter()

function goRegistarLocalizacao() {
    
    router.push('/registarlocalizacao')
}

function goMaisDetalhes() {
    
    router.push('/maisdetalhes')
}

function goDocumentar() {
    
    router.push('/documentaracao')
}
</script>

<template>
    <div class="bg-[#E0F1FE] h-screen">
        <Header title="occorencia 1" backRoute="/home"></Header>
        <Navbar></Navbar>
        <div class="px-8 space-y-4">
            <p class="text-[#695C5C] font-semibold ml-3 mb-1">Data de Início</p>
            <div class="flex flex-col items-center border-2 border-[#03045E] rounded-xl">
                <input 
                    type="date"
                    class="bg-[#03045E]/5 w-full h-10 px-4 placeholder:font-semibold"
                    placeholder="Inicío: dd/mm/aaaa">
                </input>
            </div>

            <p class="text-[#695C5C] font-semibold ml-3 mb-1">Data de Fim</p>
            <div class="flex flex-col items-center border-2 border-[#03045E] rounded-xl">
                <input 
                    type="date"
                    class="bg-[#03045E]/5 w-full h-10 px-4 placeholder:font-semibold"
                    placeholder="Fim: dd/mm/aaaa">
                </input>
            </div>

            <div class="flex flex-col items-center border-2 border-[#03045E] rounded-xl mt-8">
                <select
                    class="bg-[#03045E]/5 w-full h-10 pl-4 placeholder:font-semibold"
                    >
                    <option value="joana" class="py-1">Joana Silva</option>
                    <option value="mario" class="py-1">Mário Costa</option>
                    <option value="ines" class="py-1">Inês Duarte</option>
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
                    @click="goMaisDetalhes"
                >Mais detalhes</p>
            </div>

            <div class="flex flex-col items-center font-semibold space-y-5">
                <button class="bg-[#1865B8]/80 text-white w-65 h-15  rounded-xl"
                    @click="goRegistarLocalizacao">
                    Registar Localização
                </button>

                <button class="bg-[#1865B8]/80 text-white w-65 h-15  rounded-xl"
                    @click="goDocumentar">
                    Documentação da ação
                </button>

                <button class="bg-[#1865B8]/80 text-white w-65 h-15  rounded-xl">
                    Guardar
                </button>
            </div>
                 
        </div> 
    </div>
</template>