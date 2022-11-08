// The first locale Object in this Array
// will be used as a default locale
// when no i18nLocale is provided
export const locales = [
  {
    code: 'en',
    iso: 'en-US',
    name: 'English'
  },
  {
    code: 'fr',
    iso: 'fr-FR',
    name: 'Français'
  }
]

export const localeCodes = locales.map(l => l.code)
