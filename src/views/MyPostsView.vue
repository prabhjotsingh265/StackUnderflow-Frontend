<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue3-toastify'
import { getMyPosts } from '@/api/myPosts'
import PageContainer from '@/components/PageContainer.vue'

const posts = ref([])
const isLoading = ref(true)
const activeTab = ref('all')

const filteredPosts = computed(() => {
  if (activeTab.value === 'all') return posts.value
  return posts.value.filter((post) => post.type === activeTab.value.slice(0, -1))
})

onMounted(async () => {
  try {
    const { data } = await getMyPosts()
    posts.value = data.data
  } catch {
    toast.error('Could not load your posts.')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <PageContainer class="py-10">
    <h1 class="mb-6 font-serif text-2xl font-semibold text-ink">My Posts</h1>

    <div class="mb-4 flex gap-4 border-b border-line text-sm">
      <button
        v-for="tab in ['all', 'questions', 'answers']"
        :key="tab"
        type="button"
        class="border-b-2 px-1 pb-2 capitalize transition"
        :class="
          activeTab === tab
            ? 'border-accent font-medium text-ink'
            : 'border-transparent text-ink-muted hover:text-ink'
        "
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <p v-if="isLoading" class="text-ink-muted">Loading…</p>

    <div v-else-if="filteredPosts.length === 0" class="text-ink-muted">Nothing here yet.</div>

    <ul v-else class="divide-y divide-line">
      <li v-for="post in filteredPosts" :key="`${post.type}-${post.id}`" class="flex items-center gap-4 py-3">
        <span
          class="w-16 shrink-0 rounded px-2 py-1 text-center text-xs font-medium capitalize"
          :class="post.is_accepted ? 'bg-accent/10 text-accent' : 'bg-paper text-ink-muted'"
        >
          {{ post.type }}
        </span>
        <span class="w-12 shrink-0 text-center text-sm font-semibold text-ink">{{ post.votes_count }}</span>
        <RouterLink
          :to="{ name: 'questions.show', params: { slug: post.slug } }"
          class="min-w-0 flex-1 truncate text-sm text-ink hover:text-accent"
        >
          {{ post.title }}
        </RouterLink>
        <span class="shrink-0 text-xs text-ink-muted">{{ post.created_at }}</span>
      </li>
    </ul>
  </PageContainer>
</template>
