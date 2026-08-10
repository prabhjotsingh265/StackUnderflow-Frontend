import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'questions',
    component: () => import('@/views/QuestionsView.vue'),
    meta: { title: 'All Questions' },
  },
  {
    path: '/questions/create',
    name: 'questions.create',
    component: () => import('@/views/AskQuestionView.vue'),
    meta: { requiresAuth: true, title: 'Ask a Question' },
  },
  {
    path: '/questions/:slug/edit',
    name: 'questions.edit',
    component: () => import('@/views/EditQuestionView.vue'),
    meta: { requiresAuth: true, title: 'Edit Question' },
    props: true,
  },
  {
    path: '/questions/:slug',
    name: 'questions.show',
    component: () => import('@/views/QuestionView.vue'),
    props: true,
    // No static title here — QuestionView.vue overrides document.title
    // once the real question loads, since the title is dynamic content.
    meta: { title: 'Question' },
  },
  {
    path: '/my-posts',
    name: 'my-posts',
    component: () => import('@/views/MyPostsView.vue'),
    meta: { requiresAuth: true, title: 'My Posts' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Log In' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: 'Register' },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPasswordView.vue'),
    meta: { title: 'Forgot Password' },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/ResetPasswordView.vue'),
    meta: { title: 'Reset Password' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · StackUnderflow` : 'StackUnderflow'
})

export default router
