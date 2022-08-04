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
  // Add prototype to show default value when translation is not found
  inject('tev', (key, valueFallback) => {
    return app.i18n.te(key) ? app.i18n.t(key) : valueFallback
  })
  // Add prototype to show default when translation is not found
  inject('tetv', (key, keyFallback, valueFallback) => {
    return app.i18n.te(key) ? app.i18n.t(key) : app.i18n.te(keyFallback) ? app.i18n.t(keyFallback) : valueFallback
  })
}
