<template>
  <div>
    <VCard
      v-if="defaultViewElements && fileManager !== null"
      class="pa-2 mb-6"
      flat
    >
      <VRow>
        <VCol cols="1"></VCol>
        <VCol cols="10"
          ><VCardTitle class="justify-center">{{
            defaultViewElements.title
          }}</VCardTitle></VCol
        >
        <VCol cols="1" align-self="center" class="full-height text-center">
          <VTooltip
            v-if="
              ['genericDateViewer', 'genericLocationViewer'].includes(
                defaultViewElements.key
              )
            "
            left
          >
            <template #activator="{ on }">
              <VIcon v-on="on">$vuetify.icons.mdiFileMultipleOutline</VIcon>
            </template>
            <span>All files are used</span>
          </VTooltip>
          <UnitFilesDialog
            v-else-if="fileGlobs.length > 0"
            :file-globs="fileGlobs"
            :file-manager="fileManager"
        /></VCol>
      </VRow>

      <VRow v-if="defaultViewElements.text">
        <VCol>
          <VContainer>
            {{ defaultViewElements.text }}
          </VContainer>
        </VCol>
      </VRow>
      <template v-if="missingFiles.length > 0">
        <BaseAlert class="mt-4"
          >{{ missingFiles.length === 1 ? 'File' : 'Files' }} not found:
          {{ missingFiles.join(', ') }}</BaseAlert
        >
      </template>
      <template v-else>
        <UnitPipelineCustom
          v-if="customPipeline !== undefined"
          v-bind="{
            customPipeline,
            customPipelineOptions: defaultViewElements.customPipelineOptions,
            parameterName: defaultViewElements.parameterName,
            hash: defaultViewElements.key
          }"
          @update="onUnitResultsUpdate"
        />
        <UnitPipelineSql
          v-else-if="sql"
          v-bind="{
            sql,
            parameterName: defaultViewElements.parameterName,
            parameterKey: defaultViewElements.parameterKey,
            hash: defaultViewElements.key
          }"
          @update="onUnitResultsUpdate"
        />
        <UnitPipelineSparql
          v-else
          v-bind="{ sparqlQuery }"
          class="mr-lg-6"
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
                :viz-props="defaultViewElements.vizProps"
              />
              <UnitIframe
                v-else-if="vizUrl"
                :src="vizUrl"
                :data="clonedResult"
              />
            </VCol>
          </VRow>
          <VRow v-if="showTable">
            <VCol>
              <UnitFilterableTable :data="clonedResult" />
            </VCol>
          </VRow>
        </template>
      </template>
    </VCard>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    sparqlQuery: {
      type: String,
      default: null
    },
    defaultViewElements: {
      type: Object,
      default: null
    },
    index: {
      type: Number,
      default: 0
    },
    customPipeline: {
      type: Function,
      default: undefined
    },
    sql: {
      type: String,
      default: ''
    },
    vega: {
      type: Object,
      default: () => ({})
    },
    postprocessors: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      errorMessage: '',
      // `result` keeps track of the internal result from the pipeline.
      // Note: we should not fetch the result from Vuex because
      // then the UnitQuery component instance will react when
      // other instances add to the results object in the store.
      result: null
    }
  },
  computed: {
    ...mapState(['fileManager']),
    showTable() {
      return this.defaultViewElements.showTable
    },
    vizName() {
      return this.defaultViewElements.visualization
    },
    vizUrl() {
      return this.vizName?.startsWith('/') ? this.vizName : undefined
    },
    vizVue() {
      return this.vizName?.endsWith('.vue') ? this.vizName : undefined
    },
    vizVega() {
      return this.vega[this.vizName]
    },
    clonedResult() {
      return JSON.parse(JSON.stringify(this.result))
    },
    fileGlobs() {
      const fileIds = this.defaultViewElements.files ?? []
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
      if (this.defaultViewElements.postprocessor) {
        finalResult =
          this.postprocessors[this.defaultViewElements.postprocessor](
            finalResult
          )
      }
      this.$store.commit('setResult', {
        experience: this.defaultViewElements.key,
        result: finalResult
      })
      this.result = finalResult
    }
  }
}
</script>
