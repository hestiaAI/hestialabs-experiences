<template>
  <div>
    <SettingsSpeedDial />
    <VBanner v-if="config.banner" color="secondary">
      <VRow>
        <VCol cols="12 mx-auto" sm="10">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="config.banner"></div>
        </VCol>
      </VRow>
    </VBanner>
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
          :eager="false"
          class="fixed-tabs-bar"
          @change="scrollToTop"
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
          <VTabItem value="load-data" :transition="false">
            <VCol cols="12 mx-auto" md="6" class="tabItem">
              <UnitIntroduction
                v-bind="{
                  companyName: title,
                  dataPortal,
                  tutorialVideos,
                  files,
                  samples: data,
                  progress,
                  error,
                  success,
                  message
                }"
                ref="unit-introduction"
                @update="onUnitFilesUpdate"
              />
            </VCol>
          </VTabItem>
          <VTabItem value="summary" :transition="false">
            <VCol cols="12 mx-auto" sm="6" class="tabItem">
              <UnitSummary @switch-tab="switchTab" />
            </VCol>
          </VTabItem>
          <VTabItem value="file-explorer" :transition="false">
            <div class="tabItem">
              <UnitFileExplorer />
            </div>
          </VTabItem>
          <VTabItem
            v-for="(defaultViewElements, index) in defaultView"
            :key="index"
            :value="defaultViewElements.key"
            :transition="false"
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
                  postprocessors,
                  index,
                  vega
                }"
              />
            </VCol>
          </VTabItem>
          <VTabItem
            v-if="consentFormTemplate"
            value="share-data"
            :transition="false"
          >
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
import { mapState } from 'vuex'

import debounce from 'lodash/debounce'

import DBMS from '~/utils/sql'
import FileManager from '~/utils/file-manager'
import fileManagerWorkers from '~/utils/file-manager-workers'

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
    tutorialVideos: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    files: {
      type: Object,
      default: () => {}
    },
    keepOnlyFiles: {
      type: Boolean,
      default: () => false
    },
    defaultView: {
      type: Array,
      default: () => []
    },
    hideSummary: {
      type: Boolean,
      default: () => false
    },
    hideFileExplorer: {
      type: Boolean,
      default: () => false
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
    databaseConfig: {
      type: Object,
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
      rml: '',
      overlay: false
    }
  },
  computed: {
    ...mapState('experience', { experienceProgress: 'progress' }),
    ...mapState(['config', 'fileManager']),
    tabs() {
      const disabled = !this.success || this.experienceProgress
      const tabs = [
        {
          title: 'Load your Data',
          value: 'load-data',
          disabled: this.experienceProgress
        },
        ...(!this.hideSummary
          ? [
              {
                title: 'Summary',
                value: 'summary',
                disabled
              }
            ]
          : []),
        ...(!this.hideFileExplorer
          ? [
              {
                title: 'Files',
                value: 'file-explorer',
                disabled
              }
            ]
          : []),
        ...this.defaultView.map(view => ({
          ...view,
          value: view.key,
          disabled,
          show: true
        }))
      ]
      if (this.consentFormTemplate) {
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
    fileManager(value) {
      if (value === null) {
        this.switchTab('load-data')
        this.success = false
        this.progress = false
        this.error = false
      }
    },
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
  },
  methods: {
    switchTab(value) {
      this.$router.push(`#${value}`)
    },
    scrollToTop() {
      window.setTimeout(() => window.scrollTo(0, 0), 10)
    },
    handleError(error) {
      console.error(error)
      this.error = true
      this.message = error instanceof Error ? error.message : error
      this.progress = false
    },
    async onUnitFilesUpdate({ uppyFiles }) {
      const { databaseConfig: dbConfig } = this
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
        this.files,
        this.keepOnlyFiles
      )
      try {
        await fileManager.init(uppyFiles)
        this.$store.commit('setFileManager', fileManager)
        if (dbConfig) {
          // create database
          const db = await DBMS.createDB(dbConfig)
          // generate database records via the file manager
          const records = await DBMS.generateRecords(fileManager, dbConfig)
          // insert the records into the database
          DBMS.insertRecords(db, records)
          // commit the database to the Vuex store
          this.$store.commit('setCurrentDB', db)
        }
      } catch (e) {
        this.handleError(e)
        return
      }

      this.progress = false
      this.success = true
      setTimeout(() => this.switchTab(this.tabs[1].value), 500)

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
