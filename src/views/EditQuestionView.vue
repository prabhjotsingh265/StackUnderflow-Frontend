<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { getQuestion, updateQuestion } from '@/api/questions'
import PageContainer from '@/components/PageContainer.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import TagPicker from '@/components/TagPicker.vue'

const props = defineProps({
  slug: { type: String, required: true },
})

const router = useRouter()

const title = ref('')
const body = ref('')
const tagIds = ref([])
const errors = ref({})
const isLoading = ref(true)
const isSubmitting = ref(false)

onMounted(async () => {
  try {
    const { data } = await getQuestion(props.slug)
    title.value = data.data.title
    body.value = data.data.body
    tagIds.value = data.data.tags.map((tag) => tag.id)
  } catch {
    toast.error('Could not load this question.')
  } finally {
    isLoading.value = false
  }
})

async function handleSubmit() {
  if (isSubmitting.value) return

  isSubmitting.value = true
  errors.value = {}

  try {
    const { data } = await updateQuestion(props.slug, {
      title: title.value,
      body: body.value,
      tag_ids: tagIds.value,
    })
    toast.success(data.message)
    router.push({ name: 'questions.show', params: { slug: data.question.slug } })
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    } else {
      toast.error('Something went wrong. Please try again.')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <PageContainer class="py-10">
    <div class="mx-auto max-w-2xl">
      <h1 class="mb-6 font-serif text-2xl font-semibold text-ink">Edit question</h1>

      <p v-if="isLoading" class="text-ink-muted">Loading…</p>

      <form v-else @submit.prevent="handleSubmit" class="space-y-5">
        <BaseInput v-model="title" label="Title" :error="errors.title?.[0]" />
        <MarkdownEditor v-model="body" label="Body" :error="errors.body?.[0]" />
        <TagPicker v-model="tagIds" />

        <BaseButton type="submit" :loading="isSubmitting">
          {{ isSubmitting ? 'Saving…' : 'Save changes' }}
        </BaseButton>
      </form>
    </div>
  </PageContainer>
</template>
