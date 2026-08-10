<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import { resetPassword } from '@/api/auth'
import { getErrorMessage } from '@/utils/formErrors'
import AuthCard from '@/components/AuthCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const route = useRoute()
const router = useRouter()

const token = route.query.token
const email = route.query.email

const password = ref('')
const passwordConfirmation = ref('')
const errors = ref({})
const isSubmitting = ref(false)

async function handleSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  errors.value = {}

  try {
    const { data } = await resetPassword({
      token,
      email,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    toast.success(data.message)
    router.push({ name: 'login' })
  } catch (error) {
    if (error.response?.status === 422 && error.response.data.errors?.password) {
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
  <AuthCard title="Reset your password">
    <p class="mb-4 text-center text-sm text-ink-muted">Resetting password for {{ email }}</p>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput v-model="password" label="New password" type="password" :error="errors.password?.[0]" />
      <BaseInput v-model="passwordConfirmation" label="Confirm new password" type="password" />

      <BaseButton type="submit" :loading="isSubmitting">
        {{ isSubmitting ? 'Resetting…' : 'Reset password' }}
      </BaseButton>
    </form>
  </AuthCard>
</template>
