<template>
  <div>
    <VRow>
      <VCol align="center">
        <BaseButton
          v-bind="{ progress, status, error, disabled }"
          text="Run"
          icon="mdiStepForward"
          class="ma-sm-2"
          @click="runQuery"
        />
      </VCol>
    </VRow>
  </div>
</template>

<script>
import quadstore from '@/utils/sparql'

export default {
  props: {
    sparqlQuery: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      status: false,
      error: false,
      progress: false
    }
  },
  computed: {
    disabled() {
      return !this.sparqlQuery
    }
  },
  methods: {
    async runQuery() {
      try {
        this.error = false
        this.progress = true

        const results = await quadstore.select(this.sparqlQuery)
        this.$emit('update', results)
      } catch (error) {
        console.error(error)
        this.error = true
        this.$emit('update', { error })
      } finally {
        this.status = true
        this.progress = false
      }
    }
  }
}
</script>
