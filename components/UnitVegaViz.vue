<template v-if="hasValidSpec">
  <div>
    <div :id="divId" ref="graph"></div>
    <v-row>
      <v-col cols="6 mx-auto">
        <base-button text="Export" @click="exportViz" />
        <url-data-download-button
          :href="href"
          :extension="exportExtension"
          :disabled="!href"
        />
      </v-col>
    </v-row>
  </div>
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
    },
    exportExtension: {
      type: String,
      default: 'png'
    },
    divId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      width: 0,
      href: ''
    }
  },
  computed: {
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
      return JSON.parse(JSON.stringify(this.values))
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
      // put something like autosize in the spec
      // "autosize": {"type": "fit", "contains": "padding"},
      // see https://vega.github.io/vega/docs/specification/
      const spec = this.specWithValues
      // const width = this.width
      // const scaling = width / (spec.width + spec.padding * 2)
      // const height = spec.height * scaling
      await embed(`#${this.divId}`, spec, {
        // width,
        // height,
        // renderer: 'svg',
        actions: false
      })
    },
    exportViz() {
      const canvas = document.getElementById(this.divId).firstChild
      const img = canvas.toDataURL('image/' + this.exportExtension)
      this.href = img
    }
  }
}
</script>

<style>
/* Vega may insert <select> html components, but because of Vue (?) they are unstyled */
select {
  background-color: #dddddd;
  border: 1px solid black;
  border-radius: 5px;
}
</style>
