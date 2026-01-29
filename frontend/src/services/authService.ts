import api, { AUTH_TOKEN_KEY } from './api'

export type AuthUser = {
  id: string
  name?: string
  email: string
  role: string
}

type AuthResponse = {
  token: string
  user: AuthUser
}

export function getToken() {
  return typeof window === 'undefined'
    ? null
    : localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export async function signup(input: {
  name: string
  email: string
  password: string
}): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/signup', input)
  setToken(response.data.token)
  return response.data
}

export async function login(input: {
  email: string
  password: string
}): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', input)
  setToken(response.data.token)
  return response.data
}

export async function updateRole(role: string): Promise<AuthResponse> {
  const response = await api.put<AuthResponse>('/auth/role', { role })
  setToken(response.data.token)
  return response.data
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await api.get<{ user: AuthUser }>('/auth/me')
  return response.data.user
}

export async function getAllUsers(): Promise<AuthUser[]> {
  const response = await api.get<{ users: AuthUser[] }>('/auth/users')
  return response.data.users
}

export function logout() {
  clearToken()
}

