<template>
  <div class="io-block">
    <div>
      <h2 class="my-3">Get Public Data</h2>
      <div class="d-flex flex-column flex-sm-row align-start">
        <base-button
          :progress="progressGet"
          :status="statusGet"
          :error="errorGet"
          text="Get Public RDF"
          icon="mdiStepForward"
          class="my-sm-2 mr-sm-2"
          @click="retrieveData"
        />
        <base-download-button
          extension="nq"
          :data="rdfPublic"
          :disabled="!rdfPublic"
          class="ma-sm-2"
        />
      </div>
      <comparator-selector
        class="my-sm-2 mr-sm-2"
        :items="example.sharing"
        :disabled="!example.sharing.length"
        @change="onChangeSelector"
      />
      <v-text-field
        v-if="oneToOne"
        v-model="username"
        label="Username"
        class="my-sm-2 mr-sm-2"
      ></v-text-field>
      <base-button
        :progress="progressCompare"
        :status="statusCompare"
        :error="errorCompare"
        :disabled="disabledCompare"
        text="Compare"
        icon="mdiStepForward"
        class="my-sm-2 mr-sm-2"
        @click="compareData"
      />
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
    },
    example: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      progressGet: false,
      statusGet: false,
      errorGet: false,
      progressCompare: false,
      statusCompare: false,
      errorCompare: false,
      headers: [],
      items: [],
      rdfPublic: '',
      username: '',
      comparator: '',
      oneToOne: false
    }
  },
  computed: {
    disabledCompare() {
      return !this.rdfPublic || !this.rdfLocal || this.progressGet
    }
  },
  methods: {
    async retrieveData() {
      this.progressGet = true
      this.errorGet = false
      try {
        this.rdfPublic = await queryEndpoint()
      } catch (error) {
        console.error(error)
        this.errorGet = true
      }
      this.statusGet = true
      this.progressGet = false
    },
    async compareData() {
      this.progressCompare = true
      this.errorCompare = false
      try {
        const [headers, items] = await comparators[this.comparator](
          this.rdfLocal,
          this.rdfPublic,
          this.username
        )
        this.headers = headers.map(h => ({ text: h, value: h }))
        this.items = items
      } catch (error) {
        console.error(error)
        this.errorCompare = true
      }
      this.statusCompare = true
      this.progressCompare = false
    },
    onChangeSelector(sharingObject) {
      this.comparator = sharingObject.comparator
      this.oneToOne = sharingObject.oneToOne
    }
  }
}
</script>
