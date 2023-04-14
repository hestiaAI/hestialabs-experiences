
<template>
  <VContainer>
    <VRow justify="center">
      <VCol cols="12" md="8">
        <h3 class="text-h3 font-weight-bold blue-grey--text text--darken-2 mt-6 mb-10 text-center">
          Table Generator
        </h3>
        <p class="text-h5 blue-grey--text text--darken-2 mt-6 mb-6">
          Generate a table from files using a parsing configuration
        </p>
        <h5 class="text-h5 blue-grey--text text--darken-2 mt-6 mb-6">
          1. To begin, drop a zip or CSV/JSON files into the drop zone below.
        </h5>
        <div ref="dashboard" />
        <h5 class="text-h5 blue-grey--text text--darken-2 mt-6 mb-6">
          2. Then select a parsing configuration or create your own.
        </h5>
        <VSelect
          v-model="selectedConfig"
          :items="configs"
          label="Configuration de parsing"
          solo
          class="text-center"
          item-value="config"
          item-text="name"
          @change="onConfigChange"
        />
        <CodeEditor v-model="configString" language="json" line-numbers class="mb-3" />
        <BaseButton v-bind="{error, success, progress}" class="mb-3" @click="generateTable">
          Generate Table
        </BaseButton>
        <VAlert
          v-if="error"
          class="mt-6 text-left"
          type="error"
          text
        >
          <div v-text="errorMessage" />
        </VAlert>

        <VDataTable
          v-if="success"
          v-bind="{...table}"
          :items-per-page="5"
          class="elevation-1"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>
<script>
import { Uppy } from '@uppy/core'
import Dashboard from '@uppy/dashboard'
import DropTarget from '@uppy/drop-target'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/drop-target/dist/style.css'

import English from '@uppy/locales/lib/en_US'
import French from '@uppy/locales/lib/fr_FR'

import { generateTable } from '@/utils/fileHelpers'

const locales = {
  en: English,
  fr: French
}

export default {
  data() {
    return {
      uppy: null,
      configs: [{ name: 'custom', config: {} }],
      selectedConfig: null,
      configString: '',
      table: null,
      error: false,
      success: false,
      progress: false,
      errorMessage: ''
    }
  },
  watch: {
    '$i18n.locale'(locale) {
      this.uppy.setOptions({
        locale: locales[locale]
      })
    }
  },
  mounted() {
    this.initUppy()
    this.fetchConfigs()
  },
  methods: {
    async fetchConfigs() {
      try {
        const configs = (await this.$directus.items('Parsing_configs').readByQuery({
          fields: ['name', 'config']
        })).data
        this.configs = [...this.configs, ...configs]
      } catch (e) {
        console.error(e)
      }
    },
    initUppy() {
      const config = {
        debug: false,
        allowMultipleUploads: true,
        locale: locales[this.$i18n.locale]
      }
      this.uppy = new Uppy(config)
      this.uppy
        .use(Dashboard, {
          target: this.$refs.dashboard,
          inline: true,
          // we're currently not uploading to a server
          hideUploadButton: true,
          proudlyDisplayPoweredByUppy: false,
          theme: 'light',
          height: 300
        })
        .use(DropTarget, {
        // allow dropping files anywhere on the page
          target: document.body
        })
    },
    onConfigChange() {
      this.configString = JSON.stringify(this.selectedConfig, null, 2)
    },
    async generateTable() {
      this.progress = true
      this.error = false
      this.success = false

      if (this.uppy.getFiles().length === 0) {
        this.error = true
        this.progress = false
        this.errorMessage = 'Please provide a file to parse'
        return
      }

      let configObject = {}
      try {
        configObject = JSON.parse(this.configString)
      } catch (e) {
        this.errorMessage = 'Invalid JSON configuration: ' + e.toString()
        this.error = true
        return
      }

      try {
        const start2 = performance.now()
        this.table = await generateTable(this.uppy.getFiles(), configObject)
        const end2 = performance.now()
        console.log(`Execution time 2: ${end2 - start2} ms`)
      } catch (e) {
        this.progress = false
        this.errorMessage = e
        this.error = true
        return
      }
      this.progress = false
      this.success = true
    }
  }
}
</script>
<style scoped>
/*
::v-deep .uppy-Dashboard-inner {
  margin: auto;
}
*/
</style>
