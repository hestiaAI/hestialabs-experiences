<template>
  <div>
    <VSelect
      v-if="displayFilters"
      v-model="selectedHeaders"
      :items="headers"
      label="Select columns to search"
      placeholder="Select..."
      multiple
      selection
      clearable
      small-chips
      deletable-chips
      hide-details
      menu-props="auto, overflowY, offsetY, top"
    />
    <BaseSearchBar v-model="searchValue"></BaseSearchBar>
  </div>
</template>

<script>
export default {
  props: {
    displayFilters: {
      type: Boolean,
      default: () => true
    },
    headers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedHeaders: [],
      searchValue: ''
    }
  },
  watch: {
    selectedHeaders(val) {
      this.update(val, this.searchValue)
    },
    searchValue(val) {
      this.update(this.selectedHeaders, val)
    },
    headers: {
      immediate: true,
      handler(val) {
        this.selectedHeaders = val.map(v => v.value)
      }
    }
  },
  methods: {
    update(headers, search) {
      this.$emit('update', headers, search)
    }
  }
}
</script>
