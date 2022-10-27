<template>
  <VApp>
    <VMain>
      <SettingsSpeedDial />
      <!-- interpret the presence of configName env variable as being in the Nuxt app -->
      <VMenu v-if="!isNuxt && locales.length > 1" offset-y absolute>
        <template #activator="{ on, attrs }">
          <BaseButton
            v-bind="attrs"
            icon="mdiTranslate"
            color="secondary"
            :outlined="false"
            fab
            fixed
            bottom
            left
            v-on="on"
          />
        </template>
        <VList>
          <VListItemGroup v-model="localeIndex">
            <VListItem
              v-for="({ code, name }) in locales"
              :key="code"
            >
              <VListItemTitle>{{ name }}</VListItemTitle>
            </VListItem>
          </VListItemGroup>
        </VList>
      </VMenu>
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
                progress,
                error,
                success,
                message
              }"
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
          v-for="(viewBlock, index) in experienceConfig.viewBlocks"
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
            <UnitQuery v-bind="viewBlock" :slug="experienceConfig.slug" />
          </VCol>
        </VTabItem>
        <VTabItem
          v-if="consent"
          value="share-data"
          :transition="false"
        >
          <VCol cols="12 mx-auto" sm="6" class="tabItem">
            <UnitConsentForm />
          </VCol>
        </VTabItem>
      </VTabsItems>
    </VMain>
  </VApp>
</template>

<script>
import { debounce, cloneDeep, merge } from 'lodash-es'
import { json, timeFormatDefaultLocale } from 'd3'

import { locales, localeCodes } from '@/i18n/locales'

import { mapState } from '@/utils/store-helper'
import DBMS from '@/utils/sql'
import FileManager from '@/utils/file-manager'
import fileManagerWorkers from '@/utils/file-manager-workers'

import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseProgressCircular from '@/components/base/BaseProgressCircular.vue'
import UnitFileExplorer from '@/components/unit/file-explorer/UnitFileExplorer.vue'
import UnitIntroduction from '@/components/unit/UnitIntroduction.vue'
import UnitQuery from '@/components/unit/UnitQuery.vue'
import UnitSummary from '@/components/unit/UnitSummary.vue'
import SettingsSpeedDial from '@/components/misc/SettingsSpeedDial.vue'
import UnitConsentForm from '@/components/unit/consent-form/UnitConsentForm.vue'

const siteConfigDefault = {
  i18nLocale: 'en',
  i18nLocales: localeCodes,
  messages: {}
}

async function d3Locale({ iso }) {
  const locale = await json(`https://cdn.jsdelivr.net/npm/d3-time-format@4/locale/${iso}.json`)
  timeFormatDefaultLocale(locale)
}

