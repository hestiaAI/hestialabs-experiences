<template>
  <VContainer>
    <VRow>
      <VCol cols="12" md="4">
        <VCard>
          <VCardTitle>
            {{ cardTitle }}
            <VSpacer />
            <VTextField
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('Search')"
              :placeholder="$t('Type...')"
              single-line
              hide-details
            />
          </VCardTitle>
          <VDataTable
            v-model="selected"
            :headers="headersTable"
            :items="items"
            single-select
            :search="search"
            item-key="name"
            show-select
            class="elevation-1 v-data-table__advertisers"
            @item-selected="drawSunburst"
            @click:row="(item, data) => selectAdvertiser(data)"
          >
            <template #item.data-table-select="{ isSelected, select }">
              <VSimpleCheckbox v-ripple :value="isSelected" @click="selectAdvertiser({ isSelected, select })" />
            </template>
          </VDataTable>
        </VCard>
      </VCol>
      <VCol cols="12" md="8">
        <ChartViewSunburst :id="id" :values="selectedValues" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import mixin from './mixin'
import ChartViewSunburst from './ChartViewSunburst.vue'

export default {
  mixins: [mixin],
  props: {
    cardTitle: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      search: '',
      selected: [],
      selectedValues: [],
      items: []
    }
  },
  computed: {
    headersTable() {
      return [
        { text: 'Advertiser', value: 'name' },
        { text: 'Targeting criteria', value: 'value' }
      ].map(({ text, ...rest }) => ({ text: this.$t(this.kViewBlock(text, 'headers')), ...rest }))
    }
  },
  methods: {
    drawViz() {
      this.items = this.values
        .filter(d => d.parent === 0)
        .sort((a, b) => b.value - a.value)
      this.values.forEach((element) => {
        if (element.parent === 0) {
          element.parent = null
        }
      })
      const [selected] = this.items
      this.selected = [selected]
      this.selectedValues = this.values.filter(d => d.group === selected.name)
    },
    drawSunburst(selection) {
      if (selection.value) {
        this.selectedValues = this.values.filter(d => d.group === selection.item.name)
      }
    },
    selectAdvertiser({ isSelected, select }) {
      return isSelected || select(true)
    }
  },
  components: { ChartViewSunburst }
}
</script>

<style>
.v-data-table__advertisers tbody tr {
  cursor: pointer;
}
</style>
