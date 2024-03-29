<template>
  <div :lang="$i18n.locale">
    <SettingsSpeedDial>
      <template #lang>
        <VMenu v-if="!siteConfigMerged.i18nLocale && locales.length > 1" offset-y absolute>
          <template #activator="{ on, attrs }">
            <BaseButton
              v-bind="attrs"
              color="secondary"
              :outlined="false"
              mdi-icon="mdiTranslate"
              tooltip="Language"
              fab
              dark
              small
              v-on="on"
              vbtn-class=""
            />
          </template>
          <VList>
            <VListItemGroup v-model="localeIndex" @change="selectLocale">
              <VListItem
                v-for="({ code, name }) in locales"
                :key="code"
              >
                <VListItemTitle>{{ name }}</VListItemTitle>
              </VListItem>
            </VListItemGroup>
          </VList>
        </VMenu>
      </template>
    </SettingsSpeedDial>
    <template v-if="showLogin">
      <UnitLogin @success="loginSuccessful = true" />
    </template>
    <template v-else-if="experienceConfig">
      <VWindow v-model="window">
        <div
          v-for="({ id }) in windows"
          :key="`${experienceConfig.slug}-${id}`"
          :data-id="`window-${id}`"
        >
          <VWindowItem v-if="id === 'load-data'" :value="id" :disabled="experienceProgress">
            <UnitDownload
              v-if="bubbleConfig && bubbleConfig.dataFromBubble"
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
          </VWindowItem>
          <VWindowItem v-else-if="id === 'file-explorer'" :value="id" disabled>
            <UnitSummary v-if="!experienceConfig.hideSummary" />
            <UnitFileExplorer />
          </VWindowItem>
          <!-- && fileManager to trigger re-rendering when store is cleared -->
          <VWindowItem
            v-else-if="
              id === 'understand-data'
              && fileManager
              && experienceConfig.viewBlocks.length
            "
            :value="id"
            disabled
          >
            <template v-if="tabs.length">
            <VTabs
              v-model="tab"
              slider-color="secondary"
              slider-size="4"
              show-arrows
              center-active
              centered
              fixed-tabs
              @change="scrollToTop"
              class="py-3"
            >
              <VTab
                v-for="({ title, id }, index) in tabs"
                :key="index"
                :id="id"
              >
                {{ title }}
              </VTab>
            </VTabs>
            <VTabsItems v-model="tab">
              <div
                v-for="{ id, viewBlock } in tabs"
                :key="`${experienceConfig.slug}-${id}`"
                :data-id="`view-block-${id}`"
              >
                <VTabItem :transition="false">
                  <VRow>
                    <VCol cols="12" class="pa-0">
                      <VOverlay
                        :value="overlay"
                        opacity="0.8"
                      >
                        <div
                          class="d-flex flex-column align-center"
                        >
                          <div class="mb-3">
                            {{ $t('This might take a moment') }}
                          </div>
                          <BaseProgressCircular size="64" width="4" />
                        </div>
                      </VOverlay>
                      <UnitPipeline v-bind="{ viewBlock }"></UnitPipeline>
                    </VCol>
                  </VRow>
                </VTabItem>
              </div>
            </VTabsItems>
            </template>
            <template v-else>
              <VContainer>
                <BaseAlert>
                  <p>{{ $tc('File', 2) }} {{ $t('not found') }}</p>
                  <p>
                    <ul>
                      <li v-for="glob in experienceConfig.files" :key="glob">
                        {{ glob }}
                      </li>
                    </ul>
                  </p>
                </BaseAlert>
              </VContainer>
            </template>
          </VWindowItem>
          <VWindowItem v-else-if="id === 'share-data'" :value="id" disabled>
            <UnitConsentForm />
          </VWindowItem>
        </div>
      </VWindow>
      <VBottomNavigation
        v-model="window"
        :grow="$vuetify.breakpoint.smAndUp"
        color="secondary"
        app
      >
        <BaseButton
          v-for="(i, idx) in windows"
          :value="i.id"
          :key="`window-button-${experienceConfig.slug}-${i.id}`"
          :mdi-icon="i.mdiIcon"
          :disabled="idx === 0 ? experienceProgress : disabled"
          :tooltip="$t(`${i.id}.name`)"
          :tooltipProps="{ top: true }"
          :outlined="false"
          vbtn-class="my-0"
        >
          <template #left>
            <span
              v-if="$vuetify.breakpoint.smAndUp"
            >
              <span v-text="`${idx + 1}.`" />
              <span>
                {{ $t(`${i.id}.name`).split(/\s/)[0] }}
              </span>
            </span>
          </template>
        </BaseButton>
      </VBottomNavigation>
    </template>
  </div>
</template>

<script>
import { debounce, cloneDeep, merge } from 'lodash-es'
import { json, timeFormatDefaultLocale } from 'd3'

