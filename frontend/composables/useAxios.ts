import { ref } from 'vue'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export class AxiosService<T> {
  public data = ref<T | null>(null)
  public error = ref<string | null>(null)
  public loading = ref(false)

  private axios: AxiosInstance

  constructor(axiosInstance?: AxiosInstance) {
    this.axios = axiosInstance || useNuxtApp().$axios as AxiosInstance
  }

  async fetch(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    config?: {
      requestData?: Record<string, unknown>
      axiosConfig?: AxiosRequestConfig
    }
  ): Promise<AxiosResponse<T> | undefined> {
    this.loading.value = true
    this.error.value = null

    try {
      const response = await this.axios({
        url,
        method,
        data: config?.requestData,
        ...config?.axiosConfig,
      })

      this.data.value = response.data
      return response
    } catch (err: any) {
      this.error.value =
        err?.response?.data?.message || err.message || 'Unknown error'
      throw err
    } finally {
      this.loading.value = false
    }
  }
}