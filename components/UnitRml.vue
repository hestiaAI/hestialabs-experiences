<template>
  <div class="io-block mt-6">
    <div class="mr-lg-6 mb-6">
      <h2 class="my-3">YARRRML</h2>
      <base-download-button extension="yml" :data="yarrrml" />
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
        :extension="rmlExtension"
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
</template>

<script>
import parseYarrrml from '@/utils/parse-yarrrml'

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
      rmlGenerateStatus: false,
      rml: '',
      rmlError: false
    }
  },
  computed: {
    rmlExtension() {
      return this.rmlError ? undefined : 'ttl'
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
      this.rmlGenerateStatus = false
      this.rml = ''
    }
  },
  methods: {
    async generateRML() {
      try {
        this.rmlError = false
        const rml = await parseYarrrml(this.yarrrml)
        this.rml = rml
        this.$emit('update', { rml })
      } catch (error) {
        console.error(error)
        this.rmlError = true
        this.rml = error
        this.$emit('update', { error })
      } finally {
        this.rmlGenerateStatus = true
      }
    }
  }
}
</script>
