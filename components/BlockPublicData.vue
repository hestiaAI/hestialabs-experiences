<template>
  <div class="io-block">
    <div>
      <h2 class="my-3">Get Public Data</h2>
      <div class="d-flex flex-column flex-sm-row align-start">
        <base-button
          :progress="progress[0]"
          :status="status[0]"
          :error="error[0]"
          text="Get RDF"
          class="ma-sm-2"
          @click="retrieveData"
        />
        <base-button
          :progress="progress[1]"
          :status="status[1]"
          :error="error[1]"
          :disabled="disabledRun"
          text="Run function"
          class="ma-sm-2"
          @click="computeCSV"
        />
      </div>
    </div>
    <div>
      <h2 class="my-3">Results</h2>
      <the-query-results-data-table
        v-bind="{ headers, items }"
        :hide-default-footer="!headers.length"
        :loading="false"
      />
    </div>
  </div>
</template>

<script>
import { queryEndpoint } from '@/utils/endpoint'
import { advertisersIntersection } from '@/utils/compare-rdf'

export default {
  props: {
    rdfLocal: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      progress: [false, false],
      status: [false, false],
      error: [false, false],
      headers: [],
      items: [],
      rdfPublic: ''
    }
  },
  computed: {
    disabledRun() {
      return !this.rdfPublic || !this.rdfLocal
    }
  },
  methods: {
    async retrieveData() {
      const i = 0
      this.status[i] = false
      this.error[i] = false
      this.progress[i] = true
      try {
        this.rdfPublic = await queryEndpoint()
      } catch (error) {
        console.error(error)
        this.error[i] = true
      }
      this.progress[i] = false
      this.status[i] = true
    },
    async computeCSV() {
      const i = 1
      this.status[i] = false
      this.error[i] = false
      this.progress[i] = true
      try {
        const [headers, items] = await advertisersIntersection(
          this.rdfLocal,
          this.rdfPublic
        )
        this.headers = headers.map(h => ({ text: h, value: h }))
        this.items = items
      } catch (error) {
        console.error(error)
        this.error[i] = true
      }
      this.progress[i] = false
      this.status[i] = true
    }
  }
}
</script>
