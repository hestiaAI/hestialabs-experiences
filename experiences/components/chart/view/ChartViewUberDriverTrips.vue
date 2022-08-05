<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p v-if="total === 0" class="text-subtitle-2">
          No records were found in your file(s).
        </p>
        <p v-else-if="label_ !== ''" class="text-subtitle-2">
          We found <strong>{{ total }}</strong> {{ label_ }} in your file.
        </p>
      </VCol>
    </VRow>
    <template v-if="total > 0">
      <VRow>
        <VCol cols="12">
          <UnitIframe src="/kepler" :args="keplerArgs" />
        </VCol>
        <p v-if="config.consent">
          Please use the search box and filters below to change what is shown on
          the map.<br>
          Any filtering you do will also limit what data is shared into the pool
          if you share this tab on the 'Share My Data' tab.
        </p>
      </VRow>
      <VMenu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-y
      >
        <template #activator="{ on, attrs }">
          <VBtn
            color="primary"
            class="ma-2"
            outlined
            v-bind="attrs"
            v-on="on"
          >
            Convert distance
          </VBtn>
        </template>
        <VCard class="mx-auto" max-width="600">
          <VCardTitle>Convert miles => km</VCardTitle>
          <VCardActions>
            <VSpacer />

            <VBtn @click="clear">
              Clear
            </VBtn>
            <VBtn color="primary" @click="convertToKm">
              Apply
            </VBtn>
          </VCardActions>
        </VCard>
      </VMenu>

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
import { kAnonymityFilter } from '@/utils/kAnonymity'

export default {
  mixins: [mixin],
  props: {
    keplerConfig: {
      type: Object,
      default: () => null
    },
    doKAnonymity: {
      type: Boolean,
      default: () => false
    },
    groupKey: {
      type: Array,
      default: () => []
    },
    otherKeys: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      menu: false,
      sliderValue: 0,
      filteredRows: [],
      results: this.doKAnonymity
        ? kAnonymityFilter(this.values, this.groupKey, this.otherKeys)
        : this.values,
      label_: this.label
    }
  },
  computed: {
    ...mapState(['config']),
    total() {
      return this.results.length
    },
    filtered() {
      return this.filteredRows.length
    },
    keplerData() {
      return {
        fields: this.headers.map((h) => {
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
        config: this.keplerConfig
      }
    }
  },
  methods: {
    convertToKm() {
      this.menu = false
      this.results = this.results.map((x) => {
        return {
          ...x,
          distance: x.distance * 1.60934
        }
      })
    },
    clear() {
      this.menu = false
      this.results = this.values
    },
    drawViz() {},
    onTableFilter(newItems) {
      this.filteredRows = newItems
    }
  }
}
</script>
