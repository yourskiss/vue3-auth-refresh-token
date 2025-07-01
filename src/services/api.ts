import axios from 'axios'
import { useAuthStore } from './../stores/auth'

const api = axios.create({ baseURL: 'https://dummyjson.com/auth' })

let isRefreshing = false
let queue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = []

const processQueue = (err: any, token: string | null = null) => {
  queue.forEach(p => err ? p.reject(err) : p.resolve(token!))
  queue = []
}

api.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.accessToken) config.headers.Authorization = `Bearer ${auth.accessToken}`
  return config
})

api.interceptors.response.use(
  res => res,
  async err => {
    const auth = useAuthStore()
    const req = err.config
    if (err.response?.status === 401 && !req._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then(token => {
          req.headers.Authorization = `Bearer ${token}`
          return axios(req)
        })
      }

      req._retry = true
      isRefreshing = true

      return new Promise(async (resolve, reject) => {
        try {
          const r = await axios.post('https://dummyjson.com/auth/refresh', {
            refreshToken: auth.refreshToken
          })
          const { accessToken, refreshToken } = r.data
          auth.setTokens({ accessToken, refreshToken })
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
          processQueue(null, accessToken)
          resolve(api(req))
        } catch (e) {
          processQueue(e, null)
          auth.clearAuth()
          reject(e)
        } finally {
          isRefreshing = false
        }
      })
    }
    return Promise.reject(err)
  }
)

export default api
