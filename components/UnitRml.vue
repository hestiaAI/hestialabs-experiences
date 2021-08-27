<template>
  <div class="io-block mt-6">
    <div class="mr-lg-6 mb-6">
      <h2 class="my-3">YARRRML</h2>
      <base-download-button extension="yml" :data="yarrrml" />
      <base-button
        v-bind="{ progress, status, error }"
        text="Generate RML"
        @click="generateRML"
      />
      <code-editor :value.sync="yarrrml" class="mt-6" language="yaml" />
    </div>
    <div>
      <h2 class="my-3">RML</h2>
      <base-download-button v-bind="{ data, extension }" :disabled="!rml" />
      <code-editor
        :value="data"
        :error="error"
        class="mt-6"
        readonly
        language="turtle"
      />
    </div>
  </div>
</template>

<script>
import parseYarrrml from '@/utils/parse-yarrrml'
import { processError } from '@/utils/utils'

export default {
  props: {
    yarrrmlExample: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      yarrrml: this.yarrrmlExample,
      message: '',
      status: false,
      error: false,
      progress: false,
      rml: ''
    }
  },
  computed: {
    extension() {
      return this.rmlError ? undefined : 'ttl'
    },
    data() {
      // if there is an error, download the message, o/w the RDF
      return this.error ? this.message : this.rml
    }
  },
  watch: {
    yarrrmlExample: {
      immediate: true,
      async handler(val) {
        this.yarrrml = val
        await this.generateRML()
      }
    },
    yarrrml() {
      this.status = false
      this.rml = ''
    }
  },
  methods: {
    async generateRML() {
      this.rml = ''
      this.message = ''
      this.progress = true
      this.status = false
      try {
        const rml = await parseYarrrml(this.yarrrml)
        this.rml = rml
        this.$emit('update', { rml })
      } catch (error) {
        console.error(error)
        this.error = true
        this.message = processError(error)
        this.$emit('update', { error })
      } finally {
        this.progress = false
        this.status = true
      }
    }
  }
}
</script>
