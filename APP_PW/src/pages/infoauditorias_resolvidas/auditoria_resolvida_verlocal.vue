<script setup>
import Navbar from '../../components/navbar.vue';
import Header from '../../components/header.vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter()
const route = useRoute()
const id = route.params.id
</script>

<template>
    <div class="bg-[#E0F1FE] h-screen">
        <Navbar></Navbar>
        <Header :backRoute="`/verauditoriaresolvida/${id}`"></Header>
    </div>
</template>