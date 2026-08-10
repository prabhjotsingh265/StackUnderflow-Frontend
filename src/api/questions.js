import client from './client'

export function getQuestions(page = 1) {
  return client.get('/questions', { params: { page } })
}

export function getQuestion(slug) {
  return client.get(`/questions/${slug}`)
}

export function createQuestion(payload) {
  return client.post('/questions', payload)
}

export function voteQuestion(slug, value) {
  return client.post(`/questions/${slug}/vote`, { value })
}

export function toggleFavorite(slug) {
  return client.post(`/questions/${slug}/favorites`)
}

export function updateQuestion(slug, payload) {
  return client.patch(`/questions/${slug}`, payload)
}

export function deleteQuestion(slug) {
  return client.delete(`/questions/${slug}`)
}
