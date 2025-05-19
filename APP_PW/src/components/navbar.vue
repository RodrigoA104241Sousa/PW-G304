<script setup lang="ts">
    
    import { useRouter } from 'vue-router' // <- tens de importar isto!

const router = useRouter() //

        

    function goHome() {
    router.push('/home')
    }

    function gocorrencias() {
    router.push('/auditorias')
    }

    function goMapa() {
    router.push('/mapa')
    }

    function goAuditoriaResolvida() {
    router.push('/auditoriasresolvidas')
    }

    function goPerfil() {
    router.push('/perfil')
    }

</script>

<template>
    <div class="p-4 h-15 fixed bottom-0 w-full bg-[#03045E] z-50 flex items-center space-x-12">
        <div class="flex items-center space-x-12">
            <button @click="goHome">
                <img src="/icons/home.png" class="w-20 "></img>
            </button>
            <button @click="gocorrencias">
                <img src="/icons/auditoria.png" class="w-20"></img>
            </button>
        </div>

        <div class="absolute left-1/2 bottom-4 transform -translate-x-1/2">
            <div class="bg-[#03045E] p-3 rounded-full shadow-lg">
                <img class="" src="/icons/localizacaoicon.png"></img>
            </div>
        </div>

        <div class="flex items-center w-full space-x-12 justify-end">
            <button @click="goAuditoriaResolvida">
                <img src="/icons/auditoriaresolvida.png" class="w-8 "></img>
            </button>
            <button @click="goPerfil">
                <img src="/icons/perfil.png" class="w-8"></img>
            </button>
        </div>
    </div>
</template>