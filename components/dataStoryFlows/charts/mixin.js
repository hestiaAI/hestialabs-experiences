export default {
  props: {
    values: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      graphId: 'graph_' + this._uid
    }
  },
  mounted() {
    this.initViz()
  },
  watch: {
    values() {
      this.updateViz()
    }
  }
}
