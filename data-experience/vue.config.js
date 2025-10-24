<<<<<<< HEAD
import webpack from 'webpack'
import { defineConfig } from '@vue/cli-service'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  publicPath: isDev ? '/' : './',
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
        '@': path.resolve(__dirname, 'src'),
        // https://github.com/micromatch/picomatch/pull/23
        picomatch: 'picomatch-browser'
      },
      fallback: {
        fs: false,
        crypto: false, // require.resolve("crypto-browserify") to add polyfill
        path: require.resolve('path-browserify'),
        util: require.resolve('util/')
      }
    },
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: [
            {
              loader: 'worker-loader',
              options: {
                inline: 'fallback',
                filename: '[name].[contenthash:7].js'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        // for init() in sql.js
        'process.release': {}
      })
    ],
    experiments: {
      topLevelAwait: true
    }
  },
  // Fix issue when project path has a special symbol like '(' or ')'.
  // Bug of copy-webpack-plugin or fast-glob, because cli will add the absolute path of the index.html
  // in the public folder to the ignore list, if the path has a special symbol, copy-webpack-plugin will
  // not match the path and will not ignore it. Therefore index.html will emit twice.
  // source: https://github.com/vuejs/vue-cli/issues/7043#issuecomment-1069791347
  chainWebpack: (config) => {
    if (isDev) {
      config.plugin('copy').tap((args) => {
        const UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\())/g
        const publicDir = path.resolve(process.VUE_CLI_SERVICE.context, 'public').replace(/\\/g, '/')
        const escapePublicDir = publicDir.replace(UNESCAPED_GLOB_SYMBOLS_RE, '\\$2')
        args[0].patterns[0].globOptions.ignore = args[0].patterns[0].globOptions.ignore.map(i => i.replace(publicDir, escapePublicDir))
        return args
      })
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
      enableBridge: false
    }
  }
})
=======
import webpack from 'webpack'
import { defineConfig } from '@vue/cli-service'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  publicPath: isDev ? '/' : './',
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
        '@': path.resolve(__dirname, 'src'),
        // https://github.com/micromatch/picomatch/pull/23
        picomatch: 'picomatch-browser',
        '@hestia.ai/apple-tracker': path.resolve(__dirname, '../packages/packages/experiences/apple-tracker'),
        '@hestia.ai/apple-tracker-agg': path.resolve(__dirname, '../packages/packages/experiences/apple-tracker-agg'),
        '@hestia.ai/chatgpt': path.resolve(__dirname, '../packages/packages/experiences/chatgpt'),
        '@hestia.ai/explorer': path.resolve(__dirname, '../packages/packages/experiences/explorer'),
        '@hestia.ai/facebook': path.resolve(__dirname, '../packages/packages/experiences/facebook'),
        '@hestia.ai/fitbit': path.resolve(__dirname, '../packages/packages/experiences/fitbit'),
        '@hestia.ai/google': path.resolve(__dirname, '../packages/packages/experiences/google'),
        '@hestia.ai/google-agg': path.resolve(__dirname, '../packages/packages/experiences/google-agg'),
        '@hestia.ai/her': path.resolve(__dirname, '../packages/packages/experiences/her'),
        '@hestia.ai/her-tinder-agg': path.resolve(__dirname, '../packages/packages/experiences/her-tinder-agg'),
        '@hestia.ai/instagram': path.resolve(__dirname, '../packages/packages/experiences/instagram'),
        '@hestia.ai/linkedin': path.resolve(__dirname, '../packages/packages/experiences/linkedin'),
        '@hestia.ai/linkedin-agg': path.resolve(__dirname, '../packages/packages/experiences/linkedin-agg'),
        '@hestia.ai/netflix': path.resolve(__dirname, '../packages/packages/experiences/netflix'),
        '@hestia.ai/strava': path.resolve(__dirname, '../packages/packages/experiences/strava'),
        '@hestia.ai/tiktok': path.resolve(__dirname, '../packages/packages/experiences/tiktok'),
        '@hestia.ai/tinder': path.resolve(__dirname, '../packages/packages/experiences/tinder'),
        '@hestia.ai/tracker-control': path.resolve(__dirname, '../packages/packages/experiences/tracker-control'),
        '@hestia.ai/tracker-control-agg': path.resolve(__dirname, '../packages/packages/experiences/tracker-control-agg'),
        '@hestia.ai/twitter': path.resolve(__dirname, '../packages/packages/experiences/twitter'),
        '@hestia.ai/twitter-agg': path.resolve(__dirname, '../packages/packages/experiences/twitter-agg'),
        '@hestia.ai/uber': path.resolve(__dirname, '../packages/packages/experiences/uber'),
        '@hestia.ai/uber-driver': path.resolve(__dirname, '../packages/packages/experiences/uber-driver'),
        '@hestia.ai/wolt': path.resolve(__dirname, '../packages/packages/experiences/wolt'),
        '@hestia.ai/youtube': path.resolve(__dirname, '../packages/packages/experiences/youtube'),
        '@hestia.ai/database-template': path.resolve(__dirname, '../packages/packages/experiences/database-template')
      },
      fallback: {
        fs: false,
        crypto: false, // require.resolve("crypto-browserify") to add polyfill
        path: require.resolve('path-browserify'),
        util: require.resolve('util/')
      }
    },
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: [
            {
              loader: 'worker-loader',
              options: {
                inline: 'fallback',
                filename: '[name].[contenthash:7].js'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        // for init() in sql.js
        'process.release': {}
      })
    ],
    experiments: {
      topLevelAwait: true
    }
  },
  // Fix issue when project path has a special symbol like '(' or ')'.
  // Bug of copy-webpack-plugin or fast-glob, because cli will add the absolute path of the index.html
  // in the public folder to the ignore list, if the path has a special symbol, copy-webpack-plugin will
  // not match the path and will not ignore it. Therefore index.html will emit twice.
  // source: https://github.com/vuejs/vue-cli/issues/7043#issuecomment-1069791347
  chainWebpack: (config) => {
    if (isDev) {
      config.plugin('copy').tap((args) => {
        const UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\())/g
        const publicDir = path.resolve(process.VUE_CLI_SERVICE.context, 'public').replace(/\\/g, '/')
        const escapePublicDir = publicDir.replace(UNESCAPED_GLOB_SYMBOLS_RE, '\\$2')
        args[0].patterns[0].globOptions.ignore = args[0].patterns[0].globOptions.ignore.map(i => i.replace(publicDir, escapePublicDir))
        return args
      })
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
      enableBridge: false
    }
  }
})
>>>>>>> 515b1db0 (initial commit of Digipower Experience)
