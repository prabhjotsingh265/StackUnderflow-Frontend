<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { getQuestion, voteQuestion, toggleFavorite, deleteQuestion } from '@/api/questions'
import { toast } from 'vue3-toastify'
import { createAnswer, voteAnswer, acceptAnswer, updateAnswer, deleteAnswer } from '@/api/answers'
import { useAuthStore } from '@/stores/auth'
import { useVote } from '@/composables/useVote'
import PageContainer from '@/components/PageContainer.vue'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import BaseButton from '@/components/BaseButton.vue'
import VoteButtons from '@/components/VoteButtons.vue'
import CommentList from '@/components/CommentList.vue'
import QuestionDetailSkeleton from '@/components/QuestionDetailSkeleton.vue'

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

const editingAnswerId = ref(null)
const editAnswerBody = ref('')
const isUpdatingAnswer = ref(false)

async function fetchQuestion() {
  try {
    const { data } = await getQuestion(props.slug)
    question.value = data.data
    document.title = `${question.value.title} · StackUnderflow`
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

function startEditingAnswer(answer) {
  editingAnswerId.value = answer.id
  editAnswerBody.value = answer.body
}

function cancelEditingAnswer() {
  editingAnswerId.value = null
}

async function handleUpdateAnswer(answer) {
  if (isUpdatingAnswer.value) return
  isUpdatingAnswer.value = true

  try {
    const { data } = await updateAnswer(props.slug, answer.id, editAnswerBody.value)
    answer.body = data.answer.body
    answer.body_html = data.answer.body_html
    editingAnswerId.value = null
    toast.success(data.message)
  } catch (error) {
    if (error.response?.status === 422) {
      toast.error(error.response.data.errors.body?.[0])
    } else {
      toast.error('Could not update answer.')
    }
  } finally {
    isUpdatingAnswer.value = false
  }
}

async function handleDeleteAnswer(answer) {
  if (!confirm('Delete this answer? This cannot be undone.')) return

  try {
    await deleteAnswer(props.slug, answer.id)
    question.value.answers = question.value.answers.filter((a) => a.id !== answer.id)
    toast.success('Answer deleted.')
  } catch {
    toast.error('Could not delete this answer.')
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
    <QuestionDetailSkeleton v-if="isLoading" />

    <div v-else-if="!question" class="py-16 text-center text-ink-muted">
      <p>This question doesn't exist or may have been deleted.</p>
      <RouterLink :to="{ name: 'questions' }" class="mt-2 inline-block text-accent hover:underline"
        >Back to all questions</RouterLink
      >
    </div>

    <div v-else>
      <div class="flex flex-wrap items-center gap-3">
        <h1 class="font-serif text-3xl font-semibold text-ink">{{ question.title }}</h1>
        <span
          v-if="question.is_closed"
          class="rounded bg-paper px-2 py-1 text-xs font-medium text-ink-muted"
        >
          Closed
        </span>
      </div>
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
              class="flex items-center gap-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              :class="question.is_favorited ? 'text-accent' : 'text-ink-muted hover:text-ink'"
              :disabled="isTogglingFavorite"
              :aria-pressed="question.is_favorited"
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
            @deleted="question.comments = question.comments.filter((c) => c.id !== $event)"
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
            <span>
              {{ question.user?.name }} ({{ question.user?.reputation ?? 0 }} rep) asked {{ question.created_at }}
            </span>
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
            class="mt-2 w-full rounded px-2 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            :class="answer.is_accepted ? 'bg-accent text-paper' : 'border border-line text-ink-muted hover:bg-paper'"
            :aria-pressed="answer.is_accepted"
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
          <div v-if="editingAnswerId !== answer.id" class="prose max-w-none" v-html="answer.body_html" />
          <div v-else class="space-y-3">
            <MarkdownEditor v-model="editAnswerBody" />
            <div class="flex gap-2">
              <BaseButton :block="false" :loading="isUpdatingAnswer" @click="handleUpdateAnswer(answer)">
                Save
              </BaseButton>
              <BaseButton :block="false" variant="secondary" @click="cancelEditingAnswer"> Cancel </BaseButton>
            </div>
          </div>

          <CommentList
            :comments="answer.comments"
            type="answers"
            :id="answer.id"
            @added="answer.comments.push($event)"
            @deleted="answer.comments = answer.comments.filter((c) => c.id !== $event)"
          />

          <div
            v-if="editingAnswerId !== answer.id"
            class="mt-4 flex items-center justify-end gap-3 text-xs text-ink-muted"
          >
            <template v-if="authStore.user?.id === answer.user?.id">
              <button type="button" class="text-accent hover:underline" @click="startEditingAnswer(answer)">
                Edit
              </button>
              <button type="button" class="text-accent hover:underline" @click="handleDeleteAnswer(answer)">
                Delete
              </button>
            </template>
            <span>
              {{ answer.user?.name }} ({{ answer.user?.reputation ?? 0 }} rep) answered {{ answer.created_at }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="mb-4 font-serif text-xl font-semibold text-ink">Your Answer</h2>

        <div v-if="question.is_closed" class="rounded-md border border-line bg-white p-4 text-sm text-ink-muted">
          This question is closed and no longer accepting new answers.
        </div>

        <form
          v-else-if="authStore.isAuthenticated"
          @submit.prevent="handleAnswerSubmit"
          class="space-y-4"
        >
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
