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
  // TODO see if specWithValues could be a computed property
  // and replace watch and buildUpdatedSpec
  watch: {
    spec(v) {
      this.draw()
    },
    values(v) {
      this.draw()
    }
  },
  async mounted() {
    await this.draw()
  },
  computed: {
    hasValidSpec() {
      return !!this.spec?.data
    }
  },
  methods: {
    async draw() {
      await embed('#unit-vega-viz', this.buildUpdatedSpec(), { actions: false })
    },
    buildUpdatedSpec() {
      if (!this.hasValidSpec) {
        return {}
      }

      console.log('value ', this.values[0])
      const clonedSpec = Object.assign({}, this.spec)
      const clonedFirstData = Object.assign({}, this.spec.data[0])
      clonedFirstData.values = this.values
      clonedSpec.data = [clonedFirstData]
      console.log('Vega data', clonedFirstData)
      return clonedSpec
    }
  }
}
</script>
