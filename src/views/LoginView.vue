<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'
import { getErrorMessage } from '@/utils/formErrors'
import AuthCard from '@/components/AuthCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errors = ref({})
const isSubmitting = ref(false)

async function handleSubmit() {
  if (isSubmitting.value) return

  isSubmitting.value = true
  errors.value = {}

  try {
    await authStore.login({ email: email.value, password: password.value })
    toast.success('Logged in successfully')
    router.push({ name: 'questions' })
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    } else {
      toast.error(getErrorMessage(error))
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthCard title="Welcome back">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput v-model="email" label="Email" type="email" :error="errors.email?.[0]" />
      <BaseInput v-model="password" label="Password" type="password" :error="errors.password?.[0]" />

      <BaseButton type="submit" :loading="isSubmitting">
        {{ isSubmitting ? 'Logging in…' : 'Log in' }}
      </BaseButton>
    </form>

    <p class="mt-4 text-center text-sm text-ink-muted">
      <RouterLink :to="{ name: 'forgot-password' }" class="font-medium text-accent hover:underline"
        >Forgot your password?</RouterLink
      >
    </p>

    <p class="mt-2 text-center text-sm text-ink-muted">
      Don't have an account?
      <RouterLink :to="{ name: 'register' }" class="font-medium text-accent hover:underline"
        >Register</RouterLink
      >
    </p>
  </AuthCard>
</template>
