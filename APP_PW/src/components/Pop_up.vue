<script setup>
const props = defineProps({
   text:{
    type: String,
   }
});
</script>

<template>
    <div class="h-screen w-screen fixed top-0 left-0 bg-[#E0F1FE] bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 class="text-xl font-semibold mb-4">{{ props.text }}</h2>
            <button @click="$emit('close')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Fechar
            </button>
        </div>
    </div>
</template>