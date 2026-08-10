import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useVote } from '../useVote'
import { useAuthStore } from '@/stores/auth'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('useVote', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    mockPush.mockClear()
  })

  it('redirects a guest to login instead of voting', async () => {
    const voteFn = vi.fn()
    const { vote } = useVote(voteFn)
    const target = { votes_count: 0, user_vote: null }

    await vote(target, 1)

    expect(mockPush).toHaveBeenCalledWith({ name: 'login' })
    expect(voteFn).not.toHaveBeenCalled()
  })

  it('applies a new vote for an authenticated user', async () => {
    const authStore = useAuthStore()
    authStore.token = 'fake-token'

    const voteFn = vi.fn().mockResolvedValue({ data: { votes_count: 5 } })
    const { vote } = useVote(voteFn)
    const target = { votes_count: 4, user_vote: null }

    await vote(target, 1)

    expect(voteFn).toHaveBeenCalledWith(target, 1)
    expect(target.votes_count).toBe(5)
    expect(target.user_vote).toBe(1)
  })

  it('toggles the vote off when clicking the same arrow again', async () => {
    const authStore = useAuthStore()
    authStore.token = 'fake-token'

    const voteFn = vi.fn().mockResolvedValue({ data: { votes_count: 3 } })
    const { vote } = useVote(voteFn)
    const target = { votes_count: 4, user_vote: 1 }

    await vote(target, 1)

    expect(target.user_vote).toBeNull()
  })

  it('switches the vote when clicking the opposite arrow', async () => {
    const authStore = useAuthStore()
    authStore.token = 'fake-token'

    const voteFn = vi.fn().mockResolvedValue({ data: { votes_count: 2 } })
    const { vote } = useVote(voteFn)
    const target = { votes_count: 4, user_vote: 1 }

    await vote(target, -1)

    expect(target.user_vote).toBe(-1)
  })

  it('ignores a second call while the first vote is still in flight', async () => {
    const authStore = useAuthStore()
    authStore.token = 'fake-token'

    let resolveVote
    const voteFn = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveVote = resolve
        }),
    )
    const { vote } = useVote(voteFn)
    const target = { votes_count: 0, user_vote: null }

    const firstCall = vote(target, 1)
    const secondCall = vote(target, 1)

    resolveVote({ data: { votes_count: 1 } })
    await firstCall
    await secondCall

    expect(voteFn).toHaveBeenCalledTimes(1)
  })
})
