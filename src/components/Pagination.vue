<script setup>
defineProps({
  meta: { type: Object, required: true },
})

defineEmits(['change'])
</script>

<template>
  <div class="flex items-center justify-between border-t border-line pt-4 text-sm text-ink-muted">
    <button
      :disabled="meta.current_page <= 1"
      @click="$emit('change', meta.current_page - 1)"
      class="rounded-md border border-line px-3 py-1.5 hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
    >
      Previous
    </button>

    <span>Page {{ meta.current_page }} of {{ meta.last_page }}</span>

    <button
      :disabled="meta.current_page >= meta.last_page"
      @click="$emit('change', meta.current_page + 1)"
      class="rounded-md border border-line px-3 py-1.5 hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
    >
      Next
    </button>
  </div>
</template>
