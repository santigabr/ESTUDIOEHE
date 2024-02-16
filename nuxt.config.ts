// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@unocss/nuxt', '@nuxt/image', '@nuxtjs/kinde', 'nuxt-tiptap-editor'],
  css: ['@unocss/reset/tailwind.css'],
  tiptap: {
    prefix: 'Tiptap',
    lowlight: {
      theme: 'github-dark',
    },
  },
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dy4qbq4wj/image/upload/EstudioEHE',
    },
  },
})
