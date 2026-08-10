<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { createQuestion } from '@/api/questions'
import PageContainer from '@/components/PageContainer.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import TagPicker from '@/components/TagPicker.vue'

const router = useRouter()

const title = ref('')
const body = ref('')
const tagIds = ref([])
const errors = ref({})
const isSubmitting = ref(false)

async function handleSubmit() {
  isSubmitting.value = true
  errors.value = {}

  try {
    const { data } = await createQuestion({
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
      <h1 class="mb-6 font-serif text-2xl font-semibold text-ink">Ask a question</h1>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <BaseInput v-model="title" label="Title" :error="errors.title?.[0]" />
        <MarkdownEditor v-model="body" label="Body" :error="errors.body?.[0]" />
        <TagPicker v-model="tagIds" />

        <BaseButton type="submit" :loading="isSubmitting">
          {{ isSubmitting ? 'Posting…' : 'Post your question' }}
        </BaseButton>
      </form>
    </div>
  </PageContainer>
</template>
