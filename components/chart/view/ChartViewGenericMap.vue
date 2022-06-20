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
          the map.<br />
          Any filtering you do will also limit what data is shared into the pool
          if you share this tab on the 'Share My Data' tab.
        </p>
      </VRow>
      <template v-if="button == true">
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
              Add Noise
            </VBtn>
          </template>
          <VCard class="mx-auto" max-width="600">
            <VCardTitle>Noise Level</VCardTitle>
            <VCardText>
              <VRow class="mb-4" justify="space-between">
                <VCol class="text-left">
                  <span
                    class="text-h2 font-weight-light"
                    v-text="sliderValue"
                  ></span>
                  <span class="subheading font-weight-light mr-1">meters</span>
                </VCol>
              </VRow>

              <VSlider
                v-model="sliderValue"
                :max="100"
                :min="0"
                :step="'1'"
                track-color="grey"
                always-dirty
              >
                <template #prepend>
                  <VIcon @click="decrement"> $vuetify.icons.mdiMinus </VIcon>
                </template>

                <template #append>
                  <VIcon @click="increment"> $vuetify.icons.mdiPlus </VIcon>
                </template>
              </VSlider>
            </VCardText>
            <VCardActions>
              <VSpacer></VSpacer>

              <VBtn @click="clear">Clear</VBtn>
              <VBtn color="primary" @click="addNoise">Save</VBtn>
            </VCardActions>
          </VCard>
        </VMenu>
      </template>
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
import { kAnonymityFilter } from './utils/kAnonymity'
import mixin from './mixin'

export default {
  mixins: [mixin],
  props: {
    keplerConfig: {
      type: Object,
      default: () => null
    },
    showButton: {
      type: Boolean,
      default: () => false
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
      button: this.showButton,
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
    increment() {
      this.sliderValue += 1
    },
    decrement() {
      this.sliderValue -= 1
    },
    addNoise() {
      this.menu = false
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
      this.menu = false
      this.results = this.values
      this.sliderValue = 0
    },
    drawViz() {},
    onTableFilter(newItems) {
      this.filteredRows = newItems
    }
  }
}
</script>
