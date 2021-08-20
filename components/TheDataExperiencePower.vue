<template>
  <div>
    <v-select
      v-model="selectedExample"
      :items="examples"
      item-text="name"
      return-object
      label="Select example"
      :disabled="examples.length === 1"
      hide-details
      style="max-width: 200px"
    ></v-select>

    <div class="io-block mt-6">
      <div class="mr-lg-6 mb-6">
        <h2 class="my-3">YARRRML</h2>
        <base-button @click="generateRML">
          Generate RML
          <template v-if="rmlGenerateAlert">
            <v-icon v-if="rmlError" right color="red">mdi-alert</v-icon>
            <v-icon v-else right color="green">mdi-check-circle</v-icon>
          </template>
        </base-button>
        <code-editor :value.sync="yarrrml" class="mt-6" language="yaml" />
      </div>
      <div>
        <h2 class="my-3">RML</h2>
        <base-button nuxt download :href="rmlHref" :disabled="!rml">
          <v-icon left>
            mdi-download
          </v-icon>
          Download
        </base-button>
        <code-editor
          :value="rml"
          :error="rmlError"
          class="mt-6"
          readonly
          language="turtle"
        />
      </div>
    </div>
    <div class="io-block">
      <div class="mr-lg-6">
        <h2>File</h2>
        <v-combobox
          v-if="isPlayground"
          v-model="filesCombobox"
          :items="filesComboboxItems"
          clearable
          multiple
          small-chips
          deletable-chips
          outlined
          dense
          class="mt-6"
          placeholder="Type file name or select from below"
          label="Add files to extract from zip archive..."
        />
        <v-select
          v-model="selectedDataSample"
          :items="data"
          label="Select sample"
          :disabled="!data.length"
          hide-details
          style="max-width: 200px"
        />
        <slot
          name="file-input"
          :loading="filesLoading"
          :disabled="rdfLoading"
          :on-file-change="onFileChange"
        ></slot>

        <template v-if="inputFilesRocketRML">
          <v-icon v-if="filesError" color="red">
            mdi-cross
          </v-icon>
          <v-icon v-else color="green">
            mdi-check-circle
          </v-icon>
        </template>
        <span v-if="filesProcessingTime"
          >{{ filesProcessingTime / 1000 }} sec.</span
        >
        <code-editor
          :value="filesUploadMessage"
          :error="filesError"
          class="mt-9"
          readonly
        />
      </div>
      <div>
        <h2 class="my-3">RDF</h2>
        <div class="d-flex">
          <v-select
            v-model="toRDF"
            :items="rdfFormats"
            style="max-width: 150px"
            hide-details
            label="Format"
            class="ma-2"
          />
          <base-button
            :disabled="generateRDFDisabled"
            class="ma-2"
            @click="generateRDF"
          >
            Generate RDF
            <template v-if="rdfLoading">
              <v-progress-circular
                class="ml-2"
                :size="14"
                :width="2"
                indeterminate
              />
            </template>
            <template v-else-if="rdfGenerateAlert">
              <v-icon v-if="rdfError" right color="red">mdi-alert</v-icon>
              <v-icon v-else right color="green">mdi-check-circle</v-icon>
            </template>
          </base-button>
          <base-button nuxt download :href="rdfHref" :disabled="!rdf">
            <v-icon left>
              mdi-download
            </v-icon>
            Download
          </base-button>
        </div>

        <code-editor
          :value="rdfGenerateMessage"
          :error="rdfError"
          class="mt-6"
          readonly
        />
      </div>
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
          <base-button :disabled="runQueryDisabled" @click="runQuery">
            Run Query
            <template v-if="sparqlAlert">
              <v-icon v-if="sparqlError" right color="red">mdi-alert</v-icon>
              <v-icon v-else right color="green">mdi-check-circle</v-icon>
            </template>
          </base-button>
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
import processFiles from '@/utils/process-files'
import rdfUtils from '@/utils/rdf'
import { createObjectURL, revokeObjectURL } from '@/utils/utils'
import filesComboboxItems from '@/utils/files-combobox-items'

import parseYarrrml from '@/lib/parse-yarrrml'
import query from '@/lib/sparql'

