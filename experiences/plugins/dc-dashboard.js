import Vue from 'vue'
import { Dashboard } from 'dc-dashboard'
import 'dc-dashboard/dist/style.css'

export default ({ app }) => {
  Vue.use(Dashboard, { i18n: app.i18n })
}
