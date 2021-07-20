<template>
  <div>
    <v-file-input
      :label="label"
      show-size
      :accept="accept"
      :multiple="multiple"
      :loading="loading"
      @change="onFileChange"
    />

    <span v-if="uploadTime">{{ uploadTime }} sec.</span>

    <p>Output:</p>
    <pre cass="mt-6"><code v-text="output || 'None'" /></pre>
    <v-btn
      v-if="success && href"
      outlined
      nuxt
      download
      :href="href"
      class="mt-5"
    >
      <v-icon left>
        mdi-download
      </v-icon>
      Download
    </v-btn>
  </div>
</template>

<script>
import readFile from '@/lib/file-reader'
import map from '@/lib/map-to-rdf'
import unzipit from '@/lib/unzip'
import parse from '@/lib/parse-yarrrml'

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
      yarrrml: '',
      rml: '',
      output: '',
      href: '',
      success: true,
      loading: false,
      uploadTime: 0
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
    }
  },
  async mounted() {
    const result = await fetch(`/${this.identifier}/rml.yml`)
    this.yarrrml = await result.text()
    this.rml = await parse(this.yarrrml)
  },
  methods: {
    async onFileChange(submittedFiles) {
      try {
        this.loading = true
        const start = new Date()

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
        this.uploadTime = parseInt((new Date() - start) / 1000)
        const result = await map(this.rml, inputFiles, this.functions)
        this.output = result
        this.href = window.URL.createObjectURL(
          new Blob([result], { type: 'text/plain' })
        )
        this.success = true
      } catch (error) {
        this.output = error
        this.success = false
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
