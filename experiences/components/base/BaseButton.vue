<template>
  <VBtn
    v-bind="$attrs"
    class="ma-2"
    @click="$emit('click', $event)"
  >
    <VProgressCircular v-if="progress" indeterminate width="2" size="20" class="mr-1" />
    <VIcon v-else-if="mdiIcon || error || success" :left="!!$slots.default">
      {{ mdiIconResolved }}
    </VIcon>
    <slot />
  </VBtn>
</template>

<script>
export default {
  name: 'BaseButton',
  inheritAttrs: false,
  props: {
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
