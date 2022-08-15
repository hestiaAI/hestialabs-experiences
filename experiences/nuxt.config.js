import fs from 'fs'
import PreloadWebpackPlugin from '@vue/preload-webpack-plugin'
import en from 'vuetify/lib/locale/en'
import fr from 'vuetify/lib/locale/fr'
import { merge } from 'lodash-es'

import { extension2filetype } from './utils/file-manager'

const name = 'HestiaLabs Experiences'
const description = 'We create a new relationship to personal data'

const {
  NODE_ENV,
  BASE_URL: baseUrl = 'http://localhost:3000',
  CONFIG_NAME: configName = 'dev',
  API_URL: apiUrl = 'http://127.0.0.1:8000'
} = process.env

const isProduction = NODE_ENV === 'production'

if (!baseUrl && isProduction) {
  throw new Error('BASE_URL environment variable is missing')
}

const {
  i18nLocale = 'en',
  i18nLocales = ['fr', 'en']
} = JSON.parse(fs.readFileSync(`config/${configName}.json`))
const i18nMessages = JSON.parse(fs.readFileSync('i18n-messages-default.json'))

export default {
  ssr: false, // Disable Server-Side Rendering
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate(title) {
      if (this && this.context) {
        const { appName } = this.context.store.getters
        return title ? `${title} | ${appName}` : appName
      }
      return 'Booting 🚀'
    },
    title: '',
    meta: [
      { name: 'format-detection', content: 'telephone=no' },
      { property: 'og:title', content: name },
      { property: 'twitter:title', content: name },
      { property: 'twitter:description', content: description },
      { property: 'twitter:image', content: `${baseUrl}/ogimg.png` }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/injected.js', '@/plugins/api.js', { src: '@/plugins/i18n.js' }, '@/plugins/data-experience.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    // pathPrefix: false
    // -> allows to autoimport components inside nested directories
    //    without prefixing the path to the component name
    { path: '~/components', pathPrefix: false, extensions: ['vue'] }
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // we need to add build modules to `dependencies`
    // in package.json because NODE_ENV === 'production'
    // on Netlify does not install `devDependencies`
    // see: https://docs.netlify.com/configure-builds/manage-dependencies/#node-js-environment
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa'
  ].concat(
    // eslint module is only needed for development
    // https://go.nuxtjs.dev/eslint
    NODE_ENV === 'production' ? [] : '@nuxtjs/eslint-module'
  ),

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios', '@nuxtjs/auth-next', '@nuxtjs/i18n'],

  axios: {
    baseURL: apiUrl
  },

  auth: {
    fullPathRedirect: true,
    redirect: {
      login: '/login',
      logout: false,
      home: '/'
    },
    strategies: {
      local: {
        token: {
          property: false,
          required: false
        },
        user: {
          autoFetch: false
        },
        endpoints: {
          login: {
            url: '/bubbles/login',
            method: 'post'
          },
          logout: { url: '/bubbles/logout', method: 'get' },
          user: false
        }
      }
    },
    plugins: ['@/plugins/auth-i18n-redirect.js']
  },

  i18n: {
    baseUrl,
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English'
      },
      {
        code: 'fr',
        iso: 'fr-FR',
        name: 'Français'
      }
    ].filter(({ code }) => i18nLocales.includes(code)),
    defaultLocale: i18nLocale,
    vueI18n: {
      fallbackLocale: i18nLocale,
      messages: merge(
        {
          en: {
            ...i18nMessages.en,
            $vuetify: en
          },
          fr: {
            ...i18nMessages.fr,
            $vuetify: fr
          }
        },
        // override translations:
        {
          en: {},
          fr: {
            $vuetify: {
              dataIterator: {
                noResultsText: 'Aucun résultat'
              }
            }
          }
        }
      )
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    icon: {
      plugin: false
    },
    meta: {
      name,
      description,
      theme_color: '#ffffff',
      ogImage: {
        path: '/ogimg.png',
        width: 1200,
        height: 630,
        type: 'image/png'
      },
      ogHost: baseUrl,
      twitterCard: 'summary',
      twitterSite: '@HestiaLabs',
      // set following meta tags with vue-meta
      ogTitle: false,
      ogUrl: false
    },
    manifest: {
      name,
      short_name: 'HestiaLabs',
      description
    },
    workbox: {}
  },

  vue: {
    config: {
      productionTip: false
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['@/assets/styles/variables.sass'],
    treeShake: true,
    optionsPath: 'vuetify.options.js',
    // https://github.com/nuxt-community/vuetify-module#offline-applications
    defaultAssets: false
  },

  env: {
    baseUrl,
    apiUrl,
    configName
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['lodash-es'],
    extend(config, { isDev }) {
      if (isDev) {
        config.devtool = 'eval'
      }
      config.node = {
        // ignore fs Node.js module (used in some dependencies)
        fs: 'empty'
      }
      config.module.rules.push(
        // for importing/exporting workers as ES modules
        {
          test: /\.worker\.js$/,
          use: 'worker-loader'
        },
        {
          // allow all valid extensions as sample data except JS files!
          test: new RegExp(
            `data.+\\.(${Object.keys(extension2filetype)
              .filter(ext => ext !== 'js')
              .join('|')})$`
          ),
          // https://webpack.js.org/configuration/module/#ruletype
          type: 'javascript/auto',
          use: [
            {
              loader: 'file-loader',
              options: {
                esModule: true,
                name: '[path][name].[contenthash:7].[ext]'
              }
            }
          ]
        },
        // for importing wasm files
        // https://github.com/sql-js/react-sqljs-demo
        {
          test: /\.wasm$/,
          type: 'javascript/auto',
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[contenthash:7].[ext]'
              }
            }
          ]
        }
      )
    },
    plugins: [
      // preload fonts to avoid FOUT
      new PreloadWebpackPlugin({
        rel: 'preload',
        include: 'allAssets',
        // restrict to .woff2 to minimize preloading
        fileWhitelist: [/\.woff2$/],
        // crossorigin attribute added by plugin for as='font'
        as: 'font'
      })
    ],
    watch: ['../hestialabs/packages/*/dist/*']
  }
}
