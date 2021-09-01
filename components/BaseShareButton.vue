<template>
  <base-button v-bind="{ disabled, text }" @click="share()">
    <template #prepend-icon>
      <v-icon left>$vuetify.icons.mdiShareVariant</v-icon>
    </template>
  </base-button>
</template>

<script>
import {
  // eslint-disable-next-line no-unused-vars
  updateEndpoint,
  // eslint-disable-next-line no-unused-vars
  updateEndpointWhere,
  // eslint-disable-next-line no-unused-vars
  queryEndpoint
} from '~/utils/endpoint'
// updateEndpoint(
//   'INSERT DATA { <http://schema.org/Organization/%40Apple> <http://schema.org/name> "Apple" . }'
// )
// queryEndpoint('SELECT * WHERE { ?s ?p ?o } LIMIT 10')

export default {
  props: {
    data: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: 'Share'
    }
  },
  methods: {
    async share() {
      await updateEndpoint(this.data)
      // await updateEndpointWhere(
      //   'INSERT { ?s ?p ?o } WHERE { ?s ?p ?o }',
      //   this.data
      // )
    }
  }
}
</script>
