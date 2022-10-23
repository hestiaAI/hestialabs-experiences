<template>
  <VApp>
    <VMain>
      <SettingsSpeedDial />
      <!-- <VSpeedDial
        v-model="langDial"
        bottom
        right
        direction="top"
        open-on-hover
        transition="slide-y-reverse-transition"
        fixed
      >
        <template #activator>
          <VBtn v-model="fab" color="primary" dark fab>
            <VIcon v-if="fab">
              $vuetify.icon.mdiClose
            </VIcon>
            <VIcon v-else>
              $vuetify.icon.mdiCog
            </VIcon>
          </VBtn>
        </template>
      </VSpeedDial> -->
      <!-- <VMenu v-if="$i18n.locales.length > 1" offset-y> -->
      <VMenu v-if="!$nuxt" offset-y bottom left absolute>
        <template #activator="{ on, attrs }">
          <VBtn
            v-bind="attrs"
            icon
            v-on="on"
          >
            <VIcon>$vuetify.icons.mdiTranslate</VIcon>
          </VBtn>
        </template>
        <VList>
          <VListItemGroup v-model="$i18n.locale">
            <VListItem
              v-for="({ code, name }) in [{code:'en', name:'English'}, {code:'fr', name:'Francais'}]"
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
    </VMain>
  </VApp>
</template>

<script>
import { debounce, pick, cloneDeep } from 'lodash-es'

import { mapState } from '@/utils/store-helper'
import DBMS from '@/utils/sql'
import FileManager from '@/utils/file-manager'
import fileManagerWorkers from '@/utils/file-manager-workers'

import BaseProgressCircular from '@/components/base/BaseProgressCircular.vue'
import UnitFileExplorer from '@/components/unit/file-explorer/UnitFileExplorer.vue'
import UnitIntroduction from '@/components/unit/UnitIntroduction.vue'
import UnitQuery from '@/components/unit/UnitQuery.vue'
import UnitSummary from '@/components/unit/UnitSummary.vue'
import SettingsSpeedDial from '@/components/misc/SettingsSpeedDial.vue'

export default {
  name: 'TheDataExperience',
  components: {
    BaseProgressCircular,
    SettingsSpeedDial,
    UnitFileExplorer,
    UnitIntroduction,
    UnitQuery,
    UnitSummary
  },
  props: {
    experienceConfig: {
      type: Object,
      required: true
    },
    siteConfig: {
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
    ...mapState(['fileManager']),
    ...mapState({ experienceProgress: 'progress' }),
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
        this.$store.commit('xp/setExperienceConfig', cloneDeep(value))
      }
    },
    siteConfig: {
      immediate: true,
      handler(value) {
        this.$store.commit('xp/setSiteConfig', cloneDeep(value))
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
      this.$store.commit('xp/clearStore', {})

      // Set consent form
      /*
      const consentForm = JSON.parse(JSON.stringify(this.consentFormTemplate))
      if (consentForm) {
        const section = consentForm.find(({ type }) => type === 'data')
        section.titles = this.viewBlocks.map(e => e.title)
        section.ids = this.viewBlocks.map(e => e.id)
      }
      this.$store.commit('xp/setConsentForm', consentForm)
      */
      // Set file manager
      const fileManager = new FileManager(
        this.preprocessors,
        fileManagerWorkers,
        this.files,
        this.keepOnlyFiles
      )
      try {
        await fileManager.init(uppyFiles)
        this.$store.commit('xp/setFileManager', fileManager)

        if (dbConfig) {
          console.log('Creating DB', dbConfig)
          // create database
          const db = await DBMS.createDB(dbConfig)
          // generate database records via the file manager
          const records = await DBMS.generateRecords(fileManager, dbConfig)
          console.log('records', records)
          // insert the records into the database
          DBMS.insertRecords(db, records)
          console.log('commit setcurrentDB')
          // commit the database to the Vuex store
          this.$store.commit('xp/setCurrentDB', db)
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
