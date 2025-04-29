export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  if (import.meta.client) {
    authStore.loadAuth()
    const isLoggedIn = !!authStore.token
    const isPublicPage = ['/', '/login', '/signup'].includes(to.path)
    if (!isLoggedIn && !isPublicPage) {
      return navigateTo('/')
    }
  }
})