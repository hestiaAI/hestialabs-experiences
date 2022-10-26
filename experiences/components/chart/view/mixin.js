import { TextFilterWidget } from 'dc'
import { merge } from 'lodash-es'

import kViewBlockMixin from '@/mixins/k-view-block'

const mixin = {
  props: {
    id: {
      type: String,
      required: true
    },
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
    }
  },
  data() {
    return {
      graphId: 'graph_' + this.id,
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
