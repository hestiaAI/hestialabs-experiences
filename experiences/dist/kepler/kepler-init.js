// based on the example at https://github.com/keplergl/kepler.gl/blob/master/examples/umd-client/index.html
import { buildStore, init, update } from './kepler-utils.js'

const _store = buildStore()

if (window) {
  window.init = args => init(document.getElementById('app'), args, _store)
  window.update = data => update(data, _store)
}
