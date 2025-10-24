import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'


export default defineConfig({
  resolve:{
    alias:{
      '@' : resolve(__dirname, 'src/')
    },
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'DCDashboard',
      // the proper extensions will be added
      fileName: 'dc-dashboard',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'vue-i18n'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          'vue-i18n': 'VueI18n'
        },
      },
    },
  },
  plugins: [
    vue(),
    VueI18nPlugin({}),
  ],
})
