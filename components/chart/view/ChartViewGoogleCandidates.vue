<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p v-if="total === 0" class="text-subtitle-2">
          No records were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          This map shows the other candidate places proposed by Google linked to
          the location that Google think you visited:
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
import keplerConfig from './kepler_config_candidate.js'
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
          winnerLatitude: v.winnerLatitude * 1e-7,
          winnerLongitude: v.winnerLongitude * 1e-7,
          winnerSemanticType:
            v.winnerSemanticType === 'null' ? null : v.winnerSemanticType,
          loserLatitude: v.loserLatitude * 1e-7,
          loserLongitude: v.loserLongitude * 1e-7,
          loserSemanticType:
            v.loserSemanticType === 'null' ? null : v.loserSemanticType
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
    drawViz() {},
    onTableFilter(newItems) {
      this.filteredRows = newItems
    }
  }
}
</script>
