import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import CommentList from '../CommentList.vue'
import { useAuthStore } from '@/stores/auth'
import * as commentsApi from '@/api/comments'

vi.mock('@/api/comments')
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('CommentList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('only shows a delete button on comments the current user owns', () => {
    const authStore = useAuthStore()
    authStore.user = { id: 1, name: 'Prince' }
    authStore.token = 'fake-token'

    const wrapper = mount(CommentList, {
      props: {
        comments: [
          { id: 1, body: 'My comment', user: { id: 1, name: 'Prince' } },
          { id: 2, body: "Someone else's comment", user: { id: 2, name: 'Stranger' } },
        ],
        type: 'questions',
        id: 10,
      },
    })

    const deleteButtons = wrapper.findAll('button[aria-label^="Delete comment"]')
    expect(deleteButtons).toHaveLength(1)
  })

  it('emits "deleted" with the comment id after a successful delete', async () => {
    const authStore = useAuthStore()
    authStore.user = { id: 1, name: 'Prince' }
    authStore.token = 'fake-token'
    commentsApi.deleteComment.mockResolvedValue({})
    vi.stubGlobal('confirm', () => true)

    const wrapper = mount(CommentList, {
      props: {
        comments: [{ id: 1, body: 'My comment', user: { id: 1, name: 'Prince' } }],
        type: 'questions',
        id: 10,
      },
    })

    await wrapper.find('button[aria-label^="Delete comment"]').trigger('click')
    await flushPromises()

    expect(commentsApi.deleteComment).toHaveBeenCalledWith(1)
    expect(wrapper.emitted('deleted')).toEqual([[1]])
  })

  it('does not emit "deleted" if the user cancels the confirmation', async () => {
    const authStore = useAuthStore()
    authStore.user = { id: 1, name: 'Prince' }
    authStore.token = 'fake-token'
    vi.stubGlobal('confirm', () => false)

    const wrapper = mount(CommentList, {
      props: {
        comments: [{ id: 1, body: 'My comment', user: { id: 1, name: 'Prince' } }],
        type: 'questions',
        id: 10,
      },
    })

    await wrapper.find('button[aria-label^="Delete comment"]').trigger('click')
    await flushPromises()

    expect(commentsApi.deleteComment).not.toHaveBeenCalled()
    expect(wrapper.emitted('deleted')).toBeUndefined()
  })
})
