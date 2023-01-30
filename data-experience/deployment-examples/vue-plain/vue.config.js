import CopyPlugin from 'copy-webpack-plugin'
import { defineConfig } from '@vue/cli-service'

export default defineConfig({
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          'node_modules/@hestia.ai/data-experience/dist'
        ]
      })
    ]
  },
  transpileDependencies: true
})
