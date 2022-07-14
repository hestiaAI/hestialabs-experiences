<template>
  <div class="pr-3 pl-3">
    <VRow>
      <VCol cols="12">
        <VRangeSlider
          v-model="filter"
          :max="extent[1]"
          :min="extent[0]"
          :step="isFloat ? '0.1' : '1'"
          hide-details
          class="align-center"
          @change="filterChange"
        />
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12" md="4">
        <VTextField
          :value="filter[0]"
          class="mt-0 pt-0"
          label="Min value"
          type="number"
          style="width: 60px"
          :counter="false"
          :step="isFloat ? '0.1' : '1'"
          :max="extent[1]"
          :min="extent[0]"
          @change="
            $set(filter, 0, $event)
            filterChange()
          "
        />
      </VCol>
      <VCol cols="12" md="4" offset-md="4">
        <VTextField
          :value="filter[1]"
          class="mt-0 pt-0"
          label="Max value"
          hide-details
          type="number"
          style="width: 60px"
          @change="
            $set(filter, 1, $event)
            filterChange()
          "
        />
      </VCol>
    </VRow>
  </div>
</template>
<script>
import * as d3 from 'd3'
export default {
  name: 'UnitFilter',
  props: {
    values: {
      type: Array,
      default: () => []
    },
    isFloat: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filter: d3.extent(this.values)
    }
  },
  computed: {
    extent() {
      return d3.extent(this.values)
    },
    filterFunction() {
      if (this.filter === this.extent) { return null } else { return value => value >= this.filter[0] && value <= this.filter[1] }
    }
  },
  methods: {
    filterChange() {
      this.$emit('filter-change', this.filterFunction)
    },
    reset() {
      this.filter = this.extent
      this.filterChange()
    }
  }
}
</script>
