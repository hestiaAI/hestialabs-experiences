<template>
  <div>
    <h2 class="mt-3">Input</h2>
    <div class="io-block">
      <div class="mr-lg-6 mb-6">
        <h3>File</h3>
        <v-file-input
          :label="label"
          show-size
          :accept="accept"
          :multiple="multiple"
          :loading="loading"
          hide-details
          @change="onFileChange"
        >
          <template v-if="inputFiles" #append>
            <v-icon v-if="isError(inputFiles)" color="red">
              mdi-cross
            </v-icon>
            <v-icon v-else color="green">
              mdi-check
            </v-icon>
          </template>
        </v-file-input>
        <span v-if="uploadTime">{{ uploadTime }} sec.</span>
        <code-editor
          :value="inputFilesResult"
          class="mt-9"
          readonly
          language="json"
        />
        <template v-if="showExtractedInputFiles">
          <p class="font-weight-bold">Extracted files:</p>
          <ul>
            <li v-for="f in files" :key="f">{{ f }}</li>
          </ul>
        </template>
      </div>
      <div>
        <h3 class="my-3">YARRRML</h3>
        <base-button @click="yarrrml = yarrrmlPrecontructed">
          Use preconstructed
        </base-button>
        <base-button :disabled="parseYARRRMLDisabled" @click="parseYARRRML">
          Generate RML
          <template v-if="rml">
            <v-icon v-if="isError(rml)" right color="red">mdi-alert</v-icon>
            <v-icon v-else right color="green">mdi-check-circle</v-icon>
          </template>
        </base-button>
        <code-editor :value.sync="yarrrml" language="yaml" />
      </div>
    </div>
    <h2>Output</h2>
    <div class="io-block">
      <div class="mr-lg-6">
        <h3 class="my-3">RML</h3>
        <base-button nuxt download :href="rmlHref" :disabled="!rml">
          <v-icon left>
            mdi-download
          </v-icon>
          Download
        </base-button>
        <base-button :disabled="generateRDFDisabled" @click="generateRDF">
          Generate RDF
          <template v-if="rdf">
            <v-icon v-if="isError(rdf)" right color="red">mdi-alert</v-icon>
            <v-icon v-else right color="green">mdi-check-circle</v-icon>
          </template>
        </base-button>
        <code-editor :value="rml" class="mt-6" readonly language="turtle" />
      </div>
      <div>
        <h3 class="my-3">RDF</h3>
        <base-button nuxt download :href="rdfHref" :disabled="!rdf">
          <v-icon left>
            mdi-download
          </v-icon>
          Download
        </base-button>

        <code-editor :value="rdf" class="mt-6" readonly language="turtle" />
      </div>
    </div>
  </div>
</template>

<script>
import readFile from '@/lib/file-reader'
import mapToRDF from '@/lib/map-to-rdf'
import unzipit from '@/lib/unzip'
import parseYARRRML from '@/lib/parse-yarrrml'

import { isError, createObjectURL } from '@/lib/utils'

export default {
  props: {
    identifier: {
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
    sources: {
      type: Array,
      required: true
    },
    preprocessor: {
      type: Function,
      default(input) {
        return input
      }
    },
    functions: {
      type: Object,
      default: () => ({})
    },
    ext: {
      type: String,
      required: true,
      validator(val) {
        const validExtensions = ['zip', 'csv', 'json', 'xml']
        return val.split(',').every(v => validExtensions.includes(v))
      }
    }
  },
  data() {
    return {
      inputFiles: '',
      loading: false,
      uploadTime: 0,
      yarrrmlPrecontructed: '',
      yarrrml: 'mappings:',
      rml: '',
      rmlHref: '',
      rdf: '',
      rdfHref: ''
    }
  },
  computed: {
    extensions() {
      return this.ext.split(',')
    },
    accept() {
      return this.extensions.map(ext => `.${ext}`).join()
    },
    label() {
      return `Select file${this.multiple ? 's' : ''} (${this.ext})`
    },
    parseYARRRMLDisabled() {
      return !this.inputFiles || isError(this.inputFiles)
    },
    generateRDFDisabled() {
      return !this.rml || isError(this.rml)
    },
    inputFilesResult() {
      const { inputFiles: f } = this
      if (!f) {
        return ''
      }
      if (isError(f)) {
        return f
      }
      const res = Object.fromEntries(
        Object.entries(f).map(([k, v]) => [k, JSON.parse(v)])
      )
      return JSON.stringify(res, null, '\t')
    },
    showExtractedInputFiles() {
      const { files: f, inputFilesResult: res } = this
      return f.length && res && !isError(res)
    }
  },
  async mounted() {
    const result = await fetch(`/${this.identifier}/rml.yml`)
    this.yarrrmlPrecontructed = await result.text()
  },
  methods: {
    isError,
    async onFileChange(submittedFiles) {
      try {
        // set loading state while processing uploaded files
        this.loading = true
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
        this.uploadTime = parseInt((new Date() - start) / 1000)

        // create inputFiles object with path-text pairs
        let inputFiles = {}
        if (!this.files.length) {
          // assuming this case is when the user submits a single file
          // and the name does not matter
          inputFiles[`input.${this.extensions[0]}`] = resolvedArr[0]
        } else {
          inputFiles = Object.fromEntries(
            resolvedArr
              .flat()
              .map((text, idx) => [this.files[idx], this.preprocessor(text)])
          )
        }
        this.inputFiles = inputFiles
      } catch (error) {
        console.error(error)
        this.inputFiles = error
      } finally {
        this.loading = false
      }
    },
    async parseYARRRML() {
      try {
        this.rml = await parseYARRRML(this.yarrrml)
        this.rmlHref = createObjectURL(this.rml, 'text/turtle')
      } catch (error) {
        console.error(error)
        this.rml = error
        this.rmlHref = createObjectURL(this.rml)
      }
    },
    async generateRDF() {
      try {
        this.rdf = await mapToRDF(this.rml, this.inputFiles, this.functions)
        this.rdfHref = createObjectURL(this.rdf, 'text/n3; charset=utf-8')
      } catch (error) {
        console.error(error)
        this.rdf = error
        this.rdfHref = createObjectURL(this.rdf)
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
