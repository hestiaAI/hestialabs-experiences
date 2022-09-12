<template>
  <VAutocomplete
    v-model="filter"
    flat
    hide-details
    full-width
    multiple
    dense
    class="pa-3"
    :label="$t('Search')"
    :items="items"
    :menu-props="{ closeOnClick: true, bottom: true }"
  >
    <template #prepend-item>
      <VListItem ripple @click="toggle">
        <VListItemAction>
          <VIcon :color="filter.length > 0 ? 'indigo darken-4' : ''">
            {{ icon }}
          </VIcon>
        </VListItemAction>
        <VListItemContent>
          <VListItemTitle v-t="'Select All'" />
        </VListItemContent>
      </VListItem>
      <VDivider class="mt-2" />
    </template>
    <template #selection="{ item, index }">
      <VChip v-if="index < 1" class="ma-1 pr-1">
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
          <VIcon small>
            $vuetify.icon.mdiCloseCircle
          </VIcon>
        </VBtn>
      </VChip>
      <span v-if="index === 1" class="grey--text caption">
        ({{ $tc('plusXOther', filter.length - 1) }})
      </span>
    </template>
  </VAutocomplete>
</template>

<script>
export default {
  name: 'SelectFilter',
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    console.log('data')
    return {
      filter: [...new Set(this.values)]
    }
  },
  computed: {
    items() {
      return [...new Set(this.values)]
    },
    selectAll() {
      return this.filter.length === this.items.length
    },
    selectSome() {
      return this.filter.length > 0 && !this.selectAll
    },
    icon() {
      if (this.selectAll) {
        return '$vuetify.icons.mdiCloseBox'
      }
      if (this.selectSome) {
        return '$vuetify.icons.mdiMinusBox'
      }
      return '$vuetify.icons.mdiCheckboxBlankOutline'
    },
    filterFunction() {
      if (this.selectAll) {
        return null
      }
      return value => this.filter.includes(value)
    }
  },
  watch: {
    filter() {
      this.$emit('filter-change', this.filterFunction)
    }
  },
  beforeCreate() {
    console.log('beforeCreate')
  },
  created() {
    console.log('created')
  },
  mounted() {
    console.log('mounted')
  },
  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.selectAll) {
          this.filter = []
        } else {
          this.filter = this.items.slice()
        }
      })
    },
    reset() {
      this.filter = this.items
    }
  }
}
</script>
