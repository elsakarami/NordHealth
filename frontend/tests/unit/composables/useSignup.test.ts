import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { SignupPayload } from '@/types/index'
import { SignupService } from '@/composables/useSignup'

const fetchMock = vi.fn()
const setAuthMock = vi.fn()

vi.mock('@/composables/useAxios', () => ({
  AxiosService: vi.fn().mockImplementation(() => ({
    data: null,
    error: null,
    loading: false,
    fetch: fetchMock,
  })),
}))

vi.mock('@/composables/usePasswordValidator', () => ({
  validatePassword: vi.fn((password: string) => ({
    minLength: password.length >= 8,
    containsUppercase: /[A-Z]/.test(password),
    containsLowercase: /[a-z]/.test(password),
    containsNumber: /\d/.test(password),
    containsSpecialChar: /[^A-Za-z0-9]/.test(password),
  })),
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    setAuth: setAuthMock,
  }),
}))

describe('SignupService', () => {
  const validPayload: SignupPayload = {
    email: 'zahra@example.com',
    password: 'Strong@123',
  }

  let signupService: SignupService

  beforeEach(() => {
    vi.clearAllMocks()
    signupService = new SignupService()
  })

  it('should throw error when fields are missing', async () => {
    await expect(
      signupService.signup({ email: '', password: '' })
    ).rejects.toThrow('All fields are required')
  })

  it('should throw error for invalid password', async () => {
    await expect(
      signupService.signup({ email: 'a@a.com', password: '123' })
    ).rejects.toThrow('Password does not meet the requirements')
  })

  it('should call fetch on successful signup', async () => {
    fetchMock.mockResolvedValueOnce({
      data: {
        token: 'mocked-token',
        user: { email: 'zahra@example.com' },
      },
    })
    const response = await signupService.signup(validPayload)
    expect(fetchMock).toHaveBeenCalledWith('/api/users/signup/', 'POST', {
      requestData: validPayload,
    })
    expect(setAuthMock).toHaveBeenCalledWith('mocked-token', 'zahra@example.com')
    expect(response?.data.token).toBe('mocked-token')
  })
})
