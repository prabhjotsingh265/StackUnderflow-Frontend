<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'
import LogoIcon from '@/components/icons/LogoIcon.vue'
import PageContainer from '@/components/PageContainer.vue'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  toast.success('Logged out')
  router.push({ name: 'login' })
}
</script>

<template>
  <nav class="border-b border-line bg-white">
    <PageContainer class="flex items-center justify-between py-4">
      <div class="flex items-center gap-6">
        <RouterLink :to="{ name: 'questions' }" class="flex items-center gap-2 text-accent">
          <LogoIcon class="h-7 w-7" />
          <span class="font-serif text-xl font-semibold text-ink">StackUnderflow</span>
        </RouterLink>
        <RouterLink :to="{ name: 'questions.create' }" class="text-sm text-ink-muted hover:text-ink">
          Ask a question
        </RouterLink>
        <RouterLink
          v-if="authStore.isAuthenticated"
          :to="{ name: 'my-posts' }"
          class="text-sm text-ink-muted hover:text-ink"
        >
          My posts
        </RouterLink>
      </div>

      <div class="flex items-center gap-4 text-sm">
        <template v-if="authStore.isAuthenticated">
          <span class="text-ink-muted">{{ authStore.user?.name }}</span>
          <button @click="handleLogout" class="text-ink-muted hover:text-ink">Log out</button>
        </template>
        <template v-else>
          <RouterLink :to="{ name: 'login' }" class="text-ink-muted hover:text-ink">Log in</RouterLink>
          <RouterLink
            :to="{ name: 'register' }"
            class="rounded-md bg-accent px-3 py-1.5 text-paper hover:bg-accent-hover"
          >
            Register
          </RouterLink>
        </template>
      </div>
    </PageContainer>
  </nav>
</template>
