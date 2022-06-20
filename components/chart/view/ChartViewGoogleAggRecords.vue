<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p v-if="total === 0" class="text-subtitle-2">
          No records were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          This map shows the records that were logged during a travel with the
          color corresponding to an activity type:
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
import keplerConfig from './kepler_config_records.js'
export default {
  mixins: [mixin],
  data () {
    return {
      filteredRows: []
    }
  },
  computed: {
    results () {
      return this.values.map((v) => {
        return {
          ...v
        }
      })
    },
    total () {
      return this.results.length
    },
    filtered () {
      return this.filteredRows.length
    },
    keplerData () {
      return {
        fields: this.headers.map((h) => {
          return {
            name: h
          }
        }),
        rows: this.filteredRows.map(r => this.headers.map(h => r[h]))
      }
    },
    keplerArgs () {
      return {
        keplerData: this.keplerData,
        config: keplerConfig
      }
    }
  },
  methods: {
    drawViz () {},
    onTableFilter (newItems) {
      this.filteredRows = newItems
    }
  }
}
</script>
