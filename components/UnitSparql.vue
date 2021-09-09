<template>
  <div>
    <h2 class="my-3">SPARQL</h2>
    <div class="d-flex flex-column flex-sm-row align-start align-sm-end">
      <slot
        name="selector"
        :change="v => (sparql = v)"
        classAttr="my-sm-2 mr-sm-2 mb-2"
      />
      <base-button
        v-bind="{ progress, status, error, disabled }"
        text="Run Query"
        icon="mdiStepForward"
        class="ma-sm-2"
        @click="runQuery"
      />
      <base-download-button
        extension="rq"
        :data="sparql"
        class="ma-sm-2"
        :disabled="!sparql"
      />
    </div>
    <code-editor
      :value.sync="sparql"
      class="mt-6"
      line-numbers
      language="sparql"
    />
    <v-alert v-if="message" type="error">{{ message }}</v-alert>
  </div>
</template>

<script>
import { query } from '@/utils/sparql'
import { processError } from '@/utils/utils'

export default {
  props: {
    rdf: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sparql: '',
      message: '',
      status: false,
      error: false,
      progress: false
    }
  },
  computed: {
    disabled() {
      return !this.rdf || !this.sparql
    }
  },
  methods: {
    async runQuery() {
      try {
        this.message = ''
        this.error = false
        this.progress = true

        const bindings = await query(this.rdf, this.sparql)
        const keys = Array.from((bindings[0] || new Map()).keys())
        const headers = keys.map(k => k.substring(1))
        const items = bindings.map(map =>
          // map.get(k) returns an N3 Term
          // https://github.com/rdfjs/N3.js/blob/main/src/N3DataFactory.js
          Object.fromEntries(
            keys.map((key, index) => [headers[index], map.get(key).value])
          )
        )
        this.$emit('update', { headers, items })
      } catch (error) {
        console.error(error)
        this.error = true
        this.message = processError(error)
        this.$emit('update', { error })
      } finally {
        this.status = true
        this.progress = false
      }
    }
  }
}
</script>
