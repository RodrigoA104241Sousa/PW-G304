<script setup>
import Navbar from '../components/navbar.vue';
import Header from '../components/header.vue';
import { useRouter } from 'vue-router'
import { ref } from 'vue';


const router = useRouter()

let user = localStorage.getItem("user");
if (user) {
  user = JSON.parse(user);
  console.log(user);
} else {
  user = null;
}

let experts = []
const expertsData = localStorage.getItem('expertsData')
if (expertsData) {
  experts = JSON.parse(expertsData)
  console.log(experts)
}

const status = ref('')
const specialty = ref('')

if (user && experts.length) {
  const expert = experts.find(expert => expert.email === user.email)
  if (expert) {
    specialty.value = expert.specialty
    status.value = expert.status || 'Disponível'
  }
}

// Função para mudar o status
function setStatus(novoStatus) {
  status.value = novoStatus
  // Atualizar no localStorage (opcional)
  if (user && experts.length) {
    const idx = experts.findIndex(expert => expert.email === user.email)
    if (idx !== -1) {
      experts[idx].status = novoStatus
      localStorage.setItem('expertsData', JSON.stringify(experts))
    }
  }
}

let image = user.picture;
function logout() {
    localStorage.removeItem('user')
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
      <div class="flex justify-center w-80 h-11 pr-10 bg-white rounded-xl border-2 border-[#03045E] p-2">
        {{ specialty }}
      </div>
    </div>

    <div class="flex space-x-4 mt-8">
      <button
        @click="setStatus('Disponível')"
        :class="[
          'w-36 h-12 rounded-lg font-semibold border-2 transition',
          status === 'Disponível'
            ? 'bg-green-600 text-white border-green-600'
            : 'bg-white text-green-600 border-green-600'
        ]"
      >
        Disponível
      </button>
      <button
        @click="setStatus('Não Disponível')"
        :class="[
          'w-36 h-12 rounded-lg font-semibold border-2 transition',
          status === 'Não Disponível'
            ? 'bg-red-600 text-white border-red-600'
            : 'bg-white text-red-600 border-red-600'
        ]"
      >
        Não Disponível
      </button>
    </div>

    <div class="w-80 h-13 flex justify-center rounded-lg bg-[#03045E] mt-15">
        <button @click="logout" class="text-white">
          Terminar Sessão
        </button>
    </div>


      
  </div>
</template>
