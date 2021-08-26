<template>
  <div>
    <the-example-selector
      :value.sync="selectedExample"
      :items="examples"
      :disabled="examples.length === 1"
    />

    <unit-rml
      :yarrrml-example="selectedExample.yarrrml"
      @update="onUnitRmlUpdate"
    />

    <div class="io-block">
      <div class="mr-lg-6">
        <h2 class="mb-2">Files</h2>

        <!-- :error="filesError"
        :loading="filesLoading" -->
        <!-- :disabled="rdfLoading" -->
        <!-- :status="Boolean(inputFilesRocketRML)" -->
        <slot name="unit-files" @update="onUnitFilesUpdate" />
      </div>
      <unit-rdf :rml="rml" :input-files="inputFiles" />
    </div>
    <div class="io-block">
      <div class="mr-lg-6">
        <h2 class="my-3">SPARQL</h2>
        <div class="d-flex">
          <v-select
            v-model="sparql"
            :items="selectedExample.sparql"
            item-text="name"
            item-value="sparql"
            style="max-width: 150px"
            hide-details
            label="Select query"
            :disabled="!selectedExample.sparql.length"
            class="ma-2"
          />
          <base-button
            :disabled="runQueryDisabled"
            :progress="sparqlResultsLoading"
            :status="sparqlStatus"
            :error="sparqlError"
            text="Run Query"
            @click="runQuery"
          />
        </div>
        <code-editor
          :value.sync="sparql"
          class="mt-6"
          line-numbers
          language="sparql"
        />
      </div>
      <div class="mr-lg-6">
        <h2 class="my-3">Query Results</h2>
        <code-editor
          v-if="sparqlError"
          :value="sparqlErrorMessage"
          :error="sparqlError"
          class="mt-6"
          readonly
        />
        <the-query-results-data-table
          v-else
          :headers="sparqlResultsHeaders"
          :hide-default-footer="!sparqlResultsHeaders.length"
          :items="sparqlResultsItems"
          :loading="sparqlResultsLoading"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
// import processFiles from '@/utils/process-files'
// import rdfUtils from '@/utils/rdf'
// import filesComboboxItems from '@/utils/files-combobox-items'
import query from '@/utils/sparql'
// import localforage from '@/utils/localforage'

// const extractedFilesKey = 'extractedFiles'
// const inputFilesRRMLKey = 'inputFilesRocketRML'

