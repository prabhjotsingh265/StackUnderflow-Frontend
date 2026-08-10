export function getErrorMessage(error) {
  if (error.response?.status === 429) {
    return 'Too many attempts. Please wait a minute before trying again.'
  }

  return error.response?.data?.message || 'Something went wrong. Please try again.'
}
