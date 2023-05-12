<template>
  <VContainer>
    <span v-t="k('filter-description')" class="blue-grey--text text--darken-2 mt-6 mb-6" />
    <VCard flat class="pa-3 mt-6">
      <VForm>
        <VRow v-if="noData">
          <VCol align="center">
            <span v-t="k('no-data')" class="caption ma-10" />
          </VCol>
        </VRow>
        <VRow v-else>
          <template v-for="lens in configs">
            <VCol v-if="lens.values.length" :key="lens.id" cols="12">
              <VAutocomplete
                v-model="lens['selectedValues']"
                :filter="customFilter"
                :items="lens.values.map((item, index) => ({ ...item, id: index }))"
                chips
                color="blue-grey-lighten-2"
                :label="lens.name"
                multiple
                dense
                return-object
                item-value="id"
                @change="updateFilters"
              >
                <template #selection="data">
                  <VChip class="ma-1">
                    <template v-for="(propertyValue, propertyName, idx) in data.item">
                      <div v-if="propertyName !== 'id'" :key="idx">
                        <span v-if="idx > 0" class="mr-1 ml-1">-</span>
                        {{ propertyValue }}
                      </div>
                    </template>
                  </VChip>
                </template>
                <template #item="data">
                  <template v-for="(propertyValue, propertyName, idx) in data.item">
                    <VListItemContent v-if="propertyName !== 'id'" :key="idx + data.item.id">
                      <VListItemTitle>{{ propertyValue }} </VListItemTitle>
                      <VListItemSubtitle>{{ propertyName }}</VListItemSubtitle>
                    </VListItemContent>
                  </template>
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
  computed: {
    noData() {
      return this.configs.every(lens => !lens.values || !lens.values.length)
    }
  },
  watch: {
    value(newValue) {
      this.configs = newValue
    }
  },
  methods: {
    k(key) {
      return `sar-builder.${key}`
    },
    customFilter(item, queryText) {
      return Object.values(item).some(value => value && value.toLocaleLowerCase().includes(queryText.toLocaleLowerCase()))
    },
    updateFilters() {
      this.$emit('input', this.configs)
    }
  }
}
</script>
<style scoped>
</style>
