const TOKEN_KEY = 'token'
const USER_KEY = 'auth_user'

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage

export const getAuthToken = () => {
  if (!canUseStorage()) return ''
  return localStorage.getItem(TOKEN_KEY) || ''
}

export const setAuthSession = (token, user) => {
  if (!canUseStorage()) return

  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export const getAuthUser = () => {
  if (!canUseStorage()) return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const clearAuthSession = () => {
  if (!canUseStorage()) return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const isAuthenticated = () => Boolean(getAuthToken())
