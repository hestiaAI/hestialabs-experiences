<template>
  <DataValidator :data="data">
    <div :id="divId" ref="graph"></div>
    <VRow>
      <VCol cols="6 mx-auto">
        <BaseButton text="Export" @click="exportViz" />
        <BaseButtonDownload
          :href="dataURL"
          :extension="exportExtension"
          :disabled="!dataURL"
        />
      </VCol>
    </VRow>
  </DataValidator>
</template>

<script>
import embed from 'vega-embed'

export default {
  props: {
    specFile: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      required: true
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
      dataURL: ''
    }
  },
  computed: {
    items() {
      return this.data.items
    },
    clonedItems() {
      // Vega happens to modify values,
      // so we clone them to avoid affecting
      // other graphs that could
      // possibly use the same values
      if (!this.items?.length) {
        return []
      }
      return JSON.parse(JSON.stringify(this.items))
    },
    specWithItems() {
      // Changing the values involves
      // stuffing them into a spec.
      // We'll keep an original spec
      // that we clone whenever values change.
      // That's not entirely necessary
      // but keeps the linter happy.
      if (!this.specFile?.data) {
        // invalid data
        return {}
      }
      const values = this.clonedItems
      const spec = this.specFile
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
    specWithItems() {
      this.draw()
    }
  },
  mounted() {
    this.width = this.$refs.graph?.offsetWidth ?? 0
    this.draw()
  },
  methods: {
    async draw() {
      // TODO find a way to make vega respect the width...
      // put something like autosize in the spec
      // "autosize": {"type": "fit", "contains": "padding"},
      // see https://vega.github.io/vega/docs/specification/
      const spec = this.specWithItems
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
      this.dataURL = canvas.toDataURL(`image/${this.exportExtension}`)
    }
  }
}
</script>

<style>
/* Vega may insert <select> html components */
.vega-bind select {
  background-color: #dddddd;
  border: 1px solid black;
  border-radius: 5px;
  padding: 3px 10px;
  margin-top: 10px;
}
</style>
