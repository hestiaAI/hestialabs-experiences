<template>
  <VBtn
    v-bind="$attrs"
    class="my-2 base-button"
    @click="$emit('click', $event)"
  >
    <VProgressCircular v-if="progress" indeterminate width="2" size="20" />
    <VIcon v-else-if="mdiIcon" :left="text !== ''">
      {{ mdiIconResolved }}
    </VIcon>
    <slot>
      <span>{{ $tev(text, text) }}</span>
    </slot>
  </VBtn>
</template>

<script>
export default {
  name: 'BaseButton',
  inheritAttrs: false,
  props: {
    text: {
      type: String,
      default: ''
    },
    mdiIcon: {
      type: String,
      default: null
    },
    error: {
      type: Boolean,
      default: false
    },
    success: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    statusIcon() {
      if (this.error) {
        return 'mdiAlert'
      } else if (this.success) {
        return 'mdiCheckCircle'
      } else {
        return this.mdiIcon
      }
    },
    mdiIconResolved() {
      return this.$vuetify.icons.values[this.statusIcon]
    }
  }
}
</script>

<style scoped>
.v-btn {
  z-index: 4;
}
</style>
