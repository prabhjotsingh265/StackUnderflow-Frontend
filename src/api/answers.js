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

export function updateAnswer(questionSlug, answerId, body) {
  return client.patch(`/questions/${questionSlug}/answers/${answerId}`, { body })
}

export function deleteAnswer(questionSlug, answerId) {
  return client.delete(`/questions/${questionSlug}/answers/${answerId}`)
}
