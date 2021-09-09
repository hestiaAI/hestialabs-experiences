<template>
  <div class="io-block mt-6">
    <div class="mr-lg-6 mb-6">
      <h2 class="my-3">YARRRML</h2>
      <base-download-button extension="yml" :data="yarrrml" />
      <code-editor
        :value.sync="yarrrml"
        class="mt-6"
        language="yaml"
        line-numbers
      />
    </div>
    <div>
      <h2 class="my-3">RML</h2>
      <base-button
        :f="f"
        :args="args"
        text="Generate RML"
        icon="mdiStepForward"
        class="mr-sm-2 my-sm-2"
        @click="handleResult"
      />
      <base-download-button
        v-bind="{ data, extension }"
        :disabled="!rml"
        class="ma-sm-2"
      />
      <code-editor
        :value="data"
        :error="error"
        class="mt-6"
        readonly
        line-numbers
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
      return this.rml ? 'ttl' : undefined
    },
    data() {
      // if there is RML, download it, otherwise download the message
      return this.rml ? this.rml : this.message
    },
    f() {
      return parseYarrrml
    },
    args() {
      return [this.yarrrml]
    }
  },
  watch: {
    yarrrmlExample: {
      immediate: true,
      handler(val) {
        this.yarrrml = val
        // FIXME call button function
      }
    }
  },
  methods: {
    handleResult(result) {
      this.rml = ''
      this.message = ''
      if (result.value) {
        this.rml = result.value
        this.$emit('update', { rml: result.value })
      } else {
        this.message = processError(result.error)
        this.$emit('update', { error: result.error })
      }
    }
  }
}
</script>
