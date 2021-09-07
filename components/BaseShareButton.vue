<template>
  <base-button
    v-bind="{ disabled, text, progress, status, error }"
    @click="share()"
  >
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
    text: {
      type: String,
      default: 'Share'
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
      return !this.data || this.progress
    }
  },
  methods: {
    async share() {
      this.status = false
      this.error = false
      this.progress = true
      try {
        await updateEndpoint(this.data)
      } catch (error) {
        this.error = true
      }
      this.progress = false
      this.status = true
    }
  }
}
</script>
