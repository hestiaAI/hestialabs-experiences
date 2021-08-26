<template>
  <v-btn outlined v-bind="$attrs" class="my-2" @click="$emit('click', $event)">
    <slot name="prepend-icon"></slot>
    <slot>
      <span>{{ text }}</span>
    </slot>
    <base-progress-circular v-if="progress" class="ml-2" />
    <status-indicator v-else-if="status" :error="error" />
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
    }
  }
}
</script>
