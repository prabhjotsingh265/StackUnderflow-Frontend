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


