<script setup>
import "../pages/Documentaracao.vue"
import { useRouter } from 'vue-router'
const router = useRouter()

function godocumentacao() {
  router.push('/documentaracao')
}
defineProps({
  imageSrc: {
    type: String,
    required: true,
    default: '/icons/uploadimage.png'
  },

  text: {
    type: String,
    default: 'Imagem carregada'
  }
})

</script>

<template>
    <div class="h-screen p-10 ">
        <div class="flex flex-col items-center justify-center h-full bg-[#333333] rounded-4xl">
            <img
                :src="imageSrc"
                alt="Imagem do card"
                class="mb-25">
            </img>
            <img
                src="/icons/Check.png"
                alt="Upload"
                class=""
            ></img>
            <div class="text-white text-xl w-2/3 text-center mt-6">
                <p class="font-semibold">{{ text }} com sucesso!</p>
                <p class="mt-2">Obrigado.</p>
            </div>
            <button 
                @click="godocumentacao"
                class="bg-[#03045E] mt-20 text-white w-55 h-12 rounded-3xl">Fechar</button>
            
        </div>
    </div>
    
</template>