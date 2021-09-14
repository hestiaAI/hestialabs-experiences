<template v-if="hasValidSpec">
  <div :id="divId"></div>
</template>

<script>
import embed from 'vega-embed'

export default {
  props: {
    name: { type: String, default: '' },
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
    divId() {
      return `unit-vega-viz-${this.name}`
    },
    clonedValues() {
      if (!this.values.length) {
        return []
      }
      const keys = Object.keys(this.values[0])
      return this.values.map(item =>
        keys.reduce((clone, key) => {
          clone[key] = item[key].slice()
          return clone
        }, {})
      )
    },
    specWithValues() {
      if (!this.spec?.data) {
        // invalid data
        return {}
      }
      const clonedSpec = Object.assign({}, this.spec)
      const clonedFirstData = Object.assign({}, this.spec.data[0])
      clonedFirstData.values = this.clonedValues
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
      await embed(`#${this.divId}`, this.specWithValues, {
        actions: false
      })
    }
  }
}
</script>
