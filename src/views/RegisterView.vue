<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '@/stores/auth'
import AuthCard from '@/components/AuthCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const errors = ref({})
const isSubmitting = ref(false)

async function handleSubmit() {
  isSubmitting.value = true
  errors.value = {}

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    toast.success('Account created')
    router.push({ name: 'questions' })
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    } else {
      toast.error('Something went wrong. Please try again.')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthCard title="Create your account">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput v-model="name" label="Name" :error="errors.name?.[0]" />
      <BaseInput v-model="email" label="Email" type="email" :error="errors.email?.[0]" />
      <BaseInput v-model="password" label="Password" type="password" :error="errors.password?.[0]" />
      <BaseInput v-model="passwordConfirmation" label="Confirm password" type="password" />

      <BaseButton type="submit" :loading="isSubmitting">
        {{ isSubmitting ? 'Creating account…' : 'Register' }}
      </BaseButton>
    </form>

    <p class="mt-6 text-center text-sm text-ink-muted">
      Already have an account?
      <RouterLink :to="{ name: 'login' }" class="font-medium text-accent hover:underline">
        Log in
    </RouterLink>
    </p>
  </AuthCard>
</template>
