export default ({ app, redirect }) => {
  console.log(app.i18n.locale)
  // if (app.i18n.locale !== app.i18n.defaultLocale) {
  //   // console.log('set locale', app.switchLocalePath(app.i18n.locale))
  //   app.i18n.setLocale(app.i18n.defaultLocale)
  //   // app.switchLocalePath(app.i18n.defaultLocale)
  //   // app.i18n.setLocale(app.i18n.locale)
  //   // app.switchLocalePath(app.i18n.locale)
  //   // console.log('redirect', app.switchLocalePath(app.i18n.defaultLocale))
  //   // app.switchLocalePath(app.i18n.defaultLocale)
  //   redirect(app.localePath('index'))
  // }
}
