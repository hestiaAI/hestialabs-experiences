<template>
  <VDialog
    v-if="fileManager !== null"
    v-model="show"
    width="500"
    persistent
    scrollable
  >
    <VCard>
      <VCardTitle class="text-h5 grey lighten-2">
        {{ $t(k('title')) }}
      </VCardTitle>

      <VCardText>
        <VTextField
          v-model="search"
          :label="$t(k('label'))"
          :placeholder="$t(k('placeholder'))"
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
          :open="openItems"
          :active="activeItems"
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

      <VDivider />

      <VCardActions>
        <VSpacer />
        <VBtn color="primary" text @click="clear">
          {{ $t(k('clearButton')) }}
        </VBtn>
        <VBtn color="primary" text @click="ok">
          OK
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import { mapState } from '@/utils/store-helper'

export default {
  name: 'SelectFilesDialog',
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
    ...mapState(['consentForm', 'fileManager']),
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
        return this.$store.state.xp.selectedFiles
      },
      set(value) {
        this.$store.commit('xp/setSelectedFiles', value)
      }
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
    k(key) {
      return `unit-consent-form.select-files-dialog.${key}`
    },
    ok() {
      this.show = false
      this.updateCheckboxOnReturn(false)
    },
    clear() {
      this.$store.commit('xp/setSelectedFiles', [])
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
        value = value.concat('file-explorer')
      }
      this.$store.commit('xp/setConsentFormValue', { index, value })
    }
  }
}
</script>
