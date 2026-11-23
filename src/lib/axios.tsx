import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost',
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request Interceptor: أضف التوكن لكل طلب ───
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Response Interceptor: جدد التوكن تلقائياً ───
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const userId = localStorage.getItem('userId')

        const res = await axios.post('http://localhost:80/auth/refresh', {
          userId,
          refreshToken,
        })

        localStorage.setItem('accessToken', res.data.accessToken)
        localStorage.setItem('refreshToken', res.data.refreshToken)

        original.headers.Authorization = `Bearer ${res.data.accessToken}`
        return api(original)

      } catch {
        localStorage.clear()
      
      }
    }

    return Promise.reject(error)
  }
)

export default api