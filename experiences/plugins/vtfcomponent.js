import Vue from 'vue'
import HelloWorld from 'vtfcomponent'

export default ({ store }) => {
  Vue.use(HelloWorld, { store })
}
