import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import * as authApi from '@/api/auth'

vi.mock('@/api/auth')

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('starts unauthenticated when localStorage is empty', () => {
    const store = useAuthStore()

    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })

  it('stores the user and token after a successful login, and persists them to localStorage', async () => {
    const store = useAuthStore()
    authApi.login.mockResolvedValue({
      data: { user: { id: 1, name: 'Prince' }, token: 'abc123' },
    })

    await store.login({ email: 'prince@example.com', password: 'secret123' })

    expect(store.isAuthenticated).toBe(true)
    expect(store.user).toEqual({ id: 1, name: 'Prince' })
    expect(localStorage.getItem('token')).toBe('abc123')
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 1, name: 'Prince' })
  })

  it('clears local state on logout even if the API call fails', async () => {
    const store = useAuthStore()
    authApi.login.mockResolvedValue({
      data: { user: { id: 1, name: 'Prince' }, token: 'abc123' },
    })
    await store.login({ email: 'prince@example.com', password: 'secret123' })

    authApi.logout.mockRejectedValue(new Error('network error'))

    await store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })
})
