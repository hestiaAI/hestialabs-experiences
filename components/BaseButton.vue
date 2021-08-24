<template>
  <v-btn outlined v-bind="$attrs" class="my-2" @click="$emit('click', $event)">
    <slot name="prepend-icon"></slot>
    <slot>
      <span>{{ text }}</span>
    </slot>
    <template v-if="progress">
      <v-progress-circular class="ml-2" :size="14" :width="2" indeterminate />
    </template>
    <template v-else-if="status">
      <status-indicator :error="error" />
    </template>
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
