<template>
  <VContainer fluid>
    <VSelect v-model="selectedItems" v-bind="{ label, items }" multiple>
      <template #prepend-item>
        <VListItem ripple @mousedown.prevent @click="toggle">
          <VListItemAction>
            <VIcon :color="selectedItems.length > 0 ? 'indigo darken-4' : ''">
              {{ icon }}
            </VIcon>
          </VListItemAction>
          <VListItemContent>
            <VListItemTitle> Select All </VListItemTitle>
          </VListItemContent>
        </VListItem>
        <VDivider class="mt-2" />
      </template>
    </VSelect>
  </VContainer>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    selectedItems: []
  }),

  computed: {
    selectAllItems() {
      return this.selectedItems.length === this.items.length
    },
    selectSomeItems() {
      return this.selectedItems.length > 0 && !this.selectAllItems
    },
    icon() {
      if (this.selectAllItems) { return '$vuetify.icons.mdiCloseBox' }
      if (this.selectSomeItems) { return '$vuetify.icons.mdiMinusBox' }
      return '$vuetify.icons.mdiCheckboxBlankOutline'
    }
  },

  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.selectAllItems) {
          this.selectedItems = []
        } else {
          this.selectedItems = this.items.slice()
        }
      })
    }
  }
}
</script>
