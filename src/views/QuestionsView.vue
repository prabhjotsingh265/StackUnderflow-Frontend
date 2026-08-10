<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue3-toastify'
import { getQuestions } from '@/api/questions'
import QuestionCard from '@/components/QuestionCard.vue'
import Pagination from '@/components/Pagination.vue'
import TagsSidebar from '@/components/TagsSidebar.vue'
import PageContainer from '@/components/PageContainer.vue'

const questions = ref([])
const meta = ref(null)
const isLoading = ref(true)

async function fetchQuestions(page = 1) {
  isLoading.value = true

  try {
    const { data } = await getQuestions(page)
    questions.value = data.data
    meta.value = data.meta
  } catch {
    toast.error('Could not load questions.')
  } finally {
    isLoading.value = false
  }
}

function handlePageChange(page) {
  fetchQuestions(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => fetchQuestions())
</script>

<template>
  <PageContainer class="py-10">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="font-serif text-2xl font-semibold text-ink">All Questions</h1>
      <RouterLink
        :to="{ name: 'questions.create' }"
        class="rounded-md bg-accent px-4 py-2 text-sm font-medium text-paper hover:bg-accent-hover"
      >
        Ask Question
      </RouterLink>
    </div>

    <div class="flex flex-col gap-8 md:flex-row">
      <div class="min-w-0 flex-1">
        <p v-if="isLoading" class="text-ink-muted">Loading questions…</p>

        <div v-else-if="questions.length === 0" class="text-ink-muted">
          No questions yet. Be the first to ask one.
        </div>

        <template v-else>
          <QuestionCard v-for="question in questions" :key="question.id" :question="question" />
          <Pagination v-if="meta" :meta="meta" class="mt-6" @change="handlePageChange" />
        </template>
      </div>

      <aside class="shrink-0 md:w-64">
        <TagsSidebar />
      </aside>
    </div>
  </PageContainer>
</template>
