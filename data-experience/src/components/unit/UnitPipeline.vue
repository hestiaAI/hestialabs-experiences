<template>
<div>
  <VRow v-if="errorMessage">
    <VCol>
      <BaseAlert type="error">
        {{ errorMessage }}
      </BaseAlert>
    </VCol>
  </VRow>
  <UnitPipelineViewBlock
    v-if="fileManager !== null"
    v-bind="{ data,
              viewBlockTranslationPrefix,
              missingFiles, ...viewBlock }">
    <template v-slot:infoDialog>
      <UnitFilesDialog
        v-if="fileGlobs.length > 0 || ['genericDateViewer', 'genericLocationViewer'].includes(currentTab)"
        :all-files="['genericDateViewer', 'genericLocationViewer'].includes(currentTab)"
        :file-globs="fileGlobs"
        :file-manager="fileManager"
        />
    </template>
  </UnitPipelineViewBlock>
</div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from '@/utils/store-helper'

import BaseAlert from '@/components/base/BaseAlert.vue'
import UnitPipelineViewBlock from './UnitPipelineViewBlock.vue'
import UnitFilesDialog from './files/UnitFilesDialog.vue'

import { setTimeoutPromise } from '@/utils/utils'
import { kViewBlockPrefix } from '@/utils/i18n-utils'

export default {
  components: {
    BaseAlert,
    UnitFilesDialog,
    UnitPipelineViewBlock
  },
  props: {
    viewBlock: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      errorMessage: false,
      progress: false,
      refreshPipeline: true,
      data: null,
      customPipeline: this.viewBlock.customPipeline
    }
  },
  computed: {
    ...mapState(['currentDB', 'fileManager', 'currentTab']),
    ...mapGetters(['experienceNameAndTag']),
    fileGlobs() {
      const fileIds = this.viewBlock.files ?? []
      return fileIds.map(id => this.fileManager.idToGlob[id])
    },
    missingFiles() {
      return this.fileGlobs
        .map(glob => [glob, this.fileManager.findMatchingFilePaths(glob)])
        .filter(([_, files]) => files.length === 0)
        .map(([glob, _]) => glob)
    },
    viewBlockTranslationPrefix() {
      const nameAndTag = this.experienceNameAndTag
      return kViewBlockPrefix(nameAndTag, this.currentTab)
    }
  },
  watch: {
    progress: {
      immediate: true,
      handler(value) {
        this.setProgress(value)
      }
    },
    fileManager: {
      immediate: true,
      handler(value) {
        if (value) {
          // When switching to a tab, we only want to refresh
          // the corresponding pipeline if this is the first time
          // the tab is opened after the fileManager was reset, for instance,
          // when new data is uploaded or when the store is cleared manually
          this.refreshPipeline = true
        } else {
          // When fileManager is reset,
          // we set data to null to ensure
          // the viz component is not mounted
          // before new results from the pipeline
          // are available (see clonedResult in UnitPipelineViewBlock)
          this.data = null
        }
      }
    },
    currentTab: {
      immediate: true,
      handler(currentTab) {
        // Re-run the pipeline when
        // 1. the tab is reopened, and
        // 2. the store was previously cleared
        if (currentTab === this.viewBlock.id && this.refreshPipeline) {
          this.progress = true
          window.setTimeout(async() => {
            await this.run()
            this.refreshPipeline = false
          }, 500)
        }
      }
    }
  },
  async created() {
    const { customPipeline: p } = this.viewBlock
    if (typeof p === 'string') {
      const { [p]: pipeline } = await import('@/utils/generic-pipelines')
      this.customPipeline = pipeline
    }
  },
  methods: {
    ...mapMutations(['setProgress', 'setResult']),
    async run() {
      const { fileManager, currentDB, customPipeline, customPipelineOptions: options } = this
      const { sql } = this.viewBlock
      this.errorMessage = false
      this.progress = true
      await setTimeoutPromise(1)
      try {
        let result
        if (customPipeline) {
          result = await customPipeline({
            fileManager,
            options
          })
        } else if (sql) {
          result = currentDB.select(sql)
        } else {
          throw new Error('Misconfigured pipeline')
        }
        this.setResult({ result })
        this.data = result
      } catch (error) {
        console.error(error)
        this.errorMessage = error instanceof Error ? error.message : error
      } finally {
        this.progress = false
      }
    }
  }
}
</script>
