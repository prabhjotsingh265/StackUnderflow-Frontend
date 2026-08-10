<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  question: { type: Object, required: true },
})
</script>

<template>
  <div class="flex gap-6 border-b border-line py-6 last:border-b-0">
    <div class="flex w-16 shrink-0 flex-col items-center gap-3 text-center text-xs text-ink-muted">
      <div>
        <div class="text-base font-semibold text-ink">{{ question.votes_count }}</div>
        <div>votes</div>
      </div>
      <div class="rounded px-2 py-1" :class="question.status === 'answered-accepted' ? 'bg-accent/10' : ''">
        <div
          class="text-base font-semibold"
          :class="question.status === 'answered-accepted' ? 'text-accent' : 'text-ink'"
        >
          {{ question.answers_count }}
        </div>
        <div>answers</div>
      </div>
      <div>
        <div class="text-base font-semibold text-ink">{{ question.views_count }}</div>
        <div>views</div>
      </div>
    </div>

    <div class="min-w-0 flex-1">
      <RouterLink
        :to="{ name: 'questions.show', params: { slug: question.slug } }"
        class="font-serif text-lg font-semibold text-ink hover:text-accent"
      >
        {{ question.title }}
      </RouterLink>
      <p class="mt-1 text-sm text-ink-muted">{{ question.excerpt }}</p>

      <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in question.tags"
            :key="tag.id"
            class="rounded bg-paper px-2 py-0.5 text-xs text-ink-muted"
          >
            {{ tag.name }}
          </span>
        </div>
        <div class="text-xs text-ink-muted">{{ question.user?.name }} asked {{ question.created_at }}</div>
      </div>
    </div>
  </div>
</template>
