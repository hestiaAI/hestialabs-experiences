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
        <base-button
          :status="rmlGenerateStatus"
          :error="rmlError"
          text="Generate RML"
          @click="generateRML"
        />
        <code-editor :value.sync="yarrrml" class="mt-6" language="yaml" />
      </div>
      <div>
        <h2 class="my-3">RML</h2>
        <base-download-button
          :mime-type="rmlMimeType"
          :data="rml"
          :disabled="!rml"
        />
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
        <h2 class="mb-2">Files</h2>
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
          hide-details
          class="mt-6"
          menu-props="auto, overflowY, offsetY, top"
          placeholder="Type file name or select from list..."
          label="Specify files to extract from zip archives..."
          style="max-width: 650px"
        />

        <slot
          name="file-input"
          :loading="filesLoading"
          :disabled="rdfLoading"
          :handle-files="onFileChange"
          :status="Boolean(inputFilesRocketRML)"
          :error="filesError"
        />

        <code-editor
          :value="filesUploadMessage"
          :error="filesError"
          class="mt-9"
          readonly
        />
      </div>
      <div>
        <h2 class="my-3">RDF</h2>
        <div class="d-flex flex-column flex-sm-row align-start">
          <v-select
            v-model="toRDF"
            :items="rdfFormats"
            style="max-width: 150px"
            hide-details
            label="Format"
            class="ma-sm-2"
          />
          <base-button
            :disabled="generateRDFDisabled"
            :progress="rdfLoading"
            :status="rdfGenerateStatus"
            :error="rdfError"
            text="Generate RDF"
            class="ma-sm-2"
            @click="generateRDF"
          />
          <base-download-button
            :mime-type="rdfMimeType"
            :data="rdf"
            :disabled="!rdf"
            class="ma-sm-2"
          />
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
          <base-button
            :disabled="runQueryDisabled"
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
import processFiles from '@/utils/process-files'
import rdfUtils from '@/utils/rdf'
import filesComboboxItems from '@/utils/files-combobox-items'

import parseYarrrml from '@/lib/parse-yarrrml'
import query from '@/lib/sparql'

export default {
  props: {
    examples: Array,
    extensions: Array,
    files: Array,
    isSingleFileExperience: Boolean,
    preprocessorFunc: Function
  },
  data() {
    // main example is selected by default
    const selectedExample = this.examples[0]
    return {
      selectedExample,
      filesCombobox: [],
      filesComboboxItems,
      inputFilesRocketRML: null,
      filesLoading: false,
      filesError: false,
      filesProcessingTime: 0,
      yarrrml: selectedExample.yarrrml,
      rmlGenerateStatus: false,
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
      rdfGenerateStatus: false,
      rdf: '',
      rdfLoading: false,
      rdfError: false,
      rdfHref: '',
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
    },
    rmlMimeType() {
      return this.rmlError ? undefined : 'text/turtle'
    },
    rdfMimeType() {
      if (this.rdfError) {
        return
      }
      return this.toRDF ? 'application/n-quads' : 'application/ld+json'
    }
  },
  watch: {
    yarrrml() {
      this.rmlGenerateStatus = false
      this.rml = ''
    },
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
    },
    selectedExample({ yarrrml }) {
      this.yarrrml = yarrrml
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
          this.extensions,
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
      try {
        this.rdfError = false
        this.rmlError = false
        this.rml = await parseYarrrml(this.yarrrml)
      } catch (error) {
        console.error(error)
        this.rmlError = true
        this.rml = error
      } finally {
        this.rmlGenerateStatus = true
      }
    },
    handleRdfData(data) {
      this.rdf = data
      this.rdfError = false
      this.rdfGenerateMessage = 'RDF generated successfully'
    },
    handleRdfError(error) {
      console.error(error)
      this.rdfError = true
      this.rdfGenerateMessage = error
    },
    handleRdfEnd() {
      this.rdfLoading = false
      this.rdfGenerateStatus = true
    },
    async generateRDF() {
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
