<template>
  <div>
    <h1>{{ meta.title }}: {{ meta.subtitle }}</h1>
    <div class="io-block">
      <div class="mr-lg-6 mb-6">
        <h2 class="my-3">YARRRML</h2>
        <base-button @click="yarrrml = yarrrmlPrecontructed">
          Use preconstructed
        </base-button>
        <base-button @click="generateRML">
          Generate RML
          <template v-if="rml">
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
        <v-file-input
          :label="label"
          show-size
          :accept="accept"
          :multiple="multiple"
          :loading-files="filesLoading"
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
          <template v-if="rdf">
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
  </div>
</template>

<script>
import readFile from '@/lib/file-reader'
import mapToRDF from '@/lib/map-to-rdf'
import unzipit from '@/lib/unzip'
import parseYARRRML from '@/lib/parse-yarrrml'

import { createObjectURL, objectIsEmpty } from '@/lib/utils'

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
      inputFiles: {},
      filesLoading: false,
      filesError: false,
      filesUploadTime: 0,
      yarrrmlPrecontructed: '',
      yarrrml: 'mappings:',
      rml: '',
      rmlError: false,
      rmlHref: '',
      rdf: '',
      rdfError: false,
      rdfHref: ''
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
      return `Select file${this.multiple ? 's' : ''} (${this.ext})`
    },
    generateRDFDisabled() {
      return !this.rml || this.rmlError || objectIsEmpty(this.inputFiles)
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
        return `Success!\nFiles extracted:\n${files.join('\n')}`
      }

      return 'Success!'
    }
  },
  async mounted() {
    const result = await fetch(`/${this.identifier}/rml.yml`)
    this.yarrrmlPrecontructed = await result.text()
  },
  methods: {
    objectIsEmpty,
    async onFileChange(submittedFiles) {
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
        this.filesError = true
        this.inputFiles = error
      } finally {
        this.filesLoading = false
      }
    },
    async generateRML() {
      try {
        this.rdfError = false
        this.rmlError = false
        this.rml = await parseYARRRML(this.yarrrml)
        this.rmlHref = createObjectURL(this.rml, 'text/turtle')
      } catch (error) {
        console.error(error)
        this.rmlError = true
        this.rml = error
        this.rmlHref = createObjectURL(this.rml)
      }
    },
    async generateRDF() {
      try {
        this.rdfError = false
        this.rdf = await mapToRDF(this.rml, this.inputFiles, this.functions)
        this.rdfHref = createObjectURL(this.rdf, 'text/n3; charset=utf-8')
      } catch (error) {
        console.error(error)
        this.rdfError = true
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
