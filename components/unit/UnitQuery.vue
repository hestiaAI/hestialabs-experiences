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

      <VRow>
        <VCol cols="8" class="mx-auto">
          {{ defaultViewElements.text }}
        </VCol>
      </VRow>
      <template v-if="missingFiles.length > 0">
        <BaseAlert class="mt-4"
          >{{ missingFiles.length === 1 ? 'File' : 'Files' }} not found:
          {{ missingFiles.join(', ') }}</BaseAlert
        >
      </template>
      <template v-else>
        <VRow>
          <VCol>
            <UnitPipelineCustom
              v-if="customPipeline !== undefined"
              v-bind="{
                fileManager,
                customPipeline,
                parameterName: defaultViewElements.parameterName,
                defaultViewElements
              }"
              @update="onUnitResultsUpdate"
            />
            <UnitPipelineSql
              v-else-if="sql"
              v-bind="{
                sql,
                parameterName: defaultViewElements.parameterName,
                parameterKey: defaultViewElements.parameterKey
              }"
              @update="onUnitResultsUpdate"
            />
            <UnitPipelineSparql
              v-else
              v-bind="{ sparqlQuery }"
              class="mr-lg-6"
              @update="onUnitResultsUpdate"
            />
          </VCol>
        </VRow>
        <template v-if="finished">
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
              <UnitFilterableTable :data="result" />
            </VCol>
          </VRow>
        </template>
      </template>
    </VCard>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      default: () => {}
    },
    postprocessors: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      finished: false
    }
  },
  computed: {
    ...mapGetters(['fileManager']),
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
    result: {
      get() {
        return this.$store.state.results[this.$route.params.key][
          this.defaultViewElements.key
        ]
      },
      set(result) {
        this.$store.commit('setResult', {
          company: this.$route.params.key,
          experience: this.defaultViewElements.key,
          result
        })
      }
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
    fileManager() {
      this.finished = false
      this.result = null
    }
  },
  methods: {
    onUnitResultsUpdate(result) {
      // Postprocessing
      if (this.defaultViewElements.postprocessor !== undefined) {
        result =
          this.postprocessors[this.defaultViewElements.postprocessor](result)
      }
      this.result = result
      this.finished = true
    }
  }
}
</script>
