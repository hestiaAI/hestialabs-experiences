import { numberFormats } from '../i18n/vue-i18n-number-formats'
import { dateTimeFormats } from '../i18n/vue-i18n-date-time-formats'

import { localeCodes } from '../i18n/locales'

const i18nOpts = {
  availableLocales: localeCodes,
  locale: 'fr',
  fallbackLocale: 'en',
  numberFormats,
  dateTimeFormats
}

export default i18nOpts
