import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_URL

export const AUTH_TOKEN_KEY = 'auth_token'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
    return Promise.reject(error)
  },
)

export default api

