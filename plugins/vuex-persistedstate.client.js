import createPersistedState from 'vuex-persistedstate'

// https://github.com/robinvdvleuten/vuex-persistedstate#using-cookies-universal-client--server-side
export default ({ store, req }) => {
  window.onNuxtReady(() => {
    createPersistedState({
      paths: ['power']
    })(store)
  })
}
