<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

    defineProps({
    nomeAuditoria: String,
    textoBotao: String,
    id: Number
    })

    function goAuditoriaInfo(id) {
        console.log("ID clicado:", id)
        router.push(`/auditoriasInfo/${id}`)
    }
</script>

<template>
    <div class="flex bg-[#1865B8]/80  h-20 items-center space-x-20 p-6 rounded-xl">
        <p class="text-white text-2xl font-semibold">{{ nomeAuditoria }}</p>
        <button 
            @click="goAuditoriaInfo(id)"
            class="text-white  bg-[#03045E] h-11 w-35 flex items-center justify-center text-sm rounded-xl font-semibold">
            <p>{{textoBotao}}</p>
        </button>
    </div>
</template>