export default {
  props: {
    examples: Array,
    // extensions: Array,
    // files: Array,
    isSingleFileExperience: Boolean,
    preprocessorFunc: Function
  },
  data() {
    // main example is selected by default
    const selectedExample = this.examples[0]
    return {
      selectedExample,
      // filesCombobox: [],
      // filesComboboxItems,
      // extractedFiles: null,
      inputFilesRocketRML: null,
      // filesLoading: false,
      // filesError: false,
      // filesProcessingTime: 0,
      rml: '',
      // toRDF: true,
      // rdfEditorLanguage: 'turtle',
      // rdfFormats: [
      //   { text: 'N-Quads', value: true },
      //   { text: 'JSON-LD', value: false }
      // ],
      // rdfGenerateMessage: '',
      // rdfGenerateStatus: false,
      rdf: '',
      // rdfLoading: false,
      // rdfError: false,
      sparqlStatus: false,
      sparql: '',
      sparqlError: false,
      sparqlErrorMessage: '',
      sparqlResultsLoading: false,
      sparqlResultsHeaders: [],
      sparqlResultsItems: []
    }
  },
  computed: {
    key() {
      return this.$route.params.key
    },
    // isPlayground() {
    //   return this.key === 'playground'
    // },
    // generateRDFDisabled() {
    //   return (
    //     !this.rml ||
    //     this.rmlError ||
    //     !this.inputFilesRocketRML ||
    //     this.rdfLoading
    //   )
    // },
    runQueryDisabled() {
      return !this.rdf || this.rdfError || !this.toRDF
    }
    // filesToExtract() {
    //   // In the playground, we override the filesToExtract prop
    //   return this.isPlayground ? this.filesCombobox : undefined
    // },
    // filesUploadMessage() {
    //   const {
    //     inputFilesRocketRML: f,
    //     extractedFiles: xfiles,
    //     filesProcessingTime: ms
    //   } = this
    //   if (this.filesError) {
    //     return f
    //   }

    //   if (!f) {
    //     return ''
    //   }

    //   const secs = ms / 1000

    //   if (this.isSingleFileExperience) {
    //     // Single file input.<ext>
    //     return `Success! File registered: ${
    //       Object.keys(f)[0]
    //     }\nTime elapsed: ${secs}`
    //   }

    //   if (!xfiles) {
    //     return 'Unexpected result'
    //   }

    //   let msg = `Success! Time elapsed: ${secs} sec.\n`
    //   Object.entries(xfiles).forEach(([archive, filelist]) => {
    //     if (!archive) {
    //       // archive is empty string
    //       msg += 'Files submitted:'
    //     } else {
    //       msg += `Files extracted from ${archive}:`
    //     }
    //     msg += `\n${filelist.join('\n')}\n\n`
    //   })

    //   return msg.slice(0, -2)
    // },
    // rdfExtension() {
    //   if (this.rdfError) {
    //     return
    //   }
    //   return this.toRDF ? 'nq' : 'jsonld'
    // }
  },
  watch: {
    rml() {
      this.rdfGenerateStatus = false
      this.rdfGenerateMessage = ''
    },
    filesCombobox() {
      this.inputFilesRocketRML = null
    },
    toRDF() {
      this.rdfGenerateStatus = false
      this.rdfGenerateMessage = ''
    },
    sparql() {
      this.sparqlStatus = false
    }
  },
  // async mounted() {
  //   this.inputFilesRocketRML = await localforage.getItem(
  //     inputFilesRRMLKey,
  //     this.key
  //   )
  //   this.extractedFiles = await localforage.getItem(extractedFilesKey, this.key)
  //   if (!this.generateRDFDisabled) {
  //     // Proceed to generate RDF if RML is available
  //     await this.generateRDF()
  //   }
  // },
  methods: {
    onUnitRmlUpdate({ rml = '', error }) {
      this.rml = rml
    },
    onUnitFilesUpdate({ inputFilesRocketRML: i = null, error }) {
      this.inputFilesRocketRML = i
    },
    // async handleFiles(submittedFiles) {
    //   try {
    //     // set filesLoading state while processing uploaded files
    //     this.filesError = false
    //     this.filesLoading = true
    //     // const res = await processFiles(
    //     //   submittedFiles,
    //     //   this.filesToExtract,
    //     //   !this.isPlayground,
    //     //   this.extensions,
    //     //   this.preprocessorFunc,
    //     //   this.isSingleFileExperience
    //     // )
    //     // Object.entries(res).forEach(([k, v]) => (this[k] = v))
    //     // this.filesProcessingTime = res.filesProcessingTime
    //     // this.extractedFiles = res.extractedFiles
    //     // this.inputFilesRocketRML = res.inputFilesRocketRML
    //     await localforage.setItem(
    //       inputFilesRRMLKey,
    //       res.inputFilesRocketRML,
    //       this.key
    //     )
    //     await localforage.setItem(
    //       extractedFilesKey,
    //       res.extractedFiles,
    //       this.key
    //     )

    //     if (!this.generateRDFDisabled) {
    //       // Proceed to generate RDF if RML is available
    //       await this.generateRDF()
    //     }
    //   } catch (error) {
    //     console.error(error)
    //     this.filesError = true
    //     this.inputFilesRocketRML = error
    //   } finally {
    //     this.filesLoading = false
    //   }
    // },
    // handleRdfData({ data, elapsed }) {
    //   this.rdf = data
    //   this.rdfError = false
    //   const secs = elapsed / 1000
    //   this.rdfGenerateMessage = `RDF generated successfully in ${secs} sec.`
    // },
    // handleRdfError(error) {
    //   console.error(error)
    //   this.rdfError = true
    //   this.rdfGenerateMessage = error
    // },
    // handleRdfEnd() {
    //   this.rdfLoading = false
    //   this.rdfGenerateStatus = true
    // },
    // async generateRDF() {
    //   const { rml, inputFilesRocketRML, toRDF } = this
    //   this.rdf = ''
    //   this.rdfGenerateMessage = ''
    //   this.rdfLoading = true
    //   await rdfUtils.generateRDF(
    //     this.handleRdfData,
    //     this.handleRdfError,
    //     this.handleRdfEnd,
    //     rml,
    //     inputFilesRocketRML,
    //     toRDF
    //   )
    // },
    async runQuery() {
      try {
        this.sparqlError = false
        this.sparqlResultsLoading = true
        const bindings = await query(this.rdf, this.sparql)
        if (bindings.length) {
          const headers = Array.from(bindings[0].keys())
          window.setTimeout(() => {
            this.sparqlResultsItems = bindings.map(map =>
              // map.get(k) returns an N3 Term
              // https://github.com/rdfjs/N3.js/blob/main/src/N3DataFactory.js
              Object.fromEntries(headers.map(h => [h, map.get(h).value]))
            )
            this.sparqlResultsHeaders = headers.map(h => ({
              text: h.substring(1),
              value: h
            }))

            this.sparqlResultsLoading = false
          }, 1000)
        }
      } catch (error) {
        console.error(error)
        this.sparqlError = true
        this.sparqlErrorMessage = error
        this.sparqlResultsLoading = false
      } finally {
        this.sparqlStatus = true
      }
    }
  }
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/settings/_variables'
.io-block
  display: flex
  flex-direction: column
  align-items: center
  > div
    width: 100%
@media #{map-get($display-breakpoints, 'lg-and-up')}
  .io-block
    flex-direction: row
    align-items: flex-start
    > div
      width: 50%
</style>
