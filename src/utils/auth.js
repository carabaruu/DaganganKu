// src/utils/auth.js

export function simpanLogin(token, user) {
  localStorage.setItem('dk_token', token)
  localStorage.setItem('dk_user', JSON.stringify(user))
}

export function ambilToken() {
  return localStorage.getItem('dk_token')
}

export function ambilUser() {
  const raw = localStorage.getItem('dk_user')
  return raw ? JSON.parse(raw) : null
}

export function updateUserLocal(updates) {
  const user = ambilUser()
  if (user) simpanLogin(ambilToken(), { ...user, ...updates })
}

export function hapusLogin() {
  localStorage.removeItem('dk_token')
  localStorage.removeItem('dk_user')
}

export function sudahLogin() {
  return !!ambilToken()
}