<template>
  <VDialog
    v-if="fileManager !== null"
    v-model="show"
    width="500"
    persistent
    scrollable
  >
    <VCard>
      <VCardTitle class="text-h5 grey lighten-2"> Select files </VCardTitle>

      <VCardText>
        <VTextField
          v-model="search"
          label="Search for files"
          placeholder="Enter part of a file name..."
          clearable
          hide-details
          prepend-icon="$vuetify.icons.mdiMagnify"
          class="my-4 pr-3"
          style="max-width: 500px"
          outlined
          dense
        />
        <VTreeview
          v-model="selectedFiles"
          dense
          activatable
          open-on-click
          return-object
          transition
          rounded
          selectable
          selected-color="primary"
          :open.sync="openItems"
          :active.sync="activeItems"
          :search="search"
          :items="treeItems"
          @update:active="clickOnLabel"
        >
          <template #prepend="{ item }">
            <VIcon>
              {{ item.icon }}
            </VIcon>
          </template>
        </VTreeview>
      </VCardText>

      <VDivider></VDivider>

      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="primary" text @click="clear"> Clear selection </VBtn>
        <VBtn color="primary" text @click="ok"> OK </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      search: '',
      activeItems: []
    }
  },
  computed: {
    ...mapState(['consentForm']),
    ...mapGetters(['fileManager']),
    treeItems() {
      return this.fileManager.getTreeItems()
    },
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    selectedFiles: {
      get() {
        return this.$store.state.selectedFiles[this.key]
      },
      set(value) {
        this.$store.commit('setSelectedFiles', { key: this.key, value })
      }
    },
    key() {
      return this.$route.params.key
    }
  },
  watch: {
    fileManager: {
      immediate: true,
      handler() {
        this.setInitOpen()
      }
    }
  },
  methods: {
    ok() {
      this.show = false
      this.updateCheckboxOnReturn(false)
    },
    clear() {
      this.$store.commit('setSelectedFiles', { key: this.key, value: [] })
      this.updateCheckboxOnReturn(true)
      this.show = false
    },
    setInitOpen() {
      // If the root has a sequence of nodes with 1 children, pre-open them
      const open = []
      let tree = this.treeItems
      while (tree.length === 1) {
        open.push(tree[0])
        tree = tree[0].children ?? []
      }
      this.openItems = open
    },
    clickOnLabel(event) {
      // vuetify doesn't have an option to check/uncheck when clicking the label, this is a workaround
      const item = event[0]
      if (this.selectedFiles.includes(item)) {
        this.selectedFiles = this.selectedFiles.filter(x => x !== item)
      } else {
        this.selectedFiles = this.selectedFiles.concat([item])
      }
      this.activeItems = []
    },
    updateCheckboxOnReturn(clear) {
      // Unselect when user clears, select when user confirms
      const index = this.consentForm.findIndex(
        section => section.type === 'data'
      )
      let value = this.consentForm[index].value
      if (clear) {
        value = value.filter(x => x !== 'file-explorer')
      } else if (!value.includes('file-explorer')) {
        value.push('file-explorer')
      }
      this.$store.commit('setConsentFormValue', { index, value })
    }
  }
}
</script>
