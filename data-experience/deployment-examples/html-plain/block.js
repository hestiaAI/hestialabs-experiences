/* eslint-disable no-undef */
import experience from 'https://cdn.jsdelivr.net/npm/@hestia.ai/twitter/dist/index.mjs'
const dataResp = await fetch('./twitter-overview.json')
const data = await dataResp.json()
const messagesFrResp = await fetch('./fr.json')
const messagesFr = await messagesFrResp.json()

const viewBlock = experience.config.viewBlocks[0]

const locale = 'fr'
const expName = experience.title
messagesFr[expName] = experience.config.messages[locale]
const viewBlockTranslationPrefix = `${expName}.viewBlocks.${viewBlock.id}`

Vue.use(VueI18n)
const i18n = new VueI18n({
  ...DataExperience.i18nOpts,
  locale,
  messages: { fr: messagesFr }
})

const vuetify = new Vuetify(DataExperience.vuetifyOpts(i18n))

Vue.use(DataExperience.ViewBlock)

new Vue({
  el: '#app',
  i18n,
  vuetify,
  data: {
    data,
    viewBlockTranslationPrefix,
    viewBlock
  }
})
