<template v-if="hasValidSpec">
  <div :id="divId" ref="graph"></div>
</template>

<script>
import embed from 'vega-embed'

export default {
  props: {
    specFile: {
      type: Object,
      default: () => {}
    },
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      width: 0
    }
  },
  computed: {
    divId() {
      return `unit-vega-viz-${this.name}`
    },
    name() {
      return this.specFile?.name
    },
    jsonSpec() {
      const stringSpec = this.specFile?.vega
      let jsonSpec
      if (stringSpec) {
        try {
          jsonSpec = JSON.parse(stringSpec)
        } catch (error) {
          // TODO maybe display this error to the user
          console.error(`could not parse ${this.specFile.name}`, error)
        }
      }
      return jsonSpec
    },
    clonedValues() {
      // Vega happens to modify values,
      // so we clone them to avoid affecting
      // other graphs that could
      // possibly use the same values
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
      // Changing the values involves
      // stuffing them into a spec.
      // We'll keep an original spec
      // that we clone whenever values change.
      // That's not entirely necessary
      // but keeps the linter happy.
      if (!this.jsonSpec?.data) {
        // invalid data
        return {}
      }
      const values = this.clonedValues
      const spec = this.jsonSpec
      // we only change spec.data[0].values
      const clonedSpec = Object.assign({}, spec, {
        data: [
          Object.assign({}, spec.data[0], { values }),
          ...spec.data.slice(1)
        ]
      })
      return clonedSpec
    }
  },
  watch: {
    specWithValues(v) {
      this.draw()
    }
  },
  async mounted() {
    this.width = this.$refs.graph.offsetWidth
    await this.draw()
  },
  methods: {
    async draw() {
      // TODO find a way to make vega respect the width...
      // console.log('w', this.width)
      await embed(`#${this.divId}`, this.specWithValues, {
        // width: this.width,
        // renderer: 'svg',
        actions: false
      })
    }
  }
}
</script>
