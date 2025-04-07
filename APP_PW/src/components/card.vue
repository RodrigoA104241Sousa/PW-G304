<script setup>
    defineProps({
    nomeAuditoria: String,
    textoBotao: String
    })
</script>

<template>
    <div class="flex bg-[#1865B8]/80  h-20 items-center space-x-20 p-6 rounded-xl">
        <p class="text-white text-2xl font-semibold">{{ nomeAuditoria }}</p>
        <div class="text-white  bg-[#03045E] h-11 w-35 flex items-center justify-center text-sm rounded-xl font-semibold">
            <p>{{textoBotao}}</p>
        </div>
    </div>
</template>