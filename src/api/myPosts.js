import client from './client'

export function getMyPosts() {
  return client.get('/my-posts')
}
