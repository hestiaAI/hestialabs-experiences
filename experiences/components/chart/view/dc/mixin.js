import { TextFilterWidget } from 'dc'

export default {
  props: {
    ndx: {
      type: Object,
      required: true
    },
    values: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: 250
    },
    colorPalette: {
      type: Array,
      default: () => [
        '#58539E',
        '#847CEB',
        '#605BAB',
        '#4A4685',
        '#35325E'
      ]
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
