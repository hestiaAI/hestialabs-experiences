export default {
  props: {
    values: {
      type: Array,
      default: () => []
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
