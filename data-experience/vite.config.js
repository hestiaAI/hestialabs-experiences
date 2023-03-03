import { resolve } from 'path'
import { defineConfig } from 'vite'

// import vue from '@vitejs/plugin-vue'
// import vuetify from 'vite-plugin-vuetify'

import vue from '@vitejs/plugin-vue2'
import Components from 'unplugin-vue-components/vite'
import {
  VuetifyResolver
} from 'unplugin-vue-components/resolvers'

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

const sharedConfig = {
  plugins: [
    vue(),
    Components({
      resolvers: [
        VuetifyResolver()
      ]
    }),
    // vuetify(),
    VueI18nPlugin({})
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
      '@': resolve(__dirname, './src'),
      // https://github.com/micromatch/picomatch/pull/23
      picomatch: 'picomatch-browser'
    }
  },
  define: {
    'process.env': 'import.meta.env'
  }
}

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      root: 'dev',
      ...sharedConfig
    }
  } else {
    return {
      ...sharedConfig,
      build: {
        lib: {
          // Could also be a dictionary or array of multiple entry points
          entry: resolve(__dirname, 'src/main.js'),
          name: 'DataExperience',
          // the proper extensions will be added
          fileName: 'data-experience'
        },
        rollupOptions: {
          // make sure to externalize deps that shouldn't be bundled
          // into your library
          external: ['vue', 'vuetify', 'vue-i18n', 'vuex'],
          output: {
            // Provide global variables to use in the UMD build
            // for externalized deps
            globals: {
              vue: 'Vue',
              vuetify: 'Vuetify',
              'vue-i18n': 'VueI18n',
              vuex: 'Vuex'
            }
          }
        }
      }
    }
  }
})
