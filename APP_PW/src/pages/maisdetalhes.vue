<script setup>
import Header from '../components/header.vue';
import Navbar from '../components/navbar.vue';  
</script>

<template>
    <div class="h-screen bg-[#E0F1FE]">
        <Header title="Indicadores" backRoute="/auditoriasInfo" />
        <Navbar/>
        <div class="pt-1 pl-2 flex flex-col items-center w-full">
            <div class="relative w-full flex items-center h-10">
                <img
                src="/icons/perigo.png"
                class="absolute left-0 h-10"
                />
                <div class="absolute w-full text-center flex justify-center">
                    <p class="w-60 text-xl text-[#695F5F] font-semibold">
                        Número de Problemas Identificados
                    </p>
                </div>
               
            </div>
            <input 
            type="number"
            class="bg-white w-20 h-15 border-2 border-[#03045E] rounded-lg text-3xl mt-6 text-center"></input>
        </div>

        <div class="pt-1 pl-2 flex flex-col items-center w-full">
            <div class="relative w-full flex items-center h-10">
                <img
                src="/icons/time.png"
                class="absolute left-0 h-10"
                />
                <div class="absolute w-full text-center flex justify-center">
                    <p class="w-60 text-xl text-[#695F5F] font-semibold">
                        Tempo total de Auditoria
                    </p>
                </div>
               
            </div>
            <input 
            class="bg-white w-40 h-15 border-2 border-[#03045E] rounded-lg text-3xl mt-6 text-center"></input>
        </div>

        <div class="pt-6 pl-2 flex flex-col items-center w-full">
            <div class="relative w-full flex items-center h-10">
                <img
                src="/icons/peopleinformation.png"
                class="absolute left-0 h-10"
                />
                <div class="absolute w-full text-center flex justify-center">
                    <p class="w-60 text-xl text-[#695F5F] font-semibold">
                        Necessidades de ações corretivas 
                    </p>
                </div>
               
            </div>
            <textarea 
                class="bg-white w-75 h-29 border-2 p-2 border-[#03045E] rounded-lg text-lg mt-6 placeholder:text-black placeholder:text-sm"
                placeholder="Descreva as ações corretivas necessárias..."
            ></textarea>
        </div>

        <div class="pt-6 pl-2 flex flex-col items-center w-full">
            <div class="relative w-full flex items-center h-10">
                <img
                src="/icons/martelo.png"
                class="absolute left-0 h-10"
                />
                <div class="absolute w-full text-center flex justify-center">
                    <p class="w-75 text-xl text-[#695F5F] font-semibold">
                        Impacto esperado das recomendações 
                    </p>
                </div>
               
            </div>
            <textarea 
                class="bg-white w-75 h-29 border-2 p-2 border-[#03045E] rounded-lg text-lg mt-6 placeholder:text-black placeholder:text-sm"
                placeholder="Descreva os impactos esperados..."
            ></textarea>
        </div>
    </div>
</template>