<script setup>
defineProps({
  votesCount: { type: Number, required: true },
  userVote: { default: null },
  disabled: { type: Boolean, default: false },
})

defineEmits(['vote'])
</script>

<template>
  <div class="flex w-16 shrink-0 flex-col items-center gap-1 text-center">
    <button
      type="button"
      :disabled="disabled"
      :title="userVote === 1 ? 'Click to remove your upvote' : 'Upvote'"
      :aria-label="userVote === 1 ? 'Remove upvote' : 'Upvote'"
      :aria-pressed="userVote === 1"
      class="rounded text-xl leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
      :class="userVote === 1 ? 'text-accent' : 'text-ink-muted hover:text-ink'"
      @click="$emit('vote', 1)"
    >
      ▲
    </button>
    <div class="text-lg font-semibold text-ink">{{ votesCount }}</div>
    <button
      type="button"
      :disabled="disabled"
      :title="userVote === -1 ? 'Click to remove your downvote' : 'Downvote'"
      :aria-label="userVote === -1 ? 'Remove downvote' : 'Downvote'"
      :aria-pressed="userVote === -1"
      class="rounded text-xl leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40"
      :class="userVote === -1 ? 'text-accent' : 'text-ink-muted hover:text-ink'"
      @click="$emit('vote', -1)"
    >
      ▼
    </button>
    <div class="text-xs text-ink-muted">votes</div>
  </div>
</template>