import { locales, localeCodes } from '@/i18n/locales'

import { mapState, mapGetters, mapMutations } from '@/utils/store-helper'
import DBMS from '@/utils/sql'
import FileManager from '@/utils/file-manager'
import fileManagerWorkers from '@/utils/file-manager-workers'

import BaseAlert from '@/components/base/BaseAlert.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseProgressCircular from '@/components/base/BaseProgressCircular.vue'
import UnitFileExplorer from '@/components/unit/file-explorer/UnitFileExplorer.vue'
import UnitLogin from '@/components/unit/UnitLogin.vue'
import UnitDownload from '@/components/unit/UnitDownload.vue'
import UnitIntroduction from '@/components/unit/UnitIntroduction.vue'
import UnitPipeline from '@/components/unit/UnitPipeline.vue'
import UnitSummary from '@/components/unit/UnitSummary.vue'
import SettingsSpeedDial from '@/components/misc/SettingsSpeedDial.vue'
import UnitConsentForm from '@/components/unit/consent-form/UnitConsentForm.vue'

import vuetifyEn from 'vuetify/lib/locale/en'
import vuetifyFr from 'vuetify/lib/locale/fr'

import defaultEn from '@/locales/en.json'
import defaultFr from '@/locales/fr.json'
import { kViewBlockPrefix, mergeMessagesIntoI18n, nestExperienceLocaleMessages } from '@/utils/i18n-utils'

const messagesDefault = {
  en: {
    ...defaultEn,
    $vuetify: vuetifyEn
  },
  fr: {
    ...defaultFr,
    $vuetify: vuetifyFr
  }
}
const messagesOverride = {
  en: {},
  fr: {
    $vuetify: {
      dataIterator: {
        noResultsText: 'Aucun résultat'
      }
    }
  }
}

