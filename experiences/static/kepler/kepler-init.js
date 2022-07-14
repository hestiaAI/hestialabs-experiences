// based on the example at https://github.com/keplergl/kepler.gl/blob/master/examples/umd-client/index.html
import { buildStore, init, update } from './kepler-utils.js'

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiYW5kcmVhc2t1bmRpZyIsImEiOiJja3ZxcnlmNXc2ZzUwMnFva2F2a3Q1azU5In0.NrvCU8OKlkwJOVFOgZzTzA'

const _store = buildStore()

if (window) {
  window.init = args =>
    init(document.getElementById('app'), args, _store, MAPBOX_TOKEN)
  window.update = data => update(data, _store)
}
