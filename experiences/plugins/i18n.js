import { json, timeFormatDefaultLocale } from 'd3'
import vuetifyEn from 'vuetify/lib/locale/en'
import vuetifyFr from 'vuetify/lib/locale/fr'

import defaultEn from '@/locales/en.json'
import defaultFr from '@/locales/fr.json'

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

function d3Locale({ iso }) {
  json(`https://cdn.jsdelivr.net/npm/d3-time-format@4/locale/${iso}.json`).then(
    locale =>
      timeFormatDefaultLocale(locale)
  )
}

export default async({ app, store }) => {
  const { config: { i18nUrl, messages: messagesCustomConfig = {} }, experiences } = store.state

  const messagesExperiences = experiences.filter(e => e.messages)

  let messagesCustomRemote = {}
  if (i18nUrl) {
    // fetch messages to override default messages
    messagesCustomRemote = await json(i18nUrl)
  }
  app.i18n.localeCodes.forEach((locale) => {
    /* default messages */
    app.i18n.mergeLocaleMessage(locale, messagesDefault[locale])

    /* experience messages */
    messagesExperiences.forEach(({ slug, messages }) => {
      // Merge local, experience-specific, default messages
      // into vue-i18n's global dictionary
      const messagesObject = { experiences: { [slug]: messages[locale] } }
      app.i18n.mergeLocaleMessage(locale, messagesObject)
    })

    /* overriding messages */
    app.i18n.mergeLocaleMessage(locale, messagesOverride[locale])

    /* custom messages (override anything previously merged) */
    if (locale in messagesCustomConfig) {
      // from config
      app.i18n.mergeLocaleMessage(locale, messagesCustomConfig[locale])
    }

    if (locale in messagesCustomRemote) {
      // from remote endpoint
      app.i18n.mergeLocaleMessage(locale, messagesCustomRemote[locale])
    }
  })

  d3Locale(app.i18n.localeProperties)
  app.i18n.onBeforeLanguageSwitch = (oldLocale, newLocale) => {
    const localeProperties = app.i18n.locales.find(l => l.code === newLocale)
    d3Locale(localeProperties)
  }
}
