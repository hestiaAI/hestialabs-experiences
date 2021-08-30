<template>
  <div>
    <v-icon v-if="error" :right="right" color="red">{{ mdiAlert }}</v-icon>
    <v-icon v-else :right="right" color="green">{{ mdiCheckCircle }}</v-icon>
  </div>
</template>

<script>
import { mdiCheckCircle, mdiAlert } from '@mdi/js'

export default {
  props: {
    error: {
      type: Boolean,
      required: true
    },
    right: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mdiCheckCircle,
      mdiAlert
    }
  }
}
</script>
