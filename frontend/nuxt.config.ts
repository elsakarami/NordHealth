// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-04',
  ssr:false,
  imports: {
    autoImport: true
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'North Health - signup',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'NorthHealth signup for a product using Nuxt 3 + PCDS' },
      ],
    },
  },
  css: [
    '@provetcloud/css',
    '@provetcloud/web-components',
    '~/assets/styles/main.scss',
  ],
  devtools: { enabled: false },
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@pinia/nuxt', 'nuxt-echarts'],
  components: [
    { path: '~/components/atoms', global: true },
    { path: '~/components/molecules', global: true },
    { path: '~/components/organisms', global: true },
  ],
  runtimeConfig: {
    public: {
      baseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:8000'
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },
  echarts: {
    renderer: ['svg', 'canvas'],
    charts: ['BarChart', 'LineChart', 'PieChart']
  },
  vite: {
    build: {
      minify: 'terser',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 500
    },
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('provet-'),
        },
      },
    },
    optimizeDeps: {
      include: ['@provetcloud/web-components'],
    },
  },
})