export default {
  name: 'TheDataExperience',
  components: {
    BaseButton,
    BaseProgressCircular,
    SettingsSpeedDial,
    UnitFileExplorer,
    UnitIntroduction,
    UnitQuery,
    UnitSummary,
    UnitConsentForm
  },
  props: {
    experienceConfig: {
      type: Object,
      required: true
    },
    siteConfig: {
      type: Object,
      required: true
    },
    bubbleConfig: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      isNuxt: Boolean(process.env.configName),
      localeIndex: 0,
      tab: null,
      fab: false,
      progress: false,
      error: false,
      success: false,
      message: '',
      overlay: false,
      locales
    }
  },
  computed: {
    ...mapState(['fileManager']),
    ...mapState({ experienceProgress: 'progress' }),
    siteConfigMerged() {
      return cloneDeep(merge(siteConfigDefault, this.siteConfig))
    },
    consent() {
      return this.bubbleConfig?.consent
    },
    tabs() {
      const { hideSummary, hideFileExplorer, viewBlocks } = this.experienceConfig
      const disabled = !this.success || this.experienceProgress
      const tabs = [
        {
          title: 'Load your data',
          value: 'load-data',
          titleKey: 'load-data.name',
          disabled: this.experienceProgress
        },
        ...(!hideSummary
          ? [
              {
                title: 'Summary',
                value: 'summary',
                titleKey: 'summary.name',
                disabled
              }
            ]
          : []),
        ...(!hideFileExplorer
          ? [
              {
                title: 'Files',
                value: 'file-explorer',
                titleKey: 'file-explorer.name',
                disabled
              }
            ]
          : []),
        ...viewBlocks.map(view => ({
          ...view,
          value: view.id,
          titleKey: this.k(view.id),
          disabled,
          show: true
        }))
      ]
      if (this.consent) {
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
      return this.experienceConfig.viewBlocks.map(o => this.sql[o.sql])
    }
  },
  watch: {
    experienceConfig: {
      immediate: true,
      handler(value) {
        this.$store.commit('xp/setExperienceConfig', cloneDeep(value))
      }
    },
    bubbleConfig: {
      immediate: true,
      handler(value) {
        this.$store.commit('xp/setBubbleConfig', cloneDeep(value))
      }
    },
    siteConfigMerged: {
      immediate: true,
      handler(value) {
        // set initial state of locale dropdown
        this.localeIndex = localeCodes.indexOf(value.i18nLocale)
        // override light theme colors
        if (value.theme) {
          Object.assign(this.$vuetify.theme.themes.light, value.theme)
        }
        this.$store.commit('xp/setSiteConfig', cloneDeep(value))
      }
    },
    localeIndex: {
      immediate: true,
      async handler(value) {
        // locale was switched by the user
        const localeProperties = locales[value]
        // -> update d3 locale
        await d3Locale(localeProperties)
        // -> update vue-i18n locale
        this.$i18n.locale = localeProperties.code
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
  created() {
    this.$watch(
      vm => [vm.experienceConfig, vm.siteConfig],
      async(val) => {
        this.$store.commit('xp/clearStore')
        await this.mergeMessages()
      },
      {
        immediate: true
      }
    )
  },
  mounted() {
    this.switchTab('load-data')
  },
  methods: {
    async mergeMessages() {
      const { messages: messagesExperience, slug } = this.experienceConfig
      const { messages: messagesCustomConfig, i18nLocales, i18nUrl } = this.siteConfigMerged
      let messagesCustomRemote = {}
      if (i18nUrl) {
        // fetch messages to override default messages
        messagesCustomRemote = await json(i18nUrl)
      }
      i18nLocales.forEach((locale) => {
        /* experience messages */
        const messagesObject = { experiences: { [slug]: messagesExperience[locale] } }
        this.$i18n.mergeLocaleMessage(locale, messagesObject)

        /* custom messages (override anything previously merged) */
        if (locale in messagesCustomConfig) {
          // from config
          this.$i18n.mergeLocaleMessage(locale, messagesCustomConfig[locale])
        }

        if (locale in messagesCustomRemote) {
          // from remote endpoint
          this.$i18n.mergeLocaleMessage(locale, messagesCustomRemote[locale])
        }
      })
    },
    // Convert local translation key to global vue18n
    k(localKey) {
      return `experiences.${this.experienceConfig.slug}.viewBlocks.${localKey}.title`
    },
    switchTab(value) {
      const newAnchor = `#${value}`
      if (newAnchor !== this.$router.currentRoute.hash) {
        this.$router.push(`#${value}`)
      }
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
      const start = new Date()
      const consoleLabel = (...labels) => `TheDataExperience.onUnitFilesUpdate${labels.length ? '.' + labels.join('.') : ''}`
      console.time(consoleLabel())

      const {
        databaseConfig,
        files,
        preprocessors,
        keepOnlyFiles,
        viewBlocks
      } = this.experienceConfig
      this.message = ''
      this.error = false
      this.success = false
      this.progress = true

      // Clean vuex state
      this.$store.commit('xp/clearStore', {})

      // Set consent form
      const consentForm = this.consent && JSON.parse(JSON.stringify(this.consent))
      if (consentForm) {
        const section = consentForm.find(({ type }) => type === 'data')
        section.titles = viewBlocks.map(e => e.title)
        section.ids = viewBlocks.map(e => e.id)
      }
      this.$store.commit('xp/setConsentForm', consentForm)

      try {
        console.time(consoleLabel('initFileManager'))
        // Set file manager
        const fileManager = new FileManager(
          preprocessors,
          fileManagerWorkers,
          files,
          keepOnlyFiles
        )
        await fileManager.init(uppyFiles)
        this.$store.commit('xp/setFileManager', fileManager)
        console.timeEnd(consoleLabel('initFileManager'))

        if (databaseConfig) {
          const consoleLabelDBMS = consoleLabel.bind(null, 'DBMS')
          console.time(consoleLabelDBMS())
          // create database
          console.time(consoleLabelDBMS('createDB'))
          const db = await DBMS.createDB(databaseConfig)
          console.timeEnd(consoleLabelDBMS('createDB'))
          // generate database records via the file manager
          console.time(consoleLabelDBMS('generateRecords'))
          const records = await DBMS.generateRecords(fileManager, databaseConfig)
          console.timeEnd(consoleLabelDBMS('generateRecords'))
          // insert the records into the database
          console.time(consoleLabelDBMS('insertRecords'))
          DBMS.insertRecords(db, records)
          console.timeEnd(consoleLabelDBMS('insertRecords'))
          // commit the database to the Vuex store
          this.$store.commit('xp/setCurrentDB', db)
          console.timeEnd(consoleLabelDBMS())
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
</style>
