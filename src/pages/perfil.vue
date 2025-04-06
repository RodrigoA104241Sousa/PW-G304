<script setup>
import Navbar from '../components/navbar.vue';
import Header from '../components/header.vue';
import { useRouter } from 'vue-router'


const router = useRouter()

let user = localStorage.getItem("user");
if (user) {
  user = JSON.parse(user);
  console.log(user);
} else {
  user = null;
}

let image = user.picture;
function logout() {
    router.push('/')
    }
</script>

<template>
  
  
  <div class="h-screen w-full bg-[#E0F1FE] flex flex-col items-center">
    <Header title="Perfil do Perito" backRoute="/home" />
    <Navbar />
    <div class="mt-3">
      <p class="text-gray-500 font-semibold">Nome</p>
      <div class="relative mt-1">
        <input
          type="text"
          class="w-80 h-11 pr-10 bg-white rounded-xl border-2 border-[#03045E] p-2"
          :value="user?.name"
        />
        <img
          src="/icons/editperfil.png"
          class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2"
        />
      </div>

      <p class="text-gray-500 font-semibold mt-6">Email</p>
      <div class="relative mt-1">
        <input
          type="text"
          class="w-80 h-11 pr-10 bg-white rounded-xl border-2 border-[#03045E] p-2"
          :value="user?.email"
        />
        <img
          src="/icons/editemail.png"
          class="w-6 h-6 absolute right-3 top-1/2 transform -translate-y-1/2"
        />
      </div>
    </div>

    <div class="w-30 h-30 mt-10">
      <img
        :src="image"
        class="w-30 h-30 brightness-75 rounded-2xl"
      />
    </div>

    <p class="text-gray-500 font-semibold mt-10 ml-1">Especialidade</p>
    <div class="relative mt-1">
      <input
        type="text"
        class="w-80 h-11 pr-10 bg-white rounded-xl border-2 border-[#03045E] p-2"
        :value="user?.name"
      />
    </div>

    <div class="w-80 h-13 flex justify-center rounded-lg bg-[#03045E] mt-15">
        <button @click="logout" class="text-white">
          Terminar Sessão
        </button>
    </div>


      
  </div>
</template>
