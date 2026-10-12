// Mount option for tests of components that use Vuetify components.
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

export function vuetify() {
  return new Vuetify()
}
