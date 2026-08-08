<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="flex gap-4 border-b border-gray-200 bg-white p-4 text-sm">
      <RouterLink :to="{ name: 'questions' }">Questions</RouterLink>
      <RouterLink :to="{ name: 'questions.create' }">Ask</RouterLink>
      <RouterLink :to="{ name: 'my-posts' }">My Posts</RouterLink>
      <RouterLink :to="{ name: 'login' }">Login</RouterLink>
      <RouterLink :to="{ name: 'register' }">Register</RouterLink>
    </nav>

    <RouterView />
  </div>
</template>
