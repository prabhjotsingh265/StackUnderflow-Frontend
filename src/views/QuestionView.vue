<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue3-toastify'
import { getQuestion } from '@/api/questions'
import { createAnswer } from '@/api/answers'
import { useAuthStore } from '@/stores/auth'
import PageContainer from '@/components/PageContainer.vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
  slug: { type: String, required: true },
})

const authStore = useAuthStore()

const question = ref(null)
const isLoading = ref(true)

const newAnswerBody = ref('')
const answerError = ref('')
const isSubmittingAnswer = ref(false)

async function fetchQuestion() {
  try {
    const { data } = await getQuestion(props.slug)
    question.value = data.data
  } catch {
    toast.error('Could not load this question.')
  } finally {
    isLoading.value = false
  }
}

async function handleAnswerSubmit() {
  isSubmittingAnswer.value = true
  answerError.value = ''

  try {
    const { data } = await createAnswer(props.slug, newAnswerBody.value)
    question.value.answers.push(data.answer)
    question.value.answers.sort((a, b) => b.votes_count - a.votes_count)
    newAnswerBody.value = ''
    toast.success(data.message)
  } catch (error) {
    if (error.response?.status === 422) {
      answerError.value = error.response.data.errors.body?.[0]
    } else {
      toast.error('Something went wrong. Please try again.')
    }
  } finally {
    isSubmittingAnswer.value = false
  }
}

onMounted(fetchQuestion)
</script>

<template>
  <PageContainer class="py-10">
    <p v-if="isLoading" class="text-ink-muted">Loading…</p>

    <div v-else-if="question">
      <h1 class="font-serif text-3xl font-semibold text-ink">{{ question.title }}</h1>
      <div class="mt-2 text-sm text-ink-muted">
        Asked {{ question.created_at }} · Viewed {{ question.views_count }} times
      </div>

      <div class="mt-6 flex gap-6 border-b border-line pb-8">
        <div class="w-16 shrink-0 text-center">
          <div class="text-lg font-semibold text-ink">{{ question.votes_count }}</div>
          <div class="text-xs text-ink-muted">votes</div>
        </div>

        <div class="min-w-0 flex-1">
          <div class="prose max-w-none" v-html="question.body_html" />

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tag in question.tags"
              :key="tag.id"
              class="rounded bg-paper px-2 py-1 text-xs text-ink-muted"
            >
              {{ tag.name }}
            </span>
          </div>

          <div class="mt-4 flex justify-end text-xs text-ink-muted">
            {{ question.user?.name }} asked {{ question.created_at }}
          </div>
        </div>
      </div>

      <h2 class="mt-8 font-serif text-xl font-semibold text-ink">
        {{ question.answers?.length || 0 }} Answers
      </h2>

      <div v-for="answer in question.answers" :key="answer.id" class="flex gap-6 border-b border-line py-8">
        <div class="w-16 shrink-0 text-center">
          <div class="text-lg font-semibold text-ink">{{ answer.votes_count }}</div>
          <div class="text-xs text-ink-muted">votes</div>
          <div
            v-if="answer.is_accepted"
            class="mt-2 rounded bg-accent/10 px-2 py-1 text-xs font-medium text-accent"
          >
            Accepted
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <div class="prose max-w-none" v-html="answer.body_html" />

          <div
            v-if="answer.comments?.length"
            class="mt-4 space-y-2 border-t border-line pt-3 text-sm text-ink-muted"
          >
            <div v-for="comment in answer.comments" :key="comment.id">
              {{ comment.body }} — <span class="font-medium">{{ comment.user?.name }}</span>
            </div>
          </div>

          <div class="mt-4 flex justify-end text-xs text-ink-muted">
            {{ answer.user?.name }} answered {{ answer.created_at }}
          </div>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="mb-4 font-serif text-xl font-semibold text-ink">Your Answer</h2>

        <form v-if="authStore.isAuthenticated" @submit.prevent="handleAnswerSubmit" class="space-y-4">
          <MarkdownEditor v-model="newAnswerBody" :error="answerError" />
          <BaseButton type="submit" :loading="isSubmittingAnswer" :block="false">
            {{ isSubmittingAnswer ? 'Posting…' : 'Post Your Answer' }}
          </BaseButton>
        </form>

        <div v-else class="rounded-md border border-line bg-white p-4 text-sm text-ink-muted">
          <RouterLink :to="{ name: 'login' }" class="font-medium text-accent hover:underline">Log in</RouterLink>
          to post an answer.
        </div>
      </div>
    </div>
  </PageContainer>
</template>
