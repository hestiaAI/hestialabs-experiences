<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p v-if="total === 0" class="text-subtitle-2">
          No records were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          We found <strong>{{ total }}</strong> visited places that were
          recorded in your file. <br />
          <br />
          This map shows what places Google think you visited with the size
          corresponding to the time you spent in this place:
        </p>
      </VCol>
    </VRow>
    <template v-if="total > 0">
      <VRow>
        <VCol cols="12">
          <UnitIframe src="/kepler" :args="keplerArgs" />
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12">
          <UnitFilterableTable
            v-bind="{ headers, items: results }"
            @current-items="onTableFilter"
          />
        </VCol>
      </VRow>
    </template>
  </VContainer>
</template>
<script>
import mixin from './mixin'
import keplerConfig from './kepler_config_places.js'
export default {
  mixins: [mixin],
  data() {
    return {
      filteredRows: []
    }
  },
  computed: {
    results() {
      return this.values.map(v => {
        return {
          ...v,
          longitude: v.longitude * 1e-7,
          latitude: v.latitude * 1e-7,
          duration: this.compute_duration(v.startTimestamp, v.endTimestamp)
        }
      })
    },
    total() {
      return this.results.length
    },
    filtered() {
      return this.filteredRows.length
    },
    keplerData() {
      return {
        fields: this.headers.map(h => {
          return {
            name: h
          }
        }),
        rows: this.filteredRows.map(r => this.headers.map(h => r[h]))
      }
    },
    keplerArgs() {
      return {
        keplerData: this.keplerData,
        config: keplerConfig
      }
    }
  },
  methods: {
    compute_duration(d1, d2) {
      const date1 = new Date(d1).getTime()
      const date2 = new Date(d2).getTime()
      const res = Math.floor(Math.abs(date1 - date2) / 1000)
      return res
    },
    drawViz() {},
    onTableFilter(newItems) {
      this.filteredRows = newItems
    }
  }
}
</script>
