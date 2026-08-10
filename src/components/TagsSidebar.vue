<script setup>
import { ref, onMounted } from 'vue'
import { getTags } from '@/api/tags'

const tags = ref([])

onMounted(async () => {
  const { data } = await getTags()
  tags.value = data.data
})
</script>

<template>
  <div class="rounded-lg border border-line bg-white p-5">
    <h2 class="mb-3 font-serif text-base font-semibold text-ink">Tags</h2>
    <div class="flex flex-wrap gap-2">
      <span v-for="tag in tags" :key="tag.id" class="rounded bg-paper px-2 py-1 text-xs text-ink-muted">
        {{ tag.name }}
      </span>
    </div>
  </div>
</template>
