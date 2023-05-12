<template>
  <VContainer>
    <span v-t="k('filter-description')" class="blue-grey--text text--darken-2 mt-6 mb-6" />
    <VCard flat class="pa-3 mt-6">
      <VForm>
        <VRow v-if="!configs.length">
          <VCol align="center">
            <span v-t="k('no-data')" class="caption ma-10" />
          </VCol>
        </VRow>
        <VRow>
          <template v-for="lens in configs">
            <VCol v-if="lens.values" :key="lens.id" cols="12">
              <VAutocomplete
                v-model="lens['selectedValues']"
                :filter="customFilter"
                :items="lens.values"
                chips
                closable-chips
                color="blue-grey-lighten-2"
                :label="lens.name"
                multiple
                dense
                return-object
                @change="updateFilters"
              >
                <template #selection="data">
                  <VChip class="ma-1">
                    <div v-for="(propertyValue, _, idx) in data.item" :key="propertyValue">
                      <span v-if="idx > 0" class="mr-1 ml-1">-</span>
                      {{ propertyValue }}
                    </div>
                  </VChip>
                </template>
                <template #item="data">
                  <VListItemContent v-for="(propertyValue, propertyName) in data.item" :key="propertyValue + propertyValue">
                    <VListItemTitle>{{ propertyValue }} </VListItemTitle>
                    <VListItemSubtitle>{{ propertyName }}</VListItemSubtitle>
                  </VListItemContent>
                </template>
              </VAutocomplete>
            </VCol>
          </template>
        </VRow>
      </VForm>
    </VCard>
  </VContainer>
</template>
<script>

export default {
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      configs: this.value,
      filters: {}
    }
  },
  watch: {
    value(newValue) {
      this.configs = newValue
    }
  },
  mounted() {
    console.log('test0', this.configs)
  },
  methods: {
    k(key) {
      return `sar-builder.${key}`
    },
    customFilter(item, queryText) {
      return Object.values(item).some(value => value && value.toLocaleLowerCase().includes(queryText.toLocaleLowerCase()))
    },
    updateFilters() {
      console.log(this.configs)
      this.$emit('input', this.configs)
    }
  }
}
</script>
<style scoped>
</style>
