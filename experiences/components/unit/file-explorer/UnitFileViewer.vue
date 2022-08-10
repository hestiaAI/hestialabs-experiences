<template>
  <VCard v-if="fileManager" flat style="height: 100%">
    <template v-if="filename">
      <VCardTitle v-if="filename" class="justify-center pa-0 mx-4">
        <span class="text-subtitle-1">{{ $t(k('Exploring file')) }}: <strong>{{ filename }}</strong></span>
        <VSpacer />
        <BaseButtonDownload
          small
          :href="downloadPath"
          :filename="filename"
        />
      </VCardTitle>
      <VCardText>
        <VTabs v-model="tab">
          <VTabsSlider color="primary" />
          <VTab
            v-for="tabName in tabs"
            :key="tabName"
          >
            {{ $t(k(tabName)) }}
          </VTab>
        </VTabs>
        <VTabsItems v-model="tab" class="mt-3">
          <VTabItem>
            <component
              :is="fileViewerComponent"
              v-bind="{ fileManager, filename }"
              @loading="onLoading"
              @select-accessor="onSelectAccessor"
            />
          </VTabItem>
          <VTabItem>
            <UnitFileExplorerViewerRaw
              v-bind="{ fileManager, filename }"
              @loading="onLoading"
            />
          </VTabItem>
          <VTabItem>
            <UnitFileExplorerViewerSchema
              v-bind="{ fileManager, filename }"
              @loading="onLoading"
            />
          </VTabItem>
        </VTabsItems>
        <div v-if="customPipelineOptions">
          <UnitPipelineCustom
            v-bind="{
              fileManager,
              customPipeline,
              customPipelineOptions
            }"
            hash="file-explorer"
            @update="onUnitResultsUpdate"
          />
          <UnitFilterableTable
            v-if="tableData"
            :data="tableData.result"
          />
        </div>
      </VCardText>
    </template>
    <template v-else>
      <VCardText style="height: 100%;">
        <VRow style="height: 100%;" align="center" justify="center">
          <p>
            {{ $t(k('select')) }}
          </p>
        </VRow>
      </VCardText>
    </template>
  </VCard>
</template>

<script>
import { mapState } from 'vuex'
import { jsonToTableConverter } from '~/utils/generic-pipelines'

export default {
  name: 'UnitFileViewer',
  props: {
    selectedItem: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      supportedTypes: new Set([
        'json',
        'csv',
        'pdf',
        'img',
        'html',
        'txt',
        'xlsx'
      ]),
      tableData: undefined,
      customPipeline: jsonToTableConverter,
      customPipelineOptions: undefined,
      tab: null,
      tabs: ['Pretty', 'Raw', 'Schema']
    }
  },
  computed: {
    ...mapState(['fileManager']),
    fileType() {
      // @fileType should match the postfix of the Vue component name
      return this.selectedItem?.type
    },
    filename() {
      return this.selectedItem.filename
    },
    downloadPath() {
      // TODO avoid code duplication with viewer/mixin-path
      // maybe by setting path as an attribute on every viewer
      if (this.fileManager.fileDict[this.filename]) {
        return URL.createObjectURL(this.fileManager.fileDict[this.filename])
      }
      return ''
    },
    fileViewerComponent() {
      const { fileType } = this
      const postfix = this.supportedTypes.has(fileType) ? fileType[0].toUpperCase() + fileType.substring(1) : 'Unknown'
      return () => import(`~/components/unit/file-explorer/viewer/UnitFileExplorerViewer${postfix}`)
    }
  },
  methods: {
    k(key) {
      return `file-explorer.${key}`
    },
    onLoading(loading) {
      this.$emit('loading', loading)
    },
    onSelectAccessor(accessor) {
      // TODO make this work better
      // const options = await createTableOptions(this.fileManager, accessor)
      this.customPipelineOptions = [{ accessor }]
    },
    onUnitResultsUpdate(result) {
      this.tableData = result
    }
  }
}
</script>
