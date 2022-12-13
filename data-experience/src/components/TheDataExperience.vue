<template>
  <div :lang="$i18n.locale">
    <SettingsSpeedDial />
    <VMenu v-if="!siteConfigMerged.i18nLocale && locales.length > 1" offset-y absolute>
      <template #activator="{ on, attrs }">
        <BaseButton
          v-bind="attrs"
          mdi-icon="mdiTranslate"
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
        <VListItemGroup v-model="localeIndex" @change="setLocale">
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
      <UnitLogin @success="loginSuccessful = true" />
    </template>
    <template v-else>
      <VRow>
        <VItemGroup
          v-model="window"
          mandatory
          class="shrink mx-6 pt-9"
        >
          <VItem
            v-for="i in windows"
            :key="i.id"
            v-slot="{ active, toggle }"
          >
            <div>
              <BaseButtonWindow
                :mdi-icon="i.mdiIcon"
                :tooltip="$t(`${i.id}.name`)"
                :input-value="active"
                @click="toggle"
              />
            </div>
          </VItem>
        </VItemGroup>
        <VCol>
          <VWindow
            v-model="window"
            vertical
          >
            <BaseWindowItem>
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
            </BaseWindowItem>
            <BaseWindowItem v-if="!experienceConfig.hideFileExplorer">
              <UnitSummary v-if="!experienceConfig.hideSummary" />
              <UnitFileExplorer />
            </BaseWindowItem>
            <BaseWindowItem>
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
        @change="scrollToTop"
      >
        <VTab
          v-for="({ title, disabled }, index) in tabs"
          :key="index"
          :disabled="disabled"
        >
          {{ title }}
        </VTab>
      </VTabs>
      <VTabsItems v-model="tab">
        <div
          v-for="{ id, viewBlock } in tabs"
          :key="`${experienceConfig.slug}-${id}`"
          :data-id="id"
        >
          <VTabItem
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
        </div>
      </VTabsItems>
            </BaseWindowItem>
            <BaseWindowItem v-if="consent">
              <UnitConsentForm />
            </BaseWindowItem>
          </VWindow>
        </VCol>
      </VRow>
      <!-- <VStepper v-model="step" vertical>

          <VStepperStep complete editable step="1" edit-icon="$vuetify.icons.mdiFileUpload">
            <VIcon>$vuetify.icons.mdiFileUpload</VIcon>
            {{ $t('Load your data') }}
          </VStepperStep>
      </VStepper> -->

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
import BaseButtonWindow from '@/components/base/button/BaseButtonWindow.vue'
import BaseProgressCircular from '@/components/base/BaseProgressCircular.vue'
import BaseWindowItem from '@/components/base/BaseWindowItem.vue'
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
    BaseButtonWindow,
    BaseProgressCircular,
    BaseWindowItem,
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
      window: 0,
      tab: 0,
      fab: false,
      progress: false,
      error: false,
      success: false,
      message: '',
      overlay: false,
      locales,
      loginSuccessful: false
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
      return config && !config.bypassLogin && !this.loginSuccessful
    },
    consent() {
      return this.bubbleConfig?.consent
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
      windows.push(
        {
          id: 'understand-data',
          mdiIcon: 'mdiChartBar'
        }
      )
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
      const disabled = !this.success || this.experienceProgress
      const tabs = viewBlocks.map(viewBlock => ({
        title: viewBlock.title,
        id: viewBlock.id,
        titleKey: this.k(viewBlock.id),
        disabled,
        viewBlock
      }))
      return tabs.map(({ title, titleKey, ...rest }) =>
        ({ title: this.$tev(titleKey, title), ...rest })
      )
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
      async handler(value) {
        if (!value.i18nLocale) {
          await this.setLocale()
        }
        // override light theme colors
        if (value.theme) {
          Object.assign(this.$vuetify.theme.themes.light, value.theme)
        }
        this.setSiteConfig(cloneDeep(value))
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
      const idx = typeof tabIndex !== 'undefined' ? tabIndex : 0
      const { id } = this.tabs[idx]
      if (id !== this.currentTab) {
        this.setCurrentTab(id)
      }
    },
    currentTab(currentTab) {
      this.tab = this.tabs.findIndex(tab => tab.id === currentTab)
    },
    '$i18n.locale'() {
      this.clearStore()
    }
  },
  created() {
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
    async setLocale() {
      // locale was switched by the user (or is being initialized)
      const localeProperties = locales[this.localeIndex]
      // -> update d3 locale
      if (process.env.NODE_ENV !== 'test') {
        await d3Locale(localeProperties)
      }
      // -> update vue-i18n locale
      this.$i18n.locale = localeProperties.code
    },
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

      const elapsed = new Date() - start
      this.message = this.$t('successful-processing', { seconds: elapsed / 1000 })

      window.setTimeout(
        // switch to the second tab
        () => this.setCurrentTab(this.tabs[1].id),
        // leave some time for the user to read the success message
        500
      )
    }
  }
}
</script>

<style scoped>
.v-tabs-items .v-window-item {
  min-height: calc(100vh - 48px);
}
</style>
