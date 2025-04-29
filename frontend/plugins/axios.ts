import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const instance: AxiosInstance = axios.create({
    baseURL: config.public.baseUrl,
  })

  instance.interceptors.request.use((_config) => {
    const urlPath = new URL(_config.url!, config.public.baseUrl).pathname
    const noAuth = ['/']
    const isPublic = noAuth.includes(urlPath)

    if (!isPublic) {
      const token = useAuthStore().token
      if (token) {
        _config.headers.Authorization = `${token}`
      }
    }

    return _config
  })

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        useAuthStore().logout()
      }
      return Promise.reject(err)
    }
  )

  nuxtApp.provide('axios', instance)
})
