<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p v-if="total === 0" class="text-subtitle-2">
          {{ $t('no-records') }}
        </p>
        <p v-else-if="label_ !== ''" class="text-subtitle-2">
          {{ $t('found') }} <strong>{{ total }}</strong> {{ label_ }} {{ $t('in-files') }}.
        </p>
      </VCol>
    </VRow>
    <template v-if="total > 0">
      <VRow>
        <VCol cols="12">
          <UnitIframe src="/kepler" :args="keplerArgs" />
        </VCol>
        <p v-if="config.consent">
          {{ $t("generic-map.search-info") }}
          <br>
          {{ $t('filter-info') }}
        </p>
      </VRow>
      <template v-if="showButton == true">
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
              {{ $t('generic-map.add-noise') }}
            </VBtn>
          </template>
          <VCard class="mx-auto" max-width="600">
            <VCardTitle>{{ $t('generic-map.noise-level') }}</VCardTitle>
            <VCardText>
              <VRow class="mb-4" justify="space-between">
                <VCol class="text-left">
                  <span
                    class="text-h2 font-weight-light"
                    v-text="sliderValue"
                  />
                  <span class="subheading font-weight-light mr-1">{{ $t('generic-map.meters') }}</span>
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
                  <VIcon @click="decrement">
                    $vuetify.icons.mdiMinus
                  </VIcon>
                </template>

                <template #append>
                  <VIcon @click="increment">
                    $vuetify.icons.mdiPlus
                  </VIcon>
                </template>
              </VSlider>
            </VCardText>
            <VCardActions>
              <VSpacer />

              <VBtn @click="clear">
                {{ $t('Clear') }}
              </VBtn>
              <VBtn color="primary" @click="addNoise">
                {{ $t('Save') }}
              </VBtn>
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
import mixin from './mixin'
import { kAnonymityFilter } from '@/utils/kAnonymity'

export default {
  mixins: [mixin],
  props: {
    keplerConfig: {
      type: Object,
      default: () => null
    },
    mapboxToken: {
      type: String,
      default: () => ''
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
        config: this.keplerConfig,
        mapboxToken: this.mapboxToken
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
      this.results = this.results.map((x) => {
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
    drawViz() {
      console.log(this.$i18n.messages)
    },
    onTableFilter(newItems) {
      this.filteredRows = newItems
    }
  }
}
</script>
