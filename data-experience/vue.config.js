// const acceptedExtensions = ['tar', 'js', 'ndjson', 'png', 'jpeg', 'jpg', 'gif', 'bmp', 'webp', 'pdf', 'zip', 'json', 'txt', 'html', 'csv', 'tsv', 'xlsx']

const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
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
        // path: require.resolve('path/'),
        path: require.resolve('path-browserify'),
        util: require.resolve('util/')
      }
    },
    module: {
      rules: [
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
      ]
    }
  }
})
