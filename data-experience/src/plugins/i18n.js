
import { timeFormatDefaultLocale } from 'd3'

// Import app locales
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import { numberFormats } from '@/locales/vue-i18n-number-formats'
import { dateTimeFormats } from '@/locales/vue-i18n-date-time-formats'

// Import vuetify locales
import vuetifyEn from 'vuetify/lib/locale/en'
import vuetifyFr from 'vuetify/lib/locale/fr'

// Import D3 locales
// Should be d3-time-format/locale/en-US.json but not working since d3v7
// https://stackoverflow.com/questions/74072409/webpack-doesnt-resolve-imports-of-json-files-from-d3-packages
import d3En from '@/../node_modules/d3-time-format/locale/en-US.json'
import d3Fr from '@/../node_modules/d3-time-format/locale/fr-FR.json'

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

function setD3Locale(locale) {
  const currentLang = messages[locale] ? locale : defaultLocale
  timeFormatDefaultLocale(messages[currentLang].$d3)
}

export default i18nOpts
export { localeCodes, setD3Locale }
