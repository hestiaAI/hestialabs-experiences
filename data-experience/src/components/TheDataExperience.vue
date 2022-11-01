<template>
  <div>
    <SettingsSpeedDial />
    <!-- interpret the presence of configName env variable as being in the Nuxt app -->
    <VMenu locales.length > 1" offset-y absolute>
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
    <template v-if="showLogin">
      <UnitLogin />
    </template>
    <template v-else>
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
          v-for="t in tabs"
          :key="t.value"
          :disabled="t.disabled"
        >
          {{ $tev(t.titleKey, t.title) }}
        </VTab>
      </VTabs>
      <VTabsItems v-model="tab">
        <VTabItem data-value="load-data" :transition="false">
          <VCol cols="12 mx-auto" md="6">
            <UnitDownload
              v-if="bubbleConfig?.dataFromBubble"
              v-bind="{
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
        <VTabItem
          v-if="!experienceConfig.hideSummary"
          data-value="summary"
          :transition="false"
        >
          <VCol cols="12 mx-auto" sm="6">
            <UnitSummary />
          </VCol>
        </VTabItem>
        <VTabItem
          v-if="!experienceConfig.hideFileExplorer"
          data-value="file-explorer"
          :transition="false"
        >
          <div>
            <UnitFileExplorer />
          </div>
        </VTabItem>
        <VTabItem
          v-for="viewBlock in experienceConfig.viewBlocks"
          :key="viewBlock.id"
          :data-value="viewBlock.id"
          :transition="false"
        >
          <VCol cols="12 mx-auto">
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
            <UnitQuery v-bind="viewBlock" />
          </VCol>
        </VTabItem>
        <VTabItem
          v-if="consent"
          data-value="share-data"
          :transition="false"
        >
          <VCol cols="12 mx-auto" sm="6">
            <UnitConsentForm />
          </VCol>
        </VTabItem>
      </VTabsItems>
    </template>
  </div>
</template>

<script>
import { debounce, cloneDeep, merge } from 'lodash-es'
import { json, timeFormatDefaultLocale } from 'd3'

import { locales, localeCodes } from '@/i18n/locales'

import { mapState, mapMutations } from '@/utils/store-helper'
import DBMS from '@/utils/sql'
import FileManager from '@/utils/file-manager'
import fileManagerWorkers from '@/utils/file-manager-workers'

import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseProgressCircular from '@/components/base/BaseProgressCircular.vue'
import UnitFileExplorer from '@/components/unit/file-explorer/UnitFileExplorer.vue'
import UnitLogin from '@/components/unit/UnitLogin.vue'
import UnitDownload from '@/components/unit/UnitDownload.vue'
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
    UnitLogin,
    UnitDownload,
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
      localeIndex: 0,
      tab: 0,
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
    ...mapState(['fileManager', 'bubbleCodeword', 'currentTab']),
    ...mapState({ experienceProgress: 'progress' }),
    siteConfigMerged() {
      return cloneDeep(merge(siteConfigDefault, this.siteConfig))
    },
    showLogin() {
      const config = this.bubbleConfig
      return config && !config.bypassLogin && !this.bubbleCodeword
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
          disabled: false
        }
      ]
      if (!hideSummary) {
        tabs.push({
          title: 'Summary',
          value: 'summary',
          titleKey: 'summary.name',
          disabled
        })
      }
      if (!hideFileExplorer) {
        tabs.push({
          title: 'Files',
          value: 'file-explorer',
          titleKey: 'file-explorer.name',
          disabled
        })
      }
      tabs.push(
        ...viewBlocks.map(view => ({
          ...view,
          value: view.id,
          titleKey: this.k(view.id),
          disabled
        }))
      )
      if (this.consent) {
        tabs.push({
          title: 'Share my data',
          value: 'share-data',
          titleKey: 'share-data.name',
          disabled
        })
      }
      return tabs
    }
  },
  watch: {
    experienceConfig: {
      immediate: true,
      handler(value) {
        this.setExperienceConfig(cloneDeep(value))
      }
    },
    bubbleConfig: {
      immediate: true,
      handler(value) {
        this.setBubbleConfig(cloneDeep(value))
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
        this.setSiteConfig(cloneDeep(value))
      }
    },
    localeIndex: {
      immediate: true,
      async handler(value) {
        // locale was switched by the user
        const localeProperties = locales[value]
        // -> update d3 locale
        if (process.env.NODE_ENV !== 'test') {
          await d3Locale(localeProperties)
        }
        // -> update vue-i18n locale
        this.$i18n.locale = localeProperties.code
      }
    },
    fileManager(value) {
      if (value === null) {
        this.setCurrentTab('load-data')
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
    },
    tab(tabIndex) {
      const { value } = this.tabs[tabIndex]
      if (value !== this.currentTab) {
        this.setCurrentTab(value)
      }
    },
    currentTab(value) {
      this.tab = this.tabs.findIndex(tab => tab.value === value)
    }
  },
  created() {
    this.$watch(
      vm => [vm.experienceConfig, vm.siteConfig, vm.bubbleConfig],
      async() => {
        this.clearStore()
        await this.mergeMessages()
      },
      {
        immediate: true
      }
    )
  },
  methods: {
    ...mapMutations([
      'setSiteConfig',
      'setBubbleConfig',
      'setExperienceConfig',
      'setConsentForm',
      'clearStore',
      'setFileManager',
      'setCurrentDB',
      'setCurrentTab'
    ]),
    async mergeMessages() {
      const { messages: messagesExperience = {}, slug } = this.experienceConfig
      const { messages: messagesCustomConfig = {}, i18nLocales, i18nUrl } = this.siteConfigMerged
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
        consent,
        experienceConfig: {
          slug,
          databaseConfig,
          files,
          preprocessors,
          keepOnlyFiles,
          viewBlocks
        }
      } = this
      this.message = ''
      this.error = false
      this.success = false
      this.progress = true

      // Clean vuex state
      this.clearStore()

      // Set consent form
      const cForm = consent?.[slug] || consent?.default
      const consentForm = cForm && JSON.parse(JSON.stringify(cForm))
      if (consentForm) {
        const section = consentForm.find(({ type }) => type === 'data')
        section.titles = viewBlocks.map(e => e.title)
        section.ids = viewBlocks.map(e => e.id)
      }
      this.setConsentForm(consentForm)

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
        this.setFileManager(fileManager)
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
          this.setCurrentDB(db)
          console.timeEnd(consoleLabelDBMS())
        }
      } catch (e) {
        this.handleError(e)
        return
      }

      this.progress = false
      this.success = true

      // switch to the second tab
      this.setCurrentTab(this.tabs[1].value)

      const elapsed = new Date() - start
      this.message = `${this.$t('Successfully processed in')} ${elapsed / 1000} ${this.$t('seconds')}`
    }
  }
}
</script>

<style scoped>
.v-tabs-items .v-window-item {
  min-height: calc(100vh - 48px);
}
</style>
