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
            >{{ message }}</v-alert
          >
        </template>
      </v-col>
    </v-row>
    <template v-if="success">
      <v-row v-for="(defaultViewElements, index) in defaultView" :key="index">
        <v-col>
          <unit-query
            v-if="queryShortcut"
            v-bind="{
              data,
              visualizations,
              defaultViewElements,
              selectedExample,
              queryShortcut
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
              i: index,
              queryShortcut
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

function getErrorMessage(error) {
  return error instanceof Error ? error.message : error
}

export default {
  props: {
    examples: Array,
    visualizations: Object,
    defaultView: Array,
    title: String,
    dataPortal: String,
    queryShortcut: Boolean
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
      data: ''
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
    selectedExample: {
      immediate: true,
      async handler(selectedExample) {
        // this should be quick ...
        this.rml = await parseYarrrml(selectedExample.yarrrml)
      }
    },
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
    onUnitFilesUpdate({ inputFiles, error }) {
      this.initState()
      if (Object.keys(inputFiles).length === 0) {
        this.error = true
        this.message = 'No relevant files were found'
        this.progress = false
      } else if (error) {
        this.error = true
        this.message = error
        this.progress = false
      } else if (this.queryShortcut) {
        // TODO extend for multiple files
        this.data = Object.values(inputFiles)[0]
        this.progress = false
        this.success = true
      } else if (!this.rml) {
        throw new Error('RML not ready')
      } else {
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
        }
      }
    },
    onQueryUpdate({ i, headers, items }) {
      this.allHeaders[i] = JSON.stringify(headers)
      this.allItems[i] = JSON.stringify(items)
    }
  }
}
</script>
