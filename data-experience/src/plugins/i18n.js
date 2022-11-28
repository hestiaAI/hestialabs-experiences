import { merge } from 'lodash-es'

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

const i18nOpts = {
  availableLocales: localeCodes,
  locale: 'fr',
  fallbackLocale: 'en',
  messages: merge(messagesDefault, messagesOverride),
  numberFormats,
  dateTimeFormats
}

export default i18nOpts
