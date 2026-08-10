<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'

defineProps({
  label: { type: String, default: 'Body' },
  error: { type: String, default: '' },
})

const model = defineModel({ type: String, default: '' })
const activeTab = ref('write')

const previewHtml = computed(() => marked.parse(model.value || ''))
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-ink">{{ label }}</label>

    <div class="mt-1 overflow-hidden rounded-md border border-line">
      <div class="flex border-b border-line bg-paper text-sm">
        <button
          type="button"
          class="px-4 py-2"
          :class="activeTab === 'write' ? 'bg-white font-medium text-ink' : 'text-ink-muted'"
          @click="activeTab = 'write'"
        >
          Write
        </button>
        <button
          type="button"
          class="px-4 py-2"
          :class="activeTab === 'preview' ? 'bg-white font-medium text-ink' : 'text-ink-muted'"
          @click="activeTab = 'preview'"
        >
          Preview
        </button>
      </div>

      <textarea
        v-if="activeTab === 'write'"
        v-model="model"
        rows="10"
        class="w-full resize-y bg-white px-3 py-2 text-ink focus:outline-none"
        placeholder="Write in Markdown…"
      />
      <div v-else class="prose max-w-none px-3 py-2" v-html="previewHtml" />
    </div>

    <p v-if="error" class="mt-1 text-sm text-red-700">{{ error }}</p>
  </div>
</template>
