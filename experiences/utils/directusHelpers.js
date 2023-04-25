export function mapTranslationObject(translations) {
  return translations.reduce((a, v) => ({ ...a, [v.languages_code.slice(0, 2)]: v }), {})
}
