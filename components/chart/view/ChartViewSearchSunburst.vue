<template>
  <VContainer>
    <VRow>
      <VCol cols="5">
        <VCard>
          <VCardTitle>
            Advertisers
            <VSpacer></VSpacer>
            <VTextField
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></VTextField>
          </VCardTitle>
          <VDataTable
            v-model="selected"
            :headers="headers"
            :items="items"
            :single-select="true"
            :search="search"
            item-key="name"
            show-select
            class="elevation-1"
          >
          </VDataTable>
        </VCard>
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
      selected: [{ name: 'Apple', value: 12 }],
      headers: [
        { text: 'Advertiser', value: 'name' },
        { text: 'Impressions', value: 'value' }
      ],
      items: [
        { name: 'Apple', value: 12 },
        { name: 'Samsung', value: 11 },
        { name: 'Android', value: 10 },
        { name: 'Sony', value: 9 }
      ]
    }
  },
  methods: {
    drawViz() {
      console.log(this.values)
    }
  }
}
</script>
