import client from './client'

export function register(payload) {
  return client.post('/register', payload)
}

export function login(payload) {
  return client.post('/login', payload)
}

export function logout() {
  return client.post('/logout')
}

export function forgotPassword(email) {
  return client.post('/forgot-password', { email })
}

export function resetPassword(payload) {
  return client.post('/reset-password', payload)
}

