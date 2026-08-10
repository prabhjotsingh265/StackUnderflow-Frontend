<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { toast } from 'vue3-toastify'
import { getQuestions } from '@/api/questions'
import QuestionCard from '@/components/QuestionCard.vue'
import QuestionCardSkeleton from '@/components/QuestionCardSkeleton.vue'
import Pagination from '@/components/Pagination.vue'
import TagsSidebar from '@/components/TagsSidebar.vue'
import PageContainer from '@/components/PageContainer.vue'

const route = useRoute()
const router = useRouter()

const questions = ref([])
const meta = ref(null)
const isLoading = ref(true)
const searchInput = ref(route.query.search || '')

async function fetchQuestions() {
  isLoading.value = true

  try {
    const { data } = await getQuestions({
      page: route.query.page,
      tag: route.query.tag,
      search: route.query.search,
    })
    questions.value = data.data
    meta.value = data.meta
  } catch {
    toast.error('Could not load questions.')
  } finally {
    isLoading.value = false
  }
}

function handlePageChange(page) {
  router.push({ query: { ...route.query, page } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleSearchSubmit() {
  router.push({ query: { ...route.query, search: searchInput.value || undefined, page: undefined } })
}

function clearTagFilter() {
  const { tag, page, ...rest } = route.query
  router.push({ query: rest })
}

watch(() => route.query, fetchQuestions, { immediate: true })
</script>

<template>
  <PageContainer class="py-10">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 class="font-serif text-2xl font-semibold text-ink">All Questions</h1>

      <div class="flex items-center gap-3">
        <form @submit.prevent="handleSearchSubmit">
          <input
            v-model="searchInput"
            type="search"
            placeholder="Search by title or author…"
            class="w-56 rounded-md border border-line px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </form>

        <RouterLink
          :to="{ name: 'questions.create' }"
          class="rounded-md bg-accent px-4 py-2 text-sm font-medium text-paper hover:bg-accent-hover"
        >
          Ask Question
        </RouterLink>
      </div>
    </div>

    <div v-if="route.query.tag" class="mb-4 flex items-center gap-2 text-sm text-ink-muted">
      Filtering by
      <span class="rounded bg-accent/10 px-2 py-1 text-xs font-medium text-accent">{{ route.query.tag }}</span>
      <button type="button" class="text-accent hover:underline" @click="clearTagFilter">Clear</button>
    </div>

    <div class="flex flex-col gap-8 md:flex-row">
      <div class="min-w-0 flex-1">
        <template v-if="isLoading">
          <QuestionCardSkeleton v-for="n in 5" :key="n" />
        </template>

        <div v-else-if="questions.length === 0" class="text-ink-muted">
          No questions found. Try a different search or filter.
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
