<template>
  <div>
    <div class="d-flex">
      <v-img max-width="50" :src="icon" contain />
      <h1 class="ml-3">{{ title }}</h1>
    </div>
    <p class="subtitle-1 mt-4">{{ subtitle }}</p>
    <div class="io-block">
      <div class="mr-lg-6 mb-6">
        <h2 class="my-3">YARRRML</h2>
        <base-button @click="yarrrmlCustom = yarrrml">
          Use preconstructed
        </base-button>
        <base-button @click="generateRML">
          Generate RML
          <template v-if="rml">
            <v-icon v-if="rmlError" right color="red">mdi-alert</v-icon>
            <v-icon v-else right color="green">mdi-check-circle</v-icon>
          </template>
        </base-button>
        <code-editor :value.sync="yarrrmlCustom" class="mt-6" language="yaml" />
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
        <v-file-input
          :label="label"
          show-size
          :accept="accept"
          :multiple="multiple"
          :loading-files="filesLoading"
          :disabled="rdfLoading"
          hide-details
          @change="onFileChange"
        >
          <template v-if="!objectIsEmpty(inputFiles)" #append>
            <v-icon v-if="filesError" color="red">
              mdi-cross
            </v-icon>
            <v-icon v-else color="green">
              mdi-check-circle
            </v-icon>
          </template>
        </v-file-input>
        <span v-if="filesUploadTime">{{ filesUploadTime }} sec.</span>
        <code-editor
          :value="inputFilesResult"
          :error="filesError"
          class="mt-9"
          readonly
        />
      </div>
      <div>
        <h2 class="my-3">RDF</h2>
        <base-button :disabled="generateRDFDisabled" @click="generateRDF">
          Generate RDF
          <template v-if="rdfLoading">
            <v-progress-circular
              class="ml-2"
              :size="14"
              :width="2"
              indeterminate
            />
          </template>
          <template v-else-if="rdf">
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

        <code-editor
          :value="rdf"
          :error="rdfError"
          class="mt-6"
          readonly
          language="turtle"
        />
      </div>
    </div>
    <div class="io-block">
      <div class="mr-lg-6">
        <h2 class="my-3">SPARQL</h2>
        <base-button :disabled="runQueryDisabled" @click="runQuery">
          Run Query
          <template v-if="sparqlErrorMessage">
            <v-icon v-if="sparqlError" right color="red">mdi-alert</v-icon>
            <v-icon v-else right color="green">mdi-check-circle</v-icon>
          </template>
        </base-button>
        <code-editor :value.sync="sparql" class="mt-6" language="sparql" />
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
        <query-results-data-table
          v-else
          :headers="sparqlResultsHeaders"
          :items="sparqlResultsItems"
        />
      </div>
    </div>
  </div>
</template>

