export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  css: ['~/assets/scss/main.scss'],

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Viatours',

      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ],

      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/img/favicon.png',
        },
        {
          rel: 'stylesheet',
          href: '/css/fontawesome.css',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
        },
      ],
    },
  },
})