export default {
  props: {
    accept: String,
    data: Array,
    examples: Array,
    ext: String,
    extensions: Array,
    files: Array,
    isSingleFileExperience: Boolean,
    label: String,
    multiple: Boolean,
    preprocessorFunc: Function
  },
  data() {
    // main example is selected by default
    const selectedExample = this.examples[0]
    return {
      selectedExample,
      selectedDataSample: null,
      filesCombobox: [],
      filesComboboxItems,
      inputFilesRocketRML: null,
      filesLoading: false,
      filesError: false,
      filesProcessingTime: 0,
      yarrrml: selectedExample.yarrrml,
      rmlGenerateAlert: false,
      rdfGenerateMessage: '',
      rml: '',
      rmlError: false,
      rmlHref: '',
      toRDF: true,
      rdfEditorLanguage: 'turtle',
      rdfFormats: [
        { text: 'N-Quads', value: true },
        { text: 'JSON-LD', value: false }
      ],
      rdfGenerateAlert: false,
      rdf: '',
      rdfLoading: false,
      rdfError: false,
      rdfHref: '',
      sparqlAlert: false,
      sparql: '',
      sparqlError: false,
      sparqlErrorMessage: '',
      sparqlResultsLoading: false,
      sparqlResultsHeaders: [],
      sparqlResultsItems: []
    }
  },
  computed: {
    isPlayground() {
      return this.$route.params.key === 'playground'
    },
    generateRDFDisabled() {
      return (
        !this.rml ||
        this.rmlError ||
        !this.inputFilesRocketRML ||
        this.rdfLoading
      )
    },
    runQueryDisabled() {
      return !this.rdf || this.rdfError || !this.toRDF
    },
    filesToExtract() {
      return this.isPlayground ? this.filesCombobox : this.files
    },
    filesUploadMessage() {
      const { inputFilesRocketRML: f, extractedFiles: xfiles } = this
      if (this.filesError) {
        return f
      }

      if (!f) {
        return ''
      }

      if (this.isSingleFileExperience) {
        // Single file input.<ext>
        return `Success! File registered: ${Object.keys(f)[0]}`
      }

      if (!xfiles) {
        return 'Unexpected result'
      }

      let msg = 'Success!\n'
      Object.entries(xfiles).forEach(([archive, filelist]) => {
        if (!archive) {
          // archive is empty string
          msg += 'Files submitted:'
        } else {
          msg += `Files extracted from ${archive}:`
        }
        msg += `\n${filelist.join('\n')}\n\n`
      })

      return msg.slice(0, -2)
    }
  },
  watch: {
    yarrrml() {
      this.rmlGenerateAlert = false
      this.rml = ''
    },
    rml() {
      this.rdfGenerateAlert = false
      this.rdfGenerateMessage = ''
    },
    filesCombobox() {
      this.inputFilesRocketRML = null
    },
    toRDF() {
      this.rdfGenerateAlert = false
      this.rdfGenerateMessage = ''
    },
    sparql() {
      this.sparqlAlert = false
    },
    selectedExample({ yarrrml }) {
      this.yarrrml = yarrrml
    },
    async selectedDataSample(filename) {
      // Assumes only single file can be selected at once
      const response = await window.fetch(`/data/${filename}`)
      const blob = await response.blob()
      const file = new File([blob], filename)
      await this.onFileChange([file])
    }
  },
  methods: {
    async onFileChange(submittedFiles) {
      try {
        // set filesLoading state while processing uploaded files
        this.filesError = false
        this.filesLoading = true
        const res = await processFiles(
          submittedFiles,
          this.filesToExtract,
          !this.isPlayground,
          this.ext,
          this.preprocessorFunc,
          this.isSingleFileExperience
        )
        // Object.entries(res).forEach(([k, v]) => (this[k] = v))
        this.filesProcessingTime = res.filesProcessingTime
        this.extractedFiles = res.extractedFiles
        this.inputFilesRocketRML = res.inputFilesRocketRML
      } catch (error) {
        console.error(error)
        this.filesError = true
        this.inputFilesRocketRML = error
      } finally {
        this.filesLoading = false
      }
    },
    async generateRML() {
      revokeObjectURL(this.rmlHref)
      try {
        this.rdfError = false
        this.rmlError = false
        this.rml = await parseYarrrml(this.yarrrml)
        this.rmlHref = createObjectURL(this.rml, 'text/turtle')
      } catch (error) {
        console.error(error)
        this.rmlError = true
        this.rml = error
        this.rmlHref = createObjectURL(this.rml)
      } finally {
        this.rmlGenerateAlert = true
      }
    },
    handleRdfData(data) {
      this.rdf = data
      this.rdfError = false
      this.rdfGenerateMessage = 'RDF generated successfully'
      const type = this.toRDF ? 'application/n-quads' : 'application/json'
      this.rdfHref = createObjectURL(data, type)
    },
    handleRdfError(error) {
      console.error(error)
      this.rdfError = true
      this.rdfGenerateMessage = error
      this.rdfHref = createObjectURL(error)
    },
    handleRdfEnd() {
      this.rdfLoading = false
      this.rdfGenerateAlert = true
    },
    async generateRDF() {
      revokeObjectURL(this.rdfHref)
      const { rml, inputFilesRocketRML, toRDF } = this
      this.rdf = ''
      this.rdfGenerateMessage = ''
      this.rdfLoading = true
      await rdfUtils.generateRDF(
        this.handleRdfData,
        this.handleRdfError,
        this.handleRdfEnd,
        rml,
        inputFilesRocketRML,
        toRDF
      )
    },
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
        this.sparqlAlert = true
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
