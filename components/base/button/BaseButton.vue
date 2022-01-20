<template>
  <VBtn
    :outlined="outlined"
    :fixed="fixed"
    :right="right"
    :bottom="bottom"
    :top="top"
    :left="left"
    v-bind="$attrs"
    class="my-2"
    @click="$emit('click', $event)"
  >
    <VIcon v-if="icon" left>{{ mdiIcon }}</VIcon>
    <slot>
      <span>{{ text }}</span>
    </slot>
    <BaseProgressCircular v-if="progress" class="ml-2" />
    <StatusIndicator v-else-if="status" :error="error" />
  </VBtn>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    fixed: {
      type: Boolean,
      default: false
    },
    right: {
      type: Boolean,
      default: false
    },
    left: {
      type: Boolean,
      default: false
    },
    top: {
      type: Boolean,
      default: false
    },
    bottom: {
      type: Boolean,
      default: false
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
    },
    outlined: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    mdiIcon() {
      return this.$vuetify.icons.values[this.icon]
    }
  }
}
</script>
<style scoped>
.v-btn {
  z-index: 4;
}
</style>
