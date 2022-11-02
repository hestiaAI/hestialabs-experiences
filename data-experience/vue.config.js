// const acceptedExtensions = ['tar', 'js', 'ndjson', 'png', 'jpeg', 'jpg', 'gif', 'bmp', 'webp', 'pdf', 'zip', 'json', 'txt', 'html', 'csv', 'tsv', 'xlsx']

const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
module.exports = defineConfig({
  publicPath: '/',
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
        '@': path.resolve(__dirname, 'src'),
        // https://github.com/micromatch/picomatch/pull/23
        picomatch: 'picomatch-browser',
        vue$: path.resolve(__dirname, 'node_modules/vue/dist/vue.runtime.esm.js')
      },
      fallback: {
        fs: false,
        crypto: false, // require.resolve("crypto-browserify") to add polyfill
        // path: require.resolve('path/'),
        path: require.resolve('path-browserify'),
        util: require.resolve('util/')
      }
    },
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: 'worker-loader'
        },
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
        // // https://vuetify.cn/en/getting-started/quick-start/#webpack-install
        // {
        //   test: /\.s[ca]ss$/,
        //   use: [
        //     'vue-style-loader',
        //     'css-loader',
        //     {
        //       loader: 'sass-loader',
        //       // Requires sass-loader@^8.0.0
        //       options: {
        //         implementation: require('sass'),
        //         sassOptions: {
        //           fiber: require('fibers'),
        //           indentedSyntax: true // optional
        //         }
        //       }
        //     }
        //   ]
        // }
      ]
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
