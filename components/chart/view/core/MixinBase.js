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
        return { left: 70, right: 30, top: 30, bottom: 70 }
      },
      placeHolder: 'Choose the margin of the graph'
    },
    svgScale: {
      type: Number,
      default: () => 10,
      placeHolder: 'Specify the resolution of the graph'
    }
  },
  data() {
    return {
      graphId: 'graph_' + this._uid
    }
  },
  computed: {
    width() {
      return this.svgScale * 100
    },
    height() {
      return this.width / 1.61803398875 // golden ratio
    },
    viewBox() {
      return `0 0 ${this.width} ${this.height}`
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
