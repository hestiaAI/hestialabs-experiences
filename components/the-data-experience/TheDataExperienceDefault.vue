<template>
  <div>
    <VRow>
      <VCol cols="12 mx-auto" sm="6">
        <UnitIntroduction
          v-bind="{ companyName: title, dataPortal, isGenericViewer }"
        />
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12 mx-auto" sm="6">
        <slot name="unit-files" :update="onUnitFilesUpdate" />
        <template v-if="progress">
          <BaseProgressCircular class="mr-2" />
          <span>Processing files...</span>
        </template>
        <template v-else-if="error || success">
          <VAlert
            :type="error ? 'error' : 'success'"
            border="top"
            colored-border
            max-width="600"
            >{{ message }}
          </VAlert>
        </template>
      </VCol>
    </VRow>
    <template v-if="success">
      <VRow v-if="showDataExplorer">
        <VCol>
          <UnitFileExplorer v-bind="{ fileManager, selectable: false }" />
        </VCol>
      </VRow>
      <VRow v-for="(defaultViewElements, index) in defaultView" :key="index">
        <VCol>
          <UnitQuery
            v-bind="{
              defaultViewElements,
              customPipeline:
                customPipelines !== undefined
                  ? customPipelines[defaultViewElements.customPipeline]
                  : undefined,
              sparqlQuery: queries[index],
              sql: sqlQueries[index],
              fileManager,
              postprocessors,
              index,
              vega
            }"
            @update="onQueryUpdate"
          />
        </VCol>
      </VRow>
      <VRow v-if="consentForm">
        <VCol cols="8 mx-auto">
          <UnitConsentForm
            v-bind="{
              consentForm,
              allResults,
              defaultView,
              fileManager,
              showDataExplorer
            }"
          />
        </VCol>
      </VRow>
    </template>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import rdfUtils from '@/utils/rdf'
import parseYarrrml from '@/utils/parse-yarrrml'
import FileManager from '~/utils/file-manager'

export default {
  props: {
    defaultView: Array,
    title: String,
    dataPortal: String,
    customPipelines: Object,
    isGenericViewer: Boolean,
    showDataExplorer: Boolean,
    files: Array,
    multiple: Boolean,
    preprocessors: Object,
    allowMissingFiles: Boolean,
    sparql: Object,
    vega: Object,
    sql: Object,
    yarrrml: String,
    postprocessors: Object,
    databaseBuilder: Function
  },
  data() {
    return {
      progress: false,
      error: false,
      success: false,
      message: '',
      rml: '',
      allResults: [...Array(this.defaultView.length)],
      allFiles: null,
      fileManager: new FileManager(this.preprocessors, this.allowMissingFiles),
      db: null
    }
  },
  computed: {
    queries() {
      return this.defaultView.map(o => this.sparql[o.query])
    },
    sqlQueries() {
      return this.defaultView.map(o => this.sql[o.sql])
    },
    isRdfNeeded() {
      return this.defaultView.filter(v => 'query' in v).length > 0
    },
    consentForm() {
      const consent = this.$store.state.config.consent
      if (consent) {
        const key = this.$route.params.key
        if (key in consent) {
          return consent[key]
        } else if ('default' in consent) {
          return consent.default
        }
      }
      return null
    }
  },
  methods: {
    handleError(error) {
      console.error(error)
      this.error = true
      this.message = error instanceof Error ? error.message : error
      this.progress = false
    },
    async onUnitFilesUpdate(uppyFiles) {
      this.message = ''
      this.error = false
      this.success = false
      this.progress = true
      const start = new Date()

      await this.fileManager.init(uppyFiles, this.multiple)
      let processedFiles
      try {
        processedFiles = await this.fileManager.preprocessFiles(this.files)
      } catch (error) {
        this.handleError(error)
        return
      }

      // Populate database
      if (this.databaseBuilder !== undefined) {
        await this.databaseBuilder(this.fileManager)
      }

      if (this.isRdfNeeded && this.yarrrml) {
        try {
          this.rml = await parseYarrrml(this.yarrrml)
          await rdfUtils.generateRDF(this.rml, processedFiles)
        } catch (error) {
          this.handleError(error)
          return
        }
      }

      this.progress = false
      this.success = true

      const elapsed = new Date() - start
      this.message = `Successfully processed in ${elapsed / 1000} sec.`
    },
    onQueryUpdate({ index, result }) {
      // we need to change the object or vue won't see the change
      const newResults = this.allResults.slice()
      newResults[index] = JSON.stringify(result)
      this.allResults = newResults
    }
  }
}
</script>
