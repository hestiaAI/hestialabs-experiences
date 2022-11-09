export default async({ store, isDev, app }) => {
  if (!store.state.loaded) {
    // first, we need to load the site config
    await store.dispatch('loadConfig', { isDev })
    // and only then we can load the experiences
    await store.dispatch('loadExperiences')
    // set state.loaded = true
    store.commit('setLoaded')
  }
}
