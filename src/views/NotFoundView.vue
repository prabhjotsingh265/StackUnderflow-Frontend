<script setup>
import { RouterLink } from 'vue-router'
import PageContainer from '@/components/PageContainer.vue'
</script>

<template>
  <PageContainer class="py-24 text-center">
    <p class="font-serif text-6xl font-semibold text-accent">404</p>
    <h1 class="mt-4 text-2xl font-semibold text-ink">Page not found</h1>
    <p class="mt-2 text-ink-muted">The page you're looking for doesn't exist or may have been moved.</p>
    <RouterLink
      :to="{ name: 'questions' }"
      class="mt-6 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-paper hover:bg-accent-hover"
    >
      Back to Questions
    </RouterLink>
  </PageContainer>
</template>
