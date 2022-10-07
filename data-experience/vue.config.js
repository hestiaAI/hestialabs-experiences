const { defineConfig } = require('@vue/cli-service')
const path = require('path')
// const acceptedExtensions = ['tar', 'js', 'ndjson', 'png', 'jpeg', 'jpg', 'gif', 'bmp', 'webp', 'pdf', 'zip', 'json', 'txt', 'html', 'csv', 'tsv', 'xlsx']

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
        '@': path.resolve(__dirname, 'src')
      },
      fallback: {
        fs: false,
        crypto: false, // require.resolve('crypto/'),
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
    },
    plugins: [
      require('unplugin-vue-components/webpack')({})
    ]
  }
})
