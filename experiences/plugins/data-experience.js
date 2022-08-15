import Vue from 'vue'
import DummyButton from 'data-experience'

export default ({ store }) => {
  Vue.use(DummyButton, { store })
}
