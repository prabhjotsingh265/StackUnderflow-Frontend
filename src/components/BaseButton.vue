<script setup>
defineProps({
  type: { type: String, default: 'button' },
  loading: { type: Boolean, default: false },
  variant: { type: String, default: 'primary' },
})
</script>

<template>
  <button
    :type="type"
    :disabled="loading"
    class="w-full rounded-md px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
    :class="
      variant === 'primary'
        ? 'bg-accent text-paper hover:bg-accent-hover'
        : 'border border-line bg-white text-ink hover:bg-paper'
    "
  >
    <slot />
  </button>
</template>
