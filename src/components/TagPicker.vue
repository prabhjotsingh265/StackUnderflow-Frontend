<script setup>
import { ref, onMounted } from 'vue'
import { getTags } from '@/api/tags'

const model = defineModel({ type: Array, default: () => [] })

const allTags = ref([])

onMounted(async () => {
  const { data } = await getTags()
  allTags.value = data.data
})

function toggleTag(id) {
  if (model.value.includes(id)) {
    model.value = model.value.filter((tagId) => tagId !== id)
  } else if (model.value.length < 5) {
    model.value = [...model.value, id]
  }
}
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-ink">Tags (up to 5)</label>
    <div class="mt-1 flex flex-wrap gap-2">
      <button
        v-for="tag in allTags"
        :key="tag.id"
        type="button"
        class="rounded px-2 py-1 text-xs transition"
        :class="
          model.includes(tag.id)
            ? 'bg-accent text-paper'
            : 'border border-line bg-white text-ink-muted hover:bg-paper'
        "
        @click="toggleTag(tag.id)"
      >
        {{ tag.name }}
      </button>
    </div>
  </div>
</template>
