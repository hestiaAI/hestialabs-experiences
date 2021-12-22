<template>
  <VDialog v-model="show" width="500" persistent scrollable>
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
          open-on-click
          return-object
          transition
          rounded
          selectable
          selected-color="primary"
          :open.sync="openItems"
          :search="search"
          :items="treeItems"
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
import FileManager from '~/utils/file-manager.js'

export default {
  props: {
    fileManager: {
      type: FileManager,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      search: ''
    }
  },
  computed: {
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
      this.$emit('return', { clear: false })
    },
    clear() {
      this.$store.commit('setSelectedFiles', { key: this.key, value: [] })
      this.show = false
      this.$emit('return', { clear: true })
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
    }
  }
}
</script>
