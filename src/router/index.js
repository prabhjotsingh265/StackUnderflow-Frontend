import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'questions',
    component: () => import('@/views/QuestionsView.vue'),
  },
  {
    path: '/questions/create',
    name: 'questions.create',
    component: () => import('@/views/AskQuestionView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/questions/:id/edit',
    name: 'questions.edit',
    component: () => import('@/views/EditQuestionView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/questions/:slug',
    name: 'questions.show',
    component: () => import('@/views/QuestionView.vue'),
    props: true,
  },
  {
    path: '/my-posts',
    name: 'my-posts',
    component: () => import('@/views/MyPostsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPasswordView.vue'),
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/ResetPasswordView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
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

export default router
