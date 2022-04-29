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
            <VCol cols="12 mx-auto" sm="6" class="tabItem pa-5">
              <UnitIntroduction
                v-bind="{ companyName: title, dataPortal }"
                ref="unit-introduction"
              />
              <UnitFiles
                v-bind="{
                  files,
                  samples
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
            v-for="(viewBlock, index) in viewBlocks"
            :key="index"
            :value="viewBlock.id"
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
              <UnitQuery v-bind="viewBlock" />
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
                  viewBlocks
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
    dataSamples: {
      type: Array,
      default: () => []
    },
    files: {
      type: Object,
      default: () => ({})
    },
    viewBlocks: {
      type: Array,
      default: () => []
    },
    hideSummary: {
      type: Boolean,
      default: false
    },
    hideFileExplorer: {
      type: Boolean,
      default: false
    },
    preprocessors: {
      type: Object,
      default: () => ({})
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
      overlay: false,
      samples: []
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
        ...this.viewBlocks.map(view => ({
          ...view,
          value: view.id,
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
    sqlQueries() {
      return this.viewBlocks.map(o => this.sql[o.sql])
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
  async created() {
    // files in assets/data/ are loaded with file-loader
    this.samples = []
    for (const filename of this.dataSamples) {
      this.samples.push({
        filename,
        path: (await import(`@/assets/data/${filename}`)).default
      })
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
        section.titles = this.viewBlocks.map(e => e.title)
        section.keys = this.viewBlocks.map(e => e.key)
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
