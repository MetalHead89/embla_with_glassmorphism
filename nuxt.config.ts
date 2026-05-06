// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  css: ['~/assets/css/main.scss'],
  modules: ['@nuxtjs/tailwindcss'],
  typescript: {
    strict: true,
  },
  nitro: {
    preset: 'netlify'
  }
})
