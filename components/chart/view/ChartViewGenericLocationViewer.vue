<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <UnitFilterableTable
          v-bind="{ data: { headers: header, items: results } }"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  data() {
    return {
      results: [],
      header: [
        { text: 'File', value: 'filename' },
        { text: 'Path', value: 'path' },
        { text: 'Latitude', value: 'latitude' },
        { text: 'Longitude', value: 'longitude' },
        { text: 'Description', value: 'description' }
      ]
    }
  },
  methods: {
    drawViz() {
      this.results = this.values
      this.results.forEach(i => (i.description = JSON.stringify(i.description)))
    }
  }
}
</script>
