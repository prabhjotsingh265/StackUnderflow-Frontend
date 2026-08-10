import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'

export function useVote(voteFn) {
  const authStore = useAuthStore()
  const router = useRouter()
  const isVoting = ref(false)

  async function vote(target, value) {
    if (isVoting.value) return
    if (!authStore.isAuthenticated) {
        router.push({ name: 'login' })
        return
    }

    isVoting.value = true

    try {
      const { data } = await voteFn(target, value)
      target.votes_count = data.votes_count
      target.user_vote = target.user_vote === value ? null : value
    } catch {
      toast.error('Could not register your vote.')
    } finally {
      isVoting.value = false
    }
  }

  return { vote, isVoting }
}
