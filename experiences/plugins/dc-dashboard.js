import Vue from 'vue'
import { Dashboard } from 'dc-dashboard'
import 'dc-dashboard/dist/style.css'

export default ({ app }) => {
  Vue.use(Dashboard, { i18n: app.i18n })
}

// console.warn = ('No d3.js compatbility event handler registered, defaulting to v6 behavior.') => {}
