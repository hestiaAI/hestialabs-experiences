<template>
  <div>
    <BaseButtonShare color="primary" :outlined="false" />
    <VRow>
      <VCol>
        <VTabs
          v-model="tab"
          dark
          background-color="primary"
          slider-color="secondary"
          slider-size="4"
          show-arrows
          center-active
          centered
          fixed-tabs
          class="fixed-tabs-bar"
        >
          <VTab>Upload</VTab>
          <VTab :disabled="!success" href="#summary">Summary</VTab>
          <VTab :disabled="!success">Files</VTab>
          <VTab
            v-for="(el, index) in defaultView"
            :key="index"
            :disabled="!success"
          >
            {{ el.title }}
          </VTab>
          <VTab v-if="consentForm" :disabled="!success">Share my data</VTab>
        </VTabs>
        <VTabsItems v-model="tab">
          <VTabItem>
            <VCol cols="12 mx-auto" sm="6" class="tabItem pa-5">
              <UnitIntroduction
                v-bind="{ companyName: title, dataPortal, isGenericViewer }"
              />
              <UnitFiles
                v-bind="{
                  extensions,
                  files,
                  multiple,
                  allowMissingFiles,
                  samples: data,
                  isGenericViewer
                }"
                @update="onUnitFilesUpdate"
              />
              <template v-if="progress">
                <BaseProgressCircular class="mr-2" />
                <span>Processing files...</span>
              </template>
              <template v-else-if="error || success">
                <VAlert
                  :type="error ? 'error' : 'success'"
                  border="top"
                  colored-border
                  max-width="600"
                  >{{ message }}
                </VAlert>
              </template>
            </VCol>
          </VTabItem>
          <VTabItem value="summary">
            <VCol cols="12 mx-auto" sm="6" class="tabItem">
              <UnitSummary v-bind="{ fileManager }" />
            </VCol>
          </VTabItem>
          <VTabItem>
            <div class="tabItem">
              <UnitFileExplorer v-bind="{ fileManager }" />
            </div>
          </VTabItem>
          <VTabItem
            v-for="(defaultViewElements, index) in defaultView"
            :key="index"
          >
            <VCol cols="12 mx-auto" class="tabItem">
              <UnitQuery
                v-bind="{
                  defaultViewElements,
                  customPipeline:
                    customPipelines !== undefined
                      ? customPipelines[defaultViewElements.customPipeline]
                      : undefined,
                  sparqlQuery: queries[index],
                  sql: sqlQueries[index],
                  fileManager,
                  postprocessors,
                  index,
                  vega,
                  db
                }"
              />
            </VCol>
          </VTabItem>
          <VTabItem v-if="consentForm">
            <VCol cols="12 mx-auto" sm="6" class="tabItem">
              <UnitConsentForm
                v-bind="{
                  consentForm,
                  defaultView,
                  fileManager,
                  showDataExplorer
                }"
              />
            </VCol>
          </VTabItem>
        </VTabsItems>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import { validExtensions } from '~/manifests/utils'
import FileManager from '~/utils/file-manager'
import fileManagerWorkers from '~/utils/file-manager-workers'
import parseYarrrml from '~/utils/parse-yarrrml'
import rdfUtils from '~/utils/rdf'

export default {
  name: 'TheDataExperience',
  props: {
    title: {
      type: String,
      required: true
    },
    dataPortal: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    ext: {
      type: String,
      required: true,
      validator(val) {
        return (
          val === 'all' ||
          val.split(',').every(v => validExtensions.includes(v))
        )
      }
    },
    files: {
      type: Array,
      default: () => []
    },
    defaultView: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    preprocessors: {
      type: Object,
      default: () => {}
    },
    postprocessors: {
      type: Object,
      default: undefined
    },
    allowMissingFiles: {
      type: Boolean,
      default: false
    },
    customPipelines: {
      type: Object,
      default: undefined
    },
    isGenericViewer: {
      type: Boolean,
      default: false
    },
    showDataExplorer: {
      type: Boolean,
      default: true
    },
    sparql: {
      type: Object,
      default: () => {}
    },
    sql: {
      type: Object,
      default: () => {}
    },
    vega: {
      type: Object,
      default: () => {}
    },
    yarrrml: {
      type: String,
      default: ''
    },
    databaseBuilder: {
      type: Function,
      default: undefined
    }
  },
  data() {
    return {
      tab: null,
      progress: false,
      error: false,
      success: false,
      message: '',
      rml: '',
      fileManager: null,
      db: null
    }
  },
  computed: {
    queries() {
      return this.defaultView.map(o => this.sparql[o.query])
    },
    sqlQueries() {
      return this.defaultView.map(o => this.sql[o.sql])
    },
    isRdfNeeded() {
      return this.defaultView.filter(v => 'query' in v).length > 0
    },
    consentForm() {
      const consent = this.$store.state.config.consent
      if (consent) {
        const key = this.$route.params.key
        if (key in consent) {
          return consent[key]
        } else if ('default' in consent) {
          return consent.default
        }
      }
      return null
    },
    extensions() {
      return this.ext === 'all'
        ? []
        : this.ext
            .replace(/\s/g, '')
            .split(',')
            .map(ext => `.${ext}`)
    }
  },
  mounted() {
    this.$root.$on('goToFileExplorer', () => {
      this.tab = 1
    })
  },
  methods: {
    handleError(error) {
      console.error(error)
      this.error = true
      this.message = error instanceof Error ? error.message : error
      this.progress = false
    },
    async onUnitFilesUpdate(uppyFiles) {
      this.message = ''
      this.error = false
      this.success = false
      this.progress = true
      const start = new Date()

      // Clean vuex state before changing the filemanager
      this.$store.commit('setFileExplorerCurrentItem', {})

      this.fileManager = new FileManager(
        this.preprocessors,
        this.allowMissingFiles,
        fileManagerWorkers
      )
      await this.fileManager.init(uppyFiles, this.multiple)

      // Check that the required files are present in the archive
      const missing = this.files
        .map(filePathGlob => [
          filePathGlob,
          this.fileManager.findMatchingFilePaths(filePathGlob).length
        ])
        .filter(([_, n]) => n === 0)
        .map(([filePathGlob, _]) => filePathGlob)
      if (missing.length > 0) {
        this.message = `Missing file(s): ${missing.join(', ')}`
        this.error = true
        this.progress = false
        return
      }

      // Populate database
      if (this.databaseBuilder !== undefined) {
        this.db = await this.databaseBuilder(this.fileManager)
      }

      if (this.isRdfNeeded && this.yarrrml) {
        try {
          const processedFiles = await this.fileManager.preprocessFiles(
            this.files
          )
          this.rml = await parseYarrrml(this.yarrrml)
          await rdfUtils.generateRDF(this.rml, processedFiles)
        } catch (error) {
          this.handleError(error)
          return
        }
      }

      this.progress = false
      this.success = true
      this.tab = 'summary'

      const elapsed = new Date() - start
      this.message = `Successfully processed in ${elapsed / 1000} sec.`
    }
  }
}
</script>
<style>
.tabItem {
  min-height: calc(100vh - 48px);
}
.fixed-tabs-bar {
  position: -webkit-sticky;
  position: sticky;
  top: 60px;
  z-index: 2500;
}
</style>
