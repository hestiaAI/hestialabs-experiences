export default ({ store, $vuetify }) => {
  const { theme } = store.state.config
  if (theme) {
    // override light theme colors
    Object.assign($vuetify.theme.themes.light, theme)
  }
}
