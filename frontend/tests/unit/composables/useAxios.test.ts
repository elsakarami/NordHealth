import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { AxiosService } from '@/composables/useAxios'

vi.mock('axios')

const mockedAxios = axios as vi.Mocked<typeof axios>

describe('AxiosService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches data successfully', async () => {
    mockedAxios.mockResolvedValueOnce({ data: { message: 'ok' } })

    const service = new AxiosService<{ message: string }>(mockedAxios)

    const response = await service.fetch('/test', 'GET')

    expect(response?.data).toEqual({ message: 'ok' })
    expect(service.data.value).toEqual({ message: 'ok' })
    expect(service.error.value).toBe(null)
    expect(service.loading.value).toBe(false)
  })

  it('handles error correctly', async () => {
    mockedAxios.mockRejectedValueOnce({
      response: { data: { message: 'fail' } }
    })

    const service = new AxiosService<typeof mockedAxios>(mockedAxios)

    try {
      await service.fetch('/fail', 'GET')
    } catch {
      expect(service.error.value).toBe('fail')
      expect(service.loading.value).toBe(false)
    }
  })
})
