<template>
  <VContainer>
    <span class="blue-grey--text text--darken-2 mt-6 mb-6">
      Now select the data points you want to include.
    </span>
    <VCard flat class="pa-3 mt-6">
      <VForm>
        <VRow v-if="!configsFound.length">
          <VCol align="center">
            <span class="caption ma-10">No data points were found in the files you provided.</span>
          </VCol>
        </VRow>
        <VRow v-for="lens in configsFound" :key="lens.id">
          <VCol cols="12">
            <VAutocomplete
              v-model="filters[lens.id]"
              :items="lens.values"
              chips
              closable-chips
              color="blue-grey-lighten-2"
              :label="lens.name"
              multiple
              dense
            />
          </VCol>
        </VRow>
      </VForm>
    </VCard>
  </VContainer>
</template>
<script>

export default {
  props: {
    configs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filters: {},
      items: ['test', 'test2']
    }
  },
  computed: {
    configsFound() {
      return this.configs.filter(c => c.values).map((c) => {
        return {
          ...c,
          values: c.values.map(v => Object.values(v)[0])
        }
      })
    }
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.$emit('change', this.filters)
      }
    }
  }
}
</script>
<style scoped>
</style>
