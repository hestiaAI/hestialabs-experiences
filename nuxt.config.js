import webpack from 'webpack'

const appName = 'HestiaLabs Demo'

let baseUrl = 'http://localhost:3000'
if (process.env.NODE_ENV === 'production') {
  baseUrl =
    process.env.BASE_URL ||
    `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`
}

export default {
  ssr: false, // Disable Server-Side Rendering
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: title =>
      title ? `${title} | HestiaLabs Demo` : 'HestiaLabs Demo',
    title: '',
    meta: [
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'og:title',
        property: 'og:title',
        content: appName
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/vuex-persistedstate.client.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'nuxt-webfontloader'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    icon: {},
    meta: {
      name: appName,
      theme_color: '#ffffff',
      ogImage: {
        path: '/ogimg.png',
        width: 1200,
        height: 630,
        type: 'image/png'
      },
      ogHost: baseUrl,
      // set following meta tags with vue-meta
      ogTitle: false,
      ogUrl: false
    },
    manifest: {
      name: appName,
      short_name: 'HestiaLabs'
    }
  },

  vue: {
    config: {
      productionTip: false,
      watch: ['~/manifests/']
    }
  },

  webfontloader: {
    google: {
      families: ['Roboto:100,300,400,500,700,900&display=swap']
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    // https://github.com/nuxt-community/vuetify-module#offline-applications
    defaultAssets: false,
    optionsPath: 'vuetify.options.js'
  },

  env: {
    baseUrl,
    appName
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // Transpile yarrrml-parser with Babel
    // https://github.com/semantifyit/RocketRML/issues/20#issuecomment-880192637
    transpile: ['yarrrml-parser'],
    extend(config, { isDev, isClient }) {
      if (isClient) {
        config.devtool = 'source-map'
      }
      config.node = {
        // ignore fs Node.js module (used in yarrrml-parser)
        // https://github.com/semantifyit/RocketRML/issues/20#issuecomment-880192637
        fs: 'empty'
      }
      config.module.rules.push(
        // for importing/exporting workers as ES modules
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' }
        },
        // enable raw importing of .yaml and .rq files
        {
          test: /\.(ya?ml|rq)$/i,
          use: 'raw-loader'
        }
      )
    },
    plugins: [
      // to ignore xpath-iterator package, which is a optional packages that uses nodejs c++ addon
      // https://github.com/semantifyit/RocketRML/issues/20#issuecomment-880192637
      new webpack.IgnorePlugin({
        resourceRegExp: /^/u,
        contextRegExp: /xpath-iterator/u
      })
    ]
  }
}
