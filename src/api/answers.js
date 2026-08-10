import client from './client'

export function createAnswer(questionSlug, body) {
  return client.post(`/questions/${questionSlug}/answers`, { body })
}
