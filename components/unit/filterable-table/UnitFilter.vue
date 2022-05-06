<template>
  <VMenu
    :id="header.value"
    :key="header.value"
    offset-y
    :close-on-content-click="false"
  >
    <template #activator="{ on, attrs }">
      <VBtn icon v-bind="attrs" v-on="on">
        <VIcon small :color="filter ? 'success' : ''">
          $vuetify.icons.mdiFilter
        </VIcon>
      </VBtn>
    </template>
    <div style="background-color: white; width: 280px">
      <div class="d-flex justify-space-between">
        <div class="overline ma-3">{{ header.text }}</div>
        <VChip
          :color="typeColors[String(header.type)]"
          small
          outlined
          class="ma-4"
          >{{ String(header.type).toLowerCase() }}</VChip
        >
      </div>
      <component
        :is="filterComponent"
        v-bind="{ header, values }"
        @filter-change="filterChange"
      />
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
    filterComponent() {
      let filterName = 'SelectFilter.vue' // default Filter

      switch (String(this.header.type)) {
        case 'INT' || 'FLOAT':
          filterName = 'NumberFilter.vue'
          break
        /*
        case 'DATE' || 'DATETIME':
          filterName = 'DateFilter.vue'
          break
          */
      }
      return () =>
        import(`@/components/unit/filterable-table/filters/${filterName}`)
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
