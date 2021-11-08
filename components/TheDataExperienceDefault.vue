<template>
  <div>
    <v-row>
      <v-col cols="12 mx-auto" sm="6">
        <unit-introduction
          v-bind="{ companyName: title, dataPortal, isGenericViewer }"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12 mx-auto" sm="6">
        <slot name="unit-files" :update="onUnitFilesUpdate" />
        <template v-if="progress">
          <base-progress-circular class="mr-2" />
          <span>Processing files...</span>
        </template>
        <template v-else-if="error || success">
          <v-alert
            :type="error ? 'error' : 'success'"
            border="top"
            colored-border
            max-width="600"
            >{{ message }}
          </v-alert>
        </template>
      </v-col>
    </v-row>
    <template v-if="success">
      <v-row v-for="(defaultViewElements, index) in defaultView" :key="index">
        <v-col>
          <unit-query
            v-if="defaultViewElements.customPipeline"
            v-bind="{
              visualizations,
              defaultViewElements,
              selectedExample,
              customPipeline:
                customPipelines[defaultViewElements.customPipeline],
              inputFiles,
              i: index
            }"
            @update="onQueryUpdate"
          />
          <unit-query
            v-else
            v-bind="{
              selectedExample,
              visualizations,
              defaultViewElements,
              query: queries[index],
              i: index
            }"
            @update="onQueryUpdate"
          />
        </v-col>
      </v-row>
      <v-row v-if="showDataExplorer">
        <v-col>
          <unit-file-explorer v-bind="{ fileManager, preprocessor }" />
        </v-col>
      </v-row>
      <v-row v-if="$store.state.config.consent">
        <v-col cols="8 mx-auto">
          <unit-consent-form v-bind="{ allItems, allHeaders, defaultView }" />
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import rdfUtils from '@/utils/rdf'
import UnitFileExplorer from '~/components/UnitFileExplorer'
import parseYarrrml from '@/utils/parse-yarrrml'
import FileManager from '~/utils/file-manager'

export default {
  components: { UnitFileExplorer },
  props: {
    examples: Array,
    visualizations: Object,
    defaultView: Array,
    title: String,
    dataPortal: String,
    customPipelines: Object,
    preprocessor: String,
    isGenericViewer: Boolean,
    showDataExplorer: Boolean
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
      allItems: null,
      allHeaders: null,
      inputFiles: null,
      allFiles: null,
      fileManager: new FileManager()
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
  watch: {
    allItems: {
      immediate: true,
      handler(allItems) {
        if (!allItems) {
          this.allItems = Object.fromEntries(
            Object.keys(this.defaultView).map((x, i) => [i, ''])
          )
          this.allHeaders = Object.fromEntries(
            Object.keys(this.defaultView).map((x, i) => [i, ''])
          )
        }
      }
    }
  },
  methods: {
    handleError(error) {
      console.error(error)
      this.error = true
      this.message = error instanceof Error ? error.message : error
    },
    async onUnitFilesUpdate({ inputFiles, error, uppyFiles }) {
      this.message = ''
      this.error = false
      this.success = false
      this.progress = true
      this.inputFiles = inputFiles

      await this.fileManager.init(uppyFiles)

      if (error) {
        this.handleError(error)
      } else if (
        !this.isGenericViewer &&
        Object.keys(inputFiles).length === 0
      ) {
        this.handleError('No relevant files were found')
      } else if (this.isRdfNeeded && this.selectedExample.yarrrml) {
        try {
          const start = new Date()

          this.rml = await parseYarrrml(this.selectedExample.yarrrml)
          rdfUtils.generateRDF(this.rml, inputFiles)
          this.success = true

          const elapsed = new Date() - start
          this.message = `Successfully processed in ${elapsed / 1000} sec.`
        } catch (error) {
          this.handleError(error)
        }
      } else {
        this.success = true
        this.message = 'Successfully processed'
      }

      this.progress = false
    },
    onQueryUpdate({ i, headers, items }) {
      this.allHeaders[i] = JSON.stringify(headers)
      this.allItems[i] = JSON.stringify(items)
    }
  }
}
</script>
