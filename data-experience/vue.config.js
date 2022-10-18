// const acceptedExtensions = ['tar', 'js', 'ndjson', 'png', 'jpeg', 'jpg', 'gif', 'bmp', 'webp', 'pdf', 'zip', 'json', 'txt', 'html', 'csv', 'tsv', 'xlsx']

const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './data-experience/dist/',
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
        '@': path.resolve(__dirname, 'src')
      },
      fallback: {
        fs: false,
        crypto: false, // require.resolve("crypto-browserify") to add polyfill
        path: require.resolve('path/'),
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