<template>
  <VRow>
    <VCol cols="12" lg="6">
      <h2 class="my-3">YARRRML</h2>
      <BaseButtonDownloadData extension="yml" :data="yarrrml" />
      <CodeEditor
        :value.sync="yarrrml"
        class="mt-6"
        language="yaml"
        line-numbers
      />
    </VCol>
    <VCol>
      <h2 class="my-3">RML</h2>
      <BaseButton
        v-bind="{ progress, status, error }"
        text="Generate RML"
        icon="mdiStepForward"
        class="mr-sm-2 my-sm-2"
        @click="generateRML"
      />
      <BaseButtonDownloadData
        v-bind="{ data, extension }"
        :disabled="!rml"
        class="ma-sm-2"
      />
      <CodeEditor
        :value="data"
        :error="error"
        class="mt-6"
        readonly
        line-numbers
        language="turtle"
      />
    </VCol>
  </VRow>
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
      this.error = false
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
      this.error = false
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
        window.setTimeout(() => {
          // RML generation is usually super quick
          // so the user will not see the progress indicator
          // without this timeout
          this.progress = false
          this.status = true
        }, 500)
      }
    }
  }
}
</script>
