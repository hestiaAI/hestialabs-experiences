import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import cookie from 'cookie'

// https://github.com/robinvdvleuten/vuex-persistedstate#using-cookies-universal-client--server-side
export default ({ store, req }) => {
  createPersistedState({
    paths: ['power'],
    storage: {
      getItem: key => {
        if (process.server) {
          // Node.js server
          if (!req.headers.cookie) {
            return null
          }
          const parsedCookies = cookie.parse(req.headers.cookie)
          return parsedCookies[key]
        } else {
          return Cookies.get(key)
        }
      },
      // https://github.com/js-cookie/js-cookie/blob/master/SERVER_SIDE.md#express
      setItem: (key, value) =>
        Cookies.set(key, value, { expires: 365, secure: false }),
      removeItem: key => Cookies.remove(key)
    }
  })(store)
}
