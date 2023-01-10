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
    <template v-else>
      <VWindow
        v-model="window"
        class="v-window--main"
      >
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
          <VWindowItem v-else-if="id === 'understand-data' && fileManager" :value="id" disabled>
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
                      <VOverlay :value="overlay" absolute opacity="0.8">
                        <div
                          class="d-flex flex-column align-center v-overlay__content"
                        >
                          <div class="mb-3">
                            {{ $t('This might take a moment') }}
                          </div>
                          <BaseProgressCircular size="64" width="4" />
                        </div>
                      </VOverlay>
                      <UnitQuery v-bind="viewBlock" />
                    </VCol>
                  </VRow>
                </VTabItem>
              </div>
            </VTabsItems>
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

import vuetifyEn from 'vuetify/lib/locale/en'
import vuetifyFr from 'vuetify/lib/locale/fr'

import defaultEn from '@/locales/en.json'
import defaultFr from '@/locales/fr.json'

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
    ...mapState(['fileManager', 'bubbleCodeword', 'currentTab', 'currentWindow']),
    ...mapState({ experienceProgress: 'progress' }),
    ...mapGetters(['experienceNameAndTag']),
    siteConfigMerged() {
      return cloneDeep(merge(siteConfigDefault, this.siteConfig))
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
    consent() {
      return this.bubbleConfig?.consent
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
      if (this.consent) {
        windows.push({
          id: 'share-data',
          mdiIcon: 'mdiShare'
        })
      }
      return windows
    },
    tabs() {
      const { viewBlocks } = this.experienceConfig
      return viewBlocks.map(viewBlock => ({
        title: this.$tev(this.k(viewBlock.id, 'title'), viewBlock.title),
        id: viewBlock.id,
        viewBlock
      }))
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
        const { id } = this.tabs[idx]
        if (id !== this.currentTab) {
          this.setCurrentTab(id)
        }
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
    this.$watch(
      vm => [vm.experienceConfig, vm.siteConfig, vm.bubbleConfig],
      async() => {
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
        const messagesObject = { experiences: { [nameAndTag]: messagesExperience[locale] } }
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
    k(viewBlockId, key) {
      const nameAndTag = this.experienceNameAndTag
      return `experiences.${nameAndTag}.viewBlocks.${viewBlockId}.${key}`
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

<style scoped>
.v-window.v-window--main {
  margin-bottom: 60px;
}

.v-tabs-items .v-window-item {
  min-height: calc(100vh - 48px);
}

.v-overlay .v-overlay__content {
  height: 100%;
  width: 100%;
}
</style>
