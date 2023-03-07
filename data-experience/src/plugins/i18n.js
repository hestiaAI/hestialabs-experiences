
import { timeFormatDefaultLocale } from 'd3'

// Import app locales
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'

// Import vuetify locales
import vuetifyEn from 'vuetify/lib/locale/en'
import vuetifyFr from 'vuetify/lib/locale/fr'

// Import D3 locales
// Should be d3-time-format/locale/en-US.json but not working since d3v7
// https://stackoverflow.com/questions/74072409/webpack-doesnt-resolve-imports-of-json-files-from-d3-packages
import d3En from '@/../node_modules/d3-time-format/locale/en-US.json'
import d3Fr from '@/../node_modules/d3-time-format/locale/fr-FR.json'

// Import formats locales
import { numberFormats } from '@/i18n/vue-i18n-number-formats'
import { dateTimeFormats } from '@/i18n/vue-i18n-date-time-formats'

import { merge } from 'lodash'

const messagesDefault = {
  en: {
    ...en,
    $vuetify: vuetifyEn,
    $d3: d3En
  },
  fr: {
    ...fr,
    $vuetify: vuetifyFr,
    $d3: d3Fr
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

const messages = merge(messagesDefault, messagesOverride)
const localeCodes = Object.keys(messages)
const defaultLocale = localeCodes[1]
const i18nOpts = {
  availableLocales: Object.keys(messages),
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages,
  numberFormats,
  dateTimeFormats
}

function setLocale(locale) {
  const currentLang = messages[locale] ? locale : defaultLocale
  console.log('setLocale', locale, currentLang, messages[currentLang].$d3)
  timeFormatDefaultLocale(messages[currentLang].$d3)
}

function mergeMessages(i18n, messages) {
  Object.entries(messages).forEach(([locale, messages]) => {
    i18n.mergeLocaleMessage(locale, messages)
  })
}

export default i18nOpts
export { localeCodes, setLocale, mergeMessages, defaultLocale }
