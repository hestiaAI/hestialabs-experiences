const { defineConfig } = require('@vue/cli-service')
const path = require('path')
// const acceptedExtensions = ['tar', 'js', 'ndjson', 'png', 'jpeg', 'jpg', 'gif', 'bmp', 'webp', 'pdf', 'zip', 'json', 'txt', 'html', 'csv', 'tsv', 'xlsx']

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        'fs':  false,
        'crypto': false,
        'path': false,
        'util': require.resolve('util/')
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
