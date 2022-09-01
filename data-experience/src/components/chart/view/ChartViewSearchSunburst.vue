<template>
  <VContainer>
    <VRow>
      <VCol cols="12" md="4">
        <VCard>
          <VCardTitle>
            Advertisers
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
            <template v-slot:[`item.data-table-select`]="{ isSelected, select }">
              <VSimpleCheckbox v-ripple :value="isSelected" @click="selectAdvertiser({ isSelected, select })" />
            </template>
          </VDataTable>
        </VCard>
      </VCol>
      <VCol cols="12" md="8">
        <ChartViewSunburst :values="selectedValues" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  data() {
    return {
      search: '',
      selected: [],
      selectedValues: [],
      headersTable: [
        { text: 'Advertiser', value: 'name' },
        { text: 'Targeting criteria', value: 'value' }
      ],
      items: []
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
      this.selectedValues = this.values.filter(d =>
        d.group === selected.name
      )
    },
    drawSunburst(selection) {
      if (selection.value) {
        this.selectedValues = this.values.filter(
          d => d.group === selection.item.name
        )
      }
    },
    selectAdvertiser({ isSelected, select }) {
      return isSelected || select(true)
    }
  }
}
</script>

<style>
.v-data-table__advertisers tbody tr {
  cursor: pointer;
}
</style>