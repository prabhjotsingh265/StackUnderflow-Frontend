import client from './client'

export function createAnswer(questionSlug, body) {
  return client.post(`/questions/${questionSlug}/answers`, { body })
}

export function voteAnswer(answerId, value) {
  return client.post(`/answers/${answerId}/vote`, { value })
}

export function acceptAnswer(answerId) {
  return client.post(`/answers/${answerId}/accept`)
}

