export default ({ app }, inject) => {
  const { i18n } = app

  // inject translation helpers to encapsulate ternary expressions
  inject('tev', (key, valueFallback) => {
    // tev -> Translation Exists (else) Value fallback
    return i18n.te(key) ? i18n.t(key) : valueFallback
  })
  inject('tet', (key, keyFallback) => {
    // tet -> Translation Exists (else) Translate fallback
    return i18n.te(key) ? i18n.t(key) : i18n.t(keyFallback)
  })
}
