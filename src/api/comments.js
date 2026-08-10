import client from './client'

export function createComment(type, id, body) {
  return client.post(`/${type}/${id}/comments`, { body })
}

export function deleteComment(commentId) {
  return client.delete(`/comments/${commentId}`)
}
