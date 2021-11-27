<template>
  <VCard class="pa-2 my-6">
    <VCardTitle class="justify-center">Explore your files</VCardTitle>
    <VCardText>
      <VRow>
        <VCol cols="3">
          <VCard class="pa-2 my-6">
            <VCardTitle class="justify-center">File hierarchy</VCardTitle>
            <VCardText>
              <VTreeview
                dense
                open-on-click
                activatable
                rounded
                return-object
                transition
                :items="fileManager.getTreeItems()"
                @update:active="setSelectedItem"
              >
                <template #prepend="{ item }">
                  <VIcon>
                    {{ item.icon }}
                  </VIcon>
                </template>
              </VTreeview>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="9">
          <VCard class="pa-2 my-6">
            <VCardTitle class="justify-center">File details</VCardTitle>
            <VCardText>
              <template v-if="selectedItem">
                <p>
                  <span class="mr-2">
                    Exploring file <strong>{{ selectedItem.filename }}</strong>
                  </span>
                  <BaseButtonDownload
                    small
                    :href="path"
                    :filename="selectedItem.filename"
                  />
                </p>
                <component
                  :is="componentForType"
                  v-bind="{ fileManager, filename: selectedItem.filename }"
                  v-if="supportedTypes.has(fileType)"
                />
                <UnitFileExplorerViewerUnknown
                  v-else
                  v-bind="{ fileManager, filename: selectedItem.filename }"
                />
              </template>
              <template v-else>
                <p>Select a file to see it in more details here</p>
              </template>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script>
import FileManager from '~/utils/file-manager.js'

export default {
  name: 'UnitFileExplorer',
  props: {
    fileManager: {
      type: FileManager,
      required: true
    }
  },
  data() {
    return {
      selectedItem: null,
      supportedTypes: new Set(['json', 'csv', 'pdf', 'img', 'html', 'txt'])
    }
  },
  computed: {
    path() {
      // TODO avoid code duplication with viewer/mixin-path
      // maybe by setting path as an attribute on every viewer
      return URL.createObjectURL(
        this.fileManager.fileDict[this.selectedItem.filename]
      )
    },
    fileType() {
      // @fileType should match the postfix of the Vue component name
      return this.selectedItem?.type
    },
    componentForType() {
      const { fileType } = this
      if (!fileType) {
        return
      }
      const postfix = fileType[0].toUpperCase() + fileType.substring(1)
      return () =>
        import(
          `~/components/unit/file-explorer/viewer/UnitFileExplorerViewer${postfix}`
        )
    }
  },
  methods: {
    setSelectedItem(array) {
      const item = array[0]
      const containers = new Set(['folder', 'zip'])
      if (!containers.has(item?.type)) {
        this.selectedItem = item
      }
    }
  }
}
</script>
