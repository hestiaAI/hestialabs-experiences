<template>
  <div class="io-block">
    <div>
      <h2 class="my-3">Get Public Data</h2>
      <div class="d-flex flex-column flex-sm-row align-start">
        <slot name="selector" :change="v => (comparator = v)" class="ma-sm-2" />
        <base-button
          :progress="progress[0]"
          :status="status[0]"
          :error="error[0]"
          :disabled="disabledGet"
          text="Get RDF"
          class="ma-sm-2"
          @click="retrieveData"
        />
        <base-button
          :progress="progress[1]"
          :status="status[1]"
          :error="error[1]"
          :disabled="disabledCompare"
          text="Compare"
          class="ma-sm-2"
          @click="compareData"
        />
        <base-download-button
          extension="nq"
          :data="rdfPublic"
          :disabled="!rdfPublic"
          class="ma-sm-2"
        />
      </div>
    </div>
    <div>
      <h2 class="my-3">Results</h2>
      <unit-query-results v-bind="{ headers, items }" />
    </div>
  </div>
</template>

<script>
import { queryEndpoint } from '@/utils/endpoint'
import comparators from '~/manifests/comparators'

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
      rdfPublic: '',
      comparator: ''
    }
  },
  computed: {
    disabledCompare() {
      return !this.rdfPublic || !this.rdfLocal
    },
    disabledGet() {
      return !this.comparator
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
    async compareData() {
      const i = 1
      this.status[i] = false
      this.error[i] = false
      this.progress[i] = true
      try {
        const [headers, items] = await comparators[this.comparator](
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
