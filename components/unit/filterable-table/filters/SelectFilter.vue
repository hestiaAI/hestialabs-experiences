<template>
  <VContainer>
    <VAutocomplete
      v-model="filter"
      flat
      hide-details
      full-width
      multiple
      dense
      class="pa-3"
      label="Search ..."
      :items="values"
      :menu-props="{ closeOnClick: true }"
      @change="filterChange"
    >
      <template #selection="{ item, index }">
        <VChip v-if="index < 3" class="ma-1 pr-1">
          <span
            style="
              overflow-x: hidden;
              whitespace: nowrap;
              text-overflow: ellipsis;
            "
          >
            {{ item }}
          </span>
          <VBtn icon small right @click="filter.splice(index, 1)">
            <VIcon small>$vuetify.icon.mdiCloseCircle</VIcon>
          </VBtn>
        </VChip>
        <span v-if="index === 3" class="grey--text caption">
          (+{{ filter.length - 3 }} others)
        </span>
      </template>
    </VAutocomplete>
    <div class="d-flex justify-space-between align-end mt-5">
      <VBtn
        small
        text
        color="primary"
        class=""
        @click="reset"
        v-text="`Clear`"
      />
    </div>
  </VContainer>
</template>
<script>
export default {
  name: 'UnitFilter',
  props: {
    header: {
      type: Object,
      required: true
    },
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filter: []
    }
  },
  computed: {
    filterFunction() {
      if (this.filter.length < 1) return null
      else return value => this.filter.includes(value)
    }
  },
  methods: {
    filterChange() {
      this.$emit('filter-change', this.filterFunction)
    },
    reset() {
      this.filter = []
      this.filterChange()
    }
  }
}
</script>
