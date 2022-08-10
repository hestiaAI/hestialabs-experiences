export default ({ app }, inject) => {
  inject('url', (route) => {
    const { baseUrl } = process.env
    if (route) {
      // use route when provided
      // (needs to be provided when reactivity is required)
      return baseUrl + route.path
    }
    // otherwise, use router instance from app context
    return baseUrl + app.router.currentRoute.path
  })
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
  inject('tetv', (key, keyFallback, valueFallback) => {
    // tet -> Translation Exists (else) Translate fallback (else) Value fallback
    return i18n.te(key) ? i18n.t(key) : i18n.te(keyFallback) ? i18n.t(keyFallback) : valueFallback
  })
}
