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
      <VRow v-for="(defaultViewElements, index) in defaultView" :key="index">
        <VCol>
          <UnitQuery
            v-if="defaultViewElements.customPipeline"
            v-bind="{
              visualizations,
              defaultViewElements,
              selectedExample,
              customPipeline:
                customPipelines[defaultViewElements.customPipeline],
              fileManager,
              index
            }"
            @update="onQueryUpdate"
          />
          <UnitQuery
            v-else
            v-bind="{
              selectedExample,
              visualizations,
              defaultViewElements,
              query: queries[index],
              fileManager,
              index
            }"
            @update="onQueryUpdate"
          />
        </VCol>
      </VRow>
      <VRow v-if="showDataExplorer">
        <VCol>
          <UnitFileExplorer v-bind="{ fileManager }" />
        </VCol>
      </VRow>
      <VRow v-if="$store.state.config.consent">
        <VCol cols="8 mx-auto">
          <UnitConsentForm v-bind="{ allResults, defaultView }" />
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
    examples: Array,
    visualizations: Object,
    defaultView: Array,
    title: String,
    dataPortal: String,
    customPipelines: Object,
    isGenericViewer: Boolean,
    showDataExplorer: Boolean,
    files: Array,
    preprocessors: Object,
    allowMissingFiles: Boolean
  },
  data() {
    // main example is selected by default
    const selectedExample = this.examples[0]
    return {
      selectedExample,
      progress: false,
      error: false,
      success: false,
      message: '',
      rml: '',
      allResults: [...Array(this.defaultView.length)],
      allFiles: null,
      fileManager: new FileManager(this.preprocessors, this.allowMissingFiles)
    }
  },
  computed: {
    queries() {
      return this.defaultView.map(o =>
        this.selectedExample.sparql.find(s => s.name === o.query)
      )
    },
    isRdfNeeded() {
      return this.defaultView.filter(v => 'query' in v).length > 0
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

      await this.fileManager.init(uppyFiles)
      let processedFiles
      try {
        processedFiles = await this.fileManager.preprocessFiles(this.files)
      } catch (error) {
        this.handleError(error)
        return
      }

      if (this.isRdfNeeded && this.selectedExample.yarrrml) {
        try {
          this.rml = await parseYarrrml(this.selectedExample.yarrrml)
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
