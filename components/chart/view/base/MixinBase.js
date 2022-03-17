export default {
  props: {
    values: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: () => '',
      placeHolder: 'Insert the title of the graph'
    },
    subtitle: {
      type: String,
      default: () => '',
      placeHolder: 'Insert the subtitle of the graph'
    },
    margin: {
      type: Object,
      default() {
        return { left: 50, right: 50, top: 50, bottom: 50 }
      },
      placeHolder: 'Choose the margin of the graph'
    }
  },
  data() {
    return {
      graphId: 'graph_' + this._uid
    }
  },
  mounted() {
    if (this.validData()) this.initViz()
  },
  watch: {
    values() {
      this.updateViz()
    }
  }
}
