<template>
  <VRow dense>
    <VCol
      v-for="item in items"
      :key="item.label"
      cols="12"
      sm="6"
      :md="Math.max(3, 12 / items.length)"
    >
      <VCard outlined class="fill-height">
        <VCardTitle class="justify-center text-caption pb-0">
          {{ item.label }}
        </VCardTitle>
        <VCardText class="text-h5 text-center text--primary pt-2">
          {{ item.value }}
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script>
// Key figures as outlined cards, in the style of the other experiences'
// overviews (e.g. ChartViewOverviewUber).
export default {
  name: 'KpiTiles',
  props: {
    // [{ label, value }]
    items: {
      type: Array,
      required: true
    }
  }
}
</script>
