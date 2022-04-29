<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p class="text-h6">Number of records in your files</p>
        <p v-if="total === 0" class="text-subtitle-2">
          No records were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          We found <strong>{{ total }}</strong> records in your file(s).
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
          <UnitFilterableTable
            v-bind="{ data: { headers: headers, items: results } }"
          />
        </VCol>
      </VRow>
    </template>
  </VContainer>
</template>
<script>
import mixin from './mixin'
import keplerConfig from './kepler-googlePlaces.js'

console.log(keplerConfig)
export default {
  mixins: [mixin],
  data() {
    return {
      total: 0,
      myKeplerInput: null
    }
  },
  computed: {
    results() {
      return this.values.map(v => {
        return {
          ...v,
          longitude: v.longitude * 1e-7,
          latitude: v.latitude * 1e-7
        }
      })
    }
  },
  methods: {
    drawViz() {
      this.total = this.results.length
      this.myKeplerInput = {
        keplerData: {
          fields: this.headers.map(h => {
            return {
              name: h
            }
          }),
          rows: this.results
        },
        config: keplerConfig
      }
    }
  }
}
</script>
