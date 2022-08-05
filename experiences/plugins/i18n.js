export default ({ app }) => {
  app.vuetify.framework.lang.current = app.i18n.locale

  app.i18n.beforeLanguageSwitch = (oldLocale, newLocale) => {
    app.vuetify.framework.lang.current = newLocale
  }
}