<script>
import readFile from '@/lib/file-reader'
import mapToRDF from '@/lib/map-to-rdf'
import unzipit from '@/lib/unzip'
import parseYARRRML from '@/lib/parse-yarrrml'
import query from '@/lib/sparql'
import { createObjectURL, objectIsEmpty } from '@/lib/utils'
import Worker from '@/lib/rdf.worker.js'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    files: {
      type: Array,
      default: () => []
    },
    preprocessor: {
      type: Function,
      default(input) {
        return input
      }
    },
    ext: {
      type: String,
      required: true,
      validator(val) {
        // JS files allowed for experimenting with individual twitter files
        const validExtensions = ['zip', 'csv', 'json', 'js', 'xml']
        return val.split(',').every(v => validExtensions.includes(v))
      }
    },
    yarrrml: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      inputFiles: {},
      filesLoading: false,
      filesError: false,
      filesUploadTime: 0,
      yarrrmlCustom: 'mappings:',
      rml: '',
      rmlError: false,
      rmlHref: '',
      rdf: '',
      rdfLoading: false,
      rdfError: false,
      rdfHref: '',
      sparql: '',
      sparqlError: false,
      sparqlErrorMessage: '',
      sparqlResultsHeaders: [],
      sparqlResultsItems: []
    }
  },
  computed: {
    meta() {
      return this.$store.getters.getExperienceByKey(this.$route.params.key)
    },
    extensions() {
      return this.ext.split(',')
    },
    accept() {
      return this.extensions.map(ext => `.${ext}`).join()
    },
    label() {
      return `Select file${this.multiple ? 's' : ''} (${this.ext.replace(
        /,/g,
        ', '
      )})`
    },
    generateRDFDisabled() {
      return !this.rml || this.rmlError || objectIsEmpty(this.inputFiles)
    },
    runQueryDisabled() {
      return !this.rdf || this.rdfError
    },
    inputFilesResult() {
      const { inputFiles: f, files } = this
      if (this.filesError) {
        return f
      }

      if (objectIsEmpty(f)) {
        return ''
      }

      if (files.length) {
        // Files extracted from zip archive
        return `Success!\nFiles extracted:\n${files.join('\n')}`
      }

      if (this.multiple) {
        // Multiple files submitted
        return `Success!\nFiles submitted:\n${Object.keys(f).join('\n')}`
      }

      // Single file
      return 'Success!'
    }
  },
  mounted() {
    if (this.extensions.includes('zip') && !this.files.length) {
      throw new TypeError('Extension zip requires files to be specified')
    }
  },
  methods: {
    objectIsEmpty,
    async onFileChange(files) {
      if (files) {
        // files is an Array already if multiple is true
        const submittedFiles = this.multiple ? files : [files]
        try {
          // set filesLoading state while processing uploaded files
          this.filesError = false
          this.filesLoading = true
          const start = new Date()

          // read file/archive(s) asynchronously
          const resolvedArr = await Promise.all(
            submittedFiles.map(async f => {
              if (f.name.endsWith('.zip')) {
                // read zip archive and only extract files listed in this.files
                return await unzipit.readFiles(f, this.files)
              } else {
                return await readFile(f)
              }
            })
          )

          // compute upload time
          this.filesUploadTime = parseInt((new Date() - start) / 1000)

          // create inputFiles object with path-text pairs
          let inputFiles = {}
          if (!this.files.length && !this.multiple) {
            // user submits a single file and the name does not matter
            inputFiles[`input.${this.extensions[0]}`] = resolvedArr[0] || ''
          } else {
            // user submits multiple files or the files prop is not an empty array
            // 1. Single or multiple zip files
            let names = this.files
            if (!this.files.length && this.multiple) {
              // 2. Multiple individual files
              names = submittedFiles.map(({ name }) => name)
            }
            inputFiles = Object.fromEntries(
              resolvedArr
                .flat()
                .map((text, idx) => [names[idx], this.preprocessor(text)])
            )
          }
          this.inputFiles = inputFiles
        } catch (error) {
          console.error(error)
          this.filesError = true
          this.inputFiles = error
        } finally {
          this.filesLoading = false
        }
      }
    },
    async generateRML() {
      try {
        this.rdfError = false
        this.rmlError = false
        this.rml = await parseYARRRML(this.yarrrmlCustom)
        this.rmlHref = createObjectURL(this.rml, 'text/turtle')
      } catch (error) {
        console.error(error)
        this.rmlError = true
        this.rml = error
        this.rmlHref = createObjectURL(this.rml)
      }
    },
    async generateRDF() {
      const { rml, inputFiles } = this
      this.rdfLoading = true

      if (window.Worker) {
        const worker = new Worker()

        worker.postMessage([rml, inputFiles])

        worker.addEventListener('message', ({ data }) => {
          this.rdfLoading = false
          if (data instanceof Error) {
            this.rdfError = true
            this.rdfHref = createObjectURL(data)
          } else {
            this.rdfError = false
            this.rdfHref = createObjectURL(data, 'text/n3; charset=utf-8')
          }

          this.rdf = data
        })
      } else {
        console.warn('Your browser does not support web workers.')
        try {
          this.rdf = await mapToRDF(rml, inputFiles)
          this.rdfHref = createObjectURL(this.rdf, 'text/n3; charset=utf-8')
          this.rdfError = false
        } catch (error) {
          console.error(error)
          this.rdfError = true
          this.rdf = error
          this.rdfHref = createObjectURL(this.rdf)
        } finally {
          this.rdfLoading = false
        }
      }
    },
    async runQuery() {
      try {
        this.sparqlError = false
        const bindings = await query(this.rdf, this.sparql)
        if (bindings.length) {
          const headers = Array.from(bindings[0].keys())
          this.sparqlResultsItems = bindings.map(map =>
            // map.get(k) returns an N3 Term
            // https://github.com/rdfjs/N3.js/blob/main/src/N3DataFactory.js
            Object.fromEntries(headers.map(h => [h, map.get(h).value]))
          )
          this.sparqlResultsHeaders = headers.map(h => ({
            text: h.substring(1),
            value: h
          }))
        } else {
          this.sparqlResultsHeaders = []
        }
      } catch (error) {
        console.error(error)
        this.sparqlError = true
        this.sparqlErrorMessage = error
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
