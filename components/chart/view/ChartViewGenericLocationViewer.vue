<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p class="text-h6">Number of location records in your files</p>
        <p v-if="total === 0" class="text-subtitle-2">
          No location were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          We found <strong>{{ total }}</strong> locations in your file(s).
        </p>
      </VCol>
    </VRow>
    <template v-if="total > 0">
      <VRow>
        <VCol cols="12">
          <UnitIframe
            v-if="myKeplerInput !== null"
            src="/kepler"
            :data="myKeplerInput"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12">
          <UnitFilterableTable :data="{ headers: header, items: results }" />
        </VCol>
      </VRow>
    </template>
  </VContainer>
</template>
<script>
import mixin from './mixin'
import keplerConfig from './kepler-config'

export default {
  mixins: [mixin],
  data() {
    return {
      total: 0,
      results: [],
      header: [
        { text: 'File', value: 'filename' },
        { text: 'Path', value: 'path' },
        { text: 'Latitude', value: 'latitude' },
        { text: 'Longitude', value: 'longitude' },
        { text: 'Description', value: 'description' }
      ],
      myKeplerInput: null
    }
  },
  methods: {
    drawViz() {
      this.total = this.values.length
      this.results = this.values
      this.myKeplerInput = {
        keplerData: {
          fields: this.headers.map(h => {
            return {
              name: h
            }
          }),
          rows: this.results.map(i => {
            i.description = JSON.stringify(i.description)
            return this.headers.map(h => i[h])
          })
        },
        config: keplerConfig
      }
    }
  }
}
</script>
