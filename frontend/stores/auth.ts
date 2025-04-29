import { defineStore } from 'pinia'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    userEmail: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setAuth(token: string, email: string) {
      this.token = `Token ${token}`
      this.userEmail = email
      localStorage.setItem('auth_token', this.token)
      localStorage.setItem('user_email', this.userEmail)
    },

    loadAuth() {
      const token = localStorage.getItem('auth_token')
      const email = localStorage.getItem('user_email')

      if (token) this.token = token
      if (email) this.userEmail = email
    },

    logout() {
      this.token = null
      this.userEmail = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_email')
    },
  },
})
