
import { resolve } from 'path'

const directusModule = function(moduleOptions) {
  const options = Object.assign({}, moduleOptions, this.options.directus)

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'directus-plugin.js',
    options
  })
}

export default directusModule
