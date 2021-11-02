<template>
  <div>
    <v-row>
      <v-col cols="12 mx-auto" sm="6">
        <unit-introduction :company-name="title" :data-portal="dataPortal" />
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
      <v-row>
        <v-col>
          <unit-file-explorer v-bind="{ allFiles, preprocessor }" />
        </v-col>
      </v-row>
      <v-row v-for="(defaultViewElements, index) in defaultView" :key="index">
        <v-col>
          <unit-query
            v-if="defaultViewElements.customPipeline"
            v-bind="{
              visualizations,
              defaultViewElements,
              selectedExample,
              customPipeline: customPipeline,
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
import parseYarrrml from '@/utils/parse-yarrrml'
import UnitFileExplorer from '~/components/UnitFileExplorer'

function getErrorMessage(error) {
  return error instanceof Error ? error.message : error
}

export default {
  components: { UnitFileExplorer },
  props: {
    examples: Array,
    visualizations: Object,
    defaultView: Array,
    title: String,
    dataPortal: String,
    customPipeline: Function,
    preprocessor: String
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
      allFiles: null
    }
  },
  computed: {
    queries() {
      return this.defaultView.map(o =>
        this.selectedExample.sparql.find(s => s.name === o.query)
      )
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
    initState() {
      this.message = ''
      this.error = false
      this.success = false
      this.progress = true
    },
    handleRdfData({ elapsed }) {
      this.success = true
      this.message = `Successfully processed in ${elapsed / 1000} sec.`
    },
    handleRdfError(error) {
      console.error(error)
      this.error = true
      this.message = getErrorMessage(error)
    },
    handleRdfEnd() {
      this.progress = false
    },
    async onUnitFilesUpdate({ inputFiles, error, allFiles }) {
      this.initState()
      this.inputFiles = inputFiles
      this.allFiles = allFiles
      if (this.selectedExample.yarrrml) {
        this.rml = await parseYarrrml(this.selectedExample.yarrrml)
      }
      if (Object.keys(inputFiles).length === 0) {
        this.error = true
        this.message = 'No relevant files were found'
        this.progress = false
        return
      } else if (error) {
        console.error(error)
        this.error = true
        this.message = error.message
        this.progress = false
        return
      } else if (this.rml) {
        try {
          rdfUtils.generateRDF(
            this.handleRdfData,
            this.handleRdfError,
            this.handleRdfEnd,
            this.rml,
            inputFiles
          )
        } catch (error) {
          console.error(error)
          this.error = true
          this.message = error.message
          this.progress = false
          return
        }
      }
      this.progress = false
      this.success = true
    },
    onQueryUpdate({ i, headers, items }) {
      this.allHeaders[i] = JSON.stringify(headers)
      this.allItems[i] = JSON.stringify(items)
    }
  }
}
</script>
