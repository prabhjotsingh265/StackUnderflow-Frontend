<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-paper">
    <Navbar />
    <RouterView />
  </div>
</template>
