<script setup>
defineProps({
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
})

const model = defineModel({ type: String, default: '' })
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-ink">{{ label }}</label>
    <input
      v-model="model"
      :type="type"
      class="mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-ink shadow-sm transition focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
    />
    <p v-if="error" class="mt-1 text-sm text-red-700">{{ error }}</p>
  </div>
</template>
