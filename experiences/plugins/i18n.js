import { json, timeFormatDefaultLocale } from 'd3'
import vuetifyEn from 'vuetify/lib/locale/en'
import vuetifyFr from 'vuetify/lib/locale/fr'

import defaultEn from '@/i18n/en.json'
import defaultFr from '@/i18n/fr.json'

const messagesDefault = {
  en: {
    ...defaultEn,
    $vuetify: vuetifyEn
  },
  fr: {
    ...defaultFr,
    $vueitfy: vuetifyFr
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

export default async ({ app, store, $vuetify }) => {
  const { config: { i18nUrl, theme }, experiences } = store.state

  const messagesExperiences = experiences.filter(e => e.messages)

  let messagesCustom = {}
  if (i18nUrl) {
    // fetch messages to override default messages
    const response = await fetch(i18nUrl)
    messagesCustom = await response.json()
  }
  app.i18n.localeCodes.forEach((locale) => {
    // default messages
    app.i18n.mergeLocaleMessage(locale, messagesDefault[locale])

    // experience messages
    messagesExperiences.forEach(({ slug, messages }) => {
      // Merge local, experience-specific, default messages
      // into vue-i18n's global dictionary
      const messagesObject = { experiences: { [slug]: messages[locale] } }
      app.i18n.mergeLocaleMessage(locale, messagesObject)
    })

    // overriding messages
    app.i18n.mergeLocaleMessage(locale, messagesOverride[locale])

    // custom messages (override anything previously merged)
    if (locale in messagesCustom) {
      app.i18n.mergeLocaleMessage(locale, messagesCustom[locale])
    }
  })

  if (theme) {
    // override light theme colors
    Object.assign($vuetify.theme.themes.light, theme)
  }
  d3Locale(app.i18n.localeProperties)
  app.i18n.onBeforeLanguageSwitch = (oldLocale, newLocale) => {
    const localeProperties = app.i18n.locales.find(l => l.code === newLocale)
    d3Locale(localeProperties)
  }
}
