export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  //npm install -D sass-embedded
  //npm install -D sass
  css: [
    '~/assets/scss/main.scss',
  ],

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],

      link: [
        {
          rel: 'stylesheet',
          href: '/css/fontawesome.css'
        }
      ]
    },
  },
})