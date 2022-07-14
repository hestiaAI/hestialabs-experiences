export default {
  props: {
    values: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Array,
      default: () => []
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
  }
}
