<template>
  <div>
    <v-file-input
      :label="label"
      show-size
      :accept="accept"
      :multiple="multiple"
      @change="onFileChange"
    />

    <p>Output:</p>
    <pre cass="mt-6"><code v-text="output" /></pre>
  </div>
</template>

<script>
import readFile from '@/lib/file-reader'
import map from '~/lib/map-to-rdf'
import parse from '~/lib/parse-yarrrml'

export default {
  props: {
    identifier: {
      type: String,
      required: true
    },
    ext: {
      type: String,
      required: true,
      validator (val) {
        const validExtensions = ['csv', 'json', 'xml']
        return val.split(',').every(v => validExtensions.includes(v))
      }
    }
  },
  data () {
    return {
      yarrrml: '',
      rml: '',
      output: 'None'
    }
  },
  computed: {
    extensions () {
      return this.ext.split(',')
    },
    accept () {
      return this.extensions.map(ext => `.${ext}`).join()
    },
    multiple () {
      return this.extensions.length > 1
    },
    label () {
      return `Select file${this.multiple ? 's' : ''} (${this.ext})`
    }
  },
  async mounted () {
    this.yarrrml = await this.$axios.$get(`/${this.identifier}/rml.yml`)
    this.rml = await parse(this.yarrrml)
  },
  methods: {
    async onFileChange (files) {
      if (files.length) {
        try {
          // todo: read multiple files ... (twitter, for example)
          const content = await readFile(files[0])
          const inputFiles = {
            [`input.${this.extensions[0]}`]: content
          }
          const result = await map(this.rml, inputFiles)
          this.output = result
        } catch (error) {
          this.output = error
        }
      }
    }
  }
}
</script>
