<template>
  <div>
    <VCard v-if="fileManager !== null" class="pa-2 mb-6" flat>
      <VRow>
        <VCol cols="1" />
        <VCol cols="10">
          <VCardTitle class="justify-center">
            {{ title }}
          </VCardTitle>
        </VCol>
        <VCol cols="1" align-self="center" class="full-height text-center">
          <VTooltip
            v-if="['genericDateViewer', 'genericLocationViewer'].includes(id)"
            left
          >
            <template #activator="{ on }">
              <VIcon v-on="on">
                $vuetify.icons.mdiFileMultipleOutline
              </VIcon>
            </template>
            <span>All files are used</span>
          </VTooltip>
          <UnitFilesDialog
            v-else-if="fileGlobs.length > 0"
            :file-globs="fileGlobs"
            :file-manager="fileManager"
          />
        </VCol>
      </VRow>

      <VRow v-if="text">
        <VCol>
          <VContainer>
            {{ text }}
          </VContainer>
        </VCol>
      </VRow>
      <template v-if="missingFiles.length > 0">
        <BaseAlert class="mt-4">
          {{ missingFiles.length === 1 ? 'File' : 'Files' }} not found:
          {{ missingFiles.join(', ') }}
        </BaseAlert>
      </template>
      <template v-else>
        <UnitPipelineCustom
          v-if="customPipeline"
          v-bind="{
            customPipeline,
            customPipelineOptions,
            hash: id
          }"
          @update="onUnitResultsUpdate"
        />
        <UnitPipelineSql
          v-else-if="sql"
          v-bind="{
            sql,
            hash: id
          }"
          @update="onUnitResultsUpdate"
        />

        <VRow v-if="errorMessage">
          <VCol>
            <BaseAlert type="error">
              {{ errorMessage }}
            </BaseAlert>
          </VCol>
        </VRow>
        <template v-if="clonedResult">
          <VRow>
            <VCol>
              <UnitVegaViz
                v-if="vizVega"
                :spec-file="vizVega"
                :data="clonedResult"
                class="text-center"
              />
              <ChartView
                v-else-if="vizVue"
                :graph-name="vizVue"
                :data="clonedResult"
                :viz-props="vizProps"
              />
              <UnitIframe
                v-else-if="vizUrl"
                :src="vizUrl"
                :args="clonedResult"
              />
            </VCol>
          </VRow>
          <VRow v-if="showTable">
            <VCol>
              <UnitFilterableTable v-bind="clonedResult" />
            </VCol>
          </VRow>
        </template>
      </template>
    </VCard>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { cloneDeep } from 'lodash'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    files: {
      type: Array,
      default: null
    },
    postprocessor: {
      type: Function,
      required: true
    },
    visualization: {
      type: [String, Object],
      default: ''
    },
    sql: {
      type: String,
      default: ''
    },
    customPipeline: {
      type: [String, Function],
      default: undefined
    },
    customPipelineOptions: {
      type: [Object, Array],
      default: undefined
    },
    showTable: {
      type: Boolean,
      required: true
    },
    vizProps: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const { visualization: v } = this
    let vizUrl = false
    let vizVue = false
    let vizVega = false
    if (typeof v === 'string') {
      vizUrl = v.startsWith('/') && v
      vizVue = v.endsWith('.vue') && v
    } else if (typeof v === 'object') {
      vizVega = v
    }
    return {
      errorMessage: '',
      // `result` keeps track of the internal result from the pipeline.
      // Note: we should not fetch the result from Vuex because
      // then the UnitQuery component instance will react when
      // other instances add to the results object in the store.
      result: null,
      vizUrl,
      vizVue,
      vizVega
    }
  },
  computed: {
    ...mapState(['fileManager']),
    clonedResult() {
      return cloneDeep(this.result)
    },
    fileGlobs() {
      const fileIds = this.files ?? []
      return fileIds.map(id => this.fileManager.idToGlob[id])
    },
    missingFiles() {
      return this.fileGlobs
        .map(glob => [glob, this.fileManager.findMatchingFilePaths(glob)])
        .filter(([_, files]) => files.length === 0)
        .map(([glob, _]) => glob)
    }
  },
  watch: {
    fileManager(value) {
      if (!value) {
        // When fileManager is reset,
        // we set result to null to ensure
        // the viz component is not mounted
        // before new results from the pipeline
        // are available (see clonedResult)
        this.result = null
      }
    }
  },
  methods: {
    onUnitResultsUpdate({ result, error }) {
      let finalResult = result
      if (error) {
        console.error(error)
        this.errorMessage = error instanceof Error ? error.message : error
        return
      }
      // Postprocessing
      finalResult = this.postprocessor(finalResult)
      this.$store.commit('setResult', {
        experience: this.id,
        result: finalResult
      })
      this.result = finalResult
    }
  }
}
</script>
