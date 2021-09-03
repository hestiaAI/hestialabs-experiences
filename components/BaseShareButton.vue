<template>
  <base-button v-bind="{ disabled, text }" @click="share()">
    <template #prepend-icon>
      <v-icon left>$vuetify.icons.mdiShareVariant</v-icon>
    </template>
  </base-button>
</template>

<script>
import { updateEndpoint } from '~/utils/endpoint'

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
    }
  }
}
</script>
