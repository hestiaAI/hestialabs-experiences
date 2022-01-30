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
          <VTab
            v-for="(t, index) in tabs"
            :key="index"
            :disabled="t.disabled"
            nuxt
            :to="`#${t.value}`"
          >
            {{ t.title }}
          </VTab>
        </VTabs>
        <VTabsItems v-model="tab">
          <VTabItem value="load-data">
            <VCol cols="12 mx-auto" sm="6" class="tabItem pa-5">
              <UnitIntroduction
                v-bind="{ companyName: title, dataPortal, isGenericViewer }"
                ref="unit-introduction"
              />
              <UnitFiles
                v-bind="{
                  extensions,
                  files,
                  multiple,
                  samples: data,
                  isGenericViewer
                }"
                ref="unit-files"
                @update="onUnitFilesUpdate"
              />
              <template v-if="progress">
                <BaseProgressCircular class="mr-2" />
                <span>Processing files...</span>
              </template>
              <template v-else-if="error || success">
                <BaseAlert
                  :type="error ? 'error' : 'success'"
                  border="top"
                  colored-border
                  max-width="600"
                  >{{ message }}
                </BaseAlert>
              </template>
            </VCol>
          </VTabItem>
          <VTabItem value="summary">
            <VCol cols="12 mx-auto" sm="6" class="tabItem">
              <UnitSummary v-bind="{ fileManager }" @switch-tab="switchTab" />
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
            :value="defaultViewElements.key"
          >
            <VCol cols="12 mx-auto" class="tabItem">
              <VOverlay :value="overlay" absolute opacity="0.8">
                <div
                  class="d-flex flex-column align-center"
                  style="width: 100%; height: 100%"
                >
                  <div class="mb-3">This might take a moment</div>
                  <BaseProgressCircular size="64" width="4" />
                </div>
              </VOverlay>
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
          <VTabItem v-if="consentForm" value="share-data">
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
import { mapState } from 'vuex'

import debounce from 'lodash/debounce'

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
      type: Object,
      default: () => {}
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
      db: null,
      overlay: false
    }
  },
  computed: {
    ...mapState('experience', { experienceProgress: 'progress' }),
    tabs() {
      const disabled = !this.success || this.experienceProgress
      const tabs = [
        {
          title: 'Load your Data',
          value: 'load-data',
          disabled: this.experienceProgress
        },
        {
          title: 'Summary',
          value: 'summary',
          disabled
        },
        {
          title: 'Files',
          value: 'file-explorer',
          disabled
        },
        ...this.defaultView.map(view => ({
          ...view,
          value: view.key,
          disabled
        }))
      ]
      if (this.consentForm) {
        tabs.push({
          title: 'Share my data',
          value: 'share-data',
          disabled
        })
      }
      return tabs
    },
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
  watch: {
    // debounce overlay
    experienceProgress: {
      immediate: true,
      handler: debounce(function (value) {
        this.overlay = value
      }, 200)
    }
  },
  mounted() {
    this.switchTab('load-data')
    this.$root.$on('goToFileExplorer', () => this.switchTab('file-explorer'))
  },
  methods: {
    switchTab(value) {
      this.$router.push(`#${value}`)
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

      // Clean vuex state before changing the filemanager
      this.$store.commit('setFileExplorerCurrentItem', {})

      const fileManager = new FileManager(
        this.preprocessors,
        fileManagerWorkers
      )
      try {
        await fileManager.init(uppyFiles, this.multiple, this.files)
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
      setTimeout(() => this.switchTab('summary'), 500)

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
