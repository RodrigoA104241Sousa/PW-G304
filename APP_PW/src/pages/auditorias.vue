<script setup>
import Navbar from '../components/navbar.vue';
import Header from '../components/header.vue';
import Card from '../components/card.vue';

let user = localStorage.getItem("user");
if (user) {
  user = JSON.parse(user);
} else {
  user = null;
}
</script>

<template>
    <div class="h-screen bg-[#E0F1FE] ">
        <Header title="Auditorias" backRoute="/home" />
        <Navbar />
        <div class="w-full p-6 mt-4 space-y-5">
          <Card nomeAuditoria="Auditoria 1 " textoBotao="Gerir Pedido" />
          <Card nomeAuditoria="Tralalero" textoBotao="Gerir Pedido" />
          <Card nomeAuditoria="Tralalero" textoBotao="Gerir Pedido" />
          <Card nomeAuditoria="Tralalero" textoBotao="Gerir Pedido" />
          <Card nomeAuditoria="Tralalero" textoBotao="Gerir Pedido" />
        </div>
    </div>
    
</template>