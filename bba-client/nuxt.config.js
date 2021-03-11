import colors from 'vuetify/es5/util/colors'

export default {
  router: {
    middleware: ['auth'] // Enable Nuxt-Auth middleware globally
  },

  // Global transitions
  layoutTransition: 'slide-y-transition',
  pageTransition: 'slide-x-transition',

  publicRuntimeConfig: {
    appName: process.env.APP_NAME
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - ' + process.env.APP_NAME,
    title: process.env.APP_NAME,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon.png' }
    ],
  },

  server: {
    port: process.env.PORT || 3000,
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/vuetify.scss',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/theme.js', mode: 'client' },
    { src: '~/plugins/vue-signature-pad.js', mode: 'client' }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Nuxt Auth Options
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          maxAge: 60*60*24, // 24 hours
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: 'user',
          autoFetch: false
        },
        endpoints: {
          login: { url: '/api/user/login', method: 'post' },
          user: false,
          logout: false,
        }
      }
    },
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/'

    }
  },

  // nuxt/axios options
  axios: {
    baseURL: process.env.BASE_URL
  },

  // nuxt/pwa options
  pwa: {
    meta: {
      name: 'PMC App',
      description: 'The web app for PMC',
      theme_color: process.env.COLOR_PRIMARY || '#4c9a2a'
    },
    workbox: {
      //enabled: true, // Development mode enabled
      cacheAssets: true, // should be enabled by default
      offlineStrategy: 'CacheFirst'
    }
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: '#98002e',
          accent: colors.grey.darken3,
          secondary: '#547ca7',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: process.env.COLOR_PRIMARY || '#0E4D80',
          secondary: process.env.COLOR_SECONDARY || '#DC3545',
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
