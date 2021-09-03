<template>
  <div>
    <h2 class="my-3">Get Public Data</h2>
    <div class="d-flex flex-column flex-sm-row align-start">
      <base-button
        v-bind="{ progress, status, error }"
        text="Get RDF"
        class="ma-sm-2"
        @click="retrieveData"
      />
      <base-download-button
        v-bind="{ disabled }"
        :data="rdfAgg"
        extension="nq"
        class="ma-sm-2"
      />
    </div>
  </div>
</template>

<script>
import { queryEndpoint } from '~/utils/endpoint'

export default {
  data() {
    return {
      status: false,
      error: false,
      progress: false,
      rdfAgg: ''
    }
  },
  computed: {
    disabled() {
      return !this.status || this.error
    }
  },
  methods: {
    async retrieveData() {
      this.status = false
      this.error = false
      this.progress = true
      try {
        const rdfAgg = await queryEndpoint()
        this.rdfAgg = rdfAgg
        this.$emit('update', { rdfAgg })
      } catch (error) {
        this.error = true
      }
      this.progress = false
      this.status = true
    }
  }
}
</script>
