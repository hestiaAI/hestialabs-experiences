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
          <VTab>Load your Data</VTab>
          <VTab :disabled="!success" href="#summary">Summary</VTab>
          <VTab :disabled="!success" href="#file-explorer">Files</VTab>
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
                v-bind="{ companyName: title, dataPortal }"
                ref="unit-introduction"
              />
              <UnitFiles
                v-bind="{
                  files,
                  samples: data
                }"
                ref="unit-files"
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
          <VTabItem value="file-explorer">
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
                  fileManager
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
    files: {
      type: Object,
      default: () => {}
    },
    defaultView: {
      type: Array,
      default: () => []
    },
    preprocessors: {
      type: Object,
      default: () => {}
    },
    postprocessors: {
      type: Object,
      default: undefined
    },
    customPipelines: {
      type: Object,
      default: undefined
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
    }
  },
  mounted() {
    this.$root.$on('goToFileExplorer', () => {
      this.tab = 'file-explorer'
    })
  },
  methods: {
    handleError(error) {
      console.error(error)
      this.error = true
      this.message = error instanceof Error ? error.message : error
      this.progress = false
    },
    async onUnitFilesUpdate({ uppyFiles }) {
      this.message = ''
      this.error = false
      this.success = false
      this.progress = true
      const start = new Date()

      // Clean vuex state before changing the filemanager
      this.$store.commit('setFileExplorerCurrentItem', {})

      const fileManager = new FileManager(
        this.preprocessors,
        fileManagerWorkers,
        this.files
      )
      try {
        await fileManager.init(uppyFiles)
      } catch (e) {
        this.handleError(e)
        return
      }
      this.fileManager = fileManager

      // Populate database
      if (this.databaseBuilder !== undefined) {
        this.db = await this.databaseBuilder(this.fileManager)
      }

      if (this.isRdfNeeded && this.yarrrml) {
        try {
          const processedFiles = await this.fileManager.preprocessFiles(
            Object.values(this.files)
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
