<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { createComment } from '@/api/comments'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  comments: { type: Array, default: () => [] },
  type: { type: String, required: true },
  id: { type: Number, required: true },
})

const emit = defineEmits(['added'])

const authStore = useAuthStore()
const router = useRouter()

const isAdding = ref(false)
const newBody = ref('')
const isSubmitting = ref(false)

function startAdding() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login' })
    return
  }
  isAdding.value = true
}

async function submitComment() {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    const { data } = await createComment(props.type, props.id, newBody.value)
    emit('added', data.comment)
    newBody.value = ''
    isAdding.value = false
  } catch (error) {
    if (error.response?.status === 422) {
      toast.error(error.response.data.errors.body?.[0])
    } else {
      toast.error('Could not add comment.')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="mt-4 space-y-2 border-t border-line pt-3 text-sm">
    <div v-for="comment in comments" :key="comment.id" class="text-ink-muted">
      {{ comment.body }} — <span class="font-medium">{{ comment.user?.name }}</span>
    </div>

    <form v-if="isAdding" @submit.prevent="submitComment" class="flex gap-2">
      <input
        v-model="newBody"
        type="text"
        placeholder="Add a comment…"
        class="flex-1 rounded border border-line px-2 py-1 text-xs focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        :disabled="isSubmitting"
        class="text-xs font-medium text-accent hover:underline disabled:opacity-50"
      >
        Add
      </button>
    </form>
    <button v-else type="button" class="text-xs text-ink-muted hover:text-accent" @click="startAdding">
      Add a comment
    </button>
  </div>
</template>
