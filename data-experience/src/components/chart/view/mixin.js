import { TextFilterWidget } from 'dc'
import { merge } from 'lodash-es'

import kViewBlockMixin from '@/mixins/k-view-block'

const mixin = {
  props: {
    values: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Array,
      default: () => []
    },
    messages: {
      type: Object,
      default: () => ({})
    },
    colorPalette: {
      type: Array,
      default: () => ['#bebada', '#8dd3c7', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#bc80bd', '#ccebc5']
      /* Hestia default
      [
        '#58539E',
        '#847CEB',
        '#605BAB',
        '#4A4685',
        '#35325E'
      ]
      */
    }
    /* ['#f0564e', '#f69691', '#f26c65', '#fdeae9', '#f4817b', '#f9c0bd', '#fbd5d3', '#f7aba7'] */
  },
  data() {
    return {
      graphId: 'graph_' + this._uid,
      totalCount: 0,
      filterCount: 0
    }
  },
  mounted() {
    this.drawViz()
  },
  watch: {
    values() {
      this.drawViz()
    }
  },
  methods: {
    drawViz() { },
    createTextFilterWidget(parent, placeholder = 'Search') {
      const widget = new TextFilterWidget(parent)
      widget.placeHolder(this.$tev(placeholder, placeholder))
      return widget
    }
  }
}

export default merge(mixin, kViewBlockMixin)
