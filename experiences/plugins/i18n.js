import { json, timeFormatDefaultLocale } from 'd3'

function d3Locale({ iso }) {
  json(`https://cdn.jsdelivr.net/npm/d3-time-format@4/locale/${iso}.json`).then(
    locale =>
      timeFormatDefaultLocale(locale)
  )
}

export default ({ app }) => {
  d3Locale(app.i18n.localeProperties)
  app.i18n.onBeforeLanguageSwitch = (oldLocale, newLocale) => {
    const localeProperties = app.i18n.locales.find(l => l.code === newLocale)
    d3Locale(localeProperties)
  }
}
