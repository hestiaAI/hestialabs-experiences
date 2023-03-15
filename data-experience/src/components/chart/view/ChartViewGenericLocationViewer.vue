<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p class="text-h6">
          {{ $t(kViewBlock('graphTitle')) }}
        </p>
        <p
          v-if="total === 0"
          class="text-subtitle-2"
        >
          {{ $t(kViewBlock('graphNoLocation')) }}
        </p>
        <!-- https://kazupon.github.io/vue-i18n/guide/interpolation.html#slots-syntax-usage -->
        <i18n
          v-else
          :path="kViewBlock('locations')"
          tag="p"
          class="text-subtitle-2"
        >
          <template #total>
            <span
              class="font-weight-bold"
              v-text="total"
            />
          </template>
        </i18n>
      </VCol>
    </VRow>
    <template v-if="total > 0">
      <VRow>
        <VCol cols="12">
          <UnitKepler :args="keplerArgs" />
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12">
          <UnitFilterableTable
            v-bind="{ headers: header, items: values, viewBlockTranslationPrefix }"
            @current-items="onTableFilter"
          />
        </VCol>
      </VRow>
    </template>
  </VContainer>
</template>
<script>
import mixin from './mixin'
import UnitKepler from '@/components/unit/UnitKepler.vue'
import UnitFilterableTable from '@/components/unit/filterable-table/UnitFilterableTable.vue'

export default {
  components: { UnitKepler, UnitFilterableTable },
  mixins: [mixin],
  data() {
    return {
      filteredRows: this.values,
      header: [
        ['File', 'filename'],
        ['Path', 'path'],
        ['Latitude', 'latitude'],
        ['Longitude', 'longitude'],
        ['Description', 'description']
      ].map(([text, value]) => ({ text, value }))
    }
  },
  computed: {
    total() {
      return this.values.length
    },
    filtered() {
      return this.filteredRows.length
    },
    keplerData() {
      return {
        fields: this.header.map(({ text: name }) => ({ name })),
        rows: this.filteredRows.map(r => this.header.map(h => r[h.value]))
      }
    },
    keplerArgs() {
      return {
        keplerData: this.keplerData,
        config: null,
        mapboxToken: this.mapboxToken
      }
    }
  },
  methods: {
    onTableFilter(newItems) {
      this.filteredRows = newItems
    }
  }
}
</script>
