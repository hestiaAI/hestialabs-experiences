/* eslint-disable no-undef */
import experience from 'https://cdn.jsdelivr.net/npm/@hestia.ai/twitter/dist/index.mjs'
const dataResp = await fetch('./twitter-overview.json')
const data = await dataResp.json()
const messagesFrResp = await fetch('./fr.json')
const messagesFr = await messagesFrResp.json()
const viewBlock = experience.config.viewBlocks[0]

const locale = 'fr'
const expName = 'my-exp'
const experienceMessages = experience.config.messages[locale]

Vue.use(Vuex)
Vue.use(VueI18n)

const i18n = new VueI18n({
  ...DataExperience.i18nOpts,
  locale,
  messages: { fr: { [expName]: experienceMessages } }
  // messages: { fr: messagesFr },
})
i18n.mergeLocaleMessage(locale, messagesFr)

const vuetify = new Vuetify(DataExperience.vuetifyOpts(i18n))

const store = new Vuex.Store({})

// needed for installing the store and setting globals like $tev
Vue.use(DataExperience.DataExperience, { store })
Vue.component('unit-pipeline-view-block', DataExperience.UnitPipelineViewBlock)

new Vue({
  el: '#app',
  i18n,
  vuetify,
  // store,
  data: {
    data,
    missingFiles: [],
    translationKeyPrefix: `${expName}.viewBlocks.overview`,
    viewBlock
  }
})