const siteConfigDefault = {
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
    BaseAlert,
    BaseButton,
    BaseProgressCircular,
    SettingsSpeedDial,
    UnitLogin,
    UnitDownload,
    UnitFileExplorer,
    UnitIntroduction,
    UnitPipeline,
    UnitSummary,
    UnitConsentForm
  },
  props: {
    experienceModule: {
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
      window: 'load-data',
      tab: 0,
      fab: false,
      progress: false,
      error: false,
      success: false,
      message: '',
      overlay: false,
      loginSuccessful: false
    }
  },
  computed: {
    ...mapState(['experienceConfig', 'fileManager', 'bubbleCodeword', 'currentTab', 'currentWindow']),
    ...mapState({ experienceProgress: 'progress' }),
    ...mapGetters(['experienceNameAndTag']),
    siteConfigMerged() {
      return cloneDeep(merge(siteConfigDefault, this.siteConfig))
    },
    experienceViewerOptions() {
      const bubOpt = this.bubbleConfig?.experienceViewerOptions
      return bubOpt || this.siteConfig?.experienceViewerOptions
    },
    locales() {
      const { i18nLocales } = this.siteConfigMerged
      const localesFiltered = locales.filter(l => i18nLocales.includes(l.code))
      // sort locales according to order provided in i18nLocales
      localesFiltered.sort((a, b) => i18nLocales.indexOf(a.code) > i18nLocales.indexOf(b.code) ? 1 : -1)
      return localesFiltered
    },
    showLogin() {
      const config = this.bubbleConfig
      return config && !config.bypassLogin && !this.loginSuccessful
    },
    consentForm() {
      const bconf = this.bubbleConfig
      if (bconf) {
        return bconf.getConsentForm(this.experienceConfig.slug)
      }
      return undefined
    },
    disabled() {
      return !this.success || this.experienceProgress
    },
    windows() {
      const windows = [
        {
          id: 'load-data',
          mdiIcon: 'mdiFileUpload'
        }
      ]
      if (!this.experienceConfig.hideFileExplorer) {
        windows.push({
          id: 'file-explorer',
          mdiIcon: 'mdiFileSearch'
        })
      }
      windows.push({
        id: 'understand-data',
        mdiIcon: 'mdiChartBar'
      })
      if (this.consentForm) {
        windows.push({
          id: 'share-data',
          mdiIcon: 'mdiShare'
        })
      }
      return windows
    },
    tabs() {
      if (!this.experienceConfig) {
        return []
      }
      const { viewBlocks } = this.experienceConfig
      return viewBlocks
      // filter out tabs where needed files are not found
        .filter((viewBlock) => {
          if (this.fileManager && this.experienceConfig.hideEmptyTabs && viewBlock.files) {
            return viewBlock.files
              .map(id => this.fileManager.idToGlob[id])
              .map(glob => [glob, this.fileManager.findMatchingFilePaths(glob)])
              .filter(([_, files]) => files.length > 0).length > 0
          } else {
            return true
          }
        })
        .map(viewBlock => ({
          title: this.$tev(this.k(viewBlock.id, 'title'), viewBlock.title),
          id: viewBlock.id,
          viewBlock
        }))
    }
  },
  watch: {
    bubbleConfig: {
      immediate: true,
      handler(value) {
        this.setBubbleConfig(cloneDeep(value))
      }
    },
    siteConfigMerged: {
      immediate: true,
      handler(value) {
        // override light theme colors
        if (value.theme) {
          Object.assign(this.$vuetify.theme.themes.light, value.theme)
        }
        this.setSiteConfig(cloneDeep(value))
      }
    },
    experienceNameAndTag: {
      immediate: true,
      async handler() {
        await this.mergeMessages()
      }
    },
    fileManager(value) {
      if (value === null) {
        // reset window and tab
        this.window = 'load-data'
        this.setCurrentTab(this.tabs[0].id)
        // reset processing flags
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
    tab: {
      immediate: true,
      handler(tabIndex) {
        const idx = tabIndex ?? 0
        const tab = this.tabs[idx]
        if (tab && tab.id !== this.currentTab) {
          this.setCurrentTab(tab.id)
        }
      }
    },
    tabs(value) {
      if (value.length) {
        this.setCurrentTab(value[0].id)
      }
    },
    currentTab(currentTab) {
      this.tab = this.tabs.findIndex(tab => tab.id === currentTab)
    },
    '$i18n.locale': {
      async handler(value) {
        this.clearStore()
        await this.update3rdPartyLocale(value)
      },
      immediate: true
    }
  },
  created() {
    if (!this.siteConfigMerged.i18nLocale) {
      // initialize locale if no default is already set
      this.selectLocale(this.localeIndex)
    }
    this.siteConfigMerged.i18nLocales.forEach((locale) => {
      /* default messages */
      this.$i18n.mergeLocaleMessage(locale, messagesDefault[locale])
      /* overriding messages */
      this.$i18n.mergeLocaleMessage(locale, messagesOverride[locale])
    })
    // https://v2.vuejs.org/v2/api/#vm-watch
    this.$watch(
      // everytime the resulting expression changes, call the handler
      vm => [vm.experienceModule, vm.siteConfig, vm.bubbleConfig],
      // the handler
      async() => {
        const experienceName = this.experienceModule.name
        // validation: is experience in bubble ?
        if (this.bubbleConfig &&
            !this.bubbleConfig.experiences.includes(experienceName)) {
          throw new Error(`Experience ${experienceName} not included in bubble ${this.bubbleConfig.title}`)
        }

        // configure and set experienceConfig
        const module = this.experienceModule
        // keep it retrocompatible for now
        const canProvide = !!module.provideViewerOptions
        let experienceConfig
        const viewerOpts =
              canProvide && await module.provideViewerOptions(
                this.experienceViewerOptions)
        if (viewerOpts) {
          const configured = module.configureViewer(viewerOpts)
          experienceConfig = configured.config
        } else {
          experienceConfig = cloneDeep(module.config)
        }
        this.setExperienceConfig(experienceConfig)

        // clear login state
        this.loginSuccessful = false
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
    selectLocale(localeIndex) {
      // user switched locale with the component's lang switcher
      const { code } = this.locales[localeIndex]
      this.$i18n.locale = code
    },
    async update3rdPartyLocale(locale) {
      const localeProperties = this.locales.find(l => l.code === locale)
      // -> update d3 locale
      if (process.env.NODE_ENV !== 'test') {
        await d3Locale(localeProperties)
      }
    },
    async mergeMessages() {
      if (!this.experienceConfig) {
        return
      }
      const { messages: messagesExperience = {} } = this.experienceConfig
      const { messages: messagesCustomConfig = {}, i18nLocales, i18nUrl } = this.siteConfigMerged

      const nameAndTag = this.experienceNameAndTag

      let messagesCustomRemote = {}
      if (i18nUrl) {
        // fetch messages to override default messages
        messagesCustomRemote = await json(i18nUrl)
      }
      i18nLocales.forEach((locale) => {
        /* experience messages */
        const messagesObject = nestExperienceLocaleMessages(nameAndTag, messagesExperience[locale])
        const allMessages = [
          messagesObject,
          messagesCustomConfig[locale],
          messagesCustomRemote[locale]]

        mergeMessagesIntoI18n(this.$i18n, locale, allMessages)
      })
    },
    // Convert local translation key to global vue18n
    k(viewBlockId, key) {
      const nameAndTag = this.experienceNameAndTag
      return `${kViewBlockPrefix(nameAndTag, viewBlockId)}.${key}`
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
        consentForm,
        experienceConfig: {
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

      const elapsed = new Date() - start
      this.message = this.$t('successful-processing', { seconds: elapsed / 1000 })

      window.setTimeout(
        // switch to the second window
        () => (this.window = this.windows[1].id),
        // leave some time for the user to read the success message
        500
      )
    }
  }
}
</script>
