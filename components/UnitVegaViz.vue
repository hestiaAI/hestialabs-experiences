<template v-if="hasValidSpec">
  <div id="unit-vega-viz"></div>
</template>

<script>
import embed from 'vega-embed'

export default {
  props: {
    spec: {
      type: Object,
      default: () => {},
      required: true
    },
    values: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    specWithValues() {
      if (!this.spec?.data) {
        // invalid data
        return {}
      }
      console.log('value ', this.values[0])
      const clonedSpec = Object.assign({}, this.spec)
      const clonedFirstData = Object.assign({}, this.spec.data[0])
      clonedFirstData.values = this.values
      const clonedData = this.spec.data.slice()
      clonedData[0] = clonedFirstData
      clonedSpec.data = clonedData
      console.log('Vega data', clonedFirstData)
      return clonedSpec
    }
  },
  watch: {
    specWithValues(v) {
      this.draw()
    }
  },
  async mounted() {
    await this.draw()
  },
  methods: {
    async draw() {
      await embed('#unit-vega-viz', this.specWithValues, { actions: false })
    }
  }
}
</script>
