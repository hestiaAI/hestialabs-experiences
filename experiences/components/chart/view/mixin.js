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
    messages: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      graphId: 'graph_' + this._uid,
      totalCount: null,
      filterCount: null,
      kViewBlock: this.$store.state.kViewBlock
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
      widget.placeHolder(this.$t(placeholder))
      return widget
    }
  }
}
