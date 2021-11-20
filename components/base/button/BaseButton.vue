<template>
  <v-btn outlined v-bind="$attrs" class="my-2" @click="$emit('click', $event)">
    <v-icon v-if="icon" left>{{ mdiIcon }}</v-icon>
    <slot>
      <span>{{ text }}</span>
    </slot>
    <BaseProgressCircular v-if="progress" class="ml-2" />
    <StatusIndicator v-else-if="status" :error="error" />
  </v-btn>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    progress: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    }
  },
  computed: {
    mdiIcon() {
      return this.$vuetify.icons.values[this.icon]
    }
  }
}
</script>
