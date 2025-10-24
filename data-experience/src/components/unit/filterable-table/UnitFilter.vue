<template>
  <VMenu
    :id="header.value"
    :key="header.value"
    offset-y
    :close-on-content-click="false"
    max-width="600"
  >
    <template #activator="{ on, attrs }">
      <VBtn icon v-bind="attrs" v-on="on">
        <VIcon small :color="filter ? 'error' : ''">
          $vuetify.icons.mdiFilter
        </VIcon>
      </VBtn>
    </template>
    <div style="background-color: white; width: 280px">
      <div class="d-flex justify-space-between">
        <div class="overline ma-3">
          {{ header.text }}
        </div>
        <VChip
          :color="typeColors[String(header.type)]"
          small
          outlined
          class="ma-4"
        >
          {{ String(header.type).toLowerCase() }}
        </VChip>
      </div>
      <VContainer class="pa-4">
        <component
          :is="component"
          ref="filter"
          v-bind="{ values, ...filterOptions.args }"
          @filter-change="filterChange"
        />
      </VContainer>
      <div class="d-flex justify-space-between align-end mt-5">
        <VBtn
          small
          text
          class="ma-2"
          color="primary"
          @click="$refs.filter.reset()"
        >
          {{ $t('Clear') }}
        </VBtn>
      </div>
    </div>
  </VMenu>
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
      args: {},
      filter: null,
      typeColors: {
        BOOLEAN: '#F24535',
        STRING: '#265918',
        FLOAT: '#25B8D9',
        INT: '#8B278C',
        DATE: '#F28322',
        DATETIME: '#F28322',
        TIME: '#F28322',
        ARRAY: '#9FC131',
        OBJECT: '#042940'
      }
    }
  },
  computed: {
    filterOptions() {
      switch (String(this.header.type)) {
        case 'INT':
          return { name: 'NumberFilter.vue', args: {} }
        case 'FLOAT':
          return { name: 'NumberFilter.vue', args: { isFloat: true } }
        case 'DATE':
          return { name: 'DateFilter.vue', args: {} }
        case 'DATETIME':
          return { name: 'DateFilter.vue', args: { isDatetime: true } }
        case 'TIME':
          return { name: 'TimeFilter.vue', args: {} }
        default:
          return { name: 'SelectFilter.vue', args: {} }
      }
    },
    component() {
      return () =>
        import(
          `@/components/unit/filterable-table/filters/${this.filterOptions.name}`
        )
    }
  },
  methods: {
    filterChange(filter) {
      this.filter = filter
      this.$emit('filter-change', filter)
    }
  }
}
</script>
