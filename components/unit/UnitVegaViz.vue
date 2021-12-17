<template>
  <div>
    <template v-if="isValid && !isEmpty">
      <div ref="graph"></div>
      <VRow>
        <VCol cols="6 mx-auto">
          <BaseButtonDownload
            :href="dataURL"
            :extension="exportExtension"
            :disabled="!dataURL"
          />
          <BaseButtonShare file-share :disabled="!files" :files="files" />
        </VCol>
      </VRow>
    </template>
    <BaseAlert v-else-if="!isValid">No data found</BaseAlert>
    <BaseAlert v-else type="warning">
      Data in this format cannot be displayed by this visualization
    </BaseAlert>
  </div>
</template>

<script>
import embed from 'vega-embed'
import _ from 'lodash'

function isDataValid(data) {
  return (
    _.every(
      ['items', 'headers'],
      field => _.has(data, field) && Array.isArray(data[field])
    ) &&
    data.headers.length > 0 &&
    _.every(data.items, i => _.every(data.headers, h => _.has(i, h)))
  )
}

function isDataEmpty(data) {
  return data.items.length === 0
}

export default {
  props: {
    specFile: {
      type: Object,
      default: () => {}
    },
    data: {
      default: undefined,
      validator: isDataValid
    },
    exportExtension: {
      type: String,
      default: 'png'
    }
  },
  data() {
    return {
      width: 0,
      dataURL: '',
      files: null
    }
  },
  computed: {
    isValid() {
      return isDataValid(this.data)
    },
    isEmpty() {
      return isDataEmpty(this.data)
    },
    items() {
      if (!this.isValid) {
        return []
      }
      return this.data.items
    },
    clonedItems() {
      // Vega happens to modify values,
      // so we clone them to avoid affecting
      // other graphs that could
      // possibly use the same values
      if (!this.items.length) {
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
    if (this.isValid && !this.isEmpty) {
      this.draw()
    }
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
      await embed(this.$refs.graph, spec, {
        // width,
        // height,
        // renderer: 'svg',
        actions: false
      })

      const ext = this.exportExtension

      const canvas = this.$refs.graph.firstChild
      const type = `image/${ext}`
      this.dataURL = canvas.toDataURL(type)
      canvas.toBlob(blob => {
        this.files = [new File([blob], `export.${ext}`, { type })]
      }, type)
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
