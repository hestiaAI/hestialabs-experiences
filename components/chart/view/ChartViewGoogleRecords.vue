<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p v-if="total === 0" class="text-subtitle-2">
          No records were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          We found <strong>{{ total }}</strong> records associated to a trip in
          your file <br />
          <br />
          This map shows those records with the color corresponding to an
          activity type:
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
          <VBtn elevation="2" @click="addNoise">Add Noise</VBtn>
          <VBtn elevation="2" @click="clear">Clear</VBtn>
        </VCol>
        <VCol cols="2">
          <VSlider
            v-model="sliderValue"
            :max="100"
            :min="0"
            :step="'1'"
            thumb-label="always"
          >
            Level
          </VSlider>
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
  data() {
    return {
      sliderValue: 0,
      filteredRows: [],
      results: this.values.map(v => {
        return {
          ...v,
          longitude: v.longitude * 1e-7,
          latitude: v.latitude * 1e-7
        }
      })
    }
  },
  computed: {
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
    addNoise() {
      const level = this.sliderValue
      this.results = this.results.map(x => {
        return {
          ...x,
          longitude:
            x.longitude +
            ((0.5 - Math.random()) /
              ((40075 * 10 ** 3 * Math.cos(Math.radians(x.latitude))) / 360)) *
              2 *
              level,
          latitude:
            x.latitude +
            ((0.5 - Math.random()) / (111.32 * 10 ** 3)) * 2 * level
        }
      })
    },
    clear() {
      this.results = this.values.map(v => {
        return {
          ...v,
          longitude: v.longitude * 1e-7,
          latitude: v.latitude * 1e-7
        }
      })
      this.sliderValue = 0
    },
    drawViz() {},
    onTableFilter(newItems) {
      this.filteredRows = newItems
    }
  }
}
</script>
