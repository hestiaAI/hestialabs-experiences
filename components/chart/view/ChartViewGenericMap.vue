<template>
  <VContainer v-if="values.length > 0">
    <template v-if="total > 0">
      <VRow>
        <VCol cols="12">
          <UnitIframe src="/kepler" :args="keplerArgs" />
        </VCol>
        <p v-if="config.consent">
          Please use the search box and filters below to change what is shown on
          the map.<br />
          Any filtering you do will also limit what data is shared into the pool
          if you share this tab on the 'Share My Data' tab.
        </p>
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
import { mapState } from 'vuex'
import mixin from './mixin'

export default {
  mixins: [mixin],
  props: {
    keplerConfig: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      filteredRows: []
    }
  },
  computed: {
    ...mapState(['config']),
    results() {
      return this.values
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
        config: JSON.parse(JSON.stringify(this.keplerConfig))
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
