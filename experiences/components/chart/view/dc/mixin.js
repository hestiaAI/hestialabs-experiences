import { TextFilterWidget } from 'dc'

export default {
  props: {
    /**
     * The crossfilter object that contains the values and filters
     * e,g: crossfilter(this.results)
     */
    ndx: {
      type: Object,
      required: true
    },
    /**
     * Title of the graph
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * Label to display in the axis
     */
    valueLabel: {
      type: String,
      default: 'records'
    },
    /**
     * The height of the graph
     * the width is dynamically computed from it's parent
     */
    height: {
      type: Number,
      default: 250
    },
    /**
     * Colors to use in the graph
     */
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
