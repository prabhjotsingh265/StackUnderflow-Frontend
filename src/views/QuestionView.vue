<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { getQuestion, voteQuestion, toggleFavorite, deleteQuestion } from '@/api/questions'
import { toast } from 'vue3-toastify'
import { createAnswer, voteAnswer, acceptAnswer } from '@/api/answers'
import { useAuthStore } from '@/stores/auth'
import { useVote } from '@/composables/useVote'
import PageContainer from '@/components/PageContainer.vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import BaseButton from '@/components/BaseButton.vue'
import VoteButtons from '@/components/VoteButtons.vue'
import CommentList from '@/components/CommentList.vue'

const props = defineProps({
  slug: { type: String, required: true },
})

const authStore = useAuthStore()

const question = ref(null)
const isLoading = ref(true)

const newAnswerBody = ref('')
const answerError = ref('')
const isSubmittingAnswer = ref(false)

const { vote: castQuestionVote, isVoting: isVotingQuestion } = useVote((q, value) => voteQuestion(q.slug, value))
const { vote: castAnswerVote, isVoting: isVotingAnswer } = useVote((a, value) => voteAnswer(a.id, value))

const router = useRouter()
const isTogglingFavorite = ref(false)


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

async function handleAnswerVote(answer, value) {
  await castAnswerVote(answer, value)
  question.value.answers.sort((a, b) => b.votes_count - a.votes_count)
}

async function handleAnswerSubmit() {
  if (isSubmittingAnswer.value) return

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

async function handleAcceptAnswer(answer) {
  try {
    await acceptAnswer(answer.id)
    const wasAccepted = answer.is_accepted
    question.value.answers.forEach((a) => {
      a.is_accepted = false
    })
    answer.is_accepted = !wasAccepted
  } catch {
    toast.error('Could not update the accepted answer.')
  }
}

async function handleToggleFavorite() {
  if (isTogglingFavorite.value) return

  if (!authStore.isAuthenticated) {
    router.push({ name: 'login' })
    return
  }

  isTogglingFavorite.value = true

  try {
    const { data } = await toggleFavorite(props.slug)
    question.value.is_favorited = data.favorited
    question.value.favorites_count += data.favorited ? 1 : -1
  } catch {
    toast.error('Could not update bookmark.')
  } finally {
    isTogglingFavorite.value = false
  }
}

async function handleDeleteQuestion() {
  if (!confirm('Delete this question? This cannot be undone.')) return

  try {
    await deleteQuestion(props.slug)
    toast.success('Question deleted.')
    router.push({ name: 'questions' })
  } catch {
    toast.error('Could not delete this question.')
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
        <VoteButtons
          :votes-count="question.votes_count"
          :user-vote="question.user_vote"
          :disabled="isVotingQuestion"
          @vote="castQuestionVote(question, $event)"
        />

        <div class="min-w-0 flex-1">
          <div class="prose max-w-none" v-html="question.body_html" />

          <div class="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in question.tags"
                :key="tag.id"
                class="rounded bg-paper px-2 py-1 text-xs text-ink-muted"
              >
                {{ tag.name }}
              </span>
            </div>

            <button
              type="button"
              class="flex items-center gap-1 text-xs font-medium transition"
              :class="question.is_favorited ? 'text-accent' : 'text-ink-muted hover:text-ink'"
              :disabled="isTogglingFavorite"
              @click="handleToggleFavorite"
            >
              {{ question.is_favorited ? '★ Bookmarked' : '☆ Bookmark' }}
              <span v-if="question.favorites_count">({{ question.favorites_count }})</span>
            </button>
          </div>

          <CommentList
            :comments="question.comments"
            type="questions"
            :id="question.id"
            @added="question.comments.push($event)"
          />

          <div class="mt-4 flex items-center justify-end gap-3 text-xs text-ink-muted">
            <template v-if="authStore.user?.id === question.user?.id">
              <RouterLink
                :to="{ name: 'questions.edit', params: { slug: question.slug } }"
                class="text-accent hover:underline"
              >
                Edit
              </RouterLink>
              <button
                v-if="!question.answers?.length"
                type="button"
                class="text-accent hover:underline"
                @click="handleDeleteQuestion"
              >
                Delete
              </button>
            </template>
            <span>{{ question.user?.name }} asked {{ question.created_at }}</span>
          </div>
        </div>
      </div>

      <h2 class="mt-8 font-serif text-xl font-semibold text-ink">
        {{ question.answers?.length || 0 }} Answers
      </h2>

      <div v-for="answer in question.answers" :key="answer.id" class="flex gap-6 border-b border-line py-8">
        <div class="shrink-0">
          <VoteButtons
            :votes-count="answer.votes_count"
            :user-vote="answer.user_vote"
            :disabled="isVotingAnswer"
            @vote="handleAnswerVote(answer, $event)"
          />
          <button
            v-if="authStore.user?.id === answer.question_user_id"
            type="button"
            class="mt-2 w-full rounded px-2 py-1 text-xs font-medium transition"
            :class="answer.is_accepted ? 'bg-accent text-paper' : 'border border-line text-ink-muted hover:bg-paper'"
            @click="handleAcceptAnswer(answer)"
          >
            {{ answer.is_accepted ? '✓ Accepted' : 'Accept' }}
          </button>
          <div
            v-else-if="answer.is_accepted"
            class="mt-2 rounded bg-accent/10 px-2 py-1 text-center text-xs font-medium text-accent"
          >
            Accepted
          </div>

        </div>

        <div class="min-w-0 flex-1">
          <div class="prose max-w-none" v-html="answer.body_html" />

          <CommentList
            :comments="answer.comments"
            type="answers"
            :id="answer.id"
            @added="answer.comments.push($event)"
          />

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
