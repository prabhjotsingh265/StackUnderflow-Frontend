<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <div class="flex justify-center px-4 py-16">
    <div class="w-full max-w-sm rounded-lg border border-line bg-white p-8 shadow-sm">
      <h1 class="mb-6 text-center font-serif text-3xl font-semibold text-ink">{{ title }}</h1>
      <slot />
    </div>
  </div>
</template>
