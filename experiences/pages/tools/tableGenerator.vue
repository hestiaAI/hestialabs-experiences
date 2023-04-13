
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
          @change="onConfigChange"
        />
        <CodeEditor v-if="selectedConfig === 'custom'" v-model="customConfig" language="json" line-numbers class="mb-3" />
        <BaseButton @click="generateTable">
          Generate Table
        </BaseButton>
        <VAlert
          v-if="error"
          class="mt-6 text-left"
          type="error"
          text
        >
          <div v-text="error" />
        </VAlert>
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
      configs: ['custom'],
      selectedConfig: null,
      headers: [],
      items: [],
      error: null,
      customConfig: JSON.stringify({
        file: '**/*viewed.json',
        array: '$.custom_audiences_all_types_v2.*',
        columns: [
          {
            name: 'column1',
            selector: '$.advertiser_name'
          }
        ]
      }, null, 2)
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
  },
  methods: {
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
      console.log(this.selectedConfig)
    },
    generateTable() {
      console.log(this.uppy.getFiles())

      try {
        this.table = generateTable(this.uppy.getFiles(), JSON.parse(this.customConfig))
        console.log(this.table)
      } catch (e) {
        this.error = e.toString()
      }
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
