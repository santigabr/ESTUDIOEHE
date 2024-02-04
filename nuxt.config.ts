// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@nuxt/image', '@nuxtjs/kinde'],
  css: ['@unocss/reset/tailwind.css'],
})
