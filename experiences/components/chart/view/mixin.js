import { TextFilterWidget } from 'dc'

export default {
  props: {
    values: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Array,
      default: () => []
    },
    kViewBlock: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      graphId: 'graph_' + this._uid
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
    createTextFilterWidget(parent, placeholder = 'Search') {
      const widget = new TextFilterWidget(parent)
      widget.placeHolder(this.$t(placeholder))
      return widget
    }
  }
}
