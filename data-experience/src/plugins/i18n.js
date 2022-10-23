import Vue from 'vue'
import VueI18n from 'vue-i18n'

import vuetifyEn from 'vuetify/lib/locale/en'
import vuetifyFr from 'vuetify/lib/locale/fr'

import defaultEn from '../locales/en.json'
import defaultFr from '../locales/fr.json'

import { numberFormats } from '../i18n/vue-i18n-number-formats'
import { dateTimeFormats } from '../i18n/vue-i18n-date-time-formats'

import { localeCodes } from '../i18n/locales'

const messagesDefault = {
  en: {
    ...defaultEn,
    $vuetify: vuetifyEn
  },
  fr: {
    ...defaultFr,
    $vuetify: vuetifyFr
  }
}
const messagesOverride = {
  en: {},
  fr: {
    $vuetify: {
      dataIterator: {
        noResultsText: 'Aucun résultat'
      }
    }
  }
}

Vue.use(VueI18n)

const i18n = new VueI18n({
  availableLocales: localeCodes,
  locale: 'fr',
  fallbackLocale: 'en',
  messages: messagesDefault,
  numberFormats,
  dateTimeFormats
})

localeCodes.forEach((locale) => {
  /* overriding messages */
  i18n.mergeLocaleMessage(locale, messagesOverride[locale])
})

export default i18n
