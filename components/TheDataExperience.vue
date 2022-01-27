<template>
  <div>
    <SettingsSpeedDial />
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
          @change="scrollToTop()"
        >
          <VTab href="#load-data">Load your Data</VTab>
          <VTab :disabled="!success" href="#summary">Summary</VTab>
          <VTab :disabled="!success" href="#file-explorer">Files</VTab>
          <VTab
            v-for="(el, index) in defaultView"
            :key="index"
            :disabled="!success"
          >
            {{ el.title }}
          </VTab>
          <VTab v-if="consentFormTemplate" :disabled="!success"
            >Share my data</VTab
          >
        </VTabs>
        <VTabsItems v-model="tab">
          <VTabItem value="load-data">
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
              <UnitSummary />
            </VCol>
          </VTabItem>
          <VTabItem value="file-explorer">
            <div class="tabItem">
              <UnitFileExplorer />
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
                  postprocessors,
                  index,
                  vega
                }"
              />
            </VCol>
          </VTabItem>
          <VTabItem v-if="consentFormTemplate">
            <VCol cols="12 mx-auto" sm="6" class="tabItem">
              <UnitConsentForm
                v-bind="{
                  defaultView
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
import { mapGetters } from 'vuex'
import SettingsSpeedDial from './SettingsSpeedDial.vue'
import FileManager from '~/utils/file-manager'
import fileManagerWorkers from '~/utils/file-manager-workers'
import parseYarrrml from '~/utils/parse-yarrrml'
import rdfUtils from '~/utils/rdf'

export default {
  name: 'TheDataExperience',
  components: { SettingsSpeedDial },
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
      fab: false,
      progress: false,
      error: false,
      success: false,
      message: '',
      rml: ''
    }
  },
  computed: {
    ...mapGetters(['fileManager']),
    queries() {
      return this.defaultView.map(o => this.sparql[o.query])
    },
    sqlQueries() {
      return this.defaultView.map(o => this.sql[o.sql])
    },
    isRdfNeeded() {
      return this.defaultView.filter(v => 'query' in v).length > 0
    },
    consentFormTemplate() {
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
  watch: {
    fileManager() {
      if (this.fileManager === null) {
        this.tab = 'load-data'
        this.scrollToTop()
        this.success = false
        this.progress = false
        this.error = false
      }
    }
  },
  mounted() {
    this.$root.$on('goToFileExplorer', () => {
      this.tab = 'file-explorer'
    })
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0)
    },
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

      // Clean vuex state
      this.$store.commit('clearStore', {})

      // Set consent form
      const consentForm = JSON.parse(JSON.stringify(this.consentFormTemplate))
      if (consentForm) {
        const section = consentForm.find(section => section.type === 'data')
        section.titles = this.defaultView.map(e => e.title)
        section.keys = this.defaultView.map(e => e.key)
      }
      this.$store.commit('setConsentForm', consentForm)

      // Set file manager
      const fileManager = new FileManager(
        this.preprocessors,
        fileManagerWorkers,
        this.files
      )
      try {
        await fileManager.init(uppyFiles)
        this.$store.commit('setFileManager', fileManager)
      } catch (e) {
        this.handleError(e)
        return
      }

      // Populate database
      if (this.databaseBuilder !== undefined) {
        try {
          const db = await this.databaseBuilder(fileManager)
          this.$store.commit('setCurrentDB', db)
        } catch (e) {
          this.handleError(e)
          return
        }
      }

      // Generate RDF
      if (this.isRdfNeeded && this.yarrrml) {
        try {
          const processedFiles = await fileManager.preprocessFiles(
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
      this.scrollToTop()
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
