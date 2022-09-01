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
            {{ $tev(t.titleKey, t.title) }}
          </VTab>
        </VTabs>
        <VTabsItems v-model="tab">
          <VTabItem value="load-data" :transition="false">
            <VCol cols="12 mx-auto" md="6" class="tabItem">
              <UnitIntroduction
                v-bind="{
                  slug,
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
                  <div class="mb-3">
                    {{ $t('This might take a moment') }}
                  </div>
                  <BaseProgressCircular size="64" width="4" />
                </div>
              </VOverlay>
              <UnitQuery v-bind="{slug, ...viewBlock}" />
            </VCol>
          </VTabItem>
        </VTabsItems>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import { debounce, pick } from 'lodash-es'
import DBMS from '../utils/sql'
import FileManager from '../utils/file-manager'
import fileManagerWorkers from '../utils/file-manager-workers'
import { mapState } from 'vuex'
export default {
  name: 'TheDataExperience',
  props: {
    experienceConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    const properties = pick(this.experienceConfig, [
      'databaseConfig',
      'files',
      'hideSummary',
      'hideFileExplorer',
      'keepOnlyFiles',
      'preprocessors',
      'viewBlocks',
      'slug'
    ])
    return {
      tab: null,
      fab: false,
      progress: false,
      error: false,
      success: false,
      message: '',
      overlay: false,
      ...properties
    }
  },
  computed: {
    ...mapState('config', { experienceProgress: 'progress' }),
    ...mapState(['fileManager']),
    tabs() {
      const disabled = !this.success || this.experienceProgress
      const tabs = [
        {
          title: 'Load your data',
          value: 'load-data',
          titleKey: 'load-data.name',
          disabled: this.experienceProgress
        },
        ...(!this.hideSummary
          ? [
              {
                title: 'Summary',
                value: 'summary',
                titleKey: 'summary.name',
                disabled
              }
            ]
          : []),
        ...(!this.hideFileExplorer
          ? [
              {
                title: 'Files',
                value: 'file-explorer',
                titleKey: 'file-explorer.name',
                disabled
              }
            ]
          : []),
        ...this.viewBlocks.map(view => ({
          ...view,
          value: view.id,
          titleKey: this.k(view.id),
          disabled,
          show: true
        }))
      ]
      return tabs
    },
    sqlQueries() {
      return this.viewBlocks.map(o => this.sql[o.sql])
    }
  },
  watch: {
    experienceConfig: {
      immediate: true,
      handler(value) {
        this.$store.commit('setConfig', value)
      }
    },  
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
      handler: debounce(function(value) {
        this.overlay = value
      }, 200)
    }
  },
  mounted() {
    this.switchTab('load-data')
  },
  methods: {
    // Convert local translation key to global vue18n
    k(localKey) {
      return `experiences.${this.slug}.viewBlocks.${localKey}.title`
    },
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
        const section = consentForm.find(({ type }) => type === 'data')
        section.titles = this.viewBlocks.map(e => e.title)
        section.ids = this.viewBlocks.map(e => e.id)
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
      this.message = `${this.$t('Successfully processed in')} ${elapsed / 1000} ${this.$t('seconds')}`
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