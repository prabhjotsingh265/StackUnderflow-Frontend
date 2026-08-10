<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue3-toastify'
import { forgotPassword } from '@/api/auth'
import { getErrorMessage } from '@/utils/formErrors'
import AuthCard from '@/components/AuthCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const email = ref('')
const isSubmitting = ref(false)

async function handleSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const { data } = await forgotPassword(email.value)
    toast.success(data.message)
  } catch (error) {
    toast.error(getErrorMessage(error))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthCard title="Forgot your password?">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput v-model="email" label="Email" type="email" />
      <BaseButton type="submit" :loading="isSubmitting">
        {{ isSubmitting ? 'Sending…' : 'Send reset link' }}
      </BaseButton>
    </form>

    <p class="mt-6 text-center text-sm text-ink-muted">
      <RouterLink :to="{ name: 'login' }" class="font-medium text-accent hover:underline">Back to login</RouterLink>
    </p>
  </AuthCard>
</template>
