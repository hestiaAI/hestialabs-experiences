<template>
  <div>
    <SettingsSpeedDial />
    <VBanner v-if="routeConfig.banner" color="secondary">
      <VRow>
        <VCol cols="12 mx-auto" sm="10">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="routeConfig.banner" />
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
            {{ $tev(t.titleKey, t.title) }}
          </VTab>
        </VTabs>
        <VTabsItems v-model="tab">
          <VTabItem value="load-data" :transition="false">
            <VCol cols="12 mx-auto" md="6" class="tabItem">
              <UnitDownload
                v-if="routeConfig.dataFromBubble"
                v-bind="{
                  slug,
                  progress,
                  error,
                  success,
                  message
                }"
                @update="onUnitFilesUpdate"
              />
              <UnitIntroduction
                v-else
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
          <VTabItem
            v-if="consentFormTemplate"
            value="share-data"
            :transition="false"
          >
            <VCol cols="12 mx-auto" sm="6" class="tabItem">
              <UnitConsentForm />
            </VCol>
          </VTabItem>
        </VTabsItems>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { debounce, pick } from 'lodash-es'

import DBMS from '~/utils/sql'
import FileManager from '~/utils/file-manager'
import fileManagerWorkers from '~/utils/file-manager-workers'
// ...
export default {
  name: 'TheDataExperience',
  data() {
    const experience = this.$store.getters.experience(this.$route)
    const properties = pick(experience, [
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
    ...mapState('experience', { experienceProgress: 'progress' }),
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
      if (this.consentFormTemplate) {
        tabs.push({
          title: 'Share my data',
          value: 'share-data',
          titleKey: 'share-data.name',
          disabled
        })
      }
      return tabs
    },
    sqlQueries() {
      return this.viewBlocks.map(o => this.sql[o.sql])
    },
    routeConfig() {
      return this.$store.getters.routeConfig(this.$route)
    },
    consentFormTemplate() {
      const { consent } = this.routeConfig
      if (consent) {
        const { experience } = this.$route.params
        if (experience in consent) {
          return consent[experience]
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
    k(key) {
      return `experiences.${this.slug}.viewBlocks.${key}.title`
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
      const consoleLabel = (...labels) => `TheDataExperience.onUnitFilesUpdate${labels.length ? '.' + labels.join('.') : ''}`
      console.time(consoleLabel())

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

      try {
        // Set file manager
        const fileManager = new FileManager(
          this.preprocessors,
          fileManagerWorkers,
          this.files,
          this.keepOnlyFiles
        )
        // Set file manager
        console.time(consoleLabel('initFileManager'))
        await fileManager.init(uppyFiles)
        this.$store.commit('setFileManager', fileManager)
        console.timeEnd(consoleLabel('initFileManager'))
        if (dbConfig) {
          const consoleLabelDBMS = consoleLabel.bind(null, 'DBMS')
          console.time(consoleLabelDBMS())
          // create database
          console.time(consoleLabelDBMS('createDB'))
          const db = await DBMS.createDB(dbConfig)
          console.timeEnd(consoleLabelDBMS('createDB'))
          // generate database records via the file manager
          console.time(consoleLabelDBMS('generateRecords'))
          const records = await DBMS.generateRecords(fileManager, dbConfig)
          console.timeEnd(consoleLabelDBMS('generateRecords'))
          // insert the records into the database
          console.time(consoleLabelDBMS('insertRecords'))
          DBMS.insertRecords(db, records)
          console.timeEnd(consoleLabelDBMS('insertRecords'))
          // commit the database to the Vuex store
          this.$store.commit('setCurrentDB', db)
          console.timeEnd(consoleLabelDBMS())
        }
      } catch (e) {
        this.handleError(e)
        return
      }

      console.timeEnd(consoleLabel())

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
