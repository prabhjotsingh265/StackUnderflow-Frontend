<script setup>
defineProps({
  type: { type: String, default: 'button' },
  loading: { type: Boolean, default: false },
  variant: { type: String, default: 'primary' },
  block: { type: Boolean, default: true },
})
</script>

<template>
  <button
    :type="type"
    :disabled="loading"
    class="rounded-md px-4 py-2 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-50"
    :class="[
      block ? 'w-full' : 'w-auto',
      variant === 'primary'
        ? 'bg-accent text-paper hover:bg-accent-hover'
        : 'border border-line bg-white text-ink hover:bg-paper',
    ]"
  >
    <slot />
  </button>
</template>
