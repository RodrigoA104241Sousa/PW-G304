<script setup>
import Navbar from '../components/navbar.vue';
import Header from '../components/header.vue';
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

            <div class="flex flex-col items-center border-2 border-[#03045E] rounded-xl mt-8">
                <input 
                    class="bg-[#03045E]/5 w-full h-50 px-4 placeholder:font-semibold"
                    placeholder="Registo de Dados">
                </input>
            </div>
                 
        </div> 
    </div>
</template>