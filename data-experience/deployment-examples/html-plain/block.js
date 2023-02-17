/* eslint-disable no-undef */
import experience from 'https://cdn.jsdelivr.net/npm/@hestia.ai/twitter/dist/index.mjs'
// import data from './twitter-overview.json' assert {type: 'json'}
const dataResp = await fetch('./twitter-overview.json')
const data = await dataResp.json()

const viewBlock = experience.config.viewBlocks[0]

Vue.use(Vuex)
Vue.use(VueI18n)

const i18n = new VueI18n(DataExperience.i18nOpts)

const vuetify = new Vuetify(DataExperience.vuetifyOpts(i18n))

const store = new Vuex.Store({})

// TODO: remove use of store in UnitFilterableTable
// It comes from:
// import kViewBlockMixin from '@/mixins/k-view-block'

// needed for installing the store and setting globals like $tev
Vue.use(DataExperience.DataExperience, { store })
Vue.component('unit-pipeline-view-block', DataExperience.UnitPipelineViewBlock)
// console.log('store', store)
// store.commit('setExperienceConfig', experience.config)

new Vue({
  el: '#app',
  i18n,
  vuetify,
  store,
  data: {
    data,
    missingFiles: [],
    translationKeyPrefix: 'dodo',
    viewBlock
  }
})
