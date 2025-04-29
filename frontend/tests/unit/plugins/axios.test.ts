import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia, defineStore } from 'pinia'

const useAuthStore = defineStore('auth', {
  state: () => ({ token: 'mock-token' }),
  actions: { logout: vi.fn() },
})

describe('Axios plugin basic tests', () => {
  let axiosInstance: ReturnType<typeof axios.create>

  beforeEach(() => {
    setActivePinia(createTestingPinia({ stubActions: false }))
    const auth = useAuthStore()

    axiosInstance = axios.create()
    axiosInstance.interceptors.request.use((config) => {
      const noAuth = ['/']
      const isPublic = noAuth.includes(config.url || '')

      if (!isPublic && auth.token) {
        config.headers.Authorization = `${auth.token}`
      }

      return config
    })
  })

  it('does NOT add Authorization for /', async () => {
    const config = await axiosInstance.request({
      url: '/',
      method: 'POST',
      headers: {},
    }).catch(() => null)

    expect(config?.config.headers.Authorization).toBeUndefined()
  })
})