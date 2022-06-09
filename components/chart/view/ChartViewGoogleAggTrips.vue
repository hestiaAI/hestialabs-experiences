<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12">
        <p v-if="total === 0" class="text-subtitle-2">
          No records were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          This shows the public tansportation that was used by at least k
          participants:
        </p>
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
      filteredRows: []
    }
  },
  computed: {
    results() {
      return this.values.map(v => {
        return {
          ...v
        }
      })
    },
    total() {
      return this.values.length
    }
  },
  methods: {
    drawViz() {}
  }
}
</script>
